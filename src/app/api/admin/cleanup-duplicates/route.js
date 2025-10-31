import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function POST(req) {
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

    await dbConnect();

    // Get all documents
    const allDocs = await Content.find({});
    console.log('Total documents found:', allDocs.length);

    // Find or create singleton
    let singleton = await Content.findOne({ _id: 'singleton' });
    
    if (!singleton) {
      console.log('Creating singleton document...');
      singleton = new Content({ _id: 'singleton' });
      await singleton.save();
    }

    console.log('Singleton document ID:', singleton._id);

    // Delete all other documents
    const result = await Content.deleteMany({ _id: { $ne: 'singleton' } });
    console.log('Deleted documents:', result.deletedCount);

    return Response.json(
      {
        success: true,
        message: 'Cleanup completed',
        deletedCount: result.deletedCount,
        singletonId: singleton._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cleanup error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
