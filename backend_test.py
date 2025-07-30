#!/usr/bin/env python3
"""
ZZ-Lobby Elite System Backend API Testing Suite
Tests all backend endpoints for functionality and data integrity
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from frontend/.env
BACKEND_URL = "https://af61faa8-d979-40f7-813a-366cb03a46e8.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.results = {
            "paypal_integration": {"status": "unknown", "details": []},
            "database_service": {"status": "unknown", "details": []},
            "dashboard_stats": {"status": "unknown", "details": []},
            "automations_api": {"status": "unknown", "details": []},
            "analytics_api": {"status": "unknown", "details": []},
            "saas_status": {"status": "unknown", "details": []},
            "hyperschwarm_status": {"status": "unknown", "details": []},
            "hyperschwarm_agents": {"status": "unknown", "details": []},
            "hyperschwarm_strategy": {"status": "unknown", "details": []},
            "hyperschwarm_performance": {"status": "unknown", "details": []},
            "hyperschwarm_optimization": {"status": "unknown", "details": []}
        }
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

    def log_result(self, test_name: str, success: bool, message: str, data: Any = None):
        """Log test result"""
        status = "pass" if success else "fail"
        self.results[test_name]["status"] = status
        self.results[test_name]["details"].append({
            "message": message,
            "data": data,
            "timestamp": datetime.now().isoformat()
        })
        print(f"[{status.upper()}] {test_name}: {message}")
        if data and isinstance(data, dict):
            print(f"  Data keys: {list(data.keys())}")

    def test_paypal_integration(self):
        """Test PayPal Integration Service"""
        print("\n=== Testing PayPal Integration Service ===")
        
        try:
            # Test payment creation
            payment_data = {
                "amount": 25.00,
                "description": "Test Payment"
            }
            
            response = self.session.post(f"{API_BASE}/paypal/create-payment", json=payment_data)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'amount', 'description', 'paymentUrl', 'qrCode', 'status', 'createdAt']
                
                if all(field in data for field in required_fields):
                    # Verify QR code is generated
                    if data['qrCode'].startswith('data:image/png;base64,'):
                        self.log_result("paypal_integration", True, 
                                      f"Payment created successfully with ID: {data['id']}", data)
                        
                        # Test getting payments list
                        payments_response = self.session.get(f"{API_BASE}/paypal/payments")
                        if payments_response.status_code == 200:
                            payments = payments_response.json()
                            self.log_result("paypal_integration", True, 
                                          f"Retrieved {len(payments)} payments from database")
                        else:
                            self.log_result("paypal_integration", False, 
                                          f"Failed to retrieve payments: {payments_response.status_code}")
                    else:
                        self.log_result("paypal_integration", False, "QR code not properly generated")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("paypal_integration", False, f"Missing required fields: {missing}")
            else:
                self.log_result("paypal_integration", False, 
                              f"Payment creation failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("paypal_integration", False, f"PayPal integration error: {str(e)}")

    def test_database_service(self):
        """Test Database Service with MongoDB"""
        print("\n=== Testing Database Service ===")
        
        try:
            # Test basic connectivity by checking dashboard stats (requires DB)
            response = self.session.get(f"{API_BASE}/dashboard/stats")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['todayEarnings', 'activeLeads', 'activeAutomations', 'systemPerformance']
                
                if all(field in data for field in required_fields):
                    self.log_result("database_service", True, 
                                  "Database connection successful - dashboard stats retrieved", data)
                    
                    # Test automations data (verifies default data initialization)
                    automations_response = self.session.get(f"{API_BASE}/automations")
                    if automations_response.status_code == 200:
                        automations = automations_response.json()
                        if len(automations) >= 5:  # Should have 5 default automations
                            self.log_result("database_service", True, 
                                          f"Default automation data initialized: {len(automations)} automations")
                        else:
                            self.log_result("database_service", False, 
                                          f"Insufficient default automations: {len(automations)}")
                    else:
                        self.log_result("database_service", False, 
                                      f"Failed to retrieve automations: {automations_response.status_code}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("database_service", False, f"Missing dashboard fields: {missing}")
            else:
                self.log_result("database_service", False, 
                              f"Database connection failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("database_service", False, f"Database service error: {str(e)}")

    def test_dashboard_stats_api(self):
        """Test Dashboard Stats API"""
        print("\n=== Testing Dashboard Stats API ===")
        
        try:
            response = self.session.get(f"{API_BASE}/dashboard/stats")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = [
                    'todayEarnings', 'todayGrowth', 'activeLeads', 'newLeads',
                    'conversionRate', 'activeAutomations', 'systemPerformance'
                ]
                
                if all(field in data for field in required_fields):
                    # Verify data types
                    type_checks = [
                        (isinstance(data['todayEarnings'], str), 'todayEarnings should be string'),
                        (isinstance(data['todayGrowth'], (int, float)), 'todayGrowth should be numeric'),
                        (isinstance(data['activeLeads'], int), 'activeLeads should be integer'),
                        (isinstance(data['systemPerformance'], int), 'systemPerformance should be integer')
                    ]
                    
                    failed_checks = [msg for check, msg in type_checks if not check]
                    
                    if not failed_checks:
                        self.log_result("dashboard_stats", True, 
                                      "Dashboard stats API working correctly", data)
                    else:
                        self.log_result("dashboard_stats", False, 
                                      f"Data type validation failed: {failed_checks}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("dashboard_stats", False, f"Missing required fields: {missing}")
            else:
                self.log_result("dashboard_stats", False, 
                              f"Dashboard stats API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("dashboard_stats", False, f"Dashboard stats error: {str(e)}")

    def test_automations_api(self):
        """Test Automations Management API"""
        print("\n=== Testing Automations Management API ===")
        
        try:
            # Test GET automations
            response = self.session.get(f"{API_BASE}/automations")
            
            if response.status_code == 200:
                automations = response.json()
                
                if len(automations) > 0:
                    automation = automations[0]
                    required_fields = [
                        'id', 'name', 'description', 'type', 'active', 
                        'status', 'performance', 'successRate'
                    ]
                    
                    if all(field in automation for field in required_fields):
                        self.log_result("automations_api", True, 
                                      f"Retrieved {len(automations)} automations successfully")
                        
                        # Test toggle automation
                        automation_id = automation['id']
                        current_status = automation['active']
                        new_status = not current_status
                        
                        toggle_data = {"active": new_status}
                        toggle_response = self.session.put(
                            f"{API_BASE}/automations/{automation_id}/toggle", 
                            json=toggle_data
                        )
                        
                        if toggle_response.status_code == 200:
                            toggle_result = toggle_response.json()
                            if toggle_result.get('success'):
                                self.log_result("automations_api", True, 
                                              f"Automation toggle successful: {automation_id}")
                                
                                # Verify the change
                                verify_response = self.session.get(f"{API_BASE}/automations")
                                if verify_response.status_code == 200:
                                    updated_automations = verify_response.json()
                                    updated_automation = next(
                                        (a for a in updated_automations if a['id'] == automation_id), 
                                        None
                                    )
                                    if updated_automation and updated_automation['active'] == new_status:
                                        self.log_result("automations_api", True, 
                                                      "Automation status change verified")
                                    else:
                                        self.log_result("automations_api", False, 
                                                      "Automation status change not persisted")
                            else:
                                self.log_result("automations_api", False, 
                                              f"Toggle failed: {toggle_result}")
                        else:
                            self.log_result("automations_api", False, 
                                          f"Toggle request failed: {toggle_response.status_code}")
                    else:
                        missing = [f for f in required_fields if f not in automation]
                        self.log_result("automations_api", False, f"Missing automation fields: {missing}")
                else:
                    self.log_result("automations_api", False, "No automations found")
            else:
                self.log_result("automations_api", False, 
                              f"Automations API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("automations_api", False, f"Automations API error: {str(e)}")

    def test_analytics_api(self):
        """Test Analytics API"""
        print("\n=== Testing Analytics API ===")
        
        try:
            response = self.session.get(f"{API_BASE}/analytics")
            
            if response.status_code == 200:
                data = response.json()
                required_sections = ['revenue', 'leads', 'traffic', 'platforms']
                
                if all(section in data for section in required_sections):
                    # Verify revenue section
                    revenue = data['revenue']
                    revenue_fields = ['today', 'week', 'month', 'growth']
                    
                    # Verify leads section
                    leads = data['leads']
                    leads_fields = ['total', 'qualified', 'converted', 'conversionRate']
                    
                    # Verify traffic section
                    traffic = data['traffic']
                    traffic_fields = ['organic', 'paid', 'referral', 'direct']
                    
                    # Verify platforms section
                    platforms = data['platforms']
                    
                    validation_checks = [
                        (all(f in revenue for f in revenue_fields), 'Revenue section complete'),
                        (all(f in leads for f in leads_fields), 'Leads section complete'),
                        (all(f in traffic for f in traffic_fields), 'Traffic section complete'),
                        (isinstance(platforms, list) and len(platforms) > 0, 'Platforms data available')
                    ]
                    
                    failed_checks = [msg for check, msg in validation_checks if not check]
                    
                    if not failed_checks:
                        self.log_result("analytics_api", True, 
                                      "Analytics API working correctly", data)
                    else:
                        self.log_result("analytics_api", False, 
                                      f"Analytics validation failed: {failed_checks}")
                else:
                    missing = [s for s in required_sections if s not in data]
                    self.log_result("analytics_api", False, f"Missing analytics sections: {missing}")
            else:
                self.log_result("analytics_api", False, 
                              f"Analytics API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("analytics_api", False, f"Analytics API error: {str(e)}")

    def test_saas_status_api(self):
        """Test SaaS Status API"""
        print("\n=== Testing SaaS Status API ===")
        
        try:
            response = self.session.get(f"{API_BASE}/saas/status")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = [
                    'systemHealth', 'uptime', 'activeUsers', 
                    'totalRevenue', 'monthlyGrowth', 'components'
                ]
                
                if all(field in data for field in required_fields):
                    # Verify components structure
                    components = data['components']
                    if isinstance(components, list) and len(components) > 0:
                        component = components[0]
                        component_fields = ['name', 'status', 'performance']
                        
                        if all(field in component for field in component_fields):
                            self.log_result("saas_status", True, 
                                          f"SaaS status API working correctly with {len(components)} components", 
                                          data)
                        else:
                            missing = [f for f in component_fields if f not in component]
                            self.log_result("saas_status", False, 
                                          f"Missing component fields: {missing}")
                    else:
                        self.log_result("saas_status", False, "No components data found")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("saas_status", False, f"Missing SaaS status fields: {missing}")
            else:
                self.log_result("saas_status", False, 
                              f"SaaS status API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("saas_status", False, f"SaaS status error: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print(f"Starting ZZ-Lobby Elite Backend API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        
        # Test in priority order
        self.test_paypal_integration()      # High priority
        self.test_database_service()        # High priority
        self.test_dashboard_stats_api()     # Medium priority
        self.test_automations_api()         # Medium priority
        self.test_analytics_api()           # Medium priority
        self.test_saas_status_api()         # Low priority
        
        return self.results

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results.values() if r["status"] == "pass")
        failed_tests = sum(1 for r in self.results.values() if r["status"] == "fail")
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        print("\nDetailed Results:")
        for test_name, result in self.results.items():
            status_icon = "✅" if result["status"] == "pass" else "❌"
            print(f"{status_icon} {test_name.replace('_', ' ').title()}: {result['status'].upper()}")
            
            if result["details"]:
                latest_detail = result["details"][-1]
                print(f"   └─ {latest_detail['message']}")

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()
    tester.print_summary()
    
    # Exit with error code if any tests failed
    failed_count = sum(1 for r in results.values() if r["status"] == "fail")
    sys.exit(failed_count)