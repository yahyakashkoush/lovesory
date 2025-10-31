import { getContentCollection } from '@/lib/mongodb-direct';

export async function POST(req) {
  try {
    const collection = await getContentCollection();

    // Delete all old content
    await collection.deleteMany({});
    console.log('[clean-db] Deleted old content');

    // Create fresh content
    const newDoc = {
      maleFirstName: 'Ahmed',
      femaleFirstName: 'Mai',
      tagline: 'Our love story began with a glance and turned into a lifetime of longing.',
      loveMessage: 'I love you more than words can express. You are my forever.',
      images: [],
      song: {},
      songCover: {},
      startDate: new Date('2024-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newDoc);
    console.log('[clean-db] Created fresh content:', result.insertedId);

    return Response.json(
      { success: true, message: 'Database cleaned successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[clean-db] Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
