import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';

export async function DELETE(req) {
  try {
    const token = getTokenFromRequest(req);
    console.log('Delete image token received:', token ? 'Yes' : 'No');

    if (!token) {
      console.log('No token provided');
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);
    console.log('Token verified:', verified ? 'Yes' : 'No');

    if (!verified) {
      console.log('Token verification failed');
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const imageIndex = parseInt(searchParams.get('index'));

    console.log('Deleting image at index:', imageIndex);

    if (isNaN(imageIndex) || imageIndex < 0) {
      return Response.json(
        { error: 'Invalid image index' },
        { status: 400 }
      );
    }

    // SINGLETON: Always use the same document with _id = 'singleton'
    let content = await Content.findOneAndUpdate(
      { _id: 'singleton' },
      {},
      { upsert: true, new: true }
    );

    if (!content) {
      return Response.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    if (!content.images || imageIndex >= content.images.length) {
      return Response.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Get the image to delete
    const imageToDelete = content.images[imageIndex];
    console.log('Image to delete:', imageToDelete);

    // Delete the file from disk if it exists
    if (imageToDelete.filename) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadsDir, imageToDelete.filename);
      
      try {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log('File deleted from disk:', filepath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue anyway - delete from DB
      }
    }

    // Remove the image at the specified index
    console.log('Before splice - images count:', content.images.length);
    
    // Create new array without the image
    const newImages = content.images.filter((_, i) => i !== imageIndex);
    console.log('After filter - images count:', newImages.length);
    
    // Replace the entire images array
    content.images = newImages;
    content.markModified('images');
    
    console.log('Saving content...');
    const savedContent = await content.save();
    console.log('Content saved successfully');
    console.log('Saved images count:', savedContent.images.length);

    return Response.json(
      {
        success: true,
        message: 'Image deleted successfully',
        imagesCount: savedContent.images.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete image error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
