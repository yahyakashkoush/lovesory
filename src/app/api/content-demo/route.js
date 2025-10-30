/**
 * Demo Content API (without MongoDB)
 * For testing purposes only
 */

import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

// In-memory content storage
let demoContent = {
  _id: '1',
  maleFirstName: 'Ahmed',
  femaleFirstName: 'Mai',
  tagline: 'Our love story began with a glance and turned into a lifetime of longing.',
  loveMessage: 'I love you more than words can express. You are my forever.',
  images: [],
  song: null,
  songCover: null,
  startDate: new Date('2024-01-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function GET(req) {
  try {
    console.log('Demo GET /api/content-demo');
    
    return Response.json(demoContent, { status: 200 });
  } catch (error) {
    console.error('Get content error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    console.log('Demo PUT /api/content-demo');
    
    const token = getTokenFromRequest(req);
    console.log('Token received:', token ? 'Yes' : 'No');

    if (!token) {
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);
    console.log('Token verified:', verified ? 'Yes' : 'No');

    if (!verified) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Body received:', body);

    // Update content
    if (body.maleFirstName) demoContent.maleFirstName = body.maleFirstName;
    if (body.femaleFirstName) demoContent.femaleFirstName = body.femaleFirstName;
    if (body.tagline) demoContent.tagline = body.tagline;
    if (body.loveMessage) demoContent.loveMessage = body.loveMessage;
    if (body.startDate) demoContent.startDate = body.startDate;
    if (body.images) demoContent.images = body.images;

    demoContent.updatedAt = new Date();

    console.log('Content updated');
    return Response.json(demoContent, { status: 200 });
  } catch (error) {
    console.error('Update content error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
