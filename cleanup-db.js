#!/usr/bin/env node

/**
 * Database Cleanup Script
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Finds all Content documents
 * 3. Keeps only the singleton document with _id = 'singleton'
 * 4. Deletes all other documents
 * 5. Ensures the singleton has default values
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

// Define Content schema inline
const contentSchema = new mongoose.Schema(
  {
    maleFirstName: {
      type: String,
      default: 'Ahmed',
    },
    femaleFirstName: {
      type: String,
      default: 'Mai',
    },
    tagline: {
      type: String,
      default: 'Our love story began with a glance and turned into a lifetime of longing.',
    },
    loveMessage: {
      type: String,
      default: 'I love you more than words can express. You are my forever.',
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    song: {
      url: String,
      filename: String,
      uploadedAt: Date,
    },
    songCover: {
      url: String,
      filename: String,
      uploadedAt: Date,
    },
    startDate: {
      type: Date,
      default: new Date('2024-01-01'),
    },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);

async function cleanup() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all documents
    const allDocs = await Content.find({});
    console.log(`📊 Total documents found: ${allDocs.length}`);

    if (allDocs.length > 0) {
      console.log('\n📋 Documents:');
      allDocs.forEach((doc, i) => {
        console.log(`  ${i + 1}. _id: ${doc._id}, maleFirstName: ${doc.maleFirstName}`);
      });
    }

    // Find or create singleton
    console.log('\n🔍 Looking for singleton document...');
    let singleton = await Content.findOne({ _id: 'singleton' });

    if (!singleton) {
      console.log('❌ Singleton not found, creating...');
      singleton = new Content({ _id: 'singleton' });
      await singleton.save();
      console.log('✅ Singleton created');
    } else {
      console.log('✅ Singleton found');
    }

    // Delete all other documents
    console.log('\n🗑️  Deleting duplicate documents...');
    const result = await Content.deleteMany({ _id: { $ne: 'singleton' } });
    console.log(`✅ Deleted ${result.deletedCount} duplicate document(s)`);

    // Verify
    const finalCount = await Content.countDocuments({});
    console.log(`\n📊 Final document count: ${finalCount}`);

    if (finalCount === 1) {
      console.log('✅ Database cleanup successful!');
      console.log('✅ Only singleton document remains');
    } else {
      console.log('⚠️  Warning: Expected 1 document, found ' + finalCount);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    process.exit(1);
  }
}

cleanup();
