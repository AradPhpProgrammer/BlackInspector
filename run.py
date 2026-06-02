#!/usr/bin/env python3
"""
BlackInspect v7.0 — Run & Setup Script
by AradPhpProgrammer | github.com/AradPhpProgrammer/BlackInspector
"""

import sys
import os
import subprocess
import importlib.util
import time
import webbrowser
import re
import threading
from pathlib import Path


def _pip(*pkgs):
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", *pkgs, "-q"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.prompt import Prompt
    from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TaskProgressColumn
    from rich.text import Text
    from rich.table import Table
    from rich import box
    from rich.rule import Rule
    from rich.columns import Columns
    from rich.align import Align
except ImportError:
    print("Installing rich UI library...")
    _pip("rich")
    from rich.console import Console
    from rich.panel import Panel
    from rich.prompt import Prompt
    from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TaskProgressColumn
    from rich.text import Text
    from rich.table import Table
    from rich import box
    from rich.rule import Rule
    from rich.columns import Columns
    from rich.align import Align

console = Console()


BASE_DIR    = Path(__file__).resolve().parent
REQ_FILE    = BASE_DIR / "requirements.txt"
KERNEL_DIR  = BASE_DIR / "kernel"
KERNEL_FILE = KERNEL_DIR / "kernel.py"
WEB_DIR     = BASE_DIR / "web"


BANNER = r"""
  ██████╗ ██╗      █████╗  ██████╗██╗  ██╗
  ██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝
  ██████╔╝██║     ███████║██║     █████╔╝ 
  ██╔══██╗██║     ██╔══██║██║     ██╔═██╗ 
  ██████╔╝███████╗██║  ██║╚██████╗██║  ██╗
  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
  ██╗███╗   ██╗███████╗██████╗ ███████╗ ██████╗████████╗
  ██║████╗  ██║██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝
  ██║██╔██╗ ██║███████╗██████╔╝█████╗  ██║        ██║   
  ██║██║╚██╗██║╚════██║██╔═══╝ ██╔══╝  ██║        ██║   
  ██║██║ ╚████║███████║██║     ███████╗╚██████╗   ██║   
  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   v7.0"""

REQUIREMENTS = [
    ("fastapi",          "fastapi",      "FastAPI web framework"),
    ("uvicorn[standard]","uvicorn",      "ASGI server"),
    ("cryptography",     "cryptography", "Password encryption"),
    ("aiohttp",          "aiohttp",      "Async HTTP client"),
    ("dnspython",        "dns",          "DNS resolution"),
    ("python-multipart", "multipart",    "Form uploads"),
    ("websockets",       "websockets",   "WebSocket support"),
    ("requests",         "requests",     "HTTP requests"),
    ("rich",             "rich",         "Terminal UI"),
]

def parse_requirements_txt() -> list[tuple[str, str, str]]:
    """Parse requirements.txt and merge with REQUIREMENTS list."""
    known = {r[0].lower().split('[')[0]: r for r in REQUIREMENTS}
    extras = []
    if REQ_FILE.exists():
        pkg_re = re.compile(r'^([A-Za-z0-9_\-]+)(\[.*?\])?([><=!][^\s#]*)?')
        with open(REQ_FILE, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                m = pkg_re.match(line)
                if m:
                    raw_name = m.group(1).lower()
                    full_spec = m.group(1) + (m.group(2) or '') + (m.group(3) or '')
                    import_map = {
                        'flask-cors':'flask_cors','flask-socketio':'flask_socketio',
                        'python-socketio':'socketio','python-multipart':'multipart',
                        'dnspython':'dns','pypdf':'pypdf','pdfplumber':'pdfplumber',
                        'aiohttp':'aiohttp','httpx':'httpx','psutil':'psutil',
                        'watchdog':'watchdog','colorama':'colorama','rich':'rich',
                        'click':'click','eventlet':'eventlet','bcrypt':'bcrypt',
                        'cryptography':'cryptography','requests':'requests',
                        'fastapi':'fastapi','uvicorn':'uvicorn','websockets':'websockets',
                    }
                    imp = import_map.get(raw_name, raw_name.replace('-','_'))
                    if raw_name not in known:
                        reason = ''
                        if '# REASON:' in line:
                            reason = line.split('# REASON:')[1].strip()
                        extras.append((full_spec, imp, reason or full_spec))
    return REQUIREMENTS + extras

def check_dep(import_name: str) -> bool:
    return importlib.util.find_spec(import_name) is not None

def install_requirements():
    console.print()
    console.rule("[bold yellow]  Dependency Check[/bold yellow]")
    console.print()

    all_reqs = parse_requirements_txt()
    table = Table(box=box.ROUNDED, show_header=True, header_style="bold cyan",
                  border_style="dim", expand=False)
    table.add_column("Package",     style="cyan",     min_width=22)
    table.add_column("Description", style="dim",      min_width=28)
    table.add_column("Status",      justify="center", min_width=12)

    missing = []
    for pkg, imp, desc in all_reqs:
        if check_dep(imp):
            table.add_row(pkg, desc, "[green] OK[/green]")
        else:
            table.add_row(pkg, desc, "[red] Missing[/red]")
            missing.append(pkg)

    console.print(Align.center(table))

    if missing:
        console.print(f"\n[yellow]  ⬇  Installing [bold]{len(missing)}[/bold] missing package(s)...[/yellow]\n")
        with Progress(
            SpinnerColumn(style="cyan"),
            TextColumn("  [progress.description]{task.description}"),
            BarColumn(bar_width=30, style="cyan", complete_style="green"),
            TaskProgressColumn(),
            console=console,
            transient=False,
        ) as progress:
            task = progress.add_task("Starting...", total=len(missing))
            for pkg in missing:
                progress.update(task, description=f"Installing [cyan]{pkg}[/cyan]...")
                try:
                    _pip(pkg)
                except subprocess.CalledProcessError:
                    console.print(f"[red]  ✗ Failed: {pkg}[/red]")
                progress.advance(task)
        console.print("\n  [green] All dependencies ready![/green]")
    else:
        console.print("\n  [green] All dependencies already installed![/green]")

def ask_port() -> int:
    console.print()
    console.rule("[bold cyan]  Port Selection[/bold cyan]")
    console.print()
    console.print("  [dim]Common choices:[/dim]  [cyan]5000[/cyan]  [dim]·[/dim]  [cyan]8000[/cyan]  [dim]·[/dim]  [cyan]8080[/cyan]  [dim]·[/dim]  [cyan]3000[/cyan]\n")
    while True:
        raw = Prompt.ask("  [bold cyan] Port number[/bold cyan]", default="5000")
        try:
            port = int(raw)
            if 1024 <= port <= 65535:
                return port
            console.print("  [red]Port must be between 1024–65535.[/red]")
        except ValueError:
            console.print("  [red]Please enter a valid number.[/red]")

def open_browser_delayed(port: int):
    time.sleep(2.5)
    url = f"http://localhost:{port}"
    webbrowser.open(url)
    console.print(f"\n  [blue] Browser opened → {url}[/blue]")

def generate_web_page(port: int) -> Path:
    WEB_DIR.mkdir(parents=True, exist_ok=True)
    html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BlackInspect v7.0 — راهنمای نصب</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
<style>
:root {{
  --bg:#0d1117;--surface:#161b22;--surface2:#21262d;
  --border:#30363d;--cyan:#58a6ff;--green:#3fb950;
  --yellow:#d29922;--red:#f85149;--purple:#bc8cff;
  --text:#c9d1d9;--muted:#8b949e;
}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{
  background:var(--bg);color:var(--text);
  font-family:'Vazirmatn','IBM Plex Mono','Courier New',monospace;
  min-height:100vh;padding:40px 20px;direction:rtl;
}}
.container{{max-width:960px;margin:0 auto}}
.badge{{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--surface);border:1px solid var(--border);
  border-radius:20px;padding:6px 16px;font-size:12px;color:var(--muted);
  margin-bottom:32px;direction:ltr;font-family:'IBM Plex Mono',monospace;
}}
.badge .dot{{width:8px;height:8px;background:var(--green);border-radius:50%;animation:pulse 2s infinite}}
@keyframes pulse{{0%,100%{{opacity:1}}50%{{opacity:.3}}}}
h1{{font-size:clamp(28px,5vw,52px);color:var(--cyan);margin-bottom:8px;
    font-family:'IBM Plex Mono',monospace;letter-spacing:-1px}}
h1 span{{color:var(--text)}}
.subtitle{{color:var(--muted);margin-bottom:40px;font-size:14px}}
.kernel-url{{
  background:var(--surface);border:2px solid var(--green);
  border-radius:12px;padding:20px 28px;margin-bottom:36px;
  display:flex;align-items:center;justify-content:space-between;
  gap:16px;flex-wrap:wrap;direction:ltr;
}}
.kernel-url .label{{color:var(--muted);font-size:12px}}
.kernel-url .url{{color:var(--green);font-size:22px;font-weight:700;font-family:'IBM Plex Mono',monospace}}
.kernel-url .status{{
  background:rgba(63,185,80,.15);border:1px solid var(--green);
  border-radius:8px;padding:6px 14px;color:var(--green);font-size:12px;white-space:nowrap;
}}
.cards{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:36px}}
@media(max-width:640px){{.cards{{grid-template-columns:1fr}}}}
.card{{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px}}
.card-title{{
  color:var(--cyan);font-size:13px;font-weight:700;
  margin-bottom:16px;display:flex;align-items:center;gap:8px;
  font-family:'IBM Plex Mono',monospace;direction:ltr;
}}
.step{{display:flex;gap:12px;margin-bottom:14px;align-items:flex-start}}
.step-num{{
  min-width:26px;height:26px;background:var(--cyan);color:var(--bg);
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;flex-shrink:0;font-family:'IBM Plex Mono',monospace;
}}
.step-text{{font-size:13px;color:var(--text);line-height:1.7}}
.step-text code{{
  background:rgba(88,166,255,.1);border:1px solid rgba(88,166,255,.2);
  border-radius:4px;padding:1px 6px;color:var(--cyan);font-size:12px;
  font-family:'IBM Plex Mono',monospace;direction:ltr;display:inline-block;
}}
.tamper-box{{
  background:var(--surface);border:1px solid var(--border);
  border-radius:12px;padding:28px;margin-bottom:24px;
}}
.lang-tag{{
  display:inline-block;background:rgba(88,166,255,.15);border:1px solid var(--cyan);
  border-radius:4px;padding:2px 10px;font-size:11px;color:var(--cyan);
  margin-bottom:14px;font-family:'IBM Plex Mono',monospace;
}}
.endpoints{{font-family:'IBM Plex Mono',monospace;direction:ltr}}
.endpoints .ep{{
  padding:6px 0;border-bottom:1px solid var(--border);
  display:flex;gap:12px;align-items:center;font-size:12px;
}}
.ep .method{{color:var(--green);min-width:40px}}
.ep .path{{color:var(--cyan)}}
.ep .desc{{color:var(--muted)}}
footer{{color:var(--muted);font-size:11px;text-align:center;margin-top:48px;font-family:'IBM Plex Mono',monospace}}
</style>
</head>
<body>
<div class="container">
  <div class="badge"><span class="dot"></span> Kernel Running · Port {port}</div>
  <h1>Black<span>Inspect</span></h1>
  <p class="subtitle">Full Inspection &amp; Security Suite — هسته فعال و آماده است</p>

  <div class="kernel-url">
    <div><div class="label">Kernel URL</div><div class="url">http://localhost:{port}</div></div>
    <div class="status">🟢 Online</div>
  </div>

  <div class="tamper-box">
    <div class="lang-tag">🇮🇷 فارسی</div>
    <div class="card-title">📜 راهنمای نصب BlackInspect با TamperMonkey</div>
    <div class="step"><div class="step-num">۱</div><div class="step-text">افزونه <strong>TamperMonkey</strong> را از Chrome Web Store یا Firefox Add-ons نصب کنید.</div></div>
    <div class="step"><div class="step-num">۲</div><div class="step-text">روی آیکون TamperMonkey کلیک کنید ← گزینه <code>Dashboard</code> ← دکمه <code>+ New Script</code></div></div>
    <div class="step"><div class="step-num">۳</div><div class="step-text">تمام کد داخل ویرایشگر را پاک کنید، سپس محتوای فایل <code>blackinspect.js</code> را paste کنید.</div></div>
    <div class="step"><div class="step-num">۴</div><div class="step-text">داخل پنل افزونه، به تب <code>Settings</code> بروید و Kernel URL را روی <code>http://localhost:{port}</code> تنظیم کنید.</div></div>
    <div class="step"><div class="step-num">۵</div><div class="step-text"><code>File → Save</code> یا <code>Ctrl+S</code> را بزنید. افزونه روی همه سایت‌ها فعال می‌شود!</div></div>
    <div class="step"><div class="step-num">۶</div><div class="step-text">آیکون ⚙ در گوشه پایین-راست هر صفحه ظاهر می‌شود — کلیک کنید تا پنل باز شود.</div></div>
  </div>

  <div class="tamper-box">
    <div class="lang-tag">🇬🇧 English</div>
    <div class="card-title">📜 How to load BlackInspect via TamperMonkey</div>
    <div class="step"><div class="step-num">1</div><div class="step-text">Install <strong>TamperMonkey</strong> from the Chrome Web Store or Firefox Add-ons.</div></div>
    <div class="step"><div class="step-num">2</div><div class="step-text">Click the TamperMonkey icon → <code>Dashboard</code> → <code>+ New Script</code></div></div>
    <div class="step"><div class="step-num">3</div><div class="step-text">Delete all existing code, then paste the full contents of <code>blackinspect.js</code>.</div></div>
    <div class="step"><div class="step-num">4</div><div class="step-text">Open the panel on any site, go to the <code>Settings</code> tab, and set Kernel URL to <code>http://localhost:{port}</code>.</div></div>
    <div class="step"><div class="step-num">5</div><div class="step-text">Press <code>Ctrl+S</code> to save. The script is now active on all websites!</div></div>
    <div class="step"><div class="step-num">6</div><div class="step-text">The ⚙ gear icon appears at the bottom-right of every page — click it to open BlackInspect.</div></div>
  </div>

  <div class="cards">
    <div class="card">
      <div class="card-title">⚡ Kernel API Endpoints</div>
      <div class="endpoints">
        <div class="ep"><span class="method">GET</span><span class="path">/health</span><span class="desc">Status check</span></div>
        <div class="ep"><span class="method">GET</span><span class="path">/fps</span><span class="desc">System metrics &amp; FPS</span></div>
        <div class="ep"><span class="method">POST</span><span class="path">/passwords/save</span><span class="desc">Encrypt &amp; save password</span></div>
        <div class="ep"><span class="method">GET</span><span class="path">/passwords/list</span><span class="desc">List saved passwords</span></div>
        <div class="ep"><span class="method">DELETE</span><span class="path">/passwords/delete</span><span class="desc">Delete a password</span></div>
        <div class="ep"><span class="method">POST</span><span class="path">/scan/directory</span><span class="desc">Directory bruteforce</span></div>
        <div class="ep"><span class="method">POST</span><span class="path">/scan/subdomains</span><span class="desc">Subdomain scanner</span></div>
        <div class="ep"><span class="method">GET</span><span class="path">/templates</span><span class="desc">Load scan_templates.json</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">📁 Project Structure</div>
      <div class="step"><div class="step-text"><code>run.py</code> — Launcher &amp; installer</div></div>
      <div class="step"><div class="step-text"><code>requirements.txt</code> — Auto-managed deps</div></div>
      <div class="step"><div class="step-text"><code>kernel/kernel.py</code> — Python backend (FastAPI)</div></div>
      <div class="step"><div class="step-text"><code>kernel/scan_templates.json</code> — 70+ paths &amp; payloads</div></div>
      <div class="step"><div class="step-text"><code>kernel/passwords.enc</code> — Encrypted vault (auto-created)</div></div>
      <div class="step"><div class="step-text"><code>blackinspect.js</code> — TamperMonkey script</div></div>
    </div>
  </div>

  <footer>BlackInspect v7.0 — For educational and authorized security research only<br>github.com/AradPhpProgrammer/BlackInspector</footer>
</div>
</body>
</html>"""
    web_file = WEB_DIR / "index.html"
    web_file.write_text(html, encoding='utf-8')
    return web_file


def main():
    os.system("cls" if os.name == "nt" else "clear")

    console.print(Text(BANNER, style="bold purple"))
    console.print()
    console.print(Panel(
        "[bold white]BlackInspect v7.0[/bold white]  ·  "
        "[dim]Advanced Web Inspection & Security Suite[/dim]\n"
        "[dim]github.com/AradPhpProgrammer/BlackInspector[/dim]",
        border_style="purple",
        padding=(0, 2),
    ))

    install_requirements()
    port = ask_port()
    generate_web_page(port)

    console.print()
    console.print(Panel(
        f"[bold green] Starting kernel on port [cyan]{port}[/cyan]...[/bold green]\n"
        f"[dim]  URL  : http://localhost:{port}[/dim]\n"
        f"[dim]  Page : web/index.html[/dim]\n"
        f"[dim]  Press Ctrl+C to stop[/dim]",
        border_style="green",
        padding=(0, 2),
    ))

    if not KERNEL_FILE.exists():
        console.print(f"[red] kernel/kernel.py not found at: {KERNEL_FILE}[/red]")
        sys.exit(1)

    threading.Thread(target=open_browser_delayed, args=(port,), daemon=True).start()

    env = os.environ.copy()
    env["BI_PORT"] = str(port)

    try:
        subprocess.run(
            [sys.executable, str(KERNEL_FILE), "--port", str(port)],
            env=env,
            cwd=str(KERNEL_DIR),
        )
    except KeyboardInterrupt:
        console.print("\n\n  [yellow] Kernel stopped.[/yellow]")


if __name__ == "__main__":
    main()