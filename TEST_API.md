# اختبار API الكامل

## بيانات الاعتماد

### حساب المسؤول
- **البريد الإلكتروني**: admin@example.com
- **كلمة المرور**: admin123

### حساب الاختبار
- **البريد الإلكتروني**: test@example.com
- **كلمة المرور**: test123

## اختبار نقاط النهاية (Endpoints)

### 1. تسجيل الدخول (Login)

**الطلب:**
```bash
curl -X POST https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**الاستجابة المتوقعة:**
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

### 2. التسجيل (Register)

**الطلب:**
```bash
curl -X POST https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "newuser@example.com",
    "name": "New User"
  }
}
```

### 3. الحصول على المحتوى (Get Content)

**الطلب:**
```bash
curl -X GET https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/api/content \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. إنشاء محتوى جديد (Create Content)

**الطلب:**
```bash
curl -X POST https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "عنوان المحتوى",
    "description": "وصف المحتوى",
    "type": "story"
  }'
```

### 5. رفع صورة (Upload Image)

**الطلب:**
```bash
curl -X POST https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.jpg"
```

### 6. رفع أغنية (Upload Song)

**الطلب:**
```bash
curl -X POST https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/api/upload/song \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/song.mp3"
```

### 7. رفع صورة الغلاف (Upload Cover)

**الطلب:**
```bash
curl -X POST https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/api/upload/cover \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/cover.jpg"
```

## خطوات الاختبار اليدوي

### الخطوة 1: زيارة الموقع
1. اذهب إلى: https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app
2. يجب أن ترى الصفحة الرئيسية

### الخطوة 2: تسجيل الدخول
1. اذهب إلى: https://lovesory-qxnh149g6-yahyakashkoshs-projects.vercel.app/admin/login
2. أدخل البريد الإلكتروني: `admin@example.com`
3. أدخل كلمة المرور: `admin123`
4. انقر على "Login"

### الخطوة 3: الوصول إلى لوحة التحكم
1. بعد تسجيل الدخول بنجاح، يجب أن تنتقل إلى: `/admin/dashboard`
2. يجب أن ترى لوحة التحكم

### الخطوة 4: رفع محتوى
1. في لوحة التحكم، ابح�� عن خيار رفع الملفات
2. جرب رفع:
   - صورة (JPG, PNG)
   - أغنية (MP3)
   - صورة غلاف (JPG, PNG)

### الخطوة 5: إنشاء محتوى جديد
1. في لوحة التحكم، ابحث عن خيار إنشاء محتوى جديد
2. أضف:
   - عنوان
   - وصف
   - نوع المحتوى
   - الملفات المرتبطة

## استكشاف الأخطاء

### خطأ: "Invalid credentials"
- تحقق من البريد الإلكتروني وكلمة المرور
- تأكد من أن الحساب موجود في قاعدة البيانات

### خطأ: "Internal server error"
- تحقق من اتصال MongoDB
- تحقق من سجلات Vercel
- تأكد من أن جميع متغيرات البيئة مضبوطة

### خطأ: "Unauthorized"
- تأكد من إرسال التوكن في رأس الطلب
- تحقق من صحة التوكن
- تأكد من عدم انتهاء صلاحية التوكن

## ملاحظات مهمة

- ✅ جميع الطلبات يجب أن تكون عبر HTTPS
- ✅ يجب إرسال التوكن في رأس `Authorization: Bearer TOKEN`
- ✅ جميع الطلبات تحتاج إلى `Content-Type: application/json`
- ✅ الملفات المرفوعة يجب أن تكون بصيغ محددة

## الحالة الحالية

✅ MongoDB متصل وعامل
✅ API endpoints مكونة
✅ المسؤول موجود في قاعدة البيانات
✅ التطبيق مرفوع على Vercel

---

**آخر تحديث**: 2024
