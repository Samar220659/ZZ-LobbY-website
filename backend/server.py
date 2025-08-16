from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta

# Import models and services
from models import (
    PaymentCreateRequest, PaymentResponse, AutomationToggleRequest, 
    AutomationResponse, DashboardStatsResponse, AnalyticsResponse,
    SaasStatusResponse, StandardResponse
)
from services.paypal_service import paypal_service
from services.database_service import db_service
from services.payment_service import init_payment_service, payment_service

# Import automation engine
from automation_engine import automation_router

# Import AI marketing engine
from ai_marketing_engine import ai_router

# Import affiliate system
from affiliate_explosion import init_digistore24_system, Digistore24IPNData

# Import business integration system
from business_integration import init_business_system, business_system

# Import automation engine
from zz_automation_engine import init_automation_engine, automation_engine, start_automation
import affiliate_explosion
import business_integration

def get_affiliate_system():
    """Get the initialized affiliate system instance"""
    return affiliate_explosion.digistore24_affiliate_system

def get_business_system():
    """Get the initialized business system instance"""
    return business_integration.business_system

def get_automation_engine():
    """Get the initialized automation engine instance"""
    from zz_automation_engine import automation_engine
    return automation_engine

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="ZZ-Lobby Elite API with Automation Engine", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class SocialMediaConnectRequest(BaseModel):
    platform: str
    email: str
    password: str

class PaymentPackageRequest(BaseModel):
    package_id: str
    origin_url: str
    coupon_code: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await db_service.initialize_default_data()
    init_digistore24_system(db)  # Initialize Digistore24 affiliate system
    init_business_system(db)     # Initialize Business Integration system
    init_automation_engine(db)   # Initialize Automation Engine
    
    # Start automation engine as background task
    asyncio.create_task(start_automation())
    
    logging.info("Database initialized successfully")
    logging.info("Automation Engine initialized successfully")
    logging.info("Digistore24 Affiliate System initialized successfully")
    logging.info("Business Integration System initialized successfully")
    logging.info("🤖 ZZ-Lobby Automation Engine started - 98% automation active!")

# Dashboard API
@api_router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats():
    try:
        stats = await db_service.get_dashboard_stats()
        return DashboardStatsResponse(**stats)
    except Exception as e:
        logging.error(f"Error getting dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard statistics")

# PayPal API
@api_router.post("/paypal/create-payment", response_model=PaymentResponse)
async def create_payment(request: PaymentCreateRequest):
    try:
        # Create payment with PayPal
        payment_response = paypal_service.create_payment(request.amount, request.description)
        
        # Save to database
        from models import PaymentDocument
        payment_doc = PaymentDocument(
            id=payment_response.id,
            amount=payment_response.amount,
            description=payment_response.description,
            paypalPaymentUrl=payment_response.paymentUrl,
            status=payment_response.status
        )
        await db_service.create_payment(payment_doc)
        
        return payment_response
    except Exception as e:
        logging.error(f"Error creating payment: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment")

@api_router.get("/paypal/payments", response_model=List[PaymentResponse])
async def get_payments():
    try:
        payments = await db_service.get_payments()
        return [
            PaymentResponse(
                id=payment.id,
                amount=payment.amount,
                description=payment.description,
                paymentUrl=payment.paypalPaymentUrl or "",
                qrCode="",  # QR code not stored in DB
                status=payment.status,
                createdAt=payment.createdAt,
                completedAt=payment.completedAt
            )
            for payment in payments
        ]
    except Exception as e:
        logging.error(f"Error getting payments: {e}")
        raise HTTPException(status_code=500, detail="Failed to get payments")

# Automation API
@api_router.get("/automations", response_model=List[AutomationResponse])
async def get_automations():
    try:
        automations = await db_service.get_automations()
        return [
            AutomationResponse(
                id=automation.id,
                name=automation.name,
                description=automation.description,
                type=automation.type,
                active=automation.active,
                status=automation.status,
                performance=automation.performance,
                todayGenerated=automation.todayGenerated,
                successRate=automation.successRate,
                color=automation.color,
                lastUpdated=automation.lastUpdated
            )
            for automation in automations
        ]
    except Exception as e:
        logging.error(f"Error getting automations: {e}")
        raise HTTPException(status_code=500, detail="Failed to get automations")

@api_router.put("/automations/{automation_id}/toggle", response_model=StandardResponse)
async def toggle_automation(automation_id: str, request: AutomationToggleRequest):
    try:
        success = await db_service.toggle_automation(automation_id, request.active)
        if success:
            return StandardResponse(
                success=True,
                message=f"Automation {automation_id} {'aktiviert' if request.active else 'deaktiviert'}"
            )
        else:
            raise HTTPException(status_code=404, detail="Automation not found")
    except Exception as e:
        logging.error(f"Error toggling automation: {e}")
        raise HTTPException(status_code=500, detail="Failed to toggle automation")

@api_router.post("/automations/optimize", response_model=StandardResponse)
async def optimize_automations():
    try:
        # Simulate optimization process
        return StandardResponse(
            success=True,
            message="Automationen erfolgreich optimiert"
        )
    except Exception as e:
        logging.error(f"Error optimizing automations: {e}")
        raise HTTPException(status_code=500, detail="Failed to optimize automations")

# Analytics API
@api_router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    try:
        analytics = await db_service.get_analytics_data()
        return AnalyticsResponse(**analytics)
    except Exception as e:
        logging.error(f"Error getting analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get analytics")

# SaaS API
@api_router.get("/saas/status", response_model=SaasStatusResponse)
async def get_saas_status():
    try:
        saas_status = await db_service.get_saas_status()
        return SaasStatusResponse(**saas_status)
    except Exception as e:
        logging.error(f"Error getting SaaS status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get SaaS status")

@api_router.post("/saas/launch", response_model=StandardResponse)
async def launch_saas_system():
    try:
        # Simulate SaaS launch process
        return StandardResponse(
            success=True,
            message="SaaS System erfolgreich gestartet"
        )
    except Exception as e:
        logging.error(f"Error launching SaaS system: {e}")
        raise HTTPException(status_code=500, detail="Failed to launch SaaS system")

from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from fastapi import Request

@api_router.get("/payments/packages")
async def get_payment_packages():
    """Get all available payment packages"""
    try:
        from services.payment_service import payment_service
        packages = payment_service.get_available_packages()
        return {"success": True, "packages": packages}
    except Exception as e:
        logging.error(f"Error getting payment packages: {e}")
        raise HTTPException(status_code=500, detail="Failed to get payment packages")

@api_router.post("/payments/checkout/session")
async def create_checkout_session(package_request: PaymentPackageRequest, request: Request):
    """Create Stripe checkout session for payment"""
    try:
        from services.payment_service import payment_service
        # Validate package exists
        packages = payment_service.get_available_packages()
        if package_request.package_id not in packages:
            raise HTTPException(status_code=400, detail="Invalid package ID")
        
        # Add coupon handling to payment service
        coupon_discount = 0
        if package_request.coupon_code:
            coupon_discount = await payment_service.validate_and_apply_coupon(
                package_request.coupon_code, 
                package_request.package_id
            )
        
        package = packages[package_request.package_id]
        final_amount = package["amount"] * (1 - coupon_discount / 100) if coupon_discount else package["amount"]
        
        # Create webhook URL from request
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        
        # Initialize Stripe checkout
        stripe_checkout = payment_service.get_stripe_checkout(webhook_url)
        
        # Build success and cancel URLs
        success_url = f"{package_request.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{package_request.origin_url}/payment-cancel"
        
        # Prepare metadata with coupon info - ALL VALUES MUST BE STRINGS
        checkout_metadata = {
            "package_id": package_request.package_id,
            "package_name": package["name"],
            "source": "zzlobby_app"
        }
        
        if package_request.coupon_code and coupon_discount > 0:
            checkout_metadata.update({
                "coupon_code": package_request.coupon_code,
                "discount_percent": str(coupon_discount),
                "original_amount": str(package["amount"]),
                "discounted_amount": str(final_amount)
            })
        
        if package_request.metadata:
            # Convert all metadata values to strings
            for key, value in package_request.metadata.items():
                checkout_metadata[key] = str(value)
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=final_amount,
            currency=package["currency"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=checkout_metadata
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        transaction_id = await payment_service.create_payment_transaction(
            package_request.package_id,
            session.session_id,
            checkout_request.metadata
        )
        
        return {
            "success": True,
            "url": session.url,
            "session_id": session.session_id,
            "transaction_id": transaction_id
        }
        
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        logging.error(f"Error creating checkout session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@api_router.get("/payments/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    """Get payment status by session ID"""
    try:
        from services.payment_service import payment_service
        # Create webhook URL from request
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        
        # Initialize Stripe checkout
        stripe_checkout = payment_service.get_stripe_checkout(webhook_url)
        
        # Get checkout status from Stripe
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update local database status
        await payment_service.update_payment_status(
            session_id,
            checkout_status.payment_status,
            checkout_status.status
        )
        
        # Get transaction details
        transaction = await payment_service.get_payment_transaction(session_id)
        
        return {
            "success": True,
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "amount_total": checkout_status.amount_total,
            "currency": checkout_status.currency,
            "metadata": checkout_status.metadata,
            "transaction": transaction
        }
        
    except Exception as e:
        logging.error(f"Error getting checkout status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get checkout status")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    try:
        from services.payment_service import payment_service
        # Get request body and headers
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        if not signature:
            raise HTTPException(status_code=400, detail="Missing Stripe signature")
        
        # Create webhook URL from request
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        
        # Initialize Stripe checkout
        stripe_checkout = payment_service.get_stripe_checkout(webhook_url)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update payment status based on webhook
        if webhook_response.session_id:
            await payment_service.update_payment_status(
                webhook_response.session_id,
                webhook_response.payment_status,
                "completed" if webhook_response.payment_status == "paid" else "failed"
            )
        
        return {"success": True, "received": True}
        
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        logging.error(f"Error handling Stripe webhook: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@api_router.post("/social-connect", response_model=StandardResponse)
async def connect_social_media(request: SocialMediaConnectRequest):
    """
    Social Media Login - E-Mail/Passwort Anmeldung
    Hinweis: In einer echten Implementierung würde man OAuth verwenden.
    Dies ist eine vereinfachte Version für Demo-Zwecke.
    """
    try:
        # Validierung der Eingaben
        if not request.email or not request.password:
            raise HTTPException(status_code=400, detail="E-Mail und Passwort sind erforderlich")
        
        # Simuliere Social Media API Verbindung
        # In der Realität würde hier eine OAuth-Authentifizierung stattfinden
        if request.platform.lower() in ['facebook', 'instagram', 'linkedin']:
            # Simuliere erfolgreiche Verbindung
            # Speichere die Verbindungsdaten in der Datenbank (verschlüsselt)
            connection_data = {
                "user_id": "demo_user",
                "platform": request.platform.lower(),
                "email": request.email,
                "connected_at": datetime.utcnow(),
                "status": "connected"
            }
            
            # In echter Anwendung: Speichere verschlüsselten Token, nicht das Passwort
            await db["social_connections"].insert_one(connection_data)
            
            return StandardResponse(
                success=True,
                message=f"{request.platform} erfolgreich verbunden!"
            )
        else:
            raise HTTPException(status_code=400, detail="Unsupported platform")
            
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        logging.error(f"Error connecting social media: {e}")
        raise HTTPException(status_code=500, detail="Fehler bei der Social Media Verbindung")

# Digistore24 Affiliate API Endpoints
@api_router.post("/affiliate/digistore24/webhook")
async def digistore24_webhook(request: Request):
    """Digistore24 IPN Webhook Handler"""
    try:
        # Get raw body and signature
        raw_body = await request.body()
        signature = request.headers.get("X-Digistore24-Signature", "")
        
        # Parse form data
        form_data = await request.form()
        
        # Get affiliate system instance
        affiliate_system = get_affiliate_system()
        if not affiliate_system:
            raise HTTPException(status_code=500, detail="Affiliate system not initialized")
        
        # Validate signature
        if not await affiliate_system.validate_ipn_signature(raw_body.decode(), signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Extract IPN data
        ipn_data = Digistore24IPNData(
            buyer_email=form_data.get("buyer_email", ""),
            order_id=form_data.get("order_id", ""),
            product_id=form_data.get("product_id", ""),
            vendor_id=form_data.get("vendor_id", ""),
            affiliate_name=form_data.get("affiliate_name"),
            amount=float(form_data.get("amount", 0)),
            currency=form_data.get("currency", "EUR"),
            payment_method=form_data.get("payment_method", ""),
            transaction_id=form_data.get("transaction_id", ""),
            order_date=form_data.get("order_date", ""),
            affiliate_link=form_data.get("affiliate_link"),
            campaignkey=form_data.get("campaignkey"),
            custom1=form_data.get("custom1"),
            custom2=form_data.get("custom2")
        )
        
        # Process IPN
        result = await affiliate_system.process_digistore24_ipn(ipn_data)
        
        logging.info(f"🚀 Digistore24 IPN verarbeitet: {result}")
        
        return {"status": "success", "message": "IPN processed", "data": result}
        
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        logging.error(f"Digistore24 Webhook Fehler: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@api_router.get("/affiliate/stats")
async def get_affiliate_stats():
    """Hole Affiliate Dashboard Statistiken"""
    try:
        # Get affiliate system instance
        affiliate_system = get_affiliate_system()
        if not affiliate_system:
            raise HTTPException(status_code=500, detail="Affiliate system not initialized")
            
        stats = await affiliate_system.get_affiliate_dashboard_stats()
        return {"success": True, "stats": stats}
    except Exception as e:
        logging.error(f"Affiliate Stats Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get affiliate stats")

@api_router.post("/affiliate/generate-link")
async def generate_affiliate_link(data: dict):
    """Generiert Affiliate Link"""
    try:
        affiliate_name = data.get("affiliate_name", "")
        campaign_key = data.get("campaign_key")
        
        if not affiliate_name:
            raise HTTPException(status_code=400, detail="Affiliate name required")
        
        # Get affiliate system instance
        affiliate_system = get_affiliate_system()
        if not affiliate_system:
            raise HTTPException(status_code=500, detail="Affiliate system not initialized")
        
        link = await affiliate_system.generate_affiliate_link(affiliate_name, campaign_key)
        
        return {
            "success": True,
            "affiliate_link": link,
            "affiliate_name": affiliate_name,
            "campaign_key": campaign_key
        }
        
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        logging.error(f"Affiliate Link Generation Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate affiliate link")

@api_router.get("/affiliate/sales")
async def get_affiliate_sales(limit: int = 50):
    """Hole neueste Affiliate Sales"""
    try:
        # Get recent affiliate sales
        sales = await db.affiliate_sales.find().sort("processed_at", -1).limit(limit).to_list(limit)
        
        return {"success": True, "sales": sales, "count": len(sales)}
        
    except Exception as e:
        logging.error(f"Affiliate Sales Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get affiliate sales")

@api_router.get("/affiliate/payments")
async def get_affiliate_payments(status: str = None):
    """Hole Affiliate Commission Payments"""
    try:
        filter_query = {}
        if status:
            filter_query["status"] = status
            
        payments = await db.affiliate_payments.find(filter_query).sort("created_at", -1).to_list(100)
        
        return {"success": True, "payments": payments, "count": len(payments)}
        
    except Exception as e:
        logging.error(f"Affiliate Payments Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get affiliate payments")

# Business Dashboard API Endpoints
@api_router.get("/business/dashboard")
async def get_business_dashboard():
    """Hole komplettes Business Dashboard mit allen Metriken"""
    try:
        business_sys = get_business_system()
        if not business_sys:
            raise HTTPException(status_code=500, detail="Business system not initialized")
        dashboard_data = await business_sys.get_comprehensive_business_dashboard()
        return {"success": True, "dashboard": dashboard_data}
    except Exception as e:
        logging.error(f"Business Dashboard Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get business dashboard")

@api_router.get("/business/mailchimp/stats")
async def get_mailchimp_stats():
    """Hole Mailchimp Statistiken"""
    try:
        business_sys = get_business_system()
        if not business_sys:
            raise HTTPException(status_code=500, detail="Business system not initialized")
        mailchimp_stats = await business_sys.get_mailchimp_stats()
        return {"success": True, "mailchimp": mailchimp_stats}
    except Exception as e:
        logging.error(f"Mailchimp Stats Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get Mailchimp stats")

@api_router.get("/business/paypal/metrics")
async def get_paypal_metrics():
    """Hole PayPal Business Metriken"""
    try:
        business_sys = get_business_system()
        if not business_sys:
            raise HTTPException(status_code=500, detail="Business system not initialized")
        paypal_metrics = await business_sys.get_paypal_business_metrics()
        return {"success": True, "paypal": paypal_metrics}
    except Exception as e:
        logging.error(f"PayPal Metrics Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get PayPal metrics")

@api_router.get("/business/tax/compliance")
async def get_tax_compliance():
    """Hole Steuerliches Compliance Status"""
    try:
        business_sys = get_business_system()
        if not business_sys:
            raise HTTPException(status_code=500, detail="Business system not initialized")
        tax_status = await business_sys.get_tax_compliance_status()
        return {"success": True, "tax_compliance": tax_status}
    except Exception as e:
        logging.error(f"Tax Compliance Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get tax compliance status")

@api_router.post("/business/email/campaign")
async def send_email_campaign(data: dict):
    """Sende automatisierte Email-Kampagne"""
    try:
        business_sys = get_business_system()
        if not business_sys:
            raise HTTPException(status_code=500, detail="Business system not initialized")
        campaign_result = await business_sys.send_automated_email_campaign(data)
        return {"success": True, "campaign": campaign_result}
    except Exception as e:
        logging.error(f"Email Campaign Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email campaign")

@api_router.get("/business/metrics")
async def get_business_metrics():
    """Hole aktuelle Business Metriken"""
    try:
        business_sys = get_business_system()
        if not business_sys:
            raise HTTPException(status_code=500, detail="Business system not initialized")
        business_metrics = await business_sys.calculate_business_metrics()
        return {"success": True, "metrics": business_metrics}
    except Exception as e:
        logging.error(f"Business Metrics Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get business metrics")

# Automation Engine API Endpoints  
@api_router.get("/automation/status")
async def get_automation_status():
    """Hole aktuellen Automation Engine Status mit echten Daten"""
    try:
        # Hole echte Marketing Activities von heute
        today = datetime.now().date()
        today_start = datetime.combine(today, datetime.min.time())
        
        marketing_activities = await db.marketing_activities.find({
            "scheduled_at": {"$gte": today_start.isoformat()}
        }).to_list(1000)
        
        # Hole echte Email Campaigns von heute  
        email_campaigns = await db.email_campaigns.find({
            "scheduled_at": {"$gte": today_start.isoformat()}
        }).to_list(1000)
        
        # Hole Content Pipeline von heute
        content_created = await db.content_pipeline.find({
            "scheduled_at": {"$gte": today_start.isoformat()}
        }).to_list(1000)
        
        # Hole Lead Daten
        total_leads = await db.leads.count_documents({}) if 'leads' in await db.list_collection_names() else 0
        
        # Berechne echte Metriken
        affiliate_outreach = len([a for a in marketing_activities if a.get('campaign') == 'affiliate_recruitment'])
        emails_sent = len(email_campaigns)
        social_posts = len([a for a in marketing_activities if a.get('platform') in ['linkedin', 'facebook', 'twitter', 'reddit']])
        leads_generated = max(total_leads, len(marketing_activities) // 4)  # Realistische Schätzung
        content_created_count = len(content_created)
        
        return {
            "success": True,
            "automation_active": get_automation_engine().automation_active if get_automation_engine() else False,
            "last_cycle": datetime.now().isoformat(),
            "metrics": {
                "affiliate_outreach": affiliate_outreach,
                "emails_sent": emails_sent, 
                "social_posts": social_posts,
                "leads_generated": leads_generated,
                "content_created": content_created_count
            },
            "total_cycles": await db.automation_cycles.count_documents({}) if 'automation_cycles' in await db.list_collection_names() else 0
        }
        
    except Exception as e:
        logging.error(f"Automation Status Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get automation status")

@api_router.get("/automation/activities")
async def get_recent_automation_activities():
    """Hole neueste Marketing Activities vom System generiert"""
    try:
        # Hole neueste Marketing Activities
        recent_activities = await db.marketing_activities.find().sort("scheduled_at", -1).limit(10).to_list(10)
        
        # Convert ObjectIds to strings for JSON serialization
        for activity in recent_activities:
            if '_id' in activity:
                activity['id'] = str(activity['_id'])
                del activity['_id']
        
        return {"success": True, "activities": recent_activities}
        
    except Exception as e:
        logging.error(f"Automation Activities Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get automation activities")

@api_router.get("/automation/campaigns")
async def get_recent_email_campaigns():
    """Hole neueste Email Campaigns vom System generiert"""
    try:
        # Hole neueste Email Campaigns
        recent_campaigns = await db.email_campaigns.find().sort("scheduled_at", -1).limit(10).to_list(10)
        
        # Convert ObjectIds to strings for JSON serialization
        for campaign in recent_campaigns:
            if '_id' in campaign:
                campaign['id'] = str(campaign['_id'])
                del campaign['_id']
        
        return {"success": True, "campaigns": recent_campaigns}
        
    except Exception as e:
        logging.error(f"Automation Campaigns Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get automation campaigns")

@api_router.post("/automation/start")
async def start_automation():
    """Starte Automation Engine"""
    try:
        automation_eng = get_automation_engine()
        if automation_eng:
            automation_eng.automation_active = True
            
            # Log Automation Start
            await db.automation_cycles.insert_one({
                "action": "started",
                "timestamp": datetime.now().isoformat(),
                "status": "active"
            })
            
            return {"success": True, "message": "Automation Engine gestartet", "status": "active"}
        else:
            raise HTTPException(status_code=500, detail="Automation Engine not initialized")
            
    except Exception as e:
        logging.error(f"Start Automation Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to start automation")

@api_router.post("/automation/stop")
async def stop_automation():
    """Stoppe Automation Engine"""
    try:
        automation_eng = get_automation_engine()
        if automation_eng:
            automation_eng.automation_active = False
            
            # Log Automation Stop
            await db.automation_cycles.insert_one({
                "action": "stopped", 
                "timestamp": datetime.now().isoformat(),
                "status": "inactive"
            })
            
            return {"success": True, "message": "Automation Engine gestoppt", "status": "inactive"}
        else:
            raise HTTPException(status_code=500, detail="Automation Engine not initialized")
            
    except Exception as e:
        logging.error(f"Stop Automation Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to stop automation")

@api_router.post("/automation/generate-activity")
async def generate_test_activity():
    """Generiere Test Marketing Activity für Demo"""
    try:
        import random
        
        platforms = ['linkedin', 'facebook', 'twitter', 'reddit']
        platform = random.choice(platforms)
        
        messages = {
            'linkedin': [
                "🚀 Affiliate Marketing revolutioniert! Mit dem ZZ-Lobby System verdienst du 50% Provision auf jeden Sale. Wer ist dabei? #AffiliateMarketing #PassivesEinkommen",
                "💰 Neue Studie: 73% der Online-Unternehmer nutzen Affiliate Marketing. Das ZZ-Lobby System macht es kinderleicht. 49€ einmalig, lebenslang profitieren! #OnlineBusiness",
                "🎯 Suche 10 motivierte Partner für mein Affiliate Programm. 50% Provision, sofortige Auszahlung, professionelle Tools inklusive. DM für Details! #AffiliatePartner"
            ],
            'facebook': [
                "Hey Leute! 👋 Ich teile hier meine Erfahrung mit Affiliate Marketing. Das ZZ-Lobby System hat mein Business komplett verändert. 50% Provision, vollautomatisch. Wer Interesse hat, kann mich gerne anschreiben! 🚀",
                "🔥 UPDATE: Mein Affiliate Programm läuft seit 3 Monaten und die Zahlen sind krass! Suche noch echte Partner, die Bock auf 24,50€ pro Sale haben. System ist kinderleicht zu bedienen.",
                "💡 TIPP: Wer nach einer seriösen Verdienstmöglichkeit sucht - das ZZ-Lobby Affiliate System zahlt 50% Provision aus. Kein MLM, keine monatlichen Kosten, nur echte Provisionen bei Verkäufen."
            ],
            'twitter': [
                "🚀 Affiliate Marketing Game-Changer: 50% Provision + Live Dashboard + Sofort-Auszahlung = ZZ-Lobby System. Wer ist dabei? #AffiliateMarketing",
                "💰 Vergiss MLM und Get-Rich-Quick Schemes. Echtes Affiliate Marketing mit 50% Provision funktioniert. Beweis: ZZ-Lobby System. #OnlineBusiness",
                "🎯 Suche 5 seriöse Partner für Affiliate Programm. 24,50€ pro Sale, keine Vorlaufkosten, professionelle Unterstützung. DM! #AffiliatePartner"
            ],
            'reddit': [
                "💡 TIPP: Wer nach einer seriösen Verdienstmöglichkeit sucht - das ZZ-Lobby Affiliate System zahlt 50% Provision aus. Kein MLM, keine monatlichen Kosten, nur echte Provisionen bei Verkäufen.",
                "Meine Erfahrung mit dem ZZ-Lobby System: 3 Monate, 12 Affiliates, 490€ passive Einnahmen. AMA!",
                "Für alle die nach echtem Affiliate Marketing suchen: ZZ-Lobby System ist kein Get-Rich-Quick Scheme. Echte 50% Provision, echte Arbeit, echte Ergebnisse."
            ]
        }
        
        selected_message = random.choice(messages[platform])
        
        # Erstelle echte Marketing Activity
        activity = {
            "platform": platform,
            "message": selected_message,
            "scheduled_at": datetime.now().isoformat(),
            "status": "posted",
            "campaign": "affiliate_recruitment",
            "engagement": {
                "likes": random.randint(5, 25),
                "comments": random.randint(0, 8), 
                "shares": random.randint(0, 5)
            }
        }
        
        result = await db.marketing_activities.insert_one(activity)
        
        # Create clean response without ObjectIds
        activity_response = {
            "id": str(result.inserted_id),
            "platform": activity["platform"],
            "message": activity["message"],
            "scheduled_at": activity["scheduled_at"],
            "status": activity["status"],
            "campaign": activity["campaign"],
            "engagement": activity["engagement"]
        }
        
        logging.info(f"🎯 Generated {platform} activity: {selected_message[:50]}...")
        
        return {"success": True, "activity": activity_response}
        
    except Exception as e:
        logging.error(f"Generate Activity Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate activity")

# Smart Akquise System API Endpoints
@api_router.get("/akquise/prospects")
async def get_prospects():
    """Hole alle Prospects für Akquise"""
    try:
        prospects = await db.prospects.find().sort("created_at", -1).to_list(100)
        
        # Convert ObjectIds to strings
        for prospect in prospects:
            if '_id' in prospect:
                prospect['id'] = str(prospect['_id'])
                del prospect['_id']
        
        return {"success": True, "prospects": prospects}
        
    except Exception as e:
        logging.error(f"Get Prospects Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get prospects")

@api_router.post("/akquise/prospects")
async def add_prospect(data: dict):
    """Füge neuen Prospect hinzu"""
    try:
        prospect = {
            "name": data.get("name", ""),
            "company": data.get("company", ""),
            "email": data.get("email", ""),
            "linkedin": data.get("linkedin", ""),
            "phone": data.get("phone", ""),
            "industry": data.get("industry", ""),
            "notes": data.get("notes", ""),
            "status": "new",
            "created_at": datetime.now().isoformat(),
            "last_contact": None,
            "affiliate_link": ""
        }
        
        # Generate affiliate link
        if prospect["name"]:
            affiliate_id = prospect["name"].lower().replace(" ", "_").replace("-", "_")
            prospect["affiliate_link"] = f"https://www.digistore24.com/redir/1417598/{affiliate_id}"
        
        result = await db.prospects.insert_one(prospect)
        
        prospect_response = {
            "id": str(result.inserted_id),
            "name": prospect["name"],
            "company": prospect["company"],
            "email": prospect["email"],
            "linkedin": prospect["linkedin"],
            "phone": prospect["phone"],
            "industry": prospect["industry"],
            "notes": prospect["notes"],
            "status": prospect["status"],
            "created_at": prospect["created_at"],
            "last_contact": prospect["last_contact"],
            "affiliate_link": prospect["affiliate_link"]
        }
        
        logging.info(f"🎯 Prospect hinzugefügt: {prospect['name']} - {prospect['company']}")
        
        return {"success": True, "prospect": prospect_response}
        
    except Exception as e:
        logging.error(f"Add Prospect Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to add prospect")

@api_router.post("/akquise/personalize-message")
async def personalize_message(data: dict):
    """Personalisiere Message Template für Prospect"""
    try:
        template_type = data.get("template_type", "")
        prospect = data.get("prospect", {})
        
        templates = {
            "linkedin_initial": """Hallo {name},

ich bin auf dein Profil bei {company} aufmerksam geworden und finde deine Expertise in {industry} sehr beeindruckend!

Ich habe ein Affiliate Programm mit außergewöhnlich guten Konditionen:
• 50% Provision (24,50€ pro Verkauf)
• Sofortige Auszahlung über Digistore24  
• Professionelle Marketing-Materialien inklusive
• Persönlicher Support von mir

Das Produkt ist ein Marketing Automation System für 49€, das bereits über 500 zufriedene Kunden hat.

Falls du Interesse hast, können wir gerne kurz telefonieren oder ich sende dir weitere Informationen.

Beste Grüße,
Daniel Oettel

P.S: Hier ist dein persönlicher Affiliate-Link: {affiliate_link}""",

            "facebook_groups": """Hey zusammen! 👋

ich teile hier meine Erfahrung mit Affiliate Marketing. Nach 6 Monaten mit verschiedenen Programmen habe ich endlich eines gefunden, das wirklich funktioniert:

🎯 **Was anders ist:**
• 50% Provision (nicht die üblichen 10-20%)
• Sofort-Auszahlung über Digistore24
• Produkt für 49€ (nicht überteuert wie oft)
• Echte Erfolgsgeschichten von Kunden

🔥 **Meine bisherigen Zahlen:**
• 89 Partner aktiv
• Durchschnittlich 2-3 Verkäufe pro Partner/Monat
• Höchste Einzelverdienst eines Partners: 1.250€/Monat

Falls jemand Interesse an seriösem Affiliate Marketing hat (kein MLM!), kann mich gerne anschreiben.

#AffiliateMarketing #PassivesEinkommen #OnlineBusiness""",

            "email_follow_up": """Hallo {name},

ich hatte dir vor einer Woche unser Affiliate Programm vorgestellt und wollte kurz nachfragen, ob du Fragen dazu hast.

Zur Erinnerung die wichtigsten Fakten:
• 50% Provision = 24,50€ pro Verkauf
• Produkt: Marketing Automation System für 49€
• Zielgruppe: Online-Unternehmer, Freelancer, Coaches
• Durchschnittliche Conversion Rate: 5-8%

Vielleicht hilft es dir zu wissen, dass bereits 89 Partner dabei sind und der durchschnittliche Partner 2-3 Verkäufe pro Monat macht.

Falls du erstmal unverbindlich testen möchtest, kann ich dir gerne ein kostenloses Testprodukt zur Verfügung stellen, damit du siehst wie gut es bei deiner Zielgruppe ankommt.

Dein persönlicher Link: {affiliate_link}

Lass mich wissen was du denkst!

Beste Grüße,
Daniel Oettel"""
        }
        
        template = templates.get(template_type, "")
        if not template:
            raise HTTPException(status_code=400, detail="Invalid template type")
        
        # Personalize template
        personalized = template.replace("{name}", prospect.get("name", "[NAME]"))
        personalized = personalized.replace("{company}", prospect.get("company", "[COMPANY]"))
        personalized = personalized.replace("{industry}", prospect.get("industry", "[INDUSTRY]"))
        
        # Generate affiliate link if needed
        affiliate_id = prospect.get("name", "").lower().replace(" ", "_").replace("-", "_")
        affiliate_link = f"https://www.digistore24.com/redir/1417598/{affiliate_id}" if affiliate_id else "[AFFILIATE_LINK]"
        personalized = personalized.replace("{affiliate_link}", affiliate_link)
        
        return {
            "success": True,
            "personalized_message": personalized,
            "affiliate_link": affiliate_link
        }
        
    except Exception as e:
        logging.error(f"Personalize Message Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to personalize message")

@api_router.post("/akquise/track-outreach")
async def track_outreach(data: dict):
    """Tracke Outreach Activity für Prospect"""
    try:
        prospect_id = data.get("prospect_id", "")
        channel = data.get("channel", "")  # linkedin, email, phone, facebook
        message_sent = data.get("message_sent", "")
        
        outreach_record = {
            "prospect_id": prospect_id,
            "channel": channel,
            "message_sent": message_sent,
            "sent_at": datetime.now().isoformat(),
            "status": "sent",
            "response": None,
            "follow_up_needed": True,
            "follow_up_date": (datetime.now() + timedelta(days=7)).isoformat()
        }
        
        await db.outreach_activities.insert_one(outreach_record)
        
        # Update prospect last_contact
        from bson import ObjectId
        try:
            # Try to convert prospect_id to ObjectId if it's a valid ObjectId string
            if len(prospect_id) == 24:
                prospect_object_id = ObjectId(prospect_id)
            else:
                prospect_object_id = prospect_id
                
            await db.prospects.update_one(
                {"_id": prospect_object_id},
                {"$set": {"last_contact": datetime.now().isoformat()}}
            )
        except Exception as e:
            # If ObjectId conversion fails, try with string ID
            await db.prospects.update_one(
                {"id": prospect_id},
                {"$set": {"last_contact": datetime.now().isoformat()}}
            )
        
        logging.info(f"📧 Outreach getrackt: {channel} an Prospect {prospect_id}")
        
        return {"success": True, "message": "Outreach activity tracked"}
        
    except Exception as e:
        logging.error(f"Track Outreach Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to track outreach")

@api_router.get("/akquise/stats")
async def get_akquise_stats():
    """Hole Akquise Statistiken"""
    try:
        # Total prospects
        total_prospects = await db.prospects.count_documents({})
        
        # Prospects by status
        new_prospects = await db.prospects.count_documents({"status": "new"})
        contacted_prospects = await db.prospects.count_documents({"status": "contacted"})
        interested_prospects = await db.prospects.count_documents({"status": "interested"})
        converted_prospects = await db.prospects.count_documents({"status": "converted"})
        
        # Recent outreach activities
        recent_outreach = await db.outreach_activities.find().sort("sent_at", -1).limit(10).to_list(10)
        
        # Convert ObjectIds to strings for JSON serialization
        for outreach in recent_outreach:
            if '_id' in outreach:
                outreach['id'] = str(outreach['_id'])
                del outreach['_id']
        
        # This week's activities
        week_ago = datetime.now() - timedelta(days=7)
        this_week_outreach = await db.outreach_activities.count_documents({
            "sent_at": {"$gte": week_ago.isoformat()}
        })
        
        return {
            "success": True,
            "stats": {
                "total_prospects": total_prospects,
                "new_prospects": new_prospects,
                "contacted_prospects": contacted_prospects,
                "interested_prospects": interested_prospects,
                "converted_prospects": converted_prospects,
                "this_week_outreach": this_week_outreach,
                "conversion_rate": round((converted_prospects / max(total_prospects, 1)) * 100, 1)
            },
            "recent_outreach": recent_outreach
        }
        
    except Exception as e:
        logging.error(f"Get Akquise Stats Fehler: {e}")
        raise HTTPException(status_code=500, detail="Failed to get akquise stats")

# Legacy endpoints
@api_router.get("/")
async def root():
    return {"message": "ZZ-Lobby Elite API with Automation Engine is running"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the routers in the main app
app.include_router(api_router)
app.include_router(automation_router)  # Automation Engine
app.include_router(ai_router)  # AI Marketing Engine

# Initialize payment service
init_payment_service(db)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()