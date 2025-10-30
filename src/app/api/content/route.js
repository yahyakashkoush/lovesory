import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function GET(req) {
  try {
    await dbConnect();

    let content = await Content.findOne();

    if (!content) {
      content = new Content();
      await content.save();
    }

    return Response.json(content, { status: 200 });
  } catch (error) {
    console.error('Get content error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const token = getTokenFromRequest(req);
    console.log('Token received:', token ? 'Yes' : 'No');

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

    const body = await req.json();
    console.log('Update body received:', Object.keys(body));

    let content = await Content.findOne();

    if (!content) {
      content = new Content();
    }

    // Update only the fields provided
    if (body.maleFirstName !== undefined) {
      content.maleFirstName = body.maleFirstName;
      console.log('Updated maleFirstName');
    }
    if (body.femaleFirstName !== undefined) {
      content.femaleFirstName = body.femaleFirstName;
      console.log('Updated femaleFirstName');
    }
    if (body.tagline !== undefined) {
      content.tagline = body.tagline;
      console.log('Updated tagline');
    }
    if (body.loveMessage !== undefined) {
      content.loveMessage = body.loveMessage;
      console.log('Updated loveMessage');
    }
    if (body.startDate !== undefined) {
      content.startDate = body.startDate;
      console.log('Updated startDate');
    }
    if (Array.isArray(body.images)) {
      content.images = body.images;
      console.log('Updated images array, new length:', body.images.length);
    }

    await content.save();
    console.log('Content saved successfully');

    return Response.json(content, { status: 200 });
  } catch (error) {
    console.error('Update content error:', error);
    console.error('Error message:', error.message);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
