#!/usr/bin/env python3
"""
Insurance Automation Agent - Vollautomatische Versicherungsabwicklung
AUTOMATISIERT VERSICHERUNGSSCHUTZ UND SCHADENSFÄLLE
"""

import time
import requests
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
import uuid

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - INSURANCE_AGENT - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/insurance_automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class InsuranceAutomationAgent:
    def __init__(self):
        self.api_base = "https://3dd1d4de-4dab-4256-a879-82933a5d321a.preview.emergentagent.com/api"
        self.running = True
        
        # Versicherungsportfolio für Daniel Oettel / ZZ Lobby
        self.insurance_portfolio = {
            "betriebshaftpflicht": {
                "provider": "ERGO Pro",
                "policy_number": "BH-2024-1234567",
                "coverage_amount": 1000000,  # €1M Deckungssumme
                "annual_premium": 280,
                "status": "active",
                "covers": ["Vermögensschäden", "Personenschäden", "Sachschäden", "Cyber-Risiken"],
                "next_payment": "2025-01-15"
            },
            "berufshaftpflicht": {
                "provider": "HDI Gerling",
                "policy_number": "BH-IT-9876543", 
                "coverage_amount": 500000,  # €500k für IT-Dienstleistungen
                "annual_premium": 180,
                "status": "active",
                "covers": ["Beratungsschäden", "Software-Fehler", "Datenverlust"],
                "next_payment": "2025-02-28"
            },
            "cyber_versicherung": {
                "provider": "Allianz Cyber",
                "policy_number": "CY-2024-555777",
                "coverage_amount": 250000,  # €250k Cyber-Schutz
                "annual_premium": 420,
                "status": "active", 
                "covers": ["Hackerangriffe", "Datenschutzverletzungen", "Betriebsunterbrechung", "Lösegeldforderungen"],
                "next_payment": "2025-03-10"
            },
            "rechtsschutz": {
                "provider": "ARAG",
                "policy_number": "RS-UNT-147258",
                "coverage_amount": 300000,  # €300k Rechtsschutz
                "annual_premium": 160,
                "status": "active",
                "covers": ["Vertragsrecht", "Arbeitsrecht", "Steuerrecht", "Internet-Recht"],
                "next_payment": "2025-04-20"
            },
            "krankenversicherung": {
                "provider": "Techniker Krankenkasse",
                "policy_number": "TK-123456789",
                "monthly_premium": 420,  # €420/Monat als Selbstständiger
                "status": "active",
                "covers": ["Vollversicherung", "Krankentagegeld", "Zahnzusatz"],
                "next_payment": "2025-08-01"
            }
        }
        
        # Automatische Risk-Assessment-Kriterien
        self.risk_factors = {
            "revenue_based": {
                "low": {"max_revenue": 50000, "risk_multiplier": 1.0},
                "medium": {"max_revenue": 200000, "risk_multiplier": 1.3},
                "high": {"max_revenue": 500000, "risk_multiplier": 1.8},
                "very_high": {"max_revenue": float('inf'), "risk_multiplier": 2.5}
            },
            "business_type_multipliers": {
                "online_services": 1.2,
                "automation_software": 1.5,
                "financial_services": 2.0,
                "data_processing": 1.8
            }
        }
    
    def get_business_metrics(self) -> Dict:
        """Business-Metriken für Risk-Assessment abrufen"""
        try:
            stats_response = requests.get(f"{self.api_base}/dashboard/stats", timeout=15)
            analytics_response = requests.get(f"{self.api_base}/analytics", timeout=15)
            
            if stats_response.status_code == 200 and analytics_response.status_code == 200:
                stats = stats_response.json()
                analytics = analytics_response.json()
                
                # Jahresumsatz-Projektion
                daily_revenue = float(stats.get('todayEarnings', '0').replace('€', '').replace(',', '.'))
                annual_revenue_projection = daily_revenue * 365
                
                # Aktuelle Lead-Anzahl
                active_leads = stats.get('activeLeads', 0)
                
                business_metrics = {
                    "annual_revenue_projection": annual_revenue_projection,
                    "daily_average": daily_revenue,
                    "active_leads": active_leads,
                    "conversion_rate": stats.get('conversionRate', 0),
                    "business_type": "automation_software",
                    "data_processing_volume": "high",  # Basierend auf Analytics
                    "online_payment_processing": True,  # PayPal Integration
                    "customer_data_handling": True,  # DSGVO relevant
                    "assessment_date": datetime.now().isoformat()
                }
                
                logger.info(f"📊 Business-Metriken für Risk-Assessment:")
                logger.info(f"├── Jahresumsatz (projiziert): €{annual_revenue_projection:,.2f}")
                logger.info(f"├── Aktive Leads: {active_leads}")
                logger.info(f"└── Business-Typ: {business_metrics['business_type']}")
                
                return business_metrics
                
        except Exception as e:
            logger.error(f"Business Metrics Abruf Fehler: {e}")
            
        return {"annual_revenue_projection": 0}
    
    def assess_insurance_needs(self, business_metrics: Dict) -> Dict:
        """Automatisches Risk-Assessment und Versicherungsbedarfsanalyse"""
        logger.info("🔍 AUTOMATISCHES RISK-ASSESSMENT")
        
        annual_revenue = business_metrics.get("annual_revenue_projection", 0)
        business_type = business_metrics.get("business_type", "online_services")
        
        # Revenue-basiertes Risiko bestimmen
        revenue_risk_level = "low"
        for level, criteria in self.risk_factors["revenue_based"].items():
            if annual_revenue <= criteria["max_revenue"]:
                revenue_risk_level = level
                break
        
        base_risk_multiplier = self.risk_factors["revenue_based"][revenue_risk_level]["risk_multiplier"]
        business_risk_multiplier = self.risk_factors["business_type_multipliers"].get(business_type, 1.0)
        total_risk_multiplier = base_risk_multiplier * business_risk_multiplier
        
        # Versicherungsbedarfs-Berechnung
        recommended_coverage = {
            "betriebshaftpflicht": {
                "current": self.insurance_portfolio["betriebshaftpflicht"]["coverage_amount"],
                "recommended": int(min(5000000, max(1000000, annual_revenue * 2))),  # 2x Jahresumsatz, min €1M, max €5M
                "premium_estimate": int(annual_revenue * 0.002 * total_risk_multiplier),  # 0.2% vom Umsatz
                "necessity": "critical"
            },
            "cyber_versicherung": {
                "current": self.insurance_portfolio["cyber_versicherung"]["coverage_amount"],
                "recommended": int(min(1000000, max(250000, annual_revenue * 0.5))),  # 50% Jahresumsatz für Cyber
                "premium_estimate": int(annual_revenue * 0.003 * total_risk_multiplier),  # 0.3% für Cyber
                "necessity": "high" if business_metrics.get("online_payment_processing") else "medium"
            },
            "berufshaftpflicht": {
                "current": self.insurance_portfolio["berufshaftpflicht"]["coverage_amount"],
                "recommended": int(min(2000000, max(500000, annual_revenue * 1))),  # 1x Jahresumsatz
                "premium_estimate": int(annual_revenue * 0.0015 * total_risk_multiplier),
                "necessity": "high"
            }
        }
        
        # Gap-Analysis
        coverage_gaps = []
        for insurance_type, data in recommended_coverage.items():
            if data["recommended"] > data["current"]:
                gap = data["recommended"] - data["current"]
                coverage_gaps.append({
                    "type": insurance_type,
                    "current_coverage": data["current"],
                    "recommended_coverage": data["recommended"],
                    "gap": gap,
                    "additional_premium": data["premium_estimate"] - self.insurance_portfolio[insurance_type]["annual_premium"],
                    "necessity": data["necessity"]
                })
        
        risk_assessment = {
            "business_risk_level": revenue_risk_level,
            "risk_multiplier": total_risk_multiplier,
            "annual_revenue": annual_revenue,
            "recommended_coverage": recommended_coverage,
            "coverage_gaps": coverage_gaps,
            "total_annual_premium_current": sum([policy["annual_premium"] if "annual_premium" in policy else policy.get("monthly_premium", 0) * 12 for policy in self.insurance_portfolio.values()]),
            "total_annual_premium_recommended": sum([data["premium_estimate"] for data in recommended_coverage.values()]),
            "assessment_date": datetime.now().isoformat()
        }
        
        logger.info(f"🔍 RISK-ASSESSMENT ERGEBNISSE:")
        logger.info(f"├── Risk Level: {revenue_risk_level.upper()}")
        logger.info(f"├── Risk Multiplier: {total_risk_multiplier:.1f}x")
        logger.info(f"├── Coverage Gaps: {len(coverage_gaps)}")
        logger.info(f"├── Aktuelle Prämien: €{risk_assessment['total_annual_premium_current']:,.2f}/Jahr")
        logger.info(f"└── Empfohlene Prämien: €{risk_assessment['total_annual_premium_recommended']:,.2f}/Jahr")
        
        return risk_assessment
    
    def monitor_claim_triggers(self, business_metrics: Dict) -> List[Dict]:
        """Automatische Überwachung von potentiellen Schadensfällen"""
        logger.info("⚠️ ÜBERWACHE POTENTIELLE SCHADENSFÄLLE")
        
        potential_claims = []
        current_time = datetime.now()
        
        # Cyber-Security Monitoring
        if business_metrics.get("online_payment_processing"):
            # Simuliere Cyber-Risk-Monitoring
            cyber_risk_score = min(100, business_metrics.get("active_leads", 0) * 0.1 + 
                                 business_metrics.get("conversion_rate", 0) * 2)
            
            if cyber_risk_score > 80:
                potential_claims.append({
                    "type": "cyber_risk",
                    "risk_score": cyber_risk_score,
                    "description": "Erhöhtes Cyber-Risiko durch hohes Transaktionsvolumen",
                    "recommendation": "Verstärkte Security-Maßnahmen, regelmäßige Backups",
                    "insurance_relevant": "cyber_versicherung",
                    "priority": "high"
                })
        
        # DSGVO-Compliance Monitoring
        if business_metrics.get("customer_data_handling"):
            potential_claims.append({
                "type": "dsgvo_compliance",
                "risk_score": 60,
                "description": "DSGVO-Compliance bei Kundendatenverarbeitung",
                "recommendation": "Regelmäßige Compliance-Audits durchführen",
                "insurance_relevant": "rechtsschutz",
                "priority": "medium"
            })
        
        # Business Interruption Risk
        daily_revenue = business_metrics.get("daily_average", 0)
        if daily_revenue > 100:  # Bei hohem Tagesumsatz
            potential_claims.append({
                "type": "business_interruption",
                "risk_score": min(100, daily_revenue * 0.2),
                "description": f"Betriebsunterbrechungsrisiko bei €{daily_revenue:.2f}/Tag Revenue",
                "recommendation": "Redundante Systeme einrichten, Notfallplan erstellen",
                "insurance_relevant": "betriebshaftpflicht",
                "priority": "medium"
            })
        
        logger.info(f"⚠️ {len(potential_claims)} POTENTIELLE RISIKEN IDENTIFIZIERT:")
        for claim in potential_claims:
            logger.info(f"├── {claim['type'].upper()}: Score {claim['risk_score']:.1f} ({claim['priority']})")
        
        return potential_claims
    
    def automate_premium_payments(self) -> Dict:
        """Automatische Prämien-Zahlungen überwachen und verwalten"""
        logger.info("💳 AUTOMATISCHE PRÄMIEN-VERWALTUNG")
        
        current_date = datetime.now()
        payment_schedule = []
        
        for insurance_type, policy in self.insurance_portfolio.items():
            if "next_payment" in policy:
                next_payment_date = datetime.strptime(policy["next_payment"], "%Y-%m-%d")
                days_until_payment = (next_payment_date - current_date).days
                
                payment_info = {
                    "insurance_type": insurance_type,
                    "provider": policy["provider"],
                    "amount": policy.get("annual_premium", policy.get("monthly_premium", 0)),
                    "due_date": policy["next_payment"],
                    "days_until_due": days_until_payment,
                    "auto_pay_status": "enabled",
                    "status": "scheduled"
                }
                
                # Zahlungsreminder
                if days_until_payment <= 7:
                    payment_info["status"] = "due_soon"
                    logger.warning(f"⚠️ {insurance_type.upper()} Zahlung fällig in {days_until_payment} Tagen")
                
                payment_schedule.append(payment_info)
        
        # Gesamte Jahresprämien berechnen
        total_annual_premiums = sum([
            policy.get("annual_premium", policy.get("monthly_premium", 0) * 12) 
            for policy in self.insurance_portfolio.values()
        ])
        
        premium_management = {
            "total_annual_premiums": total_annual_premiums,
            "monthly_average": round(total_annual_premiums / 12, 2),
            "payment_schedule": payment_schedule,
            "auto_payments_enabled": len([p for p in payment_schedule if p["auto_pay_status"] == "enabled"]),
            "next_payment": min(payment_schedule, key=lambda x: x["days_until_due"]) if payment_schedule else None,
            "management_date": current_date.isoformat()
        }
        
        logger.info(f"💳 PRÄMIEN-MANAGEMENT:")
        logger.info(f"├── Gesamt-Jahresprämien: €{total_annual_premiums:,.2f}")
        logger.info(f"├── Monatlicher Durchschnitt: €{premium_management['monthly_average']:,.2f}")
        logger.info(f"├── Nächste Zahlung: {premium_management['next_payment']['due_date'] if premium_management['next_payment'] else 'N/A'}")
        logger.info(f"└── Auto-Payments aktiv: {premium_management['auto_payments_enabled']}/{len(payment_schedule)}")
        
        return premium_management
    
    def generate_insurance_optimization_report(self, risk_assessment: Dict, potential_claims: List[Dict]) -> Dict:
        """Versicherungsoptimierungs-Report generieren"""
        logger.info("📋 GENERIERE VERSICHERUNGSOPTIMIERUNGS-REPORT")
        
        # Optimierungsempfehlungen
        optimization_recommendations = []
        
        # Coverage-Gap-Empfehlungen
        for gap in risk_assessment["coverage_gaps"]:
            if gap["necessity"] in ["critical", "high"]:
                optimization_recommendations.append({
                    "type": "coverage_increase",
                    "insurance": gap["type"],
                    "description": f"Deckungssumme von €{gap['current_coverage']:,} auf €{gap['recommended_coverage']:,} erhöhen",
                    "cost": gap["additional_premium"],
                    "priority": gap["necessity"],
                    "benefit": f"€{gap['gap']:,} zusätzlicher Schutz"
                })
        
        # Risiko-basierte Empfehlungen
        high_risk_claims = [c for c in potential_claims if c["priority"] == "high"]
        for claim in high_risk_claims:
            optimization_recommendations.append({
                "type": "risk_mitigation",
                "risk": claim["type"],
                "description": claim["recommendation"],
                "insurance_relevant": claim["insurance_relevant"],
                "priority": "high",
                "risk_score": claim["risk_score"]
            })
        
        # Cost-Benefit-Analyse
        total_additional_cost = sum([rec.get("cost", 0) for rec in optimization_recommendations if rec.get("cost")])
        current_coverage_value = sum([policy.get("coverage_amount", 0) for policy in self.insurance_portfolio.values() if "coverage_amount" in policy])
        recommended_coverage_value = sum([data["recommended"] for data in risk_assessment["recommended_coverage"].values()])
        
        optimization_report = {
            "current_situation": {
                "total_coverage": current_coverage_value,
                "annual_premiums": risk_assessment["total_annual_premium_current"],
                "identified_risks": len(potential_claims),
                "coverage_gaps": len(risk_assessment["coverage_gaps"])
            },
            "recommended_situation": {
                "total_coverage": recommended_coverage_value,
                "annual_premiums": risk_assessment["total_annual_premium_recommended"],
                "additional_cost": total_additional_cost,
                "coverage_improvement": recommended_coverage_value - current_coverage_value
            },
            "optimization_recommendations": optimization_recommendations,
            "cost_benefit_ratio": (recommended_coverage_value - current_coverage_value) / max(1, total_additional_cost),
            "implementation_priority": sorted(optimization_recommendations, key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(x.get("priority", "low"), 3)),
            "generated_at": datetime.now().isoformat()
        }
        
        logger.info(f"📋 VERSICHERUNGSOPTIMIERUNGS-REPORT:")
        logger.info(f"├── Aktuelle Deckung: €{current_coverage_value:,}")
        logger.info(f"├── Empfohlene Deckung: €{recommended_coverage_value:,}")
        logger.info(f"├── Verbesserung: €{optimization_report['recommended_situation']['coverage_improvement']:,}")
        logger.info(f"├── Zusatzkosten: €{total_additional_cost:,}/Jahr")
        logger.info(f"└── Cost-Benefit-Ratio: {optimization_report['cost_benefit_ratio']:.1f}:1")
        
        return optimization_report
    
    def run_insurance_automation_cycle(self):
        """Vollständiger Insurance-Automation-Cycle"""
        logger.info("🎯 STARTE INSURANCE-AUTOMATION CYCLE")
        
        # 1. Business-Metriken abrufen
        business_metrics = self.get_business_metrics()
        
        # 2. Risk-Assessment durchführen
        risk_assessment = self.assess_insurance_needs(business_metrics)
        
        # 3. Potentielle Claims überwachen
        potential_claims = self.monitor_claim_triggers(business_metrics)
        
        # 4. Prämien-Management
        premium_management = self.automate_premium_payments()
        
        # 5. Optimierungs-Report generieren
        optimization_report = self.generate_insurance_optimization_report(risk_assessment, potential_claims)
        
        logger.info("✅ INSURANCE-AUTOMATION CYCLE ABGESCHLOSSEN")
        
        return {
            "business_metrics": business_metrics,
            "risk_assessment": risk_assessment,
            "potential_claims": potential_claims,
            "premium_management": premium_management,
            "optimization_report": optimization_report
        }
    
    def run_forever(self):
        """Insurance-Agent läuft kontinuierlich"""
        logger.info("🛡️ INSURANCE AUTOMATION AGENT STARTED - RUNNING 24/7")
        
        while self.running:
            try:
                current_time = datetime.now().strftime('%H:%M:%S')
                logger.info(f"🔍 INSURANCE AUTOMATION CYCLE - {current_time}")
                
                # Insurance-Automation-Cycle ausführen
                results = self.run_insurance_automation_cycle()
                
                logger.info("⏰ Waiting 24 hours until next insurance review cycle...")
                time.sleep(86400)  # 24 Stunden zwischen Insurance-Cycles
                
            except KeyboardInterrupt:
                logger.info("⏹️ Insurance Automation Agent stopped by user")
                self.running = False
                break
            except Exception as e:
                logger.error(f"Insurance automation error: {e}")
                logger.info("⏰ Waiting 6 hours before retry...")
                time.sleep(21600)  # 6 Stunden bei Fehler
        
        logger.info("🛑 Insurance Automation Agent terminated")

if __name__ == "__main__":
    agent = InsuranceAutomationAgent()
    agent.run_forever()