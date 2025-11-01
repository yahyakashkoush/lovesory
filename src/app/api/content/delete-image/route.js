import { getContent, updateContent } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function DELETE(req) {
  try {
    console.log('[DELETE /api/content/delete-image] Request received');
    
    const token = getTokenFromRequest(req);

    if (!token) {
      console.log('[DELETE /api/content/delete-image] No token provided');
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);

    if (!verified) {
      console.log('[DELETE /api/content/delete-image] Token verification failed');
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const imageIndex = parseInt(searchParams.get('index'));

    console.log('[DELETE /api/content/delete-image] Image index:', imageIndex);

    if (isNaN(imageIndex) || imageIndex < 0) {
      return Response.json(
        { error: 'Invalid image index' },
        { status: 400 }
      );
    }

    // Get current content
    const content = await Promise.resolve(getContent());

    if (!content) {
      console.log('[DELETE /api/content/delete-image] Content not found');
      return Response.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    if (!content.images || imageIndex >= content.images.length) {
      console.log('[DELETE /api/content/delete-image] Image not found at index:', imageIndex);
      return Response.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Get the image to delete
    const imageToDelete = content.images[imageIndex];
    console.log('[DELETE /api/content/delete-image] Deleting image:', imageToDelete.filename);

    // Remove the image at the specified index
    const newImages = content.images.filter((_, i) => i !== imageIndex);
    console.log('[DELETE /api/content/delete-image] New images count:', newImages.length);

    // Update in database
    await Promise.resolve(updateContent({
      images: newImages,
    }));

    console.log('[DELETE /api/content/delete-image] Update completed');

    // Read fresh data
    const freshContent = await Promise.resolve(getContent());
    console.log('[DELETE /api/content/delete-image] Fresh content after delete:', {
      imagesCount: freshContent.images.length
    });

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
          'X-Timestamp': Date.now().toString(),
        }
      }
    );
  } catch (error) {
    console.error('[DELETE /api/content/delete-image] Error:', error);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
