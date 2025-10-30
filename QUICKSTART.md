# ⚡ Quick Start Guide

Get the Love Story App running in 5 minutes!

## 1️⃣ Install Dependencies

```bash
cd "Gift love"
npm install
```

## 2️⃣ Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

## 3️⃣ Access the App

### Public Page
- **URL**: `http://localhost:3000`
- **What you see**: Beautiful romantic homepage with hero section

### Admin Panel
- **Login**: `http://localhost:3000/admin/login`
- **Register**: `http://localhost:3000/admin/register`

### Demo Credentials
```
Email: admin@example.com
Password: admin123
```

## 4️⃣ First Time Setup

### Option A: Use Demo Account
1. Go to `http://localhost:3000/admin/login`
2. Use demo credentials above
3. Start editing!

### Option B: Create Your Own Account
1. Go to `http://localhost:3000/admin/register`
2. Fill in your details
3. Click "Register"
4. You'll be logged in automatically

## 5️⃣ Admin Dashboard Features

### Edit Content
- Change names (Ahmed, Mai)
- Update tagline
- Write love message
- Set start date

### Upload Images
- Click "Images" tab
- Drag and drop or click to upload
- Multiple images supported

### Upload Music
- Click "Music" tab
- Upload MP3 song
- Upload cover image

## 🎨 Customization

### Change Names
1. Go to Admin Dashboard
2. Click "Content" tab
3. Edit "Male Name" and "Female Name"
4. Click "Save Changes"

### Change Colors
Edit `tailwind.config.js` to change the rose/pink theme.

### Change Fonts
Edit `src/app/globals.css` to use different fonts.

## 🚀 Deploy to Vercel

See `DEPLOYMENT.md` for complete deployment guide.

Quick version:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 📱 Test Responsiveness

The app works on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

Test by resizing your browser or using DevTools.

## 🐛 Common Issues

### "Cannot connect to MongoDB"
- Check `.env.local` has correct connection string
- Verify MongoDB Atlas IP whitelist

### "Admin login not working"
- Clear browser cache
- Try registering a new account
- Check browser console for errors

### "Images not uploading"
- Check file size (max 10MB)
- Check file format (PNG, JPG, GIF)
- Check browser console for errors

## 📚 File Structure

```
Gift love/
├── src/
│   ├── app/
│   │   ├── page.js              # Public homepage
│   ���   ├── layout.js            # Root layout
│   │   ├── globals.css          # Global styles
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Authentication
│   │   │   ├── content/         # Content CRUD
│   │   │   └── upload/          # File uploads
│   │   └── admin/               # Admin pages
│   │       ├── login/
│   │       ├── register/
│   │       └── dashboard/
│   ├── components/              # React components
│   ├── models/                  # MongoDB schemas
│   └── lib/                     # Utilities
├── package.json
├── tailwind.config.js
├── next.config.js
├── .env.local                   # Environment variables
└── README.md
```

## 🎯 Next Steps

1. ✅ Run locally with `npm run dev`
2. ✅ Test admin panel
3. ✅ Upload some images and music
4. ✅ Customize content
5. ✅ Deploy to Vercel (see DEPLOYMENT.md)
6. ✅ Share with your loved one! 💕

## 💡 Tips

- **Real-time Updates**: Public page auto-refreshes every 5 seconds
- **Responsive Design**: Works perfectly on mobile
- **Secure**: JWT authentication protects admin panel
- **Database**: All data stored in MongoDB

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Check terminal output for server errors
3. Read README.md for detailed documentation
4. Check DEPLOYMENT.md for deployment issues

---

**Happy coding!** ❤️ Make it special for your loved one! 💕
