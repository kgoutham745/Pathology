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

  const primaryColor = [11, 84, 148];
  const secondaryColor = [34, 45, 73];
  const accentColor = [231, 76, 60];
  const normalColor = [46, 204, 113];
  const backgroundColor = [245, 245, 245];

  const addColoredRect = (x, y, w, h, color) => {
    pdf.setFillColor(...color);
    pdf.rect(x, y, w, h, 'F');
  };

  // Header block
  addColoredRect(0, 0, 210, 48, primaryColor);
  pdf.setFillColor(255, 255, 255);
  pdf.rect(15, 15, 180, 30, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont(undefined, 'bold');
  pdf.text(labSettings?.labName || 'ADVANCED DIAGNOSTIC CENTER', 105, 14, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(labSettings?.address || '123 Medical Plaza, Healthcare City, HC 12345', 105, 20, { align: 'center' });
  pdf.text(`Phone: ${labSettings?.phone || '+1-234-567-8900'} | Email: ${labSettings?.email || 'info@advdiagnostic.com'}`, 105, 25, { align: 'center' });
  pdf.text(`Website: ${labSettings?.website || 'www.labexample.com'}`, 105, 30, { align: 'center' });

  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.8);
  pdf.line(15, 47, 195, 47);

  yPosition = 55;

  // Report title bar
  addColoredRect(15, yPosition - 4, 180, 10, secondaryColor);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('PATHOLOGY REPORT', 105, yPosition + 3, { align: 'center' });

  yPosition += 15;

  // Report metadata
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  pdf.text('Report ID:', 20, yPosition);
  pdf.text('Patient ID:', 20, yPosition + 6);
  pdf.text('Report Date:', 20, yPosition + 12);
  pdf.text('Report Time:', 20, yPosition + 18);

  pdf.setFont(undefined, 'normal');
  pdf.text(`${report.reportId}`, 45, yPosition);
  pdf.text(`${report.patient.patientId || 'N/A'}`, 45, yPosition + 6);
  pdf.text(`${new Date(report.dates.reportDate).toLocaleDateString()}`, 45, yPosition + 12);
  pdf.text(`${new Date().toLocaleTimeString()}`, 45, yPosition + 18);

  pdf.setFont(undefined, 'bold');
  pdf.text('Test Type:', 120, yPosition);
  pdf.text('Sample Date:', 120, yPosition + 6);
  pdf.text('Referring Doctor:', 120, yPosition + 12);

  pdf.setFont(undefined, 'normal');
  pdf.text(`${report.test.testType || ''} - ${report.test.testName || ''}`, 150, yPosition);
  pdf.text(`${new Date(report.dates.sampleCollectionDate).toLocaleDateString()}`, 150, yPosition + 6);
  pdf.text(`${report.patient.doctorName || 'N/A'}`, 150, yPosition + 12);

  yPosition += 24;

  // Patient Information Box
  addColoredRect(15, yPosition - 4, 180, 28, backgroundColor);
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...secondaryColor);
  pdf.text('PATIENT INFORMATION', 20, yPosition + 2);

  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Name: ${report.patient.name}`, 25, yPosition + 9);
  pdf.text(`Age: ${report.patient.age} years`, 80, yPosition + 9);
  pdf.text(`Gender: ${report.patient.gender}`, 125, yPosition + 9);
  pdf.text(`Contact: ${report.patient.contactNo || 'N/A'}`, 25, yPosition + 15);
  pdf.text(`Email: ${report.patient.email || 'N/A'}`, 90, yPosition + 15);

  yPosition += 35;

  // Results header
  addColoredRect(15, yPosition - 4, 180, 10, primaryColor);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.text('TEST RESULTS', 20, yPosition + 3);

  yPosition += 12;

  const tableHeaders = ['Parameter', 'Result', 'Unit', 'Reference', 'Status'];
  const colWidths = [60, 25, 20, 55, 30];
  let xPos = 20;

  pdf.setFillColor(...secondaryColor);
  pdf.rect(15, yPosition - 4, 180, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'bold');

  tableHeaders.forEach((header, index) => {
    pdf.text(header, xPos + colWidths[index] / 2, yPosition + 2, { align: 'center' });
    xPos += colWidths[index];
  });

  yPosition += 10;
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(8);

  report.results.forEach((result, index) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(15, yPosition - 4, 180, 8, 'F');
    }

    xPos = 20;
    const rowData = [
      result.parameterName,
      result.value || 'Pending',
      result.unit,
      result.normalRange,
      result.isAbnormal ? (result.abnormalType === 'low' ? 'LOW' : 'HIGH') : 'Normal'
    ];

    rowData.forEach((value, colIndex) => {
      let textColor = [0, 0, 0];
      if (colIndex === 4) {
        if (result.isAbnormal) {
          textColor = result.abnormalType === 'low' ? [199, 133, 0] : accentColor;
        } else {
          textColor = normalColor;
        }
      }
      pdf.setTextColor(...textColor);
      pdf.text(String(value), xPos + colWidths[colIndex] / 2, yPosition + 2, { align: 'center' });
      xPos += colWidths[colIndex];
    });

    yPosition += 8;
  });

  const abnormalResults = report.results.filter((result) => result.isAbnormal);
  if (abnormalResults.length > 0) {
    yPosition += 6;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.text('Possible Causes of Abnormal Parameters', 20, yPosition);
    yPosition += 7;

    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);

    abnormalResults.forEach((result) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      const causeText = result.possibleCause ||
        (result.abnormalType === 'high'
          ? `Elevated ${result.parameterName} may indicate inflammation, infection, dehydration, or metabolic imbalance.`
          : `Low ${result.parameterName} may indicate anemia, deficiency, malabsorption, or organ dysfunction.`);
      const wrapped = pdf.splitTextToSize(`• ${causeText}`, 170);
      pdf.text(wrapped, 20, yPosition);
      yPosition += wrapped.length * 4 + 2;
    });
  }

  if (report.notes) {
    yPosition += 8;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setTextColor(...primaryColor);
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('CLINICAL NOTES:', 20, yPosition);
    yPosition += 6;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    const noteLines = pdf.splitTextToSize(report.notes, 170);
    pdf.text(noteLines, 20, yPosition);
    yPosition += noteLines.length * 4 + 5;
  }

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
