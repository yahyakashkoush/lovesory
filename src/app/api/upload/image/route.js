import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${random}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    console.log('File saved to:', filepath);

    // Store only the URL reference in MongoDB (not the base64)
    const imageUrl = `/uploads/${filename}`;

    let content = await Content.findOne();

    if (!content) {
      content = new Content();
    }

    console.log('Current images count:', content.images.length);

    const newImage = {
      url: imageUrl,
      filename: filename,
      uploadedAt: new Date(),
    };

    content.images.push(newImage);
    content.markModified('images');

    console.log('Saving content with', content.images.length, 'images');
    await content.save();
    console.log('Content saved successfully');

    return Response.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        imagesCount: content.images.length,
        imageUrl: imageUrl,
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
