import os, json, httpx
UNIVERSAL_KEY = os.getenv("UNIVERSAL_API_KEY", "sk-emergent-3112e764a358184E8B")
UNIVERSAL_URL = "https://api.universal-ai.one/v1/chat"

def ask(prompt: str) -> str:
    res = httpx.post(UNIVERSAL_URL,
                     headers={"Authorization": f"Bearer {UNIVERSAL_KEY}"},
                     json={"prompt": prompt, "service": "auto"})
    return res.json()["choices"][0]["message"]["content"]

def scrape(url: str) -> dict:
    text = httpx.get(f"https://r.jina.ai/{url}", timeout=30).text
    prompt = f'Extrahiere JSON: {{"product":"...","audience":"...","pain":[],"usp":[],"tone":"...","cta":"..."}} Text: {text}'
    return json.loads(ask(prompt))

def score(hook: str) -> int:
    return int(ask(f"Bewerte Hook (0-100): {hook}"))

def video(prompt: str) -> str:
    return ask(f"Erstelle UGC TikTok Ad: {prompt} – gib MP4-URL zurück")

def adcreative_killer(url: str) -> dict:
    data = scrape(url)
    creatives = []
    for pain in data["pain"]:
        hook = f"{pain} – das ist die Lösung"
        s = score(hook)
        if s >= 95:
            v = video(f"{hook}, Produkt: {data['product']}, CTA: {data['cta']}")
            creatives.append({"hook": hook, "score": s, "video_url": v, "copy": {"primary":f"{pain} – {data['usp'][0]}","headline":data["product"],"cta":data["cta"]}})
    return {"url": url, "creatives": creatives}