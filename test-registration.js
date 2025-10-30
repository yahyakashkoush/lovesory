#!/usr/bin/env node

/**
 * Test script for registration endpoint
 * Run: node test-registration.js
 */

const http = require('http');

const testCases = [
  {
    name: 'Valid Registration',
    data: {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User'
    },
    expectedStatus: 201
  },
  {
    name: 'Missing Email',
    data: {
      password: 'password123',
      name: 'Test User'
    },
    expectedStatus: 400
  },
  {
    name: 'Missing Password',
    data: {
      email: 'test@example.com',
      name: 'Test User'
    },
    expectedStatus: 400
  },
  {
    name: 'Invalid Email Format',
    data: {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User'
    },
    expectedStatus: 400
  },
  {
    name: 'Password Too Short',
    data: {
      email: `test${Date.now()}@example.com`,
      password: '123',
      name: 'Test User'
    },
    expectedStatus: 400
  }
];

async function runTests() {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  
  console.log(`\n🧪 Testing Registration Endpoint`);
  console.log(`📍 Base URL: ${baseUrl}`);
  console.log(`${'='.repeat(60)}\n`);

  for (const testCase of testCases) {
    await runTest(baseUrl, testCase);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ All tests completed\n');
}

function runTest(baseUrl, testCase) {
  return new Promise((resolve) => {
    const url = new URL(`${baseUrl}/api/auth/register`);
    const data = JSON.stringify(testCase.data);

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const protocol = url.protocol === 'https:' ? require('https') : http;

    const req = protocol.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const passed = res.statusCode === testCase.expectedStatus;
        const status = passed ? '✅' : '❌';
        
        console.log(`${status} ${testCase.name}`);
        console.log(`   Expected Status: ${testCase.expectedStatus}, Got: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(responseData);
          if (response.error) {
            console.log(`   Error: ${response.error}`);
          } else if (response.success) {
            console.log(`   ✓ User registered successfully`);
            console.log(`   ✓ Email: ${response.user.email}`);
          }
        } catch (e) {
          console.log(`   Response: ${responseData.substring(0, 100)}`);
        }
        
        console.log();
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${testCase.name}`);
      console.log(`   Error: ${error.message}`);
      console.log();
      resolve();
    });

    req.write(data);
    req.end();
  });
}

runTests().catch(console.error);
