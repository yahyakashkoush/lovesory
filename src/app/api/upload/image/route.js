import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    console.log('Image upload token received:', token ? 'Yes' : 'No');

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

    console.log('File received:', file.name, 'Size:', file.size);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: 'File size exceeds 5MB limit' },
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

    console.log('Current images count:', content.images.length);

    const newImage = {
      url: dataUrl,
      filename: file.name,
      uploadedAt: new Date(),
    };

    content.images.push(newImage);
    content.markModified('images');

    console.log('Saving content with', content.images.length, 'images');
    const savedContent = await content.save();
    console.log('Content saved successfully with', savedContent.images.length, 'images');

    // Read fresh from database to confirm
    const freshContent = await Content.findOne().lean();
    console.log('Fresh content has', freshContent.images.length, 'images');

    return Response.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        imagesCount: freshContent.images.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Image upload error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return Response.json(
        { error: 'Validation error: ' + messages.join(', ') },
        { status: 400 }
      );
    }

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
