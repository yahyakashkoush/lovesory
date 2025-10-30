import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    console.log('Login request received');
    
    await dbConnect();
    console.log('Database connected');

    const body = await req.json();
    const { email, password } = body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found');
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Comparing passwords');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password invalid');
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Generating token');
    const token = signToken({ userId: user._id, email: user.email });

    return Response.json(
      {
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return Response.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
