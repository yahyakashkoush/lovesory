import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password, name } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const user = new User({
      email,
      password,
      name: name || 'Admin',
    });

    await user.save();

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
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
