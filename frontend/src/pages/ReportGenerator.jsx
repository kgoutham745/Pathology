import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import { reportAPI, labAPI, testAPI } from '../utils/api';
import { Card, Button, Input, Textarea, Loading, Alert, Select } from '../components/UIComponents';
import { generatePDFReport, downloadPDF } from '../utils/pdfGenerator';
import { validatePatientInfo, validateTestResults, getAbnormalStatus, getAbnormalCause } from '../utils/validators';
import { testTemplates } from '../data/testTemplates';
import { buildReportLabDetails } from '../utils/labTemplates';

const ReportGenerator = () => {
  const stepItems = [
    { id: 1, label: 'Patient Info', mobileLabel: 'Patient' },
    { id: 2, label: 'Select Test', mobileLabel: 'Test' },
    { id: 3, label: 'Enter Results', mobileLabel: 'Results' },
    { id: 4, label: 'Complete', mobileLabel: 'Done' }
  ];

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
    sampleCollectionDate: new Date().toISOString().slice(0, 10),
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
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [showAllTests, setShowAllTests] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const hasMountedStepRef = useRef(false);

  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  const mergeTests = (remoteTests = []) => {
    const builtInTests = Object.values(testTemplates);
    const merged = new Map();
    builtInTests.forEach((test) => merged.set(test.testId, test));
    remoteTests.forEach((test) => merged.set(test.testId, { ...merged.get(test.testId), ...test }));
    return Array.from(merged.values());
  };

  useEffect(() => {
    if (user?.role !== 'master') {
      refreshUser();
    }

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
        const mergedTests = mergeTests(response.data);
        setAvailableTests(mergedTests);
        if (mergedTests.length > 0) {
          setSelectedTest(mergedTests[0].testId);
        } else {
          console.warn('No test templates found in database, using built-in defaults.');
          const builtInTests = Object.values(testTemplates);
          setAvailableTests(builtInTests);
          if (builtInTests.length > 0) {
            setSelectedTest(builtInTests[0].testId);
          }
        }
      } catch (error) {
        console.warn('Failed to load remote templates, using built-in defaults.', error);
        const builtInTests = Object.values(testTemplates);
        setAvailableTests(builtInTests);
        if (builtInTests.length > 0) {
          setSelectedTest(builtInTests[0].testId);
        }
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchLabSettings();
    fetchTemplates();
  }, [refreshUser, user?.role]);

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

  useEffect(() => {
    if (!hasMountedStepRef.current) {
      hasMountedStepRef.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

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

  const navigate = useNavigate();
  const selectedTestDetails = useMemo(
    () => availableTests.find((item) => item.testId === selectedTest) || testTemplates[selectedTest],
    [availableTests, selectedTest]
  );
  const filteredTests = useMemo(() => {
    const query = testSearchQuery.trim().toLowerCase();
    if (!query) return availableTests;
    return availableTests.filter((test) =>
      [test.testName, test.testType]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [availableTests, testSearchQuery]);
  const visibleTests = useMemo(() => {
    if (showAllTests || testSearchQuery.trim()) return filteredTests;
    return filteredTests.slice(0, 10);
  }, [filteredTests, showAllTests, testSearchQuery]);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const pdf = await generatePDFReport(generatedReport, labSettings, labSettings?.pdfTemplate);
      downloadPDF(pdf, `report-${generatedReport.reportId}`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = async () => {
    try {
      setLoading(true);
      const pdf = await generatePDFReport(generatedReport, labSettings, labSettings?.pdfTemplate);
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error previewing PDF:', error);
      setError('Failed to preview PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryRedirect = () => {
    navigate('/history');
  };

  const accountPaused = user?.licenseStatus?.isPaused;
  const validUntil = user?.licenseStatus?.validUntil ? new Date(user.licenseStatus.validUntil) : (user?.license?.validUntil ? new Date(user.license.validUntil) : null);
  const subscriptionExpired = user?.licenseStatus?.isDateExpired;
  const monthlyLimit = user?.license?.monthlyReportLimit ?? 0;
  const monthlyReportCount = user?.reportsThisMonth ?? 0;
  const monthlyLimitReached = user?.licenseStatus?.isReportQuotaReached;
  const nearMonthlyLimit = monthlyLimit > 0 && !monthlyLimitReached && monthlyReportCount > 0 && monthlyReportCount >= monthlyLimit - 2;

  const licenseStatus = (() => {
    if (!user || user.role === 'master') return null;
    if (accountPaused) {
      return {
        type: 'error',
        title: 'Account paused',
        message: 'Your lab account is currently paused. Contact your administrator to restore access.'
      };
    }
    if (subscriptionExpired) {
      return {
        type: 'error',
        title: 'Subscription expired',
        message: `Your subscription expired on ${validUntil?.toLocaleDateString() || 'an earlier date'}. Please renew to continue generating reports.`
      };
    }
    if (monthlyLimitReached) {
      return {
        type: 'error',
        title: 'Monthly report limit reached',
        message: `You have generated ${monthlyReportCount}/${monthlyLimit} reports this month. Report creation is temporarily disabled until the next billing period.`
      };
    }
    if (nearMonthlyLimit) {
      return {
        type: 'warning',
        title: 'Approaching monthly limit',
        message: `You have generated ${monthlyReportCount}/${monthlyLimit} reports this month. One more report will reach your monthly cap.`
      };
    }
    return null;
  })();

  const handleNextStep = () => {
    if (licenseStatus?.type === 'error') {
      setError(licenseStatus.message);
      return;
    }

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

      const test = selectedTestDetails;
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
          testType: test?.testType || '',
          description: test?.description || '',
          sampleType: test?.sampleType || '',
          turnaroundTime: test?.turnaroundTime || ''
        },
        results: [...results, ...formattedCustomParameters],
        labDetails: buildReportLabDetails(labSettings),
        notes
      };

      if (licenseStatus?.type === 'error') {
        setError(licenseStatus.message);
        return;
      }

      const response = await reportAPI.create(reportData);
      setGeneratedReport(response.data);
      setSuccess(true);
      setStep(4);
      if (user?.role !== 'master') {
        refreshUser();
      }
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
      {licenseStatus && (
        <div className='space-y-3'>
          <Alert
            type={licenseStatus.type}
            title={licenseStatus.title}
            message={licenseStatus.message}
          />
          <div className='flex flex-wrap gap-3'>
            {user?.license && (
              <div className='rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-700 dark:text-slate-200'>
                <div className='font-semibold mb-1'>License details</div>
                <div>Monthly usage: {user.reportsThisMonth ?? 0}/{user.license.monthlyReportLimit ?? 0}</div>
                <div>Valid until: {user.license.validUntil ? new Date(user.license.validUntil).toLocaleDateString() : 'N/A'}</div>
              </div>
            )}
            <Button variant='secondary' size='md' onClick={refreshUser}>
              Refresh license status
            </Button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <motion.div className='space-y-3' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className='grid grid-cols-4 gap-3 md:gap-4'>
          {stepItems.map((item) => (
            <div key={item.id} className='flex flex-col items-center gap-2'>
              <motion.div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold md:h-11 md:w-11 ${
                  item.id <= step
                    ? 'bg-[linear-gradient(135deg,#6d28d9,#4338ca)] text-white shadow-[0_12px_24px_rgba(91,33,182,0.28)]'
                    : 'bg-violet-100 text-violet-500'
                }`}
                animate={{ scale: item.id === step ? 1.08 : 1 }}
              >
                {item.id}
              </motion.div>
              <div
                className={`hidden h-1 w-full rounded-full md:block ${
                  item.id < stepItems.length
                    ? item.id < step
                      ? 'bg-[linear-gradient(135deg,#6d28d9,#4338ca)]'
                      : 'bg-violet-100'
                    : 'bg-violet-100'
                }`}
              />
            </div>
          ))}
        </div>

        <div className='grid grid-cols-4 gap-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] md:gap-4 md:text-sm md:normal-case md:tracking-normal'>
          {stepItems.map((item) => (
            <span key={item.id} className={step >= item.id ? 'text-violet-700' : 'text-slate-400'}>
              <span className='md:hidden'>{item.mobileLabel}</span>
              <span className='hidden md:inline'>{item.label}</span>
            </span>
          ))}
        </div>
      </motion.div>

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
            <div className='mb-5 space-y-4'>
              <Input
                label='Search Tests'
                placeholder='Search by test name or family/type'
                value={testSearchQuery}
                onChange={(e) => {
                  setTestSearchQuery(e.target.value);
                  setShowAllTests(false);
                }}
              />
              {!testSearchQuery.trim() && filteredTests.length > 10 && (
                <div className='flex items-center justify-between rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-800'>
                  <span>Showing popular 10 tests first for faster selection.</span>
                  <Button variant='secondary' size='sm' onClick={() => setShowAllTests((value) => !value)}>
                    {showAllTests ? 'Show Less' : `Show More (${filteredTests.length})`}
                  </Button>
                </div>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {templatesLoading ? (
                <div className='col-span-full flex justify-center py-8'>
                  <Loading />
                </div>
              ) : filteredTests.length === 0 ? (
                <div className='col-span-full text-center py-8 text-gray-500'>
                  <p>No tests match your search. Try another test name or family.</p>
                </div>
              ) : (
                visibleTests.map((test) => (
                  <motion.div
                    key={test.testId}
                    onClick={() => setSelectedTest(test.testId)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all ${
                      selectedTest === test.testId
                        ? 'border-2 border-violet-600 bg-violet-50 shadow-sm'
                        : 'border-2 border-transparent bg-gray-100 hover:border-violet-300 dark:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className='font-bold text-lg'>{test.testName}</h3>
                    <p className='text-sm font-semibold uppercase text-violet-600'>{test.testType}</p>
                    <p className='text-xs mt-2 text-gray-500'>{test.parameters?.length || 0} parameters</p>
                    <p className='text-xs text-gray-500'>Sample: {test.sampleType}</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Test Details */}
            {selectedTestDetails && selectedTest && (
              <div className='mt-6 rounded-2xl bg-violet-50 p-4'>
                <h3 className='font-bold mb-2'>Selected Test Details</h3>
                <p><span className='font-semibold'>Test:</span> {selectedTestDetails.testName}</p>
                <p><span className='font-semibold'>Type:</span> {selectedTestDetails.testType}</p>
                <p><span className='font-semibold'>Sample:</span> {selectedTestDetails.sampleType}</p>
                <p><span className='font-semibold'>Turnaround:</span> {selectedTestDetails.turnaroundTime}</p>
                {selectedTestDetails.description && (
                  <p className='mt-3 text-sm text-slate-600'><span className='font-semibold text-slate-800'>Clinical use:</span> {selectedTestDetails.description}</p>
                )}
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
                  className='grid grid-cols-1 gap-4 rounded-2xl bg-gray-50 p-4 md:grid-cols-4 dark:bg-gray-700'
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
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h2 className='text-lg font-bold'>Advanced Options</h2>
                <p className='text-sm text-slate-500'>Use this only when you need custom fields or clinical notes.</p>
              </div>
              <Button variant='secondary' size='sm' onClick={() => setShowAdvancedOptions((value) => !value)}>
                {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </Button>
            </div>

            {showAdvancedOptions && (
              <div className='mt-6 space-y-6'>
                <div>
                  <h3 className='text-lg font-bold mb-4'>Custom Parameters</h3>
                  <div className='space-y-4'>
                    {customParameters.map((param, index) => (
                      <motion.div
                        key={index}
                        className='grid grid-cols-1 gap-4 rounded-2xl bg-gray-50 p-4 md:grid-cols-6 dark:bg-gray-700'
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
                </div>

                <div>
                  <h3 className='text-lg font-bold mb-4'>Additional Notes</h3>
                  <Textarea
                    placeholder='Add any clinical notes or observations'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}
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
                  onClick={handleDownloadPDF}
                  variant='primary'
                  size='lg'
                  disabled={loading}
                >
                  {loading ? 'Downloading...' : 'Download PDF'}
                </Button>
                <Button
                  onClick={handleViewPDF}
                  variant='secondary'
                  size='lg'
                  disabled={loading}
                >
                  {loading ? 'Loading PDF...' : 'View PDF'}
                </Button>
                <Button
                  onClick={handleHistoryRedirect}
                  variant='secondary'
                  size='lg'
                >
                  View Report History
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
      <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
        {step > 1 && step < 4 && (
          <Button
            onClick={() => setStep(step - 1)}
            variant='secondary'
            size='lg'
            className='w-full sm:w-auto'
          >
            Previous
          </Button>
        )}
        {step < 3 && (
          <Button
            onClick={handleNextStep}
            variant='primary'
            size='lg'
            disabled={loading || licenseStatus?.type === 'error'}
            className='w-full sm:w-auto'
          >
            Next
          </Button>
        )}
        {step === 3 && (
          <Button
            onClick={handleSubmit}
            variant='success'
            size='lg'
            disabled={loading || licenseStatus?.type === 'error'}
            className='w-full sm:w-auto'
          >
            {loading ? (selectingTemplate ? 'Selecting template...' : 'Generating...') : 'Generate Report'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
