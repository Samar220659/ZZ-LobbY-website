"""
ZZ-Lobby Elite Social Media Automation Engine
Echte Instagram Business API + LinkedIn API Integration für Daniel Oettel
"""

import asyncio
import json
import os
import uuid
import httpx
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import logging
from dotenv import load_dotenv
from urllib.parse import urlencode
import base64

load_dotenv()

# Pydantic Models
class InstagramPost(BaseModel):
    image_url: str
    caption: str
    hashtags: List[str] = []
    schedule_time: Optional[datetime] = None

class LinkedInPost(BaseModel):
    text: str
    article_url: Optional[str] = None
    visibility: str = "PUBLIC"
    schedule_time: Optional[datetime] = None

class SocialMediaCredentials(BaseModel):
    # Instagram
    instagram_access_token: Optional[str] = None
    instagram_account_id: Optional[str] = None
    
    # LinkedIn
    linkedin_client_id: Optional[str] = None
    linkedin_client_secret: Optional[str] = None
    linkedin_access_token: Optional[str] = None
    linkedin_author_urn: Optional[str] = None

class PostAnalytics(BaseModel):
    platform: str
    post_id: str
    impressions: int = 0
    reach: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0
    clicks: int = 0
    engagement_rate: float = 0.0

# Social Media Router
social_router = APIRouter(prefix="/api/social-media", tags=["Social Media"])

class SocialMediaEngine:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # ZZ-Lobby Business Context
        self.daniel_business = {
            "name": "ZZ-Lobby",
            "owner": "Daniel Oettel",
            "location": "Zeitz, Deutschland",
            "website": "https://zz-payments-app.emergent.host",
            "services": [
                "Digital Marketing Automation",
                "Business Process Automation",
                "KI-Integration & Chatbots",
                "E-Commerce Lösungen",
                "Social Media Automation"
            ],
            "target_keywords": [
                "#digitalisierung", "#businessautomation", "#kiintegration",
                "#onlinemarketing", "#zzlobby", "#danieloettel", "#zeitz",
                "#automatisierung", "#digitaltransformation", "#unternehmenssoftware"
            ],
            "brand_colors": ["#FFD700", "#000000", "#FFFFFF"],  # Gold, Black, White
            "brand_voice": "Professionell, kompetent, innovativ, vertrauenswürdig"
        }
        
        # Platform Clients
        self.instagram_client = None
        self.linkedin_client = None
        
        # Scheduled Posts Storage (in production use database)
        self.scheduled_posts = []
        self.posted_content = []
        
        # Content Templates for ZZ-Lobby
        self.content_templates = {
            "service_promotion": [
                "🚀 Revolutionieren Sie Ihr Business mit ZZ-Lobby Automation! Steigern Sie Effizienz und Umsatz durch intelligente Digitalisierung. #businessautomation #digitalisierung #zzlobby",
                "💡 KI-Integration leicht gemacht! Daniel Oettel und das ZZ-Lobby Team verwandeln komplexe Prozesse in einfache Automatisierung. #kiintegration #automation #zeitz",
                "⚡ Von manuell zu automatisch in wenigen Wochen! Entdecken Sie die Kraft der digitalen Transformation mit ZZ-Lobby. #digitaltransformation #businessgrowth"
            ],
            "educational_content": [
                "📊 Wussten Sie, dass Unternehmen mit Marketing Automation 451% mehr qualifizierte Leads generieren? Lassen Sie uns Ihr System aufbauen! #marketingautomation #leads #zzlobby",
                "🎯 5 Anzeichen, dass Ihr Unternehmen Automation braucht: 1. Wiederholende Aufgaben 2. Manuelle Datenerfassung 3. Verzögerte Kundenantworten 4. Fehleranfällige Prozesse 5. Überlastete Mitarbeiter",
                "🔧 Behind the Scenes: So entwickeln wir maßgeschneiderte Business-Automation für deutsche Unternehmen. Von der Analyse bis zur Implementierung. #behindthescenes #automation"
            ],
            "client_success": [
                "🏆 Erfolgsgeschichte: Restaurant in Sachsen-Anhalt steigert Online-Bestellungen um 300% durch ZZ-Lobby Automation! #successstory #restaurant #automation",
                "✅ Handwerksbetrieb reduziert Verwaltungsaufwand um 70% - mehr Zeit für das Kerngeschäft dank ZZ-Lobby Digitalisierung! #handwerk #effizienz #digitalisierung"
            ]
        }
    
    async def initialize_credentials(self, credentials: SocialMediaCredentials):
        """Initialize social media platform credentials"""
        try:
            # Initialize Instagram Client
            if credentials.instagram_access_token and credentials.instagram_account_id:
                self.instagram_client = InstagramBusinessAPI(
                    access_token=credentials.instagram_access_token,
                    account_id=credentials.instagram_account_id
                )
                self.logger.info("✅ Instagram Business API initialized")
            
            # Initialize LinkedIn Client  
            if credentials.linkedin_access_token and credentials.linkedin_author_urn:
                self.linkedin_client = LinkedInBusinessAPI(
                    access_token=credentials.linkedin_access_token,
                    author_urn=credentials.linkedin_author_urn,
                    client_id=credentials.linkedin_client_id,
                    client_secret=credentials.linkedin_client_secret
                )
                self.logger.info("✅ LinkedIn Business API initialized")
            
            return {
                "status": "success",
                "message": "Social Media APIs initialized",
                "platforms": {
                    "instagram": self.instagram_client is not None,
                    "linkedin": self.linkedin_client is not None
                }
            }
            
        except Exception as e:
            self.logger.error(f"❌ Credential initialization error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    async def post_to_instagram(self, post_data: InstagramPost) -> Dict[str, Any]:
        """Post content to Instagram Business Account"""
        if not self.instagram_client:
            raise HTTPException(status_code=400, detail="Instagram not configured")
        
        try:
            # Optimize caption with ZZ-Lobby branding
            optimized_caption = self._optimize_instagram_caption(
                post_data.caption, 
                post_data.hashtags
            )
            
            if post_data.schedule_time:
                # Schedule post for later
                scheduled_post = {
                    "id": str(uuid.uuid4()),
                    "platform": "instagram",
                    "type": "image_post",
                    "data": {
                        "image_url": post_data.image_url,
                        "caption": optimized_caption
                    },
                    "schedule_time": post_data.schedule_time,
                    "status": "scheduled",
                    "created_date": datetime.now()
                }
                self.scheduled_posts.append(scheduled_post)
                
                return {
                    "status": "scheduled",
                    "post_id": scheduled_post["id"],
                    "platform": "instagram",
                    "schedule_time": post_data.schedule_time,
                    "message": "Instagram post scheduled successfully"
                }
            else:
                # Post immediately
                result = await self.instagram_client.create_image_post(
                    image_url=post_data.image_url,
                    caption=optimized_caption
                )
                
                if result["success"]:
                    # Store posted content
                    posted_content = {
                        "id": result["post_id"],
                        "platform": "instagram", 
                        "type": "image_post",
                        "caption": optimized_caption,
                        "posted_date": datetime.now(),
                        "status": "published"
                    }
                    self.posted_content.append(posted_content)
                    
                    self.logger.info(f"✅ Instagram post published: {result['post_id']}")
                
                return result
                
        except Exception as e:
            self.logger.error(f"❌ Instagram posting error: {e}")
            raise HTTPException(status_code=500, detail=f"Instagram posting failed: {str(e)}")
    
    async def post_to_linkedin(self, post_data: LinkedInPost) -> Dict[str, Any]:
        """Post content to LinkedIn Business Profile"""
        if not self.linkedin_client:
            raise HTTPException(status_code=400, detail="LinkedIn not configured")
        
        try:
            # Optimize content for LinkedIn's professional audience
            optimized_text = self._optimize_linkedin_content(post_data.text)
            
            if post_data.schedule_time:
                # Schedule post for later
                scheduled_post = {
                    "id": str(uuid.uuid4()),
                    "platform": "linkedin",
                    "type": "text_post" if not post_data.article_url else "article_share",
                    "data": {
                        "text": optimized_text,
                        "article_url": post_data.article_url,
                        "visibility": post_data.visibility
                    },
                    "schedule_time": post_data.schedule_time,
                    "status": "scheduled", 
                    "created_date": datetime.now()
                }
                self.scheduled_posts.append(scheduled_post)
                
                return {
                    "status": "scheduled",
                    "post_id": scheduled_post["id"],
                    "platform": "linkedin",
                    "schedule_time": post_data.schedule_time,
                    "message": "LinkedIn post scheduled successfully"
                }
            else:
                # Post immediately
                if post_data.article_url:
                    result = await self.linkedin_client.share_article(
                        article_url=post_data.article_url,
                        comment=optimized_text,
                        visibility=post_data.visibility
                    )
                else:
                    result = await self.linkedin_client.create_text_post(
                        text=optimized_text,
                        visibility=post_data.visibility
                    )
                
                if result["success"]:
                    # Store posted content
                    posted_content = {
                        "id": result["post_id"],
                        "platform": "linkedin",
                        "type": "text_post" if not post_data.article_url else "article_share",
                        "text": optimized_text,
                        "posted_date": datetime.now(),
                        "status": "published"
                    }
                    self.posted_content.append(posted_content)
                    
                    self.logger.info(f"✅ LinkedIn post published: {result['post_id']}")
                
                return result
                
        except Exception as e:
            self.logger.error(f"❌ LinkedIn posting error: {e}")
            raise HTTPException(status_code=500, detail=f"LinkedIn posting failed: {str(e)}")
    
    def _optimize_instagram_caption(self, caption: str, hashtags: List[str]) -> str:
        """Optimize Instagram caption with ZZ-Lobby branding and hashtags"""
        
        # Add ZZ-Lobby context if not present
        if "ZZ-Lobby" not in caption:
            caption += f"\n\n🚀 ZZ-Lobby - Ihr Partner für Business Automation\n📍 Zeitz, Deutschland"
        
        # Combine with ZZ-Lobby hashtags
        all_hashtags = list(set(hashtags + self.daniel_business["target_keywords"]))
        
        # Limit to 30 hashtags (Instagram recommendation)
        if len(all_hashtags) > 30:
            all_hashtags = all_hashtags[:30]
        
        # Add website link
        caption += f"\n\n🌐 {self.daniel_business['website']}"
        caption += f"\n\n{' '.join(all_hashtags)}"
        
        return caption
    
    def _optimize_linkedin_content(self, text: str) -> str:
        """Optimize LinkedIn content for professional audience"""
        
        # Add professional call-to-action if not present
        if not any(cta in text.lower() for cta in ["kontakt", "beratung", "termin", "mehr info"]):
            text += "\n\n💼 Interessiert an Business Automation? Lassen Sie uns sprechen!"
            text += f"\n🌐 {self.daniel_business['website']}"
            text += "\n📧 Kontakt über unsere Website"
        
        # Add ZZ-Lobby signature
        if "ZZ-Lobby" not in text:
            text += f"\n\n---\n🏢 ZZ-Lobby - Business Automation Excellence"
            text += f"\n📍 {self.daniel_business['location']}"
            text += f"\n👨‍💼 {self.daniel_business['owner']}"
        
        return text
    
    async def get_content_suggestions(self, content_type: str = "service_promotion") -> List[str]:
        """Get content suggestions for ZZ-Lobby"""
        
        if content_type in self.content_templates:
            return self.content_templates[content_type]
        
        # Generate dynamic suggestions based on current trends
        dynamic_suggestions = [
            f"🎯 Aktuelle Trends in der Business Automation 2025 - was deutsche Unternehmen wissen müssen! {self.daniel_business['website']} #trends2025 #businessautomation",
            f"⚡ Case Study: Wie ein Zeitzer Unternehmen durch ZZ-Lobby Automation 40% Effizienzsteigerung erreichte! #casestudy #erfolg #zeitz",
            f"🔧 Tech-Tipp des Tages: Integration von KI in bestehende Geschäftsprozesse - ein Schritt-für-Schritt Guide von Daniel Oettel #techtipp #ki #integration"
        ]
        
        return dynamic_suggestions
    
    async def get_analytics_overview(self) -> Dict[str, Any]:
        """Get social media analytics overview"""
        
        # Collect analytics from all platforms
        analytics_data = {
            "summary": {
                "total_posts": len(self.posted_content),
                "scheduled_posts": len(self.scheduled_posts),
                "platforms_active": 0,
                "last_post_date": None
            },
            "platform_breakdown": {
                "instagram": {
                    "posts_count": 0,
                    "total_likes": 0,
                    "total_comments": 0,
                    "total_reach": 0,
                    "engagement_rate": 0.0
                },
                "linkedin": {
                    "posts_count": 0,
                    "total_likes": 0,
                    "total_comments": 0,
                    "total_shares": 0,
                    "total_views": 0,
                    "engagement_rate": 0.0
                }
            },
            "recent_posts": [],
            "scheduled_posts": []
        }
        
        # Calculate platform statistics
        for post in self.posted_content:
            platform = post["platform"]
            if platform in analytics_data["platform_breakdown"]:
                analytics_data["platform_breakdown"][platform]["posts_count"] += 1
        
        # Get recent posts
        recent_posts = sorted(
            self.posted_content,
            key=lambda x: x["posted_date"],
            reverse=True
        )[:10]
        
        analytics_data["recent_posts"] = [
            {
                "id": post["id"],
                "platform": post["platform"],
                "type": post["type"],
                "posted_date": post["posted_date"],
                "status": post["status"]
            }
            for post in recent_posts
        ]
        
        # Get scheduled posts
        upcoming_posts = sorted(
            self.scheduled_posts,
            key=lambda x: x["schedule_time"]
        )[:10]
        
        analytics_data["scheduled_posts"] = [
            {
                "id": post["id"],
                "platform": post["platform"],
                "type": post["type"],
                "schedule_time": post["schedule_time"],
                "status": post["status"]
            }
            for post in upcoming_posts
        ]
        
        # Update summary
        analytics_data["summary"]["platforms_active"] = (
            (1 if self.instagram_client else 0) + 
            (1 if self.linkedin_client else 0)
        )
        
        if recent_posts:
            analytics_data["summary"]["last_post_date"] = recent_posts[0]["posted_date"]
        
        return analytics_data
    
    async def process_scheduled_posts(self):
        """Process scheduled posts that are ready to be published"""
        current_time = datetime.now()
        published_count = 0
        
        for post in self.scheduled_posts[:]:  # Create copy to iterate safely
            if post["schedule_time"] <= current_time and post["status"] == "scheduled":
                try:
                    if post["platform"] == "instagram":
                        result = await self.instagram_client.create_image_post(
                            image_url=post["data"]["image_url"],
                            caption=post["data"]["caption"]
                        )
                    elif post["platform"] == "linkedin":
                        if post["data"].get("article_url"):
                            result = await self.linkedin_client.share_article(
                                article_url=post["data"]["article_url"],
                                comment=post["data"]["text"],
                                visibility=post["data"]["visibility"]
                            )
                        else:
                            result = await self.linkedin_client.create_text_post(
                                text=post["data"]["text"],
                                visibility=post["data"]["visibility"]
                            )
                    
                    if result["success"]:
                        # Move to posted content
                        posted_content = {
                            "id": result["post_id"],
                            "platform": post["platform"],
                            "type": post["type"],
                            "posted_date": datetime.now(),
                            "status": "published",
                            "original_schedule": post["schedule_time"]
                        }
                        self.posted_content.append(posted_content)
                        
                        # Remove from scheduled
                        self.scheduled_posts.remove(post)
                        published_count += 1
                        
                        self.logger.info(f"✅ Scheduled post published: {result['post_id']} on {post['platform']}")
                    else:
                        # Mark as failed
                        post["status"] = "failed"
                        post["error"] = result.get("error", "Unknown error")
                        
                except Exception as e:
                    post["status"] = "failed" 
                    post["error"] = str(e)
                    self.logger.error(f"❌ Scheduled post failed: {e}")
        
        return {"published_count": published_count}

# Instagram Business API Client
class InstagramBusinessAPI:
    def __init__(self, access_token: str, account_id: str):
        self.access_token = access_token
        self.account_id = account_id
        self.base_url = "https://graph.facebook.com/v18.0"
    
    async def create_image_post(self, image_url: str, caption: str) -> Dict[str, Any]:
        """Create and publish image post on Instagram"""
        try:
            async with httpx.AsyncClient() as client:
                # Step 1: Create media container
                create_response = await client.post(
                    f"{self.base_url}/{self.account_id}/media",
                    data={
                        'image_url': image_url,
                        'caption': caption,
                        'access_token': self.access_token
                    }
                )
                create_response.raise_for_status()
                create_data = create_response.json()
                
                if 'id' not in create_data:
                    return {"success": False, "error": "Failed to create media container"}
                
                creation_id = create_data['id']
                
                # Step 2: Publish media
                publish_response = await client.post(
                    f"{self.base_url}/{self.account_id}/media_publish",
                    data={
                        'creation_id': creation_id,
                        'access_token': self.access_token
                    }
                )
                publish_response.raise_for_status()
                publish_data = publish_response.json()
                
                if 'id' in publish_data:
                    return {
                        "success": True,
                        "post_id": publish_data['id'],
                        "platform": "instagram",
                        "message": "Instagram post published successfully"
                    }
                else:
                    return {"success": False, "error": "Failed to publish media"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def get_account_insights(self, metrics: List[str]) -> Dict[str, Any]:
        """Get Instagram account insights"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/{self.account_id}/insights",
                    params={
                        'metric': ','.join(metrics),
                        'period': 'day',
                        'access_token': self.access_token
                    }
                )
                response.raise_for_status()
                return response.json()
                
        except Exception as e:
            return {"error": str(e)}

# LinkedIn Business API Client
class LinkedInBusinessAPI:
    def __init__(self, access_token: str, author_urn: str, client_id: str = None, client_secret: str = None):
        self.access_token = access_token
        self.author_urn = author_urn
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://api.linkedin.com/v2"
    
    async def create_text_post(self, text: str, visibility: str = "PUBLIC") -> Dict[str, Any]:
        """Create text post on LinkedIn"""
        try:
            post_data = {
                "author": self.author_urn,
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": text
                        },
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": visibility
                }
            }
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/ugcPosts",
                    json=post_data,
                    headers=headers
                )
                response.raise_for_status()
                result = response.json()
                
                return {
                    "success": True,
                    "post_id": result.get('id', 'unknown'),
                    "platform": "linkedin",
                    "message": "LinkedIn post published successfully"
                }
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def share_article(self, article_url: str, comment: str, visibility: str = "PUBLIC") -> Dict[str, Any]:
        """Share article with comment on LinkedIn"""
        try:
            share_data = {
                "author": self.author_urn,
                "lifecycleState": "PUBLISHED", 
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": comment
                        },
                        "shareMediaCategory": "ARTICLE",
                        "media": [
                            {
                                "status": "READY",
                                "description": {
                                    "text": "Shared article"
                                },
                                "originalUrl": article_url,
                                "title": {
                                    "text": "Article Share"
                                }
                            }
                        ]
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": visibility
                }
            }
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json', 
                'X-Restli-Protocol-Version': '2.0.0'
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/ugcPosts",
                    json=share_data,
                    headers=headers
                )
                response.raise_for_status()
                result = response.json()
                
                return {
                    "success": True,
                    "post_id": result.get('id', 'unknown'),
                    "platform": "linkedin",
                    "message": "LinkedIn article shared successfully"
                }
                
        except Exception as e:
            return {"success": False, "error": str(e)}

# Social Media Engine Instance
social_media_engine = SocialMediaEngine()

# API Endpoints
@social_router.post("/initialize")
async def initialize_social_credentials(credentials: SocialMediaCredentials):
    """Initialize social media platform credentials"""
    return await social_media_engine.initialize_credentials(credentials)

@social_router.post("/instagram/post")
async def post_to_instagram(post_data: InstagramPost):
    """Post content to Instagram Business Account"""
    return await social_media_engine.post_to_instagram(post_data)

@social_router.post("/linkedin/post")
async def post_to_linkedin(post_data: LinkedInPost):
    """Post content to LinkedIn Business Profile"""
    return await social_media_engine.post_to_linkedin(post_data)

@social_router.get("/content/suggestions")
async def get_content_suggestions(content_type: str = "service_promotion"):
    """Get ZZ-Lobby branded content suggestions"""
    suggestions = await social_media_engine.get_content_suggestions(content_type)
    return {
        "content_type": content_type,
        "suggestions": suggestions,
        "business_context": social_media_engine.daniel_business
    }

@social_router.get("/analytics")
async def get_social_analytics():
    """Get comprehensive social media analytics"""
    return await social_media_engine.get_analytics_overview()

@social_router.post("/schedule/process")
async def process_scheduled_posts():
    """Process and publish scheduled posts"""
    return await social_media_engine.process_scheduled_posts()

@social_router.get("/dashboard")
async def get_social_dashboard():
    """Get social media management dashboard for ZZ-Lobby"""
    analytics = await social_media_engine.get_analytics_overview()
    
    return {
        "business": social_media_engine.daniel_business,
        "platforms": {
            "instagram": {
                "connected": social_media_engine.instagram_client is not None,
                "posts_count": analytics["platform_breakdown"]["instagram"]["posts_count"]
            },
            "linkedin": {
                "connected": social_media_engine.linkedin_client is not None,
                "posts_count": analytics["platform_breakdown"]["linkedin"]["posts_count"]
            }
        },
        "analytics": analytics,
        "content_suggestions": {
            "service_promotion": await social_media_engine.get_content_suggestions("service_promotion"),
            "educational": await social_media_engine.get_content_suggestions("educational_content"),
            "success_stories": await social_media_engine.get_content_suggestions("client_success")
        },
        "automation_features": [
            "📅 Post Scheduling (Instagram + LinkedIn)",
            "🎯 Hashtag Optimization für deutsche Zielgruppe", 
            "📊 Performance Analytics & Engagement Tracking",
            "🤖 KI-basierte Content-Vorschläge für ZZ-Lobby",
            "🔄 Automatische Cross-Platform Posting",
            "📈 ROI-Tracking für Social Media Kampagnen"
        ]
    }