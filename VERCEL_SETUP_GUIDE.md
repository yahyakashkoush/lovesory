# Complete Vercel Deployment Guide - Registration Fix

## Step 1: MongoDB Atlas Configuration

### 1.1 Whitelist Vercel IPs
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Go to **Network Access** → **IP Whitelist**
4. Click **Add IP Address**
5. Add these Vercel IP ranges:
   ```
   76.76.19.0/24
   76.76.20.0/24
   76.76.21.0/24
   76.76.22.0/24
   ```

### 1.2 Verify Connection String
1. Go to **Databases** → **Connect**
2. Choose **Drivers** → **Node.js**
3. Copy the connection string (keep it private!)
4. Format should be:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
   ```

## Step 2: Vercel Environment Variables (SECURE)

### 2.1 Set Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (DO NOT share these values):

| Variable | Where to Get It |
|----------|-----------------|
| `MONGODB_URI` | MongoDB Atlas → Connect → Connection String |
| `JWT_SECRET` | Generate a random strong string |
| `NEXT_PUBLIC_API_URL` | Your Vercel deployment URL |

### 2.2 Apply to Environments
- Select: **Production**, **Preview**, **Development**
- Click **Save**

## Step 3: Deploy to Vercel

### 3.1 Push Code to Git
```bash
git add .
git commit -m "Fix MongoDB registration with improved error handling"
git push origin main
```

### 3.2 Vercel Auto-Deploy
- Vercel automatically deploys when you push to main
- Check deployment status in Vercel Dashboard
- Wait for "Ready" status

## Step 4: Test Registration on Vercel

### 4.1 Get Your Vercel URL
- Check Vercel Dashboard for your deployment URL
- Format: `https://your-project.vercel.app`

### 4.2 Test Registration
```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 4.3 Expected Success Response (201)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

## Step 5: Monitor and Debug

### 5.1 Check Function Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments** → Latest deployment
4. Click **Function Logs**
5. Look for registration attempts and errors

### 5.2 Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "MongoDB connection error" | Add Vercel IPs to MongoDB Atlas whitelist |
| "Email already registered" | Use different email address |
| "Invalid email format" | Use valid email format (user@domain.com) |
| "Password must be at least 6 characters" | Use password with 6+ characters |
| "Internal server error" | Check MongoDB connection string and Vercel logs |

### 5.3 View MongoDB Data
1. Go to MongoDB Atlas
2. Select your cluster
3. Go to **Collections**
4. Find **Users** collection
5. Verify new user documents are created

## Step 6: Production Checklist

- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables set in Vercel (SECURE)
- [ ] Code deployed to Vercel
- [ ] Registration tested successfully
- [ ] Login tested with registered user
- [ ] Function logs checked for errors
- [ ] MongoDB shows new user documents

## Security Notes

���️ **IMPORTANT:**
- Never share your `MONGODB_URI` or `JWT_SECRET`
- Never commit `.env.local` to Git
- Keep environment variables private in Vercel
- Use strong passwords for MongoDB and JWT
- Regularly rotate secrets in production

## Quick Reference

### Test Endpoints
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`

### Required Fields
- **Register**: `email`, `password`, `name` (optional)
- **Login**: `email`, `password`

### Response Codes
- **201**: Registration successful
- **200**: Login successful
- **400**: Bad request (missing/invalid fields)
- **401**: Unauthorized (invalid credentials)
- **409**: Conflict (user already exists)
- **500**: Server error (database issue)
