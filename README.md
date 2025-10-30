# 💕 Love Story App - Ahmed ❤️ Mai

A romantic, interactive one-page website with a secure admin panel, built with Next.js 14, MongoDB, and Tailwind CSS. Fully ready for deployment on Vercel.

## 🌟 Features

### Public Page
- **Hero Section**: Animated names and tagline with floating hearts
- **Music Section**: Audio player with song cover display
- **Gallery Section**: Image carousel with smooth transitions (Portrait 3:4)
- **Message Section**: Personalized love message with typewriter effect
- **Falling Animations**: Hearts and stars falling with glow effects
- **Advanced Background**: Multi-layered gradient with radial effects
- **Footer**: Start date and romantic footer
- **Real-time Updates**: Automatically reflects admin changes

### Admin Panel
- **Secure Login/Register**: JWT authentication
- **Content Management**: Edit names, tagline, and love message
- **Image Upload**: Multiple image upload for gallery
- **Image Cropper**: Advanced image cropping with multiple aspect ratios
  - Portrait (3:4) - Default
  - Landscape (4:3)
  - Square (1:1)
  - Wide (16:9)
- **Music Upload**: Upload MP3 love song
- **Cover Upload**: Upload song cover image
- **Live Updates**: Changes appear immediately on public page

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **Node.js API Routes**
- **MongoDB + Mongoose**
- **TailwindCSS**
- **JWT Authentication**
- **Vercel Deployment**

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Vercel account (for deployment)

## 🚀 Local Setup

### 1. Clone and Install Dependencies

```bash
cd "Gift love"
npm install
```

### 2. Environment Variables

The `.env.local` file is already configured with:
```
MONGODB_URI=mongodb+srv://yahyaemad999_db_user:jYVOXbdTiww6Ngos@cluster0.lmh2xxt.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**⚠️ Important**: Change `JWT_SECRET` in production!

### 3. Create Admin Account

First, register a new admin account:

```bash
npm run dev
```

Visit `http://localhost:3000/admin/register` and create your account.

Or use demo credentials:
- Email: `admin@example.com`
- Password: `admin123`

### 4. Access the App

- **Public Page**: `http://localhost:3000`
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

## 📝 Admin Panel Usage

1. **Login** to the admin panel
2. **Edit Content Tab**:
   - Change names (Ahmed, Mai)
   - Update tagline
   - Write love message
   - Set start date
3. **Images Tab**:
   - Upload multiple images
   - Delete images
4. **Music Tab**:
   - Upload MP3 song
   - Upload cover image

All changes are saved to MongoDB and appear instantly on the public page.

## 🌐 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/love-story-app.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random secret (change from default!)
   - `NEXT_PUBLIC_API_URL`: Your Vercel domain (e.g., `https://yourdomain.vercel.app`)
5. Click "Deploy"

### 3. Verify Deployment

- Public page: `https://yourdomain.vercel.app`
- Admin login: `https://yourdomain.vercel.app/admin/login`

## 🔐 Security Notes

- **JWT_SECRET**: Change this in production to a strong random string
- **MongoDB**: Use strong passwords and IP whitelisting
- **Environment Variables**: Never commit `.env.local` to git (already in `.gitignore`)
- **HTTPS**: Vercel provides free HTTPS

## 📱 Responsive Design

The app is fully responsive and works beautifully on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the rose/pink color scheme.

### Fonts
Modify `src/app/globals.css` to use different fonts.

### Animations
Adjust animation speeds in `tailwind.config.js` and `globals.css`.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Upload Not Working
- Check file size limits (images: 10MB, songs: 50MB)
- Verify file format (images: PNG/JPG/GIF, songs: MP3)
- Check browser console for errors

### Admin Panel Not Loading
- Clear browser cache and localStorage
- Verify JWT token is valid
- Check browser console for errors

## 📞 Support

For issues or questions, check:
1. Browser console for error messages
2. MongoDB Atlas logs
3. Vercel deployment logs

## 📄 License

This project is created with ❤️ for Ahmed and Mai.

---

**Made with love** 💕 | Deployed on Vercel ✨
