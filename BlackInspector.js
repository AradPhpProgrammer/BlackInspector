// ==UserScript==
// @name         BlackInspect v6.1.3 Ultimate
// @namespace    http://tampermonkey.net/
// @version      6.1.3
// @description  Full inspection & spoofing suite with persistent settings, password manager, XSS, stop loading, canvas spoof, request modifier, DOM monitor, scrolling screenshot, full Persian support, RTL/LTR adaptive panel, mobile responsive, keyboard shortcut, split view with AI, domain-based break restrictions, and more.
// @author       You
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// ==/UserScript==

(function() {
    'use strict';
    const D = document, W = unsafeWindow, N = navigator;
    const BS = 'bipv613us';
    let html2canvas = W.html2canvas;

    const domainKey = (base) => `${base}_${location.hostname}`;

    const S = {
        get ip() { return GM_getValue('ip', ''); },
        set ip(v) { GM_setValue('ip', v); },
        get ua() { return GM_getValue('ua', ''); },
        set ua(v) { GM_setValue('ua', v); },
        get platform() { return GM_getValue('platform', ''); },
        set platform(v) { GM_setValue('platform', v); },
        get language() { return GM_getValue('lang', ''); },
        set language(v) { GM_setValue('lang', v); },
        get breakOnStart() { return GM_getValue(domainKey('breakOnStart'), false); },
        set breakOnStart(v) { GM_setValue(domainKey('breakOnStart'), v); },
        get canvasSpoof() { return GM_getValue('canvasSpoof', false); },
        set canvasSpoof(v) { GM_setValue('canvasSpoof', v); },
        get spoofActive() { return GM_getValue('spoofActive', false); },
        set spoofActive(v) { GM_setValue('spoofActive', v); },
        get passwords() { try { return JSON.parse(GM_getValue('passwords', '[]')); } catch(e) { return []; } },
        set passwords(arr) { GM_setValue('passwords', JSON.stringify(arr)); },
        get panelLeft() { return GM_getValue('panelLeft', 10); },
        set panelLeft(v) { GM_setValue('panelLeft', v); },
        get panelTop() { return GM_getValue('panelTop', 10); },
        set panelTop(v) { GM_setValue('panelTop', v); },
        get panelWidth() { return GM_getValue('panelWidth', Math.min(window.innerWidth - 20, 820)); },
        set panelWidth(v) { GM_setValue('panelWidth', v); },
        get panelHeight() { return GM_getValue('panelHeight', Math.min(window.innerHeight - 20, 500)); },
        set panelHeight(v) { GM_setValue('panelHeight', v); },
        get activeTab() { return GM_getValue('activeTab', 'Info'); },
        set activeTab(v) { GM_setValue('activeTab', v); },
        get lang() { return GM_getValue('langSetting', 'en'); },
        set lang(v) { GM_setValue('langSetting', v); },
        get kernelPath() { return GM_getValue('kernelPath', ''); },
        set kernelPath(v) { GM_setValue('kernelPath', v); },
        get passFile() { return GM_getValue('passFile', 'passwords.json'); },
        set passFile(v) { GM_setValue('passFile', v); },
        get profileFile() { return GM_getValue('profileFile', 'blackinspect_profile.json'); },
        set profileFile(v) { GM_setValue('profileFile', v); },
        get breakOptions() { return GM_getValue(domainKey('breakOptions'), { contextmenu: true, copy: true, paste: true, selectstart: true, dragstart: true, mousedown: true }); },
        set breakOptions(v) { GM_setValue(domainKey('breakOptions'), v); }
    };

    // Translation
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
            'Sync': { en: 'Sync', fa: 'همگام‌سازی' },
            'Safe': { en: 'Safe', fa: 'امن' },
            'Settings': { en: 'Settings', fa: 'تنظیمات' },
            'BlackInspect v6.1.3': { en: 'BlackInspect v6.1.3', fa: 'BlackInspect v6.1.3' },
            'Network': { en: 'Network', fa: 'شبکه' },
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
            'Fake IP (X-Forwarded-For):': { en: 'Fake IP (X-Forwarded-For):', fa: 'IP جعلی (X-Forwarded-For):' },
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
            'Spoofing stopped (page reload needed to restore default fetch/XHR)': { en: 'Spoofing stopped (page reload needed to restore default fetch/XHR)', fa: 'جعل متوقف شد (بارگذاری مجدد صفحه برای بازگردانی پیش‌فرض fetch/XHR الزامی است)' },
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
            'Password saved.': { en: 'Password saved.', fa: 'رمز ذخیره شد.' },
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
            'html2canvas library not loaded. Try again or reload.': { en: 'html2canvas library not loaded. Try again or reload.', fa: 'کتابخانه html2canvas بارگذاری نشد. دوباره تلاش کنید یا صفحه را مجدد بارگذاری کنید.' },
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
            'Kimi': { en: 'Kimi', fa: 'Kimi' }
        };
        return (map[key] || {})[S.lang] || map[key]?.en || key;
    };
    const _ = T;

    let restrictionsBroken = false;

    function breakRestrictions(options) {
        const opts = options || S.breakOptions;
        if (opts.contextmenu) { D.oncontextmenu = null; D.body.oncontextmenu = null; W.oncontextmenu = null; }
        if (opts.selectstart || opts.copy || opts.paste) {
            const s = D.createElement('style');
            if (opts.selectstart) s.textContent += '*,*::before,*::after{user-select:auto!important;-webkit-user-select:auto!important;pointer-events:auto!important}';
            D.head.appendChild(s);
            D.querySelectorAll('div[style*="overlay"],[class*="overlay"],[style*="pointer-events:none"]').forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.width > innerWidth * 0.7 && r.height > innerHeight * 0.7) el.remove();
                else if (el.style.pointerEvents === 'none') el.style.pointerEvents = 'auto';
            });
        }
        ['copy','cut','paste','selectstart','contextmenu','dragstart','mousedown'].forEach(ev => {
            if (opts[ev]) {
                D.addEventListener(ev, e => { e.stopImmediatePropagation(); e.stopPropagation(); Object.defineProperty(e, 'preventDefault', { value: ()=>{} }); }, true);
                W.addEventListener(ev, e => { e.stopImmediatePropagation(); e.stopPropagation(); Object.defineProperty(e, 'preventDefault', { value: ()=>{} }); }, true);
            }
        });
        if (opts.copy) {
            D.addEventListener('copy', e => { e.stopImmediatePropagation(); const sel = getSelection().toString(); if (sel) { e.clipboardData.setData('text/plain', sel); e.preventDefault(); } }, true);
        }
        if (opts.paste) {
            D.addEventListener('paste', e => { e.stopImmediatePropagation(); }, true);
        }
        D.querySelectorAll('[oncopy],[oncut],[onpaste],[oncontextmenu],[onselectstart]').forEach(el => {
            el.oncopy = el.oncut = el.onpaste = el.oncontextmenu = el.onselectstart = null;
            ['oncopy','oncut','onpaste','oncontextmenu','onselectstart'].forEach(a => el.removeAttribute(a));
        });
    }

    function restoreRestrictions() { location.reload(); }

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
            btn.style.color = '#fff';
        }
    }

    if (S.breakOnStart) { breakRestrictions(S.breakOptions); restrictionsBroken = true; }

    const requestLog = [];
    function logRequest(method, url, headers) {
        const time = new Date().toLocaleTimeString();
        requestLog.push({ time, method, url, headers });
        const terminal = D.getElementById('spoofTerminal');
        if (terminal) {
            const div = D.createElement('div');
            div.textContent = `[${time}] ${method} ${url} | IP: ${headers['X-Forwarded-For'] || '-'} UA: ${(headers['User-Agent'] || '').substring(0, 50)}...`;
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    function applySpoofing(ip, ua, plat, lang) {
        const origFetch = W.fetch, origXHR = W.XMLHttpRequest;
        W.fetch = function(...args) {
            let req = args[0];
            const url = typeof req === 'string' ? req : req.url;
            if (typeof req === 'string') req = new Request(req, args[1] || {});
            else if (req instanceof Request) req = req.clone();
            const headers = new Headers(req.headers);
            if (ip) headers.set('X-Forwarded-For', ip);
            if (ua) headers.set('User-Agent', ua);
            logRequest('FETCH', url, Object.fromEntries(headers.entries()));
            return origFetch(req, { ...args[1], headers });
        };
        W.XMLHttpRequest = class extends origXHR {
            constructor() {
                super();
                const origSet = this.setRequestHeader;
                const self = this;
                this._headers = {};
                this.setRequestHeader = function(name, value) {
                    if (ip && name.toLowerCase() === 'x-forwarded-for') return;
                    if (ua && name.toLowerCase() === 'user-agent') return;
                    self._headers[name] = value;
                    origSet.call(this, name, value);
                };
                this.addEventListener('readystatechange', function() {
                    if (this.readyState === 1) {
                        if (ip) { this.setRequestHeader('X-Forwarded-For', ip); self._headers['X-Forwarded-For'] = ip; }
                        if (ua) { this.setRequestHeader('User-Agent', ua); self._headers['User-Agent'] = ua; }
                        logRequest('XHR', this._url || 'unknown', { ...self._headers });
                    }
                });
                const origOpen = this.open;
                this.open = function(method, url) { self._url = url; origOpen.apply(this, arguments); };
            }
        };
        if (ua) Object.defineProperty(N, 'userAgent', { get: () => ua, configurable: true });
        if (plat) Object.defineProperty(N, 'platform', { get: () => plat, configurable: true });
        if (lang) Object.defineProperty(N, 'language', { get: () => lang, configurable: true });
    }

    if (S.spoofActive) applySpoofing(S.ip, S.ua, S.platform, S.language);

    function applyCanvasSpoof() {
        if (!S.canvasSpoof) return;
        const origGetContext = HTMLCanvasElement.prototype.getContext;
        const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.getContext = function() {
            const ctx = origGetContext.apply(this, arguments);
            if (arguments[0] === '2d') {
                const origFillText = ctx.fillText;
                ctx.fillText = function() {
                    origFillText.apply(this, arguments);
                    const imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    for (let i = 0; i < imgData.data.length; i += 4) imgData.data[i] ^= 1;
                    ctx.putImageData(imgData, 0, 0);
                };
            }
            return ctx;
        };
        HTMLCanvasElement.prototype.toDataURL = function() {
            const ctx = this.getContext('2d');
            if (ctx) {
                const imgData = ctx.getImageData(0, 0, this.width, this.height);
                for (let i = 0; i < imgData.data.length; i += 4) imgData.data[i] ^= 1;
                ctx.putImageData(imgData, 0, 0);
            }
            return origToDataURL.apply(this, arguments);
        };
    }
    applyCanvasSpoof();

    function loadHtml2canvas() {
        return new Promise((resolve, reject) => {
            if (html2canvas) return resolve(html2canvas);
            const script = D.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = () => { html2canvas = W.html2canvas; resolve(html2canvas); };
            script.onerror = reject;
            D.head.appendChild(script);
        });
    }

    let panel = null, stopped = false, saveDirectoryHandle = null;

    function refreshPanel() { if (panel) { panel.remove(); panel = null; } createPanel(); }

    function getDefaultPanelSize() {
        const w = window.innerWidth, h = window.innerHeight;
        return (w < 600) ? { width: w - 10, height: h - 10, left: 5, top: 5 } : { width: 820, height: 500, left: 10, top: 10 };
    }

    function resetPanelPosition() {
        const def = getDefaultPanelSize();
        S.panelLeft = def.left; S.panelTop = def.top; S.panelWidth = def.width; S.panelHeight = def.height;
        if (panel) {
            panel.style.left = def.left + 'px'; panel.style.top = def.top + 'px';
            panel.style.width = def.width + 'px'; panel.style.height = def.height + 'px';
        }
    }

    D.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'z' || e.code === 'KeyZ') && panel && panel.style.display !== 'none') {
            e.preventDefault(); e.stopPropagation(); resetPanelPosition();
        }
    }, true);

    function createPanel() {
        if (panel) return;
        const isRTL = S.lang === 'fa', def = getDefaultPanelSize();
        panel = D.createElement('div'); panel.id = BS;
        panel.style.cssText = `position:fixed;top:${S.panelTop || def.top}px;left:${S.panelLeft || def.left}px;width:${S.panelWidth || def.width}px;height:${S.panelHeight || def.height}px;background:#1e1e1e;color:#d4d4d4;font-family:Consolas,monospace;font-size:13px;border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,0.7);z-index:2147483646;overflow:hidden;display:flex;flex-direction:column;border:1px solid #3e3e42;resize:both;min-width:300px;min-height:300px;max-width:calc(100vw - 10px);max-height:calc(100vh - 10px);`;
        const isoStyle = D.createElement('style');
        isoStyle.textContent = `#${BS}{direction:${isRTL?'rtl':'ltr'}!important;text-align:${isRTL?'right':'left'}!important;unicode-bidi:isolate!important;}#${BS} *{direction:inherit;text-align:inherit;}#${BS} .bi-break-hidden{display:none!important;}#${BS} .bi-break-visible{display:block!important;}@media(max-width:600px){#${BS}{font-size:12px;}#${BS} button{padding:8px 6px;font-size:11px;}}`;
        panel.appendChild(isoStyle);
        const header = D.createElement('div');
        header.style.cssText = 'background:#252526;padding:8px 12px;cursor:move;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #3e3e42;user-select:none;color:#007acc;';
        header.innerHTML = `<span style="font-weight:bold;">${_('BlackInspect v6.1.3')}</span><span id="biclose" style="cursor:pointer;color:#ccc;font-size:16px;">×</span>`;
        const tabs = D.createElement('div'); tabs.style.cssText = 'display:flex;background:#2d2d2d;border-bottom:1px solid #3e3e42;overflow-x:auto;white-space:nowrap;';
        const tabNames = ['Info','Vars','Inject','Spoof','Pass','Storage','Tools','DOM','Canvas','ModReq','Sync','Safe','Settings'];
        tabNames.forEach(name => {
            const btn = D.createElement('button'); btn.textContent = _(name);
            btn.style.cssText = 'background:transparent;color:#ccc;border:none;padding:6px 8px;cursor:pointer;font-family:Consolas;border-bottom:2px solid transparent;font-size:11px;white-space:nowrap;flex-shrink:0;';
            btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
            btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
            btn.addEventListener('click', () => showTab(name));
            tabs.appendChild(btn);
        });
        const content = D.createElement('div'); content.style.cssText = 'padding:10px;overflow-y:auto;flex:1;background:#1e1e1e;';
        panel.append(header, tabs, content); D.body.appendChild(panel);
        D.getElementById('biclose').onclick = () => { panel.style.display = 'none'; };
        let isDragging = false, startX, startY;
        header.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX - panel.offsetLeft; startY = e.clientY - panel.offsetTop; D.body.style.userSelect = 'none'; });
        D.addEventListener('mousemove', e => { if (!isDragging) return; const l = e.clientX - startX, t = e.clientY - startY; panel.style.left = l + 'px'; panel.style.top = t + 'px'; S.panelLeft = l; S.panelTop = t; });
        D.addEventListener('mouseup', () => { isDragging = false; D.body.style.userSelect = ''; S.panelWidth = panel.offsetWidth; S.panelHeight = panel.offsetHeight; });

        function showTab(tab) {
            [...tabs.children].forEach(b => b.style.borderBottom = '2px solid transparent');
            const active = [...tabs.children].find(b => b.textContent === _(tab));
            if (active) active.style.borderBottom = '2px solid #007acc';
            content.innerHTML = ''; S.activeTab = tab;

            if (tab === 'Info') {
                content.innerHTML = `<div id="infoHead" style="color:#007acc;margin-bottom:8px;"></div><div id="infoBody" style="color:#9cdcfe;"></div>`;
                const head = D.getElementById('infoHead'), body = D.getElementById('infoBody');
                head.innerHTML = `<strong>🌐 ${D.title}</strong><br><small>${location.href}</small>`;
                let html = `<div style="margin-bottom:6px;">📡 ${_('Network')}</div>`;
                html += `<div>🖥 ${_('Server')}: <span id="srv">...</span></div>`;
                html += `<div>📡 ${_('IP')}: <span id="ip">...</span></div>`;
                html += `<div>🔒 ${_('Protocol')}: ${performance.getEntriesByType('navigation')[0]?.nextHopProtocol || 'N/A'}</div>`;
                html += `<div style="margin-top:6px;">📄 ${_('Page')}</div>`;
                html += `<div>📝 ${_('Desc')}: ${D.querySelector('meta[name="description"]')?.content || '—'}</div>`;
                html += `<div>🌐 ${_('Charset')}: ${D.characterSet} | 📱 ${_('Viewport')}: ${D.querySelector('meta[name="viewport"]')?.content || '—'}</div>`;
                html += `<div>🔗 ${_('Links')}: ${D.links.length} | ${_('Img')}: ${D.images.length} | ${_('Scripts')}: ${D.scripts.length} | ${_('CSS')}: ${D.styleSheets.length} | ${_('Forms')}: ${D.forms.length}</div>`;
                html += `<div>📏 ${_('Nodes')}: ${D.querySelectorAll('*').length} | ${_('Size')}: ${(new Blob([D.documentElement.outerHTML]).size/1024).toFixed(1)} KB</div>`;
                html += `<div>⏱ ${_('Load')}: ${performance.timing.loadEventEnd - performance.timing.navigationStart}ms</div>`;
                html += `<div style="margin-top:6px;">📋 ${_('Response Headers')}</div><div id="respHeaders"></div>`;
                body.innerHTML = html;
                (async () => {
                    try {
                        const r = await fetch(location.href, { method: 'HEAD' });
                        D.getElementById('srv').textContent = r.headers.get('Server') || _('No headers');
                        let h = ''; r.headers.forEach((v,k) => h += `${k}: ${v}<br>`);
                        D.getElementById('respHeaders').innerHTML = h || _('No headers');
                    } catch(e) { D.getElementById('srv').textContent = _('Error'); }
                    try {
                        const r2 = await fetch(`https://dns.google/resolve?name=${location.hostname}&type=A`);
                        const d = await r2.json();
                        D.getElementById('ip').textContent = d.Answer?.[0]?.data || 'NotFound';
                    } catch(e) { D.getElementById('ip').textContent = _('Error'); }
                })();
            }
            else if (tab === 'Vars') {
                content.innerHTML = `<input id="varFilter" placeholder="${_('Filter...')}" style="width:100%;padding:4px;background:#3c3c3c;border:1px solid #555;color:#d4d4d4;border-radius:3px;margin-bottom:6px;">
                <button id="scanVars" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;">🔄 ${_('Scan Variables')}</button>
                <button id="exportVars" style="background:#2d2d2d;color:#ccc;border:1px solid #555;padding:4px;width:100%;margin-top:4px;border-radius:4px;">💾 ${_('Export JSON')}</button>
                <div id="varList" style="max-height:200px;overflow-y:auto;font-size:11px;background:#252526;padding:4px;border-radius:3px;color:#d4d4d4;"></div>`;
                const getBaseKeys = () => {
                    const ifr = D.createElement('iframe'); ifr.src = 'about:blank'; D.body.appendChild(ifr);
                    const keys = Object.keys(ifr.contentWindow); ifr.remove(); return keys;
                };
                let baseKeys = getBaseKeys();
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
                                else if (type === 'object' && val !== null) { disp = JSON.stringify(val); if (disp.length > 80) disp = disp.substring(0,80)+'…'; }
                                else if (type === 'string') disp = `"${val.substring(0,50)}${val.length>50?'…':''}"`;
                                else disp = String(val).substring(0,50);
                            } catch(e) { disp = _('(error)'); }
                            return `<div style="margin-bottom:2px;cursor:pointer;"><span style="color:#9cdcfe;">${key}</span> <span style="color:#6a9955;">(${type})</span> = <span style="color:#ce9178;">${disp}</span></div>`;
                        }).join('');
                    } catch(e) { lst.innerHTML = `<span style="color:red;">${_('Error')}: ${e.message}</span>`; }
                };
                D.getElementById('scanVars').onclick = scanVars;
                D.getElementById('varFilter').oninput = scanVars;
                D.getElementById('exportVars').onclick = () => {
                    const custom = Object.keys(W).filter(k => !baseKeys.includes(k)).reduce((acc,k)=>{ try{acc[k]=W[k];}catch(e){} return acc; },{});
                    const blob = new Blob([JSON.stringify(custom,null,2)],{type:'application/json'});
                    const a = D.createElement('a'); a.href=URL.createObjectURL(blob); a.download='variables.json';
                    D.body.appendChild(a); a.click(); D.body.removeChild(a); URL.revokeObjectURL(a.href);
                };
                scanVars();
            }
            else if (tab === 'Inject') {
                content.innerHTML = `<textarea id="codeInj" style="width:100%;height:120px;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:8px;resize:vertical;font-family:Consolas;border-radius:4px;"></textarea>
                <button id="runCode" style="background:#c5862c;color:#fff;border:none;padding:8px;width:100%;margin-top:6px;border-radius:4px;">▶ ${_('Run Code')}</button>
                <div id="injOut" style="margin-top:6px;color:#6a9955;font-size:11px;"></div>`;
                D.getElementById('runCode').onclick = () => {
                    const code = D.getElementById('codeInj').value, out = D.getElementById('injOut');
                    try { out.textContent = '✅ ' + _('Executed. Return value:') + ' ' + String(eval(code)); }
                    catch(e) { out.textContent = '❌ ' + _('Error') + ': ' + e.message; }
                };
            }
            else if (tab === 'Spoof') {
                const tpls = {
                    chrome_win:{ua:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',plat:'Win32',lang:'en-US'},
                    firefox_linux:{ua:'Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0',plat:'Linux x86_64',lang:'en-US'},
                    safari_mac:{ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',plat:'MacIntel',lang:'en-US'},
                    edge_win:{ua:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',plat:'Win32',lang:'en-US'},
                    iphone:{ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',plat:'iPhone',lang:'en-US'},
                    android:{ua:'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.122 Mobile Safari/537.36',plat:'Linux armv8l',lang:'en-US'}
                };
                content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div style="background:#252526;padding:10px;border-radius:4px;">
                        <h3 style="margin:0 0 10px;color:#007acc;">📡 ${_('Spoof')} ${_('Settings')}</h3>
                        <label>${_('Template:')}</label>
                        <select id="tpl" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;margin-bottom:6px;border-radius:3px;">
                            <option value="">${_('-- Custom --')}</option>
                            ${Object.entries({chrome_win:'Chrome Windows',firefox_linux:'Firefox Linux',safari_mac:'Safari macOS',edge_win:'Edge Windows',iphone:'iPhone Safari',android:'Android Chrome'}).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
                        </select>
                        <label>${_('Fake IP (X-Forwarded-For):')}</label>
                        <div style="display:flex;">
                            <input id="fakeIP" style="flex:1;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;" value="${S.ip}">
                            <span id="randIP" style="cursor:pointer;background:#4d4d4d;border:1px solid #555;padding:2px 6px;margin-left:4px;border-radius:3px;">🎲</span>
                        </div>
                        <label>${_('User-Agent:')}</label>
                        <input id="ua" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;margin-bottom:6px;border-radius:3px;" value="${S.ua}">
                        <label>${_('Platform:')}</label>
                        <input id="plat" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;margin-bottom:6px;border-radius:3px;" value="${S.platform}">
                        <label>${_('Language:')}</label>
                        <input id="lang" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;margin-bottom:6px;border-radius:3px;" value="${S.language}">
                        <div style="margin-bottom:6px;"><label><input type="checkbox" id="cfgBreak" ${S.breakOnStart?'checked':''}> ${_('Break on load')}</label></div>
                        <div style="display:flex;gap:4px;">
                            <button id="startSpoof" style="flex:1;background:#0e639c;color:#fff;border:none;padding:6px;border-radius:4px;">▶ ${_('Start Spoofing')}</button>
                            <button id="stopSpoof" style="flex:1;background:#c53030;color:#fff;border:none;padding:6px;border-radius:4px;" ${S.spoofActive?'':'disabled'}>⏹ ${_('Stop Spoofing')}</button>
                        </div>
                        <div id="spoofStatus" style="margin-top:6px;font-size:11px;color:#6a9955;">${S.spoofActive?'✅ '+_('Spoofing active (applied on load)'):''}</div>
                    </div>
                    <div style="background:#252526;padding:10px;border-radius:4px;">
                        <h3 style="margin:0 0 10px;color:#007acc;">💾 ${_('Profile')}</h3>
                        <button id="exportCfg" style="width:100%;background:#0e639c;color:#fff;border:none;padding:6px;margin-bottom:4px;border-radius:4px;">📥 ${_('Export Profile')}</button>
                        <button id="importCfg" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:6px;margin-bottom:4px;border-radius:4px;">📤 ${_('Import Profile')}</button>
                        <input type="file" id="importFile" style="display:none" accept=".json">
                        <button id="saveCfg" style="width:100%;background:#c5862c;color:#fff;border:none;padding:6px;border-radius:4px;">💾 ${_('Save Settings')}</button>
                        <div id="cfgStatus" style="margin-top:6px;font-size:11px;color:#6a9955;"></div>
                        <div style="margin-top:10px;"><label><input type="checkbox" id="canvasToggle" ${S.canvasSpoof?'checked':''}> ${_('Canvas Spoof')}</label></div>
                    </div>
                </div>
                <div style="background:#252526;padding:10px;margin-top:10px;border-radius:4px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="color:#007acc;">🖥 Request Monitor</span>
                        <button id="popupTerm" style="background:#4d4d4d;color:#fff;border:none;padding:2px 8px;font-size:11px;border-radius:4px;">📤 ${_('Open in Window')}</button>
                    </div>
                    <div id="spoofTerminal" style="height:120px;overflow-y:auto;font-size:11px;background:#1e1e1e;color:#d4d4d4;padding:4px;border-radius:4px;border:1px solid #3e3e42;"></div>
                </div>`;
                D.getElementById('tpl').onchange = function() { const t=this.value; if(t&&tpls[t]){D.getElementById('ua').value=tpls[t].ua; D.getElementById('plat').value=tpls[t].plat; D.getElementById('lang').value=tpls[t].lang;} };
                D.getElementById('randIP').onclick = ()=> D.getElementById('fakeIP').value = Array.from({length:4},()=>Math.floor(Math.random()*256)).join('.');
                const terminal = D.getElementById('spoofTerminal');
                requestLog.forEach(r=>{ const d=D.createElement('div'); d.textContent=`[${r.time}] ${r.method} ${r.url} | IP: ${r.headers['X-Forwarded-For']||'-'} UA: ${(r.headers['User-Agent']||'').substring(0,50)}...`; terminal.appendChild(d); });
                terminal.scrollTop = terminal.scrollHeight;
                D.getElementById('startSpoof').onclick = ()=>{
                    const ip = D.getElementById('fakeIP').value.trim(), ua = D.getElementById('ua').value.trim(), plat = D.getElementById('plat').value.trim(), lang = D.getElementById('lang').value.trim();
                    if(!ip&&!ua&&!plat&&!lang){ D.getElementById('spoofStatus').textContent='⚠ '+_('At least one field must be filled.'); return; }
                    S.spoofActive=true; S.ip=ip; S.ua=ua; S.platform=plat; S.language=lang;
                    applySpoofing(ip,ua,plat,lang);
                    D.getElementById('spoofStatus').textContent='✅ '+_('Spoofing started.');
                    D.getElementById('startSpoof').disabled=true; D.getElementById('stopSpoof').disabled=false;
                    terminal.appendChild(D.createElement('div')).textContent='--- Spoofing started ---'; terminal.scrollTop=terminal.scrollHeight;
                };
                D.getElementById('stopSpoof').onclick = ()=>{
                    S.spoofActive=false;
                    D.getElementById('spoofStatus').textContent='⏹ '+_('Spoofing stopped (page reload needed to restore default fetch/XHR)');
                    D.getElementById('startSpoof').disabled=false; D.getElementById('stopSpoof').disabled=true;
                    terminal.appendChild(D.createElement('div')).textContent='--- Spoofing stopped ---'; terminal.scrollTop=terminal.scrollHeight;
                };
                D.getElementById('exportCfg').onclick = ()=>{
                    const data={ip:D.getElementById('fakeIP').value,ua:D.getElementById('ua').value,platform:D.getElementById('plat').value,language:D.getElementById('lang').value,breakOnStart:D.getElementById('cfgBreak').checked};
                    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
                    if(saveDirectoryHandle) saveToDirectory(S.profileFile,blob);
                    else{ const a=D.createElement('a'); a.href=URL.createObjectURL(blob); a.download=S.profileFile; D.body.appendChild(a); a.click(); D.body.removeChild(a); URL.revokeObjectURL(a.href); }
                    D.getElementById('cfgStatus').textContent='✅ '+_('Profile downloaded.');
                };
                D.getElementById('importCfg').onclick = ()=>D.getElementById('importFile').click();
                D.getElementById('importFile').onchange=function(e){
                    const file=e.target.files[0]; if(!file)return;
                    const reader=new FileReader();
                    reader.onload=ev=>{
                        try{
                            const data=JSON.parse(ev.target.result);
                            D.getElementById('fakeIP').value=data.ip||''; D.getElementById('ua').value=data.ua||''; D.getElementById('plat').value=data.platform||''; D.getElementById('lang').value=data.language||'';
                            D.getElementById('cfgBreak').checked=!!data.breakOnStart;
                            D.getElementById('cfgStatus').textContent='✅ '+_('Profile loaded.');
                        }catch(ex){D.getElementById('cfgStatus').textContent='❌ '+_('Invalid file.')+' '+ex.message;}
                    };
                    reader.readAsText(file);
                };
                D.getElementById('saveCfg').onclick = ()=>{
                    S.ip=D.getElementById('fakeIP').value; S.ua=D.getElementById('ua').value; S.platform=D.getElementById('plat').value; S.language=D.getElementById('lang').value; S.breakOnStart=D.getElementById('cfgBreak').checked;
                    D.getElementById('cfgStatus').textContent='✅ '+_('Settings saved.');
                };
                D.getElementById('canvasToggle').onchange=function(){S.canvasSpoof=this.checked; applyCanvasSpoof();};
                D.getElementById('popupTerm').onclick=()=>{
                    const w=window.open('','BlackInspectTerm','width=600,height=400');
                    w.document.write(`<html><head><title>Request Log</title><style>body{background:#1e1e1e;color:#d4d4d4;font-family:Consolas;padding:10px;}</style></head><body>${terminal.innerHTML}</body></html>`);
                };
                if(S.spoofActive){ D.getElementById('startSpoof').disabled=true; D.getElementById('stopSpoof').disabled=false; }
            }
            else if (tab === 'Pass') {
                content.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div style="background:#252526;padding:10px;border-radius:4px;">
                        <h3 style="margin:0 0 10px;color:#007acc;">🔐 ${_('Password Generator')}</h3>
                        <label>${_('Length:')} <span id="lenVal">12</span></label>
                        <input type="range" id="passLen" min="8" max="16" value="12" style="width:100%;accent-color:#007acc;" oninput="document.getElementById('lenVal').textContent=this.value">
                        <div><label><input type="checkbox" id="incNum" checked> ${_('Numbers')}</label></div>
                        <div><label><input type="checkbox" id="incUpper" checked> ${_('Uppercase')}</label></div>
                        <div><label><input type="checkbox" id="incLower" checked> ${_('Lowercase')}</label></div>
                        <div><label><input type="checkbox" id="incSpec"> ${_('Special')}</label></div>
                        <button id="genPass" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:6px;margin-top:6px;border-radius:4px;">${_('Generate')}</button>
                        <div style="margin-top:6px;font-size:11px;">${_('Generated:')} <span id="genOut" style="word-break:break-all;"></span></div>
                        <div style="margin-top:6px;"><label><input type="checkbox" id="autoUser"> ${_('Auto-fill username/email')}</label></div>
                        <button id="usePassBtn" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:6px;margin-top:6px;border-radius:4px;">🖊 ${_('Use Password')}</button>
                        <div id="passMsg" style="margin-top:6px;font-size:11px;color:#6a9955;"></div>
                        <hr style="border-color:#3e3e42;margin:10px 0;">
                        <h3 style="color:#007acc;">👤 ${_('Fake Data')}</h3>
                        <button id="fillName" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:6px;margin-bottom:4px;border-radius:4px;">👤 ${_('Fill Name')}</button>
                        <button id="fillEmail" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:6px;margin-bottom:4px;border-radius:4px;">📧 ${_('Fill Email')}</button>
                        <button id="fillPhone" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:6px;margin-bottom:4px;border-radius:4px;">📞 ${_('Fill Phone')}</button>
                        <button id="fillAll" style="width:100%;background:#0e639c;color:#fff;border:none;padding:6px;border-radius:4px;">⚡ ${_('Fill All')}</button>
                        <div id="fakeOut" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>
                    </div>
                    <div style="background:#252526;padding:10px;border-radius:4px;">
                        <h3 style="margin:0 0 10px;color:#007acc;">💾 ${_('Saved Passwords')}</h3>
                        <input id="saveUser" placeholder="${_('Username')}" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;margin-bottom:4px;border-radius:3px;">
                        <button id="saveEntry" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:4px;border-radius:4px;">${_('Save Current Password')}</button>
                        <div id="savedList" style="max-height:150px;overflow-y:auto;margin-top:8px;font-size:11px;"></div>
                        <div style="display:flex;gap:4px;margin-top:8px;">
                            <button id="exportPass" style="flex:1;background:#4d4d4d;color:#fff;border:none;padding:4px;border-radius:4px;">📤 ${_('Export')}</button>
                            <button id="importPass" style="flex:1;background:#4d4d4d;color:#fff;border:none;padding:4px;border-radius:4px;">📥 ${_('Import')}</button>
                        </div>
                        <input type="file" id="importPassFile" style="display:none" accept=".json">
                        <div style="margin-top:8px;">
                            <label style="font-size:11px;">${_('Default save path:')}</label>
                            <input id="savePath" value="${S.passFile}" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;font-size:11px;" readonly>
                            <button id="openDownloads" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:4px;margin-top:4px;border-radius:4px;font-size:11px;">📂 ${_('Show Downloads')}</button>
                        </div>
                    </div>
                </div>`;
                const charSets = { num:'0123456789', upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower:'abcdefghijklmnopqrstuvwxyz', spec:'!@#$%^&*()_+-=[]{}|;:,.<>?' };
                const generatePassword = () => {
                    let chars = '';
                    if(D.getElementById('incNum').checked) chars += charSets.num;
                    if(D.getElementById('incUpper').checked) chars += charSets.upper;
                    if(D.getElementById('incLower').checked) chars += charSets.lower;
                    if(D.getElementById('incSpec').checked) chars += charSets.spec;
                    if(!chars) return '';
                    const len = parseInt(D.getElementById('passLen').value);
                    return Array.from({length:len},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
                };
                D.getElementById('genPass').onclick = ()=> D.getElementById('genOut').textContent = generatePassword();
                const fnames = ['Ali','Reza','Sara','Maryam','Mohammad','Fatemeh','Hossein','Zahra','Mehdi','Narges','Amir','Parisa','Babak','Ladan','Kaveh','Shirin','Arash','Mina','Behnam','Roya'];
                const emails = ['test@example.com','user@mail.com','info@site.org','sample@domain.com','hello@world.net'];
                const phones = ['09123456789','09351234567','09187654321','09214567890','09369876543'];
                const getRand = arr => arr[Math.floor(Math.random()*arr.length)];
                const fillByAttr = (attr, value) => {
                    let count = 0;
                    D.querySelectorAll('input:not([type="hidden"])').forEach(inp => {
                        const name = (inp.name||'').toLowerCase(), id = (inp.id||'').toLowerCase(), placeholder = (inp.placeholder||'').toLowerCase();
                        if(name.includes(attr) || id.includes(attr) || placeholder.includes(attr)){
                            inp.value = value; inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new Event('change',{bubbles:true})); count++;
                        }
                    });
                    return count;
                };
                D.getElementById('fillName').onclick = ()=>{ const c = fillByAttr('name',getRand(fnames))+fillByAttr('first',getRand(fnames))+fillByAttr('last',getRand(fnames)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('fillEmail').onclick = ()=>{ const c = fillByAttr('email',getRand(emails))+fillByAttr('mail',getRand(emails)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('fillPhone').onclick = ()=>{ const c = fillByAttr('phone',getRand(phones))+fillByAttr('mobile',getRand(phones))+fillByAttr('tel',getRand(phones)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('fillAll').onclick = ()=>{ const c = fillByAttr('name',getRand(fnames))+fillByAttr('email',getRand(emails))+fillByAttr('phone',getRand(phones)); D.getElementById('fakeOut').textContent=`✅ ${c} ${_('fields filled.')}`; };
                D.getElementById('usePassBtn').onclick = ()=>{
                    const pass = D.getElementById('genOut').textContent;
                    if(!pass){ D.getElementById('passMsg').textContent = _('No password generated.'); return; }
                    D.querySelectorAll('input[type="password"]').forEach(inp=>{ inp.value=pass; inp.dispatchEvent(new Event('input',{bubbles:true})); });
                    if(D.getElementById('autoUser').checked){
                        const user = D.getElementById('saveUser').value.trim() || getRand(fnames).toLowerCase();
                        fillByAttr('user',user); fillByAttr('name',user); fillByAttr('email',user+'@example.com');
                        D.getElementById('passMsg').textContent = '✅ ' + _('Password and username filled.');
                    } else D.getElementById('passMsg').textContent = '✅ ' + _('Password filled.');
                };
                const updateList = ()=>{
                    const lst = D.getElementById('savedList');
                    lst.innerHTML = S.passwords.map((e,i)=>`<div style="border-bottom:1px solid #3e3e42;padding:2px 0;"><b>${e.domain}</b> ${e.username} <span style="cursor:pointer;" onclick="this.textContent='${e.password}'">****</span> <button data-idx="${i}" class="delEntry" style="color:#f00;background:transparent;border:none;cursor:pointer;">✕</button></div>`).join('');
                    document.querySelectorAll('.delEntry').forEach(btn=>btn.onclick=function(){ const arr=S.passwords; arr.splice(this.dataset.idx,1); S.passwords=arr; updateList(); });
                };
                D.getElementById('saveEntry').onclick = ()=>{
                    const user = D.getElementById('saveUser').value.trim(), pass = D.getElementById('genOut').textContent;
                    if(!user||!pass) return;
                    const arr=S.passwords; arr.push({domain:location.hostname, username:user, password:pass}); S.passwords=arr;
                    updateList();
                    D.getElementById('passMsg').textContent = '✅ ' + _('Password saved.');
                    if(saveDirectoryHandle) {
                        const blob=new Blob([JSON.stringify(S.passwords,null,2)],{type:'application/json'});
                        saveToDirectory(S.passFile,blob);
                    }
                };
                D.getElementById('exportPass').onclick = ()=>{
                    const blob=new Blob([JSON.stringify(S.passwords,null,2)],{type:'application/json'});
                    if(saveDirectoryHandle) saveToDirectory(S.passFile,blob);
                    else{ const a=D.createElement('a'); a.href=URL.createObjectURL(blob); a.download=S.passFile; D.body.appendChild(a); a.click(); D.body.removeChild(a); URL.revokeObjectURL(a.href); }
                };
                D.getElementById('importPass').onclick = ()=>D.getElementById('importPassFile').click();
                D.getElementById('importPassFile').onchange=function(e){
                    const file=e.target.files[0]; if(!file)return;
                    const reader=new FileReader();
                    reader.onload=ev=>{ try{ S.passwords=JSON.parse(ev.target.result); updateList(); }catch(ex){} };
                    reader.readAsText(file);
                };
                D.getElementById('openDownloads').onclick = ()=> window.open('chrome://downloads','_blank');
                updateList();
                D.getElementById('genOut').textContent = generatePassword();
            }
            else if (tab === 'Storage') {
                content.innerHTML = `<div style="color:#007acc;margin-bottom:8px;">💾 ${_('Cookie & LocalStorage')}</div>
                <button id="viewCookies" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;margin-bottom:4px;border-radius:4px;">🍪 ${_('View Cookies')}</button>
                <button id="viewLS" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;margin-bottom:8px;border-radius:4px;">📦 ${_('View LocalStorage')}</button>
                <div id="storView" style="font-size:11px;color:#6a9955;max-height:100px;overflow-y:auto;background:#252526;padding:4px;border-radius:4px;margin-bottom:8px;"></div>
                <label>${_('Name:')}</label><input id="storName" placeholder="myKey" style="width:100%;padding:4px;background:#3c3c3c;border:1px solid #555;color:#d4d4d4;border-radius:3px;margin-bottom:4px;">
                <label>${_('Value:')}</label><input id="storVal" placeholder="value" style="width:100%;padding:4px;background:#3c3c3c;border:1px solid #555;color:#d4d4d4;border-radius:3px;margin-bottom:8px;">
                <button id="setCookie" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;margin-bottom:4px;border-radius:4px;">🍪 ${_('Set Cookie')}</button>
                <button id="setLS" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;margin-bottom:4px;border-radius:4px;">📦 ${_('Set LocalStorage')}</button>
                <div id="storOut" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                D.getElementById('viewCookies').onclick = ()=>{ D.getElementById('storView').innerHTML = D.cookie.split(';').map(c=>c.trim()).join('<br>') || _('No cookies'); };
                D.getElementById('viewLS').onclick = ()=>{ let h=''; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); h+=`${k} = ${localStorage.getItem(k)}<br>`; } D.getElementById('storView').innerHTML = h || _('No localStorage'); };
                D.getElementById('setCookie').onclick = ()=>{ const n=D.getElementById('storName').value.trim(), v=D.getElementById('storVal').value; if(!n)return; D.cookie=`${n}=${encodeURIComponent(v)};path=/;SameSite=Lax`; D.getElementById('storOut').textContent=`✅ ${_('Cookie set:')} ${n}=${v}`; };
                D.getElementById('setLS').onclick = ()=>{ const n=D.getElementById('storName').value.trim(), v=D.getElementById('storVal').value; if(!n)return; try{ localStorage.setItem(n,v); D.getElementById('storOut').textContent=`✅ ${_('LocalStorage set:')} ${n}=${v}`; }catch(e){ D.getElementById('storOut').textContent='❌ '+_('Error')+': '+e.message; } };
            }
            else if (tab === 'Tools') {
                content.innerHTML = `
                <button id="breakBtn" style="background:#c53030;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">🔓 ${_('Break Restrictions')}</button>
                <div id="breakOptions" class="bi-break-hidden" style="background:#252526;padding:10px;border-radius:4px;margin-bottom:6px;">
                    <div><label><input type="checkbox" id="brkContext" checked> Contextmenu</label></div>
                    <div><label><input type="checkbox" id="brkCopy" checked> Copy</label></div>
                    <div><label><input type="checkbox" id="brkPaste" checked> Paste</label></div>
                    <div><label><input type="checkbox" id="brkSelect" checked> Selectstart</label></div>
                    <div><label><input type="checkbox" id="brkDrag" checked> Dragstart</label></div>
                    <div><label><input type="checkbox" id="brkMouse" checked> Mousedown</label></div>
                    <button id="doBreak" style="background:#c53030;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;margin-top:6px;">${_('Break Selected')}</button>
                </div>
                <button id="bdown" style="background:#0e639c;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">📦 ${_('Download Full Page')}</button>
                <button id="copyAllText" style="background:#c5862c;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">📋 ${_('Copy All Text')}</button>
                <button id="stopLoadBtn" style="background:#c53030;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">⏹ ${_('Stop Loading')}</button>
                <div style="margin:6px 0;">
                    <label>${_('XSS Payload:')}</label>
                    <select id="xssPayload" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;">
                        <option value="&lt;script&gt;alert(1)&lt;/script&gt;">&lt;script&gt;alert(1)&lt;/script&gt;</option>
                        <option value="&lt;img src=x onerror=alert(1)&gt;">&lt;img src=x onerror=alert(1)&gt;</option>
                        <option value="&lt;svg/onload=alert(1)&gt;">&lt;svg/onload=alert(1)&gt;</option>
                        <option value="&lt;body onload=alert(1)&gt;">&lt;body onload=alert(1)&gt;</option>
                        <option value="'-alert(1)-'">'-alert(1)-'</option>
                        <option value="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;">&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;</option>
                    </select>
                    <button id="injectXSS" style="width:100%;background:#4d4d4d;color:#fff;border:none;padding:6px;margin-top:4px;border-radius:4px;">💉 ${_('Inject XSS')}</button>
                </div>
                <button id="showPasswordsBtn" style="background:#4d4d4d;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">🔎 ${_('Show All Passwords')}</button>
                <button id="screenshotBtn" style="background:#4d4d4d;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">📸 ${_('Full Page Screenshot')}</button>
                <button id="refreshBtn" style="background:#4d4d4d;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">🔄 ${_('Refresh Page')}</button>
                <button id="resetPosBtn" style="background:#4d4d4d;color:#fff;border:none;padding:8px;width:100%;margin-bottom:6px;border-radius:4px;">🔃 ${_('Reset Panel Position (Ctrl+Z)')}</button>
                <hr style="border-color:#3e3e42;">
                <div style="margin:6px 0;">
                    <label>${_('Split View with AI')}</label>
                    <select id="aiService" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;">
                        <option value="">${_('Select AI Service')}</option>
                        <option value="chatgpt">${_('ChatGPT')}</option>
                        <option value="deepseek">${_('DeepSeek')}</option>
                        <option value="gemini">${_('Gemini')}</option>
                        <option value="claude">${_('Claude')}</option>
                        <option value="kimi">${_('Kimi')}</option>
                    </select>
                    <button id="openSplitBtn" style="width:100%;background:#0e639c;color:#fff;border:none;padding:6px;margin-top:4px;border-radius:4px;">🖥 ${_('Open Split')}</button>
                </div>
                <div id="toolsOut" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                const breakBtn = D.getElementById('breakBtn'), breakOptionsDiv = D.getElementById('breakOptions');
                breakBtn.onclick = ()=>{
                    if(restrictionsBroken) restoreRestrictions();
                    else{
                        if(breakOptionsDiv.classList.contains('bi-break-hidden')){
                            breakOptionsDiv.classList.remove('bi-break-hidden'); breakOptionsDiv.classList.add('bi-break-visible');
                        }else{
                            const opts={contextmenu:D.getElementById('brkContext').checked,copy:D.getElementById('brkCopy').checked,paste:D.getElementById('brkPaste').checked,selectstart:D.getElementById('brkSelect').checked,dragstart:D.getElementById('brkDrag').checked,mousedown:D.getElementById('brkMouse').checked};
                            S.breakOptions=opts; breakRestrictions(opts); restrictionsBroken=true; updateBreakButton();
                            D.getElementById('toolsOut').textContent='✅ '+_('Restrictions broken.');
                            breakOptionsDiv.classList.remove('bi-break-visible'); breakOptionsDiv.classList.add('bi-break-hidden');
                        }
                    }
                };
                D.getElementById('doBreak').onclick = ()=>{
                    const opts={contextmenu:D.getElementById('brkContext').checked,copy:D.getElementById('brkCopy').checked,paste:D.getElementById('brkPaste').checked,selectstart:D.getElementById('brkSelect').checked,dragstart:D.getElementById('brkDrag').checked,mousedown:D.getElementById('brkMouse').checked};
                    S.breakOptions=opts; breakRestrictions(opts); restrictionsBroken=true; updateBreakButton();
                    D.getElementById('toolsOut').textContent='✅ '+_('Restrictions broken.');
                    breakOptionsDiv.classList.remove('bi-break-visible'); breakOptionsDiv.classList.add('bi-break-hidden');
                };
                D.getElementById('bdown').onclick = async ()=>{
                    const st=D.getElementById('toolsOut'); st.textContent='⏳ '+_('Collecting page...');
                    try{
                        const cl=D.documentElement.cloneNode(true);
                        cl.querySelectorAll('link[rel="stylesheet"]').forEach(async l=>{ if(l.href&&new URL(l.href).origin===location.origin){ try{ const r=await fetch(l.href); const s=D.createElement('style'); s.textContent=await r.text(); l.replaceWith(s); }catch(e){} } });
                        cl.querySelectorAll('script[src]').forEach(async s=>{ if(s.src&&new URL(s.src).origin===location.origin){ try{ const r=await fetch(s.src); s.removeAttribute('src'); s.textContent=await r.text(); }catch(e){} } });
                        const final='<!DOCTYPE html>\n'+cl.outerHTML;
                        const blob=new Blob([final],{type:'text/html'});
                        const a=D.createElement('a'); a.href=URL.createObjectURL(blob); a.download=D.title.replace(/[^a-z0-9]/gi,'_')+'_fullpage.html'; D.body.appendChild(a); a.click(); D.body.removeChild(a); URL.revokeObjectURL(a.href);
                        st.textContent='✅ '+_('Downloaded!');
                    }catch(e){ st.textContent='❌ '+_('Error')+': '+e.message; }
                };
                D.getElementById('copyAllText').onclick = ()=>{
                    breakRestrictions();
                    const walker=D.createTreeWalker(D.body,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentNode.closest('#'+BS)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
                    let text=''; while(walker.nextNode()) text+=walker.currentNode.nodeValue;
                    const fallbackCopy=t=>{ const ta=D.createElement('textarea'); ta.value=t; ta.style.cssText='position:fixed;left:-9999px;'; D.body.appendChild(ta); ta.select(); D.execCommand('copy'); D.body.removeChild(ta); };
                    if(N.clipboard&&N.clipboard.writeText){ N.clipboard.writeText(text).then(()=>{ D.getElementById('toolsOut').textContent=`✅ ${_('Copied (')}${text.length}${_(' characters)')}`; }).catch(()=>fallbackCopy(text)); }
                    else fallbackCopy(text);
                };
                const stopBtn = D.getElementById('stopLoadBtn');
                const updateStopBtn = ()=>{
                    if(stopped){ stopBtn.textContent='▶ '+_('Resume Loading'); stopBtn.style.background='#0f0'; }
                    else{ stopBtn.textContent='⏹ '+_('Stop Loading'); stopBtn.style.background='#c53030'; }
                    stopBtn.style.color='#fff';
                };
                updateStopBtn();
                stopBtn.onclick = ()=>{ if(!stopped){ W.stop(); stopped=true; }else{ location.reload(); } updateStopBtn(); };
                D.getElementById('injectXSS').onclick = ()=>{
                    const payload=D.getElementById('xssPayload').value;
                    const inputs=D.querySelectorAll('input[type="text"], input:not([type]), textarea');
                    inputs.forEach(inp=>{ inp.value=payload; inp.dispatchEvent(new Event('input',{bubbles:true})); });
                    D.getElementById('toolsOut').textContent=`✅ ${_('XSS payload injected into ')}${inputs.length}${_(' fields.')}`;
                };
                D.getElementById('showPasswordsBtn').onclick = ()=>{
                    const inputs=D.querySelectorAll('input[type="password"]');
                    inputs.forEach(inp=>inp.type='text');
                    D.getElementById('toolsOut').textContent=`✅ ${inputs.length} ${_('password fields revealed.')}`;
                };
                D.getElementById('screenshotBtn').onclick = async ()=>{
                    const st=D.getElementById('toolsOut'); st.textContent='📸 '+_('Capturing screenshot...');
                    try{
                        await loadHtml2canvas(); if(!html2canvas) throw new Error(_('html2canvas library not loaded. Try again or reload.'));
                        const canvas=await html2canvas(D.body,{scrollY:-window.scrollY,height:document.body.scrollHeight,windowHeight:document.body.scrollHeight});
                        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
                        const url=URL.createObjectURL(blob); const a=D.createElement('a'); a.href=url; a.download='screenshot.png'; D.body.appendChild(a); a.click(); D.body.removeChild(a); URL.revokeObjectURL(url);
                        st.textContent='✅ '+_('Screenshot saved.');
                    }catch(e){ st.textContent='❌ '+_('Error')+': '+e.message; }
                };
                D.getElementById('refreshBtn').onclick = ()=> location.reload();
                D.getElementById('resetPosBtn').onclick = resetPanelPosition;
                const aiUrls={chatgpt:'https://chat.openai.com',deepseek:'https://chat.deepseek.com',gemini:'https://gemini.google.com',claude:'https://claude.ai',kimi:'https://kimi.moonshot.cn'};
                D.getElementById('openSplitBtn').onclick = ()=>{
                    const service=D.getElementById('aiService').value; if(!service)return;
                    const url=aiUrls[service];
                    const width=window.innerWidth/2,height=window.innerHeight,left=window.screenX+window.innerWidth-width,top=window.screenY;
                    const popup=window.open(url,'_blank',`width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);
                    if(!popup) D.getElementById('toolsOut').textContent='❌ Popup blocked.';
                    else{ window.resizeTo(width,height); window.moveTo(window.screenX,window.screenY); D.getElementById('toolsOut').textContent='✅ Split view opened.'; }
                };
                updateBreakButton();
            }
            else if (tab === 'DOM') {
                content.innerHTML = `<div style="color:#007acc;margin-bottom:8px;">🔍 ${_('DOM Monitor')}</div>
                <button id="startDOM" style="background:#0e639c;color:#fff;border:none;padding:6px;width:100%;margin-bottom:6px;border-radius:4px;">▶ ${_('Start')}</button>
                <button id="stopDOM" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;margin-bottom:6px;border-radius:4px;">⏹ ${_('Stop')}</button>
                <div id="domLog" style="max-height:150px;overflow-y:auto;font-size:11px;background:#252526;padding:4px;border-radius:4px;color:#6a9955;"></div>`;
                let observer;
                const logDOM = mutations => {
                    let msg = '';
                    mutations.forEach(m => {
                        if(m.type==='childList') msg += `Nodes: +${m.addedNodes.length} -${m.removedNodes.length}; `;
                        else if(m.type==='attributes') msg += `Attr ${m.attributeName} on ${m.target.tagName}; `;
                    });
                    const div=D.createElement('div'); div.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
                    D.getElementById('domLog').appendChild(div); D.getElementById('domLog').scrollTop=D.getElementById('domLog').scrollHeight;
                };
                D.getElementById('startDOM').onclick = ()=>{ if(observer)return; observer=new MutationObserver(logDOM); observer.observe(D.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']}); };
                D.getElementById('stopDOM').onclick = ()=>{ if(observer){ observer.disconnect(); observer=null; } };
            }
            else if (tab === 'Canvas') {
                content.innerHTML = `<div style="color:#007acc;margin-bottom:8px;">🎨 ${_('Canvas Fingerprint Spoof')}</div>
                <button id="toggleCanvas" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;margin-bottom:4px;border-radius:4px;">${_('Toggle Spoofing')}</button>
                <div id="canvasStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                D.getElementById('canvasStatus').textContent = S.canvasSpoof ? '✅ '+_('Active') : '⏹ '+_('Inactive');
                D.getElementById('toggleCanvas').onclick = ()=>{ S.canvasSpoof=!S.canvasSpoof; D.getElementById('canvasStatus').textContent = S.canvasSpoof ? '✅ '+_('Active') : '⏹ '+_('Inactive'); applyCanvasSpoof(); };
            }
            else if (tab === 'ModReq') {
                content.innerHTML = `<div style="color:#007acc;margin-bottom:8px;">✏️ ${_('HTTP Request Modifier')}</div>
                <label>${_('URL pattern (regex):')}</label><input id="modUrl" placeholder=".*" style="width:100%;padding:4px;background:#3c3c3c;border:1px solid #555;color:#d4d4d4;border-radius:3px;margin-bottom:6px;">
                <label>${_('Header Name:')}</label><input id="modHName" placeholder="X-Custom-Header" style="width:100%;padding:4px;background:#3c3c3c;border:1px solid #555;color:#d4d4d4;border-radius:3px;margin-bottom:6px;">
                <label>${_('Header Value:')}</label><input id="modHVal" placeholder="value" style="width:100%;padding:4px;background:#3c3c3c;border:1px solid #555;color:#d4d4d4;border-radius:3px;margin-bottom:6px;">
                <button id="applyMod" style="background:#0e639c;color:#fff;border:none;padding:6px;width:100%;margin-bottom:4px;border-radius:4px;">🔧 ${_('Apply Modifier')}</button>
                <button id="resetMod" style="background:#c53030;color:#fff;border:none;padding:6px;width:100%;margin-bottom:4px;border-radius:4px;">🔄 ${_('Reset')}</button>
                <div id="modStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                let modActive=false, origFetchMod=W.fetch;
                D.getElementById('applyMod').onclick = ()=>{
                    if(modActive)return;
                    const pattern=D.getElementById('modUrl').value.trim(),hName=D.getElementById('modHName').value.trim(),hVal=D.getElementById('modHVal').value.trim();
                    if(!hName){ D.getElementById('modStatus').textContent='⚠ '+_('Header name required.'); return; }
                    let regex; try{ regex=new RegExp(pattern); }catch(e){ D.getElementById('modStatus').textContent='❌ '+_('Invalid regex.'); return; }
                    modActive=true;
                    W.fetch=function(...args){
                        let req=args[0]; const url=typeof req==='string'?req:req.url;
                        if(regex.test(url)){
                            const headers=new Headers(req.headers||{}); headers.set(hName,hVal);
                            return origFetchMod(typeof req==='string'?new Request(req,{...args[1],headers}):new Request(req,{...args[1],headers}));
                        }
                        return origFetchMod.apply(this,arguments);
                    };
                    D.getElementById('modStatus').textContent='✅ '+_('Header modifier applied to fetch.');
                };
                D.getElementById('resetMod').onclick = ()=>{ if(modActive){ W.fetch=origFetchMod; modActive=false; D.getElementById('modStatus').textContent='🔄 '+_('Reset to default.'); } };
            }
            else if (tab === 'Sync') {
                content.innerHTML = `<div style="color:#007acc;margin-bottom:8px;">☁️ ${_('Load Profile from URL')}</div>
                <input id="syncUrl" placeholder="https://example.com/profile.json" style="width:100%;padding:4px;background:#3c3c3c;border:1px solid #555;color:#d4d4d4;border-radius:3px;margin-bottom:6px;">
                <button id="syncLoad" style="background:#0e639c;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;">⬇ ${_('Load & Apply')}</button>
                <div id="syncStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                D.getElementById('syncLoad').onclick = async ()=>{
                    const url=D.getElementById('syncUrl').value.trim(); if(!url){ D.getElementById('syncStatus').textContent='⚠ '+_('URL required.'); return; }
                    try{
                        const resp=await fetch(url); if(!resp.ok) throw new Error('HTTP '+resp.status);
                        const data=await resp.json();
                        S.ip=data.ip||''; S.ua=data.ua||''; S.platform=data.platform||''; S.language=data.language||''; S.breakOnStart=!!data.breakOnStart;
                        D.getElementById('syncStatus').textContent='✅ '+_('Profile loaded from URL.');
                        if(S.breakOnStart){ breakRestrictions(); restrictionsBroken=true; updateBreakButton(); }
                    }catch(e){ D.getElementById('syncStatus').textContent='❌ '+_('Error')+': '+e.message; }
                };
            }
            else if (tab === 'Safe') {
                content.innerHTML = `<div style="color:#007acc;margin-bottom:8px;">🛡 ${_('Safe Mode')}</div><div style="background:#252526;padding:12px;border-radius:4px;color:#888;">${_('Safe Mode features are not yet implemented.')}</div>`;
            }
            else if (tab === 'Settings') {
                content.innerHTML = `
                <h3 style="color:#007acc;">${_('Settings')}</h3>
                <label>${_('Language / زبان')}</label>
                <select id="langSelect" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;margin-bottom:10px;">
                    <option value="en" ${S.lang==='en'?'selected':''}>English</option>
                    <option value="fa" ${S.lang==='fa'?'selected':''}>فارسی</option>
                </select>
                <button id="applyLang" style="background:#0e639c;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;margin-bottom:10px;">${_('Apply')}</button>
                <label>${_('Python Kernel Path')}</label>
                <div style="display:flex;gap:4px;margin-bottom:10px;">
                    <input id="kernelPath" value="${S.kernelPath}" placeholder="e.g. /usr/bin/python3" style="flex:1;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;">
                    <input type="file" id="kernelFileInput" style="display:none" accept=".py,application/x-python-code">
                    <button id="browseKernel" style="background:#4d4d4d;color:#fff;border:none;padding:6px;border-radius:4px;">${_('Choose main.py')}</button>
                </div>
                <button id="saveKernel" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;margin-bottom:10px;">${_('Save Kernel Path')}</button>
                <label>${_('Default Password Filename')}</label>
                <input id="passFile" value="${S.passFile}" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;margin-bottom:10px;">
                <button id="savePassFile" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;margin-bottom:10px;">${_('Save')}</button>
                <label>${_('Default Profile Filename')}</label>
                <input id="profileFile" value="${S.profileFile}" style="width:100%;background:#3c3c3c;color:#d4d4d4;border:1px solid #555;padding:4px;border-radius:3px;margin-bottom:10px;">
                <button id="saveProfileFile" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;margin-bottom:10px;">${_('Save')}</button>
                <button id="pickSaveFolder" style="background:#4d4d4d;color:#fff;border:none;padding:6px;width:100%;border-radius:4px;margin-bottom:10px;">📁 ${_('Pick save folder')}</button>
                <div id="folderStatus" style="font-size:11px;color:#6a9955;margin-top:4px;"></div>`;
                D.getElementById('applyLang').onclick = ()=>{ S.lang = D.getElementById('langSelect').value; refreshPanel(); };
                D.getElementById('saveKernel').onclick = ()=> S.kernelPath = D.getElementById('kernelPath').value;
                D.getElementById('savePassFile').onclick = ()=> S.passFile = D.getElementById('passFile').value;
                D.getElementById('saveProfileFile').onclick = ()=> S.profileFile = D.getElementById('profileFile').value;
                D.getElementById('browseKernel').onclick = ()=> D.getElementById('kernelFileInput').click();
                D.getElementById('kernelFileInput').onchange = function(e){ if(e.target.files[0]) D.getElementById('kernelPath').value = e.target.files[0].name; };
                D.getElementById('pickSaveFolder').onclick = async ()=>{
                    if(!window.showDirectoryPicker){ alert('Directory picker not supported.'); return; }
                    try{ saveDirectoryHandle = await window.showDirectoryPicker(); D.getElementById('folderStatus').textContent = '✅ ' + _('Folder selected. Files will be saved there.'); }
                    catch(e){ D.getElementById('folderStatus').textContent = '❌ ' + e.message; }
                };
            }
        }

        showTab(S.activeTab);
        updateBreakButton();
    }

    async function saveToDirectory(filename, blob) {
        if(!saveDirectoryHandle) return;
        try{
            const fileHandle = await saveDirectoryHandle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
        } catch(e) {
            console.error('Save to directory failed', e);
            const a = D.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
            D.body.appendChild(a); a.click(); D.body.removeChild(a); URL.revokeObjectURL(a.href);
        }
    }

    const launcher = D.createElement('div');
    launcher.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:2147483647;background:#007acc;color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:Consolas;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.5);direction:ltr;';
    launcher.textContent = '⚙';
    launcher.addEventListener('click', ()=>{ if(!panel) createPanel(); else panel.style.display = panel.style.display === 'none' ? 'flex' : 'none'; });
    D.body.appendChild(launcher);
})();