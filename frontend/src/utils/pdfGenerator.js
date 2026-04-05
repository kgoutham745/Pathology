import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReportDocument, { buildReportDocumentModel } from '../components/ReportDocument';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const waitForImages = async (element) => {
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(images.map((image) => {
    if (image.complete) return Promise.resolve();

    return new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
    });
  }));
};

const waitForLayout = async () => {
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
};

const renderReportDocumentToCanvas = async (report, labSettings) => {
  const model = buildReportDocumentModel(report, labSettings);
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.zIndex = '-1';
  container.style.pointerEvents = 'none';
  container.style.background = '#ffffff';

  container.innerHTML = renderToStaticMarkup(React.createElement(ReportDocument, { model }));
  document.body.appendChild(container);

  try {
    const documentNode = container.firstElementChild;
    await waitForImages(container);
    await waitForLayout();

    return await html2canvas(documentNode, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
  } finally {
    document.body.removeChild(container);
  }
};

const buildPdfFromCanvas = (canvas) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');
  const imgWidth = A4_WIDTH_MM;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= A4_HEIGHT_MM;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= A4_HEIGHT_MM;
  }

  return pdf;
};

export const generatePDFFromHTML = async (element, filename) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const pdf = buildPdfFromCanvas(canvas);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generatePDFReport = async (report, labSettings) => {
  const canvas = await renderReportDocumentToCanvas(report, labSettings);
  return buildPdfFromCanvas(canvas);
};

export const downloadPDF = (pdf, filename) => {
  pdf.save(`${filename}.pdf`);
};
