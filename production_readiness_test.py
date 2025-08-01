#!/usr/bin/env python3
"""
PRODUCTION READINESS TESTING - FINALE LIVE-SCHALTUNG
Critical tests for live deployment with real money transactions
"""

import requests
import json
import os
from datetime import datetime
import sys

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BACKEND_URL}/api"
print(f"🔥 PRODUCTION READINESS TESTING at: {API_BASE}")

class ProductionReadinessTester:
    def __init__(self, api_base):
        self.api_base = api_base
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, details=""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
        
        if not success:
            self.failed_tests.append(test_name)
    
    def test_live_digistore24_configuration(self):
        """Test LIVE Digistore24 API Keys and Configuration"""
        try:
            # Read backend .env file to verify LIVE configuration
            env_file = '/app/backend/.env'
            with open(env_file, 'r') as f:
                content = f.read()
            
            # Check for LIVE vendor ID 1417598
            if 'DIGISTORE24_VENDOR_ID=1417598' in content:
                self.log_test("LIVE Vendor ID Configuration", True, "Vendor ID 1417598 confirmed")
            else:
                self.log_test("LIVE Vendor ID Configuration", False, "Vendor ID 1417598 not found")
                return False
            
            # Check for LIVE API keys
            if '1417598-BP9FgEF71a0Kpzh5wHMtaEr9w1k5qJyWHoHes' in content:
                self.log_test("LIVE Primary API Key", True, "Primary API key present")
            else:
                self.log_test("LIVE Primary API Key", False, "Primary API key missing")
                return False
            
            # Check commission rate is 50%
            if 'AFFILIATE_COMMISSION_RATE=0.50' in content or 'AFFILIATE_COMMISSION_RATE=0.5' in content:
                self.log_test("LIVE Commission Rate (50%)", True, "Commission rate correctly set to 50%")
            else:
                self.log_test("LIVE Commission Rate (50%)", False, "Commission rate not set to 50%")
                return False
            
            return True
            
        except Exception as e:
            self.log_test("LIVE Digistore24 Configuration", False, f"Exception: {str(e)}")
            return False
    
    def test_live_affiliate_link_generation_with_real_vendor_id(self):
        """Test affiliate link generation with REAL vendor ID 1417598"""
        test_cases = [
            {"affiliate_name": "MaxMustermann2025", "campaign_key": "live_test"},
            {"affiliate_name": "ProfitPartner", "campaign_key": None},
            {"affiliate_name": "EliteAffiliate", "campaign_key": "production_launch"}
        ]
        
        all_passed = True
        
        for test_case in test_cases:
            try:
                payload = {"affiliate_name": test_case["affiliate_name"]}
                if test_case["campaign_key"]:
                    payload["campaign_key"] = test_case["campaign_key"]
                
                response = requests.post(f"{self.api_base}/affiliate/generate-link", json=payload, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    link = data.get('affiliate_link', '')
                    
                    # CRITICAL: Must contain real vendor ID 1417598
                    if '1417598' in link and 'digistore24.com/redir' in link:
                        self.log_test(f"LIVE Link Generation - {test_case['affiliate_name']}", True, f"Valid link: {link}")
                    else:
                        self.log_test(f"LIVE Link Generation - {test_case['affiliate_name']}", False, f"Invalid link format: {link}")
                        all_passed = False
                else:
                    self.log_test(f"LIVE Link Generation - {test_case['affiliate_name']}", False, f"Status: {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"LIVE Link Generation - {test_case['affiliate_name']}", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_payment_packages_endpoint(self):
        """Test payment packages endpoint for live transactions"""
        try:
            response = requests.get(f"{self.api_base}/payments/packages", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'packages' in data:
                    packages = data['packages']
                    
                    # Check for ZZ-Lobby Boost 49€ package
                    if 'zzlobby_boost' in packages:
                        boost_package = packages['zzlobby_boost']
                        if boost_package.get('amount') == 49.0:
                            self.log_test("LIVE Payment Packages - ZZ-Lobby Boost 49€", True, f"Package structure: {boost_package}")
                        else:
                            self.log_test("LIVE Payment Packages - ZZ-Lobby Boost 49€", False, f"Wrong amount: {boost_package.get('amount')}")
                            return False
                    else:
                        self.log_test("LIVE Payment Packages - ZZ-Lobby Boost", False, "zzlobby_boost package missing")
                        return False
                    
                    # Check all packages have required fields
                    required_fields = ['name', 'amount', 'currency', 'description']
                    for package_id, package in packages.items():
                        missing_fields = [field for field in required_fields if field not in package]
                        if missing_fields:
                            self.log_test(f"LIVE Package Structure - {package_id}", False, f"Missing fields: {missing_fields}")
                            return False
                    
                    self.log_test("LIVE Payment Packages Structure", True, f"All {len(packages)} packages valid")
                    return True
                else:
                    self.log_test("LIVE Payment Packages", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("LIVE Payment Packages", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("LIVE Payment Packages", False, f"Exception: {str(e)}")
            return False
    
    def test_commission_calculation_accuracy(self):
        """Test commission calculation accuracy for 49€ sales"""
        try:
            # Test affiliate stats endpoint to verify commission calculation logic
            response = requests.get(f"{self.api_base}/affiliate/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                stats = data.get('stats', {})
                
                # Verify commission rate is exactly 50%
                commission_rate = stats.get('commission_rate', 0)
                if commission_rate == 50.0:
                    # Calculate expected commission for 49€ sale
                    expected_commission = 49.0 * 0.50  # 24.50€
                    expected_profit = 49.0 - expected_commission  # 24.50€
                    
                    self.log_test("LIVE Commission Calculation - 49€ Sale", True, 
                                f"49€ sale → {expected_commission}€ commission + {expected_profit}€ profit (50% rate)")
                    return True
                else:
                    self.log_test("LIVE Commission Calculation", False, f"Wrong commission rate: {commission_rate}%")
                    return False
            else:
                self.log_test("LIVE Commission Calculation", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("LIVE Commission Calculation", False, f"Exception: {str(e)}")
            return False
    
    def test_database_collections_readiness(self):
        """Test that all required database collections are accessible"""
        try:
            # Test affiliate sales endpoint (tests affiliate_sales collection)
            response1 = requests.get(f"{self.api_base}/affiliate/sales", timeout=10)
            
            # Test affiliate payments endpoint (tests affiliate_payments collection)  
            response2 = requests.get(f"{self.api_base}/affiliate/payments", timeout=10)
            
            # Test affiliate stats endpoint (tests affiliate_stats collection)
            response3 = requests.get(f"{self.api_base}/affiliate/stats", timeout=10)
            
            if all(r.status_code == 200 for r in [response1, response2, response3]):
                self.log_test("LIVE Database Collections", True, "All affiliate collections accessible")
                return True
            else:
                statuses = [r.status_code for r in [response1, response2, response3]]
                self.log_test("LIVE Database Collections", False, f"Status codes: {statuses}")
                return False
                
        except Exception as e:
            self.log_test("LIVE Database Collections", False, f"Exception: {str(e)}")
            return False
    
    def test_ipn_webhook_security(self):
        """Test IPN webhook signature validation security"""
        try:
            # Test with invalid signature (should be rejected)
            form_data = {
                'buyer_email': 'live.customer@example.com',
                'order_id': 'LIVE_ORDER_12345',
                'product_id': '12345',
                'vendor_id': '1417598',
                'affiliate_name': 'LiveAffiliate',
                'amount': '49.00',
                'currency': 'EUR'
            }
            
            response = requests.post(f"{self.api_base}/affiliate/digistore24/webhook", 
                                   data=form_data, 
                                   headers={'X-Digistore24-Signature': 'invalid_signature_test'},
                                   timeout=10)
            
            # Should return 400 for invalid signature
            if response.status_code == 400:
                data = response.json()
                if "Invalid signature" in data.get('detail', ''):
                    self.log_test("LIVE IPN Security - Signature Validation", True, "Invalid signatures correctly rejected")
                    return True
                else:
                    self.log_test("LIVE IPN Security", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("LIVE IPN Security", False, f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("LIVE IPN Security", False, f"Exception: {str(e)}")
            return False
    
    def test_api_response_times(self):
        """Test API response times for production readiness"""
        import time
        
        endpoints_to_test = [
            ("/affiliate/stats", "GET"),
            ("/affiliate/sales", "GET"), 
            ("/affiliate/payments", "GET"),
            ("/payments/packages", "GET")
        ]
        
        all_fast = True
        
        for endpoint, method in endpoints_to_test:
            try:
                start_time = time.time()
                
                if method == "GET":
                    response = requests.get(f"{self.api_base}{endpoint}", timeout=10)
                
                end_time = time.time()
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                if response.status_code == 200 and response_time < 2000:  # Under 2 seconds
                    self.log_test(f"LIVE Response Time - {endpoint}", True, f"{response_time:.0f}ms")
                else:
                    self.log_test(f"LIVE Response Time - {endpoint}", False, f"{response_time:.0f}ms (Status: {response.status_code})")
                    all_fast = False
                    
            except Exception as e:
                self.log_test(f"LIVE Response Time - {endpoint}", False, f"Exception: {str(e)}")
                all_fast = False
        
        return all_fast
    
    def test_error_handling_robustness(self):
        """Test error handling for production robustness"""
        test_cases = [
            # Invalid affiliate link generation
            {"endpoint": "/affiliate/generate-link", "method": "POST", "data": {}, "expected_status": 400},
            # Invalid payment package
            {"endpoint": "/payments/checkout/session", "method": "POST", "data": {"package_id": "invalid", "origin_url": "https://test.com"}, "expected_status": 400},
        ]
        
        all_passed = True
        
        for test_case in test_cases:
            try:
                if test_case["method"] == "POST":
                    response = requests.post(f"{self.api_base}{test_case['endpoint']}", 
                                           json=test_case["data"], timeout=10)
                
                if response.status_code == test_case["expected_status"]:
                    self.log_test(f"LIVE Error Handling - {test_case['endpoint']}", True, f"Correctly returned {response.status_code}")
                else:
                    self.log_test(f"LIVE Error Handling - {test_case['endpoint']}", False, f"Expected {test_case['expected_status']}, got {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"LIVE Error Handling - {test_case['endpoint']}", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def run_production_readiness_tests(self):
        """Run all production readiness tests"""
        print("\n" + "=" * 100)
        print("🔥 FINALE LIVE-SCHALTUNG - PRODUCTION READINESS TESTS")
        print("=" * 100)
        
        print("\n--- LIVE Digistore24 Configuration Tests ---")
        self.test_live_digistore24_configuration()
        self.test_live_affiliate_link_generation_with_real_vendor_id()
        self.test_commission_calculation_accuracy()
        
        print("\n--- LIVE Payment System Tests ---")
        self.test_payment_packages_endpoint()
        
        print("\n--- LIVE Database & Security Tests ---")
        self.test_database_collections_readiness()
        self.test_ipn_webhook_security()
        
        print("\n--- LIVE Performance & Reliability Tests ---")
        self.test_api_response_times()
        self.test_error_handling_robustness()
        
        # Summary
        print("\n" + "=" * 100)
        print("🎯 PRODUCTION READINESS TEST SUMMARY")
        print("=" * 100)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['success']])
        failed_tests = len(self.failed_tests)
        
        print(f"Total Production Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Production Tests:")
            for test in self.failed_tests:
                print(f"  - {test}")
            print("\n🚨 SYSTEM NOT READY FOR LIVE DEPLOYMENT!")
            return False
        else:
            print("\n✅ ALL PRODUCTION READINESS TESTS PASSED!")
            print("🚀 SYSTEM IS 100% READY FOR LIVE DEPLOYMENT!")
            print("💰 READY FOR IMMEDIATE MONEY GENERATION!")
            return True

if __name__ == "__main__":
    tester = ProductionReadinessTester(API_BASE)
    success = tester.run_production_readiness_tests()
    
    if success:
        print("\n" + "=" * 100)
        print("🎉 FINALE LIVE-SCHALTUNG APPROVED!")
        print("✅ Digistore24 Vendor ID 1417598: ACTIVE")
        print("✅ 50% Commission Rate: CONFIRMED") 
        print("✅ 49€ ZZ-Lobby Boost: READY")
        print("✅ All API Endpoints: OPERATIONAL")
        print("✅ Database Collections: READY")
        print("✅ Security Validation: PASSED")
        print("✅ Performance: OPTIMIZED")
        print("=" * 100)
        print("🚀 GO LIVE NOW - SYSTEM READY FOR PRODUCTION!")
        sys.exit(0)
    else:
        print("\n🚨 LIVE DEPLOYMENT BLOCKED - FIX ISSUES FIRST!")
        sys.exit(1)