import { getContent, updateContent } from '@/lib/mongodb-direct';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function GET(req) {
  try {
    console.log('[GET /api/content] Request received at', new Date().toISOString());
    
    const content = await getContent();
    console.log('[GET /api/content] Content retrieved:', content ? 'Found' : 'Not found');

    if (!content) {
      console.log('[GET /api/content] Creating default content');
      
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
      });

      // Wait a bit for write to propagate
      await new Promise(resolve => setTimeout(resolve, 200));

      const freshContent = await getContent();
      console.log('[GET /api/content] Fresh content after creation:', freshContent ? 'Found' : 'Not found');

      const headers = new Headers();
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '-1');
      headers.set('Content-Type', 'application/json; charset=utf-8');
      headers.set('X-Timestamp', Date.now().toString());

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
    headers.set('X-Timestamp', Date.now().toString());

    console.log('[GET /api/content] Returning content:', {
      maleFirstName: content.maleFirstName,
      femaleFirstName: content.femaleFirstName,
      tagline: content.tagline?.substring(0, 30),
      loveMessage: content.loveMessage?.substring(0, 30),
    });

    // Convert ObjectId to string for JSON serialization
    const contentToReturn = {
      ...content,
      _id: content._id?.toString() || content._id,
    };

    return new Response(JSON.stringify(contentToReturn), {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error('[GET /api/content] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
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
    console.log('[PUT /api/content] Request received');
    
    const token = getTokenFromRequest(req);

    if (!token) {
      console.log('[PUT /api/content] No token provided');
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);

    if (!verified) {
      console.log('[PUT /api/content] Token verification failed');
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('[PUT /api/content] Update body:', Object.keys(body));

    // Update in MongoDB
    await updateContent(body);
    console.log('[PUT /api/content] Update completed');

    // Wait for write to propagate
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Read fresh data
    const freshContent = await getContent();
    console.log('[PUT /api/content] Fresh content after update:', {
      maleFirstName: freshContent.maleFirstName,
      femaleFirstName: freshContent.femaleFirstName,
    });

    return Response.json(freshContent, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
        'Pragma': 'no-cache',
        'Expires': '-1',
        'X-Timestamp': Date.now().toString(),
      }
    });
  } catch (error) {
    console.error('[PUT /api/content] Error:', error);

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
