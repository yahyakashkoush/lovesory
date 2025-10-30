# دليل الإعداد الكامل - Love Story App

## 🎯 الحالة الحالية

✅ **تم إنجازه:**
- MongoDB Atlas متصل ويعمل محلياً
- API endpoints مكونة وجاهزة
- Next.js مرفوع على Vercel
- المسؤول موجود في قاعدة البيانات
- JWT Authentication مكون

⏳ **في الانتظار:**
- إضافة Vercel IP إلى MongoDB Atlas Whitelist

---

## 📋 خطوات الإعداد النهائي

### الخطوة 1: إضافة IP Whitelist في MongoDB Atlas

**اتبع هذه الخطوات بالضبط:**

1. اذهب إلى: https://cloud.mongodb.com
2. سجل الدخول بحسابك
3. اختر المشروع (Project)
4. من القائمة الجانبية، اختر **Network Access**
5. انقر على الزر الأخضر **+ Add IP Address**
6. في النافذة المنبثقة:
   - اختر **Allow access from anywhere** أو أدخل `0.0.0.0/0`
   - أضف وصف: "Vercel Deployment"
   - انقر **Confirm**
7. انتظر حتى يتم التحديث (قد يستغرق دقيقة)

### الخطوة 2: اختبر الاتصال

بعد إضافة IP، جرب:

```bash
# اختبر API التسجيل
curl -X POST "https://lovesory-59rvvvf5v-yahyakashkoshs-projects.vercel.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

يجب أن تحصل على استجابة مثل:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin"
  }
}
```

### الخطوة 3: زيارة الموقع

1. اذهب إلى: https://lovesory-59rvvvf5v-yahyakashkoshs-projects.vercel.app
2. يجب أن ترى الصفحة الرئيسية

### الخطوة 4: تسجيل الدخول

1. اذهب إلى: https://lovesory-59rvvvf5v-yahyakashkoshs-projects.vercel.app/admin/login
2. أدخل البيانات:
   - **البريد**: admin@example.com
   - **كلمة المرور**: admin123
3. انقر **Login**

### الخطوة 5: لوحة التحكم

بعد تسجيل الدخول، يجب أن تنتقل إلى:
https://lovesory-59rvvvf5v-yahyakashkoshs-projects.vercel.app/admin/dashboard

---

## 🔐 بيانات الاعتماد

### حساب المسؤول
```
البريد الإلكتروني: admin@example.com
كلمة المرور: admin123
```

### حساب الاختبار
```
البريد الإلكتروني: test@example.com
كلمة المرور: test123
```

---

## 📡 نقاط النهاية (API Endpoints)

### المصادقة (Authentication)

#### تسجيل الدخول
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### التسجيل
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "User Name"
}
```

### المحتوى (Content)

#### الحصول على المحتوى
```
GET /api/content
```

#### تحديث المحتوى
```
PUT /api/content
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "maleFirstName": "Ahmed",
  "femaleFirstName": "Mai",
  "tagline": "Our love story...",
  "loveMessage": "I love you..."
}
```

### الملفات (File Upload)

#### رفع صورة
```
POST /api/upload/image
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: <image file>
```

#### رفع أغنية
```
POST /api/upload/song
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: <audio file>
```

#### رفع صورة الغلاف
```
POST /api/upload/cover
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: <image file>
```

---

## 🗄️ قاعدة البيانات

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Content
```javascript
{
  _id: ObjectId,
  maleFirstName: String,
  femaleFirstName: String,
  tagline: String,
  loveMessage: String,
  images: [
    {
      url: String (base64),
      uploadedAt: Date
    }
  ],
  song: {
    url: String (base64),
    uploadedAt: Date
  },
  songCover: {
    url: String (base64),
    uploadedAt: Date
  },
  startDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 الميزات

### ✅ المصادقة
- تسجيل دخول آمن
- تسجيل حسابات جديدة
- JWT Tokens
- كلمات مرور مشفرة (bcrypt)

### ✅ إدارة المحتوى
- إضافة أسماء الأشخاص
- كتابة الرسائل
- تحديد تاريخ البداية

### ✅ رفع الملفات
- رفع الصور
- رفع الأغاني
- رفع صور الأغلفة

### ✅ واجهة المستخدم
- صفحة رئيسية جميلة
- لوحة ت��كم للمسؤول
- معرض الصور
- مشغل الموسيقى

---

## 🔧 استكشاف الأخطاء

### خطأ: "Could not connect to any servers"
**الحل**: أضف IP Whitelist في MongoDB Atlas

### خطأ: "Invalid credentials"
**الحل**: تحقق من البريد الإلكتروني وكلمة المرور

### خطأ: "Unauthorized"
**الحل**: تأكد من إرسال التوكن في رأس الطلب

### خطأ: "FUNCTION_INVOCATION_TIMEOUT"
**الحل**: تم زيادة المهلة الزمنية إلى 60 ثانية

---

## 📱 الأجهزة المدعومة

- ✅ الهواتف الذكية (iOS و Android)
- ✅ الأجهزة اللوحية
- ✅ أجهزة الكمبيوتر المكتبية
- ✅ المتصفحات الحديثة

---

## 🔒 الأمان

- ✅ كلمات مرور مشفرة (bcrypt)
- ✅ JWT Tokens
- ✅ HTTPS فقط
- ✅ متغيرات البيئة الآمنة
- ✅ التحقق من المصادقة

---

## 📊 الإحصائيات

- **المستخدمون**: 2 (Admin + Test)
- **المحتوى**: 1 (Default)
- **الصور**: 0 (جاهزة للرفع)
- **الأغاني**: 0 (جاهزة للرفع)

---

## 🎨 التخصيص

يمكنك تخصيص:
- الألوان والأنماط (Tailwind CSS)
- الرسائل و��لنصوص
- الصور والأغاني
- الخطوط والأحجام

---

## 📞 الدعم

للمساعدة:
1. تحقق من سجلات Vercel
2. تحقق من اتصال MongoDB
3. تحقق من متغيرات البيئة
4. اقرأ رسائل الخطأ بعناية

---

## ✅ قائمة التحقق النهائية

- [ ] تم إضافة IP Whitelist في MongoDB Atlas
- [ ] تم اختبار API التسجيل
- [ ] تم تسجيل الدخول بنجاح
- [ ] تم الوصول إلى لوحة التحكم
- [ ] تم رفع صورة
- [ ] تم رفع أغنية
- [ ] تم إنشاء محتوى جديد

---

**آخر تحديث**: 2024
**الحالة**: جاهز للاستخدام (بعد إضافة IP Whitelist)
