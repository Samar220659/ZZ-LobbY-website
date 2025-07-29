from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
from datetime import datetime
import asyncio

# ZZ-Lobby Elite Module Imports
from product import product_manager, Product
from order import order_processor, Order, OrderStatus, PaymentMethod

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="ZZ-Lobby Elite API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ZZ-Lobby Elite Models
class ProductResponse(BaseModel):
    products: List[Product]
    total_count: int

class OrderCreate(BaseModel):
    customer_email: str
    customer_name: Optional[str] = None
    product_id: str
    payment_method: PaymentMethod
    affiliate_id: Optional[str] = None
    conversion_source: Optional[str] = None

class OrderResponse(BaseModel):
    order: Order
    payment_url: Optional[str] = None
    success: bool

class RevenueStats(BaseModel):
    daily_revenue: float
    daily_target: float
    achievement_percentage: float
    total_orders: int
    conversion_sources: Dict

# Legacy Status Check Models (für Kompatibilität)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# ==================== ZZ-LOBBY ELITE ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {
        "message": "🚀 ZZ-Lobby Elite API - Revenue Maximization System",
        "status": "ACTIVE",
        "daily_target": "€500",
        "conversion_goal": "5%+",
        "version": "1.0.0"
    }

@api_router.get("/products", response_model=ProductResponse)
async def get_products(category: Optional[str] = None):
    """Holt alle verfügbaren Produkte"""
    try:
        if category:
            products = product_manager.get_products_by_category(category)
        else:
            products = product_manager.get_all_products()
        
        return ProductResponse(
            products=products,
            total_count=len(products)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Holt ein spezifisches Produkt"""
    product = product_manager.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return product

@api_router.get("/products/{product_id}/upsells", response_model=List[Product])
async def get_product_upsells(product_id: str):
    """Holt Upsell-Produkte für ein Produkt"""
    upsells = product_manager.calculate_upsell_sequence(product_id)
    return upsells

@api_router.get("/offers/limited-time")
async def get_limited_time_offers():
    """Holt zeitlich begrenzte Angebote"""
    offers = product_manager.get_limited_time_offers()
    return {"offers": offers, "count": len(offers)}

@api_router.post("/orders", response_model=OrderResponse)
async def create_order(order_data: OrderCreate):
    """Erstellt eine neue Bestellung"""
    try:
        # Validiere Produkt
        product = product_manager.get_product(order_data.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        # Erstelle Order Dictionary
        order_dict = {
            "customer_email": order_data.customer_email,
            "customer_name": order_data.customer_name,
            "product_id": order_data.product_id,
            "product_name": product.name,
            "amount": product.price,
            "payment_method": order_data.payment_method,
            "affiliate_id": order_data.affiliate_id,
            "conversion_source": order_data.conversion_source
        }
        
        # Erstelle Bestellung
        order = await order_processor.create_order(order_dict)
        
        # Generiere Payment URL (vereinfacht)
        payment_url = f"https://checkout.zz-lobby-elite.com/{order.id}"
        
        return OrderResponse(
            order=order,
            payment_url=payment_url,
            success=True
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Holt eine Bestellung"""
    order = order_processor.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")
    return order

@api_router.post("/orders/{order_id}/webhook")
async def payment_webhook(order_id: str, webhook_data: Dict):
    """Webhook für Zahlungsbestätigungen"""
    try:
        order = order_processor.get_order(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")
        
        # Verarbeite Webhook (PayPal, DigiStore24, etc.)
        if webhook_data.get("status") == "completed":
            order.status = OrderStatus.PAID
            order.paid_at = datetime.utcnow()
            order.transaction_id = webhook_data.get("transaction_id")
            
            # Trigger Post-Purchase Actions
            await order_processor._trigger_post_purchase_actions(order)
            
            # Track Sale für Analytics
            product_manager.track_sale(order.product_id, order.amount)
        
        return {"success": True, "order_status": order.status}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/revenue", response_model=RevenueStats)
async def get_revenue_stats():
    """Holt Revenue-Analytics"""
    try:
        daily_revenue = order_processor.get_daily_revenue()
        daily_target = 500.0  # €500 Ziel
        achievement_percentage = (daily_revenue / daily_target) * 100
        
        conversion_analytics = order_processor.get_conversion_analytics()
        
        return RevenueStats(
            daily_revenue=daily_revenue,
            daily_target=daily_target,
            achievement_percentage=achievement_percentage,
            total_orders=conversion_analytics["total_orders"],
            conversion_sources=conversion_analytics["by_source"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/bestsellers")
async def get_bestsellers():
    """Holt die Bestseller-Produkte"""
    bestsellers = product_manager.get_bestsellers(limit=5)
    return {"bestsellers": bestsellers}

@api_router.post("/recommendations")
async def get_product_recommendations(user_behavior: Dict):
    """Holt personalisierte Produktempfehlungen"""
    recommendations = product_manager.generate_product_recommendations(user_behavior)
    return {"recommendations": recommendations}

# ==================== LEGACY ENDPOINTS (Kompatibilität) ====================

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

# Include the router in the main app
app.include_router(api_router)

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
