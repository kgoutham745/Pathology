import LabSettings from '../models/LabSettings.js';

const createDefaultBrandTemplate = (overrides = {}) => ({
  templateId: `brand_${Date.now()}`,
  templateName: 'Standard Corporate',
  headerTitle: overrides.labName || 'Apex Pathology Lab',
  headerSubtitle: 'Accurate diagnostics. Reliable turnaround.',
  contactLine: [overrides.phone, overrides.email, overrides.website].filter(Boolean).join(' | '),
  footerText: overrides.footer || 'This is a computer-generated medical report. Please correlate clinically.',
  logo: overrides.logo || '',
  primaryColor: overrides.theme?.primaryColor || '#0f3d5e',
  accentColor: overrides.theme?.secondaryColor || '#14b8a6'
});

const normalizeSettings = (settings) => {
  const plain = settings.toObject ? settings.toObject() : settings;
  const reportTemplates = plain.reportTemplates?.length
    ? plain.reportTemplates
    : [createDefaultBrandTemplate(plain)];

  const defaultReportTemplateId = plain.defaultReportTemplateId || reportTemplates[0].templateId;

  return {
    ...plain,
    reportTemplates,
    defaultReportTemplateId
  };
};

const getSettingsQuery = (req) => ({
  createdBy: req.user.role === 'master' ? null : req.user.userId
});

const getBaseDefaults = (req) => ({
  createdBy: req.user.role === 'master' ? null : req.user.userId,
  labName: 'Apex Pathology Lab',
  address: '123 Medical Center, Healthcare District',
  phone: '+91 98765 43210',
  email: 'support@apexpathology.com',
  website: 'www.apexpathology.com',
  footer: 'This is an electronically generated report and does not require a physical signature.',
  disclaimer: 'Results are based on the submitted specimen and should be correlated with clinical findings.',
  pdfTemplate: 'classic',
  reportFormat: 'standard',
  theme: {
    primaryColor: '#0f3d5e',
    secondaryColor: '#14b8a6'
  }
});

export const getLabSettings = async (req, res) => {
  try {
    const query = getSettingsQuery(req);
    let settings = await LabSettings.findOne(query);

    if (!settings) {
      const defaults = getBaseDefaults(req);
      const reportTemplates = [createDefaultBrandTemplate(defaults)];
      settings = new LabSettings({
        ...defaults,
        reportTemplates,
        defaultReportTemplateId: reportTemplates[0].templateId
      });
      await settings.save();
    } else if (!settings.reportTemplates?.length || !settings.defaultReportTemplateId) {
      const normalized = normalizeSettings(settings);
      settings = await LabSettings.findOneAndUpdate(
        query,
        {
          ...normalized,
          updatedAt: new Date()
        },
        { new: true }
      );
    }

    res.json(normalizeSettings(settings));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLabSettings = async (req, res) => {
  try {
    const query = getSettingsQuery(req);
    const defaults = getBaseDefaults(req);
    const incomingTemplates = req.body.reportTemplates?.length
      ? req.body.reportTemplates
      : undefined;

    const payload = {
      ...defaults,
      ...req.body,
      createdBy: defaults.createdBy,
      reportTemplates: incomingTemplates,
      updatedAt: new Date()
    };

    if (!payload.reportTemplates?.length) {
      payload.reportTemplates = [createDefaultBrandTemplate(payload)];
    }

    payload.defaultReportTemplateId = payload.defaultReportTemplateId || payload.reportTemplates[0].templateId;

    const settings = await LabSettings.findOneAndUpdate(
      query,
      payload,
      { new: true, upsert: true }
    );

    res.json(normalizeSettings(settings));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const query = getSettingsQuery(req);
    const existingSettings = await LabSettings.findOne(query);
    const defaults = existingSettings ? normalizeSettings(existingSettings) : getBaseDefaults(req);

    const base64Logo = req.file.buffer.toString('base64');
    const logoDataUrl = `data:${req.file.mimetype};base64,${base64Logo}`;

    const reportTemplates = (defaults.reportTemplates || [createDefaultBrandTemplate(defaults)]).map((template) => (
      template.templateId === defaults.defaultReportTemplateId
        ? { ...template, logo: logoDataUrl }
        : template
    ));

    const settings = await LabSettings.findOneAndUpdate(
      query,
      {
        ...defaults,
        logo: logoDataUrl,
        reportTemplates,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json(normalizeSettings(settings));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
