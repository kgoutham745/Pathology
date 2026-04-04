import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { labAPI } from '../utils/api';
import { Card, Button, Input, Textarea, Loading, Alert } from '../components/UIComponents';
import { Settings as SettingsIcon, Upload } from 'lucide-react';

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
        setSettings(response.data);
        if (response.data.logo) {
          setLogoPreview(response.data.logo);
        }
      } catch (err) {
        setError('Failed to load lab settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleFieldChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThemeChange = (color, value) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [color]: value
      }
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result);
      };
      reader.readAsDataURL(file);

      // Upload file
      const response = await labAPI.uploadLogo(file);
      setSettings(response.data);
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

      const response = await labAPI.updateSettings(settings);
      setSettings(response.data);
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
    <div className='space-y-6 max-w-4xl'>
      {error && <Alert type='error' message={error} />}
      {success && <Alert type='success' title='Success' message='Settings saved successfully!' />}

      {/* Header */}
      <motion.div
        className='flex items-center gap-3'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SettingsIcon size={32} className='text-blue-600' />
        <div>
          <h1 className='text-3xl font-bold'>Lab Settings</h1>
          <p className='text-gray-600 dark:text-gray-400'>Configure your laboratory details</p>
        </div>
      </motion.div>

      {/* Lab Information */}
      <Card>
        <h2 className='text-2xl font-bold mb-6'>Lab Information</h2>
        <div className='space-y-4'>
          <Input
            label='Lab Name'
            placeholder='e.g., ABC Diagnostic Lab'
            value={settings?.labName || ''}
            onChange={(e) => handleFieldChange('labName', e.target.value)}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Phone'
              placeholder='+1-800-MEDLAB'
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

      {/* Logo Upload */}
      <Card>
        <h2 className='text-2xl font-bold mb-6'>Lab Logo</h2>
        <div className='space-y-4'>
          {logoPreview && (
            <div className='mb-4'>
              <img
                src={logoPreview}
                alt='Lab Logo Preview'
                className='max-w-xs max-h-32 rounded-lg'
              />
            </div>
          )}
          <label className='flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors'>
            <div className='flex flex-col items-center'>
              <Upload size={24} className='text-blue-600 mb-2' />
              <span className='text-sm font-semibold'>Click to upload logo or drag and drop</span>
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

      {/* Theme Settings */}
      <Card>
        <h2 className='text-2xl font-bold mb-6'>Theme Colors</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-semibold mb-2'>Primary Color</label>
            <div className='flex items-center gap-3'>
              <input
                type='color'
                value={settings?.theme?.primaryColor || '#2563eb'}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className='w-16 h-10 rounded cursor-pointer'
              />
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {settings?.theme?.primaryColor}
              </span>
            </div>
          </div>
          <div>
            <label className='block text-sm font-semibold mb-2'>Secondary Color</label>
            <div className='flex items-center gap-3'>
              <input
                type='color'
                value={settings?.theme?.secondaryColor || '#10b981'}
                onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                className='w-16 h-10 rounded cursor-pointer'
              />
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {settings?.theme?.secondaryColor}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Footer & Disclaimer */}
      <Card>
        <h2 className='text-2xl font-bold mb-6'>Report Footer</h2>
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

      {/* Report Format */}
      <Card>
        <h2 className='text-2xl font-bold mb-6'>Report Format</h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold mb-2'>Report Layout</label>
            <select
              value={settings?.reportFormat || 'standard'}
              onChange={(e) => handleFieldChange('reportFormat', e.target.value)}
              className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            >
              <option value='standard'>Standard</option>
              <option value='minimal'>Minimal</option>
              <option value='detailed'>Detailed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className='flex gap-3 justify-end sticky bottom-6'>
        <Button
          onClick={handleSave}
          variant='primary'
          size='lg'
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default LabSettings;
