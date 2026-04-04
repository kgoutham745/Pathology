import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportAPI, labAPI } from '../utils/api';
import { Card, Button, Input, Select, Textarea, Loading, Alert } from '../components/UIComponents';
import { validatePatientInfo, validateTestResults, checkAbnormalValue } from '../utils/validators';
import { testTemplates } from '../data/testTemplates';

const ReportGenerator = () => {
  const [step, setStep] = useState(1);
  const [labSettings, setLabSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form States
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    patientId: '',
    doctorName: '',
    sampleCollectionDate: '',
    contactNo: '',
    email: ''
  });

  const [selectedTest, setSelectedTest] = useState('cbc');
  const [results, setResults] = useState([]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

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

  // Initialize results when test changes
  useEffect(() => {
    const test = testTemplates[selectedTest];
    if (test) {
      setResults(
        test.parameters.map((param) => ({
          parameterId: param.parameterId,
          parameterName: param.parameterName,
          value: '',
          unit: param.unit,
          normalRange: param.normalRange,
          isAbnormal: false
        }))
      );
    }
  }, [selectedTest]);

  const handlePatientChange = (field, value) => {
    setPatient(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleResultChange = (index, value) => {
    const newResults = [...results];
    newResults[index].value = value ? parseFloat(value) : '';
    newResults[index].isAbnormal = checkAbnormalValue(newResults[index].value, newResults[index].normalRange);
    setResults(newResults);
  };

  const handleNextStep = () => {
    if (step === 1) {
      const validationErrors = validatePatientInfo(patient);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    try {
      const resultErrors = validateTestResults(results);
      if (Object.keys(resultErrors).length > 0) {
        setErrors(resultErrors);
        return;
      }

      setLoading(true);
      setError(null);

      const test = testTemplates[selectedTest];
      const reportData = {
        patient,
        test: {
          testId: selectedTest,
          testName: test.testName,
          testType: test.testType
        },
        results,
        labDetails: labSettings || {},
        notes
      };

      const response = await reportAPI.create(reportData);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setStep(1);
        setPatient({
          name: '',
          age: '',
          gender: 'Male',
          patientId: '',
          doctorName: '',
          sampleCollectionDate: '',
          contactNo: '',
          email: ''
        });
        setNotes('');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to create report: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 3) return <Loading />;

  return (
    <div className='space-y-6'>
      {/* Progress Indicator */}
      <motion.div
        className='flex justify-between items-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[1, 2, 3].map((s) => (
          <div key={s} className='flex items-center flex-1'>
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                s <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
              animate={{ scale: s === step ? 1.1 : 1 }}
            >
              {s}
            </motion.div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${s < step ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Step Labels */}
      <div className='flex justify-between text-sm font-semibold'>
        <span className={step >= 1 ? 'text-blue-600' : 'text-gray-400'}>Patient Info</span>
        <span className={step >= 2 ? 'text-blue-600' : 'text-gray-400'}>Select Test</span>
        <span className={step >= 3 ? 'text-blue-600' : 'text-gray-400'}>Enter Results</span>
      </div>

      {error && <Alert type='error' message={error} />}
      {success && <Alert type='success' title='Success' message='Report generated successfully!' />}

      {/* Step 1: Patient Information */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <h2 className='text-2xl font-bold mb-6'>Patient Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Patient Name'
                placeholder='Enter patient name'
                value={patient.name}
                onChange={(e) => handlePatientChange('name', e.target.value)}
                error={errors.name}
                required
              />
              <Input
                label='Patient ID'
                placeholder='e.g., PAT-2024-001'
                value={patient.patientId}
                onChange={(e) => handlePatientChange('patientId', e.target.value)}
              />
              <Input
                label='Age'
                type='number'
                placeholder='Enter age'
                value={patient.age}
                onChange={(e) => handlePatientChange('age', e.target.value)}
                error={errors.age}
                required
              />
              <Select
                label='Gender'
                value={patient.gender}
                onChange={(e) => handlePatientChange('gender', e.target.value)}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
              <Input
                label='Referring Doctor'
                placeholder='Doctor name'
                value={patient.doctorName}
                onChange={(e) => handlePatientChange('doctorName', e.target.value)}
              />
              <Input
                label='Contact Number'
                placeholder='Phone number'
                value={patient.contactNo}
                onChange={(e) => handlePatientChange('contactNo', e.target.value)}
              />
              <Input
                label='Email'
                type='email'
                placeholder='Email address'
                value={patient.email}
                onChange={(e) => handlePatientChange('email', e.target.value)}
              />
              <Input
                label='Sample Collection Date'
                type='date'
                value={patient.sampleCollectionDate}
                onChange={(e) => handlePatientChange('sampleCollectionDate', e.target.value)}
                error={errors.sampleCollectionDate}
                required
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Select Test */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <h2 className='text-2xl font-bold mb-6'>Select Test Type</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(testTemplates).map(([key, test]) => (
                <motion.div
                  key={key}
                  onClick={() => setSelectedTest(key)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedTest === key
                      ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-600'
                      : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-blue-400'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className='font-bold text-lg'>{test.testName}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{test.testType}</p>
                  <p className='text-xs mt-2 text-gray-500'>{test.parameters.length} parameters</p>
                </motion.div>
              ))}
            </div>

            {/* Test Details */}
            <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg'>
              <h3 className='font-bold mb-2'>Selected Test Details</h3>
              <p><span className='font-semibold'>Test:</span> {testTemplates[selectedTest]?.testName}</p>
              <p><span className='font-semibold'>Type:</span> {testTemplates[selectedTest]?.testType}</p>
              <p><span className='font-semibold'>Sample:</span> {testTemplates[selectedTest]?.sampleType}</p>
              <p><span className='font-semibold'>Turnaround:</span> {testTemplates[selectedTest]?.turnaroundTime}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Enter Results */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
          <Card>
            <h2 className='text-2xl font-bold mb-6'>Enter Test Results</h2>
            <div className='space-y-4'>
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div>
                    <label className='text-sm font-semibold block mb-2'>{result.parameterName}</label>
                    <p className='text-xs text-gray-500'>{result.unit}</p>
                  </div>
                  <Input
                    placeholder='Enter value'
                    type='number'
                    value={result.value}
                    onChange={(e) => handleResultChange(index, e.target.value)}
                    error={errors[`result_${index}`]}
                  />
                  <div>
                    <label className='text-sm font-semibold block mb-2'>Normal Range</label>
                    <p className='text-sm'>{result.normalRange}</p>
                  </div>
                  <div className='flex items-end'>
                    {result.value && (
                      <span className={`px-3 py-2 rounded-full text-xs font-bold ${
                        result.isAbnormal
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {result.isAbnormal ? 'HIGH' : 'NORMAL'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className='text-lg font-bold mb-4'>Additional Notes</h2>
            <Textarea
              placeholder='Add any clinical notes or observations'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className='flex gap-4 justify-end'>
        {step > 1 && (
          <Button
            onClick={() => setStep(step - 1)}
            variant='secondary'
            size='lg'
          >
            Previous
          </Button>
        )}
        {step < 3 && (
          <Button
            onClick={handleNextStep}
            variant='primary'
            size='lg'
          >
            Next
          </Button>
        )}
        {step === 3 && (
          <Button
            onClick={handleSubmit}
            variant='success'
            size='lg'
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
