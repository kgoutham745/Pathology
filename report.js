const REPORTS = {
  cbc: {
    title: "Complete Blood Count (CBC)",
    parameters: [
      { name: "Hemoglobin", unit: "g/dL", normal: "13–17" },
      { name: "RBC Count", unit: "mill/cmm", normal: "4.5–5.9" },
      { name: "WBC Count", unit: "/cmm", normal: "4000–11000" },
      { name: "Platelet Count", unit: "lakh/cmm", normal: "1.5–4.5" }
    ]
  },

  lft: {
    title: "Liver Function Test (LFT)",
    parameters: [
      { name: "Total Bilirubin", unit: "mg/dL", normal: "0.3–1.2" },
      { name: "SGOT (AST)", unit: "U/L", normal: "<40" },
      { name: "SGPT (ALT)", unit: "U/L", normal: "<40" },
      { name: "Alkaline Phosphatase", unit: "U/L", normal: "44–147" }
    ]
  }
};
