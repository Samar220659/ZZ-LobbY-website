#!/usr/bin/env python3
"""
ZZ-Lobby Elite - Product Management System
Verwaltet alle ZZ-Lobby Produkte und Preisstrategien
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    discount_percentage: Optional[int] = None
    category: str
    features: List[str]
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    sales_count: int = 0
    revenue_generated: float = 0.0

class ProductManager:
    def __init__(self):
        self.products = self._initialize_zz_lobby_products()
    
    def _initialize_zz_lobby_products(self) -> Dict[str, Product]:
        """Initialisiert alle ZZ-Lobby Elite Produkte"""
        
        products = {
            "zz_starter": Product(
                name="ZZ-Lobby Starter System",
                description="Automatisches €500/Tag Einkommen-System für Einsteiger",
                price=47.0,
                original_price=97.0,
                discount_percentage=52,
                category="starter",
                features=[
                    "✅ Komplettes €500/Tag Automation System",
                    "✅ 24/7 Support per Telegram", 
                    "✅ 30-Tage Geld-zurück-Garantie",
                    "✅ Sofort-Zugang zu allen Tools",
                    "✅ Step-by-Step Video-Anleitungen",
                    "✅ WhatsApp VIP-Gruppe Zugang"
                ]
            ),
            
            "zz_pro": Product(
                name="ZZ-Lobby PRO Elite",
                description="Erweiterte Automatisierung für €1.500+/Tag",
                price=197.0,
                original_price=497.0,
                discount_percentage=60,
                category="pro",
                features=[
                    "✅ Alles aus Starter System",
                    "✅ Erweiterte AI-Automatisierung", 
                    "✅ Social Media Auto-Poster",
                    "✅ Lead Generation Engine",
                    "✅ Persönlicher Success-Coach",
                    "✅ Exclusiver Elite-Telegram Channel",
                    "✅ White-Label Rechte",
                    "✅ 90-Tage Erfolgs-Garantie"
                ]
            ),
            
            "zz_elite": Product(
                name="ZZ-Lobby ULTIMATE Elite",
                description="Vollautomatisches €50.000/Monat Business-System",
                price=997.0,
                original_price=2997.0,
                discount_percentage=67,
                category="elite",
                features=[
                    "✅ Alles aus PRO System",
                    "✅ Komplette Business-Automatisierung",
                    "✅ AI-Content Generation für Social Media",
                    "✅ Automated Email Marketing Sequences",
                    "✅ Done-For-You Landing Pages",
                    "✅ Personal 1:1 Coaching Calls",
                    "✅ Master Resell Rights (100% Provision)",
                    "✅ Exclusive Elite Mastermind Zugang",
                    "✅ 365-Tage Erfolgs-Garantie",
                    "✅ Lifetime Updates & Support"
                ]
            ),
            
            "zz_vip_coaching": Product(
                name="ZZ-Lobby VIP 1:1 Coaching",
                description="Persönliches 1:1 Coaching für guaranteed €10.000+/Monat",
                price=4997.0,
                original_price=9997.0,
                discount_percentage=50,
                category="coaching",
                features=[
                    "✅ 12 Wochen intensive 1:1 Betreuung",
                    "✅ Wöchentliche Strategy Calls",
                    "✅ Done-With-You System Setup",
                    "✅ Guaranteed €10.000+/Monat oder Geld zurück",
                    "✅ Direkter WhatsApp-Zugang zu Daniel",
                    "✅ Komplette Business-Übernahme Setup",
                    "✅ Unlimited Support & Revisions",
                    "✅ Exclusive VIP Events & Retreats"
                ]
            )
        }
        
        logger.info(f"✅ {len(products)} ZZ-Lobby Produkte initialisiert")
        return products
    
    def get_product(self, product_id: str) -> Optional[Product]:
        """Holt ein spezifisches Produkt"""
        return self.products.get(product_id)
    
    def get_all_products(self) -> List[Product]:
        """Holt alle aktiven Produkte"""
        return [product for product in self.products.values() if product.is_active]
    
    def get_products_by_category(self, category: str) -> List[Product]:
        """Holt Produkte nach Kategorie"""
        return [product for product in self.products.values() 
                if product.category == category and product.is_active]
    
    def calculate_upsell_sequence(self, current_product_id: str) -> List[Product]:
        """Berechnet optimale Upsell-Sequenz"""
        upsell_map = {
            "zz_starter": ["zz_pro", "zz_elite"],
            "zz_pro": ["zz_elite", "zz_vip_coaching"],
            "zz_elite": ["zz_vip_coaching"],
            "zz_vip_coaching": []
        }
        
        upsell_ids = upsell_map.get(current_product_id, [])
        return [self.products[pid] for pid in upsell_ids if pid in self.products]
    
    def get_limited_time_offers(self) -> List[Dict]:
        """Generiert zeitlich begrenzte Angebote"""
        offers = [
            {
                "product_id": "zz_starter",
                "offer_type": "flash_sale",
                "discount": 70,
                "final_price": 27.0,
                "expires_in_hours": 2,
                "urgency_message": "🔥 FLASH SALE: Nur noch 2 Stunden - 70% Rabatt!"
            },
            {
                "product_id": "zz_pro", 
                "offer_type": "early_bird",
                "discount": 75,
                "final_price": 97.0,
                "expires_in_hours": 6,
                "urgency_message": "⚡ EARLY BIRD: 75% Rabatt endet in 6 Stunden!"
            },
            {
                "product_id": "zz_elite",
                "offer_type": "vip_exclusive",
                "discount": 80,
                "final_price": 497.0,
                "expires_in_hours": 12,
                "urgency_message": "💎 VIP EXCLUSIVE: 80% Rabatt nur für die nächsten 12h!"
            }
        ]
        
        return offers
    
    def track_sale(self, product_id: str, amount: float):
        """Verfolgt Verkäufe für Analytics"""
        if product_id in self.products:
            self.products[product_id].sales_count += 1
            self.products[product_id].revenue_generated += amount
            logger.info(f"💰 Sale tracked: {product_id} - €{amount}")
    
    def get_bestsellers(self, limit: int = 3) -> List[Product]:
        """Holt die Bestseller-Produkte"""
        sorted_products = sorted(
            self.products.values(),
            key=lambda p: p.sales_count,
            reverse=True
        )
        return sorted_products[:limit]
    
    def generate_product_recommendations(self, user_behavior: Dict) -> List[Product]:
        """Generiert personalisierte Produktempfehlungen"""
        
        # Einfache Recommendation Logic basierend auf User Behavior
        if user_behavior.get("is_beginner", True):
            return [self.products["zz_starter"]]
        elif user_behavior.get("has_experience", False):
            return [self.products["zz_pro"], self.products["zz_elite"]]
        elif user_behavior.get("is_serious_buyer", False):
            return [self.products["zz_elite"], self.products["zz_vip_coaching"]]
        else:
            return self.get_bestsellers()

# Global Product Manager Instance
product_manager = ProductManager()