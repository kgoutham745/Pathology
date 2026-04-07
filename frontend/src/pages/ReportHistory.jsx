import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportAPI } from '../utils/api';
import { Card, Input, Loading, Alert, Button } from '../components/UIComponents';
import ReportCard from '../components/ReportCard';
import ReportPreview from '../components/ReportPreview';
import { Search, X } from 'lucide-react';

const ReportHistory = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await reportAPI.getAll();
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (err) {
        setError('Failed to load reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReports(reports);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = reports.filter((report) => {
        const reportDate = report.dates?.reportDate ? new Date(report.dates.reportDate).toLocaleDateString() : '';
        return (
          report.patient.name.toLowerCase().includes(query) ||
          report.patient.patientId.toLowerCase().includes(query) ||
          report.reportId.toLowerCase().includes(query) ||
          (report.patient.doctorName || '').toLowerCase().includes(query) ||
          (report.patient.contactNo || '').toLowerCase().includes(query) ||
          (report.test?.testName || '').toLowerCase().includes(query) ||
          (report.test?.testType || '').toLowerCase().includes(query) ||
          reportDate.toLowerCase().includes(query)
        );
      });
      setFilteredReports(filtered);
    }
  }, [searchQuery, reports]);

  const handleDeleteReport = async (reportId) => {
    try {
      await reportAPI.delete(reportId);
      setReports(reports.filter(r => r._id !== reportId));
      setSelectedReport(null);
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='space-y-6'>
      {error && <Alert type='error' message={error} />}

      {/* Header */}
      <motion.div
        className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className='text-3xl font-bold'>Report History</h1>
          <p className='text-gray-600 dark:text-gray-400'>Total: {filteredReports.length} reports</p>
        </div>

        <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
          <Button
            onClick={() => setViewMode('card')}
            variant={viewMode === 'card' ? 'primary' : 'secondary'}
            size='sm'
            className='w-full sm:w-auto'
          >
            Card View
          </Button>
          <Button
            onClick={() => setViewMode('table')}
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            size='sm'
            className='w-full sm:w-auto'
          >
            Table View
          </Button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-3 text-gray-400' size={20} />
        <Input
          placeholder='Search by patient name, doctor, report type, phone, ID or date...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Results */}
      {filteredReports.length === 0 ? (
        <Card>
          <div className='text-center py-12'>
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              {searchQuery ? 'No reports found matching your search.' : 'No reports generated yet.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]'>
          {/* Reports List */}
          <div className='min-w-0'>
            {viewMode === 'card' ? (
              <div className='space-y-4'>
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => setSelectedReport(report)}
                    className='cursor-pointer'
                  >
                    <ReportCard
                      report={report}
                      onDelete={handleDeleteReport}
                      onEdit={() => console.log('Edit not implemented yet')}
                      onView={() => setSelectedReport(report)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-gray-200 dark:border-gray-700'>
                        <th className='text-left py-3 px-4 font-bold'>Patient</th>
                        <th className='text-left py-3 px-4 font-bold'>Test</th>
                        <th className='text-left py-3 px-4 font-bold'>Report ID</th>
                        <th className='text-center py-3 px-4 font-bold'>Date</th>
                        <th className='text-center py-3 px-4 font-bold'>Abnormal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => {
                        const abnormalCount = report.results.filter(r => r.isAbnormal).length;
                        return (
                          <motion.tr
                            key={report._id}
                            onClick={() => setSelectedReport(report)}
                            className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                          >
                            <td className='py-3 px-4 font-semibold'>{report.patient.name}</td>
                            <td className='py-3 px-4'>{report.test.testName}</td>
                            <td className='py-3 px-4 text-blue-600 dark:text-blue-400'>{report.reportId}</td>
                            <td className='text-center py-3 px-4'>
                              {new Date(report.dates.reportDate).toLocaleDateString()}
                            </td>
                            <td className='text-center py-3 px-4'>
                              <span className={`font-bold ${abnormalCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {abnormalCount}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Report Preview */}
          <div className='min-w-0'>
            {selectedReport ? (
              <motion.div
                className='xl:sticky xl:top-24'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className='overflow-hidden p-4 sm:p-5'>
                  <div className='mb-4 flex items-center justify-between gap-3'>
                    <h3 className='font-bold text-lg'>Preview</h3>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <ReportPreview report={selectedReport} />
                </Card>
              </motion.div>
            ) : (
              <Card className='p-5'>
                <p className='text-center text-gray-500 dark:text-gray-400 py-8'>
                  Select a report to preview
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
