import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Account from '../models/Account.js';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username === ADMIN_USERNAME) {
    let isValid = false;

    if (ADMIN_PASSWORD_HASH) {
      isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } else {
      isValid = password === ADMIN_PASSWORD;
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { role: 'master', username: ADMIN_USERNAME },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    return res.json({
      token,
      user: {
        role: 'master',
        username: ADMIN_USERNAME
      }
    });
  }

  try {
    const account = await Account.findOne({ email: username.toLowerCase() });
    if (!account || !account.active) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      {
        role: account.role,
        userId: account._id,
        email: account.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        role: account.role,
        email: account.email,
        name: account.name,
        companyName: account.companyName,
        license: account.license,
        active: account.active
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
