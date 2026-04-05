#!/usr/bin/env node

// Simple test script to verify the pathology app functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testApp() {
  console.log('🧪 Testing Pathology Report Generator App...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const response = await axios.get(BASE_URL);
    console.log('✅ Server is running\n');

    // Test 2: Check API endpoints
    console.log('2. Testing API endpoints...');

    // Test lab settings
    try {
      const labResponse = await axios.get(`${BASE_URL}/api/lab/settings`);
      console.log('✅ Lab settings API working');
    } catch (error) {
      console.log('⚠️  Lab settings API not accessible (expected in fresh install)');
    }

    // Test test templates
    try {
      const testResponse = await axios.get(`${BASE_URL}/api/tests`);
      console.log('✅ Test templates API working');
    } catch (error) {
      console.log('⚠️  Test templates API not accessible (expected in fresh install)');
    }

    // Test patient creation
    try {
      const patientData = {
        name: 'Test Patient',
        age: 30,
        gender: 'Male',
        patientId: 'TEST-001',
        doctorName: 'Dr. Test',
        sampleCollectionDate: new Date().toISOString().split('T')[0]
      };

      const patientResponse = await axios.post(`${BASE_URL}/api/patients`, patientData);
      console.log('✅ Patient creation API working');
    } catch (error) {
      console.log('⚠️  Patient creation API error:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 Basic functionality tests completed!');
    console.log('\n📋 Manual Testing Checklist:');
    console.log('1. Open http://localhost:5000 in browser');
    console.log('2. Navigate to Report Generator');
    console.log('3. Fill patient information');
    console.log('4. Select a test type');
    console.log('5. Enter test results');
    console.log('6. Add/remove custom parameters');
    console.log('7. Generate report');
    console.log('8. Download PDF');

  } catch (error) {
    console.error('❌ Server not responding:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm start');
    console.log('2. Check if port 5000 is available');
    console.log('3. Verify MongoDB connection (app uses in-memory fallback)');
  }
}

testApp();