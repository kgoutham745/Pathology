import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportAPI, labAPI } from '../utils/api';
import { Card, Loading, Alert } from '../components/UIComponents';
import { BarChart3, FileText, Users, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [labSettings, setLabSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const reportsRes = await reportAPI.getAll();
        const settingsRes = await labAPI.getSettings();

        setReports(reportsRes.data);
        setLabSettings(settingsRes.data);

        // Calculate stats
        const totalReports = reportsRes.data.length;
        const abnormalReports = reportsRes.data.filter(r =>
          r.results.some(res => res.isAbnormal)
        ).length;

        setStats({
          totalReports,
          abnormalReports,
          normalReports: totalReports - abnormalReports,
          uniquePatients: new Set(reportsRes.data.map(r => r.patient.patientId)).size
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className='space-y-6'>
      {/* Welcome Banner */}
      <motion.div
        className='bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className='text-4xl font-bold mb-2'>Welcome! 🧪</h1>
        <p className='text-blue-100'>
          {labSettings?.labName || 'Pathology Report Generator'} - Professional Medical Report System
        </p>
      </motion.div>

      {error && <Alert type='error' message={error} />}

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[
          {
            icon: FileText,
            label: 'Total Reports',
            value: stats?.totalReports || 0,
            color: 'blue'
          },
          {
            icon: Users,
            label: 'Unique Patients',
            value: stats?.uniquePatients || 0,
            color: 'green'
          },
          {
            icon: AlertCircle,
            label: 'Abnormal Results',
            value: stats?.abnormalReports || 0,
            color: 'red'
          },
          {
            icon: BarChart3,
            label: 'Normal Results',
            value: stats?.normalReports || 0,
            color: 'purple'
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600 shadow-lg',
            green: 'from-green-500 to-green-600 shadow-lg',
            red: 'from-red-500 to-red-600 shadow-lg',
            purple: 'from-purple-500 to-purple-600 shadow-lg'
          };

          return (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${colorClasses[stat.color]} text-white rounded-lg p-6`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className='flex justify-between items-start'>
                <div>
                  <p className='opacity-90 text-sm'>{stat.label}</p>
                  <p className='text-3xl font-bold mt-2'>{stat.value}</p>
                </div>
                <Icon size={32} className='opacity-50' />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <h2 className='text-2xl font-bold mb-4'>Recent Reports</h2>
        {reports.length === 0 ? (
          <p className='text-gray-500 dark:text-gray-400'>No reports generated yet. Start by creating a new report!</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='text-left py-3 px-4 font-bold'>Patient</th>
                  <th className='text-left py-3 px-4 font-bold'>Test Type</th>
                  <th className='text-left py-3 px-4 font-bold'>Report ID</th>
                  <th className='text-center py-3 px-4 font-bold'>Date</th>
                  <th className='text-center py-3 px-4 font-bold'>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map((report, idx) => {
                  const hasAbnormal = report.results.some(r => r.isAbnormal);
                  return (
                    <motion.tr
                      key={report._id}
                      className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className='py-3 px-4 font-semibold'>{report.patient.name}</td>
                      <td className='py-3 px-4'>{report.test.testName}</td>
                      <td className='py-3 px-4 text-blue-600 dark:text-blue-400'>{report.reportId}</td>
                      <td className='text-center py-3 px-4'>
                        {new Date(report.dates.reportDate).toLocaleDateString()}
                      </td>
                      <td className='text-center py-3 px-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

      {/* Quick Actions */}
      <Card>
        <h2 className='text-xl font-bold mb-4'>Quick Links</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[
            {
              title: 'Generate New Report',
              description: 'Create a new pathology report for a patient',
              path: '/generate'
            },
            {
              title: 'View All Reports',
              description: 'Browse and manage existing reports',
              path: '/history'
            },
            {
              title: 'Lab Settings',
              description: 'Configure lab details and preferences',
              path: '/settings'
            }
          ].map((action, idx) => (
            <motion.a
              key={idx}
              href={action.path}
              className='p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-lg transition-all cursor-pointer'
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className='font-bold text-gray-900 dark:text-white mb-1'>{action.title}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>{action.description}</p>
            </motion.a>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
