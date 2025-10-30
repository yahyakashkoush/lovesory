import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

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

    let content = await Content.findOne();

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

    // Remove the image at the specified index
    console.log('Before splice - images count:', content.images.length);
    content.images.splice(imageIndex, 1);
    console.log('After splice - images count:', content.images.length);

    // Mark the array as modified
    content.markModified('images');
    
    const savedContent = await content.save();
    console.log('Content saved successfully');
    console.log('Saved images count:', savedContent.images.length);

    return Response.json(
      {
        success: true,
        message: 'Image deleted successfully',
        imagesCount: savedContent.images.length,
        images: savedContent.images,
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
