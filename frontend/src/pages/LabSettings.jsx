import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Upload } from 'lucide-react';
import { labAPI } from '../utils/api';
import { Card, Button, Input, Textarea, Loading, Alert } from '../components/UIComponents';
import ReportDocument, { buildPreviewReportDocumentModel } from '../components/ReportDocument';

const defaultLogo = '/pathora-logo.svg';

const getPrimaryTemplate = (settings) =>
  settings?.reportTemplates?.find((template) => template.templateId === settings.defaultReportTemplateId)
  || settings?.reportTemplates?.[0]
  || null;

const buildSingleTemplate = (settings, logoPreview) => {
  const existingTemplate = getPrimaryTemplate(settings);
  const templateId = existingTemplate?.templateId || `brand_${Date.now()}`;

  return {
    templateId,
    templateName: 'Default Branding',
    headerTitle: settings.headerTitle || settings.labName || '',
    headerSubtitle: settings.headerSubtitle || '',
    contactLine: [settings.phone, settings.email, settings.website].filter(Boolean).join(' | '),
    footerText: settings.footer || '',
    logo: logoPreview || settings.logo || defaultLogo,
    primaryColor: '#4c1d95',
    accentColor: '#8b5cf6'
  };
};

const normalizeSettings = (data) => {
  const primaryTemplate = getPrimaryTemplate(data);

  return {
    ...data,
    headerTitle: primaryTemplate?.headerTitle || data.labName || '',
    headerSubtitle: primaryTemplate?.headerSubtitle || ''
  };
};

const LabSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await labAPI.getSettings();
        const normalized = normalizeSettings(response.data);
        setSettings(normalized);
        setLogoPreview(normalized.logo || getPrimaryTemplate(normalized)?.logo || defaultLogo);
      } catch (err) {
        setError('Failed to load lab settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const previewSettings = useMemo(() => {
    if (!settings) return null;
    const previewTemplate = buildSingleTemplate(settings, logoPreview);
    return {
      ...settings,
      reportTemplates: [previewTemplate],
      defaultReportTemplateId: previewTemplate.templateId
    };
  }, [logoPreview, settings]);

  const previewModel = useMemo(() => {
    if (!previewSettings) return null;
    return buildPreviewReportDocumentModel(previewSettings, logoPreview);
  }, [logoPreview, previewSettings]);

  const handleFieldChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setLogoPreview(loadEvent.target?.result || null);
      };
      reader.readAsDataURL(file);

      const response = await labAPI.uploadLogo(file);
      const normalized = normalizeSettings(response.data);
      setSettings(normalized);
      setLogoPreview(normalized.logo || getPrimaryTemplate(normalized)?.logo || defaultLogo);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload logo');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const nextTemplate = buildSingleTemplate(settings, logoPreview);
      const payload = {
        ...settings,
        logo: logoPreview || settings.logo || '',
        reportTemplates: [nextTemplate],
        defaultReportTemplateId: nextTemplate.templateId
      };

      const response = await labAPI.updateSettings(payload);
      const normalized = normalizeSettings(response.data);
      setSettings(normalized);
      setLogoPreview(normalized.logo || getPrimaryTemplate(normalized)?.logo || defaultLogo);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='space-y-6'>
      {error && <Alert type='error' message={error} />}
      {success && <Alert type='success' title='Success' message='Settings saved successfully!' />}

      <motion.div
        className='flex items-center gap-3'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SettingsIcon size={32} className='text-violet-700' />
        <div>
          <h1 className='text-3xl font-bold'>Lab Settings</h1>
          <p className='text-gray-600 dark:text-gray-400'>Brand your reports with content only. The visual style now stays consistent with the app.</p>
        </div>
      </motion.div>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-6'>
          <Card>
            <h2 className='mb-6 text-2xl font-bold'>Basic Details</h2>
            <div className='space-y-4'>
              <Input
                label='Lab Name'
                placeholder='e.g., ABC Diagnostic Lab'
                value={settings?.labName || ''}
                onChange={(e) => handleFieldChange('labName', e.target.value)}
              />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Input
                  label='Phone'
                  placeholder='+91 98765 43210'
                  value={settings?.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
                <Input
                  label='Email'
                  type='email'
                  placeholder='info@lab.com'
                  value={settings?.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
              <Textarea
                label='Address'
                placeholder='Full address of the laboratory'
                value={settings?.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                rows={3}
              />
              <Input
                label='Website'
                placeholder='https://www.labsite.com'
                value={settings?.website || ''}
                onChange={(e) => handleFieldChange('website', e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <h2 className='mb-6 text-2xl font-bold'>Report Branding</h2>
            <div className='space-y-4'>
              <Input
                label='Header Title'
                placeholder='Shown at the top of reports'
                value={settings?.headerTitle || ''}
                onChange={(e) => handleFieldChange('headerTitle', e.target.value)}
              />
              <Input
                label='Header Subtitle'
                placeholder='Short supporting line under the header'
                value={settings?.headerSubtitle || ''}
                onChange={(e) => handleFieldChange('headerSubtitle', e.target.value)}
              />
              <div className='rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4 text-sm text-violet-900'>
                The PDF now uses a fixed Pathora Labs visual system so exported reports always match the application design.
              </div>
            </div>
          </Card>

          <Card>
            <h2 className='mb-6 text-2xl font-bold'>Footer Content</h2>
            <div className='space-y-4'>
              <Textarea
                label='Footer Text'
                placeholder='Footer text to appear on all reports'
                value={settings?.footer || ''}
                onChange={(e) => handleFieldChange('footer', e.target.value)}
                rows={3}
              />
              <Textarea
                label='Disclaimer'
                placeholder='Disclaimer to appear on all reports'
                value={settings?.disclaimer || ''}
                onChange={(e) => handleFieldChange('disclaimer', e.target.value)}
                rows={3}
              />
            </div>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <h2 className='mb-6 text-2xl font-bold'>Lab Logo</h2>
            <div className='space-y-4'>
              <div className='rounded-3xl border border-dashed border-violet-200 bg-violet-50/70 p-6'>
                <img
                  src={logoPreview || defaultLogo}
                  alt='Lab Logo Preview'
                  className='max-h-32 max-w-xs rounded-lg object-contain'
                />
              </div>

              <label className='flex w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-violet-300 px-4 py-6 transition-colors hover:border-violet-500'>
                <div className='flex flex-col items-center'>
                  <Upload size={24} className='mb-2 text-violet-600' />
                  <span className='text-sm font-semibold'>Upload logo</span>
                </div>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleLogoUpload}
                  className='hidden'
                />
              </label>
            </div>
          </Card>

          <Card>
            <h2 className='mb-6 text-2xl font-bold'>Live Preview</h2>
            <div className='overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm'>
              <div className='overflow-x-auto bg-[linear-gradient(180deg,#ffffff,#f8f7ff)] p-4'>
                <div className='h-[472px] origin-top-left scale-[0.42] sm:h-[606px] sm:scale-[0.54] lg:h-[696px] lg:scale-[0.62]'>
                  {previewModel && <ReportDocument model={previewModel} />}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className='sticky bottom-6 flex justify-end'>
        <Button onClick={handleSave} variant='primary' size='lg' disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default LabSettings;
