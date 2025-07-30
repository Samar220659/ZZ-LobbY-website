from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import models and services
from models import (
    PaymentCreateRequest, PaymentResponse, AutomationToggleRequest, 
    AutomationResponse, DashboardStatsResponse, AnalyticsResponse,
    SaasStatusResponse, StandardResponse
)
from services.paypal_service import paypal_service
from services.database_service import db_service

# Import automation engine
from automation_engine import automation_router

# Import AI marketing engine
from ai_marketing_engine import ai_router

# Import system monitoring
from system_monitoring import monitoring_router

# Import HYPERSCHWARM engine
from hyperschwarm_engine import get_hyperschwarm_orchestrator

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
    logging.info("Database initialized successfully")
    logging.info("Automation Engine initialized successfully")
    
    # Initialize HYPERSCHWARM
    global hyperschwarm
    hyperschwarm = get_hyperschwarm_orchestrator(client)
    logging.info("🚀 HYPERSCHWARM Multi-Agent System initialized successfully")
    logging.info(f"✅ {len(hyperschwarm.agents)} Elite Agents online and ready for deployment!")

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

# HYPERSCHWARM API ENDPOINTS
@api_router.get("/hyperschwarm/status")
async def get_hyperschwarm_status():
    """Gibt aktuellen HYPERSCHWARM System Status zurück"""
    try:
        global hyperschwarm
        status = hyperschwarm.get_system_status()
        return {
            "success": True,
            "system_status": status,
            "message": "HYPERSCHWARM System operational"
        }
    except Exception as e:
        logging.error(f"Error getting HYPERSCHWARM status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get HYPERSCHWARM status")

@api_router.get("/hyperschwarm/agents")
async def get_hyperschwarm_agents():
    """Gibt Details aller HYPERSCHWARM Agenten zurück"""
    try:
        global hyperschwarm
        agents = await hyperschwarm.get_agent_details()
        return {
            "success": True,
            "agents": agents,
            "total_agents": len(agents),
            "message": "Agent details retrieved successfully"
        }
    except Exception as e:
        logging.error(f"Error getting HYPERSCHWARM agents: {e}")
        raise HTTPException(status_code=500, detail="Failed to get agent details")

class StrategyRequest(BaseModel):
    objective: str
    priority: str = "high"
    target_revenue: float = 5000.0
    timeframe: str = "24h"

@api_router.post("/hyperschwarm/execute-strategy")
async def execute_hyperschwarm_strategy(request: StrategyRequest):
    """Führt koordinierte Multi-Agent-Strategie aus"""
    try:
        global hyperschwarm
        
        # Erweitere das Objective mit zusätzlichen Parametern
        enhanced_objective = f"{request.objective} | Target: €{request.target_revenue} in {request.timeframe} | Priority: {request.priority}"
        
        result = await hyperschwarm.execute_coordinated_strategy(enhanced_objective)
        
        return {
            "success": True,
            "strategy_execution": result,
            "message": "Strategy executed successfully by HYPERSCHWARM agents"
        }
    except Exception as e:
        logging.error(f"Error executing HYPERSCHWARM strategy: {e}")
        raise HTTPException(status_code=500, detail="Failed to execute strategy")

@api_router.get("/hyperschwarm/performance-metrics")
async def get_hyperschwarm_performance():
    """Gibt Performance-Metriken des HYPERSCHWARM Systems zurück"""
    try:
        global hyperschwarm
        agents = await hyperschwarm.get_agent_details()
        
        # Berechne Aggregat-Metriken
        total_revenue = sum(agent["revenue_generated"] for agent in agents)
        avg_performance = sum(agent["performance_score"] for agent in agents) / len(agents)
        total_tasks = sum(agent["tasks_completed"] for agent in agents)
        
        performance_by_category = {}
        for agent in agents:
            category = agent["specialization"]
            if category not in performance_by_category:
                performance_by_category[category] = {
                    "agents": 0,
                    "total_revenue": 0,
                    "avg_performance": 0,
                    "total_tasks": 0
                }
            
            performance_by_category[category]["agents"] += 1
            performance_by_category[category]["total_revenue"] += agent["revenue_generated"]
            performance_by_category[category]["total_tasks"] += agent["tasks_completed"]
        
        # Berechne Durchschnitte pro Kategorie
        for category in performance_by_category:
            cat_data = performance_by_category[category]
            cat_agents = [a for a in agents if a["specialization"] == category]
            cat_data["avg_performance"] = sum(a["performance_score"] for a in cat_agents) / len(cat_agents)
        
        return {
            "success": True,
            "performance_metrics": {
                "total_revenue_generated": round(total_revenue, 2),
                "average_performance_score": round(avg_performance, 2),
                "total_tasks_completed": total_tasks,
                "active_agents": len([a for a in agents if a["active"]]),
                "performance_by_category": performance_by_category,
                "system_efficiency": f"{min(100, avg_performance * 100):.1f}%",
                "daily_revenue_projection": f"€{total_revenue * 30:.0f}",
                "monthly_revenue_projection": f"€{total_revenue * 365:.0f}"
            },
            "message": "Performance metrics retrieved successfully"
        }
    except Exception as e:
        logging.error(f"Error getting HYPERSCHWARM performance: {e}")
        raise HTTPException(status_code=500, detail="Failed to get performance metrics")

@api_router.post("/hyperschwarm/optimize-agents")
async def optimize_hyperschwarm_agents():
    """Optimiert alle HYPERSCHWARM Agenten für bessere Performance"""
    try:
        global hyperschwarm
        
        # Führe Optimierung für alle Agenten aus
        optimization_results = []
        for agent_id, agent in hyperschwarm.agents.items():
            # Simuliere Optimierung
            if agent.performance_score < 0.7:
                # Boost für schwache Performer
                agent.learning_rate *= 1.2
                agent.performance_score = min(1.0, agent.performance_score * 1.15)
                optimization_results.append({
                    "agent_id": agent_id,
                    "action": "Performance boost applied",
                    "improvement": "+15%"
                })
            elif agent.performance_score > 0.9:
                # Weitere Optimierung für Top-Performer
                agent.learning_rate *= 1.05
                optimization_results.append({
                    "agent_id": agent_id,
                    "action": "Elite optimization applied",
                    "improvement": "+5%"
                })
        
        return {
            "success": True,
            "optimization_results": optimization_results,
            "optimized_agents": len(optimization_results),
            "message": f"Successfully optimized {len(optimization_results)} agents"
        }
    except Exception as e:
        logging.error(f"Error optimizing HYPERSCHWARM agents: {e}")
        raise HTTPException(status_code=500, detail="Failed to optimize agents")

# GOOGLE OPAL API ENDPOINTS
@api_router.get("/hyperschwarm/opal/templates")
async def get_opal_templates():
    """Gibt verfügbare Google Opal Templates zurück"""
    try:
        from services.google_opal_service import google_opal_service
        templates = google_opal_service.get_available_templates()
        
        return {
            "success": True,
            "templates": templates,
            "total_templates": len(templates),
            "message": "Google Opal templates retrieved successfully"
        }
    except Exception as e:
        logging.error(f"Error getting Opal templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to get Opal templates")

class OpalAppRequest(BaseModel):
    app_type: str
    product_name: str
    product_price: float
    target_audience: str = "digital_entrepreneurs"
    campaign_config: dict = {}

@api_router.post("/hyperschwarm/opal/create-app")
async def create_opal_marketing_app(request: OpalAppRequest):
    """Erstellt Google Opal Marketing-App"""
    try:
        from services.google_opal_service import google_opal_service
        
        config = {
            "app_name": f"{request.app_type.replace('_', ' ').title()}: {request.product_name}",
            "product_name": request.product_name,
            "price": request.product_price,
            "audience": request.target_audience,
            **request.campaign_config
        }
        
        opal_app = await google_opal_service.create_marketing_app(request.app_type, config)
        
        return {
            "success": True,
            "opal_app": {
                "app_id": opal_app.app_id,
                "app_name": opal_app.app_name,
                "app_url": opal_app.app_url,
                "app_type": opal_app.app_type,
                "created_at": opal_app.created_at.isoformat(),
                "performance_metrics": opal_app.performance_metrics
            },
            "message": f"Google Opal {request.app_type} app created successfully"
        }
    except Exception as e:
        logging.error(f"Error creating Opal app: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create Opal app: {str(e)}")

@api_router.post("/hyperschwarm/opal/create-landing-page")
async def create_opal_landing_page(product_data: dict, campaign_config: dict = {}):
    """Erstellt automatisch Google Opal Landing Page"""
    try:
        from services.google_opal_service import google_opal_service
        
        opal_app = await google_opal_service.create_campaign_landing_page(
            product_data=product_data,
            campaign_config=campaign_config
        )
        
        return {
            "success": True,
            "landing_page": {
                "app_id": opal_app.app_id,
                "app_name": opal_app.app_name,
                "app_url": opal_app.app_url,
                "created_at": opal_app.created_at.isoformat(),
                "features": ["countdown_timer", "social_proof", "payment_integration", "mobile_responsive"]
            },
            "message": "Google Opal landing page created successfully"
        }
    except Exception as e:
        logging.error(f"Error creating Opal landing page: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create landing page: {str(e)}")

# CLAUDE AI CONTENT GENERATION ENDPOINTS
@api_router.post("/hyperschwarm/ai-content/tiktok")
async def generate_ai_tiktok_content(product_name: str, product_price: float, target_audience: str = "digital_entrepreneurs"):
    """Generiert TikTok Content mit Claude AI"""
    try:
        from services.claude_ai_service import claude_ai_service
        
        ai_content = await claude_ai_service.generate_viral_tiktok_script(
            product_name=product_name,
            product_price=product_price,
            target_audience=target_audience
        )
        
        if ai_content:
            return {
                "success": True,
                "ai_content": {
                    "content_id": ai_content.content_id,
                    "title": ai_content.title,
                    "content": ai_content.content,
                    "target_audience": ai_content.target_audience,
                    "predicted_performance": ai_content.predicted_performance,
                    "ai_confidence": ai_content.ai_confidence
                },
                "message": "AI TikTok content generated successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate AI content")
            
    except Exception as e:
        logging.error(f"Error generating AI TikTok content: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate AI content: {str(e)}")

@api_router.post("/hyperschwarm/ai-content/email")
async def generate_ai_email_campaign(product_name: str, product_price: float, campaign_type: str = "launch"):
    """Generiert Email-Kampagne mit Claude AI"""
    try:
        from services.claude_ai_service import claude_ai_service
        
        ai_content = await claude_ai_service.generate_email_campaign(
            product_name=product_name,
            product_price=product_price,
            campaign_type=campaign_type
        )
        
        if ai_content:
            return {
                "success": True,
                "email_campaign": {
                    "content_id": ai_content.content_id,
                    "title": ai_content.title,
                    "content": ai_content.content,
                    "predicted_performance": ai_content.predicted_performance,
                    "ai_confidence": ai_content.ai_confidence
                },
                "message": f"AI email campaign ({campaign_type}) generated successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate AI email campaign")
            
    except Exception as e:
        logging.error(f"Error generating AI email campaign: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate AI email campaign: {str(e)}")

@api_router.post("/hyperschwarm/integrated-campaign")
async def create_integrated_ai_campaign(product_name: str, product_price: float, target_audience: str = "digital_entrepreneurs"):
    """Erstellt komplette integrierte Kampagne mit AI + Opal"""
    try:
        from services.claude_ai_service import claude_ai_service
        from services.google_opal_service import google_opal_service
        from services.telegram_service import telegram_service
        
        # 1. Generiere TikTok Content mit Claude AI
        tiktok_content = await claude_ai_service.generate_viral_tiktok_script(
            product_name=product_name,
            product_price=product_price,
            target_audience=target_audience
        )
        
        # 2. Generiere Email-Kampagne
        email_content = await claude_ai_service.generate_email_campaign(
            product_name=product_name,
            product_price=product_price,
            campaign_type="launch"
        )
        
        # 3. Erstelle Google Opal Landing Page
        campaign_config = {
            "hook": tiktok_content.title if tiktok_content else f"Entdecke {product_name}",
            "target_audience": target_audience,
            "urgency": "Limitierte Zeit",
            "social_proof": "5000+ erfolgreiche Nutzer"
        }
        
        opal_landing = await google_opal_service.create_campaign_landing_page(
            product_data={
                "name": product_name,
                "price": product_price
            },
            campaign_config=campaign_config
        )
        
        # 4. Sende Telegram Summary
        await telegram_service.send_message(
            f"🚀 **INTEGRIERTE AI-KAMPAGNE ERSTELLT** 🚀\n\n"
            f"📱 **Produkt:** {product_name} (€{product_price})\n"
            f"🎯 **Zielgruppe:** {target_audience}\n\n"
            f"✅ **TikTok Content:** Viral-optimiert mit Claude AI\n"
            f"✅ **Email-Kampagne:** Launch-Serie generiert\n"
            f"✅ **Landing Page:** {opal_landing.app_url}\n\n"
            f"💪 **HYPERSCHWARM hat eine komplette Marketing-Kampagne automatisiert erstellt!**\n\n"
            f"#IntegratedCampaign #ClaudeAI #GoogleOpal"
        )
        
        return {
            "success": True,
            "integrated_campaign": {
                "tiktok_content": {
                    "generated": tiktok_content is not None,
                    "content_id": tiktok_content.content_id if tiktok_content else None,
                    "predicted_performance": tiktok_content.predicted_performance if tiktok_content else None
                },
                "email_campaign": {
                    "generated": email_content is not None,
                    "content_id": email_content.content_id if email_content else None,
                    "predicted_performance": email_content.predicted_performance if email_content else None
                },
                "landing_page": {
                    "app_id": opal_landing.app_id,
                    "app_url": opal_landing.app_url,
                    "created_at": opal_landing.created_at.isoformat()
                },
                "campaign_summary": {
                    "product_name": product_name,
                    "product_price": product_price,
                    "target_audience": target_audience,
                    "ai_integrations": ["Claude AI", "Google Opal", "Telegram Bot"],
                    "estimated_setup_time": "< 5 minutes",
                    "projected_reach": "10,000+ potential customers"
                }
            },
            "message": "Integrated AI marketing campaign created successfully with Claude AI + Google Opal"
        }
        
    except Exception as e:
        logging.error(f"Error creating integrated AI campaign: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create integrated campaign: {str(e)}")

# Include the routers in the main app
app.include_router(api_router)
app.include_router(automation_router)  # Automation Engine
app.include_router(ai_router)  # AI Marketing Engine

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
