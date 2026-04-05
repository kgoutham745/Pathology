import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
  templateLimit: {
    type: Number,
    default: 10
  },
  monthlyReportLimit: {
    type: Number,
    default: 50
  },
  features: {
    type: Map,
    of: Boolean,
    default: {
      customTemplates: true,
      reportDesigner: false
    }
  }
}, { _id: false });

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  companyName: String,
  phone: String,
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer'],
    default: 'customer'
  },
  active: {
    type: Boolean,
    default: true
  },
  license: licenseSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Account', accountSchema);
