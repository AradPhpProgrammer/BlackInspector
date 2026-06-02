
<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Iran_%281964%E2%80%931980%29.svg" alt="پرچم ایران (شیر و خورشید)" width="150">

### [English](../README.md) | [Русский](README-ru.md)

# BlackInspect v7.0
**فریم‌ورک پیشرفته امنیت و تست مرورگر**

[![Release](https://img.shields.io/github/v/release/AradPhpProgrammer/BlackInspector?color=blue)](https://github.com/AradPhpProgrammer/BlackInspector/releases)
[![License](https://img.shields.io/github/license/AradPhpProgrammer/BlackInspector)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://python.org)

</div>

---

## 🚀 نصب سریع

> ⚠️ **مهم:** ۵۰٪ از قابلیت‌های افزونه **بدون کرنل** کار می‌کنند، اما برای عملکرد کامل، **کرنل باید روشن باشد**.

### مرحله ۱: دانلود و استخراج
۱. به [برنچ test-main](https://github.com/AradPhpProgrammer/BlackInspector/tree/test-main) بروید.
۲. روی دکمه سبز **Code** کلیک کنید.
۳. گزینه **Download ZIP** را انتخاب کنید.
۴. فایل ZIP دانلود شده را در یک پوشه در کامپیوتر خود استخراج کنید.
۵. ترمینال یا Command Prompt را باز کنید و به پوشه استخراج شده بروید.

### مرحله ۲: نصب و اجرای کرنل پایتون
**ویندوز:**
کافیست روی `run.bat` دوبار کلیک کنید (یا `run.bat` را در Command Prompt اجرا کنید).

**لینوکس/مک:**
ترمینال را در پوشه استخراج شده باز کنید و دستور زیر را اجرا کنید:
```bash
chmod +x run.sh
./run.sh
```
*(این اسکریپت به صورت خودکار تمام وابستگی‌های پایتون مورد نیاز را نصب کرده و کرنل را اجرا می‌کند).*

### مرحله ۳: نصب اسکریپت Tampermonkey
۱. افزونه [Tampermonkey](https://www.tampermonkey.net/) را در مرورگر خود نصب کنید.
۲. فایل `BlackInspector.js` را از پوشه استخراج شده با یک ویرایشگر متن (مثل Notepad) باز کنید.
۳. تمام محتوا را کپی کنید.
۴. در Tampermonkey روی "Create a new script" کلیک کنید.
۵. محتوا را پیست کرده و ذخیره کنید (Ctrl+S یا Cmd+S).

### مرحله ۴: تنظیم اتصال
۱. پنل BlackInspect را در مرورگر خود باز کنید.
۲. به تب **Settings** بروید.
۳. آدرس Kernel را روی `http://localhost:5000` (یا پورتی که در ترمینال نمایش داده می‌شود) تنظیم کنید.
۴. روی "Test Connection" کلیک کنید.

---

## ✨ ویژگی‌ها

### 🔐 ابزارهای امنیتی
- **Bruteforce دایرکتوری**: اسکن ۷۰+ مسیر رایج (`/admin`, `/.env`, `/.git`)
- **اسکنر ساب‌دامین**: تشخیص DNS با Subdomain Takeover
- **پی‌لودهای XSS و SQLi**: پی‌لودهای آماده تست امنیت
- **تحلیل هدرهای SSL**: بررسی HSTS, CSP, X-Frame-Options و غیره

### 🌐 ابزارهای شبکه
- **تزریق احراز هویت**: تزریق خودکار توکن‌های احراز هویت به تمام درخواست‌ها
- **تغییردهنده درخواست**: تغییر URL با استفاده از الگوهای Regex
- **جلوگیری از Preflight**: دور زدن درخواست‌های CORS preflight
- **مدیریت کوکی**: مشاهده، ویرایش و صادرات کوکی‌ها

### 📄 سوئیت PDF (نیاز به کرنل)
- تولید PDF از صفحه وب
- استخراج متن از PDF
- ادغام/تقسیم فایل‌های PDF
- فشرده‌سازی PDF
- تبدیل PDF به تصویر

### 🎭 ضد تشخیص
- جعل Canvas
- مخفی‌سازی تب
- مخفی‌سازی افزونه‌ها
- جعل BuildID
- تشخیص Anti-VM
- چرخش User-Agent

### 🔑 مدیریت رمز عبور
- ذخیره‌سازی رمزنگاری شده (Fernet/PBKDF2)
- پر کردن خودکار اطلاعات ورود
- همگام‌سازی امن از طریق کرنل

### ✅ مدیریت وظایف
- لیست کارها با ذخیره‌سازی امن
- اولویت‌بندی وظایف
- پیگیری تکمیل

### 🎲 تولید داده جعلی
- تولید نام، ایمیل، تلفن جعلی
- پر کردن خودکار فرم‌ها با داده‌های جعلی
- قالب‌های داده سفارشی

---

## 📺 آموزش

🎥 **آموزش کامل را در یوتیوب ببینید:**

[![آموزش BlackInspect](https://img.shields.io/badge/YouTube-مشاهده%20آموزش-red?logo=youtube&style=for-the-badge)](https://youtube.com/@AradPhpProgrammer)

---

## 📋 پیش‌نیازها

- پایتون ۳.۸ یا بالاتر
- مرورگر مدرن (Chrome, Firefox, Edge)
- افزونه Tampermonkey
- اتصال اینترنت

### وابستگی‌های پایتون
*(به صورت خودکار توسط `run.bat` یا `run.sh` نصب می‌شوند)*
```text
fastapi, uvicorn, cryptography, aiohttp, dnspython, psutil, pypdf, pdfplumber, reportlab, pymupdf, rich
```

---

## 🛡️ نکات امنیتی

این ابزار فقط برای **اهداف آموزشی و تست مجاز** است. 
همیشه قبل از تست هر وب‌سایتی، اطمینان حاصل کنید که مجوز لازم را دارید.

---

## 📝 لایسنس

این پروژه تحت لایسنس MIT است - فایل [LICENSE](../LICENSE) را برای جزئیات ببینید.

---

## 👨‍💻 توسعه‌دهنده

**AradPhpProgrammer**
- گیت‌هاب: [@AradPhpProgrammer](https://github.com/AradPhpProgrammer)
- یوتیوب: [AradPhpProgrammer](https://youtube.com/@AradPhpProgrammer)

---

<div align="center">

**اگر این پروژه را دوست دارید، لطفاً ⭐ ستاره دهید!**

ساخته شده با ❤️ در ایران

</div>
