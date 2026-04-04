#!/bin/bash

# Pathology Report Generator - Startup Checklist
# Run this to verify everything is set up correctly

echo "🧪 Pathology Report Generator - Pre-Flight Checklist"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ $2${NC}"
  else
    echo -e "${RED}✗ $2${NC}"
  fi
}

# Check Node.js
echo "Checking prerequisites..."
node --version > /dev/null 2>&1
check_result $? "Node.js installed"

# Check MongoDB (optional - might be cloud)
echo ""
echo "Backend Setup:"
if [ -d "backend" ]; then
  check_result 0 "Backend directory found"
  
  if [ -f "backend/package.json" ]; then
    check_result 0 "Backend package.json exists"
  fi
  
  if [ -f "backend/.env" ]; then
    check_result 0 "Backend .env configured"
  else
    echo -e "${YELLOW}⚠ Backend .env not found - create from .env.example${NC}"
  fi
else
  echo -e "${RED}✗ Backend directory not found${NC}"
fi

# Check Frontend
echo ""
echo "Frontend Setup:"
if [ -d "frontend" ]; then
  check_result 0 "Frontend directory found"
  
  if [ -f "frontend/package.json" ]; then
    check_result 0 "Frontend package.json exists"
  fi
  
  if [ -f "frontend/src/App.jsx" ]; then
    check_result 0 "Frontend App.jsx exists"
  fi
else
  echo -e "${RED}✗ Frontend directory not found${NC}"
fi

# Check documentation
echo ""
echo "Documentation:"
[ -f "README.md" ] && check_result 0 "README.md" || check_result 1 "README.md"
[ -f "SETUP.md" ] && check_result 0 "SETUP.md" || check_result 1 "SETUP.md"
[ -f "QUICKSTART.md" ] && check_result 0 "QUICKSTART.md" || check_result 1 "QUICKSTART.md"

echo ""
echo "=================================================="
echo "Next Steps:"
echo "1. cd backend && npm install"
echo "2. cp .env.example .env"
echo "3. Configure MongoDB URI in .env"
echo "4. npm run dev (in backend directory)"
echo ""
echo "5. cd frontend && npm install"
echo "6. npm run dev (in frontend directory)"
echo ""
echo "7. Open http://localhost:3000"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo "=================================================="
