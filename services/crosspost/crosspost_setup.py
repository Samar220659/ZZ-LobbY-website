#!/usr/bin/env python3
import json, webbrowser, os, sys, secrets
from pathlib import Path

# TikTok API Configuration - Update CLIENT_KEY after creating app
TIKTOK_CONFIG = {
    "client_key": "YOUR_TIKTOK_CLIENT_KEY",  # From TikTok Developer Portal
    "client_secret": "YOUR_TIKTOK_CLIENT_SECRET",  # From TikTok Developer Portal
    "redirect_uri": "https://localhost:8080/callback",
    "scope": "user.info.basic,video.upload,share.sound.create"
}

CONF = {
    "tiktok": {
        "url": f"https://www.tiktok.com/v2/auth/authorize/?client_key={TIKTOK_CONFIG['client_key']}&scope={TIKTOK_CONFIG['scope']}&response_type=code&redirect_uri={TIKTOK_CONFIG['redirect_uri']}&state=tiktok",
        "config": TIKTOK_CONFIG
    },
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