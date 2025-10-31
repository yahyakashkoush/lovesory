import mongoose from 'mongoose';

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
  { 
    timestamps: true,
    collection: 'contents'  // CRITICAL: Explicitly set collection name to match MongoDB
  }
);

// Set a higher limit for document size (16MB is MongoDB default, but we can optimize)
contentSchema.set('strict', true);

export default mongoose.models.Content || mongoose.model('Content', contentSchema);
