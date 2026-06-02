
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
۱. به [برنچ test-main](https://github.com/AradPhpProgrammer/BlackInspector/tree/test-main) بروید. <br/>
۲. روی دکمه سبز **Code** کلیک کنید. <br/>
۳. گزینه **Download ZIP** را انتخاب کنید. <br/>
۴. فایل ZIP دانلود شده را در یک پوشه در کامپیوتر خود استخراج کنید. <br/>
۵. ترمینال یا Command Prompt را باز کنید و به پوشه استخراج شده بروید. <br/>

### مرحله ۲: نصب و اجرای کرنل پایتون
**ویندوز:** <br/>
کافیست روی `run.bat` دوبار کلیک کنید (یا `run.bat` را در Command Prompt اجرا کنید). <br/>

**لینوکس/مک:** <br/>
ترمینال را در پوشه استخراج شده باز کنید و دستور زیر را اجرا کنید: <br/>
```bash
chmod +x run.sh
./run.sh    
```
*(این اسکریپت به صورت خودکار تمام وابستگی‌های پایتون مورد نیاز را نصب کرده و کرنل را اجرا می‌کند).* <br/>

### مرحله ۳: نصب اسکریپت Tampermonkey
۱. افزونه [Tampermonkey](https://www.tampermonkey.net/) را در مرورگر خود نصب کنید. <br/>
۲. فایل `BlackInspector.js` را از پوشه استخراج شده با یک ویرایشگر متن (مثل Notepad) باز کنید. <br/>
۳. تمام محتوا را کپی کنید. <br/>
۴. در Tampermonkey روی "Create a new script" کلیک کنید. <br/>
۵. محتوا را پیست کرده و ذخیره کنید (Ctrl+S یا Cmd+S). <br/>

### مرحله ۴: تنظیم اتصال
۱. پنل BlackInspect را در مرورگر خود باز کنید. <br/>
۲. به تب **Settings** بروید. <br/>
۳. آدرس Kernel را روی `http://localhost:5000` (یا پورتی که در ترمینال نمایش داده می‌شود) تنظیم کنید. <br/>
۴. روی "Test Connection" کلیک کنید. <br/>

---

## ✨ ویژگی‌ها

### 🔐 ابزارهای امنیتی
- **Bruteforce دایرکتوری**: اسکن ۷۰+ مسیر رایج (`/admin`, `/.env`, `/.git`) <br/>
- **اسکنر ساب‌دامین**: تشخیص DNS با Subdomain Takeover <br/>
- **پی‌لودهای XSS و SQLi**: پی‌لودهای آماده تست امنیت <br/>
- **تحلیل هدرهای SSL**: بررسی HSTS, CSP, X-Frame-Options و غیره <br/>

### 🌐 ابزارهای شبکه
- **تزریق احراز هویت**: تزریق خودکار توکن‌های احراز هویت به تمام درخواست‌ها <br/>
- **تغییردهنده درخواست**: تغییر URL با استفاده از الگوهای Regex <br/>
- **جلوگیری از Preflight**: دور زدن درخواست‌های CORS preflight <br/>
- **مدیریت کوکی**: مشاهده، ویرایش و صادرات کوکی‌ها <br/>

### 📄 سوئیت PDF (نیاز به کرنل)
- تولید PDF از صفحه وب <br/>
- استخراج متن از PDF <br/>
- ادغام/تقسیم فایل‌های PDF <br/>
- فشرده‌سازی PDF <br/>
- تبدیل PDF به تصویر <br/>

### 🎭 ضد تشخیص
- جعل Canvas <br/>
- مخفی‌سازی تب <br/>
- مخفی‌سازی افزونه‌ها <br/>
- جعل BuildID <br/>
- تشخیص Anti-VM <br/>
- چرخش User-Agent <br/>

### 🔑 مدیریت رمز عبور
- ذخیره‌سازی رمزنگاری شده (Fernet/PBKDF2) <br/>
- پر کردن خودکار اطلاعات ورود <br/>
- همگام‌سازی امن از طریق کرنل <br/>

### ✅ مدیریت وظایف
- لیست کارها با ذخیره‌سازی امن <br/>
- اولویت‌بندی وظایف <br/>
- پیگیری تکمیل <br/>

### 🎲 تولید داده جعلی
- تولید نام، ایمیل، تلفن جعلی <br/>
- پر کردن خودکار فرم‌ها با داده‌های جعلی <br/>
- قالب‌های داده سفارشی <br/>

---

## 📺 آموزش

🎥 **آموزش کامل را در یوتیوب ببینید:**

[![آموزش BlackInspect](https://img.shields.io/badge/YouTube-مشاهده%20آموزش-red?logo=youtube&style=for-the-badge)](https://youtube.com/@QcoTools)

---

## 📋 پیش‌نیازها

- پایتون ۳.۸ یا بالاتر <br/>
- مرورگر مدرن (Chrome, Firefox, Edge) <br/>
- افزونه Tampermonkey <br/>
- اتصال اینترنت <br/>

### وابستگی‌های پایتون
*(به صورت خودکار توسط `run.bat` یا `run.sh` نصب می‌شوند)* <br/>
```text
fastapi, uvicorn, cryptography, aiohttp, dnspython, psutil, pypdf, pdfplumber, reportlab, pymupdf, rich
```

---

## 🛡️ نکات امنیتی

این ابزار فقط برای **اهداف آموزشی و تست مجاز** است. <br/>
همیشه قبل از تست هر وب‌سایتی، اطمینان حاصل کنید که مجوز لازم را دارید. <br/>

---

## 📝 لایسنس

این پروژه تحت لایسنس MIT است - فایل [LICENSE](../LICENSE) را برای جزئیات ببینید. <br/>

---

## 👨‍💻 توسعه‌دهنده

**AradPhpProgrammer** <br/>
- گیت‌هاب: [@AradPhpProgrammer](https://github.com/AradPhpProgrammer) <br/>
- یوتیوب: [QcoTools](https://youtube.com/@QcoTools) <br/>

---

<div align="center">

**اگر این پروژه را دوست دارید، لطفاً ⭐ ستاره دهید!**

ساخته شده با ❤️ در ایران

</div>
