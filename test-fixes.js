#!/usr/bin/env node

/**
 * Script to test if the fixes are working correctly
 * Run with: node test-fixes.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing fixes...\n');

const checks = [];

// Check 1: Verify upload routes don't use fs.writeFileSync
console.log('✓ Checking upload routes...');
const uploadImageRoute = fs.readFileSync(path.join(__dirname, 'src/app/api/upload/image/route.js'), 'utf8');
const uploadSongRoute = fs.readFileSync(path.join(__dirname, 'src/app/api/upload/song/route.js'), 'utf8');
const uploadCoverRoute = fs.readFileSync(path.join(__dirname, 'src/app/api/upload/cover/route.js'), 'utf8');

if (!uploadImageRoute.includes('fs.writeFileSync')) {
  console.log('  ✅ Image upload: No fs.writeFileSync (using Base64)');
  checks.push(true);
} else {
  console.log('  ❌ Image upload: Still using fs.writeFileSync');
  checks.push(false);
}

if (!uploadSongRoute.includes('fs.writeFileSync')) {
  console.log('  ✅ Song upload: No fs.writeFileSync (using Base64)');
  checks.push(true);
} else {
  console.log('  ❌ Song upload: Still using fs.writeFileSync');
  checks.push(false);
}

if (!uploadCoverRoute.includes('fs.writeFileSync')) {
  console.log('  ✅ Cover upload: No fs.writeFileSync (using Base64)');
  checks.push(true);
} else {
  console.log('  ❌ Cover upload: Still using fs.writeFileSync');
  checks.push(false);
}

// Check 2: Verify cache headers in page.js
console.log('\n✓ Checking cache headers...');
const pageJs = fs.readFileSync(path.join(__dirname, 'src/app/page.js'), 'utf8');
if (pageJs.includes('cache: \'no-store\'')) {
  console.log('  ✅ page.js: Has cache: no-store');
  checks.push(true);
} else {
  console.log('  ❌ page.js: Missing cache: no-store');
  checks.push(false);
}

if (pageJs.includes('Cache-Control')) {
  console.log('  ✅ page.js: Has Cache-Control headers');
  checks.push(true);
} else {
  console.log('  ❌ page.js: Missing Cache-Control headers');
  checks.push(false);
}

// Check 3: Verify AdminDashboard has cache busting
console.log('\n✓ Checking AdminDashboard...');
const adminDashboard = fs.readFileSync(path.join(__dirname, 'src/components/AdminDashboard.js'), 'utf8');
if (adminDashboard.includes('Date.now()')) {
  console.log('  ✅ AdminDashboard: Has cache busting with Date.now()');
  checks.push(true);
} else {
  console.log('  ❌ AdminDashboard: Missing cache busting');
  checks.push(false);
}

// Check 4: Verify .env.example exists
console.log('\n✓ Checking environment files...');
if (fs.existsSync(path.join(__dirname, '.env.example'))) {
  console.log('  ✅ .env.example: Exists');
  checks.push(true);
} else {
  console.log('  ❌ .env.example: Missing');
  checks.push(false);
}

// Check 5: Verify Content model has filename field
console.log('\n✓ Checking Content model...');
const contentModel = fs.readFileSync(path.join(__dirname, 'src/models/Content.js'), 'utf8');
if (contentModel.includes('filename: String')) {
  console.log('  ✅ Content model: Has filename field');
  checks.push(true);
} else {
  console.log('  ❌ Content model: Missing filename field');
  checks.push(false);
}

// Summary
console.log('\n' + '='.repeat(50));
const passed = checks.filter(c => c).length;
const total = checks.length;
console.log(`\n📊 Results: ${passed}/${total} checks passed\n`);

if (passed === total) {
  console.log('✅ All fixes are properly applied!');
  console.log('\n📝 Next steps:');
  console.log('1. Test locally: npm run dev');
  console.log('2. Push to GitHub: git push origin main');
  console.log('3. Check Vercel deployment');
  process.exit(0);
} else {
  console.log('❌ Some fixes are missing. Please review the FIXES_APPLIED.md file.');
  process.exit(1);
}
