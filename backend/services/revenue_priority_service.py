import os
import asyncio
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import aiohttp
import logging
from .telegram_service import TelegramService

logger = logging.getLogger(__name__)

class RevenuePriorityService:
    """
    Revenue-First Payment System
    Automatically pays all API subscriptions from first customer revenue
    """
    
    def __init__(self):
        self.telegram_service = TelegramService()
        
        # Priority Payment Queue - erste Einnahmen zahlen diese Abos
        self.priority_payments = [
            {
                "service": "Claude AI Pro",
                "cost": 20.00,  # $20/month
                "api_provider": "anthropic",
                "renewal_url": "https://console.anthropic.com/settings/billing",
                "status": "pending"
            },
            {
                "service": "Ayrshare Pro", 
                "cost": 25.00,  # $25/month for unlimited posts
                "api_provider": "ayrshare",
                "renewal_url": "https://app.ayrshare.com/pricing",
                "status": "pending"
            },
            {
                "service": "Custom Domain Server",
                "cost": 15.00,  # Server costs
                "api_provider": "server",
                "renewal_url": "custom",
                "status": "pending"
            },
            {
                "service": "Klaviyo Email Pro",
                "cost": 30.00,  # Email marketing
                "api_provider": "klaviyo", 
                "renewal_url": "https://www.klaviyo.com/pricing",
                "status": "pending"
            },
            {
                "service": "PayPal Business",
                "cost": 0.00,  # Transaction fees only
                "api_provider": "paypal",
                "renewal_url": "paypal.com",
                "status": "pending"
            }
        ]
        
        # Minimum revenue threshold before personal payout
        self.api_costs_total = sum(payment["cost"] for payment in self.priority_payments)
        self.personal_payout_threshold = self.api_costs_total + 100  # API costs + €100 buffer
        
    async def process_revenue_priority(self, revenue_amount: float, source: str = "customer") -> Dict:
        """
        Process incoming revenue with API-priority system
        """
        try:
            logger.info(f"Processing revenue priority: €{revenue_amount} from {source}")
            
            result = {
                "revenue_received": revenue_amount,
                "api_payments_due": self.api_costs_total,
                "available_for_payout": 0.0,
                "payments_processed": [],
                "next_actions": []
            }
            
            # Check if this covers API costs
            if revenue_amount >= self.api_costs_total:
                # Sufficient revenue to cover API costs
                result["api_payments_covered"] = True
                result["available_for_payout"] = revenue_amount - self.api_costs_total
                
                # Mark all API payments as ready
                for payment in self.priority_payments:
                    if payment["status"] == "pending":
                        payment["status"] = "ready_to_pay"
                        result["payments_processed"].append({
                            "service": payment["service"],
                            "amount": payment["cost"],
                            "action": "Schedule payment"
                        })
                
                result["next_actions"].append("✅ All API subscriptions can be renewed")
                result["next_actions"].append(f"💰 €{result['available_for_payout']:.2f} available for personal payout")
                
                # Send success notification
                await self.telegram_service.send_notification(
                    f"🎉 REVENUE PRIORITY SUCCESS!\n\n"
                    f"💰 Revenue: €{revenue_amount}\n"
                    f"🔧 API Costs: €{self.api_costs_total}\n"
                    f"💵 Available: €{result['available_for_payout']:.2f}\n\n"
                    f"✅ All API subscriptions covered!\n"
                    f"Ready for automatic renewal."
                )
                
            else:
                # Partial coverage
                result["api_payments_covered"] = False
                result["remaining_needed"] = self.api_costs_total - revenue_amount
                
                result["next_actions"].append(f"⚠️ Need €{result['remaining_needed']:.2f} more for full API coverage")
                result["next_actions"].append("🔄 Waiting for additional revenue...")
                
                # Send partial notification
                await self.telegram_service.send_notification(
                    f"📊 REVENUE PRIORITY UPDATE\n\n"
                    f"💰 Revenue: €{revenue_amount}\n"
                    f"🔧 API Costs: €{self.api_costs_total}\n"
                    f"❌ Still need: €{result['remaining_needed']:.2f}\n\n"
                    f"🎯 Next customer will complete API funding!"
                )
            
            return result
            
        except Exception as e:
            logger.error(f"Error in revenue priority processing: {e}")
            return {"error": str(e)}
    
    async def get_priority_status(self) -> Dict:
        """
        Get current priority payment status
        """
        try:
            total_pending = sum(p["cost"] for p in self.priority_payments if p["status"] == "pending")
            total_ready = sum(p["cost"] for p in self.priority_payments if p["status"] == "ready_to_pay")
            
            status = {
                "total_api_costs": self.api_costs_total,
                "pending_payments": total_pending,
                "ready_payments": total_ready,
                "personal_payout_threshold": self.personal_payout_threshold,
                "priority_queue": self.priority_payments,
                "system_status": "waiting_for_revenue" if total_pending > 0 else "apis_funded"
            }
            
            return status
            
        except Exception as e:
            logger.error(f"Error getting priority status: {e}")
            return {"error": str(e)}
    
    async def get_payment_instructions(self) -> List[Dict]:
        """
        Get manual payment instructions for API renewals
        """
        instructions = []
        
        for payment in self.priority_payments:
            if payment["status"] == "ready_to_pay" and payment["cost"] > 0:
                instructions.append({
                    "service": payment["service"],
                    "amount": f"€{payment['cost']:.2f}",
                    "url": payment["renewal_url"],
                    "priority": "HIGH - Pay immediately",
                    "notes": f"API integration depends on this service"
                })
        
        return instructions
    
    async def simulate_ayrshare_limit_check(self) -> Dict:
        """
        Check if Ayrshare is approaching limit (20 calls)
        """
        try:
            # This would integrate with actual Ayrshare usage tracking
            usage_estimate = {
                "calls_used": 15,  # Simulated - would be real tracking
                "calls_remaining": 5,
                "limit_reached_soon": True,
                "upgrade_needed": True,
                "cost_to_upgrade": 25.00
            }
            
            if usage_estimate["calls_remaining"] <= 3:
                await self.telegram_service.send_notification(
                    f"⚠️ AYRSHARE LIMIT WARNING!\n\n"
                    f"📊 Calls used: {usage_estimate['calls_used']}/20\n"
                    f"🔄 Remaining: {usage_estimate['calls_remaining']}\n\n"
                    f"💰 Upgrade needed: €{usage_estimate['cost_to_upgrade']}\n"
                    f"🎯 Waiting for next customer revenue..."
                )
            
            return usage_estimate
            
        except Exception as e:
            logger.error(f"Error checking Ayrshare limits: {e}")
            return {"error": str(e)}

# Global instance
revenue_priority_service = RevenuePriorityService()