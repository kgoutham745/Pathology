import LabSettings from '../models/LabSettings.js';

export const getLabSettings = async (req, res) => {
  try {
    let settings = await LabSettings.findOne();
    
    if (!settings) {
      settings = new LabSettings({
        labName: 'ABC Diagnostic Lab',
        address: '123 Medical Center, Healthcare City',
        phone: '+1-800-MEDLAB',
        email: 'info@abclab.com',
        website: 'www.abclab.com',
        footer: 'This is an electronically generated report and does not require a signature.',
        disclaimer: 'The results provided are based on the samples submitted. For critical values, please contact the laboratory immediately.'
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLabSettings = async (req, res) => {
  try {
    const settings = await LabSettings.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const base64Logo = req.file.buffer.toString('base64');
    const logoDataUrl = `data:${req.file.mimetype};base64,${base64Logo}`;

    const settings = await LabSettings.findOneAndUpdate(
      {},
      { logo: logoDataUrl, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
