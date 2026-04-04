# 📖 Complete Documentation Index

## Start Here! 👇

1. **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
2. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What was built
3. **[README.md](./README.md)** - Full feature overview
4. **[SETUP.md](./SETUP.md)** - Detailed installation guide
5. **[FEATURES.md](./FEATURES.md)** - In-depth feature documentation

---

## 🗂️ Directory Structure Explained

### `/backend` - Express.js Server

```
backend/
├── src/
│   ├── models/              # MongoDB Schemas
│   │   ├── Report.js        # Report data structure
│   │   ├── Patient.js       # Patient data structure
│   │   ├── TestTemplate.js  # Test templates
│   │   └── LabSettings.js   # Lab configuration
│   │
│   ├── controllers/         # Business Logic
│   │   ├── reportController.js     # Report CRUD
│   │   ├── patientController.js    # Patient CRUD
│   │   ├── testController.js       # Test CRUD
│   │   └── labController.js        # Lab settings
│   │
│   ├── routes/              # API Endpoints
│   │   ├── reportRoutes.js         # /api/reports
│   │   ├── patientRoutes.js        # /api/patients
│   │   ├── testRoutes.js           # /api/tests
│   │   └── labRoutes.js            # /api/lab
│   │
│   ├── utils/
│   │   └── helpers.js       # Utility functions
│   │
│   └── server.js            # Express app entry point
│
├── package.json             # Dependencies
├── .env.example            # Environment template
└── README.md               # Backend specific info
```

### `/frontend` - React Vite App

```
frontend/
├── src/
│   ├── components/         # Reusable Components
│   │   ├── UIComponents.jsx    # Base UI elements
│   │   ├── Header.jsx          # Navigation
│   │   ├── Footer.jsx          # Footer
│   │   ├── ReportCard.jsx      # Report display
│   │   └── ReportPreview.jsx   # Report details
│   │
│   ├── pages/               # Page Components
│   │   ├── Dashboard.jsx       # Home page
│   │   ├── ReportGenerator.jsx # Create report
│   │   ├── ReportHistory.jsx   # View reports
│   │   ├── LabSettings.jsx     # Settings
│   │   └── NotFound.jsx        # 404 page
│   │
│   ├── utils/               # Utilities
│   │   ├── api.js             # API client (Axios)
│   │   ├── pdfGenerator.js    # PDF creation
│   │   └── validators.js      # Form validation
│   │
│   ├── context/             # State Management
│   │   ├── themeStore.js      # Dark/Light mode
│   │   └── reportStore.js     # Report state
│   │
│   ├── data/                # Static Data
│   │   └── testTemplates.js   # Test definitions
│   │
│   ├── index.css            # Global styles
│   ├── App.jsx              # Main app
│   └── main.jsx             # React entry
│
├── public/                  # Static files
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
└── README.md               # Frontend specific info
```

---

## 🔑 Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `server.js` | Express app setup, middleware, routes |
| `Report.js` | Report data model schema |
| `Patient.js` | Patient data model schema |
| `TestTemplate.js` | Test type definitions |
| `LabSettings.js` | Lab configuration schema |
| `reportController.js` | Report CRUD operations |
| `patientController.js` | Patient management |
| `testController.js` | Test template management |
| `labController.js` | Lab settings management |
| `*Routes.js` | API endpoint definitions |
| `helpers.js` | ID generation, formatting, validation |

### Frontend

| File | Purpose |
|------|---------|
| `App.jsx` | Main app, routing setup |
| `main.jsx` | React entry point |
| `index.css` | Global styles, Tailwind imports |
| `UIComponents.jsx` | Reusable button, input, card components |
| `Header.jsx` | Top navigation, theme toggle |
| `Footer.jsx` | Footer with links |
| `Dashboard.jsx` | Home page, statistics |
| `ReportGenerator.jsx` | 3-step report creation |
| `ReportHistory.jsx` | Report search and management |
| `LabSettings.jsx` | Lab configuration page |
| `api.js` | Axios API calls |
| `pdfGenerator.js` | PDF file generation |
| `validators.js` | Form validation logic |
| `testTemplates.js` | Test type definitions |
| `themeStore.js` | Theme state (dark/light) |
| `reportStore.js` | Report state management |

---

## 🔌 API Endpoints

### Reports
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/reports` | Create report |
| GET | `/api/reports` | Get all reports |
| GET | `/api/reports/:id` | Get specific report |
| GET | `/api/reports/report/:reportId` | Get by report ID |
| GET | `/api/reports/patient/:patientId` | Get patient reports |
| GET | `/api/reports/search` | Search reports |
| PUT | `/api/reports/:id` | Update report |
| DELETE | `/api/reports/:id` | Delete report |

### Patients
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/patients` | Create patient |
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/:id` | Get specific patient |
| GET | `/api/patients/search` | Search patients |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |

### Tests
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tests` | Get all test types |
| GET | `/api/tests/:id` | Get test by ID |
| GET | `/api/tests/code/:testId` | Get test by code |
| POST | `/api/tests` | Create test template |
| PUT | `/api/tests/:id` | Update test |
| DELETE | `/api/tests/:id` | Delete test |

### Lab Settings
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/lab/settings` | Get lab settings |
| PUT | `/api/lab/settings` | Update settings |
| POST | `/api/lab/logo` | Upload logo |

---

## 🧪 Test Types & Parameters

### 1. CBC (Complete Blood Count)
- Hemoglobin (g/dL): 13-17
- RBC Count (mill/cmm): 4.5-5.9
- WBC Count (/cmm): 4000-11000
- Platelet Count (lakh/cmm): 1.5-4.5
- Hematocrit (%): 41-53

### 2. LFT (Liver Function Test)
- Total Bilirubin (mg/dL): 0.3-1.2
- SGOT (U/L): <40
- SGPT (U/L): <40
- Alkaline Phosphatase (U/L): 44-147
- Albumin (g/dL): 3.5-5.0

### 3. RFT (Renal Function Test)
- Creatinine (mg/dL): 0.7-1.3
- BUN (mg/dL): 7-20
- Sodium (mEq/L): 135-146
- Potassium (mEq/L): 3.5-5.0

### 4. Thyroid Profile
- TSH (mIU/L): 0.27-4.2
- Free T3 (pg/mL): 2.3-4.2
- Free T4 (ng/dL): 0.8-1.8

### 5. Lipid Profile
- Total Cholesterol (mg/dL): <200
- LDL (mg/dL): <100
- HDL (mg/dL): >40 (M/F)
- Triglycerides (mg/dL): <150

### 6. Blood Sugar
- Fasting Blood Sugar (mg/dL): 70-100
- Random Blood Sugar (mg/dL): <140

### 7. Urine Routine
- Color (Visual): Pale to Dark Yellow
- Clarity (Visual): Clear
- pH (Units): 4.5-8.0
- Glucose: Negative
- Protein: Negative

### 8. Blood Culture
- Organism Identified (Text): No Growth
- Antibiotic Susceptibility (Report): Sensitive

---

## 🎨 UI Components Summary

### Base Components (UIComponents.jsx)
- `Badge` - Status indicator (Normal/Abnormal)
- `Card` - Container with shadow
- `Button` - Interactive button (primary/secondary/danger)
- `Input` - Text input field
- `Select` - Dropdown selector
- `Textarea` - Multi-line text
- `Loading` - Spinner animation
- `Modal` - Dialog box
- `Alert` - Message display

### Layout Components
- `Header` - Navigation bar with theme toggle
- `Footer` - Footer section

### Feature Components
- `ReportCard` - Report display card
- `ReportPreview` - Detailed report view

---

## 🚀 Workflow Diagrams

### Report Generation Flow
```
Dashboard
    ↓
Generate Report (Page)
    ↓
Step 1: Patient Info Form
    ↓
Step 2: Select Test Type
    ↓
Step 3: Enter Test Values
    ↓
Review & Generate
    ↓
API POST /api/reports
    ↓
MongoDB Save
    ↓
PDF Download Available
    ↓
Report History
```

### Report Search Flow
```
Report History Page
    ↓
Search Input
    ↓
Real-time Filter
    ↓
Display Results (Card/Table)
    ↓
Select Report
    ↓
Preview Details
    ↓
Actions: Download/Edit/Delete
```

### PDF Generation Flow
```
Report Data
    ↓
Lab Settings (Logo, Colors)
    ↓
formatPDF()
    ↓
Add Header (Lab Info)
    ↓
Add Patient Info
    ↓
Add Results Table
    ↓
Add Footer & Disclaimer
    ↓
Download as PDF
```

---

## 📊 Data Models

### Report Schema
```javascript
{
  reportId: String,
  patient: {
    name: String,
    age: Number,
    gender: String,
    patientId: String,
    doctorName: String
  },
  test: {
    testId: String,
    testName: String,
    testType: String
  },
  results: [{
    parameterId: String,
    parameterName: String,
    value: Number,
    unit: String,
    normalRange: String,
    isAbnormal: Boolean
  }],
  dates: {
    sampleCollectionDate: Date,
    reportDate: Date
  },
  labDetails: {...},
  status: 'draft' | 'completed' | 'verified',
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pathology_db
NODE_ENV=development
JWT_SECRET=pathology_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend
No .env needed (uses API at http://localhost:5000)

---

## 📱 Responsive Breakpoints

- **Mobile**: <640px
- **Tablet**: 640px - 1024px
- **Desktop**: >1024px

---

## 🎨 Color Scheme

### Light Mode
- Primary: #2563eb (Blue)
- Secondary: #10b981 (Green)
- Background: #ffffff (White)
- Text: #111827 (Dark Gray)

### Dark Mode
- Primary: #2563eb (Blue)
- Secondary: #10b981 (Green)
- Background: #0f172a (Dark)
- Text: #ffffff (White)

### Status Colors
- Normal: #10b981 (Green)
- Abnormal: #ef4444 (Red)
- Warning: #f59e0b (Amber)
- Info: #2563eb (Blue)

---

## 🔄 State Management

### Theme Store (Zustand)
- `isDarkMode` - Current theme
- `toggleTheme()` - Switch theme
- `initTheme()` - Initialize from storage

### Report Store (Zustand)
- `reports` - List of reports
- `currentReport` - Selected report
- `isLoading` - Loading state
- `error` - Error message
- `setReports()` - Update list
- `addReport()` - Add new
- `updateReport()` - Modify
- `deleteReport()` - Remove

---

## 🧩 Component Hierarchy

```
App
├── Router
│   ├── Layout (Header + Main + Footer)
│   └── Routes
│       ├── Dashboard
│       ├── ReportGenerator
│       ├── ReportHistory
│       │   ├── ReportCard (multiple)
│       │   └── ReportPreview
│       ├── LabSettings
│       └── NotFound
│
Component Dependencies
├── UIComponents (Base)
│   ├── Header
│   ├── Footer
│   ├── ReportCard
│   └── ReportPreview
└── Pages
    ├── Dashboard
    ├── ReportGenerator
    ├── ReportHistory
└── LabSettings
```

---

## 📚 Dependencies

### Backend Production
- express, mongoose, cors, dotenv, multer, bcrypt, jsonwebtoken

### Frontend Production
- react, react-dom, react-router-dom, axios, jspdf, html2canvas
- lucide-react, framer-motion, zustand, date-fns

### Dev Dependencies
- nodemon (backend)
- vite, @vitejs/plugin-react (frontend)
- tailwindcss, postcss, autoprefixer

---

## 🚀 Deployment Checklist

- [ ] Update environment variables
- [ ] Configure MongoDB Atlas
- [ ] Build frontend: `npm run build`
- [ ] Deploy backend to server
- [ ] Deploy frontend to CDN/hosting
- [ ] Test all API endpoints
- [ ] Verify PDF generation
- [ ] Test error handling
- [ ] Load testing
- [ ] Security audit

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB running, check URI |
| Port 5000 in use | Kill process: `lsof -ti :5000 | xargs kill -9` |
| Frontend won't load | Clear cache, hard refresh (Ctrl+Shift+R) |
| API calls failing | Check CORS_ORIGIN matches frontend URL |
| PDF download fails | Verify jsPDF and html2canvas installed |
| Dark mode not working | Check localStorage settings |

---

## 📖 Documentation Files Reference

| File | Content | Audience |
|------|---------|----------|
| README.md | Features, tech stack, API docs | Everyone |
| SETUP.md | Installation, troubleshooting | Developers |
| QUICKSTART.md | 5-minute setup | Quick starters |
| FEATURES.md | Detailed features | Power users |
| PROJECT_SUMMARY.md | What was built | Project overview |
| INDEX.md | This file | Navigation |

---

## 🎓 Learning Resources

### For Backend Development
- Express.js documentation
- MongoDB Mongoose guide
- RESTful API best practices

### For Frontend Development
- React documentation
- Tailwind CSS guide
- Framer Motion examples

### For Full Stack
- MERN stack tutorials
- Vite documentation
- State management patterns

---

## 📞 Quick Links

- Backend Port: http://localhost:5000
- Frontend URL: http://localhost:3000
- API Health: http://localhost:5000/api/health
- MongoDB: mongodb://localhost:27017/pathology_db

---

## ✨ Next Steps

1. **Setup**: Follow QUICKSTART.md
2. **Explore**: Create test report
3. **Customize**: Update lab settings
4. **Extend**: Add more test types
5. **Deploy**: Use deployment guide

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready ✅

**Happy Coding! 🚀**
