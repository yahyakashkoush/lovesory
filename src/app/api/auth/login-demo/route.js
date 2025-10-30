/**
 * Demo login endpoint (without MongoDB)
 * For testing purposes only
 */

import { signToken } from '@/lib/jwt';

// Demo users (in-memory)
const DEMO_USERS = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // In real app, this would be hashed
    name: 'Admin',
  },
  'test@example.com': {
    id: '2',
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
  },
};

export async function POST(req) {
  try {
    console.log('Demo login request received');

    const { email, password } = await req.json();
    console.log('Email:', email);

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = DEMO_USERS[email];
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user.id, email: user.email });

    return Response.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Demo login error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
