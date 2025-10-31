import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function PUT(req) {
  try {
    const token = getTokenFromRequest(req);
    console.log('Update text token received:', token ? 'Yes' : 'No');

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

    await dbConnect();

    const body = await req.json();
    console.log('Update text body received:', Object.keys(body));

    // SINGLETON: Always use the same document with _id = 'singleton'
    let content = await Content.findOneAndUpdate(
      { _id: 'singleton' },
      {},
      { upsert: true, new: true }
    );

    if (!content) {
      content = new Content({ _id: 'singleton' });
      await content.save();
    }

    // Update only text fields - no images
    if (body.maleFirstName !== undefined) {
      content.maleFirstName = String(body.maleFirstName).trim();
      console.log('Updated maleFirstName');
    }
    if (body.femaleFirstName !== undefined) {
      content.femaleFirstName = String(body.femaleFirstName).trim();
      console.log('Updated femaleFirstName');
    }
    if (body.tagline !== undefined) {
      content.tagline = String(body.tagline).trim();
      console.log('Updated tagline');
    }
    if (body.loveMessage !== undefined) {
      content.loveMessage = String(body.loveMessage).trim();
      console.log('Updated loveMessage');
    }
    if (body.startDate !== undefined) {
      content.startDate = new Date(body.startDate);
      console.log('Updated startDate');
    }

    // Mark fields as modified
    content.markModified('maleFirstName');
    content.markModified('femaleFirstName');
    content.markModified('tagline');
    content.markModified('loveMessage');
    content.markModified('startDate');

    const savedContent = await content.save();
    console.log('Text content saved successfully');

    return Response.json(
      {
        success: true,
        maleFirstName: savedContent.maleFirstName,
        femaleFirstName: savedContent.femaleFirstName,
        tagline: savedContent.tagline,
        loveMessage: savedContent.loveMessage,
        startDate: savedContent.startDate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update text error:', error);
    console.error('Error message:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return Response.json(
        { error: 'Validation error: ' + messages.join(', ') },
        { status: 400 }
      );
    }

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
