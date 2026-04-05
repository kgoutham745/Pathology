import bcrypt from 'bcrypt';
import Account from '../models/Account.js';
import { evaluateAccountAccess, getAccountUsage } from '../utils/license.js';

const SALT_ROUNDS = 10;

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().select('-passwordHash');
    const accountsWithUsage = await Promise.all(accounts.map(async (account) => {
      const usage = await getAccountUsage(account._id);
      return {
        ...account.toObject(),
        ...usage,
        licenseStatus: evaluateAccountAccess(account, usage)
      };
    }));
    res.json(accountsWithUsage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { name, email, companyName, phone, password, license } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await Account.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const account = new Account({
      name,
      email,
      companyName,
      phone,
      passwordHash,
      role: 'lab_technician',
      license: {
        templateLimit: license?.templateLimit ?? 10,
        monthlyReportLimit: license?.monthlyReportLimit ?? 50,
        validUntil: license?.validUntil ? new Date(license.validUntil) : undefined,
        expiryType: license?.expiryType || 'count',
        features: license?.features ?? { customTemplates: true, reportDesigner: false }
      }
    });

    await account.save();
    res.status(201).json({ ...account.toObject(), passwordHash: undefined });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentAccount = async (req, res) => {
  try {
    if (req.user.role === 'master') {
      return res.json({ role: 'master', username: req.user.username });
    }

    const account = await Account.findById(req.user.userId).select('-passwordHash');
    if (!account) return res.status(404).json({ error: 'Account not found' });

    const usage = await getAccountUsage(account._id);
    const licenseStatus = evaluateAccountAccess(account, usage);

    return res.json({
      ...account.toObject(),
      ...usage,
      licenseStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).select('-passwordHash');
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const existingAccount = await Account.findById(req.params.id);
    if (!existingAccount) return res.status(404).json({ error: 'Account not found' });

    const updateData = { ...req.body, updatedAt: new Date() };
    if (req.body.password) {
      updateData.passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
      delete updateData.password;
    }

    if (req.body.license) {
      updateData.license = {
        ...existingAccount.license.toObject(),
        ...req.body.license
      };
      if (req.body.license.validUntil) {
        updateData.license.validUntil = new Date(req.body.license.validUntil);
      } else if (req.body.license.validUntil === '') {
        updateData.license.validUntil = undefined;
      }
    }

    const account = await Account.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-passwordHash');
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id).select('-passwordHash');
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleAccountStatus = async (req, res) => {
  try {
    const { active } = req.body;
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { active, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash');

    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
