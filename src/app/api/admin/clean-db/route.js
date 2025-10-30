import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export async function POST(req) {
  try {
    await dbConnect();

    // Delete all old content
    await Content.deleteMany({});
    console.log('Deleted old content');

    // Create fresh content
    const newContent = new Content({
      maleFirstName: 'Ahmed',
      femaleFirstName: 'Mai',
      tagline: 'Our love story began with a glance and turned into a lifetime of longing.',
      loveMessage: 'I love you more than words can express. You are my forever.',
      images: [],
      song: null,
      songCover: null,
      startDate: new Date('2024-01-01'),
    });

    await newContent.save();
    console.log('Created fresh content');

    return Response.json(
      { success: true, message: 'Database cleaned successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Clean DB error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
