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

    // With SQLite, we only have one row, so no cleanup needed
    console.log('[cleanup-duplicates] SQLite database - no duplicates possible');

    return Response.json(
      {
        success: true,
        message: 'No cleanup needed (SQLite)',
        deletedCount: 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[cleanup-duplicates] Error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
