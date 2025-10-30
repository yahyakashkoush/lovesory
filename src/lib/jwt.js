import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.authorization;
    if (!authHeader) {
      return null;
    }
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  } catch (error) {
    console.error('Error extracting token:', error);
    return null;
  }
}
