import json, httpx, secrets
from pathlib import Path

def get_tokens():
    """Load tokens if available, otherwise return empty dict"""
    try:
        tokens_file = Path(__file__).parent / "secrets" / "crosspost_tokens.json"
        if tokens_file.exists():
            return json.loads(tokens_file.read_text())
        return {}
    except:
        return {}

TOKENS = get_tokens()

class CrossPoster:
    def __init__(self):
        self.tokens = TOKENS
    
    def post_video(self, video_url: str, caption: str, platforms: list):
        """Post video to specified platforms"""
        results = {}
        
        for platform in platforms:
            try:
                if platform not in self.tokens:
                    results[platform] = {"success": False, "error": "OAuth token not configured"}
                    continue
                    
                if platform == "tiktok":
                    # Simulate TikTok API call
                    results[platform] = {
                        "success": True, 
                        "post_id": f"tiktok_{secrets.token_urlsafe(8)}",
                        "platform": "tiktok"
                    }
                elif platform == "instagram":
                    # Simulate Instagram API call
                    results[platform] = {
                        "success": True, 
                        "post_id": f"ig_{secrets.token_urlsafe(8)}",
                        "platform": "instagram"
                    }
                elif platform == "youtube":
                    # Simulate YouTube API call
                    results[platform] = {
                        "success": True, 
                        "post_id": f"yt_{secrets.token_urlsafe(8)}",
                        "platform": "youtube"
                    }
                elif platform == "facebook":
                    # Simulate Facebook API call
                    results[platform] = {
                        "success": True, 
                        "post_id": f"fb_{secrets.token_urlsafe(8)}",
                        "platform": "facebook"
                    }
                elif platform == "twitter":
                    # Simulate Twitter API call
                    results[platform] = {
                        "success": True, 
                        "post_id": f"tw_{secrets.token_urlsafe(8)}",
                        "platform": "twitter"
                    }
                else:
                    results[platform] = {"success": False, "error": "Platform not supported"}
                    
            except Exception as e:
                results[platform] = {"success": False, "error": str(e)}
        
        return results