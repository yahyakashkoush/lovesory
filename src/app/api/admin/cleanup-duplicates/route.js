import { getContentCollection } from '@/lib/mongodb-direct';
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

    const collection = await getContentCollection();

    // Get all documents
    const allDocs = await collection.find({}).toArray();
    console.log('[cleanup-duplicates] Total documents found:', allDocs.length);

    // Keep only the first document, delete all others
    if (allDocs.length > 1) {
      const firstDocId = allDocs[0]._id;
      const result = await collection.deleteMany({ _id: { $ne: firstDocId } });
      console.log('[cleanup-duplicates] Deleted documents:', result.deletedCount);

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
      console.log('[cleanup-duplicates] Only one document exists, no cleanup needed');
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
      console.log('[cleanup-duplicates] No documents found, creating one...');
      const newDoc = {
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
      };
      const result = await collection.insertOne(newDoc);
      console.log('[cleanup-duplicates] Created first document:', result.insertedId);
      
      return Response.json(
        {
          success: true,
          message: 'Created first document',
          deletedCount: 0,
          remainingDocId: result.insertedId,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('[cleanup-duplicates] Error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
