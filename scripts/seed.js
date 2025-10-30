#!/usr/bin/env node

/**
 * Database Seed Script
 * Creates initial admin user for testing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Admin',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    console.log('✅ Connected to MongoDB\n');

    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123\n');
    } else {
      // Create admin user
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin',
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!\n');
      console.log('📝 Admin Credentials:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123\n');
    }

    // Create test user
    const existingTestUser = await User.findOne({ email: 'test@example.com' });

    if (existingTestUser) {
      console.log('ℹ️  Test user already exists');
      console.log('   Email: test@example.com');
      console.log('   Password: test123\n');
    } else {
      const testUser = new User({
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
      });

      await testUser.save();
      console.log('✅ Test user created successfully!\n');
      console.log('📝 Test User Credentials:');
      console.log('   Email: test@example.com');
      console.log('   Password: test123\n');
    }

    // List all users
    const allUsers = await User.find({}, { email: 1, name: 1, createdAt: 1 });
    console.log('📊 All Users in Database:');
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
    });

    console.log('\n✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
