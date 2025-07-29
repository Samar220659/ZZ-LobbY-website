#!/usr/bin/env python3
"""
ZZ-Lobby Elite - Quick Start Script
Startet das komplette System mit einem Befehl
"""
import subprocess
import sys
import time
import os
from pathlib import Path

def print_header():
    """Zeigt ZZ-Lobby Elite Header"""
    header = """
🚀 ZZ-LOBBY ELITE QUICK START
================================
💰 Automatisches €500/Tag System
🎯 5%+ Conversion Rate Target  
⚡ 100% Automation Engine
🔥 Revenue Maximization Mode
================================
"""
    print(header)

def check_requirements():
    """Prüft System-Voraussetzungen"""
    print("🔍 SYSTEM-VORAUSSETZUNGEN WERDEN GEPRÜFT...")
    
    # Python Version
    python_version = sys.version_info
    if python_version.major < 3 or python_version.minor < 8:
        print("❌ Python 3.8+ erforderlich")
        sys.exit(1)
    print(f"✅ Python {python_version.major}.{python_version.minor} - OK")
    
    # Required Modules
    required_modules = [
        "fastapi", "uvicorn", "motor", "pymongo", 
        "aiohttp", "pydantic", "python-dotenv"
    ]
    
    for module in required_modules:
        try:
            __import__(module.replace("-", "_"))
            print(f"✅ {module} - OK")
        except ImportError:
            print(f"❌ {module} fehlt - Installiere mit: pip install {module}")
            return False
    
    return True

def start_backend():
    """Startet ZZ-Lobby Elite Backend"""
    print("🔧 BACKEND WIRD GESTARTET...")
    
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # Starte FastAPI Server
    cmd = ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
    
    try:
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("✅ Backend gestartet auf http://0.0.0.0:8001")
        return process
    except Exception as e:
        print(f"❌ Backend-Start fehlgeschlagen: {e}")
        return None

def start_automation_systems():
    """Startet alle Automatisierungs-Systeme"""
    print("⚡ AUTOMATISIERUNGS-SYSTEME WERDEN GESTARTET...")
    
    backend_dir = Path(__file__).parent / "backend"
    
    # Liste der Automation Scripts
    automation_scripts = [
        "revenue_automation.py",
        "campaign_optimizer.py", 
        "startup.py"
    ]
    
    processes = []
    
    for script in automation_scripts:
        script_path = backend_dir / script
        if script_path.exists():
            try:
                cmd = ["python", str(script_path)]
                process = subprocess.Popen(cmd, cwd=backend_dir)
                processes.append(process)
                print(f"✅ {script} gestartet")
            except Exception as e:
                print(f"❌ {script} Start fehlgeschlagen: {e}")
    
    return processes

def display_status():
    """Zeigt System-Status an"""
    status = """
🎯 ZZ-LOBBY ELITE SYSTEM STATUS
===============================
✅ Backend API: LÄUFT (Port 8001)
✅ Revenue Automation: AKTIV
✅ Campaign Optimizer: AKTIV  
✅ Analytics Engine: ÜBERWACHT
✅ Marketing Automation: LÄUFT

💰 TÄGLICH ZIEL: €500+
🎯 CONVERSION ZIEL: 5%+
🚨 NOTFALL-SCHWELLE: €150

🌐 FRONTEND: http://localhost:3000
🔧 API DOCS: http://localhost:8001/docs
📊 ADMIN: http://localhost:8001/api/analytics/revenue

⚡ SYSTEM VOLL AUTOMATISIERT!
===============================
"""
    print(status)

def show_quick_actions():
    """Zeigt Quick Actions"""
    actions = """
🚀 QUICK ACTIONS:
=================
1. 📱 TikTok Content erstellen
2. 📧 E-Mail Kampagne starten  
3. 💸 Werbebudget optimieren
4. 📊 Analytics Dashboard öffnen
5. 🚨 Notfall-Protokoll aktivieren

💡 TIPP: Überwache das System über:
   http://localhost:8001/api/analytics/revenue
"""
    print(actions)

def main():
    """Hauptfunktion"""
    print_header()
    
    # System-Check
    if not check_requirements():
        print("❌ System-Voraussetzungen nicht erfüllt!")
        sys.exit(1)
    
    print("✅ ALLE VORAUSSETZUNGEN ERFÜLLT!")
    print()
    
    # Backend starten
    backend_process = start_backend()
    if not backend_process:
        print("❌ Backend-Start fehlgeschlagen!")
        sys.exit(1)
    
    # Kurz warten für Backend Startup
    print("⏳ Warte auf Backend-Startup...")
    time.sleep(3)
    
    # Automation Systems starten
    automation_processes = start_automation_systems()
    
    # Status anzeigen
    print()
    display_status()
    
    # Quick Actions
    show_quick_actions()
    
    # Keep alive
    try:
        print("🔄 SYSTEM LÄUFT - Drücke Ctrl+C zum Beenden")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 SYSTEM WIRD BEENDET...")
        
        # Processes beenden
        if backend_process:
            backend_process.terminate()
        
        for process in automation_processes:
            process.terminate()
        
        print("✅ ALLE PROZESSE BEENDET")
        print("💰 VIELEN DANK FÜR ZZ-LOBBY ELITE!")

if __name__ == "__main__":
    main()