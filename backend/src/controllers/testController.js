import TestTemplate from '../models/TestTemplate.js';
import Account from '../models/Account.js';

export const getAllTests = async (req, res) => {
  try {
    const query = { active: true };
    if (req.user.role !== 'master') {
      query.createdBy = req.user.userId;
    }
    const tests = await TestTemplate.find(query);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = await TestTemplate.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    if (req.user.role !== 'master' && String(test.createdBy) !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTestByTestId = async (req, res) => {
  try {
    const query = { testId: req.params.testId };
    if (req.user.role !== 'master') {
      query.createdBy = req.user.userId;
    }
    const test = await TestTemplate.findOne(query);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTest = async (req, res) => {
  try {
    const { testId, testName, testType, parameters, sampleType, turnaroundTime, price } = req.body;

    if (req.user.role !== 'master') {
      const account = await Account.findById(req.user.userId);
      if (!account) return res.status(401).json({ error: 'Account not found' });

      const currentCount = await TestTemplate.countDocuments({ createdBy: account._id, active: true });
      if (currentCount >= account.license.templateLimit) {
        return res.status(403).json({ error: 'Template limit reached for this account.' });
      }
    }

    const newTest = new TestTemplate({
      createdBy: req.user.role === 'master' ? null : req.user.userId,
      testId,
      testName,
      testType,
      parameters,
      sampleType,
      turnaroundTime,
      price,
      active: true
    });

    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTest = async (req, res) => {
  try {
    const test = await TestTemplate.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    if (req.user.role !== 'master' && String(test.createdBy) !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await TestTemplate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await TestTemplate.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    if (req.user.role !== 'master' && String(test.createdBy) !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await TestTemplate.findByIdAndUpdate(
      req.params.id,
      { active: false, updatedAt: new Date() },
      { new: true }
    );
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
