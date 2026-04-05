import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportAPI, labAPI, testAPI } from '../utils/api';
import { Card, Button, Input, Select, Textarea, Loading, Alert } from '../components/UIComponents';
import { generatePDFReport, downloadPDF } from '../utils/pdfGenerator';
import { validatePatientInfo, validateTestResults, checkAbnormalValue, getAbnormalStatus, getAbnormalLabel, getAbnormalCause } from '../utils/validators';
import { testTemplates } from '../data/testTemplates';

const ReportGenerator = () => {
  const [step, setStep] = useState(1);
  const [labSettings, setLabSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

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
  const [availableTests, setAvailableTests] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [selectingTemplate, setSelectingTemplate] = useState(false);
  const [customParameters, setCustomParameters] = useState([]);

  useEffect(() => {
    const fetchLabSettings = async () => {
      try {
        const response = await labAPI.getSettings();
        setLabSettings(response.data);
      } catch (error) {
        console.error('Error fetching lab settings:', error);
      }
    };

    const fetchTemplates = async () => {
      try {
        setTemplatesLoading(true);
        const response = await testAPI.getAll();
        setAvailableTests(response.data);
        if (response.data.length > 0) {
          setSelectedTest(response.data[0].testId);
        } else {
          // No tests in database, use built-in defaults
          console.warn('No test templates found in database, using built-in defaults.');
          setAvailableTests(Object.values(testTemplates));
          if (Object.values(testTemplates).length > 0) {
            setSelectedTest(Object.values(testTemplates)[0].testId);
          }
        }
      } catch (error) {
        console.warn('Failed to load remote templates, using built-in defaults.', error);
        setAvailableTests(Object.values(testTemplates));
        if (Object.values(testTemplates).length > 0) {
          setSelectedTest(Object.values(testTemplates)[0].testId);
        }
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchLabSettings();
    fetchTemplates();
  }, []);

  // Initialize results when test changes
  useEffect(() => {
    const test = availableTests.find((item) => item.testId === selectedTest) || testTemplates[selectedTest];
    if (test) {
      setResults(
        test.parameters.map((param) => ({
          parameterId: param.parameterId,
          parameterName: param.parameterName,
          value: '',
          unit: param.unit,
          normalRange: param.normalRange,
          isAbnormal: false,
          abnormalType: 'normal',
          possibleCause: ''
        }))
      );
    }
  }, [selectedTest, availableTests]);

  const handlePatientChange = (field, value) => {
    setPatient(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleResultChange = (index, value) => {
    const newResults = [...results];
    const parsedValue = value ? parseFloat(value) : '';
    const status = getAbnormalStatus(parsedValue, newResults[index].normalRange);
    newResults[index].value = parsedValue;
    newResults[index].isAbnormal = status.isAbnormal;
    newResults[index].abnormalType = status.abnormalType;
    newResults[index].possibleCause = status.isAbnormal ? getAbnormalCause(newResults[index].parameterName, status.abnormalType) : '';
    setResults(newResults);
  };

  const addCustomParameter = () => {
    setCustomParameters([...customParameters, {
      parameterName: '',
      value: '',
      unit: '',
      normalRange: '',
      isAbnormal: false
    }]);
  };

  const removeCustomParameter = (index) => {
    setCustomParameters(customParameters.filter((_, i) => i !== index));
  };

  const updateCustomParameter = (index, field, value) => {
    const newCustom = [...customParameters];
    newCustom[index][field] = value;
    if (field === 'value' || field === 'normalRange') {
      const parsedValue = newCustom[index].value ? parseFloat(newCustom[index].value) : '';
      const status = getAbnormalStatus(parsedValue, newCustom[index].normalRange);
      newCustom[index].isAbnormal = status.isAbnormal;
      newCustom[index].abnormalType = status.abnormalType;
      newCustom[index].possibleCause = status.isAbnormal ? getAbnormalCause(newCustom[index].parameterName, status.abnormalType) : '';
    }
    setCustomParameters(newCustom);
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const pdf = await generatePDFReport(generatedReport, labSettings);
      downloadPDF(pdf, `report-${generatedReport.reportId}`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    } finally {
      setLoading(false);
    }
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
      setSelectingTemplate(true);
      setError(null);

      const test = availableTests.find((item) => item.testId === selectedTest) || testTemplates[selectedTest];
      const formattedCustomParameters = customParameters
        .filter((p) => p.parameterName && p.value)
        .map((param) => {
          const parsedValue = param.value ? parseFloat(param.value) : '';
          const status = getAbnormalStatus(parsedValue, param.normalRange);
          return {
            ...param,
            value: parsedValue,
            isAbnormal: status.isAbnormal,
            abnormalType: status.abnormalType,
            possibleCause: status.isAbnormal ? getAbnormalCause(param.parameterName, status.abnormalType) : ''
          };
        });

      const reportData = {
        patient,
        test: {
          testId: selectedTest,
          testName: test?.testName || '',
          testType: test?.testType || ''
        },
        results: [...results, ...formattedCustomParameters],
        labDetails: labSettings || {},
        notes
      };

      const response = await reportAPI.create(reportData);
      setGeneratedReport(response.data);
      setSuccess(true);
      setStep(4);
    } catch (err) {
      setError('Failed to create report: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setSelectingTemplate(false);
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
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className='flex items-center flex-1'>
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                s <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
              animate={{ scale: s === step ? 1.1 : 1 }}
            >
              {s}
            </motion.div>
            {s < 4 && (
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
        <span className={step >= 4 ? 'text-blue-600' : 'text-gray-400'}>Complete</span>
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
              {templatesLoading ? (
                <div className='col-span-full flex justify-center py-8'>
                  <Loading />
                </div>
              ) : availableTests.length === 0 ? (
                <div className='col-span-full text-center py-8 text-gray-500'>
                  <p>No test templates available. Please check your connection or contact administrator.</p>
                </div>
              ) : (
                availableTests.map((test) => (
                  <motion.div
                    key={test.testId}
                    onClick={() => setSelectedTest(test.testId)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedTest === test.testId
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-blue-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className='font-bold text-lg'>{test.testName}</h3>
                    <p className='text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase'>{test.testType}</p>
                    <p className='text-xs mt-2 text-gray-500'>{test.parameters?.length || 0} parameters</p>
                    <p className='text-xs text-gray-500'>Sample: {test.sampleType}</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Test Details */}
            {availableTests.length > 0 && selectedTest && (
              <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg'>
                <h3 className='font-bold mb-2'>Selected Test Details</h3>
                <p><span className='font-semibold'>Test:</span> {availableTests.find((item) => item.testId === selectedTest)?.testName}</p>
                <p><span className='font-semibold'>Type:</span> {availableTests.find((item) => item.testId === selectedTest)?.testType}</p>
                <p><span className='font-semibold'>Sample:</span> {availableTests.find((item) => item.testId === selectedTest)?.sampleType}</p>
                <p><span className='font-semibold'>Turnaround:</span> {availableTests.find((item) => item.testId === selectedTest)?.turnaroundTime}</p>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Step 3: Enter Results */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
          <Card>
            <h2 className='text-2xl font-bold mb-6'>Enter Test Results</h2>
            {selectingTemplate && (
              <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>Selecting a template and preparing your report...</p>
            )}
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
                          ? result.abnormalType === 'low'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {result.isAbnormal ? (result.abnormalType === 'low' ? 'LOW' : 'HIGH') : 'NORMAL'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className='text-lg font-bold mb-4'>Custom Parameters</h2>
            <div className='space-y-4'>
              {customParameters.map((param, index) => (
                <motion.div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Input
                    placeholder='Parameter Name'
                    value={param.parameterName}
                    onChange={(e) => updateCustomParameter(index, 'parameterName', e.target.value)}
                  />
                  <Input
                    placeholder='Value'
                    type='number'
                    value={param.value}
                    onChange={(e) => updateCustomParameter(index, 'value', e.target.value)}
                  />
                  <Input
                    placeholder='Unit'
                    value={param.unit}
                    onChange={(e) => updateCustomParameter(index, 'unit', e.target.value)}
                  />
                  <Input
                    placeholder='Normal Range'
                    value={param.normalRange}
                    onChange={(e) => updateCustomParameter(index, 'normalRange', e.target.value)}
                  />
                  <div className='flex items-end'>
                    {param.value && (
                      <span className={`px-3 py-2 rounded-full text-xs font-bold ${
                        param.isAbnormal
                          ? param.abnormalType === 'low'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {param.isAbnormal ? (param.abnormalType === 'low' ? 'LOW' : 'HIGH') : 'NORMAL'}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => removeCustomParameter(index)}
                    variant='danger'
                    size='sm'
                  >
                    Remove
                  </Button>
                </motion.div>
              ))}
              <Button
                onClick={addCustomParameter}
                variant='secondary'
                size='sm'
              >
                Add Custom Parameter
              </Button>
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

      {/* Step 4: Success and Actions */}
      {step === 4 && generatedReport && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
          <Card>
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-green-600 mb-2'>Report Generated Successfully!</h2>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Report ID: {generatedReport.reportId}
              </p>
              
              <div className='flex flex-wrap gap-4 justify-center'>
                <Button
                  onClick={() => window.open(`/report/${generatedReport._id}`, '_blank')}
                  variant='primary'
                  size='lg'
                >
                  View Report
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant='secondary'
                  size='lg'
                  disabled={loading}
                >
                  {loading ? 'Downloading...' : 'Download PDF'}
                </Button>
                <Button
                  onClick={() => {
                    setStep(1);
                    setGeneratedReport(null);
                    setSuccess(false);
                    setCustomParameters([]);
                  }}
                  variant='outline'
                  size='lg'
                >
                  Create New Report
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  variant='outline'
                  size='lg'
                >
                  Edit This Report
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className='flex gap-4 justify-end'>
        {step > 1 && step < 4 && (
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
            {loading ? (selectingTemplate ? 'Selecting template...' : 'Generating...') : 'Generate Report'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
