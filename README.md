# Pathology Report Generator

A professional medical laboratory report generation system built with React and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (optional - falls back to in-memory database)

### Single Server Production Setup

```bash
# Install all dependencies
npm run install-all

# Build and start production server
npm run build
npm run prod
```

**Open**: `http://localhost:5000`

### Development Setup

```bash
# Install all dependencies
npm run install-all

# Start development servers (frontend + backend)
npm run dev
```

**Open**: `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API)

## 📋 Features

- ✅ Patient information management
- ✅ 12+ test types (CBC, LFT, RFT, Thyroid, etc.)
- ✅ Professional PDF report generation
- ✅ Abnormal value highlighting
- ✅ Report history and search
- ✅ Lab settings configuration
- ✅ Dark mode support
- ✅ Responsive design

## 🧪 Test Types

- Complete Blood Count (CBC)
- Liver Function Test (LFT)
- Renal Function Test (RFT)
- Thyroid Profile
- Lipid Profile
- Blood Sugar
- Electrolyte Panel
- HbA1c
- Vitamin D
- Coagulation Profile
- Urine Analysis
- Culture & Sensitivity

## 📁 Project Structure

```
pathology/
├── backend/          # Express.js API server
├── frontend/         # React application
├── package.json      # Root scripts
└── README.md         # This file
```

## 🔧 Available Scripts

- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run build` - Build React frontend to static files
- `npm run prod` - Start the production server using an existing frontend build
- `npm run dev` - Start development servers
- `npm run test:dev` - Test production build with single server

## 📖 Setup Guide

For detailed installation and setup instructions, see [SETUP.md](SETUP.md).

## 🐛 Issues

If you encounter issues:
1. Make sure Node.js v16+ is installed
2. Run `npm run install-all` to install dependencies
3. Build the frontend: `npm run build`
4. Start the production server: `npm run prod`
5. For development: `npm run dev`

For Render or any hosted deployment, set `MONGODB_URI` to a managed MongoDB connection string. The app only falls back to in-memory MongoDB for local development.

## 📄 License

MIT License
    └── index.html
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud) - optional for development (falls back to in-memory)
- npm or yarn

### Option 1: Single Server Production Deployment (Recommended)

1. Install all dependencies:
   ```bash
   npm run install-all
   ```

2. Build the frontend:
   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   npm run prod
   ```

4. Open your browser and navigate to `http://localhost:5000`

**That's it!** The single server serves both the React app and API routes.

### Option 2: Development with Separate Servers

#### Backend Setup

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

#### Frontend Setup

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
