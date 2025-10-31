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

    // Keep only the first document, delete all others
    if (allDocs.length > 1) {
      const firstDocId = allDocs[0]._id;
      const result = await Content.deleteMany({ _id: { $ne: firstDocId } });
      console.log('Deleted documents:', result.deletedCount);

      return Response.json(
        {
          success: true,
          message: 'Cleanup completed',
          deletedCount: result.deletedCount,
          remainingDocId: firstDocId,
        },
        { status: 200 }
      );
    } else if (allDocs.length === 1) {
      console.log('Only one document exists, no cleanup needed');
      return Response.json(
        {
          success: true,
          message: 'No cleanup needed',
          deletedCount: 0,
          remainingDocId: allDocs[0]._id,
        },
        { status: 200 }
      );
    } else {
      // No documents, create one
      console.log('No documents found, creating one...');
      const newContent = new Content();
      await newContent.save();
      return Response.json(
        {
          success: true,
          message: 'Created first document',
          deletedCount: 0,
          remainingDocId: newContent._id,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
