# 🚀 Quick Start Guide

Get the Pathology Report Generator running in 5 minutes!

## Prerequisites
- Node.js v16+
- MongoDB (local or cloud)

## 1️⃣ Terminal 1 - Backend

```bash
cd backend
npm install
cp .env.example .env
```

**Configure `.env` file:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pathology_db
NODE_ENV=development
JWT_SECRET=secret_key
CORS_ORIGIN=http://localhost:3000
```

**Start Backend:**
```bash
npm run dev
```

✅ You should see: `Server running on port 5000`

## 2️⃣ Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Open browser: `http://localhost:3000`

## 3️⃣ That's it! 🎉

You're ready to:
1. Generate your first report
2. Download as PDF
3. Customize lab settings

---

## 🧪 Test It Out

1. Click **"Generate Report"**
2. Fill patient details (any values work)
3. Select **"CBC"** test
4. Enter test values:
   - Hemoglobin: 15.2
   - RBC: 5.1
   - WBC: 7000
   - Platelet: 2.5
   - Hematocrit: 45
5. Click **"Generate Report"** ✅
6. Go to **"Report History"** and download PDF

---

## ⚡ Troubleshooting

**Backend won't start?**
- Is MongoDB running?
- Is port 5000 free?

**Frontend won't load?**
- Check `http://localhost:3000` in browser
- Press Ctrl+Shift+R to hard refresh

**MongoDB error?**
- Start MongoDB: `mongod` (Windows) or `brew services start mongodb-community` (Mac)

---

**Need Help?** Check README.md or SETUP.md for detailed instructions!
