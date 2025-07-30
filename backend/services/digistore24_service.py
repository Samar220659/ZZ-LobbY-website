#!/usr/bin/env python3
"""
DigiStore24 Real API Integration Service
Keine Mock-Daten - nur echte API-Calls für Produktionsumsätze
"""

import os
import requests
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import asyncio
import aiohttp
from dataclasses import dataclass

@dataclass
class DigiStore24Product:
    id: str
    name: str
    price: float
    currency: str
    commission_rate: float
    category: str
    sales_count: int
    created_at: datetime

@dataclass
class DigiStore24Sale:
    order_id: str
    product_id: str
    product_name: str
    amount: float
    currency: str
    commission: float
    sale_date: datetime
    customer_email: str
    affiliate_id: str

class DigiStore24Service:
    """Echter DigiStore24 API Service - Keine Simulationen"""
    
    def __init__(self):
        self.api_key = os.getenv("DIGISTORE24_API_KEY", "1417598-BP9FgEF7laOKpzh5wHMtaEr9w1k5qJyWHoHes")
        self.base_url = "https://www.digistore24.com/api/call"
        self.headers = {
            "X-DS-API-KEY": self.api_key,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        self.logger = logging.getLogger("DigiStore24Service")
        
    async def _make_api_request(self, endpoint: str, params: Dict = None) -> Dict[str, Any]:
        """Macht echten API-Call zu DigiStore24"""
        try:
            url = f"{self.base_url}/{endpoint}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=self.headers, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        self.logger.info(f"DigiStore24 API success: {endpoint}")
                        return data
                    else:
                        self.logger.error(f"DigiStore24 API error: {response.status} - {await response.text()}")
                        return {"error": f"API call failed with status {response.status}"}
                        
        except Exception as e:
            self.logger.error(f"DigiStore24 API exception: {str(e)}")
            return {"error": str(e)}
    
    async def get_real_products(self) -> List[DigiStore24Product]:
        """Holt echte Produktdaten von DigiStore24"""
        try:
            data = await self._make_api_request("listProducts")
            
            if "error" in data:
                self.logger.error(f"Fehler beim Abrufen der Produkte: {data['error']}")
                return []
            
            products = []
            if "data" in data and isinstance(data["data"], list):
                for product_data in data["data"]:
                    try:
                        product = DigiStore24Product(
                            id=product_data.get("product_id", "unknown"),
                            name=product_data.get("product_name", "Unknown Product"),
                            price=float(product_data.get("price", 0.0)),
                            currency=product_data.get("currency", "EUR"),
                            commission_rate=float(product_data.get("commission_rate", 0.0)) / 100,
                            category=product_data.get("category", "General"),
                            sales_count=int(product_data.get("sales_count", 0)),
                            created_at=datetime.now()
                        )
                        products.append(product)
                    except Exception as e:
                        self.logger.warning(f"Fehler beim Verarbeiten von Produkt: {e}")
                        continue
            
            self.logger.info(f"Erfolgreich {len(products)} echte Produkte abgerufen")
            return products
            
        except Exception as e:
            self.logger.error(f"Fehler beim Abrufen der Produkte: {str(e)}")
            return []
    
    async def get_real_sales_data(self, days_back: int = 30) -> List[DigiStore24Sale]:
        """Holt echte Verkaufsdaten von DigiStore24"""
        try:
            start_date = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")
            end_date = datetime.now().strftime("%Y-%m-%d")
            
            params = {
                "start_date": start_date,
                "end_date": end_date
            }
            
            data = await self._make_api_request("listPurchases", params)
            
            if "error" in data:
                self.logger.error(f"Fehler beim Abrufen der Verkäufe: {data['error']}")
                return []
            
            sales = []
            if "data" in data and isinstance(data["data"], list):
                for sale_data in data["data"]:
                    try:
                        sale = DigiStore24Sale(
                            order_id=sale_data.get("order_id", "unknown"),
                            product_id=sale_data.get("product_id", "unknown"),
                            product_name=sale_data.get("product_name", "Unknown Product"),
                            amount=float(sale_data.get("total_amount", 0.0)),
                            currency=sale_data.get("currency", "EUR"),
                            commission=float(sale_data.get("affiliate_commission", 0.0)),
                            sale_date=datetime.fromisoformat(sale_data.get("created_at", datetime.now().isoformat())),
                            customer_email=sale_data.get("buyer_email", "unknown@unknown.com"),
                            affiliate_id=sale_data.get("affiliate_id", "direct")
                        )
                        sales.append(sale)
                    except Exception as e:
                        self.logger.warning(f"Fehler beim Verarbeiten von Verkauf: {e}")
                        continue
            
            self.logger.info(f"Erfolgreich {len(sales)} echte Verkäufe abgerufen")
            return sales
            
        except Exception as e:
            self.logger.error(f"Fehler beim Abrufen der Verkäufe: {str(e)}")
            return []
    
    async def get_real_affiliate_stats(self) -> Dict[str, Any]:
        """Holt echte Affiliate-Statistiken von DigiStore24"""
        try:
            data = await self._make_api_request("getAffiliateStats")
            
            if "error" in data:
                self.logger.error(f"Fehler beim Abrufen der Affiliate-Stats: {data['error']}")
                return {}
            
            if "data" in data:
                stats = data["data"]
                return {
                    "total_commissions": float(stats.get("total_commissions", 0.0)),
                    "pending_commissions": float(stats.get("pending_commissions", 0.0)),
                    "paid_commissions": float(stats.get("paid_commissions", 0.0)),
                    "total_sales": int(stats.get("total_sales", 0)),
                    "conversion_rate": float(stats.get("conversion_rate", 0.0)),
                    "top_products": stats.get("top_products", []),
                    "last_updated": datetime.now()
                }
            
            return {}
            
        except Exception as e:
            self.logger.error(f"Fehler beim Abrufen der Affiliate-Stats: {str(e)}")
            return {}
    
    async def create_real_affiliate_link(self, product_id: str, affiliate_id: str = None) -> str:
        """Erstellt echten Affiliate-Link für DigiStore24 Produkt"""
        try:
            params = {
                "product_id": product_id,
                "affiliate_id": affiliate_id or "default"
            }
            
            data = await self._make_api_request("createAffiliateLink", params)
            
            if "error" in data:
                self.logger.error(f"Fehler beim Erstellen des Affiliate-Links: {data['error']}")
                return ""
            
            if "data" in data and "affiliate_link" in data["data"]:
                link = data["data"]["affiliate_link"]
                self.logger.info(f"Affiliate-Link erstellt für Produkt {product_id}")
                return link
            
            return ""
            
        except Exception as e:
            self.logger.error(f"Fehler beim Erstellen des Affiliate-Links: {str(e)}")
            return ""
    
    async def get_real_revenue_analytics(self) -> Dict[str, Any]:
        """Berechnet echte Umsatz-Analytics basierend auf DigiStore24 Daten"""
        try:
            # Hole echte Verkaufsdaten der letzten 30 Tage
            sales = await self.get_real_sales_data(30)
            
            if not sales:
                return {
                    "total_revenue": 0.0,
                    "commission_earned": 0.0,
                    "sales_count": 0,
                    "avg_order_value": 0.0,
                    "daily_avg_revenue": 0.0,
                    "top_products": [],
                    "error": "Keine Verkaufsdaten verfügbar"
                }
            
            # Berechne echte Metriken
            total_revenue = sum(sale.amount for sale in sales)
            total_commission = sum(sale.commission for sale in sales)
            sales_count = len(sales)
            avg_order_value = total_revenue / sales_count if sales_count > 0 else 0.0
            daily_avg_revenue = total_revenue / 30
            
            # Top-Produkte ermitteln
            product_sales = {}
            for sale in sales:
                if sale.product_id not in product_sales:
                    product_sales[sale.product_id] = {
                        "name": sale.product_name,
                        "sales": 0,
                        "revenue": 0.0
                    }
                product_sales[sale.product_id]["sales"] += 1
                product_sales[sale.product_id]["revenue"] += sale.amount
            
            top_products = sorted(
                [{"id": pid, **data} for pid, data in product_sales.items()],
                key=lambda x: x["revenue"],
                reverse=True
            )[:5]
            
            analytics = {
                "total_revenue": round(total_revenue, 2),
                "commission_earned": round(total_commission, 2),
                "sales_count": sales_count,
                "avg_order_value": round(avg_order_value, 2),
                "daily_avg_revenue": round(daily_avg_revenue, 2),
                "monthly_projection": round(daily_avg_revenue * 30, 2),
                "top_products": top_products,
                "last_updated": datetime.now(),
                "data_source": "DigiStore24 Live API"
            }
            
            self.logger.info(f"Echte Revenue-Analytics berechnet: €{total_revenue} Gesamtumsatz")
            return analytics
            
        except Exception as e:
            self.logger.error(f"Fehler beim Berechnen der Revenue-Analytics: {str(e)}")
            return {"error": str(e)}

# Globale DigiStore24 Service Instanz
digistore24_service = DigiStore24Service()