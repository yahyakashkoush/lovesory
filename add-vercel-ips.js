#!/usr/bin/env node

/**
 * Script to add Vercel IPs to MongoDB Atlas Whitelist
 * This requires MongoDB Atlas API credentials
 */

const https = require('https');

// Vercel IP ranges
const VERCEL_IPS = [
  '76.76.19.0/24',
  '76.76.20.0/24',
  '76.76.21.0/24',
  '76.76.22.0/24',
  '76.76.23.0/24',
  '76.76.24.0/24',
  '76.76.25.0/24',
  '76.76.26.0/24',
  '76.76.27.0/24',
  '76.76.28.0/24',
];

// MongoDB Atlas API credentials (you need to set these)
const MONGODB_API_KEY = process.env.MONGODB_API_KEY;
const MONGODB_ORG_ID = process.env.MONGODB_ORG_ID;
const MONGODB_PROJECT_ID = process.env.MONGODB_PROJECT_ID;

if (!MONGODB_API_KEY || !MONGODB_ORG_ID || !MONGODB_PROJECT_ID) {
  console.error('❌ Missing MongoDB Atlas API credentials');
  console.error('Set these environment variables:');
  console.error('  - MONGODB_API_KEY');
  console.error('  - MONGODB_ORG_ID');
  console.error('  - MONGODB_PROJECT_ID');
  process.exit(1);
}

async function addIPToWhitelist(ip) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      cidrBlock: ip,
      comment: `Vercel IP Range - ${new Date().toISOString()}`,
    });

    const options = {
      hostname: 'cloud.mongodb.com',
      port: 443,
      path: `/api/atlas/v1.0/groups/${MONGODB_PROJECT_ID}/accessList`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${MONGODB_API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          resolve({ success: true, ip });
        } else {
          reject(new Error(`Failed to add IP ${ip}: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🔍 Adding Vercel IPs to MongoDB Atlas Whitelist...\n');

  for (const ip of VERCEL_IPS) {
    try {
      await addIPToWhitelist(ip);
      console.log(`✅ Added: ${ip}`);
    } catch (error) {
      console.error(`❌ Failed to add ${ip}: ${error.message}`);
    }
  }

  console.log('\n✅ Done! Vercel IPs have been added to MongoDB Atlas.');
}

main().catch(console.error);
