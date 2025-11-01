import { getContent, updateContent } from '@/lib/mongodb-direct';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    console.log('[POST /api/upload/cover] Token received:', token ? 'Yes' : 'No');

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

    console.log('[POST /api/upload/cover] File received:', file.name, 'Size:', file.size);

    // Check file size (max 10MB for images)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to base64 for MongoDB storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Get current content
    let content = await getContent();

    if (!content) {
      // Create default content if it doesn't exist
      await updateContent({
        maleFirstName: 'Ahmed',
        femaleFirstName: 'Mai',
        tagline: 'Our love story began with a glance and turned into a lifetime of longing.',
        loveMessage: 'I love you more than words can express. You are my forever.',
        images: [],
        song: {},
        songCover: {},
        startDate: new Date('2024-01-01'),
        createdAt: new Date(),
      });
      
      // Wait for write to propagate
      await new Promise(resolve => setTimeout(resolve, 200));
      content = await getContent();
    }

    console.log('[POST /api/upload/cover] Saving cover');

    await updateContent({
      songCover: {
        url: dataUrl,
        filename: file.name,
        uploadedAt: new Date(),
      }
    });

    // Wait for write to propagate - 1 second for reliability
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Read fresh from database to confirm
    const freshContent = await getContent();
    console.log('[POST /api/upload/cover] Cover saved successfully');

    return Response.json(
      {
        success: true,
        message: 'Cover uploaded successfully',
        cover: freshContent.songCover,
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
    console.error('[POST /api/upload/cover] Error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
