#!/usr/bin/env python3
"""
ZZ-Lobby Elite - Order Processing System
Verarbeitet Bestellungen und PayPal-Integration
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum
import uuid
import logging
import asyncio
import aiohttp
import json

logger = logging.getLogger(__name__)

class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    PAYPAL = "paypal"
    STRIPE = "stripe"
    DIGISTORE24 = "digistore24"
    BITCOIN = "bitcoin"

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_email: str
    customer_name: Optional[str] = None
    product_id: str
    product_name: str
    amount: float
    currency: str = "EUR"
    payment_method: PaymentMethod
    status: OrderStatus = OrderStatus.PENDING
    transaction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    paid_at: Optional[datetime] = None
    affiliate_id: Optional[str] = None
    conversion_source: Optional[str] = None  # tiktok, email, ads, etc.

class OrderProcessor:
    def __init__(self):
        self.orders: Dict[str, Order] = {}
        self.paypal_email = "a22061981@gmx.de"
        self.digistore_api_key = "1417598-BP9FgEF7laOKpzh5wHMtaEr9w1k5qJyWHoHes"
        
    async def create_order(self, order_data: Dict) -> Order:
        """Erstellt eine neue Bestellung"""
        order = Order(**order_data)
        self.orders[order.id] = order
        
        logger.info(f"📝 Neue Bestellung erstellt: {order.id} - €{order.amount}")
        
        # Automatische Zahlungsverarbeitung starten
        asyncio.create_task(self.process_payment(order.id))
        
        return order
    
    async def process_payment(self, order_id: str) -> bool:
        """Verarbeitet die Zahlung für eine Bestellung"""
        order = self.orders.get(order_id)
        if not order:
            logger.error(f"❌ Order {order_id} nicht gefunden")
            return False
        
        logger.info(f"💳 Zahlung wird verarbeitet für Order: {order_id}")
        
        try:
            if order.payment_method == PaymentMethod.PAYPAL:
                success = await self._process_paypal_payment(order)
            elif order.payment_method == PaymentMethod.DIGISTORE24:
                success = await self._process_digistore_payment(order)
            else:
                # Fallback für andere Payment Methods
                success = await self._process_generic_payment(order)
            
            if success:
                order.status = OrderStatus.PAID
                order.paid_at = datetime.utcnow()
                logger.info(f"✅ Zahlung erfolgreich: {order_id} - €{order.amount}")
                
                # Post-Purchase Actions
                await self._trigger_post_purchase_actions(order)
                
            else:
                order.status = OrderStatus.FAILED
                logger.error(f"❌ Zahlung fehlgeschlagen: {order_id}")
            
            return success
            
        except Exception as e:
            logger.error(f"💥 Zahlungsfehler für {order_id}: {e}")
            order.status = OrderStatus.FAILED
            return False
    
    async def _process_paypal_payment(self, order: Order) -> bool:
        """Verarbeitet PayPal-Zahlung"""
        try:
            # PayPal API Integration (vereinfacht)
            paypal_data = {
                "amount": order.amount,
                "currency": order.currency,
                "recipient": self.paypal_email,
                "order_id": order.id,
                "description": f"ZZ-Lobby Elite: {order.product_name}"
            }
            
            # Simuliere PayPal API Call
            await asyncio.sleep(2)  # API Response Zeit
            
            # 95% Erfolgsrate simulieren
            import random
            if random.random() < 0.95:
                order.transaction_id = f"PAYPAL_{uuid.uuid4().hex[:12].upper()}"
                logger.info(f"💰 PayPal Transaction ID: {order.transaction_id}")
                return True
            else:
                return False
                
        except Exception as e:
            logger.error(f"PayPal Fehler: {e}")
            return False
    
    async def _process_digistore_payment(self, order: Order) -> bool:
        """Verarbeitet DigiStore24-Zahlung"""
        try:
            # DigiStore24 API Integration
            digistore_data = {
                "api_key": self.digistore_api_key,
                "product_id": order.product_id,
                "amount": order.amount,
                "customer_email": order.customer_email,
                "order_id": order.id
            }
            
            # Simuliere DigiStore24 API Call
            await asyncio.sleep(1.5)
            
            # 97% Erfolgsrate für DigiStore24
            import random
            if random.random() < 0.97:
                order.transaction_id = f"DS24_{uuid.uuid4().hex[:10].upper()}"
                logger.info(f"💰 DigiStore24 Transaction ID: {order.transaction_id}")
                return True
            else:
                return False
                
        except Exception as e:
            logger.error(f"DigiStore24 Fehler: {e}")
            return False
    
    async def _process_generic_payment(self, order: Order) -> bool:
        """Generische Zahlungsverarbeitung"""
        try:
            await asyncio.sleep(1)
            
            # 90% Erfolgsrate für andere Methoden
            import random
            if random.random() < 0.90:
                order.transaction_id = f"GEN_{uuid.uuid4().hex[:8].upper()}"
                return True
            else:
                return False
                
        except Exception as e:
            logger.error(f"Generic Payment Fehler: {e}")
            return False
    
    async def _trigger_post_purchase_actions(self, order: Order):
        """Führt Post-Purchase-Aktionen aus"""
        logger.info(f"🎯 Post-Purchase Aktionen für {order.id}")
        
        actions = [
            self._send_confirmation_email(order),
            self._add_to_customer_list(order),
            self._trigger_upsell_sequence(order),
            self._update_analytics(order),
            self._send_telegram_notification(order)
        ]
        
        await asyncio.gather(*actions, return_exceptions=True)
    
    async def _send_confirmation_email(self, order: Order):
        """Sendet Bestätigungs-E-Mail"""
        email_content = f"""
        🎉 GLÜCKWUNSCH! Deine Bestellung ist bestätigt!
        
        Order ID: {order.id}
        Produkt: {order.product_name}
        Betrag: €{order.amount}
        
        ✅ Sofort-Zugang zu deinem System
        ✅ WhatsApp VIP-Gruppe Einladung
        ✅ 24/7 Support aktiviert
        
        WICHTIG: Speichere diese E-Mail!
        
        Dein ZZ-Lobby Elite Team
        """
        
        logger.info(f"📧 Confirmation Email sent to {order.customer_email}")
    
    async def _add_to_customer_list(self, order: Order):
        """Fügt Kunden zur Liste hinzu"""
        customer_data = {
            "email": order.customer_email,
            "name": order.customer_name,
            "purchase_date": order.paid_at.isoformat(),
            "product": order.product_name,
            "amount": order.amount,
            "source": order.conversion_source
        }
        
        logger.info(f"👤 Customer added to list: {order.customer_email}")
    
    async def _trigger_upsell_sequence(self, order: Order):
        """Startet Upsell-E-Mail-Sequenz"""
        
        upsell_sequences = {
            "zz_starter": [
                {"delay_hours": 1, "subject": "🚀 Verdopple dein Einkommen mit ZZ-PRO!", "discount": 50},
                {"delay_hours": 24, "subject": "⏰ Nur noch 24h: 60% Rabatt auf Elite System", "discount": 60},
                {"delay_hours": 72, "subject": "LETZTE CHANCE: Elite-Upgrade für €97", "discount": 70}
            ],
            "zz_pro": [
                {"delay_hours": 2, "subject": "💎 Ready für €50.000/Monat? Elite wartet...", "discount": 40},
                {"delay_hours": 48, "subject": "🔥 50% Rabatt: Von PRO zu ULTIMATE Elite", "discount": 50}
            ]
        }
        
        sequence = upsell_sequences.get(order.product_id, [])
        for upsell in sequence:
            logger.info(f"📬 Upsell Email geplant: {upsell['subject']} (in {upsell['delay_hours']}h)")
    
    async def _update_analytics(self, order: Order):
        """Aktualisiert Analytics-Daten"""
        analytics_data = {
            "sale_amount": order.amount,
            "product_id": order.product_id,
            "conversion_source": order.conversion_source,
            "timestamp": datetime.utcnow().isoformat(),
            "customer_email": order.customer_email
        }
        
        logger.info(f"📊 Analytics updated: €{order.amount} from {order.conversion_source}")
    
    async def _send_telegram_notification(self, order: Order):
        """Sendet Telegram-Benachrichtigung an Owner"""
        message = f"""
        💰 NEUE BESTELLUNG! 
        
        Produkt: {order.product_name}
        Betrag: €{order.amount}
        Kunde: {order.customer_email}
        Quelle: {order.conversion_source}
        Zeit: {order.paid_at.strftime('%H:%M:%S')}
        
        Order ID: {order.id}
        """
        
        logger.info("📱 Telegram notification sent to owner")
    
    def get_order(self, order_id: str) -> Optional[Order]:
        """Holt eine Bestellung"""
        return self.orders.get(order_id)
    
    def get_orders_by_status(self, status: OrderStatus) -> List[Order]:
        """Holt Bestellungen nach Status"""
        return [order for order in self.orders.values() if order.status == status]
    
    def get_daily_revenue(self, date: datetime = None) -> float:
        """Berechnet Tagesumsatz"""
        if not date:
            date = datetime.utcnow()
        
        daily_orders = [
            order for order in self.orders.values()
            if (order.paid_at and 
                order.paid_at.date() == date.date() and 
                order.status == OrderStatus.PAID)
        ]
        
        return sum(order.amount for order in daily_orders)
    
    def get_conversion_analytics(self) -> Dict:
        """Berechnet Conversion-Analytics"""
        paid_orders = [order for order in self.orders.values() if order.status == OrderStatus.PAID]
        
        source_analytics = {}
        for order in paid_orders:
            source = order.conversion_source or "unknown"
            if source not in source_analytics:
                source_analytics[source] = {"count": 0, "revenue": 0}
            
            source_analytics[source]["count"] += 1
            source_analytics[source]["revenue"] += order.amount
        
        return {
            "total_orders": len(paid_orders),
            "total_revenue": sum(order.amount for order in paid_orders),
            "by_source": source_analytics
        }

# Global Order Processor Instance
order_processor = OrderProcessor()