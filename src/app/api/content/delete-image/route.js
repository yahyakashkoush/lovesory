import { getContent, updateContent } from '@/lib/mongodb-direct';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';

export async function DELETE(req) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);

    if (!verified) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const imageIndex = parseInt(searchParams.get('index'));

    if (isNaN(imageIndex) || imageIndex < 0) {
      return Response.json(
        { error: 'Invalid image index' },
        { status: 400 }
      );
    }

    // Get current content
    const content = await getContent();

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

    // Delete the file from disk if it exists
    if (imageToDelete.filename) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadsDir, imageToDelete.filename);

      try {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
      }
    }

    // Remove the image at the specified index
    const newImages = content.images.filter((_, i) => i !== imageIndex);

    // Update in MongoDB
    await updateContent({
      images: newImages,
      updatedAt: new Date(),
    });

    // Read fresh data
    const freshContent = await getContent();

    return Response.json(
      {
        success: true,
        message: 'Image deleted successfully',
        imagesCount: freshContent.images.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
          'Pragma': 'no-cache',
          'Expires': '-1',
        }
      }
    );
  } catch (error) {
    console.error('Delete image error:', error);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
