import React from 'react';

const defaultLogo = '/pathora-logo.svg';

const formatDate = (value) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const normalizeResults = (results = []) => results.map((result) => ({
  parameterName: result.parameterName || '-',
  value: result.value ?? '-',
  unit: result.unit || '-',
  normalRange: result.normalRange || '-',
  isAbnormal: Boolean(result.isAbnormal),
  abnormalType: result.abnormalType || 'normal',
  possibleCause: result.possibleCause || ''
}));

const getOptionalText = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export const buildReportDocumentModel = (report, labSettings = {}) => ({
  headerTitle: report?.labDetails?.headerTitle || labSettings?.headerTitle || labSettings?.labName || 'Pathora Labs',
  headerSubtitle: report?.labDetails?.headerSubtitle || labSettings?.headerSubtitle || 'Precision diagnostics with presentation-ready reporting',
  contactLine: report?.labDetails?.contactLine || [labSettings?.phone, labSettings?.email, labSettings?.website].filter(Boolean).join(' | ') || 'Phone | Email | Website',
  address: report?.labDetails?.address || labSettings?.address || 'Professional diagnostic reporting workspace',
  footerText: report?.labDetails?.footerText || labSettings?.footer || 'Digitally generated pathology report for professional clinical use.',
  disclaimer: labSettings?.disclaimer || '',
  logo: report?.labDetails?.logo || labSettings?.logo || defaultLogo,
  reportId: report?.reportId || 'REP-240501',
  reportDate: report?.dates?.reportDate || new Date().toISOString(),
  sampleDate: report?.dates?.sampleCollectionDate || report?.patient?.sampleCollectionDate || new Date().toISOString(),
  patient: {
    name: report?.patient?.name || 'Aarav Kumar',
    patientId: getOptionalText(report?.patient?.patientId),
    age: report?.patient?.age || '32',
    gender: report?.patient?.gender || 'Male',
    doctorName: getOptionalText(report?.patient?.doctorName),
    contactNo: getOptionalText(report?.patient?.contactNo)
  },
  test: {
    testName: report?.test?.testName || 'Complete Blood Count',
    testType: report?.test?.testType || 'Hematology',
    description: report?.test?.description || 'This test supports clinical interpretation and helps guide patient management.',
    sampleType: report?.test?.sampleType || 'Whole Blood',
    turnaroundTime: report?.test?.turnaroundTime || 'Same Day'
  },
  results: normalizeResults(report?.results?.length ? report.results : [
    {
      parameterName: 'Hemoglobin',
      value: '13.4',
      unit: 'g/dL',
      normalRange: '13 - 17',
      isAbnormal: false,
      abnormalType: 'normal',
      possibleCause: ''
    },
    {
      parameterName: 'WBC Count',
      value: '12400',
      unit: '/cmm',
      normalRange: '4000 - 11000',
      isAbnormal: true,
      abnormalType: 'high',
      possibleCause: 'An elevated WBC Count may indicate inflammation, infection, dehydration, or metabolic imbalance.'
    }
  ]),
  notes: report?.notes || ''
});

export const buildPreviewReportDocumentModel = (settings, logoPreview) =>
  buildReportDocumentModel({
    reportId: 'REP-240501',
    patient: {
      name: 'Aarav Kumar',
      patientId: 'PAT-1042',
      age: 32,
      gender: 'Male',
      doctorName: 'Dr. Mehta',
      contactNo: '+91 98765 43210'
    },
    test: {
      testName: 'Complete Blood Count',
      testType: 'Hematology',
      description: 'A foundational screening test used to assess anemia, infection, inflammation, and overall hematologic health.',
      sampleType: 'Whole Blood',
      turnaroundTime: 'Same Day'
    },
    results: [
      {
        parameterName: 'Hemoglobin',
        value: '13.4',
        unit: 'g/dL',
        normalRange: '13 - 17',
        isAbnormal: false,
        abnormalType: 'normal',
        possibleCause: ''
      },
      {
        parameterName: 'WBC Count',
        value: '12400',
        unit: '/cmm',
        normalRange: '4000 - 11000',
        isAbnormal: true,
        abnormalType: 'high',
        possibleCause: 'An elevated WBC Count may indicate inflammation, infection, dehydration, or metabolic imbalance.'
      }
    ],
    labDetails: {
      logo: logoPreview || settings?.logo || defaultLogo,
      headerTitle: settings?.headerTitle || settings?.labName || 'Pathora Labs',
      headerSubtitle: settings?.headerSubtitle || 'Precision diagnostics with presentation-ready reporting',
      contactLine: [settings?.phone, settings?.email, settings?.website].filter(Boolean).join(' | '),
      address: settings?.address || 'Professional diagnostic reporting workspace',
      footerText: settings?.footer || 'Footer text will appear here.'
    },
    notes: ''
  }, settings);

const InfoBlock = ({ title, rows }) => (
  <div className='rounded-[24px] border border-slate-200 bg-violet-50 p-5 shadow-sm'>
    <p className='text-base font-semibold text-slate-900'>{title}</p>
    <div className='mt-4 space-y-3 text-sm'>
      {rows.map((row) => (
        <div key={row.label}>
          <span className='text-slate-400'>{row.label}</span>
          <p className='font-medium text-slate-800'>{row.value || '-'}</p>
        </div>
      ))}
    </div>
  </div>
);

const ReportDocument = ({ model, className = '' }) => {
  const abnormalResults = model.results.filter((result) => result.isAbnormal);

  return (
    <div
      className={`bg-white text-slate-600 ${className}`.trim()}
      style={{ width: 794, minHeight: 1123, fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className='h-full bg-[linear-gradient(180deg,#ffffff,#f8f7ff)] p-8'>
        <div className='rounded-[28px] bg-[linear-gradient(135deg,#4c1d95,#312e81)] p-7 text-white shadow-[0_24px_60px_rgba(76,29,149,0.24)]'>
          <div className='grid grid-cols-[minmax(0,1fr)_220px] items-start gap-5'>
            <div className='flex min-w-0 items-start gap-4 pr-2'>
              <img src={model.logo || defaultLogo} alt='Lab logo' className='h-16 w-16 shrink-0 rounded-[20px] bg-white/95 p-2.5 object-contain' />
              <div className='min-w-0 flex-1'>
                <h1 className='text-[28px] font-bold leading-tight break-words'>{model.headerTitle}</h1>
                <p className='mt-1.5 text-sm leading-6 text-white/85 break-words'>{model.headerSubtitle}</p>
                <p className='mt-4 text-xs leading-5 text-white/75 break-words'>{model.contactLine}</p>
                <p className='mt-1.5 text-xs leading-5 text-white/65 break-words'>{model.address}</p>
              </div>
            </div>

            <div className='w-[220px] rounded-[22px] bg-white px-5 py-4 text-right text-slate-800 shadow-sm'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-700'>Document</p>
              <p className='mt-1 text-lg font-bold'>Pathology Report</p>
              <p className='mt-1.5 text-xs text-slate-500'>{model.reportId}</p>
              <p className='mt-1 text-xs text-slate-500'>{formatDate(model.reportDate)}</p>
            </div>
          </div>
        </div>

        <div className='mt-6 grid grid-cols-2 gap-5'>
          <InfoBlock
            title='Patient Information'
            rows={[
              { label: 'Patient', value: model.patient.name },
              { label: 'Patient ID', value: model.patient.patientId },
              { label: 'Age / Gender', value: `${model.patient.age} / ${model.patient.gender}` },
              { label: 'Doctor', value: model.patient.doctorName }
            ]}
          />
          <InfoBlock
            title='Report Information'
            rows={[
              { label: 'Report ID', value: model.reportId },
              { label: 'Sample Date', value: formatDate(model.sampleDate) },
              { label: 'Report Date', value: formatDate(model.reportDate) },
              { label: 'Contact', value: model.patient.contactNo }
            ]}
          />
        </div>

        <div className='mt-5 grid grid-cols-[0.95fr_1.05fr] gap-5'>
          <div className='rounded-[24px] bg-[linear-gradient(135deg,#4c1d95,#312e81)] p-5 text-white shadow-sm'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/70'>Test Family</p>
            <p className='mt-3 text-[22px] font-bold leading-tight'>{model.test.testType}</p>
            <p className='mt-2 text-base font-semibold text-white/92'>{model.test.testName}</p>
            <div className='mt-5 grid grid-cols-2 gap-3 text-xs text-white/80'>
              <div>
                <span className='block uppercase tracking-[0.18em] text-white/55'>Sample</span>
                <span className='mt-1 block text-sm font-medium text-white'>{model.test.sampleType}</span>
              </div>
              <div>
                <span className='block uppercase tracking-[0.18em] text-white/55'>Turnaround</span>
                <span className='mt-1 block text-sm font-medium text-white'>{model.test.turnaroundTime}</span>
              </div>
            </div>
          </div>

          <div className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='text-base font-semibold text-slate-900'>Why This Test Is Used</p>
            <p className='mt-3 text-sm leading-6 text-slate-600'>{model.test.description}</p>
          </div>
        </div>

        <div className='mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='grid grid-cols-[1.15fr_0.55fr_0.55fr_0.72fr_0.45fr] gap-3 rounded-[18px] bg-[linear-gradient(135deg,#4c1d95,#312e81)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white'>
            <span>Parameter</span>
            <span className='text-center'>Value</span>
            <span className='text-center'>Unit</span>
            <span className='text-center'>Range</span>
            <span className='text-center'>Status</span>
          </div>

          <div className='mt-3 space-y-2.5 text-sm'>
            {model.results.map((result, index) => (
              <div
                key={`${result.parameterName}-${index}`}
                className={`grid grid-cols-[1.15fr_0.55fr_0.55fr_0.72fr_0.45fr] items-center gap-3 rounded-[18px] border border-slate-200 px-4 py-3 ${
                  index % 2 === 0 ? 'bg-violet-50' : 'bg-white'
                }`}
              >
                <span className='font-medium text-slate-800'>{result.parameterName}</span>
                <span className={`text-center text-sm font-semibold ${result.isAbnormal ? 'text-rose-700' : 'text-slate-900'}`}>{result.value}</span>
                <span className='text-center text-slate-600'>{result.unit}</span>
                <span className='text-center text-slate-600'>{result.normalRange}</span>
                <span
                  className={`rounded-full px-2 py-1 text-center text-xs font-semibold ${
                    result.isAbnormal
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {result.isAbnormal ? (result.abnormalType === 'low' ? 'Low' : 'High') : 'Normal'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {abnormalResults.length > 0 && (
          <div className='mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='text-base font-semibold text-slate-900'>Flagged Findings</p>
            <div className='mt-4 space-y-3'>
              {abnormalResults.map((result, index) => (
                <div key={`${result.parameterName}-flag-${index}`} className='rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-4'>
                  <p className='font-semibold text-rose-700'>
                    {result.parameterName}: {result.abnormalType === 'low' ? 'Low' : 'High'}
                  </p>
                  <p className='mt-1.5 text-sm leading-6 text-slate-600'>{result.possibleCause || 'Requires clinical correlation.'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {model.notes && (
          <div className='mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='text-base font-semibold text-slate-900'>Clinical Notes</p>
            <p className='mt-3 text-sm leading-6 text-slate-600'>{model.notes}</p>
          </div>
        )}

        {(model.footerText || model.disclaimer) && (
          <div className='mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'>
            {model.footerText && <p className='text-sm leading-6'>{model.footerText}</p>}
            {model.disclaimer && <p className={`${model.footerText ? 'mt-4' : ''} text-sm leading-6`}>{model.disclaimer}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDocument;
