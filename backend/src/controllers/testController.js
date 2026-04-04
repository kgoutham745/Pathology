import TestTemplate from '../models/TestTemplate.js';

export const getAllTests = async (req, res) => {
  try {
    const tests = await TestTemplate.find({ active: true });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = await TestTemplate.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTestByTestId = async (req, res) => {
  try {
    const test = await TestTemplate.findOne({ testId: req.params.testId });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTest = async (req, res) => {
  try {
    const { testId, testName, testType, parameters, sampleType, turnaroundTime, price } = req.body;
    
    const newTest = new TestTemplate({
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
    const test = await TestTemplate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await TestTemplate.findByIdAndUpdate(
      req.params.id,
      { active: false, updatedAt: new Date() },
      { new: true }
    );
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
