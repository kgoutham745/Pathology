import mongoose from 'mongoose';

const labSettingsSchema = new mongoose.Schema({
  labName: {
    type: String,
    required: true
  },
  address: String,
  phone: String,
  email: String,
  website: String,
  logo: String,
  footer: String,
  disclaimer: String,
  signature: String,
  reportFormat: {
    type: String,
    enum: ['standard', 'minimal', 'detailed'],
    default: 'standard'
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#2563eb'
    },
    secondaryColor: {
      type: String,
      default: '#10b981'
    }
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

export default mongoose.model('LabSettings', labSettingsSchema);
