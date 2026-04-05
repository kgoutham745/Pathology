export const validatePatientInfo = (patient) => {
  const errors = {};

  if (!patient.name?.trim()) {
    errors.name = 'Patient name is required';
  }
  if (!patient.age || patient.age < 0 || patient.age > 150) {
    errors.age = 'Valid age is required';
  }
  if (!patient.gender) {
    errors.gender = 'Gender is required';
  }
  if (!patient.sampleCollectionDate) {
    errors.sampleCollectionDate = 'Sample collection date is required';
  }

  return errors;
};

export const validateTestResults = (results) => {
  const errors = {};

  results.forEach((result, index) => {
    if (result.value === '' || result.value === null || result.value === undefined) {
      errors[`result_${index}`] = 'Value is required';
    }
  });

  return errors;
};

const parseNumberRange = (normalRange) => {
  const numbers = normalRange?.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) return null;

  const min = parseFloat(numbers[0]);
  const max = numbers.length > 1 ? parseFloat(numbers[1]) : parseFloat(numbers[0]);
  return { min, max };
};

export const getAbnormalStatus = (value, normalRange) => {
  const status = {
    isAbnormal: false,
    abnormalType: 'normal'
  };

  if (value === '' || value === null || value === undefined || Number.isNaN(value) || !normalRange) {
    return status;
  }

  const range = parseNumberRange(normalRange);
  if (!range) return status;

  const { min, max } = range;

  if (normalRange.includes('<')) {
    if (value >= min) {
      status.isAbnormal = true;
      status.abnormalType = 'high';
    }
  } else if (normalRange.includes('>')) {
    if (value <= min) {
      status.isAbnormal = true;
      status.abnormalType = 'low';
    }
  } else {
    if (value < min) {
      status.isAbnormal = true;
      status.abnormalType = 'low';
    } else if (value > max) {
      status.isAbnormal = true;
      status.abnormalType = 'high';
    }
  }

  return status;
};

export const checkAbnormalValue = (value, normalRange) => getAbnormalStatus(value, normalRange).isAbnormal;

export const getAbnormalLabel = (abnormalType) => {
  if (abnormalType === 'low') return 'LOW';
  if (abnormalType === 'high') return 'HIGH';
  return 'NORMAL';
};

export const getAbnormalCause = (parameterName, abnormalType) => {
  if (abnormalType === 'high') {
    return `An elevated ${parameterName} may indicate inflammation, infection, dehydration, or metabolic imbalance.`;
  }
  if (abnormalType === 'low') {
    return `A reduced ${parameterName} may indicate anemia, deficiency, malabsorption, or organ dysfunction.`;
  }
  return '';
};
