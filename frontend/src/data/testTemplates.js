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
        parameterId: 'neutrophils',
        parameterName: 'Neutrophils',
        unit: '%',
        normalRange: '50-70',
        normalRangeMin: 50,
        normalRangeMax: 70,
        description: 'Neutrophil percentage'
      },
      {
        parameterId: 'lymphocytes',
        parameterName: 'Lymphocytes',
        unit: '%',
        normalRange: '20-40',
        normalRangeMin: 20,
        normalRangeMax: 40,
        description: 'Lymphocyte percentage'
      },
      {
        parameterId: 'eosinophils',
        parameterName: 'Eosinophils',
        unit: '%',
        normalRange: '1-6',
        normalRangeMin: 1,
        normalRangeMax: 6,
        description: 'Eosinophil percentage'
      },
      {
        parameterId: 'monocytes',
        parameterName: 'Monocytes',
        unit: '%',
        normalRange: '2-8',
        normalRangeMin: 2,
        normalRangeMax: 8,
        description: 'Monocyte percentage'
      },
      {
        parameterId: 'basophils',
        parameterName: 'Basophils',
        unit: '%',
        normalRange: '0-1',
        normalRangeMin: 0,
        normalRangeMax: 1,
        description: 'Basophil percentage'
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
      },
      {
        parameterId: 'mcv',
        parameterName: 'MCV',
        unit: 'fL',
        normalRange: '80-100',
        normalRangeMin: 80,
        normalRangeMax: 100,
        description: 'Mean corpuscular volume'
      },
      {
        parameterId: 'mch',
        parameterName: 'MCH',
        unit: 'pg',
        normalRange: '27-32',
        normalRangeMin: 27,
        normalRangeMax: 32,
        description: 'Mean corpuscular hemoglobin'
      },
      {
        parameterId: 'mchc',
        parameterName: 'MCHC',
        unit: 'g/dL',
        normalRange: '32-36',
        normalRangeMin: 32,
        normalRangeMax: 36,
        description: 'Mean corpuscular hemoglobin concentration'
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

Object.assign(testTemplates, {
  esr: {
    testId: 'esr',
    testName: 'Erythrocyte Sedimentation Rate (ESR)',
    testType: 'Hematology',
    description: 'A screening marker that helps evaluate inflammation or infection.',
    sampleType: 'EDTA Whole Blood',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'esr_value',
        parameterName: 'ESR',
        unit: 'mm/hr',
        normalRange: '0-20',
        normalRangeMin: 0,
        normalRangeMax: 20,
        description: 'Sedimentation rate of red blood cells'
      }
    ]
  },
  crp: {
    testId: 'crp',
    testName: 'C-Reactive Protein (CRP)',
    testType: 'Immunology',
    description: 'Used to assess acute inflammation, infection, and response to treatment.',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      {
        parameterId: 'crp_value',
        parameterName: 'CRP',
        unit: 'mg/L',
        normalRange: '<5',
        normalRangeMin: 0,
        normalRangeMax: 5,
        description: 'Acute phase inflammatory marker'
      }
    ]
  },
  dengue: {
    testId: 'dengue',
    testName: 'Dengue Profile',
    testType: 'Serology',
    description: 'Supports diagnosis of dengue infection through antigen and antibody markers.',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'ns1', parameterName: 'NS1 Antigen', unit: 'Result', normalRange: 'Negative', description: 'Early dengue marker' },
      { parameterId: 'igm', parameterName: 'Dengue IgM', unit: 'Result', normalRange: 'Negative', description: 'Recent infection marker' },
      { parameterId: 'igg', parameterName: 'Dengue IgG', unit: 'Result', normalRange: 'Negative', description: 'Past exposure marker' }
    ]
  },
  malaria: {
    testId: 'malaria',
    testName: 'Malaria Parasite Test',
    testType: 'Microbiology',
    description: 'Screens for malarial parasite infection in peripheral blood.',
    sampleType: 'Peripheral Blood',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'mp', parameterName: 'Malarial Parasite', unit: 'Result', normalRange: 'Negative', description: 'Presence of malaria parasite' },
      { parameterId: 'species', parameterName: 'Species', unit: 'Text', normalRange: 'Not Detected', description: 'Detected malaria species if positive' }
    ]
  },
  iron_profile: {
    testId: 'iron_profile',
    testName: 'Iron Profile',
    testType: 'Biochemistry',
    description: 'Assesses iron status in suspected anemia and nutritional deficiency.',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'serum_iron', parameterName: 'Serum Iron', unit: 'ug/dL', normalRange: '60-170', normalRangeMin: 60, normalRangeMax: 170, description: 'Circulating iron level' },
      { parameterId: 'tibc', parameterName: 'TIBC', unit: 'ug/dL', normalRange: '240-450', normalRangeMin: 240, normalRangeMax: 450, description: 'Total iron binding capacity' },
      { parameterId: 'ferritin', parameterName: 'Ferritin', unit: 'ng/mL', normalRange: '30-400', normalRangeMin: 30, normalRangeMax: 400, description: 'Iron stores marker' }
    ]
  },
  cardiac_markers: {
    testId: 'cardiac_markers',
    testName: 'Cardiac Markers',
    testType: 'Cardiology',
    description: 'Supports evaluation of myocardial injury and acute cardiac events.',
    sampleType: 'Serum',
    turnaroundTime: '6 hours',
    parameters: [
      { parameterId: 'troponin', parameterName: 'Troponin I', unit: 'ng/mL', normalRange: '<0.04', normalRangeMin: 0, normalRangeMax: 0.04, description: 'Cardiac injury marker' },
      { parameterId: 'ckmb', parameterName: 'CK-MB', unit: 'U/L', normalRange: '0-25', normalRangeMin: 0, normalRangeMax: 25, description: 'Cardiac muscle enzyme' }
    ]
  },
  amylase_lipase: {
    testId: 'amylase_lipase',
    testName: 'Amylase & Lipase',
    testType: 'Biochemistry',
    description: 'Used in evaluating pancreatic inflammation and abdominal pain.',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'amylase', parameterName: 'Amylase', unit: 'U/L', normalRange: '30-110', normalRangeMin: 30, normalRangeMax: 110, description: 'Pancreatic and salivary enzyme' },
      { parameterId: 'lipase', parameterName: 'Lipase', unit: 'U/L', normalRange: '13-60', normalRangeMin: 13, normalRangeMax: 60, description: 'Pancreatic enzyme marker' }
    ]
  },
  stool_routine: {
    testId: 'stool_routine',
    testName: 'Stool Routine Examination',
    testType: 'Microbiology',
    description: 'Evaluates infection, bleeding, parasites, and digestive abnormalities.',
    sampleType: 'Stool Sample',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'stool_color', parameterName: 'Color', unit: 'Visual', normalRange: 'Brown', description: 'Stool color appearance' },
      { parameterId: 'stool_consistency', parameterName: 'Consistency', unit: 'Visual', normalRange: 'Formed', description: 'Stool consistency' },
      { parameterId: 'occult_blood', parameterName: 'Occult Blood', unit: 'Result', normalRange: 'Negative', description: 'Hidden blood in stool' },
      { parameterId: 'ova_cyst', parameterName: 'Ova / Cyst', unit: 'Result', normalRange: 'Not Seen', description: 'Parasitic elements in stool' }
    ]
  },
  hiv_screening: {
    testId: 'hiv_screening',
    testName: 'HIV Screening',
    testType: 'Serology',
    description: 'Initial screening test for HIV infection.',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'hiv_result', parameterName: 'HIV 1 & 2', unit: 'Result', normalRange: 'Non Reactive', description: 'HIV screening result' }
    ]
  },
  hepatitis_profile: {
    testId: 'hepatitis_profile',
    testName: 'Hepatitis Profile',
    testType: 'Serology',
    description: 'Screens for common hepatitis viral markers for liver infection evaluation.',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'hbsag', parameterName: 'HBsAg', unit: 'Result', normalRange: 'Negative', description: 'Hepatitis B surface antigen' },
      { parameterId: 'anti_hcv', parameterName: 'Anti-HCV', unit: 'Result', normalRange: 'Negative', description: 'Hepatitis C antibody' }
    ]
  },
  prolactin: {
    testId: 'prolactin',
    testName: 'Prolactin',
    testType: 'Endocrinology',
    description: 'Helps assess pituitary function and reproductive hormone imbalance.',
    sampleType: 'Serum',
    turnaroundTime: '24 hours',
    parameters: [
      { parameterId: 'prolactin_value', parameterName: 'Prolactin', unit: 'ng/mL', normalRange: '4-23', normalRangeMin: 4, normalRangeMax: 23, description: 'Pituitary hormone level' }
    ]
  }
});

export const getTestTemplate = (testId) => {
  return testTemplates[testId] || null;
};

export const getAllTestTemplates = () => {
  return Object.values(testTemplates);
};
