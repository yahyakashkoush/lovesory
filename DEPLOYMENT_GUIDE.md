# دليل النشر على Vercel

## المتطلبات
- حساب GitHub
- حساب Vercel
- حساب MongoDB Atlas
- رابط الاتصال بـ MongoDB (MONGODB_URI)

## الخطوات

### 1. تحضير المشروع محليًا

تأكد من أن جميع الملفات محدثة:
```bash
cd "/Users/yahyaemad/Desktop/Gift love"
git status
```

### 2. إضافة التحديثات إلى Git

```bash
git add .
git commit -m "Fix: Database connectivity and file storage on Vercel

- Convert file uploads to Base64 storage in MongoDB
- Add cache busting headers to prevent stale data
- Remove fs.writeFileSync dependency
- Update Content model with filename field
- Add environment configuration example"

git push origin main
```

### 3. إعداد Vercel

#### الخيار أ: النشر الأول
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط على "New Project"
3. اختر مستودع GitHub الخاص بك
4. اختر الفرع `main`
5. اضغط "Import"

#### الخيار ب: تحديث مشروع موجود
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر المشروع
3. اضغط على "Redeploy"

### 4. إضافة متغيرات البيئة

1. في Vercel Dashboard، اختر المشروع
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف المتغيرات التالية:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/love-story?retryWrites=true&w=majority
JWT_SECRET = your_strong_random_secret_key_here
```

**كيفية الحصول على MONGODB_URI:**
1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. اختر مشروعك
3. اضغط على "Connect"
4. اختر "Connect your application"
5. انسخ رابط الاتصال
6. استبدل `<password>` بكلمة مرور قاعدة البيانات

### 5. التحقق من النشر

بعد النشر، تحقق من:

1. **الصفحة الرئيسية:**
   - هل تظهر الأسماء والرسالة؟
   - هل تظهر الصور في المعرض؟
   - هل تعمل الأغنية؟

2. **Admin Dashboard:**
   - اذهب إلى `/admin/login`
   - سجل الدخول
   - جرب تحديث النصوص
   - جرب رفع صورة
   - تحقق من ظهورها على الصفحة الرئيسية

3. **Vercel Logs:**
   - اذهب إلى **Deployments**
   - اختر آخر deployment
   - اضغط على **View Logs**
   - تحقق من عدم وجود أخطاء

## استكشاف الأخطاء

### خطأ: "Cannot connect to MongoDB"

**الحل:**
1. تحقق من أن `MONGODB_URI` صحيح
2. تحقق من أن IP Vercel مضاف إلى MongoDB whitelist:
   - اذهب إلى MongoDB Atlas
   - اختر **Network Access**
   - أضف `0.0.0.0/0` (السماح من أي مكان)
   - أو أضف IP Vercel الخاص بك

### خطأ: "Invalid token"

**الحل:**
1. تأكد من أن `JWT_SECRET` موجود في Vercel
2. تأكد من أن `JWT_SECRET` نفسه محليًا وعلى Vercel
3. حاول تسجيل الدخول مرة أخرى

### خطأ: "File size exceeds limit"

**الحل:**
- الحد الأقصى للصور: 5MB
- الحد الأقصى للأغاني: 50MB
- الحد الأقصى للأغلفة: 10MB

### البيانات لا تظهر على الواجهة الأمامية

**الحل:**
1. افتح Developer Tools (F12)
2. اذهب إلى **Network** tab
3. تحقق من أن `/api/content` يعيد البيانات
4. تحقق من أن MongoDB متصلة
5. انظر إلى Vercel logs للأخطاء

## الأداء والتحسينات

### حول تخزين الملفات
- **الطريقة القديمة:** حفظ في `/public/uploads` (ل�� تعمل على Vercel)
- **الطريقة الجديدة:** حفظ كـ Base64 في MongoDB (تعمل في كل مكان)

### حول الحد الأقصى للبيانات
- MongoDB له حد أقصى لحجم المستند: 16MB
- إذا أردت تخزين ملفات أكبر، استخدم:
  - Cloudinary (للصور)
  - AWS S3 (للملفات الكبيرة)
  - Firebase Storage

## الأمان

### متغيرات البيئة
- ✅ لا تشارك `MONGODB_URI` أو `JWT_SECRET`
- ✅ استخدم قيم قوية عشوائية
- ✅ غير `JWT_SECRET` بشكل دوري

### HTTPS
- ✅ Vercel يوفر HTTPS مجانًا
- ✅ جميع الاتصالات مشفرة

### قاعدة البيانات
- ✅ استخدم كلمات مرور قوية
- ✅ قيد الوصول بـ IP whitelist
- ✅ استخدم SSL/TLS للاتصال

## الخطوات التالية

بعد النشر الناجح:

1. **اختبر جميع الميزات:**
   - تحديث النصوص
   - رفع الصور
   - رفع الأغنية
   - حذف الصور

2. **راقب الأداء:**
   - استخدم Vercel Analytics
   - تحقق من سرعة التحميل
   - تحقق من استخدام قاعدة البيانات

3. **النسخ الاحتياطية:**
   - قم بعمل نسخة احتياطية من MongoDB بشكل دوري
   - احفظ البيانات المهمة

## الدعم

إذا واجهت مشاكل:

1. تحقق من [Vercel Docs](https://vercel.com/docs)
2. تحقق من [MongoDB Docs](https://docs.mongodb.com)
3. انظر إلى Vercel logs للأخطاء
4. جرب إعادة النشر

---

**آخر تحديث:** 2024
**الحالة:** جاهز للنشر ✅
