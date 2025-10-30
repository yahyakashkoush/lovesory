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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    let content = await Content.findOne();

    if (!content) {
      content = new Content();
    }

    content.images.push({
      url: dataUrl,
      uploadedAt: new Date(),
    });

    await content.save();

    return Response.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        image: content.images[content.images.length - 1],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Image upload error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
