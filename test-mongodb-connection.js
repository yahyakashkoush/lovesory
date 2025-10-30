#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Run this to verify your MongoDB Atlas connection is working
 * 
 * Usage: node test-mongodb-connection.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let MONGODB_URI = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/MONGODB_URI=(.+)/);
  if (match) {
    MONGODB_URI = match[1].trim();
  }
}

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String (masked):', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

async function testConnection() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Successfully connected to MongoDB!\n');
    
    // Get connection info
    const connection = mongoose.connection;
    console.log('Connection Details:');
    console.log('  - Host:', connection.host);
    console.log('  - Port:', connection.port);
    console.log('  - Database:', connection.name);
    console.log('  - State:', connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // List databases
    const admin = connection.db.admin();
    const databases = await admin.listDatabases();
    console.log('\n📊 Available Databases:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });

    console.log('\n✅ All tests passed! Your MongoDB connection is working correctly.');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection Failed!\n');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    // Provide helpful suggestions based on error type
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Suggestion: Your IP address might not be whitelisted in MongoDB Atlas.');
      console.error('   Go to MongoDB Atlas → Network Access → Add your IP address');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Suggestion: Check your username and password in the connection string.');
      console.error('   Go to MongoDB Atlas → Database Access → Verify credentials');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Suggestion: The cluster URL might be incorrect.');
      console.error('   Verify the cluster name in your connection string');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.error('\n💡 Suggestion: Connection timeout. Check if:');
      console.error('   1. Your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('   2. The cluster is running and active');
      console.error('   3. Your internet connection is stable');
    }
    
    process.exit(1);
  }
}

testConnection();
