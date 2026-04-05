import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, Users, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { reportAPI, labAPI } from '../utils/api';
import useAuthStore from '../context/authStore';
import { Card, Button, Loading, Alert } from '../components/UIComponents';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [labSettings, setLabSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [reportsRes, settingsRes] = await Promise.all([
          reportAPI.getAll(),
          labAPI.getSettings()
        ]);

        setReports(reportsRes.data);
        setLabSettings(settingsRes.data);

        const totalReports = reportsRes.data.length;
        const abnormalReports = reportsRes.data.filter((report) =>
          report.results.some((result) => result.isAbnormal)
        ).length;

        setStats({
          totalReports,
          abnormalReports,
          normalReports: totalReports - abnormalReports,
          uniquePatients: new Set(reportsRes.data.map((report) => report.patient.patientId)).size
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role !== 'master') {
      refreshUser();
    }

    fetchData();
  }, [refreshUser, user?.role]);

  if (loading) return <Loading />;

  return (
    <div className='space-y-6'>
      <motion.div
        className='rounded-[28px] bg-[linear-gradient(135deg,#4c1d95,#312e81_55%,#5b21b6)] p-8 text-white shadow-[0_24px_60px_rgba(76,29,149,0.28)]'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className='mb-2 text-4xl font-bold'>Welcome Back</h1>
        <p className='text-violet-100/90'>
          {labSettings?.labName || 'Pathology Report Generator'} - Professional Medical Report System
        </p>
      </motion.div>

      {error && <Alert type='error' message={error} />}

      {user && user.role !== 'master' && (
        <Card className='border-l-4 border-violet-700'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-white'>
                <ShieldCheck size={18} />
                Account summary
              </div>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                {user.licenseStatus?.status === 'active' ? 'Active subscription' : 'Inactive subscription'} {user.license?.expiryType === 'date' || user.license?.expiryType === 'combined' ? '· Date validation enabled' : '· Usage-based access'}
              </p>
            </div>
            <Button variant='secondary' size='sm' onClick={refreshUser}>
              <RefreshCw size={16} /> Refresh status
            </Button>
          </div>
          <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='rounded-2xl bg-slate-50 p-4 dark:bg-slate-900'>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>Monthly reports</p>
              <p className='mt-2 text-2xl font-semibold'>{user.reportsThisMonth ?? 0}/{user.license?.monthlyReportLimit ?? 0}</p>
            </div>
            <div className='rounded-2xl bg-slate-50 p-4 dark:bg-slate-900'>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>Account status</p>
              <p className='mt-2 text-2xl font-semibold'>{user.active === false ? 'Paused' : 'Active'}</p>
            </div>
            <div className='rounded-2xl bg-slate-50 p-4 dark:bg-slate-900'>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>Valid until</p>
              <p className='mt-2 text-2xl font-semibold'>{user.license?.validUntil ? new Date(user.license.validUntil).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </Card>
      )}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[
          { icon: FileText, label: 'Total Reports', value: stats?.totalReports || 0, color: 'blue' },
          { icon: Users, label: 'Unique Patients', value: stats?.uniquePatients || 0, color: 'green' },
          { icon: AlertCircle, label: 'Abnormal Results', value: stats?.abnormalReports || 0, color: 'red' },
          { icon: BarChart3, label: 'Normal Results', value: stats?.normalReports || 0, color: 'purple' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-violet-700 to-indigo-800 shadow-lg',
            green: 'from-emerald-500 to-emerald-600 shadow-lg',
            red: 'from-amber-500 to-amber-600 shadow-lg',
            purple: 'from-fuchsia-600 to-violet-700 shadow-lg'
          };

          return (
            <motion.div
              key={idx}
              className={`rounded-lg bg-gradient-to-br p-6 text-white ${colorClasses[stat.color]}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm opacity-90'>{stat.label}</p>
                  <p className='mt-2 text-3xl font-bold'>{stat.value}</p>
                </div>
                <Icon size={32} className='opacity-50' />
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <h2 className='mb-4 text-2xl font-bold'>Recent Reports</h2>
        {reports.length === 0 ? (
          <p className='text-gray-500 dark:text-gray-400'>No reports generated yet. Start by creating a new report!</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='px-4 py-3 text-left font-bold'>Patient</th>
                  <th className='px-4 py-3 text-left font-bold'>Test Type</th>
                  <th className='px-4 py-3 text-left font-bold'>Report ID</th>
                  <th className='px-4 py-3 text-center font-bold'>Date</th>
                  <th className='px-4 py-3 text-center font-bold'>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map((report, idx) => {
                  const hasAbnormal = report.results.some((result) => result.isAbnormal);
                  return (
                    <motion.tr
                      key={report._id}
                      className='border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className='px-4 py-3 font-semibold'>{report.patient.name}</td>
                      <td className='px-4 py-3'>{report.test.testName}</td>
                      <td className='px-4 py-3 text-blue-600 dark:text-blue-400'>{report.reportId}</td>
                      <td className='px-4 py-3 text-center'>{new Date(report.dates.reportDate).toLocaleDateString()}</td>
                      <td className='px-4 py-3 text-center'>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            hasAbnormal
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}
                        >
                          {hasAbnormal ? 'Abnormal' : 'Normal'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className='mb-4 text-xl font-bold'>Quick Links</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {[
            { title: 'Generate New Report', description: 'Create a new pathology report for a patient', path: '/generate' },
            { title: 'View All Reports', description: 'Browse and manage existing reports', path: '/history' },
            { title: 'Lab Settings', description: 'Configure lab details and preferences', path: '/settings' }
          ].map((action, idx) => (
            <motion.a
              key={idx}
              href={action.path}
              className='cursor-pointer rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 p-4 transition-all hover:shadow-lg dark:from-gray-800 dark:to-gray-700'
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className='mb-1 font-bold text-gray-900 dark:text-white'>{action.title}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{action.description}</p>
            </motion.a>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
