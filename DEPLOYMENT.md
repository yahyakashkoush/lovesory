# 🚀 Deployment Guide - Love Story App

Complete step-by-step guide to deploy the Love Story App to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free tier)
- Node.js 18+ installed locally

## Step 1: Prepare Your MongoDB

### If you don't have MongoDB Atlas yet:

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project
4. Create a cluster (free tier)
5. Create a database user with a strong password
6. Get your connection string

### Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
```

## Step 2: Prepare Your GitHub Repository

### 1. Initialize Git (if not already done)

```bash
cd "Gift love"
git init
git add .
git commit -m "Initial commit: Love Story App"
```

### 2. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., `love-story-app`)
3. **Do NOT** initialize with README (we already have one)

### 3. Push to GitHub

```bash
git remote add origin https://github.com/yourusername/love-story-app.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 1. Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 2. Import Your Project

1. Click "New Project"
2. Select your `love-story-app` repository
3. Click "Import"

### 3. Configure Environment Variables

In the "Environment Variables" section, add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Generate a strong random string (e.g., use `openssl rand -base64 32`) |
| `NEXT_PUBLIC_API_URL` | Leave blank for now (Vercel will auto-fill) |

**Example JWT_SECRET generation:**
```bash
openssl rand -base64 32
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Once complete, you'll get a URL like `https://love-story-app.vercel.app`

## Step 4: Verify Deployment

### 1. Test Public Page
- Visit your Vercel URL (e.g., `https://love-story-app.vercel.app`)
- You should see the romantic hero section

### 2. Test Admin Panel
- Visit `https://love-story-app.vercel.app/admin/login`
- Use demo credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

### 3. Test Admin Functions
- Upload an image
- Edit the love message
- Verify changes appear on the public page

## Step 5: Custom Domain (Optional)

### 1. In Vercel Dashboard

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. Update Environment Variable

Update `NEXT_PUBLIC_API_URL` in Vercel settings to your custom domain:
```
https://yourdomain.com
```

## Step 6: Continuous Deployment

Your app is now set up for continuous deployment:

- Every push to `main` branch automatically deploys
- Preview deployments for pull requests
- Automatic rollbacks if needed

### To update your app:

```bash
# Make changes locally
git add .
git commit -m "Update love message"
git push origin main

# Vercel automatically deploys!
```

## Troubleshooting

### Build Fails

**Error: "Cannot find module 'mongoose'"**
- Solution: Run `npm install` locally and push again

**Error: "MONGODB_URI is not defined"**
- Solution: Check environment variables in Vercel settings

### App Loads but No Data

**Issue: Admin panel shows empty content**
- Solution: Seed the database with demo data:
  ```bash
  node scripts/seed.js
  ```

**Issue: Images/Music not uploading**
- Solution: Check MongoDB connection and user permissions

### Login Not Working

**Issue: "Invalid credentials" error**
- Solution: 
  1. Verify user exists in MongoDB
  2. Check JWT_SECRET is set correctly
  3. Try registering a new account

## Security Checklist

- [ ] Changed `JWT_SECRET` from default value
- [ ] MongoDB user has strong password
- [ ] IP whitelist configured in MongoDB Atlas
- [ ] `.env.local` is in `.gitignore`
- [ ] Using HTTPS (Vercel provides this automatically)
- [ ] Sensitive data not in code or git history

## Performance Tips

1. **Optimize Images**: Compress images before uploading
2. **Song File Size**: Keep MP3 under 10MB for faster loading
3. **Database**: Use MongoDB indexes for faster queries
4. **Caching**: Vercel automatically caches static assets

## Monitoring

### Check Deployment Status

1. Go to your Vercel project dashboard
2. View deployment history
3. Check build logs if issues occur

### Monitor MongoDB

1. Go to MongoDB Atlas dashboard
2. Check connection status
3. Monitor storage usage

## Updating Your App

### To add new features:

1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel automatically deploys

### To rollback:

1. Go to Vercel dashboard
2. Click on a previous deployment
3. Click "Promote to Production"

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [JWT Documentation](https://jwt.io)

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all features
3. ✅ Add custom domain
4. ✅ Share with Mai! 💕

---

**Congratulations!** Your Love Story App is now live! 🎉

Share the link with your loved one and enjoy! ❤️
