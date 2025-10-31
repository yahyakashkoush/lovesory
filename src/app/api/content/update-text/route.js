import { getContent, updateContent } from '@/lib/mongodb-direct';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function PUT(req) {
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

    const body = await req.json();

    // Update in MongoDB
    await updateContent({
      maleFirstName: body.maleFirstName,
      femaleFirstName: body.femaleFirstName,
      tagline: body.tagline,
      loveMessage: body.loveMessage,
      startDate: body.startDate,
      updatedAt: new Date(),
    });

    // Read fresh data
    const freshContent = await getContent();

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
        }
      }
    );
  } catch (error) {
    console.error('Update text error:', error);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
