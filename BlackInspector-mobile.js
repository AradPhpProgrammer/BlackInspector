// ==UserScript==
// @name         BlackInspector Lite (موبایل)
// @namespace    http://tampermonkey.net/
// @version      7.0-lite
// @description  نسخه سبک BlackInspector مخصوص موبایل - شکستن محدودیت‌ها و تب اسپوف
// @author       AradPhpProgrammer
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    const DEFAULT_SETTINGS = {
        enableCopy: false,
        enableRightClick: false,
        enableSelect: false,
        enableDrag: false,
        enableDevTools: false,
        enableTabSpoof: true,
        enableConsole: false
    };

    let settings = {};
    try {
        settings = JSON.parse(GM_getValue('bi_lite_settings', '{}'));
        for (let key in DEFAULT_SETTINGS) {
            if (settings[key] === undefined) settings[key] = DEFAULT_SETTINGS[key];
        }
    } catch(e) {
        settings = {...DEFAULT_SETTINGS};
    }

    function saveSettings() {
        GM_setValue('bi_lite_settings', JSON.stringify(settings));
    }

    function breakCopyRestriction(enable) {
        if (enable) {
            document.addEventListener('copy', e => e.stopPropagation(), true);
            document.addEventListener('beforecopy', e => e.stopPropagation(), true);
            GM_addStyle(`* { -webkit-user-select: text !important; user-select: text !important; }`);
        }
    }

    function breakRightClickRestriction(enable) {
        if (enable) {
            document.addEventListener('contextmenu', e => e.stopPropagation(), true);
        }
    }

    function breakSelectRestriction(enable) {
        if (enable) {
            GM_addStyle(`* { -webkit-user-select: auto !important; user-select: auto !important; -webkit-touch-callout: default !important; }`);
        }
    }
    function breakDragRestriction(enable) {
        if (enable) {
            document.addEventListener('dragstart', e => e.stopPropagation(), true);
            document.addEventListener('drag', e => e.stopPropagation(), true);
            GM_addStyle(`img { -webkit-user-drag: auto !important; pointer-events: auto !important; }`);
        }
    }
    function breakDevToolsRestriction(enable) {
        if (enable) {
            Object.defineProperty(window, 'devtools', { value: { isOpen: false }, writable: false });
            document.addEventListener('keydown', e => {
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                    e.stopPropagation();
                }
            }, true);
        }
    }

    function breakConsoleRestriction(enable) {
        if (enable) {
            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.head.appendChild(iframe);
                window.console = iframe.contentWindow.console;
            } catch(e) {}
        }
    }

    function enableTabSpoof(enable) {
        if (enable) {
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(document, 'visibilitychange', { get: () => null });
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
                    return;
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            window.addEventListener('visibilitychange', e => {
                e.stopImmediatePropagation();
                e.preventDefault();
            }, true);

            // مخفی کردن Page Visibility از سایت
            const originalPageVisibility = document.__lookupGetter__('visibilityState');
            if (originalPageVisibility) {
                document.__defineGetter__('visibilityState', () => 'visible');
            }

            window.addEventListener('blur', e => {
                e.stopImmediatePropagation();
            }, true);

            window.addEventListener('focus', e => {
                e.stopImmediatePropagation();
            }, true);
        }
    }

    function applySettings() {
        breakCopyRestriction(settings.enableCopy);
        breakRightClickRestriction(settings.enableRightClick);
        breakSelectRestriction(settings.enableSelect);
        breakDragRestriction(settings.enableDrag);
        breakDevToolsRestriction(settings.enableDevTools);
        breakConsoleRestriction(settings.enableConsole);
        enableTabSpoof(settings.enableTabSpoof);
    }
    GM_addStyle(`
        #bi-lite-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 280px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #e94560;
            border-radius: 15px;
            padding: 15px;
            z-index: 999999;
            font-family: 'Tahoma', 'Arial', sans-serif;
            direction: rtl;
            box-shadow: 0 8px 32px rgba(233, 69, 96, 0.3);
            display: none;
            max-height: 80vh;
            overflow-y: auto;
        }
        #bi-lite-panel.active { display: block; }
        
        #bi-lite-panel h3 {
            color: #e94560;
            text-align: center;
            margin: 0 0 15px 0;
            font-size: 16px;
            text-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
            border-bottom: 1px solid #e94560;
            padding-bottom: 10px;
        }
        
        .bi-lite-section {
            margin-bottom: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 10px;
        }
        
        .bi-lite-section-title {
            color: #0f3460;
            background: #e94560;
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
            text-align: center;
        }
        
        .bi-lite-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 5px;
            border-bottom: 1px solid rgba(233, 69, 96, 0.2);
            color: #eee;
            font-size: 12px;
        }
        
        .bi-lite-toggle:last-child { border-bottom: none; }
        
        .bi-lite-switch {
            position: relative;
            width: 40px;
            height: 20px;
            background: #333;
            border-radius: 20px;
            cursor: pointer;
            transition: 0.3s;
        }
        
        .bi-lite-switch.on { background: #e94560; }
        
        .bi-lite-switch::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            background: white;
            border-radius: 50%;
            top: 2px;
            right: 2px;
            transition: 0.3s;
        }
        
        .bi-lite-switch.on::after { right: 22px; }
        
        #bi-lite-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #e94560, #c23152);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 999999;
            box-shadow: 0 4px 15px rgba(233, 69, 96, 0.5);
            transition: transform 0.3s;
        }
        
        #bi-lite-btn:hover { transform: scale(1.1); }
        #bi-lite-btn:active { transform: scale(0.95); }
        
        .bi-lite-close {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #e94560;
            border: none;
            color: white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
        }
        
        .bi-lite-status {
            text-align: center;
            color: #4ecca3;
            font-size: 11px;
            margin-top: 10px;
            padding: 5px;
            background: rgba(78, 204, 163, 0.1);
            border-radius: 8px;
        }
    `);

    function createUI() {
        const btn = document.createElement('button');
        btn.id = 'bi-lite-btn';
        btn.innerHTML = '🛡️';
        btn.title = 'BlackInspector Lite';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = 'bi-lite-panel';
        panel.innerHTML = `
            <button class="bi-lite-close" id="bi-lite-close">✕</button>
            <h3>🛡️ BlackInspector Lite</h3>
            
            <div class="bi-lite-section">
                <div class="bi-lite-section-title">🔓 شکستن محدودیت‌ها</div>
                <div class="bi-lite-toggle">
                    <span>اجازه کپی متن</span>
                    <div class="bi-lite-switch ${settings.enableCopy ? 'on' : ''}" data-key="enableCopy"></div>
                </div>
                <div class="bi-lite-toggle">
                    <span>اجازه راست‌کلیک</span>
                    <div class="bi-lite-switch ${settings.enableRightClick ? 'on' : ''}" data-key="enableRightClick"></div>
                </div>
                <div class="bi-lite-toggle">
                    <span>اجازه انتخاب متن</span>
                    <div class="bi-lite-switch ${settings.enableSelect ? 'on' : ''}" data-key="enableSelect"></div>
                </div>
                <div class="bi-lite-toggle">
                    <span>اجازه درگ تصاویر</span>
                    <div class="bi-lite-switch ${settings.enableDrag ? 'on' : ''}" data-key="enableDrag"></div>
                </div>
                <div class="bi-lite-toggle">
                    <span>باز کردن DevTools</span>
                    <div class="bi-lite-switch ${settings.enableDevTools ? 'on' : ''}" data-key="enableDevTools"></div>
                </div>
                <div class="bi-lite-toggle">
                    <span>بازگرداندن کنسول</span>
                    <div class="bi-lite-switch ${settings.enableConsole ? 'on' : ''}" data-key="enableConsole"></div>
                </div>
            </div>
            
            <div class="bi-lite-section">
                <div class="bi-lite-section-title"> تب اسپوف</div>
                <div class="bi-lite-toggle">
                    <span>مخفی کردن خروج از تب</span>
                    <div class="bi-lite-switch ${settings.enableTabSpoof ? 'on' : ''}" data-key="enableTabSpoof"></div>
                </div>
            </div>
            
            <div class="bi-lite-status" id="bi-lite-status">
                 تنظیمات ذخیره شد
            </div>
        `;
        document.body.appendChild(panel);


        btn.addEventListener('click', () => {
            panel.classList.toggle('active');
        });


        document.getElementById('bi-lite-close').addEventListener('click', () => {
            panel.classList.remove('active');
        });


        panel.querySelectorAll('.bi-lite-switch').forEach(sw => {
            sw.addEventListener('click', function() {
                const key = this.dataset.key;
                this.classList.toggle('on');
                settings[key] = this.classList.contains('on');
                saveSettings();

                const status = document.getElementById('bi-lite-status');
                status.textContent = ' تنظیمات ذخیره شد - صفحه را رفرش کنید';
                status.style.color = '#4ecca3';
                
                applySettings();
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createUI();
            applySettings();
        });
    } else {
        createUI();
        applySettings();
    }
})();