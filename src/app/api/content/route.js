import { getContent, updateContent } from '@/lib/mongodb-direct';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function GET(req) {
  try {
    const content = await getContent();

    if (!content) {
      // Create default content
      await updateContent({
        maleFirstName: 'Ahmed',
        femaleFirstName: 'Mai',
        tagline: 'Our love story began with a glance and turned into a lifetime of longing.',
        loveMessage: 'I love you more than words can express. You are my forever.',
        images: [],
        song: {},
        songCover: {},
        startDate: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const freshContent = await getContent();

      const headers = new Headers();
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '-1');
      headers.set('Content-Type', 'application/json; charset=utf-8');

      return new Response(JSON.stringify(freshContent), {
        status: 200,
        headers: headers
      });
    }

    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '-1');
    headers.set('Content-Type', 'application/json; charset=utf-8');

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error('Get content error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
}

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
    await updateContent(body);

    // Read fresh data
    const freshContent = await getContent();

    return Response.json(freshContent, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
        'Pragma': 'no-cache',
        'Expires': '-1',
      }
    });
  } catch (error) {
    console.error('Update content error:', error);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
