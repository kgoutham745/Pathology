#!/usr/bin/env node

// Development test script for pathology app - Single Server Mode
const { spawn } = require('child_process');

console.log('🚀 Starting Pathology App in Single Server Mode...\n');

console.log('📦 Building frontend...');
const build = spawn('npm', ['run', 'build'], {
  cwd: './',
  stdio: 'inherit',
  shell: true
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed');
    process.exit(1);
  }

  console.log('\n🌐 Starting single server (API + Static Files)...');
  const server = spawn('npm', ['start'], {
    cwd: './backend',
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '5000' }
  });

  server.on('error', (error) => {
    console.error('❌ Server start failed:', error);
  });

  console.log('\n⏳ Waiting for server to start...');
  setTimeout(() => {
    console.log('\n✅ Server is running!');
    console.log('• Frontend + API: http://localhost:5000');
    console.log('\n🧪 Test the following:');
    console.log('1. Open http://localhost:5000');
    console.log('2. Try generating a report');
    console.log('3. Check browser console for errors');
    console.log('4. Verify custom parameters add/remove work');
    console.log('5. Test PDF generation');

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping server...');
      server.kill();
      process.exit(0);
    });
  }, 3000);
});