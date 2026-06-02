
<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Iran_%281964%E2%80%931980%29.svg" alt="Iran Flag (Lion and Sun)" width="150">

### [فارسی](docs/README-fa.md) | [Русский](docs/README-ru.md)

# BlackInspect v7.0
**Advanced Browser Security & Testing Framework**

[![Release](https://img.shields.io/github/v/release/AradPhpProgrammer/BlackInspector?color=blue)](https://github.com/AradPhpProgrammer/BlackInspector/releases)
[![License](https://img.shields.io/github/license/AradPhpProgrammer/BlackInspector)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://python.org)

</div>

---

## 🚀 Quick Install

> ⚠️ **Important:** 50% of extension features work **without Kernel**, but for full functionality, **Kernel must be running**.

### Step 1: Download and Extract
1. Go to the [test-main branch](https://github.com/AradPhpProgrammer/BlackInspector/tree/test-main).
2. Click on the green **Code** button.
3. Select **Download ZIP**.
4. Extract the downloaded ZIP file to a folder on your computer.
5. Open your terminal or command prompt and navigate to the extracted folder.

### Step 2: Install & Run Python Kernel
**Windows:**
Simply double-click `run.bat` (or run `run.bat` in the command prompt).

**Linux/Mac:**
Open the terminal in the extracted folder and run:
```bash
chmod +x run.sh
./run.sh
```
*(This script will automatically install all required Python dependencies and start the Kernel).*

### Step 3: Install Tampermonkey Script
1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension in your browser.
2. Open the `BlackInspector.js` file from the extracted folder using a text editor (like Notepad).
3. Copy all the content.
4. In Tampermonkey, click "Create a new script".
5. Paste the content and save (Ctrl+S or Cmd+S).

### Step 4: Configure Connection
1. Open the BlackInspect panel in your browser.
2. Go to the **Settings** tab.
3. Set the Kernel URL to `http://localhost:5000` (or the port shown in your terminal).
4. Click "Test Connection".

---

## ✨ Features

### 🔐 Security Tools
- **Directory Bruteforce**: Scan 70+ common paths (`/admin`, `/.env`, `/.git`)
- **Subdomain Scanner**: DNS resolution with Subdomain Takeover detection
- **XSS & SQLi Payloads**: Ready-to-use security testing payloads
- **SSL Headers Analysis**: Check HSTS, CSP, X-Frame-Options, etc.

### 🌐 Network Tools
- **Auth Injection**: Auto-inject authentication tokens to all requests
- **Request Modifier**: Modify URLs using Regex patterns
- **Prevent Preflight**: Bypass CORS preflight requests
- **Cookie Manager**: View, edit, and export cookies

### 📄 PDF Suite (Kernel Required)
- Generate PDF from webpage
- Extract text from PDF
- Merge/Split PDF files
- Compress PDF
- Convert PDF to images

### 🎭 Anti-Detection
- Canvas Spoofing
- Tab Visibility Hiding
- Extension Hiding
- BuildID Spoofing
- Anti-VM Detection
- User-Agent Rotation

### 🔑 Password Manager
- Encrypted password storage (Fernet/PBKDF2)
- Auto-fill credentials
- Secure sync via Kernel

### ✅ Task Manager
- To-Do list with secure storage
- Task prioritization
- Completion tracking

### 🎲 Fake Data Generator
- Generate fake names, emails, phones
- Auto-fill forms with fake data
- Custom data templates

---

## 📺 Tutorial

🎥 **Watch the complete tutorial on YouTube:**

[![BlackInspect Tutorial](https://img.shields.io/badge/YouTube-Watch%20Tutorial-red?logo=youtube&style=for-the-badge)](https://youtube.com/@AradPhpProgrammer)

---

## 📋 Requirements

- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Edge)
- Tampermonkey extension
- Internet connection

### Python Dependencies
*(Automatically installed by `run.bat` or `run.sh`)*
```text
fastapi, uvicorn, cryptography, aiohttp, dnspython, psutil, pypdf, pdfplumber, reportlab, pymupdf, rich
```

---

## 🛡️ Security Notice

This tool is for **educational and authorized testing purposes only**. 
Always ensure you have proper authorization before testing any website.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**AradPhpProgrammer**
- GitHub: [@AradPhpProgrammer](https://github.com/AradPhpProgrammer)
- YouTube: [AradPhpProgrammer](https://youtube.com/@AradPhpProgrammer)

---

<div align="center">

**If you like this project, please ⭐ star the repository!**

Made with ❤️ in Iran

</div>


با این کار، وقتی کسی روی "فارسی" کلیک کند، به درستی به آن فایل هدایت می‌شود و پرچم هم به دلیل استفاده از لینک مستقیم SVG ویکی‌مدیا، بدون مشکل لود خواهد شد.
