import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req) {
  let connection;
  try {
    console.log('Register request started');
    
    connection = await dbConnect();
    console.log('Database connected successfully');

    const body = await req.json();
    const { email, password, name } = body;
    console.log('Received registration data for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short');
      return Response.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    console.log('Checking if user exists:', email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.log('User already exists:', email);
      return Response.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    console.log('Creating new user');
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name || 'Admin',
    });

    console.log('Saving user to database');
    await user.save();
    console.log('User saved successfully:', user._id);

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
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return more detailed error for debugging
    const errorMessage = error.message || 'Internal server error';
    const isDuplicateKey = error.code === 11000;
    
    if (isDuplicateKey) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    return Response.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
