<div dir="rtl">

# خطوات النشر في متجر كروم

## قبل تبدأ
- الملف اللي بترفعه: `twitch-adblock-ar-1.0.0.zip` (موجود في مجلد المشروع، وما ينرفع لـGitHub).
- النصوص كلها في `store/description.md`.
- الصور في مجلد `store`:
  - `screenshot-1.png` و `screenshot-2.png`: لقطات الشاشة (1280×800).
  - `promo-tile.png`: البلاطة الترويجية الصغيرة (440×280).
  - الأيقونة 128×128: `extension/icons/128.png`.
- رابط سياسة الخصوصية: https://ryanathlawi.github.io/twitch-adblock-ar/

## ١. سجّل كمطوّر (مرة وحدة بس)
١. افتح https://chrome.google.com/webstore/devconsole وسجّل دخول بحساب قوقل.
٢. وافق على اتفاقية المطوّرين، وادفع رسوم التسجيل (٥ دولار، مرة وحدة) بنفسك.
٣. عبّي بيانات الحساب (الاسم اللي يطلع للناس والإيميل)، وأكّد الإيميل.

## ٢. ارفع الإضافة
١. اضغط **New item** (عنصر جديد) وارفع ملف الـzip.

## ٣. صفحة «Store listing» (بيانات المتجر)
- **Description:** انسخ الوصف الطويل من `description.md`.
- **Category:** أدوات (Tools). **Language:** العربية.
- **Store icon:** ارفع `extension/icons/128.png`.
- **Screenshots:** ارفع اللقطتين.
- **Small promo tile:** ارفع `promo-tile.png`.

## ٤. صفحة «Privacy» (الخصوصية)
- **Single purpose** (الغرض الوحيد): انسخه من `description.md`.
- **Permission justification** (تبرير الصلاحيات): كل صلاحية لها سطر جاهز في `description.md`.
- **Remote code** (كود بعيد): اختر **No**.
- **Data usage** (استخدام البيانات): لا تختار أي نوع، وأشّر على الإقرارات الثلاثة.
- **Privacy policy URL:** حط الرابط اللي فوق.

## ٥. صفحة «Distribution» (التوزيع)
- **Visibility:** عام (Public). **Regions:** كل الدول.

## ٦. أرسل للمراجعة
اضغط **Submit for review**. المراجعة تاخذ عادة من يوم لأسبوعين، وإضافات حجب الإعلانات أحيانًا تطوّل شوي. أول ما تنقبل، حط رابطها في README.

## تحديث الإضافة بعدين
١. زِد رقم `version` في `extension/manifest.json` (مثلاً 1.0.1).
٢. سوِّ zip جديد للمجلد `extension` (من داخله، بحيث يكون `manifest.json` في أول الملف).
٣. من صفحة الإضافة في لوحة المطوّر: **Package** ← **Upload new package** ← **Submit for review**.

</div>
