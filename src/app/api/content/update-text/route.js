import { getContent, updateContent } from '@/lib/mongodb-direct';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function PUT(req) {
  try {
    console.log('[PUT /api/content/update-text] Request received');
    
    const token = getTokenFromRequest(req);

    if (!token) {
      console.log('[PUT /api/content/update-text] No token provided');
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);
    if (!verified) {
      console.log('[PUT /api/content/update-text] Token verification failed');
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('[PUT /api/content/update-text] Update body:', {
      maleFirstName: body.maleFirstName,
      femaleFirstName: body.femaleFirstName,
      tagline: body.tagline?.substring(0, 30),
      loveMessage: body.loveMessage?.substring(0, 30),
    });

    // Update in MongoDB
    await updateContent({
      maleFirstName: body.maleFirstName,
      femaleFirstName: body.femaleFirstName,
      tagline: body.tagline,
      loveMessage: body.loveMessage,
      startDate: body.startDate,
    });

    console.log('[PUT /api/content/update-text] Update completed');

    // Wait a bit for write to propagate
    await new Promise(resolve => setTimeout(resolve, 200));

    // Read fresh data
    const freshContent = await getContent();
    console.log('[PUT /api/content/update-text] Fresh content after update:', {
      maleFirstName: freshContent.maleFirstName,
      femaleFirstName: freshContent.femaleFirstName,
    });

    return Response.json(
      {
        success: true,
        maleFirstName: freshContent.maleFirstName,
        femaleFirstName: freshContent.femaleFirstName,
        tagline: freshContent.tagline,
        loveMessage: freshContent.loveMessage,
        startDate: freshContent.startDate,
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
    console.error('[PUT /api/content/update-text] Error:', error);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
