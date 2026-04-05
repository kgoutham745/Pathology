import mongoose from 'mongoose';

const reportTemplateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: true
  },
  templateName: {
    type: String,
    required: true
  },
  headerTitle: String,
  headerSubtitle: String,
  contactLine: String,
  footerText: String,
  logo: String,
  primaryColor: {
    type: String,
    default: '#0f3d5e'
  },
  accentColor: {
    type: String,
    default: '#14b8a6'
  }
}, { _id: false });

const labSettingsSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null
  },
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
  reportTemplates: {
    type: [reportTemplateSchema],
    default: []
  },
  defaultReportTemplateId: String,
  pdfTemplate: {
    type: String,
    enum: ['classic', 'modern', 'compact'],
    default: 'classic'
  },
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
