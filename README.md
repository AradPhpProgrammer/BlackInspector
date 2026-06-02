<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Iran_%281964%E2%80%931980%29.svg/320px-Flag_of_Iran_%281964%E2%80%931980%29.svg.png" alt="Iran Flag" width="150">

### [فارسی](#فارسی) | [Русский](#русский)

# BlackInspect v7.0
**Advanced Browser Security & Testing Framework**

[![Release](https://img.shields.io/github/v/release/AradPhpProgrammer/BlackInspector?color=blue)](https://github.com/AradPhpProgrammer/BlackInspector/releases)
[![License](https://img.shields.io/github/license/AradPhpProgrammer/BlackInspector)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://python.org)

</div>

---

## 🚀 Quick Install

> ⚠️ **Important:** 50% of extension features work **without Kernel**, but for full functionality, **Kernel must be running**.

### Step 1: Install Python Kernel

**Windows:**
```bash
git clone https://github.com/AradPhpProgrammer/BlackInspector.git
cd BlackInspector
git checkout test-main
run.bat
```

**Linux/Mac:**
```bash
git clone https://github.com/AradPhpProgrammer/BlackInspector.git
cd BlackInspector
git checkout test-main
chmod +x run.sh
./run.sh
```

### Step 2: Install Tampermonkey Script

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension
2. Open `BlackInspector.js` file
3. Copy all content
4. In Tampermonkey, click "Create a new script"
5. Paste content and save

### Step 3: Configure Connection

1. Open BlackInspect panel in browser (F12 > BlackInspect tab)
2. Go to **Settings** tab
3. Set Kernel URL to `http://localhost:5000` (or your custom port)
4. Click "Test Connection"

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
```
fastapi==0.109.0
uvicorn==0.27.0
cryptography==42.0.0
aiohttp==3.9.1
dnspython==2.5.0
psutil==5.9.7
pypdf==4.0.0
pdfplumber==0.10.3
reportlab==4.0.8
pymupdf==1.23.8
rich==13.7.0
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

