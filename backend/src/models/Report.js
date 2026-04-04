import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  patient: {
    name: String,
    age: Number,
    gender: String,
    patientId: String,
    doctorName: String,
    contactNo: String,
    email: String
  },
  test: {
    testId: String,
    testName: String,
    testType: String
  },
  results: [{
    parameterId: String,
    parameterName: String,
    value: Number,
    unit: String,
    normalRange: String,
    isAbnormal: Boolean
  }],
  dates: {
    sampleCollectionDate: Date,
    reportDate: Date
  },
  labDetails: {
    labName: String,
    address: String,
    phone: String,
    email: String,
    logo: String
  },
  notes: String,
  signature: String,
  status: {
    type: String,
    enum: ['draft', 'completed', 'verified'],
    default: 'draft'
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

export default mongoose.model('Report', reportSchema);
