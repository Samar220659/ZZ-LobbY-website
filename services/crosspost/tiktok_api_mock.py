"""
TikTok API Mock für sofortige Testing und Demonstration
Simuliert echte TikTok API Responses für Daniel's ZZ-Lobby Elite System
"""

import json
import secrets
import time
from datetime import datetime
from typing import Dict, List

class TikTokAPIMock:
    """Mock TikTok API für realistische Testing"""
    
    def __init__(self):
        self.daniel_account = {
            "username": "daniel_zz_lobby_elite",
            "display_name": "Daniel Oettel | ZZ-Lobby Elite", 
            "bio": "🚀 Business Digitalisierung in Zeitz | Website-Entwicklung €497 | Social Media Automation €297/Monat",
            "follower_count": 1247,
            "following_count": 234,
            "video_count": 89,
            "verified": False,
            "business_account": True
        }
    
    def upload_video(self, video_url: str, caption: str, hashtags: List[str] = None) -> Dict:
        """Simulate TikTok video upload"""
        
        if not hashtags:
            hashtags = ["#businessautomation", "#websiteentwicklung", "#zeitz", "#sachsenanhalt", "#digitalisierung"]
        
        # Simulate processing time
        time.sleep(0.5)
        
        # Generate realistic TikTok response
        video_id = f"tiktok_{secrets.token_urlsafe(12)}"
        share_url = f"https://vm.tiktok.com/{secrets.token_urlsafe(8)}"
        
        response = {
            "success": True,
            "video_id": video_id,
            "share_url": share_url,
            "status": "published",
            "caption": caption[:150],  # TikTok caption limit
            "hashtags": hashtags[:5],  # Max 5 hashtags for better reach
            "upload_time": datetime.now().isoformat(),
            "account": self.daniel_account["username"],
            "estimated_metrics": {
                "potential_views": secrets.randbelow(10000) + 2000,  # 2K-12K views
                "estimated_engagement": round(secrets.randbelow(500) + 100, 1),  # 100-600 likes
                "target_audience": "Business owners in Sachsen-Anhalt, age 25-45"
            },
            "monetization": {
                "eligible_for_creator_fund": True,
                "estimated_revenue_potential": f"€{secrets.randbelow(50) + 10}-{secrets.randbelow(200) + 100}",
                "lead_generation_score": secrets.randbelow(30) + 70  # 70-100% score
            }
        }
        
        return response
    
    def get_video_analytics(self, video_id: str) -> Dict:
        """Get analytics for uploaded video"""
        return {
            "video_id": video_id,
            "views": secrets.randbelow(5000) + 1000,
            "likes": secrets.randbelow(300) + 50, 
            "shares": secrets.randbelow(50) + 10,
            "comments": secrets.randbelow(25) + 5,
            "profile_visits": secrets.randbelow(100) + 20,
            "website_clicks": secrets.randbelow(15) + 3,  # Important for Daniel's business
            "audience_demographics": {
                "top_cities": ["Leipzig", "Halle", "Zeitz", "Naumburg", "Weißenfels"],
                "age_groups": {"25-34": 45, "35-44": 30, "18-24": 25},
                "interests": ["Business", "Entrepreneurship", "Technology", "Local Services"]
            }
        }
    
    def get_trending_hashtags(self, category: str = "business") -> List[str]:
        """Get trending hashtags for Daniel's niche"""
        business_hashtags = [
            "#websiteentwicklung", "#businessautomation", "#digitalisierung",
            "#sachsenanhalt", "#zeitz", "#kleinunternehmen", "#startup",
            "#marketing", "#socialmedia", "#entrepreneur", "#business2024",
            "#paypalintegration", "#onlinebusiness", "#webdesign", "#automation"
        ]
        
        # Return 10 random trending hashtags
        return secrets.SystemRandom().sample(business_hashtags, 10)
    
    def schedule_video(self, video_url: str, caption: str, schedule_time: str) -> Dict:
        """Schedule video for future posting"""
        return {
            "success": True,
            "scheduled_id": f"scheduled_{secrets.token_urlsafe(8)}",
            "schedule_time": schedule_time,
            "status": "scheduled",
            "caption": caption,
            "estimated_optimal_time": "09:00 UTC (peak business audience activity)"
        }

# Initialize mock API
tiktok_api_mock = TikTokAPIMock()