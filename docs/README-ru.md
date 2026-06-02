
<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Iran_%281964%E2%80%931980%29.svg" alt="Флаг Ирана (Лев и Солнце)" width="150">

### [English](../README.md) | [فارسی](README-fa.md)

# BlackInspect v7.0
**Продвинутый фреймворк безопасности и тестирования браузера**

[![Release](https://img.shields.io/github/v/release/AradPhpProgrammer/BlackInspector?color=blue)](https://github.com/AradPhpProgrammer/BlackInspector/releases)
[![License](https://img.shields.io/github/license/AradPhpProgrammer/BlackInspector)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://python.org)

</div>

---

## 🚀 Быстрая установка

> ⚠️ **Важно:** 50% функций расширения работают **без Kernel**, но для полной функциональности **Kernel должен быть запущен**.

### Шаг 1: Загрузка и распаковка
1. Перейдите в [ветку test-main](https://github.com/AradPhpProgrammer/BlackInspector/tree/test-main).
2. Нажмите на зелёную кнопку **Code**.
3. Выберите **Download ZIP**.
4. Распакуйте загруженный ZIP-файл в папку на вашем компьютере.
5. Откройте терминал или командную строку и перейдите в распакованную папку.

### Шаг 2: Установка и запуск Python Kernel
**Windows:**
Просто дважды щёлкните по `run.bat` (или запустите `run.bat` в командной строке).

**Linux/Mac:**
Откройте терминал в распакованной папке и выполните:
```bash
chmod +x run.sh
./run.sh
```
*(Этот скрипт автоматически установит все необходимые зависимости Python и запустит Kernel).*

### Шаг 3: Установка скрипта Tampermonkey
1. Установите расширение [Tampermonkey](https://www.tampermonkey.net/) в вашем браузере.
2. Откройте файл `BlackInspector.js` из распакованной папки с помощью текстового редактора (например, Notepad).
3. Скопируйте всё содержимое.
4. В Tampermonkey нажмите "Create a new script".
5. Вставьте содержимое и сохраните (Ctrl+S или Cmd+S).

### Шаг 4: Настройка подключения
1. Откройте панель BlackInspect в вашем браузере.
2. Перейдите во вкладку **Settings**.
3. Установите Kernel URL на `http://localhost:5000` (или порт, указанный в вашем терминале).
4. Нажмите "Test Connection".

---

## ✨ Возможности

### 🔐 Инструменты безопасности
- **Directory Bruteforce**: Сканирование 70+ распространённых путей (`/admin`, `/.env`, `/.git`)
- **Subdomain Scanner**: DNS-разрешение с обнаружением Subdomain Takeover
- **XSS & SQLi Payloads**: Готовые полезные нагрузки для тестирования безопасности
- **SSL Headers Analysis**: Проверка HSTS, CSP, X-Frame-Options и т.д.

### 🌐 Сетевые инструменты
- **Auth Injection**: Авто-инъекция токенов аутентификации во все запросы
- **Request Modifier**: Изменение URL с помощью Regex-шаблонов
- **Prevent Preflight**: Обход CORS preflight запросов
- **Cookie Manager**: Просмотр, редактирование и экспорт cookies

### 📄 PDF Suite (требуется Kernel)
- Генерация PDF из веб-страницы
- Извлечение текста из PDF
- Объединение/разделение PDF файлов
- Сжатие PDF
- Конвертация PDF в изображения

### 🎭 Анти-детект
- Canvas Spoofing
- Скрытие видимости вкладки
- Скрытие расширений
- Подделка BuildID
- Обнаружение Anti-VM
- Ротация User-Agent

### 🔑 Менеджер паролей
- Зашифрованное хранение паролей (Fernet/PBKDF2)
- Автозаполнение учётных данных
- Безопасная синхронизация через Kernel

### ✅ Менеджер задач
- To-Do список с безопасным хранением
- Приоритизация задач
- Отслеживание выполнения

### 🎲 Генератор фейковых данных
- Генерация фейковых имён, email, телефонов
- Автозаполнение форм фейковыми данными
- Пользовательские шаблоны данных

---

## 📺 Обучение

🎥 **Смотрите полное руководство на YouTube:**

[![BlackInspect Tutorial](https://img.shields.io/badge/YouTube-Смотреть%20туториал-red?logo=youtube&style=for-the-badge)](https://youtube.com/@QcoTools)

---

## 📋 Требования

- Python 3.8 или выше
- Современный браузер (Chrome, Firefox, Edge)
- Расширение Tampermonkey
- Подключение к интернету

### Python зависимости
*(Автоматически устанавливаются с помощью `run.bat` или `run.sh`)*
```text
fastapi, uvicorn, cryptography, aiohttp, dnspython, psutil, pypdf, pdfplumber, reportlab, pymupdf, rich
```

---

## 🛡️ Предупреждение безопасности

Этот инструмент предназначен только для **образовательных и авторизованных целей тестирования**. 
Всегда убеждайтесь, что у вас есть соответствующее разрешение перед тестированием любого сайта.

---

## 📝 Лицензия

Этот проект лицензирован под MIT License - смотрите файл [LICENSE](../LICENSE) для подробностей.

---

## 👨‍💻 Разработчик

**AradPhpProgrammer**
- GitHub: [@AradPhpProgrammer](https://github.com/AradPhpProgrammer)
- YouTube: [AradPhpProgrammer](https://youtube.com/@QcoTools)

---

<div align="center">

**Если вам нравится этот проект, пожалуйста, ⭐ поставьте звезду репозиторию!**

Сделано с ❤️ в Иране

</div>
