const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yahyaemad999_db_user:jYVOXbdTiww6Ngos@cluster0.lmh2xxt.mongodb.net/?appName=Cluster0';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
});

const contentSchema = new mongoose.Schema({
  maleFirstName: { type: String, default: 'Ahmed' },
  femaleFirstName: { type: String, default: 'Mai' },
  tagline: { type: String, default: 'Our love story began with a glance and turned into a lifetime of longing.' },
  loveMessage: { type: String, default: 'I love you more than words can express. You are my forever.' },
  images: [{ url: String, uploadedAt: { type: Date, default: Date.now } }],
  song: { url: String, uploadedAt: Date },
  songCover: { url: String, uploadedAt: Date },
  startDate: { type: Date, default: new Date('2024-01-01') },
});

const User = mongoose.model('User', userSchema);
const Content = mongoose.model('Content', contentSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const user = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
    });

    await user.save();
    console.log('✅ Demo user created: admin@example.com / admin123');

    // Create default content
    const content = new Content({
      maleFirstName: 'Ahmed',
      femaleFirstName: 'Mai',
      tagline: 'Our love story began with a glance and turned into a lifetime of longing.',
      loveMessage: 'I love you more than words can express. You are my forever. Every moment with you is a treasure, and I cherish every memory we create together.',
      startDate: new Date('2024-01-01'),
    });

    await content.save();
    console.log('✅ Default content created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('Demo credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
