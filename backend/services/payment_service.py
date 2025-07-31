"""
ZZ-Lobby Elite Payment Service
Handles Stripe payments and payment transaction management
"""

import os
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import HTTPException
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from motor.motor_asyncio import AsyncIOMotorClient

class PaymentService:
    def __init__(self, mongo_db):
        self.db = mongo_db
        self.stripe_api_key = os.environ.get('STRIPE_API_KEY')
        if not self.stripe_api_key:
            raise ValueError("STRIPE_API_KEY not found in environment variables")
        
        # Fixed payment packages - SECURITY: Never accept amounts from frontend
        self.PAYMENT_PACKAGES = {
            "zzlobby_boost": {
                "name": "ZZ-Lobby Boost Premium",
                "amount": 49.0,  # 49€ as specified in the documentation
                "currency": "eur",
                "description": "Premium AI Video Marketing + Auto-Posting Service",
                "features": ["AI Video Generation", "Auto TikTok/Reels Posting", "Premium Analytics", "Social Media Automation"]
            },
            "basic_plan": {
                "name": "Basic Marketing Plan",
                "amount": 19.0,
                "currency": "eur", 
                "description": "Basic marketing automation tools",
                "features": ["Content Generation", "Basic Analytics"]
            },
            "pro_plan": {
                "name": "Pro Marketing Plan",
                "amount": 99.0,
                "currency": "eur",
                "description": "Complete marketing automation suite",
                "features": ["Everything in Basic", "AI Video Studio", "Advanced Analytics", "Priority Support"]
            }
        }
    
    def get_stripe_checkout(self, webhook_url: str) -> StripeCheckout:
        """Initialize Stripe checkout with webhook URL"""
        return StripeCheckout(api_key=self.stripe_api_key, webhook_url=webhook_url)
    
    async def create_payment_transaction(self, package_id: str, session_id: str, metadata: Dict[str, Any]) -> str:
        """Create payment transaction record in database"""
        try:
            if package_id not in self.PAYMENT_PACKAGES:
                raise HTTPException(status_code=400, detail=f"Invalid package ID: {package_id}")
            
            package = self.PAYMENT_PACKAGES[package_id]
            transaction_id = str(uuid.uuid4())
            
            transaction_data = {
                "transaction_id": transaction_id,
                "session_id": session_id,
                "package_id": package_id,
                "package_name": package["name"],
                "amount": package["amount"],
                "currency": package["currency"],
                "payment_status": "pending",
                "status": "initiated",
                "metadata": metadata,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            await self.db["payment_transactions"].insert_one(transaction_data)
            logging.info(f"Payment transaction created: {transaction_id}")
            return transaction_id
            
        except Exception as e:
            logging.error(f"Error creating payment transaction: {e}")
            raise HTTPException(status_code=500, detail="Failed to create payment transaction")
    
    async def update_payment_status(self, session_id: str, payment_status: str, status: str) -> bool:
        """Update payment transaction status - prevents duplicate processing"""
        try:
            # Check if payment is already processed
            existing = await self.db["payment_transactions"].find_one({"session_id": session_id})
            if not existing:
                logging.error(f"Payment transaction not found for session: {session_id}")
                return False
            
            # Prevent duplicate processing for successful payments
            if existing.get("payment_status") == "paid" and payment_status == "paid":
                logging.info(f"Payment already processed for session: {session_id}")
                return True
            
            # Update the transaction
            result = await self.db["payment_transactions"].update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "payment_status": payment_status,
                        "status": status,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                logging.info(f"Payment status updated for session {session_id}: {payment_status}")
                
                # Trigger post-payment processing for successful payments
                if payment_status == "paid" and existing.get("payment_status") != "paid":
                    await self._process_successful_payment(existing["package_id"], session_id)
                
                return True
            else:
                logging.warning(f"No payment transaction updated for session: {session_id}")
                return False
                
        except Exception as e:
            logging.error(f"Error updating payment status: {e}")
            return False
    
    async def _process_successful_payment(self, package_id: str, session_id: str):
        """Process successful payment - trigger automation workflows"""
        try:
            logging.info(f"Processing successful payment: {package_id} for session: {session_id}")
            
            # Here we'll integrate with ShareCreative Pro and other automation
            # For now, just log the successful payment
            
            if package_id == "zzlobby_boost":
                # Trigger AI Video Generation + Auto-Posting workflow
                await self._trigger_zzlobby_boost_workflow(session_id)
            
            # Store success event
            success_event = {
                "event_type": "payment_success",
                "package_id": package_id,
                "session_id": session_id,
                "timestamp": datetime.utcnow(),
                "status": "completed"
            }
            await self.db["payment_events"].insert_one(success_event)
            
        except Exception as e:
            logging.error(f"Error processing successful payment: {e}")
    
    async def _trigger_zzlobby_boost_workflow(self, session_id: str):
        """Trigger the 49€ ZZ-Lobby Boost workflow: AI Video + Auto-Posting"""
        try:
            # This will integrate with ShareCreative Pro API and auto-posting
            workflow_data = {
                "session_id": session_id,
                "workflow_type": "zzlobby_boost",
                "steps": [
                    {"step": "ai_video_generation", "status": "pending"},
                    {"step": "tiktok_posting", "status": "pending"},
                    {"step": "instagram_reels_posting", "status": "pending"}
                ],
                "created_at": datetime.utcnow(),
                "status": "initiated"
            }
            
            await self.db["automation_workflows"].insert_one(workflow_data)
            logging.info(f"ZZ-Lobby Boost workflow initiated for session: {session_id}")
            
        except Exception as e:
            logging.error(f"Error triggering ZZ-Lobby Boost workflow: {e}")
    
    def get_available_packages(self) -> Dict[str, Any]:
        """Get all available payment packages"""
        return self.PAYMENT_PACKAGES
    
    async def validate_and_apply_coupon(self, coupon_code: str, package_id: str) -> float:
        """Validate coupon code and return discount percentage"""
        try:
            # Explosive coupon codes with discounts
            explosive_coupons = {
                'BOOST50': 50.0,
                'ROCKET30': 30.0, 
                'PROFIT25': 25.0,
                'FIRE20': 20.0,
                'MEGA15': 15.0,
                'STRIPE10': 10.0,
                'EXPLOSION5': 5.0
            }
            
            coupon_code = coupon_code.upper().strip()
            
            if coupon_code in explosive_coupons:
                # Log coupon usage
                coupon_usage = {
                    "coupon_code": coupon_code,
                    "package_id": package_id,
                    "discount_percent": explosive_coupons[coupon_code],
                    "used_at": datetime.utcnow(),
                    "status": "applied"
                }
                await self.db["coupon_usage"].insert_one(coupon_usage)
                
                logging.info(f"Coupon {coupon_code} applied: {explosive_coupons[coupon_code]}% discount")
                return explosive_coupons[coupon_code]
            else:
                logging.warning(f"Invalid coupon code: {coupon_code}")
                return 0.0
                
        except Exception as e:
            logging.error(f"Error validating coupon {coupon_code}: {e}")
            return 0.0
    
    async def get_payment_transaction(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get payment transaction by session ID"""
        try:
            transaction = await self.db["payment_transactions"].find_one({"session_id": session_id})
            if transaction:
                # Convert ObjectId to string for JSON serialization
                if '_id' in transaction:
                    transaction['_id'] = str(transaction['_id'])
                # Convert datetime objects to ISO strings
                for key, value in transaction.items():
                    if hasattr(value, 'isoformat'):
                        transaction[key] = value.isoformat()
            return transaction
        except Exception as e:
            logging.error(f"Error getting payment transaction: {e}")
            return None

# Initialize payment service
payment_service = None

def init_payment_service(mongo_db):
    """Initialize payment service with MongoDB connection"""
    global payment_service
    payment_service = PaymentService(mongo_db)
    return payment_service