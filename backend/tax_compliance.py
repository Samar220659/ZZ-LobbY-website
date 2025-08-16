"""
Steuerliches Compliance-System für Deutschland
Automatische MwSt-Berechnung, Rechnungserstellung, Elster-Vorbereitung
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass
import uuid
import logging

logger = logging.getLogger(__name__)

@dataclass
class TaxConfig:
    """Deutsche Steuer-Konfiguration"""
    mwst_rate_standard: float = 0.19  # 19% Standardsatz
    mwst_rate_reduced: float = 0.07   # 7% ermäßigter Satz
    kleinunternehmer_grenze: float = 22000.00  # €22.000 Kleinunternehmergrenze 2025
    steuer_id: str = "69377041825"
    umsatzsteuer_id: str = "DE453548228"
    business_owner: str = "Daniel Oettel"
    business_email: str = "a22061981@gmx.de"

@dataclass
class Invoice:
    """Rechnung nach deutschen Vorgaben"""
    invoice_id: str
    invoice_date: datetime
    customer_name: str
    customer_email: str
    customer_address: Optional[str]
    items: List[Dict]
    subtotal: float
    tax_rate: float
    tax_amount: float
    total_amount: float
    payment_method: str
    is_b2b: bool = False
    customer_ust_id: Optional[str] = None
    reverse_charge: bool = False

class GermanTaxCompliance:
    """Deutsche Steuerliche Compliance"""
    
    def __init__(self, db):
        self.db = db
        self.tax_config = TaxConfig()
        self.current_year = datetime.now().year
        
    async def create_invoice(self, sale_data: Dict) -> Invoice:
        """Erstelle steuerlich korrekte Rechnung"""
        
        # Generate invoice number
        invoice_count = await self.db.invoices.count_documents({
            "invoice_date": {
                "$gte": datetime(self.current_year, 1, 1),
                "$lt": datetime(self.current_year + 1, 1, 1)
            }
        })
        
        invoice_id = f"ZZ-{self.current_year}-{str(invoice_count + 1).zfill(4)}"
        
        # Calculate tax
        subtotal = float(sale_data.get('amount', 0))
        is_b2b = bool(sale_data.get('customer_ust_id'))
        
        # Determine tax rate
        if is_b2b and sale_data.get('reverse_charge', False):
            tax_rate = 0.0  # Reverse Charge
            tax_amount = 0.0
        else:
            tax_rate = self.tax_config.mwst_rate_standard
            tax_amount = subtotal * tax_rate
            
        total_amount = subtotal + tax_amount
        
        invoice = Invoice(
            invoice_id=invoice_id,
            invoice_date=datetime.now(),
            customer_name=sale_data.get('customer_name', 'Unbekannt'),
            customer_email=sale_data.get('customer_email', ''),
            customer_address=sale_data.get('customer_address'),
            items=[{
                "description": sale_data.get('product_name', 'ZZ-Lobby Elite Marketing System'),
                "quantity": 1,
                "unit_price": subtotal,
                "total_price": subtotal
            }],
            subtotal=subtotal,
            tax_rate=tax_rate,
            tax_amount=tax_amount,
            total_amount=total_amount,
            payment_method=sale_data.get('payment_method', 'Online'),
            is_b2b=is_b2b,
            customer_ust_id=sale_data.get('customer_ust_id'),
            reverse_charge=sale_data.get('reverse_charge', False)
        )
        
        # Store in database
        invoice_doc = {
            "invoice_id": invoice.invoice_id,
            "invoice_date": invoice.invoice_date.isoformat(),
            "customer_name": invoice.customer_name,
            "customer_email": invoice.customer_email,
            "customer_address": invoice.customer_address,
            "items": invoice.items,
            "subtotal": invoice.subtotal,
            "tax_rate": invoice.tax_rate,
            "tax_amount": invoice.tax_amount,
            "total_amount": invoice.total_amount,
            "payment_method": invoice.payment_method,
            "is_b2b": invoice.is_b2b,
            "customer_ust_id": invoice.customer_ust_id,
            "reverse_charge": invoice.reverse_charge,
            "created_at": datetime.now().isoformat()
        }
        
        result = await self.db.invoices.insert_one(invoice_doc)
        logger.info(f"📄 Rechnung erstellt: {invoice_id} - €{total_amount:.2f}")
        
        return invoice
        
    def generate_invoice_pdf_content(self, invoice: Invoice) -> str:
        """Generiere Rechnungs-HTML/PDF Content"""
        
        return f"""
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Rechnung {invoice.invoice_id}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .header {{ text-align: center; margin-bottom: 40px; }}
                .company {{ font-weight: bold; font-size: 18px; color: #333; }}
                .invoice-details {{ margin: 30px 0; }}
                .customer-info {{ background: #f5f5f5; padding: 15px; margin: 20px 0; }}
                .items-table {{ width: 100%; border-collapse: collapse; margin: 30px 0; }}
                .items-table th, .items-table td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                .items-table th {{ background-color: #f8f9fa; }}
                .totals {{ text-align: right; margin: 30px 0; }}
                .tax-info {{ background: #e8f4f8; padding: 15px; margin: 30px 0; font-size: 12px; }}
                .footer {{ margin-top: 50px; font-size: 11px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company">ZZ-Lobby Elite Marketing</div>
                <div>Daniel Oettel • Gewerbetreibender</div>
                <div>E-Mail: a22061981@gmx.de</div>
            </div>
            
            <h2>Rechnung {invoice.invoice_id}</h2>
            
            <div class="invoice-details">
                <strong>Rechnungsdatum:</strong> {invoice.invoice_date.strftime('%d.%m.%Y')}<br>
                <strong>Leistungsdatum:</strong> {invoice.invoice_date.strftime('%d.%m.%Y')}
            </div>
            
            <div class="customer-info">
                <strong>Rechnungsempfänger:</strong><br>
                {invoice.customer_name}<br>
                {invoice.customer_email}<br>
                {invoice.customer_address or 'Adresse auf Anfrage'}
                {f'<br><strong>USt-IdNr:</strong> {invoice.customer_ust_id}' if invoice.customer_ust_id else ''}
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Leistungsbeschreibung</th>
                        <th>Menge</th>
                        <th>Einzelpreis</th>
                        <th>Gesamtpreis</th>
                    </tr>
                </thead>
                <tbody>
                    {''.join([f'''
                    <tr>
                        <td>{item['description']}</td>
                        <td>{item['quantity']}</td>
                        <td>€{item['unit_price']:.2f}</td>
                        <td>€{item['total_price']:.2f}</td>
                    </tr>
                    ''' for item in invoice.items])}
                </tbody>
            </table>
            
            <div class="totals">
                <p><strong>Nettobetrag: €{invoice.subtotal:.2f}</strong></p>
                {f'<p>MwSt ({invoice.tax_rate*100:.0f}%): €{invoice.tax_amount:.2f}</p>' if invoice.tax_amount > 0 else ''}
                {f'<p><em>Reverse Charge Verfahren gem. § 13b UStG</em></p>' if invoice.reverse_charge else ''}
                <p style="font-size: 18px; font-weight: bold;">Gesamtbetrag: €{invoice.total_amount:.2f}</p>
            </div>
            
            <div class="tax-info">
                <strong>Steuerliche Angaben:</strong><br>
                Steuernummer: {self.tax_config.steuer_id}<br>
                Umsatzsteuer-Identifikationsnummer: {self.tax_config.umsatzsteuer_id}<br>
                {f'Kleinunternehmerregelung nach § 19 UStG - Keine MwSt ausgewiesen' if invoice.tax_amount == 0 and not invoice.reverse_charge else ''}
            </div>
            
            <div class="footer">
                <p>Zahlungsweise: {invoice.payment_method}</p>
                <p>Vielen Dank für Ihren Auftrag!</p>
                <hr>
                <p>Daniel Oettel • ZZ-Lobby Elite Marketing • a22061981@gmx.de</p>
                <p>Steuer-Nr: {self.tax_config.steuer_id} • USt-IdNr: {self.tax_config.umsatzsteuer_id}</p>
            </div>
        </body>
        </html>
        """
        
    async def get_monthly_tax_summary(self, year: int, month: int) -> Dict:
        """Monatliche Steuer-Zusammenfassung für Elster"""
        
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
            
        # Get all invoices for the month
        invoices = await self.db.invoices.find({
            "invoice_date": {
                "$gte": start_date.isoformat(),
                "$lt": end_date.isoformat()
            }
        }).to_list(1000)
        
        # Calculate totals
        total_revenue = sum(float(inv.get('subtotal', 0)) for inv in invoices)
        total_tax = sum(float(inv.get('tax_amount', 0)) for inv in invoices)
        b2b_revenue = sum(float(inv.get('subtotal', 0)) for inv in invoices if inv.get('is_b2b', False))
        b2c_revenue = total_revenue - b2b_revenue
        
        return {
            "period": f"{month:02d}/{year}",
            "total_invoices": len(invoices),
            "total_revenue_net": round(total_revenue, 2),
            "total_tax_collected": round(total_tax, 2),
            "b2b_revenue": round(b2b_revenue, 2),
            "b2c_revenue": round(b2c_revenue, 2),
            "reverse_charge_transactions": len([inv for inv in invoices if inv.get('reverse_charge', False)]),
            "elster_data": {
                "kz_81": round(total_tax, 2),  # Umsatzsteuer 19%
                "kz_60": round(total_revenue, 2),  # Umsätze 19%
                "kz_83": 0,  # Vorsteuer (für Dienstleister meist 0)
                "kz_83_vorsteuer": 0  # Vorsteuerbetrag
            }
        }
        
    async def get_yearly_tax_summary(self, year: int) -> Dict:
        """Jährliche Steuer-Zusammenfassung"""
        
        start_date = datetime(year, 1, 1)
        end_date = datetime(year + 1, 1, 1)
        
        invoices = await self.db.invoices.find({
            "invoice_date": {
                "$gte": start_date.isoformat(),
                "$lt": end_date.isoformat()
            }
        }).to_list(10000)
        
        monthly_summaries = []
        for month in range(1, 13):
            summary = await self.get_monthly_tax_summary(year, month)
            monthly_summaries.append(summary)
            
        total_revenue = sum(s['total_revenue_net'] for s in monthly_summaries)
        total_tax = sum(s['total_tax_collected'] for s in monthly_summaries)
        
        return {
            "year": year,
            "total_revenue_net": round(total_revenue, 2),
            "total_tax_collected": round(total_tax, 2),
            "monthly_breakdown": monthly_summaries,
            "kleinunternehmer_status": total_revenue < self.tax_config.kleinunternehmer_grenze,
            "elster_jahressumme": {
                "gesamtumsatz": round(total_revenue, 2),
                "steuer_geschuldet": round(total_tax, 2)
            }
        }
        
    async def generate_elster_export(self, year: int, month: int) -> Dict:
        """Generiere Elster-Export für USt-Voranmeldung"""
        
        summary = await self.get_monthly_tax_summary(year, month)
        
        return {
            "period": f"{year}-{month:02d}",
            "steuernummer": self.tax_config.steuer_id,
            "ust_id": self.tax_config.umsatzsteuer_id,
            "unternehmer": self.tax_config.business_owner,
            "elster_fields": {
                # Umsätze
                "Kz60": summary['elster_data']['kz_60'],  # steuerpflichtige Umsätze 19%
                "Kz81": summary['elster_data']['kz_81'],  # Umsatzsteuer 19%
                
                # Vorsteuer (meist 0 für Dienstleister)
                "Kz66": 0,  # Vorsteuer
                "Kz83": summary['elster_data']['kz_83'],  # Vorsteuerbetrag
                
                # Zahllast
                "Kz85": max(0, summary['elster_data']['kz_81'] - summary['elster_data']['kz_83'])  # Zahllast
            },
            "export_date": datetime.now().isoformat(),
            "notes": f"Automatisch generiert für {len(summary)} Rechnungen"
        }
        
    async def get_tax_compliance_status(self) -> Dict:
        """Aktueller Compliance Status"""
        
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        # Get current month data
        monthly_summary = await self.get_monthly_tax_summary(current_year, current_month)
        
        # Check upcoming deadlines
        next_month = current_month + 1 if current_month < 12 else 1
        next_year = current_year if current_month < 12 else current_year + 1
        
        # USt-Voranmeldung ist bis zum 10. des Folgemonats fällig
        next_deadline = datetime(next_year, next_month, 10)
        days_until_deadline = (next_deadline - datetime.now()).days
        
        return {
            "current_period": f"{current_month:02d}/{current_year}",
            "steuer_id": self.tax_config.steuer_id,
            "umsatzsteuer_id": self.tax_config.umsatzsteuer_id,
            "business_owner": self.tax_config.business_owner,
            "current_month_revenue": monthly_summary['total_revenue_net'],
            "current_month_tax": monthly_summary['total_tax_collected'],
            "next_ust_deadline": next_deadline.strftime('%d.%m.%Y'),
            "days_until_deadline": days_until_deadline,
            "deadline_status": "urgent" if days_until_deadline <= 3 else "ok",
            "compliance_level": "excellent" if days_until_deadline > 7 else "warning",
            "monthly_invoices": monthly_summary['total_invoices']
        }

# Initialize global tax system
tax_system = None

def init_tax_system(db):
    """Initialize tax compliance system"""
    global tax_system
    tax_system = GermanTaxCompliance(db)
    logger.info("🏛️ German Tax Compliance System initialized")
    
def get_tax_system():
    """Get tax compliance system instance"""
    global tax_system
    return tax_system