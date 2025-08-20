#!/usr/bin/env python3
"""
ZZ-Lobby Elite - NEUE AI Features Testing
Test für echte OpenAI GPT-4o-mini Integration
"""

import requests
import json
import sys
from datetime import datetime

class NewAITester:
    def __init__(self):
        # Get backend URL from frontend env
        self.base_url = "https://elite-control-room-1.preview.emergentagent.com"
        try:
            with open('/app/frontend/.env', 'r') as f:
                for line in f:
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        self.base_url = line.split('=')[1].strip()
                        break
        except Exception:
            pass
        
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.session.timeout = 30
        
        print(f"🤖 Testing NEUE AI Features at: {self.api_url}")
    
    def log_test(self, test_name: str, success: bool, message: str, details: dict = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"    Details: {json.dumps(details, indent=2, default=str)}")
        return success
    
    def test_new_ai_sales_chat(self):
        """Test NEUE ECHTE AI Sales Chat System - GPT-4o-mini Integration"""
        print("\n🎯 Testing AI Sales Chat - Restaurant Marketing Automation Scenario")
        
        try:
            # Test Szenario aus Review Request: Restaurant Marketing Automation
            chat_data = {
                "conversation_id": "test-ai-chat-001",
                "customer_message": "Hallo, ich interessiere mich für Marketing Automation für mein Restaurant in Leipzig",
                "customer_email": "restaurant@leipzig.de"
            }
            
            print(f"📤 Sending: {chat_data}")
            response = self.session.post(f"{self.api_url}/autonomous/sales-chat", json=chat_data)
            print(f"📥 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"📋 Response Data Keys: {list(data.keys())}")
                
                if (data.get("status") == "success" and 
                    "ai_response" in data):
                    
                    # Prüfe auf echte KI-Markierung (wichtigste Anforderung)
                    ai_powered = data.get("ai_powered", False)
                    ai_response = data.get("ai_response", "")
                    
                    print(f"🤖 AI Response: {ai_response[:200]}...")
                    print(f"🔍 AI Powered: {ai_powered}")
                    
                    # Validiere deutsche Sprache und Restaurant-Kontext
                    is_german = any(word in ai_response.lower() for word in ["restaurant", "gastronomie", "marketing", "automation", "leipzig"])
                    is_contextual = len(ai_response) > 50 and not any(template in ai_response for template in ["template", "placeholder", "example"])
                    is_professional = any(word in ai_response.lower() for word in ["daniel", "zz-lobby", "service", "angebot"])
                    
                    if ai_powered and is_german and is_contextual:
                        return self.log_test("NEUE AI Sales Chat - GPT-4o-mini", True, "✅ ECHTE KI-Integration erfolgreich - Restaurant-Kontext erkannt",
                                    {"conversation_id": chat_data["conversation_id"],
                                     "ai_powered": ai_powered,
                                     "sales_stage": data.get("sales_stage"),
                                     "response_length": len(ai_response),
                                     "german_context": is_german,
                                     "contextual_response": is_contextual,
                                     "professional_tone": is_professional,
                                     "suggested_action": data.get("suggested_action")})
                    else:
                        return self.log_test("NEUE AI Sales Chat - GPT-4o-mini", False, 
                                    f"❌ KI-Response nicht optimal - ai_powered: {ai_powered}, german: {is_german}, contextual: {is_contextual}")
                else:
                    return self.log_test("NEUE AI Sales Chat - GPT-4o-mini", False, "❌ Unvollständige Sales-Chat-Antwort")
            else:
                print(f"❌ Error Response: {response.text}")
                return self.log_test("NEUE AI Sales Chat - GPT-4o-mini", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            return self.log_test("NEUE AI Sales Chat - GPT-4o-mini", False, f"❌ Sales-Chat Fehler: {str(e)}")

    def test_new_ai_lead_analysis(self):
        """Test NEUE ECHTE AI Lead Analysis - Verbesserte Lead-Analyse mit echter KI"""
        print("\n🎯 Testing AI Lead Analysis - Max Müller Restaurant Scenario")
        
        try:
            # Test Lead aus Review Request: Max Müller Restaurant
            lead_data = {
                "name": "Max Müller",
                "email": "max@restaurant-leipzig.de", 
                "company": "Restaurant Müller",
                "phone": "+49 341 123456",
                "source": "website",
                "interests": ["Online Marketing", "Gastronomie"],
                "budget_range": "1000-3000€",
                "urgency": "high",
                "notes": "Brauche Hilfe bei Online Marketing für mein Restaurant in Leipzig"
            }
            
            print(f"📤 Sending Lead: {lead_data}")
            response = self.session.post(f"{self.api_url}/autonomous/process-lead", json=lead_data)
            print(f"📥 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"📋 Response Data Keys: {list(data.keys())}")
                
                if (data.get("status") == "success" and 
                    "lead_id" in data and 
                    "offer_id" in data):
                    
                    # Prüfe auf Service-Empfehlung basierend auf Gastronomie-Kontext
                    estimated_conversion = data.get("estimated_conversion", 0)
                    message = data.get("message", "")
                    
                    print(f"💼 Lead ID: {data['lead_id']}")
                    print(f"📄 Offer ID: {data['offer_id']}")
                    print(f"📈 Conversion Estimate: {estimated_conversion}%")
                    print(f"💬 Message: {message}")
                    
                    # Validiere Gastronomie-spezifische Analyse
                    is_contextual = any(word in message.lower() for word in ["restaurant", "gastronomie", "online", "marketing"])
                    has_conversion_estimate = estimated_conversion > 0
                    has_proper_ids = len(data["lead_id"]) > 10 and len(data["offer_id"]) > 10
                    
                    if is_contextual and has_conversion_estimate and has_proper_ids:
                        return self.log_test("NEUE AI Lead Analysis - Gastronomie", True, "✅ ECHTE KI-Lead-Analyse erfolgreich - Gastronomie-Kontext erkannt",
                                    {"lead_id": data["lead_id"],
                                     "offer_id": data["offer_id"],
                                     "conversion_estimate": estimated_conversion,
                                     "contextual_analysis": is_contextual,
                                     "company": lead_data["company"],
                                     "industry": "Gastronomie",
                                     "message_preview": message[:100] + "..." if len(message) > 100 else message})
                    else:
                        return self.log_test("NEUE AI Lead Analysis - Gastronomie", False, 
                                    f"❌ Lead-Analyse nicht optimal - contextual: {is_contextual}, conversion: {has_conversion_estimate}")
                else:
                    return self.log_test("NEUE AI Lead Analysis - Gastronomie", False, "❌ Unvollständige Lead-Verarbeitung")
            else:
                print(f"❌ Error Response: {response.text}")
                return self.log_test("NEUE AI Lead Analysis - Gastronomie", False, f"❌ HTTP {response.status_code}: {response.text}")
        except Exception as e:
            return self.log_test("NEUE AI Lead Analysis - Gastronomie", False, f"❌ Lead-Analysis Fehler: {str(e)}")

    def run_tests(self):
        """Run all new AI feature tests"""
        print("=" * 80)
        print("🤖 ZZ-LOBBY ELITE - NEUE AI FEATURES TESTING")
        print("🎯 Testing echte OpenAI GPT-4o-mini Integration")
        print("=" * 80)
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Backend URL: {self.api_url}")
        print("-" * 80)
        
        tests = [
            ("AI Sales Chat - Restaurant Marketing", self.test_new_ai_sales_chat),
            ("AI Lead Analysis - Gastronomie", self.test_new_ai_lead_analysis),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ CRITICAL ERROR in {test_name}: {str(e)}")
                failed += 1
            
            print("-" * 40)
        
        print("=" * 80)
        print("🏁 NEUE AI FEATURES TEST RESULTS")
        print("=" * 80)
        print(f"✅ PASSED: {passed}")
        print(f"❌ FAILED: {failed}")
        print(f"📊 SUCCESS RATE: {(passed/(passed+failed)*100):.1f}%" if (passed+failed) > 0 else "0%")
        print(f"⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        if failed == 0:
            print("🎉 ALL NEW AI FEATURES WORKING PERFECTLY!")
        else:
            print("⚠️  SOME AI FEATURES NEED ATTENTION")
        
        print("=" * 80)
        
        return passed, failed

if __name__ == "__main__":
    tester = NewAITester()
    passed, failed = tester.run_tests()
    sys.exit(0 if failed == 0 else 1)