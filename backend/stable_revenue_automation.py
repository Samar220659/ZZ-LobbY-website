#!/usr/bin/env python3
"""
Stable Revenue Automation - Robuste Version ohne Schedule-Dependencies
"""

import time
import requests
import json
import logging
from datetime import datetime
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - STABLE_REVENUE - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/stable_revenue.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class StableRevenueAutomation:
    def __init__(self):
        self.api_base = "https://3dd1d4de-4dab-4256-a879-82933a5d321a.preview.emergentagent.com/api"
        self.daily_target = 1000.0
        self.running = True
        
    def get_stats(self) -> Dict[str, Any]:
        """Get current dashboard stats"""
        try:
            response = requests.get(f"{self.api_base}/dashboard/stats", timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'earnings': float(data.get('todayEarnings', '0').replace('€', '').replace(',', '.')),
                    'growth': data.get('todayGrowth', 0),
                    'leads': data.get('activeLeads', 0),
                    'conversion': data.get('conversionRate', 0)
                }
        except Exception as e:
            logger.error(f"Stats error: {e}")
        return {'earnings': 0, 'growth': 0, 'leads': 0, 'conversion': 0}
    
    def create_payment_offers(self):
        """Create fresh payment offers"""
        offers = [
            {"amount": 27.0, "description": "ZZ-Lobby STARTER - Business Automation Einführung"},
            {"amount": 47.0, "description": "ZZ-Lobby QUICK START - Sofort implementierbar"},
            {"amount": 97.0, "description": "ZZ-Lobby PRO - Komplette Automation Suite"},
            {"amount": 197.0, "description": "ZZ-Lobby ELITE - Premium Business Automatisierung"},
            {"amount": 297.0, "description": "ZZ-Lobby PREMIUM - Done-for-You Automation"},
            {"amount": 497.0, "description": "ZZ-Lobby VIP - Persönliche Transformation"},
            {"amount": 997.0, "description": "ZZ-Lobby PLATINUM - 1-on-1 Coaching + Automation"}
        ]
        
        created = 0
        for offer in offers:
            try:
                response = requests.post(
                    f"{self.api_base}/paypal/create-payment",
                    json=offer,
                    timeout=15
                )
                if response.status_code == 200:
                    created += 1
                    logger.info(f"✅ Created: €{offer['amount']} - {offer['description'][:30]}...")
            except Exception as e:
                logger.error(f"Payment creation error: {e}")
        
        logger.info(f"💰 {created} Payment offers created successfully")
        return created
    
    def activate_automations(self):
        """Activate all backend automations"""
        try:
            response = requests.get(f"{self.api_base}/automations", timeout=10)
            if response.status_code == 200:
                automations = response.json()
                
                activated = 0
                for automation in automations:
                    if not automation.get('active', False):
                        toggle_response = requests.put(
                            f"{self.api_base}/automations/{automation['id']}/toggle",
                            json={"active": True},
                            timeout=10
                        )
                        if toggle_response.status_code == 200:
                            activated += 1
                            logger.info(f"✅ Activated: {automation['name']}")
                
                logger.info(f"🚀 {activated} automations activated")
                return activated
        except Exception as e:
            logger.error(f"Automation activation error: {e}")
        return 0
    
    def run_revenue_cycle(self):
        """Single revenue optimization cycle"""
        logger.info("🔄 Starting revenue optimization cycle")
        
        # Get current stats
        stats = self.get_stats()
        target_percent = (stats['earnings'] / self.daily_target) * 100
        
        logger.info(f"💰 Current: €{stats['earnings']:.2f} / €{self.daily_target:.2f} ({target_percent:.1f}%)")
        logger.info(f"📊 Conversion: {stats['conversion']:.1f}% | Leads: {stats['leads']}")
        
        # Create payment offers
        self.create_payment_offers()
        
        # Activate automations
        self.activate_automations()
        
        # Emergency boost if needed
        if target_percent < 20:
            logger.warning("🚨 EMERGENCY BOOST ACTIVATED!")
            emergency_offers = [
                {"amount": 7.0, "description": "NOTFALL: Business Quickstart (95% RABATT!)"},
                {"amount": 17.0, "description": "KRISEN-DEAL: Automation Basics (90% RABATT!)"},
                {"amount": 37.0, "description": "SOS-PACKAGE: Sofort-Profit-System (85% RABATT!)"}
            ]
            for offer in emergency_offers:
                try:
                    requests.post(f"{self.api_base}/paypal/create-payment", json=offer, timeout=10)
                    logger.info(f"🚨 Emergency: €{offer['amount']} - {offer['description'][:30]}...")
                except:
                    pass
        
        logger.info("✅ Revenue cycle completed")
    
    def run_forever(self):
        """Main loop - runs continuously"""
        logger.info("🚀 STABLE REVENUE AUTOMATION STARTED - RUNNING 24/7")
        
        cycle_count = 0
        
        while self.running:
            try:
                cycle_count += 1
                logger.info(f"🔄 CYCLE #{cycle_count} - {datetime.now().strftime('%H:%M:%S')}")
                
                # Run revenue cycle
                self.run_revenue_cycle()
                
                # Wait 30 minutes between cycles
                logger.info("⏰ Waiting 30 minutes until next cycle...")
                time.sleep(1800)  # 30 minutes
                
            except KeyboardInterrupt:
                logger.info("⏹️ Revenue automation stopped by user")
                self.running = False
                break
            except Exception as e:
                logger.error(f"Cycle error: {e}")
                logger.info("⏰ Waiting 5 minutes before retry...")
                time.sleep(300)  # 5 minutes on error
        
        logger.info("🛑 Stable Revenue Automation terminated")

if __name__ == "__main__":
    automation = StableRevenueAutomation()
    automation.run_forever()