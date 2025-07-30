#!/usr/bin/env python3
"""
Viral Content Agent - Automatische Viral-Content-Erstellung
ERSTELLT AUTOMATISCH VIRAL-CONTENT FÜR MAXIMUM REACH
"""

import time
import requests
import json
import logging
import random
from datetime import datetime
from typing import List, Dict

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - VIRAL_CONTENT_AGENT - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/viral_content.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ViralContentAgent:
    def __init__(self):
        self.system_url = "https://3dd1d4de-4dab-4256-a879-82933a5d321a.preview.emergentagent.com"
        self.running = True
        self.content_count = 0
        
        # Viral Content Templates
        self.viral_templates = {
            "tiktok": [
                {
                    "hook": "POV: Du hast ein System das Geld verdient während du schläfst",
                    "structure": "problem → solution → proof → cta",
                    "music_style": "trending_business",
                    "duration": "15-30s"
                },
                {
                    "hook": "Niemand spricht über diese AUTOMATION", 
                    "structure": "secret → reveal → results → urgency",
                    "music_style": "mysterious",
                    "duration": "30-60s"
                },
                {
                    "hook": "Von broke zu €1k/Tag in 30 Tagen",
                    "structure": "before → journey → after → how",
                    "music_style": "success_anthem",
                    "duration": "60s"
                }
            ],
            "youtube_shorts": [
                {
                    "title": "€500/Tag mit diesem automatischen System",
                    "structure": "attention → demonstration → results → subscribe",
                    "style": "screen_recording",
                    "duration": "60s"
                },
                {
                    "title": "Business Automation die funktioniert (Live Demo)",
                    "structure": "intro → demo → metrics → call_to_action", 
                    "style": "talking_head",
                    "duration": "45s"
                }
            ],
            "instagram_reels": [
                {
                    "concept": "Transformation Tuesday - From Manual to Automated",
                    "visual": "before_after_split",
                    "text_overlay": "intensive",
                    "music": "motivational"
                },
                {
                    "concept": "Behind the scenes: Building a €500/day system",
                    "visual": "time_lapse",
                    "text_overlay": "educational", 
                    "music": "tech_vibe"
                }
            ]
        }
        
        # Trending Hashtags Database
        self.trending_hashtags = {
            "business": [
                "#entrepreneurship", "#business", "#startup", "#hustle", "#mindset",
                "#success", "#motivation", "#businessowner", "#entrepreneur", "#goals"
            ],
            "automation": [
                "#automation", "#ai", "#technology", "#digitalmarketing", "#saas", 
                "#productivity", "#efficiency", "#innovation", "#tech", "#future"
            ],
            "income": [
                "#passiveincome", "#sidehustle", "#makemoneyonline", "#financialfreedom",
                "#wealth", "#investment", "#money", "#income", "#profit", "#revenue"
            ]
        }
        
    def generate_tiktok_script(self, template: Dict) -> Dict:
        """Generiere TikTok-Video-Script"""
        
        if template["structure"] == "problem → solution → proof → cta":
            script = f"""🎬 TikTok Script: "{template['hook']}"

SCENE 1 (0-5s):
👁️ HOOK: {template['hook']}
[Visual: Person sleeping, money notifications popping up]

SCENE 2 (5-15s):
💡 SOLUTION: "Hier ist mein ZZ-Lobby System:"
[Screen recording: Dashboard showing €247.83 earnings]
"✅ Vollautomatisch"
"✅ PayPal integriert" 
"✅ 18.7% Conversion"

SCENE 3 (15-25s):
📊 PROOF: "Live-Beweis:"
[Screen recording: Real-time stats, active leads: 89]
"89 Leads heute"
"€500+ täglich"

SCENE 4 (25-30s):  
🎯 CTA: "Link in Bio für Live-Demo!"
[Text overlay: {self.system_url}]

MUSIC: {template['music_style']} beat
EFFECTS: Quick cuts, zoom transitions
TEXT: Large, contrasting colors"""

        elif template["structure"] == "secret → reveal → results → urgency":
            script = f"""🎬 TikTok Script: "{template['hook']}"

SCENE 1 (0-8s):
🤫 SECRET: {template['hook']}
[Visual: Dramatic finger to lips, mysterious lighting]
"Ich verrate dir was Krasses..."

SCENE 2 (8-20s):
🔓 REVEAL: "Mein automatisches Business System:"
[Screen recording: System overview]
"5 Automations laufen 24/7"
"PayPal Integration"
"Mobile App"

SCENE 3 (20-40s):
💰 RESULTS: "Die Ergebnisse sprechen für sich:"
[Screenshots: €247 first day, 18.7% conversion]
"Tag 1: €247"
"Aktuell: €500+/Tag"
"0h Arbeit täglich"

SCENE 4 (40-45s):
⚡ URGENCY: "Nur noch wenige Plätze frei!"
[Text overlay: "Limited Access"]

CTA: Link in Bio! {self.system_url}

MUSIC: {template['music_style']}
EFFECTS: Dark → bright transition, urgency elements"""

        else:  # Default structure
            script = f"""🎬 TikTok Script: "{template['hook']}"

HOOK (0-5s): {template['hook']}
DEMO (5-20s): Live system demonstration
RESULTS (20-35s): €247 in 24h, 18.7% conversion
CTA (35-40s): Link in bio: {self.system_url}"""

        return {
            "platform": "tiktok",
            "hook": template["hook"],
            "script": script,
            "duration": template["duration"],
            "music": template["music_style"],
            "hashtags": self._generate_hashtags(["business", "income"])
        }
    
    def generate_youtube_short_script(self, template: Dict) -> Dict:
        """Generiere YouTube Shorts Script"""
        
        script = f"""🎬 YouTube Short: "{template['title']}"

INTRO (0-5s):
👋 "Hey! Ich zeige dir heute mein €500/Tag System"
[Visual: Enthusiastic greeting, system preview]

DEMONSTRATION (5-35s):
📱 Live System Demo:
[Screen recording of dashboard]
"Hier siehst du meine Live-Daten:"
"✅ €247.83 heute verdient"
"✅ 89 aktive Leads"
"✅ 18.7% Conversion Rate"
"✅ Komplett automatisch"

[Quick demo of payment creation]
"So erstelle ich ein €97 Payment..."
[Show QR code generation]

RESULTS (35-50s):
📊 "Die Zahlen lügen nicht:"
"In den ersten 24h: €247"
"Durchschnitt: €500+/Tag" 
"Zeit-Investment: 0 Stunden"

CTA (50-60s):
🎯 "Link in der Beschreibung für Live-Demo!"
"Abo nicht vergessen! 👍"
[Text overlay: {self.system_url}]

STYLE: {template['style']}
MUSIC: Upbeat tech/business music
EFFECTS: Quick cuts, zoom-ins on important data"""

        return {
            "platform": "youtube",
            "title": template["title"],
            "script": script,
            "style": template["style"],
            "duration": template["duration"],
            "hashtags": self._generate_hashtags(["business", "automation", "income"])
        }
    
    def generate_instagram_reel_concept(self, template: Dict) -> Dict:
        """Generiere Instagram Reel Konzept"""
        
        concept = f"""🎬 Instagram Reel: "{template['concept']}"

VISUAL STYLE: {template['visual']}
MUSIC: {template['music']}
TEXT OVERLAY: {template['text_overlay']}

CONTENT BREAKDOWN:

OPENING (0-3s):
🎯 Hook: "{template['concept']}"
[Visual setup based on {template['visual']} style]

MAIN CONTENT (3-12s):
📱 System Demonstration:
"Mein ZZ-Lobby System arbeitet 24/7"
[Show dashboard, payments, automation]

PROOF POINTS (12-20s):
💰 Results Display:
"€247 in 24h"
"18.7% Conversion"
"89 Leads generiert"

CTA (20-25s):
🔗 "Link in Bio für Demo!"
"Save this für später 💾"

HASHTAGS: {self._generate_hashtags(['business', 'automation', 'income'])}
MUSIC: {template['music']} (trending audio)
TEXT: Bold, readable, animated"""

        return {
            "platform": "instagram",
            "concept": template["concept"],
            "visual_style": template["visual"],
            "content": concept,
            "music": template["music"],
            "hashtags": self._generate_hashtags(["business", "automation", "income"])
        }
    
    def _generate_hashtags(self, categories: List[str]) -> List[str]:
        """Generiere trending Hashtags basierend auf Kategorien"""
        
        all_hashtags = []
        for category in categories:
            if category in self.trending_hashtags:
                # Take 3-4 random hashtags from each category
                selected = random.sample(
                    self.trending_hashtags[category], 
                    min(4, len(self.trending_hashtags[category]))
                )
                all_hashtags.extend(selected)
        
        # Add ZZ-Lobby specific hashtags
        all_hashtags.extend(["#zzlobby", "#businessautomation", "#automaticmoney"])
        
        return all_hashtags[:15]  # Max 15 hashtags
    
    def generate_viral_content_batch(self) -> Dict:
        """Generiere einen kompletten Batch viral Content"""
        
        self.content_count += 1
        logger.info(f"🎬 VIRAL CONTENT BATCH #{self.content_count} GENERATION STARTED")
        
        content_batch = {
            "tiktok_videos": [],
            "youtube_shorts": [],
            "instagram_reels": [],
            "batch_id": f"viral_batch_{self.content_count}",
            "created_at": datetime.now().isoformat()
        }
        
        # Generate TikTok content (2-3 videos)
        tiktok_templates = random.sample(self.viral_templates["tiktok"], 2)
        for template in tiktok_templates:
            tiktok_script = self.generate_tiktok_script(template)
            content_batch["tiktok_videos"].append(tiktok_script)
            logger.info(f"🎵 TIKTOK: {template['hook'][:30]}...")
        
        # Generate YouTube Shorts (1-2 videos)
        youtube_templates = random.sample(self.viral_templates["youtube_shorts"], 1)
        for template in youtube_templates:
            youtube_script = self.generate_youtube_short_script(template)
            content_batch["youtube_shorts"].append(youtube_script)
            logger.info(f"📺 YOUTUBE: {template['title'][:30]}...")
        
        # Generate Instagram Reels (2-3 reels)
        instagram_templates = random.sample(self.viral_templates["instagram_reels"], 2)
        for template in instagram_templates:
            instagram_concept = self.generate_instagram_reel_concept(template)
            content_batch["instagram_reels"].append(instagram_concept)
            logger.info(f"📸 INSTAGRAM: {template['concept'][:30]}...")
        
        logger.info(f"✅ VIRAL CONTENT BATCH #{self.content_count} COMPLETED")
        logger.info(f"├── TikTok Videos: {len(content_batch['tiktok_videos'])}")
        logger.info(f"├── YouTube Shorts: {len(content_batch['youtube_shorts'])}")
        logger.info(f"└── Instagram Reels: {len(content_batch['instagram_reels'])}")
        
        return content_batch
    
    def simulate_viral_performance(self, content_batch: Dict) -> Dict:
        """Simuliere Viral-Performance des Contents"""
        
        performance_metrics = {
            "tiktok": [],
            "youtube": [],
            "instagram": [],
            "total_reach": 0,
            "total_engagement": 0,
            "total_clicks": 0
        }
        
        # TikTok Performance
        for video in content_batch["tiktok_videos"]:
            views = random.randint(5000, 50000)
            likes = int(views * random.uniform(0.05, 0.15))  # 5-15% like rate
            shares = int(views * random.uniform(0.01, 0.05))  # 1-5% share rate
            clicks = int(views * random.uniform(0.02, 0.06))  # 2-6% click rate
            
            performance_metrics["tiktok"].append({
                "hook": video["hook"][:30],
                "views": views,
                "likes": likes,
                "shares": shares,
                "clicks": clicks
            })
            
            performance_metrics["total_reach"] += views
            performance_metrics["total_engagement"] += likes + shares
            performance_metrics["total_clicks"] += clicks
            
            logger.info(f"🎵 {video['hook'][:20]}...: {views:,} views, {likes} likes, {clicks} clicks")
        
        # YouTube Performance
        for video in content_batch["youtube_shorts"]:
            views = random.randint(2000, 20000)
            likes = int(views * random.uniform(0.03, 0.08))
            comments = int(views * random.uniform(0.01, 0.03))
            clicks = int(views * random.uniform(0.03, 0.08))
            
            performance_metrics["youtube"].append({
                "title": video["title"][:30],
                "views": views,
                "likes": likes,
                "comments": comments,
                "clicks": clicks
            })
            
            performance_metrics["total_reach"] += views
            performance_metrics["total_engagement"] += likes + comments
            performance_metrics["total_clicks"] += clicks
            
            logger.info(f"📺 {video['title'][:20]}...: {views:,} views, {likes} likes, {clicks} clicks")
        
        # Instagram Performance
        for reel in content_batch["instagram_reels"]:
            views = random.randint(3000, 25000)
            likes = int(views * random.uniform(0.06, 0.12))
            comments = int(views * random.uniform(0.01, 0.03))
            bio_clicks = int(views * random.uniform(0.02, 0.05))
            
            performance_metrics["instagram"].append({
                "concept": reel["concept"][:30],
                "views": views,
                "likes": likes,
                "comments": comments,
                "bio_clicks": bio_clicks
            })
            
            performance_metrics["total_reach"] += views
            performance_metrics["total_engagement"] += likes + comments
            performance_metrics["total_clicks"] += bio_clicks
            
            logger.info(f"📸 {reel['concept'][:20]}...: {views:,} views, {likes} likes, {bio_clicks} bio clicks")
        
        logger.info(f"🚀 VIRAL PERFORMANCE SUMMARY:")
        logger.info(f"├── Total Reach: {performance_metrics['total_reach']:,}")
        logger.info(f"├── Total Engagement: {performance_metrics['total_engagement']:,}")
        logger.info(f"├── Total Clicks: {performance_metrics['total_clicks']}")
        logger.info(f"└── Avg Engagement Rate: {(performance_metrics['total_engagement']/performance_metrics['total_reach'])*100:.2f}%")
        
        return performance_metrics
    
    def calculate_viral_roi(self, performance_metrics: Dict) -> Dict:
        """Berechne ROI der Viral-Content-Strategie"""
        
        total_clicks = performance_metrics["total_clicks"]
        conversion_rate = 0.187  # 18.7%
        avg_order_value = 150   # €150
        
        estimated_conversions = int(total_clicks * conversion_rate)
        estimated_revenue = estimated_conversions * avg_order_value
        
        # Content creation cost (time investment)
        content_creation_hours = 6  # 6 hours for full batch
        hourly_rate = 50  # €50/hour
        total_cost = content_creation_hours * hourly_rate
        
        roi = ((estimated_revenue - total_cost) / total_cost) * 100
        
        logger.info(f"💰 VIRAL CONTENT ROI ANALYSIS:")
        logger.info(f"├── Total Video Clicks: {total_clicks}")
        logger.info(f"├── Estimated Conversions: {estimated_conversions}")
        logger.info(f"├── Estimated Revenue: €{estimated_revenue:,}")
        logger.info(f"├── Content Creation Cost: €{total_cost}")
        logger.info(f"├── Profit: €{estimated_revenue - total_cost:,}")
        logger.info(f"└── ROI: {roi:.1f}%")
        
        return {
            "total_clicks": total_clicks,
            "estimated_conversions": estimated_conversions,
            "estimated_revenue": estimated_revenue,
            "content_cost": total_cost,
            "profit": estimated_revenue - total_cost,
            "roi": roi
        }
    
    def run_viral_content_cycle(self):
        """Vollständiger Viral Content Creation Cycle"""
        logger.info(f"🎯 STARTING VIRAL CONTENT CREATION CYCLE")
        
        # Generate content batch
        content_batch = self.generate_viral_content_batch()
        
        # Simulate viral performance
        performance_metrics = self.simulate_viral_performance(content_batch)
        
        # Calculate ROI
        roi_analysis = self.calculate_viral_roi(performance_metrics)
        
        logger.info(f"✅ VIRAL CONTENT CYCLE COMPLETED:")
        logger.info(f"├── Content Pieces Created: {len(content_batch['tiktok_videos']) + len(content_batch['youtube_shorts']) + len(content_batch['instagram_reels'])}")
        logger.info(f"├── Total Potential Reach: {performance_metrics['total_reach']:,}")
        logger.info(f"├── Estimated Revenue: €{roi_analysis['estimated_revenue']:,}")
        logger.info(f"└── ROI: {roi_analysis['roi']:.1f}%")
        
        return {
            "content_batch": content_batch,
            "performance_metrics": performance_metrics,
            "roi_analysis": roi_analysis
        }
    
    def run_forever(self):
        """Viral Content Agent - läuft kontinuierlich"""
        logger.info("🎬 VIRAL CONTENT AGENT STARTED - RUNNING 24/7")
        
        while self.running:
            try:
                current_time = datetime.now().strftime('%H:%M:%S')
                logger.info(f"🚀 VIRAL CONTENT CREATION BLITZ - {current_time}")
                
                # Run viral content cycle
                results = self.run_viral_content_cycle()
                
                logger.info("⏰ Waiting 8 hours until next content batch creation...")
                time.sleep(28800)  # 8 hours between content creation cycles
                
            except KeyboardInterrupt:
                logger.info("⏹️ Viral Content Agent stopped by user")
                self.running = False
                break
            except Exception as e:
                logger.error(f"Viral content creation error: {e}")
                logger.info("⏰ Waiting 2 hours before retry...")
                time.sleep(7200)  # 2 hours on error
        
        logger.info("🛑 Viral Content Agent terminated")

if __name__ == "__main__":
    agent = ViralContentAgent()
    agent.run_forever()