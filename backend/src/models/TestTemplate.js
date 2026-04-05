import mongoose from 'mongoose';

const testTemplateSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  testId: {
    type: String,
    unique: true,
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    required: true
  },
  description: String,
  parameters: [{
    parameterId: String,
    parameterName: String,
    unit: String,
    normalRangeMin: Number,
    normalRangeMax: Number,
    normalRange: String,
    description: String
  }],
  sampleType: String,
  turnaroundTime: String,
  price: Number,
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('TestTemplate', testTemplateSchema);
