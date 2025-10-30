# 📦 دليل التثبيت والنشر

## المتطلبات الأساسية

- Node.js 18+ و npm
- MongoDB Atlas (حساب مجاني)
- Vercel (حساب مجاني)
- Git

## 🚀 التثبيت المحلي

### الخطوة 1: تثبيت المكتبات

```bash
cd "Gift love"
npm install
```

### الخطوة 2: التحقق من المكتبات الجديدة

تأكد من تثبيت المكتبات الجديدة:

```bash
npm list react-easy-crop react-image-crop
```

يجب أن ترى:
```
├── react-easy-crop@4.7.5
└── react-image-crop@11.0.7
```

### الخطوة 3: تشغيل الموقع محلياً

```bash
npm run dev
```

الموقع سيكون متاحاً على: `http://localhost:3000`

### الخطوة 4: اختبار المميزات الجديدة

1. **اختبر تأثير الكتابة**:
   - اذهب إلى الصفحة الرئيسية
   - انتقل إلى قسم الرس��لة
   - شاهد الرسالة تُكتب حرف بحرف

2. **اختبر قص الصور**:
   - اذهب إلى لوحة التحكم
   - انقر على تبويب "Images"
   - انقر على "Crop & Upload"
   - اختر صورة وقصها

3. **اختبر الخلفية الجديدة**:
   - شاهد الخلفية المتقدمة
   - لاحظ التأثيرات الناعمة

## 🌐 النشر على Vercel

### الخطوة 1: إعداد Git

```bash
git init
git add .
git commit -m "Initial commit with new features"
```

### الخطوة 2: رفع إلى GitHub

```bash
git remote add origin https://github.com/yourusername/love-story-app.git
git branch -M main
git push -u origin main
```

### الخطوة 3: نشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر على "New Project"
3. اختر مستودع GitHub الخاص بك
4. انقر على "Import"

### الخطوة 4: إضافة متغيرات البيئة

في صفحة إعدادات Vercel، أضف:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key_change_this_12345
NEXT_PUBLIC_API_URL=https://yourdomain.vercel.app
```

### الخطوة 5: النشر

انقر على "Deploy" وانتظر انته��ء النشر.

## ✅ التحقق من النشر

### 1. اختبر الصفحة الرئيسية
```
https://yourdomain.vercel.app
```

### 2. اختبر لوحة التحكم
```
https://yourdomain.vercel.app/admin/login
```

### 3. اختبر المميزات الجديدة
- تأثير الكتابة
- قص الصور
- الخلفية الجديدة

## 🔧 استكشاف الأخطاء

### المشكلة: خطأ في التثبيت

**الحل**:
```bash
# احذف node_modules و package-lock.json
rm -rf node_modules package-lock.json

# ثبت المكتبات مرة أخرى
npm install
```

### المشكلة: خطأ في Vercel

**الحل**:
1. تحقق من متغيرات البيئة
2. تأكد من اتصال MongoDB
3. تحقق من السجلات في Vercel

### المشكلة: قص الصور لا يعمل

**الحل**:
1. تأكد من تثبيت المكتبات الجديدة
2. امسح ذاكرة التخزين المؤقت
3. أعد تحميل الصفحة

## 📊 التحقق من الأداء

### محلياً:
```bash
npm run build
npm start
```

### على Vercel:
1. اذهب إلى لوحة تحكم Vercel
2. انقر على "Analytics"
3. شاهد إحصائيات الأداء

## 🔐 الأمان

### تغيير JWT_SECRET

**مهم جداً**: غيّ�� `JWT_SECRET` في الإنتاج!

```bash
# توليد مفتاح عشوائي قوي
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

استخدم الناتج كـ `JWT_SECRET` في Vercel.

### تأمين MongoDB

1. استخدم كلمة مرور قوية
2. قيّد الوصول بـ IP Whitelist
3. استخدم HTTPS فقط

## 📝 ملفات التكوين المهمة

### `.env.local` (محلي فقط)
```
MONGODB_URI=...
JWT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### `vercel.json` (للنشر)
```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### `next.config.js` (تحسينات Vercel)
```javascript
{
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false
}
```

## 🎯 قائمة التحقق قبل النشر

- [ ] تثبيت جميع المكتبات
- [ ] اختبار محلياً
- [ ] تغيير JWT_SECRET
- [ ] التحقق من متغيرات البيئة
- [ ] اختبار قص الصور
- [ ] اختبار تأثير الكتابة
- [ ] اختبار الخلفية الجديدة
- [ ] التحقق من الأداء
- [ ] النشر على Vercel
- [ ] اختبار على الإنت��ج

## 📞 الدعم

إذا واجهت مشاكل:

1. **تحقق من السجلات**:
   - محلياً: انظر إلى console
   - Vercel: اذهب إلى Deployments > Logs

2. **تحقق من المتطلبات**:
   - Node.js 18+
   - npm محدث
   - MongoDB متصل

3. **جرب الحلول الشائعة**:
   - امسح ذاكرة التخزين المؤقت
   - أعد تثبيت المكتبات
   - أعد تحميل الصفحة

## 🎉 تم!

تهانينا! الموقع الآن جاهز للاستخدام مع جميع المميزات الجديدة.

---

**ملاحظة**: احفظ هذا الدليل للرجوع إليه لاحقاً.
