# ✅ إصلاح خطأ Vercel

## المشكلة
```
Invalid request: `env` should be object.
```

## السبب
كان ملف `vercel.json` يحتوي على `env` كـ array بدلاً من object.

## الحل المطبق ✅

### قبل (خطأ):
```json
"env": [
  {
    "key": "MONGODB_URI",
    "description": "MongoDB connection string"
  }
]
```

### بعد (صحيح):
```json
"env": {
  "MONGODB_URI": {
    "description": "MongoDB connection string"
  }
}
```

## الملف الصحيح الآن

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "MONGODB_URI": {
      "description": "MongoDB connection string"
    },
    "JWT_SECRET": {
      "description": "JWT secret key for authentication"
    },
    "NEXT_PUBLIC_API_URL": {
      "description": "Public API URL"
    }
  },
  "functions": {
    "src/app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## الخطوات التالية

### 1. إعادة النشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اختر المشروع
3. انقر على "Redeploy"
4. أو انقر على "New Deployment"

### 2. إضافة متغيرات البيئة
في لوحة تحكم Vercel، أضف:

```
MONGODB_URI = mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET = your_super_secret_key_change_this_12345
NEXT_PUBLIC_API_URL = https://yourdomain.vercel.app
```

### 3. التحقق من النشر
- الصفحة الرئيسية: `https://yourdomain.vercel.app`
- لوحة التحكم: `https://yourdomain.vercel.app/admin/login`

## ✅ تم الإصلاح

الملف الآن صحيح وجاهز للنشر على Vercel!

---

**آخر تحديث**: 2024
**الحالة**: ✅ تم الإصلاح
