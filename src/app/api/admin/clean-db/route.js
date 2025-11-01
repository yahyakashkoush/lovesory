import { updateContent } from '@/lib/db';

export async function POST(req) {
  try {
    console.log('[clean-db] Resetting database to defaults');

    // Reset to default content
    await Promise.resolve(updateContent({
      maleFirstName: 'Ahmed',
      femaleFirstName: 'Mai',
      tagline: 'Our love story began with a glance and turned into a lifetime of longing.',
      loveMessage: 'I love you more than words can express. You are my forever.',
      images: [],
      song: {},
      songCover: {},
      startDate: new Date('2024-01-01').toISOString(),
    }));

    console.log('[clean-db] Database reset successfully');

    return Response.json(
      { success: true, message: 'Database reset successfully' },
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
