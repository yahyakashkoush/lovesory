import { getContent, updateContent } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    console.log('[POST /api/upload/image] Token received:', token ? 'Yes' : 'No');

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

    console.log('[POST /api/upload/image] File received:', file.name, 'Size:', file.size);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert file to base64 for database storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
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

    console.log('[POST /api/upload/image] Current images count:', content.images?.length || 0);

    const newImage = {
      url: dataUrl,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
    };

    const images = content.images || [];
    images.push(newImage);

    console.log('[POST /api/upload/image] Saving content with', images.length, 'images');
    
    await Promise.resolve(updateContent({
      images: images,
    }));

    // Read fresh from database to confirm
    const freshContent = await Promise.resolve(getContent());
    console.log('[POST /api/upload/image] Fresh content has', freshContent.images?.length || 0, 'images');

    return Response.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        imagesCount: freshContent.images?.length || 0,
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
    console.error('[POST /api/upload/image] Error:', error);
    console.error('[POST /api/upload/image] Error message:', error.message);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
