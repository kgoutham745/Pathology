export const generateReportId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RPT-${year}${month}${day}-${random}`;
};

export const generatePatientId = () => {
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `PAT-${Math.floor(Date.now() / 1000)}-${random}`;
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

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
