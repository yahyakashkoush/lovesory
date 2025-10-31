import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    // CRITICAL: Always reconnect to ensure fresh data from MongoDB
    await dbConnect();

    // Get fresh data directly from MongoDB collection, bypassing ALL Mongoose caching
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const collection = db.collection('contents');
    const content = await collection.findOne({});

    if (!content) {
      // Create default content if none exists
      const newContent = new Content();
      await newContent.save();
      
      // Read fresh from MongoDB collection
      const freshContent = await collection.findOne({});
      
      const headers = new Headers();
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '-1');
      headers.set('Surrogate-Control', 'no-store');
      headers.set('Content-Type', 'application/json; charset=utf-8');
      headers.set('X-Cache-Bypass', Date.now().toString());
      headers.set('Last-Modified', new Date().toUTCString());
      headers.set('Vary', '*');

      return new Response(JSON.stringify(freshContent), { 
        status: 200,
        headers: headers
      });
    }

    // Add EXTREMELY strong cache-busting headers
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '-1');
    headers.set('Surrogate-Control', 'no-store');
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('X-Cache-Bypass', Date.now().toString());
    headers.set('Last-Modified', new Date().toUTCString());
    headers.set('Vary', '*');

    console.log('[GET] Returning content:', {
      maleFirstName: content.maleFirstName,
      femaleFirstName: content.femaleFirstName,
      tagline: content.tagline?.substring(0, 50),
      loveMessage: content.loveMessage?.substring(0, 50),
      imagesCount: content.images?.length || 0
    });

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

    // SINGLETON: Always use the first document (there should only be one)
    let content = await Content.findOne();

    if (!content) {
      content = new Content();
      await content.save();
    }

    // Update only the fields provided
    if (body.maleFirstName !== undefined) {
      content.maleFirstName = body.maleFirstName;
      console.log('Updated maleFirstName to:', body.maleFirstName);
    }
    if (body.femaleFirstName !== undefined) {
      content.femaleFirstName = body.femaleFirstName;
      console.log('Updated femaleFirstName to:', body.femaleFirstName);
    }
    if (body.tagline !== undefined) {
      content.tagline = body.tagline;
      console.log('Updated tagline to:', body.tagline);
    }
    if (body.loveMessage !== undefined) {
      content.loveMessage = body.loveMessage;
      console.log('Updated loveMessage to:', body.loveMessage);
    }
    if (body.startDate !== undefined) {
      content.startDate = body.startDate;
      console.log('Updated startDate to:', body.startDate);
    }
    if (Array.isArray(body.images)) {
      // Validate and clean images array
      const validImages = body.images.filter(img => {
        if (!img || typeof img !== 'object') return false;
        if (!img.url || typeof img.url !== 'string') return false;
        return true;
      });
      
      console.log('Original images count:', body.images.length);
      console.log('Valid images count:', validImages.length);
      
      content.images = validImages;
      console.log('Updated images array, new length:', validImages.length);
    }

    content.markModified('maleFirstName');
    content.markModified('femaleFirstName');
    content.markModified('tagline');
    content.markModified('loveMessage');
    content.markModified('startDate');
    content.markModified('images');

    const savedContent = await content.save();
    console.log('Content saved successfully to singleton document');

    // Return with strong no-cache headers
    return Response.json(savedContent, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
        'Pragma': 'no-cache',
        'Expires': '-1',
      }
    });
  } catch (error) {
    console.error('Update content error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error.errors);
    
    // Handle validation errors
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
