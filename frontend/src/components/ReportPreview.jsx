import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge } from './UIComponents';

const ReportPreview = ({ report }) => {
  if (!report) return null;

  return (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <h3 className='text-lg font-bold mb-2'>Patient Information</h3>
            <div className='space-y-2 text-sm'>
              <p><span className='font-semibold'>Name:</span> {report.patient.name}</p>
              <p><span className='font-semibold'>Age:</span> {report.patient.age} years</p>
              <p><span className='font-semibold'>Gender:</span> {report.patient.gender}</p>
              <p><span className='font-semibold'>Patient ID:</span> {report.patient.patientId}</p>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-bold mb-2'>Test Information</h3>
            <div className='space-y-2 text-sm'>
              <p><span className='font-semibold'>Report ID:</span> {report.reportId}</p>
              <p><span className='font-semibold'>Test:</span> {report.test.testName}</p>
              <p><span className='font-semibold'>Doctor:</span> {report.patient.doctorName}</p>
              <p><span className='font-semibold'>Report Date:</span> {new Date(report.dates.reportDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <h3 className='text-lg font-bold mb-4'>Test Results</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-700'>
                <th className='text-left py-3 px-2 font-bold'>Parameter</th>
                <th className='text-center py-3 px-2 font-bold'>Value</th>
                <th className='text-center py-3 px-2 font-bold'>Unit</th>
                <th className='text-center py-3 px-2 font-bold'>Normal Range</th>
                <th className='text-center py-3 px-2 font-bold'>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.results.map((result, idx) => (
                <motion.tr
                  key={idx}
                  className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className='py-3 px-2'>{result.parameterName}</td>
                  <td className='text-center py-3 px-2 font-semibold text-blue-600 dark:text-blue-400'>
                    {result.value}
                  </td>
                  <td className='text-center py-3 px-2'>{result.unit}</td>
                  <td className='text-center py-3 px-2 text-sm'>{result.normalRange}</td>
                  <td className='text-center py-3 px-2'>
                    <Badge isAbnormal={result.isAbnormal} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notes */}
      {report.notes && (
        <Card>
          <h3 className='font-bold mb-2'>Clinical Notes</h3>
          <p className='text-gray-700 dark:text-gray-300'>{report.notes}</p>
        </Card>
      )}
    </motion.div>
  );
};

export default ReportPreview;
