# Pathology Report Generator

A professional, full-stack web application for medical laboratories to generate clean, well-formatted PDF reports for various medical tests.

## 🎯 Features

### Core Features
- ✅ Multiple test type support (CBC, LFT, RFT, Thyroid, Lipid Profile, Blood Sugar, Urine, etc.)
- ✅ Dynamic form generation based on selected test
- ✅ Patient information management
- ✅ Professional PDF report generation
- ✅ Abnormal value highlighting
- ✅ Report history and search
- ✅ Dark mode support

### Advanced Features
- ✅ Lab settings configuration
- ✅ Logo upload and branding
- ✅ Theme customization
- ✅ Report templates
- ✅ Responsive design (Mobile + Desktop)
- ✅ Modern UI with animations

## 🏗️ Project Structure

```
pathology/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Express app
│   ├── package.json
│   └── .env.example
│
└── frontend/               # React + Vite frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── utils/          # Helper functions
    │   ├── context/        # State management
    │   ├── data/           # Static data
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    ├── vite.config.js
## 🧪 Testing

### Automated Tests
```bash
# Test production build
npm run test

# Test development servers
npm run test:dev
```

### Manual Testing Checklist
1. **Server Startup**
   - ✅ Production: `npm start` (serves on port 5000)
   - ✅ Development: `npm run dev` (frontend:3000, backend:5000)

2. **Core Functionality**
   - ✅ Open app in browser (http://localhost:5000 or http://localhost:3000)
   - ✅ Navigate to Report Generator page
   - ✅ Fill patient information form
   - ✅ Select test type (CBC, LFT, etc.)
   - ✅ Enter test result values
   - ✅ Add custom parameters (click "Add Custom Parameter")
   - ✅ Remove custom parameters (click "Remove" button)
   - ✅ Generate report (click "Generate Report")
   - ✅ Download PDF (click "Download PDF")

3. **Error Handling**
   - ✅ Form validation (required fields)
   - ✅ API error handling
   - ✅ Network connectivity issues
   - ✅ Invalid data formats

4. **UI/UX**
   - ✅ Responsive design (mobile/desktop)
   - ✅ Dark mode toggle
   - ✅ Loading states
   - ✅ Success/error messages
   - ✅ Form navigation (step-by-step)

### Common Issues & Fixes
- **JavaScript Errors**: Make sure to rebuild after code changes (`npm run build`)
- **API Connection**: Check CORS settings and server logs
- **PDF Generation**: Ensure all required fields are filled
- **Custom Parameters**: Test add/remove functionality thoroughly
    └── index.html
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pathology_db
   NODE_ENV=development
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit: `http://localhost:3000`

## 📝 Usage

### 1. Generate a Report
- Click "Generate Report" or navigate to `/generate`
- Fill in patient information
- Select the test type
- Enter test results
- Review and generate PDF

### 2. View Report History
- Navigate to "Report History"
- Search for reports by patient name, ID, or report ID
- Switch between card and table views
- Preview, download, or delete reports

### 3. Configure Lab Settings
- Navigate to "Lab Settings"
- Update lab information
- Upload logo
- Customize theme colors
- Set report layout preferences

## 🧪 Supported Test Types

1. **CBC** - Complete Blood Count
   - Hemoglobin, RBC Count, WBC Count, Platelet Count, Hematocrit

2. **LFT** - Liver Function Test
   - Total Bilirubin, SGOT, SGPT, Alkaline Phosphatase, Albumin

3. **RFT** - Renal Function Test
   - Creatinine, BUN, Sodium, Potassium

4. **Thyroid Profile**
   - TSH, Free T3, Free T4

5. **Lipid Profile**
   - Total Cholesterol, LDL, HDL, Triglycerides

6. **Blood Sugar**
   - Fasting Blood Sugar, Random Blood Sugar

7. **Urine Routine**
   - Color, Clarity, pH, Glucose, Protein

8. **Blood Culture**
   - Organism Identification, Antibiotic Sensitivity

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Validation**: express-validator
- **Authentication**: JWT
- **File Upload**: Multer
- **PDF Generation**: PDFKit

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React

## 📚 API Documentation

### Reports API
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/report/:reportId` - Get report by reporting ID
- `GET /api/reports/patient/:patientId` - Get patient's reports
- `GET /api/reports/search?query=...` - Search reports
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Patients API
- `POST /api/patients` - Create patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `GET /api/patients/search?query=...` - Search patients
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Tests API
- `GET /api/tests` - Get all test templates
- `GET /api/tests/:id` - Get test by ID
- `POST /api/tests` - Create test template
- `PUT /api/tests/:id` - Update test template
- `DELETE /api/tests/:id` - Delete test template

### Lab Settings API
- `GET /api/lab/settings` - Get lab settings
- `PUT /api/lab/settings` - Update lab settings
- `POST /api/lab/logo` - Upload lab logo

## 🎨 UI Features

- **Modern Design**: Clean, professional medical theme
- **Dark Mode**: Eye-friendly dark theme support
- **Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔐 Security Features

- Input validation on both frontend and backend
- JWT-based authentication (extensible)
- CORS protection
- Secure file upload handling

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database permissions

### Port Already in Use
- Backend: `kill -9 $(lsof -t -i:5000)` (macOS/Linux)
- Frontend: `kill -9 $(lsof -t -i:3000)` (macOS/Linux)

### Build Errors
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

## 📝 Future Enhancements

- [ ] User authentication system
- [ ] Multi-lab support
- [ ] Report templates customization
- [ ] Email delivery of reports
- [ ] Batch upload of test results
- [ ] QR code generation for reports
- [ ] Mobile app
- [ ] Export to other formats (Excel, CSV)

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email info@pathologylab.com or create an issue in the repository.

---

**Built with ❤️ for medical laboratories**