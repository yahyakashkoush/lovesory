# MongoDB Registration Fix for Vercel

## Problem
Registration endpoint returns "Internal server error" on Vercel due to MongoDB connection issues.

## Root Causes Fixed

### 1. **Connection Pooling**
- Added proper connection pooling configuration
- Increased timeouts for Vercel's cold starts
- Added `maxPoolSize` and `minPoolSize` settings

### 2. **Email Validation & Indexing**
- Added email format validation
- Improved unique index handling with `sparse: true`
- Normalized emails to lowercase before saving

### 3. **Error Handling**
- Added detailed logging for debugging
- Better error messages for duplicate key errors
- Proper error propagation

### 4. **Password Field Selection**
- Added `select: false` to password field in schema
- Explicitly select password when needed with `.select('+password')`

## Changes Made

### `/src/lib/mongodb.js`
- Improved connection caching logic
- Added better error handling
- Increased timeout values for Vercel
- Added connection pool settings

### `/src/models/User.js`
- Added email validation regex
- Added explicit index creation
- Added `select: false` to password field
- Improved field validation

### `/src/app/api/auth/register/route.js`
- Added comprehensive logging
- Added email format validation
- Added password length validation
- Better duplicate key error handling
- Normalized email to lowercase

### `/src/app/api/auth/login/route.js`
- Added explicit password field selection
- Improved error logging
- Better error messages

## MongoDB Atlas Configuration

### Required: Whitelist Vercel IPs
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Whitelist
3. Add: `0.0.0.0/0` (Allow all IPs) OR
4. Add specific Vercel IPs:
   - `76.76.19.0/24`
   - `76.76.20.0/24`
   - `76.76.21.0/24`
   - `76.76.22.0/24`

### Verify Connection String
- Format: `mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0`
- Ensure no special characters in password (URL encode if needed)
- Database name is optional in connection string

## Vercel Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://yahyaemad999_db_user:jYVOXbdTiww6Ngos@cluster0.lmh2xxt.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
```

## Testing Registration

### Local Test
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Expected Success Response
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Expected Error Responses
- **400**: Missing email/password or invalid format
- **409**: User already exists
- **500**: Database connection error (check logs)

## Debugging on Vercel

1. Check Vercel Function Logs:
   - Vercel Dashboard → Deployments → Function Logs
   - Look for "Register request started" and connection messages

2. Common Issues:
   - "MongoDB connection error" → Check IP whitelist
   - "Email already registered" → User exists, try different email
   - "Invalid email format" → Check email validation regex
   - "Password must be at least 6 characters" → Use longer password

## Next Steps

1. Deploy to Vercel
2. Test registration with new email
3. Check Vercel Function Logs for detailed error messages
4. Verify MongoDB Atlas shows new user in database
5. Test login with registered credentials
