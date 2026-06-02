# BlackInspect v6.1.3 Ultimate

<p align="right" dir="rtl">
  <strong>فارسی</strong> – برای راهنمای نصب و توضیحات به فارسی، <a href="#راهنمای-فارسی">اینجا کلیک کنید</a>.
</p>

---

## 🚀 Overview

BlackInspect is a powerful **Tampermonkey userscript** that adds a full-featured inspection, spoofing, and hacking toolset directly into any webpage. It gives you a floating panel with 13 tabs covering everything from network info to canvas fingerprint spoofing, XSS injection, password management, and even a split‑view AI launcher.

### 🔍 What can you do?

- **Info** – View server, IP, protocol, page metadata, links count, response headers.
- **Vars** – Scan and export global JavaScript variables.
- **Inject** – Run arbitrary JavaScript code.
- **Spoof** – Fake your IP, User‑Agent, platform, and language, with a live request monitor.
- **Pass** – Generate strong passwords, save them per domain, auto‑fill fake names/emails/phones.
- **Storage** – View and set cookies / localStorage.
- **Tools** – Break page restrictions (right‑click, copy, paste, etc.), download full page, copy all text, stop/resume loading, inject XSS payloads, reveal password fields, take full‑page screenshots, and open a split view with ChatGPT/DeepSeek/Gemini/Claude/Kimi.
- **DOM** – Real‑time mutation observer.
- **Canvas** – Toggle canvas spoofing to defeat fingerprinting.
- **ModReq** – Intercept fetch requests and add custom headers.
- **Sync** – Load profile settings from a remote URL.
- **Safe** – Placeholder for future safe mode.
- **Settings** – Choose language (English / Persian), set Python kernel path, default save filenames, and pick a folder for exporting files.

---

## 📦 Installation

1. Install the **Tampermonkey** extension for your browser:
   - [Chrome / Edge](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2. Click the Tampermonkey icon → **Create a new script...**.
3. Delete the default template and **paste the entire content** of `BlackInspect.user.js` (provided in this repository).
4. Press `Ctrl+S` (or `File` → `Save`) to install.
5. The script will automatically run on every website you visit. A ⚙ button will appear at the bottom‑right corner; click it to open the panel.

---

## 🎮 Usage

- The panel is draggable and resizable.
- All settings are **saved automatically** in Tampermonkey's storage.
- **Break restrictions** settings are **per‑domain** – you can break right‑click on one site without affecting others.
- Use `Ctrl+Z` to reset the panel position to its default.
- To save exported files (passwords, profiles, variables) directly to a folder, open **Settings** → **Pick save folder** (requires a browser that supports the File System Access API, e.g., Chrome).

---

## 📁 Repository Structure

BlackInspect/
├── BlackInspect.user.js ← The userscript
├── README.md ← You are here
└── (optional) main.py ← Python kernel file

---

## 🤝 Contributing

Pull requests are welcome! If you find a bug or have a feature request, please open an issue.

---

## 📜 License

This project is licensed under the **MIT License** – you are free to use, modify, and distribute it.

---

<h1 id="راهنمای-فارسی">🇮🇷 راهنمای فارسی</h1>

**BlackInspect** یک اسکریپت قدرتمند برای **Tampermonkey** است که یک مجموعه کامل از ابزارهای بازرسی، جعل هویت، شکستن محدودیت‌ها، مدیریت رمز عبور و … را در هر وب‌سایتی در اختیار شما می‌گذارد.

### 📥 نصب

1. افزونه **Tampermonkey** را برای مرورگر خود نصب کنید:
   - [کروم / Edge](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [فایرفاکس](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2. روی آیکون Tampermonkey کلیک کرده و **Create a new script...** را انتخاب کنید.
3. کد موجود در فایل `BlackInspect.user.js` را به‌طور کامل جای‌گذاری کنید.
4. با `Ctrl+S` (یا File → Save) ذخیره کنید.
5. اکنون اسکریپت روی هر سایتی فعال خواهد بود. یک دکمه ⚙ در گوشه پایین سمت راست ظاهر می‌شود؛ با کلیک روی آن پنل ابزارها باز می‌شود.

### ⚙️ نحوه استفاده

- پنل قابل کشیدن و تغییر اندازه است.
- تنظیمات به‌صورت خودکار ذخیره می‌شوند.
- تنظیمات **شکستن محدودیت‌ها** برای **هر دامنه جداگانه** است.
- با `Ctrl+Z` موقعیت پنل به حالت پیش‌فرض برمی‌گردد.
- برای ذخیره فایل‌های خروجی (پسورد، پروفایل، متغیرها) در یک پوشه خاص، به **تنظیمات** → **انتخاب پوشه ذخیره** بروید (نیازمند مرورگری است که File System Access API را پشتیبانی کند، مثل کروم).

### ✨ امکانات اصلی

- **اطلاعات**: مشاهده سرور، IP، هدرها، تعداد لینک‌ها و …
- **متغیرها**: پویش و خروجی متغیرهای جاوااسکریپت.
- **تزریق کد**: اجرای کد دلخواه.
- **جعل هویت**: تغییر IP، User‑Agent، سیستم‌عامل و زبان با لاگ زنده درخواست‌ها.
- **رمز**: تولید رمز قوی، ذخیره‌سازی به‌تفکیک دامنه، پر کردن خودکار نام/ایمیل/تلفن جعلی.
- **ذخیره‌سازی**: مشاهده و تنظیم کوکی و localStorage.
- **ابزارها**: شکستن محدودیت‌ها (راست‌کلیک، کپی، پیست و …)، دانلود کامل صفحه، کپی همه متن، توقف/ادامه بارگذاری، تزریق XSS، نمایش پسوردها، اسکرین‌شات تمام‌صفحه، نمایش دوگانه با ChatGPT و سایر AIها.
- **DOM**: پایش تغییرات زنده DOM.
- **بوم (Canvas)**: جعل اثر انگشت canvas برای جلوگیری از fingerprinting.
- **ModReq**: افزودن هدرهای دلخواه به درخواست‌های fetch.
- **همگام‌سازی**: بارگذاری پروفایل از یک URL.
- **امن**: جایگاه قابلیت‌های آینده.
- **تنظیمات**: تغییر زبان (انگلیسی / فارسی)، مسیر هسته پایتون، نام فایل‌های پیش‌فرض، انتخاب پوشه ذخیره.

---

## 🛠️ مشارکت

مشارکت شما باعث بهبود این پروژه می‌شود. لطفاً مخزن را fork کرده و تغییرات خود را از طریق pull request ارسال کنید.

## 📄 مجوز

این پروژه تحت مجوز **MIT** منتشر شده است.
