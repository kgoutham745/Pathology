import Report from '../models/Report.js';
import TestTemplate from '../models/TestTemplate.js';

export const getCurrentMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const getAccountUsage = async (accountId) => {
  const currentMonthStart = getCurrentMonthStart();
  const [templatesCount, reportsThisMonth] = await Promise.all([
    TestTemplate.countDocuments({ createdBy: accountId, active: true }),
    Report.countDocuments({ createdBy: accountId, 'dates.reportDate': { $gte: currentMonthStart } })
  ]);

  return {
    templatesCount,
    reportsThisMonth
  };
};

export const evaluateAccountAccess = (account, usage = { templatesCount: 0, reportsThisMonth: 0 }) => {
  const license = account?.license || {};
  const monthlyReportLimit = Number(license.monthlyReportLimit ?? 0);
  const expiryType = license.expiryType || 'count';
  const validUntil = license.validUntil ? new Date(license.validUntil) : null;
  const now = new Date();

  const isPaused = account?.active === false;
  const isDateExpired = Boolean(
    validUntil &&
    ['date', 'combined'].includes(expiryType) &&
    now > validUntil
  );
  const isReportQuotaReached = monthlyReportLimit > 0 && usage.reportsThisMonth >= monthlyReportLimit;

  const reasons = [];
  if (isPaused) reasons.push('Account paused by administrator.');
  if (isDateExpired) reasons.push('Subscription validity date has expired.');
  if (isReportQuotaReached) reasons.push('Monthly report quota has been reached.');

  return {
    usage,
    status: isPaused || isDateExpired || isReportQuotaReached ? 'inactive' : 'active',
    accountActive: !isPaused,
    reportGenerationAllowed: !isPaused && !isDateExpired && !isReportQuotaReached,
    templateCreationAllowed: !isPaused && !isDateExpired,
    isPaused,
    isDateExpired,
    isReportQuotaReached,
    isTemplateQuotaReached: false,
    validUntil,
    reasons
  };
};
