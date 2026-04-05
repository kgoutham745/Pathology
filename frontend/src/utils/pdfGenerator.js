import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

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

export const generatePDFReport = async (report, labSettings) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yPosition = 20;
  const reportFormat = labSettings?.reportFormat || 'standard';

  // Colors
  const primaryColor = [41, 128, 185]; // Blue
  const secondaryColor = [52, 73, 94]; // Dark Gray
  const accentColor = [231, 76, 60]; // Red for abnormal
  const normalColor = [46, 204, 113]; // Green for normal
  const backgroundColor = [245, 245, 245]; // Light gray background

  // Helper function to add colored rectangle
  const addColoredRect = (x, y, w, h, color) => {
    pdf.setFillColor(...color);
    pdf.rect(x, y, w, h, 'F');
  };

  // Header with background
  addColoredRect(0, 0, 210, 40, primaryColor);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(labSettings?.labName || 'ADVANCED DIAGNOSTIC CENTER', 105, yPosition + 5, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text('Comprehensive Pathology & Diagnostic Services', 105, yPosition + 15, { align: 'center' });

  // Lab contact info
  pdf.setFontSize(8);
  pdf.text(`Phone: ${labSettings?.phone || '+1-234-567-8900'} | Email: ${labSettings?.email || 'info@advdiagnostic.com'}`, 105, yPosition + 25, { align: 'center' });
  pdf.text(`${labSettings?.address || '123 Medical Plaza, Healthcare City, HC 12345'}`, 105, yPosition + 30, { align: 'center' });

  yPosition += 45;

  // Report title with styling
  addColoredRect(0, yPosition - 5, 210, 15, secondaryColor);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('PATHOLOGY REPORT', 105, yPosition + 5, { align: 'center' });
  yPosition += 20;

  // Report metadata
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');

  // Left column
  pdf.text('Report ID:', 20, yPosition);
  pdf.text('Patient ID:', 20, yPosition + 6);
  pdf.text('Report Date:', 20, yPosition + 12);
  pdf.text('Report Time:', 20, yPosition + 18);

  pdf.setFont(undefined, 'normal');
  pdf.text(`${report.reportId}`, 50, yPosition);
  pdf.text(`${report.patient.patientId}`, 50, yPosition + 6);
  pdf.text(`${new Date(report.dates.reportDate).toLocaleDateString()}`, 50, yPosition + 12);
  pdf.text(`${new Date().toLocaleTimeString()}`, 50, yPosition + 18);

  // Right column
  pdf.setFont(undefined, 'bold');
  pdf.text('Test Type:', 120, yPosition);
  pdf.text('Sample Date:', 120, yPosition + 6);
  pdf.text('Referring Doctor:', 120, yPosition + 12);

  pdf.setFont(undefined, 'normal');
  pdf.text(`${report.test.testType} - ${report.test.testName}`, 150, yPosition);
  pdf.text(`${new Date(report.dates.sampleCollectionDate).toLocaleDateString()}`, 150, yPosition + 6);
  pdf.text(`${report.patient.doctorName}`, 150, yPosition + 12);

  yPosition += 30;

  // Patient Information Box
  addColoredRect(15, yPosition - 3, 180, 25, backgroundColor);
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(...primaryColor);
  pdf.text('PATIENT INFORMATION', 20, yPosition + 2);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Name: ${report.patient.name}`, 25, yPosition + 8);
  pdf.text(`Age: ${report.patient.age} years`, 85, yPosition + 8);
  pdf.text(`Gender: ${report.patient.gender}`, 135, yPosition + 8);
  pdf.text(`Contact: ${report.patient.contactNo || 'N/A'}`, 25, yPosition + 14);
  pdf.text(`Email: ${report.patient.email || 'N/A'}`, 85, yPosition + 14);

  yPosition += 35;

  // Test Results Header
  addColoredRect(15, yPosition - 3, 180, 12, primaryColor);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text('TEST RESULTS', 20, yPosition + 3);

  yPosition += 15;
  // Results table
  const tableHeaders = ['Parameter', 'Result', 'Unit', 'Reference Range', 'Status'];
  const colWidths = [60, 25, 20, 45, 25];
  let xPos = 20;

  // Header row
  pdf.setFillColor(...secondaryColor);
  pdf.rect(15, yPosition - 3, 180, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'bold');

  tableHeaders.forEach((header, index) => {
    pdf.text(header, xPos + colWidths[index] / 2, yPosition + 2, { align: 'center' });
    xPos += colWidths[index];
  });

  yPosition += 10;

  // Results rows
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'normal');

  report.results.forEach((result, index) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    // Alternate row colors
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(15, yPosition - 3, 180, 8, 'F');
    }

    xPos = 20;
    const rowData = [
      result.parameterName,
      result.value || 'Pending',
      result.unit,
      result.normalRange,
      result.isAbnormal ? 'Abnormal' : 'Normal'
    ];

    rowData.forEach((value, colIndex) => {
      let textColor = [0, 0, 0];
      if (colIndex === 4) {
        textColor = result.isAbnormal ? accentColor : normalColor;
      }
      pdf.setTextColor(...textColor);
      pdf.text(String(value), xPos + colWidths[colIndex] / 2, yPosition + 2, { align: 'center' });
      xPos += colWidths[colIndex];
    });

    yPosition += 8;
  });

  yPosition += 10;

  // Notes section
  if (report.notes) {
    pdf.setTextColor(...primaryColor);
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('CLINICAL NOTES:', 20, yPosition);
    yPosition += 6;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    const noteLines = pdf.splitTextToSize(report.notes, 170);
    pdf.text(noteLines, 20, yPosition);
    yPosition += noteLines.length * 4 + 5;
  }

  // QR Code for report verification
  try {
    const qrData = `Report ID: ${report.reportId}\nPatient: ${report.patient.name}\nDate: ${new Date(report.dates.reportDate).toLocaleDateString()}\nVerified by: ${labSettings?.labName || 'Advanced Diagnostic Center'}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 80, margin: 1 });
    pdf.addImage(qrCodeDataURL, 'PNG', 160, yPosition - 20, 25, 25);
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Scan for Verification', 167, yPosition + 8);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Footer
  yPosition = 270;
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'italic');
  pdf.setTextColor(100, 100, 100);
  pdf.text('This is a computer-generated report. For any queries, please contact the laboratory.', 105, yPosition, { align: 'center' });
  pdf.text(`Generated on ${new Date().toLocaleString()}`, 105, yPosition + 5, { align: 'center' });

  if (labSettings?.disclaimer) {
    pdf.text(labSettings.disclaimer, 105, yPosition + 10, { align: 'center', maxWidth: 180 });
  }

  return pdf;
};

export const downloadPDF = (pdf, filename) => {
  pdf.save(`${filename}.pdf`);
};
