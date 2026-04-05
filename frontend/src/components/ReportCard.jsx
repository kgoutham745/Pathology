import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Trash2, Edit } from 'lucide-react';
import { generatePDFReport, downloadPDF } from '../utils/pdfGenerator';
import { labAPI } from '../utils/api';
import { Button, Modal, Alert } from './UIComponents';

const ReportCard = ({ report, onDelete, onEdit, onView }) => {
  const [labSettings, setLabSettings] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchLabSettings = async () => {
      try {
        const response = await labAPI.getSettings();
        setLabSettings(response.data);
      } catch (error) {
        console.error('Error fetching lab settings:', error);
      }
    };

    fetchLabSettings();
  }, []);

  const handleDownloadPDF = async () => {
    try {
      if (!labSettings) {
        console.error('Cannot generate PDF: lab settings not loaded');
        return;
      }

      const pdf = await generatePDFReport(report, labSettings);
      downloadPDF(pdf, `Report_${report.reportId}`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const abnormalCount = report.results.filter(r => r.isAbnormal).length;

  return (
    <>
      <motion.div
        className='bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 card-hover'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex justify-between items-start mb-4'>
          <div className='flex-1'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>{report.patient.name}</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Report ID: {report.reportId}</p>
          </div>
          <div className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full'>
            {report.test.testName}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Patient ID</p>
            <p className='font-semibold text-gray-900 dark:text-white'>{report.patient.patientId}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Age / Gender</p>
            <p className='font-semibold text-gray-900 dark:text-white'>{report.patient.age} / {report.patient.gender}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Report Date</p>
            <p className='font-semibold text-gray-900 dark:text-white'>
              {new Date(report.dates.reportDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Abnormal Values</p>
            <p className={`font-semibold ${abnormalCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {abnormalCount} / {report.results.length}
            </p>
          </div>
        </div>

        <div className='flex gap-3'>
          <Button
            onClick={() => onView(report)}
            variant='secondary'
            size='sm'
            className='flex-1 flex items-center justify-center gap-2'
          >
            <Eye size={16} /> View
          </Button>
          <Button
            onClick={() => onEdit(report)}
            variant='secondary'
            size='sm'
            className='flex-1 flex items-center justify-center gap-2'
          >
            <Edit size={16} /> Edit
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant='primary'
            size='sm'
            className='flex-1 flex items-center justify-center gap-2'
          >
            <Download size={16} /> PDF
          </Button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant='danger'
            size='sm'
            className='flex-1 flex items-center justify-center gap-2'
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </motion.div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title='Delete Report'
        size='sm'
      >
        <p className='mb-6 text-gray-700 dark:text-gray-300'>
          Are you sure you want to delete this report? This action cannot be undone.
        </p>
        <div className='flex gap-3'>
          <Button
            onClick={() => setShowDeleteConfirm(false)}
            variant='secondary'
            className='flex-1'
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDelete(report._id);
              setShowDeleteConfirm(false);
            }}
            variant='danger'
            className='flex-1'
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ReportCard;
