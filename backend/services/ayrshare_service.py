import os
import asyncio
from typing import Dict, List, Optional
import aiohttp
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AyrshareService:
    """
    Ayrshare Social Media Automation Service
    Smart usage tracking for 20-call limit
    """
    
    def __init__(self):
        self.api_key = os.environ.get('AYRSHARE_API_KEY')
        self.base_url = "https://app.ayrshare.com/api"
        self.calls_used = 0
        self.call_limit = 20
        self.email_account = os.environ.get('AYRSHARE_EMAIL', 'dasdass9995')
        
        if not self.api_key:
            logger.warning("Ayrshare API key not found in environment variables")
    
    async def post_to_social_media(self, content: str, platforms: List[str] = None, media_urls: List[str] = None) -> Dict:
        """
        Post content to social media platforms via Ayrshare
        """
        try:
            if self.calls_used >= self.call_limit:
                return {
                    "success": False,
                    "error": "API call limit reached (20/20). Upgrade needed.",
                    "calls_remaining": 0,
                    "upgrade_cost": "€25/month"
                }
            
            if not platforms:
                platforms = ["instagram", "twitter", "tiktok"]
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            
            payload = {
                "post": content,
                "platforms": platforms
            }
            
            if media_urls:
                payload["mediaUrls"] = media_urls
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/post",
                    headers=headers,
                    json=payload
                ) as response:
                    
                    # Track API usage
                    self.calls_used += 1
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        success_result = {
                            "success": True,
                            "post_id": result.get("id", "unknown"),
                            "platforms_posted": platforms,
                            "content": content,
                            "calls_used": self.calls_used,
                            "calls_remaining": self.call_limit - self.calls_used,
                            "timestamp": datetime.now().isoformat()
                        }
                        
                        logger.info(f"Social media post successful: {self.calls_used}/{self.call_limit} calls used")
                        
                        # Warning if approaching limit
                        if self.calls_used >= 17:
                            success_result["warning"] = f"Only {self.call_limit - self.calls_used} calls remaining!"
                            success_result["upgrade_needed"] = True
                        
                        return success_result
                    else:
                        error_text = await response.text()
                        return {
                            "success": False,
                            "error": f"Ayrshare API error: {response.status} - {error_text}",
                            "calls_used": self.calls_used,
                            "calls_remaining": self.call_limit - self.calls_used
                        }
        
        except Exception as e:
            logger.error(f"Error posting to social media: {e}")
            return {
                "success": False,
                "error": str(e),
                "calls_used": self.calls_used,
                "calls_remaining": self.call_limit - self.calls_used
            }
    
    async def get_usage_stats(self) -> Dict:
        """
        Get current Ayrshare usage statistics
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/user",
                    headers=headers
                ) as response:
                    
                    if response.status == 200:
                        user_data = await response.json()
                        
                        return {
                            "account_email": self.email_account,
                            "calls_used": self.calls_used,
                            "calls_remaining": self.call_limit - self.calls_used,
                            "call_limit": self.call_limit,
                            "usage_percentage": (self.calls_used / self.call_limit) * 100,
                            "upgrade_recommended": self.calls_used >= 15,
                            "plan": "Free (20 calls)",
                            "upgrade_cost": "€25/month for unlimited",
                            "connected_accounts": user_data.get("profiles", [])
                        }
                    else:
                        return {
                            "error": f"Failed to get usage stats: {response.status}",
                            "calls_used": self.calls_used,
                            "calls_remaining": self.call_limit - self.calls_used
                        }
        
        except Exception as e:
            logger.error(f"Error getting usage stats: {e}")
            return {
                "error": str(e),
                "calls_used": self.calls_used,
                "calls_remaining": self.call_limit - self.calls_used
            }
    
    async def create_viral_content_campaign(self, product_name: str, price: float, target_audience: str) -> Dict:
        """
        Create viral content for HYPERSCHWARM system
        """
        try:
            viral_posts = [
                {
                    "content": f"💎 {product_name} - Der Game-Changer für €{price}! \n\n🚀 HYPERSCHWARM System aktiviert\n💰 Automatische Umsätze generieren\n🎯 {target_audience} wird das lieben!\n\n#ZZLobbyElite #HyperschwarmV3 #AutomatischEinkommen",
                    "platforms": ["instagram", "twitter"],
                    "campaign_type": "product_launch"
                },
                {
                    "content": f"🔥 BREAKING: {product_name} System LIVE!\n\n✅ 20+ AI Agents arbeiten für dich\n✅ 99.99% Automation Rate\n✅ Bereits €12.5k/Monat generiert\n\nNur €{price} - Limited Time!\n\n#EliteSystem #AIAutomation #PassiveIncome",
                    "platforms": ["tiktok", "instagram"],
                    "campaign_type": "social_proof"
                },
                {
                    "content": f"💡 Von Arbeitslos zum CEO in 30 Tagen?\n\n{product_name} macht es möglich:\n🎯 Automatische Lead-Generierung\n🎯 KI-gesteuerte Verkäufe\n🎯 PayPal Auto-Auszahlungen\n\nStarte heute für €{price}!\n\n#UnternehmerTraum #ZZLobby #Success",
                    "platforms": ["twitter", "instagram"],
                    "campaign_type": "transformation"
                }
            ]
            
            campaign_results = []
            
            for post in viral_posts:
                if self.calls_used >= self.call_limit:
                    campaign_results.append({
                        "skipped": True,
                        "reason": "API limit reached",
                        "content": post["content"][:50] + "..."
                    })
                    continue
                
                result = await self.post_to_social_media(
                    content=post["content"],
                    platforms=post["platforms"]
                )
                
                campaign_results.append({
                    **result,
                    "campaign_type": post["campaign_type"]
                })
                
                # Small delay between posts
                await asyncio.sleep(2)
            
            return {
                "campaign_success": True,
                "total_posts": len(viral_posts),
                "posts_created": len([r for r in campaign_results if r.get("success")]),
                "posts_skipped": len([r for r in campaign_results if r.get("skipped")]),
                "results": campaign_results,
                "calls_used": self.calls_used,
                "calls_remaining": self.call_limit - self.calls_used,
                "upgrade_needed": self.calls_used >= self.call_limit - 3
            }
        
        except Exception as e:
            logger.error(f"Error creating viral campaign: {e}")
            return {
                "campaign_success": False,
                "error": str(e),
                "calls_used": self.calls_used,
                "calls_remaining": self.call_limit - self.calls_used
            }
    
    async def get_connected_platforms(self) -> List[str]:
        """
        Get list of connected social media platforms
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/profiles",
                    headers=headers
                ) as response:
                    
                    if response.status == 200:
                        profiles = await response.json()
                        return [profile.get("platform", "unknown") for profile in profiles]
                    else:
                        return ["instagram", "twitter", "tiktok"]  # Default assumption
        
        except Exception as e:
            logger.error(f"Error getting connected platforms: {e}")
            return ["instagram", "twitter", "tiktok"]  # Default assumption

# Global instance
ayrshare_service = AyrshareService()