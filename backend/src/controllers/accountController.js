import bcrypt from 'bcrypt';
import Account from '../models/Account.js';
import Report from '../models/Report.js';
import TestTemplate from '../models/TestTemplate.js';

const SALT_ROUNDS = 10;

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().select('-passwordHash');
    const accountsWithUsage = await Promise.all(accounts.map(async (account) => {
      const templatesCount = await TestTemplate.countDocuments({ createdBy: account._id, active: true });
      const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const reportsThisMonth = await Report.countDocuments({ createdBy: account._id, 'dates.reportDate': { $gte: currentMonthStart } });
      return {
        ...account.toObject(),
        templatesCount,
        reportsThisMonth
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
      license: {
        templateLimit: license?.templateLimit ?? 10,
        monthlyReportLimit: license?.monthlyReportLimit ?? 50,
        features: license?.features ?? { customTemplates: true, reportDesigner: false }
      }
    });

    await account.save();
    res.status(201).json({ ...account.toObject(), passwordHash: undefined });
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
    const updateData = { ...req.body, updatedAt: new Date() };
    if (req.body.password) {
      updateData.passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
      delete updateData.password;
    }
    const account = await Account.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-passwordHash');
    if (!account) return res.status(404).json({ error: 'Account not found' });
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
