import { getContent, updateContent } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    console.log('[POST /api/upload/song] Token received:', token ? 'Yes' : 'No');

    if (!token) {
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    if (!verifyToken(token)) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[POST /api/upload/song] File received:', file.name, 'Size:', file.size);

    // Check file size (max 50MB for audio)
    if (file.size > 50 * 1024 * 1024) {
      return Response.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Convert file to base64 for database storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'audio/mpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Get current content
    let content = await Promise.resolve(getContent());

    if (!content) {
      // Create default content if it doesn't exist
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
      
      content = await Promise.resolve(getContent());
    }

    console.log('[POST /api/upload/song] Saving song');

    await Promise.resolve(updateContent({
      song: {
        url: dataUrl,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
      }
    }));

    // Read fresh from database to confirm
    const freshContent = await Promise.resolve(getContent());
    console.log('[POST /api/upload/song] Song saved successfully');

    return Response.json(
      {
        success: true,
        message: 'Song uploaded successfully',
        song: freshContent.song,
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
          'Pragma': 'no-cache',
          'Expires': '-1',
          'X-Timestamp': Date.now().toString(),
        }
      }
    );
  } catch (error) {
    console.error('[POST /api/upload/song] Error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
