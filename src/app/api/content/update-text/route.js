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

    // SINGLETON: Always use the first document (there should only be one)
    let content = await Content.findOne();

    if (!content) {
      content = new Content();
      await content.save();
    }

    // Update only text fields - no images
    let hasChanges = false;
    
    if (body.maleFirstName !== undefined && body.maleFirstName !== content.maleFirstName) {
      content.maleFirstName = String(body.maleFirstName).trim();
      console.log('Updated maleFirstName to:', content.maleFirstName);
      hasChanges = true;
    }
    if (body.femaleFirstName !== undefined && body.femaleFirstName !== content.femaleFirstName) {
      content.femaleFirstName = String(body.femaleFirstName).trim();
      console.log('Updated femaleFirstName to:', content.femaleFirstName);
      hasChanges = true;
    }
    if (body.tagline !== undefined && body.tagline !== content.tagline) {
      content.tagline = String(body.tagline).trim();
      console.log('Updated tagline to:', content.tagline);
      hasChanges = true;
    }
    if (body.loveMessage !== undefined && body.loveMessage !== content.loveMessage) {
      content.loveMessage = String(body.loveMessage).trim();
      console.log('Updated loveMessage to:', content.loveMessage);
      hasChanges = true;
    }
    if (body.startDate !== undefined && body.startDate !== content.startDate) {
      content.startDate = new Date(body.startDate);
      console.log('Updated startDate to:', content.startDate);
      hasChanges = true;
    }

    // Mark fields as modified
    content.markModified('maleFirstName');
    content.markModified('femaleFirstName');
    content.markModified('tagline');
    content.markModified('loveMessage');
    content.markModified('startDate');

    const savedContent = await content.save();
    console.log('Text content saved successfully:', {
      maleFirstName: savedContent.maleFirstName,
      femaleFirstName: savedContent.femaleFirstName,
      tagline: savedContent.tagline,
      loveMessage: savedContent.loveMessage,
      startDate: savedContent.startDate,
    });

    // Read fresh from MongoDB collection directly to bypass Mongoose cache
    const db = require('mongoose').connection.db;
    const collection = db.collection('contents');
    const freshContent = await collection.findOne({});

    return Response.json(
      {
        success: true,
        maleFirstName: freshContent.maleFirstName,
        femaleFirstName: freshContent.femaleFirstName,
        tagline: freshContent.tagline,
        loveMessage: freshContent.loveMessage,
        startDate: freshContent.startDate,
      },
      { status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
          'Pragma': 'no-cache',
          'Expires': '-1',
        }
      }
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
