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

    let content = await Content.findOne();

    if (!content) {
      content = new Content();
    }

    // Update only the fields provided
    if (body.maleFirstName) content.maleFirstName = body.maleFirstName;
    if (body.femaleFirstName) content.femaleFirstName = body.femaleFirstName;
    if (body.tagline) content.tagline = body.tagline;
    if (body.loveMessage) content.loveMessage = body.loveMessage;
    if (body.startDate) content.startDate = body.startDate;
    if (body.images) content.images = body.images;

    await content.save();

    return Response.json(content, { status: 200 });
  } catch (error) {
    console.error('Update content error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
