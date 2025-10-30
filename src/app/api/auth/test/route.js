/**
 * Test endpoint to verify API is working
 */

export async function GET(req) {
  try {
    return Response.json(
      {
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        environment: {
          mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not set',
          jwt_secret: process.env.JWT_SECRET ? 'Set' : 'Not set',
          api_url: process.env.NEXT_PUBLIC_API_URL || 'Not set',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    return Response.json(
      {
        success: true,
        message: 'POST request received',
        received: body,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test POST error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
