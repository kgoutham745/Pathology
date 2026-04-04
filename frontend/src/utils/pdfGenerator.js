import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFFromHTML = async (element, filename) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generatePDFReport = (report, labSettings) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yPosition = 20;

  // Header
  if (labSettings?.logo) {
    pdf.addImage(labSettings.logo, 'PNG', 20, yPosition, 30, 30);
  }

  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text(labSettings?.labName || 'ABC DIAGNOSTIC LAB', 150, yPosition + 5, { align: 'right' });

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(labSettings?.address || '', 150, yPosition + 12, { align: 'right', maxWidth: 80 });
  pdf.text(`Phone: ${labSettings?.phone || ''}`, 150, yPosition + 20, { align: 'right' });
  pdf.text(`Email: ${labSettings?.email || ''}`, 150, yPosition + 26, { align: 'right' });

  yPosition += 45;

  // Report Title
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('PATHOLOGY REPORT', 105, yPosition, { align: 'center' });
  yPosition += 10;

  // Report ID and Dates
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Report ID: ${report.reportId}`, 20, yPosition);
  pdf.text(`Report Date: ${new Date(report.dates.reportDate).toLocaleDateString()}`, 20, yPosition + 5);
  yPosition += 12;

  // Patient Information
  pdf.setFont(undefined, 'bold');
  pdf.text('PATIENT INFORMATION', 20, yPosition);
  yPosition += 6;

  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(9);
  pdf.text(`Name: ${report.patient.name}`, 20, yPosition);
  pdf.text(`Age: ${report.patient.age} years`, 80, yPosition);
  pdf.text(`Gender: ${report.patient.gender}`, 130, yPosition);
  yPosition += 5;

  pdf.text(`Patient ID: ${report.patient.patientId}`, 20, yPosition);
  pdf.text(`Doctor: ${report.patient.doctorName}`, 80, yPosition);
  yPosition += 5;

  pdf.text(`Sample Date: ${new Date(report.dates.sampleCollectionDate).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;

  // Test Information
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(10);
  pdf.text(`Test: ${report.test.testName}`, 20, yPosition);
  yPosition += 8;

  // Results Table
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  
  const tableHeaders = ['Parameter', 'Result', 'Unit', 'Normal Range', 'Status'];
  const tableStartY = yPosition;
  
  // Draw header
  pdf.line(20, tableStartY, 190, tableStartY);
  
  let xPos = 20;
  tableHeaders.forEach((header, index) => {
    const widths = [50, 30, 25, 45, 20];
    pdf.text(header, xPos + widths[index] / 2, tableStartY + 4, { align: 'center' });
    xPos += widths[index];
  });

  yPosition = tableStartY + 7;
  pdf.line(20, yPosition, 190, yPosition);
  yPosition += 3;

  pdf.setFont(undefined, 'normal');

  report.results.forEach((result) => {
    if (yPosition > 280) {
      pdf.addPage();
      yPosition = 20;
    }

    xPos = 20;
    const widths = [50, 30, 25, 45, 20];
    const columnValues = [
      result.parameterName,
      result.value,
      result.unit,
      result.normalRange,
      result.isAbnormal ? 'HIGH' : 'NORMAL'
    ];

    columnValues.forEach((value, index) => {
      const textColor = result.isAbnormal && index === 4 ? [220, 53, 69] : [0, 0, 0];
      pdf.setTextColor(...textColor);
      pdf.text(String(value), xPos + widths[index] / 2, yPosition, { align: 'center', maxWidth: widths[index] - 2 });
      xPos += widths[index];
    });

    pdf.setTextColor(0, 0, 0);
    yPosition += 6;
  });

  pdf.line(20, yPosition, 190, yPosition);
  yPosition += 10;

  // Notes
  if (report.notes) {
    pdf.setFont(undefined, 'bold');
    pdf.text('NOTES:', 20, yPosition);
    yPosition += 5;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    const noteLines = pdf.splitTextToSize(report.notes, 170);
    pdf.text(noteLines, 20, yPosition);
    yPosition += noteLines.length * 4 + 5;
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'italic');
  pdf.text(
    labSettings?.disclaimer || 'This is an electronically generated report.',
    105,
    280,
    { align: 'center', maxWidth: 170 }
  );

  return pdf;
};

export const downloadPDF = (pdf, filename) => {
  pdf.save(`${filename}.pdf`);
};
