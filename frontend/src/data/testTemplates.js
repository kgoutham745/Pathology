export const testTemplates = {
  cbc: {
    testId: 'cbc',
    testName: 'Complete Blood Count (CBC)',
    testType: 'Hematology',
    description: 'Measures various components of blood cells',
    sampleType: 'EDTA Whole Blood',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'hb',
        parameterName: 'Hemoglobin',
        unit: 'g/dL',
        normalRange: '13-17 (M), 12-15.5 (F)',
        normalRangeMin: 13,
        normalRangeMax: 17,
        description: 'Oxygen-carrying protein in blood'
      },
      {
        parameterId: 'rbc',
        parameterName: 'RBC Count',
        unit: 'million/cmm',
        normalRange: '4.5-5.9 (M), 4.1-5.1 (F)',
        normalRangeMin: 4.5,
        normalRangeMax: 5.9,
        description: 'Red blood cells count'
      },
      {
        parameterId: 'wbc',
        parameterName: 'WBC Count',
        unit: '/cmm',
        normalRange: '4000-11000',
        normalRangeMin: 4000,
        normalRangeMax: 11000,
        description: 'White blood cells count'
      },
      {
        parameterId: 'platelet',
        parameterName: 'Platelet Count',
        unit: 'lakh/cmm',
        normalRange: '1.5-4.5',
        normalRangeMin: 1.5,
        normalRangeMax: 4.5,
        description: 'Platelets for blood clotting'
      },
      {
        parameterId: 'hct',
        parameterName: 'Hematocrit',
        unit: '%',
        normalRange: '41-53 (M), 36-46 (F)',
        normalRangeMin: 41,
        normalRangeMax: 53,
        description: 'Percentage of red blood cells'
      }
    ]
  },

  lft: {
    testId: 'lft',
    testName: 'Liver Function Test (LFT)',
    testType: 'Biochemistry',
    description: 'Assesses liver health and function',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'tbili',
        parameterName: 'Total Bilirubin',
        unit: 'mg/dL',
        normalRange: '0.3-1.2',
        normalRangeMin: 0.3,
        normalRangeMax: 1.2,
        description: 'Total bilirubin level'
      },
      {
        parameterId: 'sgot',
        parameterName: 'SGOT (AST)',
        unit: 'U/L',
        normalRange: '<40',
        normalRangeMin: 0,
        normalRangeMax: 40,
        description: 'Liver enzyme'
      },
      {
        parameterId: 'sgpt',
        parameterName: 'SGPT (ALT)',
        unit: 'U/L',
        normalRange: '<40',
        normalRangeMin: 0,
        normalRangeMax: 40,
        description: 'Liver enzyme'
      },
      {
        parameterId: 'alp',
        parameterName: 'Alkaline Phosphatase',
        unit: 'U/L',
        normalRange: '44-147',
        normalRangeMin: 44,
        normalRangeMax: 147,
        description: 'Enzyme from liver and bone'
      },
      {
        parameterId: 'albumin',
        parameterName: 'Albumin',
        unit: 'g/dL',
        normalRange: '3.5-5.0',
        normalRangeMin: 3.5,
        normalRangeMax: 5.0,
        description: 'Protein produced by liver'
      }
    ]
  },

  rft: {
    testId: 'rft',
    testName: 'Renal Function Test (RFT)',
    testType: 'Biochemistry',
    description: 'Evaluates kidney function',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'creatinine',
        parameterName: 'Creatinine',
        unit: 'mg/dL',
        normalRange: '0.7-1.3 (M), 0.6-1.1 (F)',
        normalRangeMin: 0.7,
        normalRangeMax: 1.3,
        description: 'Kidney function indicator'
      },
      {
        parameterId: 'urea',
        parameterName: 'Blood Urea Nitrogen (BUN)',
        unit: 'mg/dL',
        normalRange: '7-20',
        normalRangeMin: 7,
        normalRangeMax: 20,
        description: 'Nitrogen in blood urea'
      },
      {
        parameterId: 'sodium',
        parameterName: 'Sodium',
        unit: 'mEq/L',
        normalRange: '135-146',
        normalRangeMin: 135,
        normalRangeMax: 146,
        description: 'Electrolyte balance'
      },
      {
        parameterId: 'potassium',
        parameterName: 'Potassium',
        unit: 'mEq/L',
        normalRange: '3.5-5.0',
        normalRangeMin: 3.5,
        normalRangeMax: 5.0,
        description: 'Electrolyte balance'
      }
    ]
  },

  thyroid: {
    testId: 'thyroid',
    testName: 'Thyroid Profile',
    testType: 'Endocrinology',
    description: 'Assesses thyroid gland function',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'tsh',
        parameterName: 'TSH',
        unit: 'mIU/L',
        normalRange: '0.27-4.2',
        normalRangeMin: 0.27,
        normalRangeMax: 4.2,
        description: 'Thyroid stimulating hormone'
      },
      {
        parameterId: 't3',
        parameterName: 'Free T3',
        unit: 'pg/mL',
        normalRange: '2.3-4.2',
        normalRangeMin: 2.3,
        normalRangeMax: 4.2,
        description: 'Free Triiodothyronine'
      },
      {
        parameterId: 't4',
        parameterName: 'Free T4',
        unit: 'ng/dL',
        normalRange: '0.8-1.8',
        normalRangeMin: 0.8,
        normalRangeMax: 1.8,
        description: 'Free Thyroxine'
      }
    ]
  },

  lipid: {
    testId: 'lipid',
    testName: 'Lipid Profile',
    testType: 'Biochemistry',
    description: 'Checks cholesterol and triglycerides',
    sampleType: 'Serum (Fasting)',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'cholesterol',
        parameterName: 'Total Cholesterol',
        unit: 'mg/dL',
        normalRange: '<200',
        normalRangeMin: 0,
        normalRangeMax: 200,
        description: 'Total blood cholesterol'
      },
      {
        parameterId: 'ldl',
        parameterName: 'LDL Cholesterol',
        unit: 'mg/dL',
        normalRange: '<100',
        normalRangeMin: 0,
        normalRangeMax: 100,
        description: 'Bad cholesterol'
      },
      {
        parameterId: 'hdl',
        parameterName: 'HDL Cholesterol',
        unit: 'mg/dL',
        normalRange: '>40 (M), >50 (F)',
        normalRangeMin: 40,
        normalRangeMax: 300,
        description: 'Good cholesterol'
      },
      {
        parameterId: 'triglyceride',
        parameterName: 'Triglycerides',
        unit: 'mg/dL',
        normalRange: '<150',
        normalRangeMin: 0,
        normalRangeMax: 150,
        description: 'Triglycerides level'
      }
    ]
  },

  blood_sugar: {
    testId: 'blood_sugar',
    testName: 'Blood Sugar (Glucose)',
    testType: 'Biochemistry',
    description: 'Measures blood glucose level',
    sampleType: 'Plasma (Fasting)',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'fbs',
        parameterName: 'Fasting Blood Sugar',
        unit: 'mg/dL',
        normalRange: '70-100',
        normalRangeMin: 70,
        normalRangeMax: 100,
        description: 'Blood glucose after fasting'
      },
      {
        parameterId: 'rbs',
        parameterName: 'Random Blood Sugar',
        unit: 'mg/dL',
        normalRange: '<140',
        normalRangeMin: 0,
        normalRangeMax: 140,
        description: 'Blood glucose random'
      }
    ]
  },

  electrolyte: {
    testId: 'electrolyte',
    testName: 'Electrolyte Panel',
    testType: 'Biochemistry',
    description: 'Evaluates key electrolytes for metabolic balance',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'sodium',
        parameterName: 'Sodium',
        unit: 'mEq/L',
        normalRange: '135-145',
        normalRangeMin: 135,
        normalRangeMax: 145,
        description: 'Major extracellular electrolyte'
      },
      {
        parameterId: 'potassium_e',
        parameterName: 'Potassium',
        unit: 'mEq/L',
        normalRange: '3.5-5.0',
        normalRangeMin: 3.5,
        normalRangeMax: 5.0,
        description: 'Important for nerve and muscle function'
      },
      {
        parameterId: 'chloride',
        parameterName: 'Chloride',
        unit: 'mEq/L',
        normalRange: '98-107',
        normalRangeMin: 98,
        normalRangeMax: 107,
        description: 'Maintains fluid balance and pH'
      },
      {
        parameterId: 'bicarbonate',
        parameterName: 'Bicarbonate (HCO3)',
        unit: 'mEq/L',
        normalRange: '22-29',
        normalRangeMin: 22,
        normalRangeMax: 29,
        description: 'Buffer system for acid-base balance'
      },
      {
        parameterId: 'calcium',
        parameterName: 'Calcium',
        unit: 'mg/dL',
        normalRange: '8.6-10.3',
        normalRangeMin: 8.6,
        normalRangeMax: 10.3,
        description: 'Bone and neuromuscular health indicator'
      }
    ]
  },

  hba1c: {
    testId: 'hba1c',
    testName: 'HbA1c',
    testType: 'Diabetes',
    description: 'Average blood sugar level over 2-3 months',
    sampleType: 'Whole Blood',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'hba1c',
        parameterName: 'HbA1c',
        unit: '%',
        normalRange: '<5.7',
        normalRangeMin: 0,
        normalRangeMax: 5.7,
        description: 'Glycated hemoglobin level'
      }
    ]
  },

  vitamin_d: {
    testId: 'vitamin_d',
    testName: 'Vitamin D',
    testType: 'Biochemistry',
    description: 'Measures vitamin D status for bone health',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'vitamin_d_25oh',
        parameterName: '25-OH Vitamin D',
        unit: 'ng/mL',
        normalRange: '30-100',
        normalRangeMin: 30,
        normalRangeMax: 100,
        description: 'Primary circulating form of vitamin D'
      }
    ]
  },

  coagulation: {
    testId: 'coagulation',
    testName: 'Coagulation Profile',
    testType: 'Hematology',
    description: 'Assesses blood clotting function',
    sampleType: 'Citrated Plasma',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'pt',
        parameterName: 'Prothrombin Time (PT)',
        unit: 'seconds',
        normalRange: '11-13.5',
        normalRangeMin: 11,
        normalRangeMax: 13.5,
        description: 'Time for blood to clot'
      },
      {
        parameterId: 'inr',
        parameterName: 'INR',
        unit: 'ratio',
        normalRange: '0.8-1.2',
        normalRangeMin: 0.8,
        normalRangeMax: 1.2,
        description: 'Standardized clotting measure'
      },
      {
        parameterId: 'aptt',
        parameterName: 'APTT',
        unit: 'seconds',
        normalRange: '25-40',
        normalRangeMin: 25,
        normalRangeMax: 40,
        description: 'Intrinsic clotting pathway time'
      },
      {
        parameterId: 'fibrinogen',
        parameterName: 'Fibrinogen',
        unit: 'mg/dL',
        normalRange: '200-400',
        normalRangeMin: 200,
        normalRangeMax: 400,
        description: 'Clot formation protein'
      }
    ]
  },

  urine: {
    testId: 'urine',
    testName: 'Urine Routine',
    testType: 'Urinalysis',
    description: 'Complete urinalysis examination',
    sampleType: 'Early Morning Urine',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'color',
        parameterName: 'Color',
        unit: 'Visual',
        normalRange: 'Pale to Dark Yellow',
        description: 'Urine color'
      },
      {
        parameterId: 'clarity',
        parameterName: 'Clarity',
        unit: 'Visual',
        normalRange: 'Clear',
        description: 'Urine clarity'
      },
      {
        parameterId: 'ph',
        parameterName: 'pH',
        unit: 'Units',
        normalRange: '4.5-8.0',
        normalRangeMin: 4.5,
        normalRangeMax: 8.0,
        description: 'Urine acidity'
      },
      {
        parameterId: 'glucose',
        parameterName: 'Glucose',
        unit: 'mg/dL',
        normalRange: 'Negative',
        description: 'Urine glucose'
      },
      {
        parameterId: 'protein',
        parameterName: 'Protein',
        unit: 'mg/dL',
        normalRange: 'Negative',
        description: 'Urine protein'
      }
    ]
  },

  culture: {
    testId: 'culture',
    testName: 'Blood Culture',
    testType: 'Microbiology',
    description: 'Tests for blood-borne infections',
    sampleType: 'Blood',
    turnaroundTime: '3-5 days',
    parameters: [
      {
        parameterId: 'organism',
        parameterName: 'Organism Identified',
        unit: 'Text',
        normalRange: 'No Growth',
        description: 'Bacterial organism'
      },
      {
        parameterId: 'susceptibility',
        parameterName: 'Antibiotic Susceptibility',
        unit: 'Report',
        normalRange: 'Sensitive',
        description: 'Antibiotic sensitivity'
      }
    ]
  }
};

export const getTestTemplate = (testId) => {
  return testTemplates[testId] || null;
};

export const getAllTestTemplates = () => {
  return Object.values(testTemplates);
};
