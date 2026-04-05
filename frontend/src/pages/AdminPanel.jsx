import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, PauseCircle, PlayCircle, ShieldCheck, Users } from 'lucide-react';
import { adminAPI } from '../utils/api';
import { Card, Button, Input, Select, Alert, Loading } from '../components/UIComponents';

const defaultForm = {
  name: '',
  email: '',
  companyName: '',
  phone: '',
  password: '',
  license: {
    monthlyReportLimit: 50,
    expiryType: 'count',
    validUntil: '',
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
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLicenseChange = (field, value) => {
    setForm((prev) => ({
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
        monthlyReportLimit: account.license?.monthlyReportLimit ?? 50,
        expiryType: account.license?.expiryType || 'count',
        validUntil: account.license?.validUntil ? new Date(account.license.validUntil).toISOString().slice(0, 10) : '',
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

  const getAccountWarnings = (account) => {
    const warnings = [];
    const now = new Date();
    const validUntil = account.license?.validUntil ? new Date(account.license.validUntil) : null;

    if (validUntil) {
      const daysLeft = Math.ceil((validUntil - now) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) warnings.push('License expired');
      else if (daysLeft <= 7) warnings.push('Expiring soon');
    }

    const reportLimit = account.license?.monthlyReportLimit ?? 0;
    if (reportLimit > 0) {
      if ((account.reportsThisMonth ?? 0) >= reportLimit) warnings.push('Monthly cap reached');
      else if ((account.reportsThisMonth ?? 0) >= Math.max(reportLimit * 0.8, 1)) warnings.push('Near monthly limit');
    }

    return warnings;
  };

  if (loading) return <Loading />;

  return (
    <div className='space-y-6'>
      {error && <Alert type='error' message={error} />}
      {success && <Alert type='success' message={success} />}

      <motion.div
        className='flex flex-col gap-4 rounded-[28px] bg-[linear-gradient(135deg,#4c1d95,#312e81_60%,#1e1b4b)] p-7 text-white shadow-[0_24px_60px_rgba(76,29,149,0.24)] md:flex-row md:items-center md:justify-between'
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-100'>
            <ShieldCheck size={14} />
            Master Admin
          </div>
          <h1 className='mt-4 text-3xl font-bold'>Manage Lab Accounts</h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-violet-100/85'>Review all customer accounts first, then create or update records in the form below.</p>
        </div>
        <div className='inline-flex items-center gap-3 rounded-3xl bg-white/10 px-5 py-4 text-sm'>
          <Users size={18} />
          <span>{accounts.length} customer accounts loaded</span>
        </div>
      </motion.div>

      <Card className='p-7'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-slate-900'>Customer Accounts</h2>
          <p className='mt-1 text-sm text-slate-600'>Table view keeps the account list easier to scan and compare.</p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[920px] text-sm'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='px-4 py-3 text-left font-bold'>Name</th>
                <th className='px-4 py-3 text-left font-bold'>Email</th>
                <th className='px-4 py-3 text-left font-bold'>Company</th>
                <th className='px-4 py-3 text-left font-bold'>License</th>
                <th className='px-4 py-3 text-left font-bold'>Valid Until</th>
                <th className='px-4 py-3 text-left font-bold'>Usage</th>
                <th className='px-4 py-3 text-left font-bold'>Status</th>
                <th className='px-4 py-3 text-left font-bold'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='px-4 py-4 font-semibold text-slate-900'>{account.name}</td>
                  <td className='px-4 py-4 text-slate-600'>{account.email}</td>
                  <td className='px-4 py-4 text-slate-600'>{account.companyName || '-'}</td>
                  <td className='px-4 py-4 text-slate-600'>
                    Reports/mo: {account.license?.monthlyReportLimit || 0}
                    <br />
                    Type: {account.license?.expiryType || 'count'}
                  </td>
                  <td className='px-4 py-4 text-slate-600'>
                    {account.license?.validUntil ? new Date(account.license.validUntil).toLocaleDateString() : '-'}
                  </td>
                  <td className='px-4 py-4 text-slate-600'>
                    This month: {account.reportsThisMonth ?? 0}
                  </td>
                  <td className='px-4 py-4'>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${account.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {account.active ? 'Active' : 'Paused'}
                    </span>
                    {getAccountWarnings(account).length > 0 && (
                      <p className='mt-2 text-xs text-amber-700'>{getAccountWarnings(account).join(' · ')}</p>
                    )}
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='secondary' size='sm' onClick={() => handleEdit(account)}><Edit size={16} /> Edit</Button>
                      <Button variant='danger' size='sm' onClick={() => handleDelete(account._id)}><Trash2 size={16} /></Button>
                      <Button variant={account.active ? 'warning' : 'success'} size='sm' onClick={() => handleToggleStatus(account)}>
                        {account.active ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className='p-7'>
        <div className='mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900'>{selectedAccount ? 'Edit Account' : 'Create Account'}</h2>
            <p className='mt-1 text-sm text-slate-600'>Create a new user or update the selected one below the accounts table.</p>
          </div>
          <div className='flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-100 text-violet-700'>
            <Plus size={24} />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Input label='Name' value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} required />
          <Input label='Email' type='email' value={form.email} onChange={(e) => handleFieldChange('email', e.target.value)} required={!selectedAccount} />
          <Input label='Company' value={form.companyName} onChange={(e) => handleFieldChange('companyName', e.target.value)} />
          <Input label='Phone' value={form.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
          <Input label='Password' type='password' value={form.password} onChange={(e) => handleFieldChange('password', e.target.value)} required={!selectedAccount} />
          <Input
            label='Monthly Report Limit'
            type='number'
            value={form.license.monthlyReportLimit}
            onChange={(e) => handleLicenseChange('monthlyReportLimit', Number(e.target.value))}
          />
          <Select
            label='License Type'
            value={form.license.expiryType}
            onChange={(e) => handleLicenseChange('expiryType', e.target.value)}
            options={[
              { label: 'Count based', value: 'count' },
              { label: 'Date based', value: 'date' },
              { label: 'Combined', value: 'combined' }
            ]}
          />
          <Input
            label='Valid Until'
            type='date'
            value={form.license.validUntil}
            onChange={(e) => handleLicenseChange('validUntil', e.target.value)}
          />
        </div>

        <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
          <Button variant='primary' size='lg' onClick={handleSubmit} disabled={saving} className='w-full sm:w-auto'>
            {selectedAccount ? 'Update Account' : 'Create Account'}
          </Button>
          <Button variant='secondary' size='lg' onClick={resetForm} className='w-full sm:w-auto'>
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;
