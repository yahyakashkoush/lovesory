import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);

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

    await dbConnect();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

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

    // SINGLETON: Always use the first document (there should only be one)
    let content = await Content.findOne();

    if (!content) {
      content = new Content();
      await content.save();
    }

    content.songCover = {
      url: dataUrl,
      filename: file.name,
      uploadedAt: new Date(),
    };

    content.markModified('songCover');
    await content.save();

    return Response.json(
      {
        success: true,
        message: 'Cover uploaded successfully',
        cover: content.songCover,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cover upload error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
