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
    if (!result.value) {
      errors[`result_${index}`] = 'Value is required';
    }
  });

  return errors;
};

export const checkAbnormalValue = (value, normalRange) => {
  if (!value || !normalRange) return false;

  const ranges = normalRange.match(/[\d.]+/g);
  if (!ranges || ranges.length === 0) return false;

  const min = parseFloat(ranges[0]);
  const max = ranges.length > 1 ? parseFloat(ranges[1]) : parseFloat(ranges[0]);

  if (normalRange.includes('<')) {
    return value >= min;
  } else if (normalRange.includes('>')) {
    return value <= min;
  } else {
    return value < min || value > max;
  }
};
