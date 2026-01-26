function loadReport() {
  const type = document.getElementById("reportType").value;
  const container = document.getElementById("inputs");
  container.innerHTML = "";

  if (!REPORTS[type]) return;

  REPORTS[type].parameters.forEach((p, i) => {
    container.innerHTML += `
      <label>${p.name} (${p.unit})</label>
      <input id="param_${i}" placeholder="Enter value" />
    `;
  });
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const type = document.getElementById("reportType").value;
  const report = REPORTS[type];

  let y = 20;

  // Header
  pdf.setFontSize(18);
  pdf.text("ABC DIAGNOSTIC LAB", 105, y, { align: "center" });
  y += 10;

  pdf.setFontSize(12);
  pdf.text(`Patient: ${name} | Age: ${age} | Gender: ${gender}`, 20, y);
  y += 10;

  pdf.text(report.title, 20, y);
  y += 10;

  // Table Header
  pdf.setFontSize(11);
  pdf.text("Test", 20, y);
  pdf.text("Result", 90, y);
  pdf.text("Normal Range", 140, y);
  y += 5;

  pdf.line(20, y, 190, y);
  y += 5;

  // Data
  report.parameters.forEach((p, i) => {
    const value = document.getElementById(`param_${i}`).value;
    pdf.text(p.name, 20, y);
    pdf.text(value, 90, y);
    pdf.text(p.normal, 140, y);
    y += 8;
  });

  // Footer
  y += 20;
  pdf.text("Authorized Signatory", 140, y);

  pdf.save(`${name}_${type}_report.pdf`);
}
