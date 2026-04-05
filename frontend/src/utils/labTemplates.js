export const getDefaultReportTemplate = (settings) => {
  if (!settings?.reportTemplates?.length) {
    return null;
  }

  return settings.reportTemplates.find(
    (template) => template.templateId === settings.defaultReportTemplateId
  ) || settings.reportTemplates[0];
};

export const buildReportLabDetails = (settings) => {
  const selectedTemplate = getDefaultReportTemplate(settings);

  return {
    labName: settings?.labName || selectedTemplate?.headerTitle || '',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    logo: selectedTemplate?.logo || settings?.logo || '/pathora-logo.svg',
    templateName: selectedTemplate?.templateName || '',
    headerTitle: selectedTemplate?.headerTitle || settings?.labName || '',
    headerSubtitle: selectedTemplate?.headerSubtitle || '',
    contactLine: selectedTemplate?.contactLine || '',
    footerText: selectedTemplate?.footerText || settings?.footer || '',
    primaryColor: selectedTemplate?.primaryColor || settings?.theme?.primaryColor || '#4c1d95',
    accentColor: selectedTemplate?.accentColor || settings?.theme?.secondaryColor || '#8b5cf6'
  };
};
