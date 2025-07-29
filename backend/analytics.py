#!/usr/bin/env python3
"""
ZZ-Lobby Elite - Advanced Analytics System
Verfolgt alle Performance-Metriken für Revenue-Maximierung
"""
import asyncio
import aiohttp
import json
import os
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Tuple
from collections import defaultdict
import uuid

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdvancedAnalytics:
    def __init__(self):
        self.analytics_data = {
            "daily_stats": {},
            "conversion_funnel": {},
            "traffic_sources": {},
            "user_behavior": {},
            "revenue_tracking": {},
            "campaign_performance": {}
        }
        
        # Performance Targets
        self.targets = {
            "daily_revenue": 500.0,
            "conversion_rate": 5.0,
            "monthly_revenue": 15000.0,
            "customer_ltv": 150.0
        }
        
        # Live Tracking
        self.live_sessions = {}
        self.real_time_events = []
        
    async def track_visitor(self, visitor_data: Dict) -> str:
        """Verfolgt neuen Website-Besucher"""
        visitor_id = str(uuid.uuid4())
        
        visitor_info = {
            "id": visitor_id,
            "ip": visitor_data.get("ip", "unknown"),
            "user_agent": visitor_data.get("user_agent", "unknown"),
            "referrer": visitor_data.get("referrer", "direct"),
            "landing_page": visitor_data.get("landing_page", "/"),
            "timestamp": datetime.utcnow().isoformat(),
            "session_start": datetime.utcnow(),
            "pages_viewed": [],
            "actions_taken": [],
            "conversion_score": 0
        }
        
        self.live_sessions[visitor_id] = visitor_info
        
        # Analysiere Traffic Source
        await self._analyze_traffic_source(visitor_info)
        
        logger.info(f"👤 Neuer Besucher: {visitor_id} von {visitor_info['referrer']}")
        return visitor_id
    
    async def track_page_view(self, visitor_id: str, page: str, time_spent: int = 0):
        """Verfolgt Seitenaufrufe"""
        if visitor_id not in self.live_sessions:
            return
        
        session = self.live_sessions[visitor_id]
        
        page_view = {
            "page": page,
            "timestamp": datetime.utcnow().isoformat(),
            "time_spent": time_spent
        }
        
        session["pages_viewed"].append(page_view)
        
        # Conversion Score erhöhen basierend auf wichtigen Seiten
        if page == "/products":
            session["conversion_score"] += 20
        elif page == "/checkout":
            session["conversion_score"] += 50
        elif "pricing" in page:
            session["conversion_score"] += 30
        
        logger.info(f"📄 Page View: {visitor_id} -> {page} (Score: {session['conversion_score']})")
    
    async def track_action(self, visitor_id: str, action: str, data: Dict = None):
        """Verfolgt Benutzeraktionen"""
        if visitor_id not in self.live_sessions:
            return
        
        session = self.live_sessions[visitor_id]
        
        action_data = {
            "action": action,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data or {}
        }
        
        session["actions_taken"].append(action_data)
        
        # Conversion Score basierend auf Aktionen
        action_scores = {
            "video_watched": 25,
            "email_signup": 40,
            "product_viewed": 15,
            "add_to_cart": 60,
            "purchase_started": 80,
            "purchase_completed": 100
        }
        
        session["conversion_score"] += action_scores.get(action, 5)
        
        # Real-time Event für Dashboard
        self.real_time_events.append({
            "visitor_id": visitor_id,
            "action": action,
            "timestamp": datetime.utcnow().isoformat(),
            "conversion_score": session["conversion_score"]
        })
        
        # Nur letzte 100 Events behalten
        if len(self.real_time_events) > 100:
            self.real_time_events = self.real_time_events[-100:]
        
        logger.info(f"⚡ Action: {visitor_id} -> {action} (Score: {session['conversion_score']})")
    
    async def track_conversion(self, visitor_id: str, order_data: Dict):
        """Verfolgt Conversion/Verkauf"""
        if visitor_id not in self.live_sessions:
            return
        
        session = self.live_sessions[visitor_id]
        conversion_data = {
            "order_id": order_data.get("order_id"),
            "product_id": order_data.get("product_id"),
            "amount": order_data.get("amount", 0),
            "conversion_time": datetime.utcnow().isoformat(),
            "session_duration": (datetime.utcnow() - session["session_start"]).total_seconds(),
            "pages_before_conversion": len(session["pages_viewed"]),
            "actions_before_conversion": len(session["actions_taken"]),
            "traffic_source": session["referrer"]
        }
        
        # Zu Revenue Tracking hinzufügen
        today = datetime.utcnow().strftime('%Y-%m-%d')
        if today not in self.analytics_data["revenue_tracking"]:
            self.analytics_data["revenue_tracking"][today] = {
                "total_revenue": 0,
                "total_orders": 0,
                "average_order_value": 0,
                "conversions_by_source": defaultdict(int),
                "conversions_by_product": defaultdict(int)
            }
        
        daily_stats = self.analytics_data["revenue_tracking"][today]
        daily_stats["total_revenue"] += conversion_data["amount"]
        daily_stats["total_orders"] += 1
        daily_stats["average_order_value"] = daily_stats["total_revenue"] / daily_stats["total_orders"]
        daily_stats["conversions_by_source"][session["referrer"]] += 1
        daily_stats["conversions_by_product"][order_data.get("product_id", "unknown")] += 1
        
        logger.info(f"💰 CONVERSION: {visitor_id} -> €{conversion_data['amount']} ({order_data.get('product_id')})")
        
        return conversion_data
    
    async def _analyze_traffic_source(self, visitor_info: Dict):
        """Analysiert Traffic-Quelle für Optimierung"""
        referrer = visitor_info["referrer"]
        
        # Kategorisiere Traffic Sources
        if "tiktok" in referrer.lower():
            source_category = "tiktok"
        elif "instagram" in referrer.lower():
            source_category = "instagram"
        elif "google" in referrer.lower():
            source_category = "google_ads"
        elif "facebook" in referrer.lower():
            source_category = "facebook_ads"
        elif referrer == "direct":
            source_category = "direct"
        else:
            source_category = "other"
        
        # Traffic Source Statistics aktualisieren
        today = datetime.utcnow().strftime('%Y-%m-%d')
        if today not in self.analytics_data["traffic_sources"]:
            self.analytics_data["traffic_sources"][today] = defaultdict(int)
        
        self.analytics_data["traffic_sources"][today][source_category] += 1
    
    async def calculate_conversion_funnel(self) -> Dict:
        """Berechnet Conversion Funnel Statistiken"""
        funnel_data = {
            "visitors": len(self.live_sessions),
            "product_viewers": 0,
            "checkout_starters": 0,
            "purchasers": 0,
            "conversion_rates": {}
        }
        
        for session in self.live_sessions.values():
            # Zähle verschiedene Funnel-Stufen
            pages = [p["page"] for p in session["pages_viewed"]]
            actions = [a["action"] for a in session["actions_taken"]]
            
            if "/products" in pages or "product_viewed" in actions:
                funnel_data["product_viewers"] += 1
            
            if "/checkout" in pages or "purchase_started" in actions:
                funnel_data["checkout_starters"] += 1
            
            if "purchase_completed" in actions:
                funnel_data["purchasers"] += 1
        
        # Conversion Rates berechnen
        if funnel_data["visitors"] > 0:
            funnel_data["conversion_rates"]["visitor_to_product"] = (
                funnel_data["product_viewers"] / funnel_data["visitors"]
            ) * 100
            
            if funnel_data["product_viewers"] > 0:
                funnel_data["conversion_rates"]["product_to_checkout"] = (
                    funnel_data["checkout_starters"] / funnel_data["product_viewers"]
                ) * 100
            
            if funnel_data["checkout_starters"] > 0:
                funnel_data["conversion_rates"]["checkout_to_purchase"] = (
                    funnel_data["purchasers"] / funnel_data["checkout_starters"]
                ) * 100
            
            funnel_data["conversion_rates"]["overall"] = (
                funnel_data["purchasers"] / funnel_data["visitors"]
            ) * 100
        
        return funnel_data
    
    async def get_real_time_stats(self) -> Dict:
        """Holt Echtzeit-Statistiken für Dashboard"""
        today = datetime.utcnow().strftime('%Y-%m-%d')
        
        # Tagesstatistiken
        daily_revenue = 0
        daily_orders = 0
        if today in self.analytics_data["revenue_tracking"]:
            daily_stats = self.analytics_data["revenue_tracking"][today]
            daily_revenue = daily_stats["total_revenue"]
            daily_orders = daily_stats["total_orders"]
        
        # Aktive Sessions
        active_sessions = len([s for s in self.live_sessions.values() 
                             if (datetime.utcnow() - s["session_start"]).total_seconds() < 1800])  # 30 min
        
        # Conversion Funnel
        funnel = await self.calculate_conversion_funnel()
        
        # Top Traffic Sources heute
        traffic_today = self.analytics_data["traffic_sources"].get(today, {})
        
        stats = {
            "timestamp": datetime.utcnow().isoformat(),
            "daily_revenue": daily_revenue,
            "daily_target": self.targets["daily_revenue"],
            "daily_achievement": (daily_revenue / self.targets["daily_revenue"]) * 100,
            "daily_orders": daily_orders,
            "active_visitors": active_sessions,
            "conversion_rate": funnel["conversion_rates"].get("overall", 0),
            "conversion_target": self.targets["conversion_rate"],
            "traffic_sources": dict(traffic_today),
            "recent_events": self.real_time_events[-10:],  # Letzte 10 Events
            "funnel_stats": funnel
        }
        
        return stats
    
    async def get_performance_alerts(self) -> List[Dict]:
        """Generiert Performance-Alerts für kritische Metriken"""
        alerts = []
        stats = await self.get_real_time_stats()
        
        # Revenue Alert
        if stats["daily_achievement"] < 30:  # Unter 30% des Ziels
            alerts.append({
                "type": "critical",
                "category": "revenue",
                "message": f"🚨 Revenue kritisch niedrig: Nur €{stats['daily_revenue']:.0f} von €{stats['daily_target']} erreicht",
                "action": "Notfall-Protokoll aktivieren"
            })
        elif stats["daily_achievement"] < 60:
            alerts.append({
                "type": "warning",
                "category": "revenue",
                "message": f"⚠️ Revenue unter Erwartung: €{stats['daily_revenue']:.0f} von €{stats['daily_target']}",
                "action": "Marketing-Boost empfohlen"
            })
        
        # Conversion Rate Alert
        if stats["conversion_rate"] < 1.0:
            alerts.append({
                "type": "critical",
                "category": "conversion",
                "message": f"🚨 Conversion Rate kritisch: {stats['conversion_rate']:.1f}% (Ziel: {stats['conversion_target']}%)",
                "action": "Landing Page optimieren"
            })
        elif stats["conversion_rate"] < 3.0:
            alerts.append({
                "type": "warning", 
                "category": "conversion",
                "message": f"⚠️ Conversion Rate niedrig: {stats['conversion_rate']:.1f}%",
                "action": "A/B Tests starten"
            })
        
        # Traffic Alert
        if stats["active_visitors"] < 5:
            alerts.append({
                "type": "warning",
                "category": "traffic",
                "message": f"⚠️ Wenig Traffic: Nur {stats['active_visitors']} aktive Besucher",
                "action": "Social Media Boost aktivieren"
            })
        
        return alerts
    
    async def generate_optimization_recommendations(self) -> List[Dict]:
        """Generiert KI-basierte Optimierungsempfehlungen"""
        stats = await self.get_real_time_stats()
        recommendations = []
        
        # Traffic Source Optimization
        if stats["traffic_sources"]:
            best_source = max(stats["traffic_sources"].items(), key=lambda x: x[1])
            recommendations.append({
                "category": "traffic",
                "priority": "high",
                "title": f"Budget auf {best_source[0]} fokussieren",
                "description": f"{best_source[0]} generiert {best_source[1]} Besucher - Budget erhöhen!",
                "expected_impact": "+25% mehr Traffic"
            })
        
        # Conversion Optimization
        if stats["conversion_rate"] < self.targets["conversion_rate"]:
            recommendations.append({
                "category": "conversion",
                "priority": "critical",
                "title": "Urgency & Scarcity verstärken",
                "description": "Countdown-Timer und begrenzte Plätze prominenter anzeigen",
                "expected_impact": f"+{(self.targets['conversion_rate'] - stats['conversion_rate']):.1f}% Conversion Rate"
            })
        
        # Revenue Optimization
        if stats["daily_achievement"] < 80:
            recommendations.append({
                "category": "revenue",
                "priority": "high",
                "title": "Upsell-Sequenzen aktivieren",
                "description": "Automatische E-Mail-Sequenzen für höhere Order Values",
                "expected_impact": "+40% Average Order Value"
            })
        
        return recommendations
    
    async def export_analytics_report(self, date_range: int = 7) -> Dict:
        """Exportiert detaillierten Analytics-Report"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=date_range)
        
        report = {
            "report_period": {
                "start_date": start_date.strftime('%Y-%m-%d'),
                "end_date": end_date.strftime('%Y-%m-%d'),
                "days": date_range
            },
            "summary": {
                "total_revenue": 0,
                "total_orders": 0,
                "total_visitors": 0,
                "average_conversion_rate": 0,
                "average_order_value": 0
            },
            "daily_breakdown": {},
            "traffic_analysis": {},
            "product_performance": {},
            "recommendations": await self.generate_optimization_recommendations()
        }
        
        # Sammle Daten für Zeitraum
        for i in range(date_range):
            date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
            
            if date in self.analytics_data["revenue_tracking"]:
                daily_data = self.analytics_data["revenue_tracking"][date]
                report["summary"]["total_revenue"] += daily_data["total_revenue"]
                report["summary"]["total_orders"] += daily_data["total_orders"]
                report["daily_breakdown"][date] = daily_data
        
        # Berechnungen
        if report["summary"]["total_orders"] > 0:
            report["summary"]["average_order_value"] = (
                report["summary"]["total_revenue"] / report["summary"]["total_orders"]
            )
        
        logger.info(f"📊 Analytics Report generiert: {date_range} Tage, €{report['summary']['total_revenue']:.2f} Revenue")
        
        return report

# Global Analytics Instance
analytics_engine = AdvancedAnalytics()