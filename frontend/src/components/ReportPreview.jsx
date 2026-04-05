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
      <Card className='p-5'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <h3 className='text-lg font-bold mb-2'>Patient Information</h3>
            <div className='space-y-2 break-words text-sm leading-6'>
              <p><span className='font-semibold'>Name:</span> {report.patient.name}</p>
              <p><span className='font-semibold'>Age:</span> {report.patient.age} years</p>
              <p><span className='font-semibold'>Gender:</span> {report.patient.gender}</p>
              <p><span className='font-semibold'>Patient ID:</span> {report.patient.patientId}</p>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-bold mb-2'>Test Information</h3>
            <div className='space-y-2 break-words text-sm leading-6'>
              <p><span className='font-semibold'>Report ID:</span> {report.reportId}</p>
              <p><span className='font-semibold'>Test:</span> {report.test.testName}</p>
              <p><span className='font-semibold'>Doctor:</span> {report.patient.doctorName}</p>
              <p><span className='font-semibold'>Report Date:</span> {new Date(report.dates.reportDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card className='p-5'>
        <h3 className='text-lg font-bold mb-4'>Test Results</h3>
        <div className='space-y-3'>
          {report.results.map((result, idx) => (
            <motion.div
              key={idx}
              className='rounded-2xl border border-slate-200 bg-slate-50 p-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div className='min-w-0'>
                  <p className='break-words font-semibold text-slate-900'>{result.parameterName}</p>
                  <div className='mt-2 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-3'>
                    <p><span className='font-medium text-slate-800'>Value:</span> {result.value}</p>
                    <p><span className='font-medium text-slate-800'>Unit:</span> {result.unit || '-'}</p>
                    <p className='break-words'><span className='font-medium text-slate-800'>Range:</span> {result.normalRange || '-'}</p>
                  </div>
                </div>
                <div className='shrink-0'>
                  <Badge isAbnormal={result.isAbnormal} abnormalType={result.abnormalType} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      {report.notes && (
        <Card className='p-5'>
          <h3 className='font-bold mb-2'>Clinical Notes</h3>
          <p className='break-words text-gray-700 dark:text-gray-300'>{report.notes}</p>
        </Card>
      )}
    </motion.div>
  );
};

export default ReportPreview;
