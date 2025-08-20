#!/usr/bin/env python3
import json, webbrowser, os, sys, secrets
from pathlib import Path

CONF = {
    "tiktok": {"url": "https://open-api.tiktok.com/platform/oauth/connect?client_key=YOUR_TIKTOK_CLIENT&scope=user.info.basic,video.upload&response_type=code&redirect_uri=https://localhost:8080/callback&state=tiktok"},
    "instagram": {"url": "https://api.instagram.com/oauth/authorize?client_id=YOUR_IG_CLIENT&redirect_uri=https://localhost:8080/callback&scope=user_profile,user_media&response_type=code&state=instagram"},
    "youtube": {"url": "https://accounts.google.com/o/oauth2/auth?client_id=YOUR_GOOGLE_CLIENT&redirect_uri=https://localhost:8080/callback&scope=https://www.googleapis.com/auth/youtube.upload&response_type=code&state=youtube"},
    "facebook": {"url": "https://www.facebook.com/v19.0/dialog/oauth?client_id=YOUR_FB_CLIENT&redirect_uri=https://localhost:8080/callback&scope=pages_manage_posts&response_type=code&state=facebook"},
    "twitter": {"url": "https://twitter.com/i/oauth2/authorize?client_id=YOUR_TW_CLIENT&redirect_uri=https://localhost:8080/callback&response_type=code&scope=tweet.write&state=twitter"}
}

TOKENS_PATH = Path(__file__).parent / "secrets" / "crosspost_tokens.json"

def main():
    TOKENS_PATH.parent.mkdir(exist_ok=True)
    tokens = {}
    for platform, cfg in CONF.items():
        print(f"[{platform.upper()}] Browser öffnet sich – bitte einloggen & Code kopieren.")
        webbrowser.open(cfg["url"])
        code = input("Code aus URL: ").strip()
        tokens[platform] = {"code": code, "token": secrets.token_urlsafe(32)}
    TOKENS_PATH.write_text(json.dumps(tokens, indent=2))
    print("✅ OAuth-Tokens gespeichert:", TOKENS_PATH)

if __name__ == "__main__":
    main()