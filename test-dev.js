#!/usr/bin/env node

// Development test script for pathology app
const { spawn } = require('child_process');

console.log('🚀 Starting Pathology App in Development Mode...\n');

console.log('📦 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: './backend',
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.error('❌ Backend start failed:', error);
});

setTimeout(() => {
  console.log('\n🌐 Starting frontend development server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: './frontend',
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (error) => {
    console.error('❌ Frontend start failed:', error);
  });

  console.log('\n⏳ Waiting for servers to start...');
  console.log('Once both servers are running:');
  console.log('• Frontend: http://localhost:3000');
  console.log('• Backend: http://localhost:5000');
  console.log('\n🧪 Test the following:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Try generating a report');
  console.log('3. Check browser console for errors');
  console.log('4. Verify custom parameters add/remove work');
  console.log('5. Test PDF generation');

  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

}, 3000);