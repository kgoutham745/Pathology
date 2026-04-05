# Pathology Report Generator - Setup Guide

## 📋 Prerequisites

- **Node.js** v16 or higher
- **MongoDB** (optional - uses in-memory database if not available)

## 🚀 Quick Setup

### Single Server Production (Recommended)

```bash
# Install all dependencies
npm run install-all

# Build and start production server
npm run build
npm run prod
```

**Access at**: `http://localhost:5000`

For hosted deployments such as Render, you must set `MONGODB_URI` to an external MongoDB instance. The in-memory MongoDB fallback is only for local development.

### Development Setup

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

**Access at**: `http://localhost:3000`

## 🔧 Manual Setup (Optional)

If you prefer manual setup:

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file if needed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

```bash
# Test production build
npm run test:dev
```

## 🐛 Troubleshooting

- **Port already in use**: Change PORT in backend/.env
- **MongoDB connection failed**: App uses in-memory database automatically
- **Build errors**: Run `npm run install-all` first

**Options for MongoDB:**
- **Local MongoDB**: `mongodb://localhost:27017/pathology_db`
- **MongoDB Atlas Cloud**: `mongodb+srv://username:password@cluster.mongodb.net/pathology_db`

#### 2.5 Start MongoDB (if using local)
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### 2.6 Start Backend Server
```bash
npm run dev
```

You should see: `Server running on port 5000`

### Step 3: Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Start Development Server
```bash
npm run dev
```

You should see output showing the local development server URL (typically `http://localhost:3000`)

#### 3.4 Open in Browser
Open your browser and go to: `http://localhost:3000`

## ✅ Verification Checklist

After installation, verify:

- [ ] Backend running on `http://localhost:5000` (API)
- [ ] Frontend running on `http://localhost:3000` (UI)
- [ ] MongoDB connected successfully
- [ ] Can access Dashboard page
- [ ] Can generate a test report
- [ ] Can view report history

## 📝 Creating Your First Report

1. **Navigate to "Generate Report"** or click `/generate`
2. **Fill Patient Details**:
   - Patient Name: "John Doe"
   - Age: "35"
   - Gender: "Male"
   - Doctor: "Dr. Smith"
   - Sample Collection Date: Today's date
3. **Select Test Type**: Choose "CBC" (Complete Blood Count)
4. **Enter Test Values**:
   - Hemoglobin: 15.2
   - RBC Count: 5.1
   - WBC Count: 7500
   - Platelet Count: 2.5
   - Hematocrit: 45
5. **Add Notes** (optional)
6. **Click "Generate Report"**
7. **Download PDF** from Report History

## 🎯 Key Features to Explore

### Dashboard
- View statistics and recent reports
- Quick access to main functions

### Generate Report
- 3-step process to create reports
- Real-time abnormal value highlighting
- Multiple test types supported

### Report History
- Search reports by patient name or ID
- Card and table view modes
- PDF download and preview

### Lab Settings
- Configure lab branding
- Upload logo
- Customize theme colors
- Set report templates

## 🔧 Development Commands

### Backend
```bash
cd backend

# Development with auto-reload
npm run dev

# Production
npm start
```

### Frontend
```bash
cd frontend

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## 📁 Project Structure Quick Reference

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components (Dashboard, ReportGenerator, etc.)
│   ├── utils/           # Utility functions (API, validators, PDF)
│   ├── context/         # State management (Zustand stores)
│   ├── data/            # Static data (test templates)
│   └── App.jsx          # Main app file
└── package.json

backend/
├── src/
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Express server
└── package.json
```

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
- Ensure MongoDB is running
- Check MongoDB URI in .env file
- Try using MongoDB Atlas if local doesn't work

### Issue: "Cannot GET /" on frontend
**Solution:**
- Ensure frontend dev server is running on port 3000
- Check that React is loaded correctly
- Clear browser cache (Ctrl+Shift+Del)

### Issue: "CORS error" between frontend and backend
**Solution:**
- Verify CORS_ORIGIN in backend .env matches frontend URL
- Ensure backend server is running
- Check browser console for detailed error message

### Issue: Port already in use
**Solution** (Windows):
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

**Solution** (macOS/Linux):
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9
```

## 📚 Test Template Information

Each test comes with predefined parameters:

**CBC (Complete Blood Count)**
- Hemoglobin, RBC Count, WBC Count, Platelet Count, Hematocrit

**LFT (Liver Function)**
- Bilirubin, SGOT, SGPT, Alkaline Phosphatase, Albumin

**RFT (Kidney Function)**
- Creatinine, BUN, Sodium, Potassium

Add more test templates in `frontend/src/data/testTemplates.js`

## 🎨 Customization

### Change Lab Name
Go to `backend/src/controllers/labController.js` and update default lab name

### Modify Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',
      secondary: '#10b981',
    }
  }
}
```

### Add New Test Type
1. Add to `frontend/src/data/testTemplates.js`
2. Define parameters with normal ranges
3. Test will automatically appear in the dropdown

## 📞 Support & Troubleshooting

1. Check browser console for errors (F12)
2. Check backend server logs
3. Verify all services are running:
   - MongoDB: ✓
   - Backend (port 5000): ✓
   - Frontend (port 3000): ✓

## 🎓 Next Steps

- Explore the code structure
- Customize lab settings
- Add new test templates
- Extend with authentication
- Deploy to production

---

**Happy Reporting! 🧪**
