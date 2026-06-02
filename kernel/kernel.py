#!/usr/bin/env python3
"""
BlackInspect v7.0 — Python Kernel
FastAPI backend: encrypted password vault, directory scan, subdomain scan,
system metrics, CORS-open for the TamperMonkey extension.
"""

import argparse
import asyncio
import base64
import hashlib
import json
import os
import platform
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    from fastapi import FastAPI, HTTPException, Request
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse, HTMLResponse
    import uvicorn
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable,"-m","pip","install",
                           "fastapi","uvicorn[standard]","-q"])
    from fastapi import FastAPI, HTTPException, Request
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse, HTMLResponse
    import uvicorn

try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    from cryptography.hazmat.primitives import hashes
    HAS_CRYPTO = True
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable,"-m","pip","install","cryptography","-q"])
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    from cryptography.hazmat.primitives import hashes
    HAS_CRYPTO = True

try:
    import aiohttp
    HAS_AIOHTTP = True
except ImportError:
    HAS_AIOHTTP = False

try:
    import dns.resolver
    HAS_DNS = True
except ImportError:
    HAS_DNS = False

try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False


KERNEL_DIR    = Path(__file__).resolve().parent
WEB_DIR       = KERNEL_DIR.parent / "web"
INDEX_HTML    = WEB_DIR / "index.html"
VAULT_FILE    = KERNEL_DIR / "passwords.enc"
TEMPLATES     = KERNEL_DIR / "scan_templates.json"
MASTER_SALT   = b"BlackInspect_v8_salt_2024"
MASTER_PASS   = b"bi_default_master_key"        

def _derive_key(password: bytes, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100_000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password))


def _fernet(password: bytes = MASTER_PASS) -> Fernet:
    key = _derive_key(password, MASTER_SALT)
    return Fernet(key)


def _load_vault() -> List[Dict]:
    if not VAULT_FILE.exists():
        return []
    try:
        raw = VAULT_FILE.read_bytes()
        data = _fernet().decrypt(raw)
        return json.loads(data.decode())
    except Exception:
        return []


def _save_vault(entries: List[Dict]):
    data = json.dumps(entries, ensure_ascii=False).encode()
    encrypted = _fernet().encrypt(data)
    VAULT_FILE.write_bytes(encrypted)


def load_templates() -> Dict:
    if TEMPLATES.exists():
        try:
            return json.loads(TEMPLATES.read_text(encoding='utf-8'))
        except Exception:
            pass
    return {}


app = FastAPI(title="BlackInspect Kernel", version="7.0.0", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_start_time = time.time()
_fps_data: Dict[str, Any] = {"fps": 0, "ts": time.time()}

# ---------------------------------------------------------
# مسیر اصلی برای نمایش صفحه HTML در مرورگر
# ---------------------------------------------------------
@app.get("/", response_class=HTMLResponse)
async def serve_index():
    if INDEX_HTML.exists():
        return HTMLResponse(content=INDEX_HTML.read_text(encoding='utf-8'), status_code=200)
    return HTMLResponse(content="<h1>BlackInspect Kernel Running</h1><p>UI (index.html) not found.</p>", status_code=200)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "7.0.0",
        "uptime_seconds": round(time.time() - _start_time, 1),
        "platform": platform.system(),
        "python": platform.python_version(),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "features": {
            "crypto": HAS_CRYPTO,
            "aiohttp": HAS_AIOHTTP,
            "dns": HAS_DNS,
            "psutil": HAS_PSUTIL,
        }
    }


@app.get("/fps")
async def get_fps():
    metrics: Dict[str, Any] = {"timestamp": datetime.utcnow().isoformat() + "Z"}
    if HAS_PSUTIL:
        metrics["cpu_percent"]   = psutil.cpu_percent(interval=0.1)
        metrics["ram_percent"]   = psutil.virtual_memory().percent
        metrics["ram_used_mb"]   = round(psutil.virtual_memory().used / 1e6, 1)
        metrics["ram_total_mb"]  = round(psutil.virtual_memory().total / 1e6, 1)
        metrics["cpu_count"]     = psutil.cpu_count()
    else:
        metrics["cpu_percent"] = None
        metrics["ram_percent"] = None
    metrics["uptime_seconds"] = round(time.time() - _start_time, 1)
    return metrics

@app.get("/templates")
async def get_templates():
    return load_templates()


class PasswordEntry:
    pass

from pydantic import BaseModel

class SavePasswordBody(BaseModel):
    domain:   str
    username: str
    password: str
    url:      Optional[str] = ""
    note:     Optional[str] = ""


class DeletePasswordBody(BaseModel):
    index: int


class UpdatePasswordBody(BaseModel):
    index:    int
    domain:   Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    url:      Optional[str] = None
    note:     Optional[str] = None


@app.get("/passwords/list")
async def list_passwords():
    entries = _load_vault()
    safe = []
    for e in entries:
        safe.append({
            "domain":   e.get("domain",""),
            "username": e.get("username",""),
            "password": e.get("password",""),   
            "url":      e.get("url",""),
            "note":     e.get("note",""),
            "saved_at": e.get("saved_at",""),
        })
    return {"passwords": safe, "count": len(safe)}


@app.post("/passwords/save")
async def save_password(body: SavePasswordBody):
    entries = _load_vault()
    entry = {
        "domain":   body.domain,
        "username": body.username,
        "password": body.password,
        "url":      body.url or "",
        "note":     body.note or "",
        "saved_at": datetime.utcnow().isoformat() + "Z",
    }
    entries.append(entry)
    _save_vault(entries)
    return {"success": True, "count": len(entries)}


@app.put("/passwords/update")
async def update_password(body: UpdatePasswordBody):
    entries = _load_vault()
    if body.index < 0 or body.index >= len(entries):
        raise HTTPException(status_code=404, detail="Index out of range")
    e = entries[body.index]
    if body.domain   is not None: e["domain"]   = body.domain
    if body.username is not None: e["username"] = body.username
    if body.password is not None: e["password"] = body.password
    if body.url      is not None: e["url"]      = body.url
    if body.note     is not None: e["note"]     = body.note
    e["updated_at"] = datetime.utcnow().isoformat() + "Z"
    entries[body.index] = e
    _save_vault(entries)
    return {"success": True}


@app.delete("/passwords/delete")
async def delete_password(body: DeletePasswordBody):
    entries = _load_vault()
    if body.index < 0 or body.index >= len(entries):
        raise HTTPException(status_code=404, detail="Index out of range")
    removed = entries.pop(body.index)
    _save_vault(entries)
    return {"success": True, "removed_domain": removed.get("domain","")}


@app.delete("/passwords/clear")
async def clear_passwords():
    _save_vault([])
    return {"success": True}


class DirScanBody(BaseModel):
    target:      str
    wordlist:    Optional[List[str]] = None
    concurrency: Optional[int]       = 10
    timeout:     Optional[float]     = 5.0


@app.post("/scan/directory")
async def scan_directory(body: DirScanBody):
    tpl  = load_templates()
    paths = body.wordlist or tpl.get("directory_wordlist", [])
    base  = body.target.rstrip("/")
    found = []
    errors= []
    sem   = asyncio.Semaphore(min(body.concurrency or 10, 20))

    async def probe(session, path):
        url = base + path
        async with sem:
            try:
                async with session.head(
                    url,
                    timeout=aiohttp.ClientTimeout(total=body.timeout or 5),
                    allow_redirects=True,
                    ssl=False,
                ) as resp:
                    if resp.status not in (404, 410):
                        found.append({"path": path, "status": resp.status, "url": url})
            except Exception as ex:
                errors.append({"path": path, "error": str(ex)[:80]})

    if HAS_AIOHTTP:
        connector = aiohttp.TCPConnector(ssl=False)
        async with aiohttp.ClientSession(connector=connector) as session:
            tasks = [probe(session, p) for p in paths]
            await asyncio.gather(*tasks)
    else:
        import requests
        for path in paths:
            url = base + path
            try:
                r = requests.head(url, timeout=body.timeout or 5, verify=False, allow_redirects=True)
                if r.status_code not in (404, 410):
                    found.append({"path": path, "status": r.status_code, "url": url})
            except Exception as ex:
                errors.append({"path": path, "error": str(ex)[:80]})

    return {
        "target": base,
        "scanned": len(paths),
        "found": found,
        "errors_count": len(errors),
    }


class SubdomainScanBody(BaseModel):
    domain:     str
    wordlist:   Optional[List[str]] = None
    check_cname: Optional[bool]     = True


DEFAULT_SUBDOMAIN_LIST = [
    "www","mail","ftp","smtp","pop","ns1","ns2","cdn","api","dev","test",
    "staging","admin","portal","vpn","shop","blog","app","mobile","m",
    "static","assets","media","img","images","video","files","docs","help",
    "support","status","monitor","dashboard","panel","login","auth",
    "secure","ssl","mx","webmail","autodiscover","cpanel","whm","ftp2",
    "beta","old","new","v2","api2","service","services","cloud","storage",
]


@app.post("/scan/subdomains")
async def scan_subdomains(body: SubdomainScanBody):
    tpl = load_templates()
    subs = body.wordlist or DEFAULT_SUBDOMAIN_LIST
    cname_svcs = tpl.get("cname_services", {})
    domain = body.domain.strip().lstrip("*.")
    results = {"alive": [], "cname_risk": [], "errors": []}

    async def check_sub(sub):
        fqdn = f"{sub}.{domain}"
        if HAS_DNS:
            try:
                loop = asyncio.get_event_loop()
                resolver = dns.resolver.Resolver()
                resolver.lifetime = 3

                def _resolve():
                    try:
                        ans = resolver.resolve(fqdn, "A")
                        return [str(r) for r in ans]
                    except Exception:
                        return []

                ips = await loop.run_in_executor(None, _resolve)
                if ips:
                    entry = {"subdomain": fqdn, "ips": ips}
                    results["alive"].append(entry)

                    if body.check_cname:
                        def _cname():
                            try:
                                ans = resolver.resolve(fqdn, "CNAME")
                                return str(ans[0])
                            except Exception:
                                return ""
                        cname_val = await loop.run_in_executor(None, _cname)
                        if cname_val:
                            for svc_domain, svc_name in cname_svcs.items():
                                if svc_domain in cname_val:
                                    results["cname_risk"].append({
                                        "subdomain": fqdn,
                                        "cname": cname_val,
                                        "service": svc_name,
                                    })
            except Exception as ex:
                results["errors"].append({"subdomain": fqdn, "error": str(ex)[:60]})
        else:
            import socket
            try:
                ips = socket.gethostbyname_ex(fqdn)[2]
                if ips:
                    results["alive"].append({"subdomain": fqdn, "ips": ips})
            except Exception:
                pass

    tasks = [check_sub(s) for s in subs]
    await asyncio.gather(*tasks)
    return {
        "domain": domain,
        "checked": len(subs),
        "alive_count": len(results["alive"]),
        "alive": results["alive"],
        "cname_risk": results["cname_risk"],
    }


class AutoSaveBody(BaseModel):
    domain:   str
    username: str
    password: str
    url:      Optional[str] = ""


@app.post("/passwords/autosave")
async def autosave_password(body: AutoSaveBody):
    """
    Called by the extension when it detects a login form submission.
    Stores to vault and returns confirmation for the notification prompt.
    """
    entries = _load_vault()
    
    for e in entries:
        if e.get("domain") == body.domain and e.get("username") == body.username:
            
            e["password"] = body.password
            e["updated_at"] = datetime.utcnow().isoformat() + "Z"
            _save_vault(entries)
            return {"success": True, "action": "updated"}
    entry = {
        "domain":   body.domain,
        "username": body.username,
        "password": body.password,
        "url":      body.url or "",
        "note":     "Auto-saved",
        "saved_at": datetime.utcnow().isoformat() + "Z",
    }
    entries.append(entry)
    _save_vault(entries)
    return {"success": True, "action": "created", "count": len(entries)}


@app.on_event("startup")
async def on_startup():
    print(f"\n   BlackInspect Kernel v7.0 started")
    print(f"   http://localhost:{_PORT}")
    print(f"   Docs: http://localhost:{_PORT}/docs")
    print(f"   Vault: {VAULT_FILE}")
    print(f"   Templates: {TEMPLATES}")
    print(f"  Press Ctrl+C to stop\n")

_PORT = 5000

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=int(os.environ.get("BI_PORT","5000")))
    parser.add_argument("--host", default="127.0.0.1")
    args = parser.parse_args()
    _PORT = args.port

    uvicorn.run(
        "kernel:app",
        host=args.host,
        port=args.port,
        log_level="warning",
        reload=False,
    )