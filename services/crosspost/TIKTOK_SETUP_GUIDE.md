# 🔐 TikTok API Setup Guide - Daniel Oettel (ZZ-Lobby Elite)

## ⚡ 5-Minuten Setup für echte TikTok Marketing-Kampagnen

### 1️⃣ TikTok Developer Account erstellen
1. Gehe zu: https://developers.tiktok.com
2. Login mit: `a22061981@gmx.de` / `1010Dani@`
3. Klicke "My Apps" → "Create App"

### 2️⃣ App konfigurieren
**App Details:**
- **App Name**: `ZZ-Lobby Elite AdCreative`
- **App Category**: `Business`
- **Purpose**: `Content Management`
- **Redirect URI**: `https://localhost:8080/callback`

### 3️⃣ API Scopes aktivieren
Unter "App Details → Manage API" aktiviere:
- ✅ `user.info.basic`
- ✅ `video.upload`
- ✅ `share.sound.create`

### 4️⃣ Credentials kopieren
Nach Genehmigung (0-24h):
- **Client Key**: [HIER_EINFÜGEN]
- **Client Secret**: [HIER_EINFÜGEN]

### 5️⃣ Setup ausführen

```bash
# 1. Credentials in crosspost_setup.py eintragen
# 2. Lokalen Server starten
cd /app/services/crosspost/
python -m http.server 8080 &

# 3. OAuth-Setup ausführen
python crosspost_setup.py
```

### 6️⃣ Test-Upload
```bash
# Nach erfolgreichem Setup
cd /app
python -c "
from services.crosspost.crosspost_module import CrossPoster
cp = CrossPoster()
result = cp.post_video(
    video_url='https://example.com/test-video.mp4',
    caption='Test von ZZ-Lobby Elite AdCreative System 🚀',
    platforms=['tiktok']
)
print('Upload Result:', result)
"
```

## 🎯 Daniel's Business Integration

**Automatische Daily Campaigns:**
- Jeden Morgen 9:00 Uhr: Neues Video für ZZ-Lobby Services
- Cross-Posting auf TikTok + 4 andere Plattformen
- 95+ Score Videos mit Daniel's echten Steuer-IDs
- Automatische Lead-Generation für Zeitz/Sachsen-Anhalt

**Services bewerbbar:**
1. Website-Entwicklung (€497)
2. Social Media Automation (€297/Monat)
3. Business Digitalisierung Komplettpaket (€1997)
4. Versicherungs-Beratung (Thomas Kaiser ERGO)
5. KI-Steuerberechnung

## 🚀 Nach Setup: Sofortige Aktivierung

```bash
# Daily Campaign starten
curl -X POST https://zz-elite-lobby.preview.emergentagent.com/api/adcreative/daily-campaign

# Custom Campaign für spezielle Services
curl -X POST https://zz-elite-lobby.preview.emergentagent.com/api/adcreative/campaign \
  -H "Content-Type: application/json" \
  -d '{"promo_link": "https://zz-lobby-elite.de/website-entwicklung"}'
```

## ⚠️ Sicherheitshinweise
- Client Secret niemals öffentlich teilen
- Tokens in `crosspost/secrets/` sind lokal gespeichert
- Regelmäßige Token-Rotation empfohlen (90 Tage)

---
**Status**: 🟡 Waiting for TikTok Developer Approval  
**ETA**: 0-24 Stunden  
**Next**: Client Key/Secret in crosspost_setup.py eintragen