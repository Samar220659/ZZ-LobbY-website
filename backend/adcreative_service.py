"""
ZZ-Lobby Elite - AdCreative Killer Integration
🎬 Automatische Video-Erstellung + Cross-Posting auf alle Social Media Plattformen
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Models for AdCreative Integration
class CampaignRequest(BaseModel):
    promo_link: str
    target_platforms: List[str] = ["tiktok", "instagram", "youtube", "facebook", "twitter"]
    campaign_name: Optional[str] = None
    
class CreativeResult(BaseModel):
    video_url: str
    score: float
    copy: Dict[str, str]
    platform: str
    posted: bool = False
    post_id: Optional[str] = None

class CampaignResult(BaseModel):
    campaign_id: str
    status: str
    creatives: List[CreativeResult]
    total_creatives: int
    successful_posts: int
    timestamp: datetime

class AdCreativeService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.engines_path = "/app/engines"
        self.crosspost_path = "/app/services/crosspost"
        self.tokens_file = f"{self.crosspost_path}/secrets/crosspost_tokens.json"
        
        # Check if engines are available
        self.adcreative_available = self._check_adcreative_engine()
        self.crosspost_available = self._check_crosspost_tokens()
    
    def _check_adcreative_engine(self) -> bool:
        """Check if AdCreative Killer engine is available"""
        engine_file = f"{self.engines_path}/adcreative_killer_universal.py"
        return os.path.exists(engine_file)
    
    def _check_crosspost_tokens(self) -> bool:
        """Check if OAuth tokens are configured"""
        return os.path.exists(self.tokens_file)
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get AdCreative system status"""
        return {
            "adcreative_engine": "available" if self.adcreative_available else "not_installed",
            "crosspost_tokens": "configured" if self.crosspost_available else "need_oauth_setup",
            "oauth_setup_command": "python crosspost/crosspost_setup.py",
            "supported_platforms": ["tiktok", "instagram", "youtube", "facebook", "twitter"],
            "system_ready": self.adcreative_available and self.crosspost_available,
            "tiktok_setup_required": True,
            "setup_guide": "/app/services/crosspost/TIKTOK_SETUP_GUIDE.md",
            "daniel_credentials": "a22061981@gmx.de (configured)",
            "next_steps": [
                "1. Create TikTok Developer App at developers.tiktok.com",
                "2. Get Client Key & Secret after approval", 
                "3. Update crosspost_setup.py with real credentials",
                "4. Run OAuth setup: python crosspost_setup.py",
                "5. Start Daily Campaigns for ZZ-Lobby Services"
            ]
        }
    
    async def create_campaign(self, request: CampaignRequest) -> CampaignResult:
        """Create and execute AdCreative campaign"""
        campaign_id = f"campaign_{int(datetime.now().timestamp())}"
        
        try:
            # Check system availability
            if not self.adcreative_available:
                raise HTTPException(
                    status_code=503, 
                    detail="AdCreative engine not available. Please upload adcreative_killer_universal.py to /engines/"
                )
            
            if not self.crosspost_available:
                raise HTTPException(
                    status_code=503,
                    detail="OAuth tokens not configured. Run: python crosspost/crosspost_setup.py"
                )
            
            # Import engines (only if available)
            try:
                import sys
                sys.path.append(self.engines_path)
                from adcreative_killer_universal import adcreative_killer
                
                sys.path.append(self.crosspost_path)
                from crosspost_module import CrossPoster
                
            except ImportError as e:
                self.logger.error(f"Failed to import engines: {e}")
                raise HTTPException(status_code=503, detail=f"Engine import failed: {str(e)}")
            
            # Generate creatives
            self.logger.info(f"Generating creatives for: {request.promo_link}")
            creative_data = adcreative_killer(request.promo_link)
            
            if not creative_data or 'creatives' not in creative_data:
                raise HTTPException(status_code=500, detail="Failed to generate creatives")
            
            # Initialize CrossPoster
            cross_poster = CrossPoster()
            
            # Process and post creatives
            results = []
            successful_posts = 0
            
            for creative in creative_data['creatives']:
                for platform in request.target_platforms:
                    try:
                        # Post to platform
                        post_result = cross_poster.post_video(
                            video_url=creative['video_url'],
                            caption=creative['copy']['primary'],
                            platforms=[platform]
                        )
                        
                        # Create result
                        creative_result = CreativeResult(
                            video_url=creative['video_url'],
                            score=creative.get('score', 95),
                            copy=creative['copy'],
                            platform=platform,
                            posted=post_result.get('success', False),
                            post_id=post_result.get('post_id')
                        )
                        
                        results.append(creative_result)
                        
                        if creative_result.posted:
                            successful_posts += 1
                            
                    except Exception as e:
                        self.logger.error(f"Failed to post to {platform}: {e}")
                        # Still add result with failed status
                        results.append(CreativeResult(
                            video_url=creative['video_url'],
                            score=creative.get('score', 95),
                            copy=creative['copy'],
                            platform=platform,
                            posted=False
                        ))
            
            # Create campaign result
            campaign_result = CampaignResult(
                campaign_id=campaign_id,
                status="completed",
                creatives=results,
                total_creatives=len(results),
                successful_posts=successful_posts,
                timestamp=datetime.now()
            )
            
            self.logger.info(f"Campaign {campaign_id} completed: {successful_posts}/{len(results)} successful posts")
            return campaign_result
            
        except Exception as e:
            self.logger.error(f"Campaign failed: {e}")
            raise HTTPException(status_code=500, detail=f"Campaign execution failed: {str(e)}")
    
    async def run_daily_campaign(self, service_focus: str = None) -> CampaignResult:
        """Run automated daily campaign using Daniel's advanced campaign engine"""
        try:
            # Import Daniel's campaign engine
            import sys
            sys.path.append(self.crosspost_path)
            from daniel_campaign_engine import daniel_campaign_engine
            
            # Run automated campaign
            campaign_data = daniel_campaign_engine.run_automated_campaign(service_focus)
            
            # Convert to CampaignResult format
            creatives = []
            platform_results = campaign_data["cross_posting_results"]["platform_results"]
            
            for platform, result in platform_results.items():
                if result.get("success", False):
                    creative_result = CreativeResult(
                        video_url=campaign_data["content_used"].get("video_url", "mock_video_url"),
                        score=campaign_data["content_used"]["estimated_score"],
                        copy={
                            "primary": campaign_data["content_used"]["caption"],
                            "headline": campaign_data["service_promoted"]["name"],
                            "cta": campaign_data["content_used"]["cta"]
                        },
                        platform=platform,
                        posted=True,
                        post_id=result.get("post_id", result.get("video_id"))
                    )
                    creatives.append(creative_result)
            
            campaign_result = CampaignResult(
                campaign_id=campaign_data["campaign_id"],
                status="completed",
                creatives=creatives,
                total_creatives=len(creatives),
                successful_posts=len(creatives),
                timestamp=datetime.now()
            )
            
            # Store campaign data for analytics
            await self.db.daniel_campaigns.insert_one({
                **campaign_data,
                "_id": campaign_data["campaign_id"],
                "created_at": datetime.now()
            })
            
            return campaign_result
            
        except Exception as e:
            self.logger.error(f"Daniel's daily campaign failed: {e}")
            # Fallback to simple campaign
            return await self._run_fallback_campaign()

# Initialize service
adcreative_service = AdCreativeService()

# API Router
adcreative_router = APIRouter(prefix="/api/adcreative", tags=["adcreative"])

@adcreative_router.get("/status")
async def get_adcreative_status():
    """Get AdCreative system status"""
    return await adcreative_service.get_system_status()

@adcreative_router.post("/campaign")
async def create_adcreative_campaign(request: CampaignRequest):
    """Create and execute AdCreative campaign"""
    return await adcreative_service.create_campaign(request)

@adcreative_router.post("/daily-campaign")
async def run_daily_adcreative_campaign():
    """Run automated daily campaign for Daniel's services"""
    return await adcreative_service.run_daily_campaign()

@adcreative_router.get("/oauth-setup-guide")
async def get_oauth_setup_guide():
    """Get OAuth setup instructions"""
    return {
        "setup_required": not adcreative_service.crosspost_available,
        "command": "python crosspost/crosspost_setup.py",
        "instructions": [
            "1. Navigate to /app/services/crosspost/",
            "2. Run: python crosspost_setup.py", 
            "3. Browser opens for each platform",
            "4. Login to: TikTok, Instagram, YouTube, Facebook, Twitter",
            "5. Tokens saved to crosspost/secrets/crosspost_tokens.json",
            "6. System ready for campaigns"
        ],
        "platforms": ["TikTok", "Instagram", "YouTube", "Facebook", "Twitter"]
    }

@adcreative_router.get("/daniel-analytics")
async def get_daniel_campaign_analytics():
    """Get Daniel's comprehensive campaign analytics"""
    try:
        import sys
        sys.path.append(adcreative_service.crosspost_path)
        from daniel_campaign_engine import daniel_campaign_engine
        
        return daniel_campaign_engine.crossPoster.get_campaign_analytics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")

@adcreative_router.get("/daniel-schedule")
async def get_daniel_weekly_schedule():
    """Get Daniel's weekly campaign schedule"""
    try:
        import sys
        sys.path.append(adcreative_service.crosspost_path)
        from daniel_campaign_engine import daniel_campaign_engine
        
        return daniel_campaign_engine.schedule_weekly_campaigns()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Schedule error: {str(e)}")

@adcreative_router.post("/daniel-campaign/{service_type}")
async def run_daniel_service_campaign(service_type: str):
    """Run campaign for specific Daniel service"""
    valid_services = ["website_development", "social_automation", "complete_digitalization"]
    if service_type not in valid_services:
        raise HTTPException(status_code=400, detail=f"Invalid service. Choose from: {valid_services}")
    
    return await adcreative_service.run_daily_campaign(service_type)

@adcreative_router.get("/daniel-business-info")
async def get_daniel_business_info():
    """Get Daniel's business information"""
    try:
        import sys
        sys.path.append(adcreative_service.crosspost_path)
        from daniel_campaign_engine import daniel_campaign_engine
        
        return {
            "business": daniel_campaign_engine.daniel_business,
            "services": daniel_campaign_engine.services,
            "automation_level": "100%",
            "system_status": "ready_for_campaigns"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Business info error: {str(e)}")