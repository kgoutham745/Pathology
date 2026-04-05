import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../utils/api';
import { Card, Button, Input, Textarea, Select, Alert, Loading } from '../components/UIComponents';
import { Plus, Edit, Trash2, PauseCircle, PlayCircle } from 'lucide-react';

const defaultForm = {
  name: '',
  email: '',
  companyName: '',
  phone: '',
  password: '',
  license: {
    templateLimit: 10,
    monthlyReportLimit: 50,
    features: {
      customTemplates: true,
      reportDesigner: false
    }
  }
};

const AdminPanel = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAccounts();
      setAccounts(response.data);
    } catch (err) {
      setError('Unable to load customer accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const resetForm = () => {
    setSelectedAccount(null);
    setForm(defaultForm);
    setError(null);
  };

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLicenseChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      license: {
        ...prev.license,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      if (selectedAccount) {
        const payload = { ...form };
        if (!payload.password) {
          delete payload.password;
        }
        await adminAPI.updateAccount(selectedAccount._id, payload);
        setSuccess('Account updated successfully.');
      } else {
        if (!form.name || !form.email || !form.password) {
          setError('Name, email and password are required for new accounts.');
          return;
        }
        await adminAPI.createAccount(form);
        setSuccess('Customer account created successfully.');
      }
      resetForm();
      await fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save account.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setForm({
      name: account.name || '',
      email: account.email || '',
      companyName: account.companyName || '',
      phone: account.phone || '',
      password: '',
      license: {
        templateLimit: account.license?.templateLimit ?? 10,
        monthlyReportLimit: account.license?.monthlyReportLimit ?? 50,
        features: {
          customTemplates: account.license?.features?.customTemplates ?? true,
          reportDesigner: account.license?.features?.reportDesigner ?? false
        }
      }
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm('Delete this account permanently?')) return;
    try {
      await adminAPI.deleteAccount(accountId);
      setSuccess('Account deleted successfully.');
      await fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to delete account.');
    }
  };

  const handleToggleStatus = async (account) => {
    try {
      await adminAPI.toggleAccountStatus(account._id, !account.active);
      await fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update account status.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='space-y-6'>
      {error && <Alert type='error' message={error} />}
      {success && <Alert type='success' message={success} />}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-3xl font-bold'>Master Admin</h1>
              <p className='text-gray-600 dark:text-gray-400'>Manage customer licenses and account access.</p>
            </div>
            <div className='text-blue-500'>
              <Plus size={28} />
            </div>
          </div>

          <div className='space-y-4'>
            <Input
              label='Name'
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              required
            />
            <Input
              label='Email'
              type='email'
              value={form.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              required={!selectedAccount}
            />
            <Input
              label='Company'
              value={form.companyName}
              onChange={(e) => handleFieldChange('companyName', e.target.value)}
            />
            <Input
              label='Phone'
              value={form.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
            <Input
              label='Password'
              type='password'
              value={form.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              required={!selectedAccount}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Template Limit'
                type='number'
                value={form.license.templateLimit}
                onChange={(e) => handleLicenseChange('templateLimit', Number(e.target.value))}
              />
              <Input
                label='Monthly Report Limit'
                type='number'
                value={form.license.monthlyReportLimit}
                onChange={(e) => handleLicenseChange('monthlyReportLimit', Number(e.target.value))}
              />
            </div>
            <div className='flex gap-4'>
              <Button variant='primary' size='lg' onClick={handleSubmit} disabled={saving}>
                {selectedAccount ? 'Update Account' : 'Create Account'}
              </Button>
              <Button variant='secondary' size='lg' onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <div className='lg:col-span-2'>
          <Card>
            <h2 className='text-2xl font-bold mb-4'>Customer Accounts</h2>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-200 dark:border-gray-700'>
                    <th className='text-left py-3 px-4 font-bold'>Name</th>
                    <th className='text-left py-3 px-4 font-bold'>Email</th>
                    <th className='text-left py-3 px-4 font-bold'>License</th>
                    <th className='text-left py-3 px-4 font-bold'>Usage</th>
                    <th className='text-left py-3 px-4 font-bold'>Status</th>
                    <th className='text-left py-3 px-4 font-bold'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account._id} className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'>
                      <td className='py-3 px-4 font-semibold'>{account.name}</td>
                      <td className='py-3 px-4'>{account.email}</td>
                      <td className='py-3 px-4'>
                        Templates: {account.license?.templateLimit || 0} <br />
                        Reports/mo: {account.license?.monthlyReportLimit || 0}
                      </td>
                      <td className='py-3 px-4'>
                        Created: {account.templatesCount ?? 0} <br />
                        This month: {account.reportsThisMonth ?? 0}
                      </td>
                      <td className='py-3 px-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${account.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {account.active ? 'Active' : 'Paused'}
                        </span>
                      </td>
                      <td className='py-3 px-4 space-x-2'>
                        <Button variant='secondary' size='sm' onClick={() => handleEdit(account)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant='danger' size='sm' onClick={() => handleDelete(account._id)}>
                          <Trash2 size={16} />
                        </Button>
                        <Button
                          variant={account.active ? 'warning' : 'success'}
                          size='sm'
                          onClick={() => handleToggleStatus(account)}
                        >
                          {account.active ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
