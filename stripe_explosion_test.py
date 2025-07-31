#!/usr/bin/env python3
"""
STRIPE EXPLOSION STRESS TEST - INTENSIVE PAYMENT TESTING BIS GELD FLIEGT!
Comprehensive testing of all Stripe payment integration endpoints and workflows
"""

import requests
import json
import os
from datetime import datetime
import sys
import time
import uuid

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
print(f"🚀 STRIPE EXPLOSION TESTING at: {API_BASE}")

class StripeExplosionTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.session_ids = []  # Store session IDs for status testing
        
        # Expected packages
        self.expected_packages = {
            "zzlobby_boost": {"amount": 49.0, "currency": "eur"},
            "basic_plan": {"amount": 19.0, "currency": "eur"},
            "pro_plan": {"amount": 99.0, "currency": "eur"}
        }
        
        # Explosive coupon codes
        self.explosive_coupons = {
            'BOOST50': 50.0,
            'ROCKET30': 30.0, 
            'PROFIT25': 25.0,
            'FIRE20': 20.0,
            'MEGA15': 15.0,
            'STRIPE10': 10.0,
            'EXPLOSION5': 5.0
        }
        
    def log_test(self, test_name, success, details=""):
        """Log test result"""
        status = "💥 EXPLOSION SUCCESS" if success else "💀 EXPLOSION FAILED"
        print(f"{status}: {test_name}")
        if details:
            print(f"   💰 Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
        
        if not success:
            self.failed_tests.append(test_name)
    
    def test_api_health_check(self):
        """Test basic API health"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "ZZ-Lobby Elite API" in data.get('message', ''):
                    self.log_test("API Health Check", True, f"API is running: {data}")
                    return True
                else:
                    self.log_test("API Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("API Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_payment_packages_endpoint(self):
        """Test GET /payments/packages - muss alle Pakete zurückgeben"""
        try:
            response = requests.get(f"{API_BASE}/payments/packages", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'packages' in data:
                    packages = data['packages']
                    
                    # Verify all 3 packages exist
                    for package_id, expected in self.expected_packages.items():
                        if package_id not in packages:
                            self.log_test("Payment Packages Endpoint", False, f"Missing package: {package_id}")
                            return False
                        
                        package = packages[package_id]
                        if package['amount'] != expected['amount']:
                            self.log_test("Payment Packages Endpoint", False, f"Wrong amount for {package_id}: {package['amount']} != {expected['amount']}")
                            return False
                        
                        if package['currency'] != expected['currency']:
                            self.log_test("Payment Packages Endpoint", False, f"Wrong currency for {package_id}: {package['currency']} != {expected['currency']}")
                            return False
                    
                    self.log_test("Payment Packages Endpoint", True, f"All 3 packages verified: {list(packages.keys())}")
                    return True
                else:
                    self.log_test("Payment Packages Endpoint", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Payment Packages Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Payment Packages Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_checkout_session_creation(self, package_id, coupon_code=None):
        """Test POST /payments/checkout/session for specific package"""
        try:
            payload = {
                "package_id": package_id,
                "origin_url": BACKEND_URL,
                "metadata": {"test_session": True, "test_id": str(uuid.uuid4())}
            }
            
            if coupon_code:
                payload["coupon_code"] = coupon_code
            
            response = requests.post(f"{API_BASE}/payments/checkout/session", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'url' in data and 'session_id' in data:
                    session_id = data['session_id']
                    self.session_ids.append(session_id)
                    
                    test_name = f"Checkout Session Creation - {package_id}"
                    if coupon_code:
                        test_name += f" + {coupon_code}"
                    
                    self.log_test(test_name, True, f"Session created: {session_id}, URL: {data['url'][:50]}...")
                    return True, session_id
                else:
                    test_name = f"Checkout Session Creation - {package_id}"
                    if coupon_code:
                        test_name += f" + {coupon_code}"
                    self.log_test(test_name, False, f"Invalid response structure: {data}")
                    return False, None
            else:
                test_name = f"Checkout Session Creation - {package_id}"
                if coupon_code:
                    test_name += f" + {coupon_code}"
                self.log_test(test_name, False, f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            test_name = f"Checkout Session Creation - {package_id}"
            if coupon_code:
                test_name += f" + {coupon_code}"
            self.log_test(test_name, False, f"Exception: {str(e)}")
            return False, None
    
    def test_checkout_status_polling(self, session_id):
        """Test GET /payments/checkout/status/{session_id}"""
        try:
            response = requests.get(f"{API_BASE}/payments/checkout/status/{session_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'status' in data and 'payment_status' in data:
                    self.log_test(f"Checkout Status Polling - {session_id[:8]}...", True, 
                                f"Status: {data['status']}, Payment: {data['payment_status']}")
                    return True
                else:
                    self.log_test(f"Checkout Status Polling - {session_id[:8]}...", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test(f"Checkout Status Polling - {session_id[:8]}...", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test(f"Checkout Status Polling - {session_id[:8]}...", False, f"Exception: {str(e)}")
            return False
    
    def test_webhook_endpoint(self):
        """Test POST /webhook/stripe - basic endpoint availability"""
        try:
            # Test with minimal payload (will fail signature validation but endpoint should respond)
            payload = {"test": "webhook_availability"}
            response = requests.post(f"{API_BASE}/webhook/stripe", json=payload, timeout=10)
            
            # Expect 400 due to missing signature, but endpoint should be available
            if response.status_code == 400:
                data = response.json()
                if "Missing Stripe signature" in data.get('detail', ''):
                    self.log_test("Webhook Endpoint Availability", True, "Endpoint available, signature validation working")
                    return True
                else:
                    self.log_test("Webhook Endpoint Availability", False, f"Unexpected error: {data}")
                    return False
            else:
                self.log_test("Webhook Endpoint Availability", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Webhook Endpoint Availability", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_package_rejection(self):
        """Test that invalid package IDs are rejected"""
        try:
            payload = {
                "package_id": "invalid_package_explosion",
                "origin_url": BACKEND_URL,
                "metadata": {"test_session": True}
            }
            
            response = requests.post(f"{API_BASE}/payments/checkout/session", json=payload, timeout=10)
            
            if response.status_code == 400:
                data = response.json()
                if "Invalid package ID" in data.get('detail', ''):
                    self.log_test("Invalid Package Rejection", True, "Invalid package correctly rejected")
                    return True
                else:
                    self.log_test("Invalid Package Rejection", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Invalid Package Rejection", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Package Rejection", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_coupon_handling(self):
        """Test that invalid coupon codes are handled gracefully"""
        try:
            payload = {
                "package_id": "zzlobby_boost",
                "origin_url": BACKEND_URL,
                "coupon_code": "INVALID_EXPLOSION_CODE",
                "metadata": {"test_session": True}
            }
            
            response = requests.post(f"{API_BASE}/payments/checkout/session", json=payload, timeout=10)
            
            # Should still create session but without discount
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Invalid Coupon Handling", True, "Invalid coupon handled gracefully, session created without discount")
                    return True
                else:
                    self.log_test("Invalid Coupon Handling", False, f"Session creation failed: {data}")
                    return False
            else:
                self.log_test("Invalid Coupon Handling", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Coupon Handling", False, f"Exception: {str(e)}")
            return False
    
    def run_package_explosion_tests(self):
        """Test all 3 packages: zzlobby_boost (49€), basic_plan (19€), pro_plan (99€)"""
        print("\n💥 PACKAGE EXPLOSION TESTS 💥")
        success_count = 0
        
        for package_id in self.expected_packages.keys():
            success, session_id = self.test_checkout_session_creation(package_id)
            if success:
                success_count += 1
                # Test status polling for this session
                self.test_checkout_status_polling(session_id)
        
        return success_count == len(self.expected_packages)
    
    def run_coupon_explosion_tests(self):
        """Test all 7 coupon codes with different packages"""
        print("\n🎫 COUPON EXPLOSION TESTS 🎫")
        success_count = 0
        total_tests = 0
        
        # Test each coupon with zzlobby_boost package
        for coupon_code in self.explosive_coupons.keys():
            total_tests += 1
            success, session_id = self.test_checkout_session_creation("zzlobby_boost", coupon_code)
            if success:
                success_count += 1
        
        # Test some coupons with other packages
        test_combinations = [
            ("basic_plan", "BOOST50"),
            ("pro_plan", "ROCKET30"),
            ("basic_plan", "FIRE20")
        ]
        
        for package_id, coupon_code in test_combinations:
            total_tests += 1
            success, session_id = self.test_checkout_session_creation(package_id, coupon_code)
            if success:
                success_count += 1
        
        return success_count == total_tests
    
    def run_stress_tests(self):
        """Run intensive stress tests"""
        print("\n⚡ STRESS EXPLOSION TESTS ⚡")
        
        # Test rapid session creation
        rapid_success = 0
        for i in range(5):
            success, session_id = self.test_checkout_session_creation("zzlobby_boost")
            if success:
                rapid_success += 1
            time.sleep(0.5)  # Small delay between requests
        
        self.log_test("Rapid Session Creation (5x)", rapid_success == 5, f"{rapid_success}/5 sessions created")
        
        # Test status polling for all collected session IDs
        polling_success = 0
        for session_id in self.session_ids[-3:]:  # Test last 3 sessions
            if self.test_checkout_status_polling(session_id):
                polling_success += 1
        
        self.log_test("Status Polling Stress", polling_success >= 2, f"{polling_success} status checks successful")
        
        return rapid_success >= 4 and polling_success >= 2
    
    def run_all_explosion_tests(self):
        """Run all STRIPE EXPLOSION tests"""
        print("=" * 80)
        print("🚀 STRIPE EXPLOSION STRESS TEST - INTENSIVE PAYMENT TESTING BIS GELD FLIEGT! 🚀")
        print("=" * 80)
        
        # Test API health first
        if not self.test_api_health_check():
            print("💀 API is down! Cannot proceed with explosion tests!")
            return False
        
        print("\n📦 PAYMENT PACKAGES EXPLOSION")
        packages_ok = self.test_payment_packages_endpoint()
        
        print("\n🔥 PACKAGE EXPLOSION TESTS")
        packages_explosion_ok = self.run_package_explosion_tests()
        
        print("\n💸 COUPON EXPLOSION TESTS")
        coupons_explosion_ok = self.run_coupon_explosion_tests()
        
        print("\n🛡️ SECURITY EXPLOSION TESTS")
        invalid_package_ok = self.test_invalid_package_rejection()
        invalid_coupon_ok = self.test_invalid_coupon_handling()
        
        print("\n🌐 WEBHOOK EXPLOSION TEST")
        webhook_ok = self.test_webhook_endpoint()
        
        print("\n⚡ STRESS EXPLOSION TESTS")
        stress_ok = self.run_stress_tests()
        
        # Summary
        print("\n" + "=" * 80)
        print("💥 EXPLOSION TEST SUMMARY 💥")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['success']])
        failed_tests = len(self.failed_tests)
        
        print(f"💰 Total Explosion Tests: {total_tests}")
        print(f"✅ Successful Explosions: {passed_tests}")
        print(f"💀 Failed Explosions: {failed_tests}")
        print(f"🎯 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n💀 Failed Explosion Tests:")
            for test in self.failed_tests:
                print(f"  - {test}")
        
        # Overall success criteria
        critical_tests_passed = (
            packages_ok and 
            packages_explosion_ok and 
            coupons_explosion_ok and 
            webhook_ok and
            invalid_package_ok
        )
        
        if critical_tests_passed:
            print("\n🎉 STRIPE EXPLOSION SUCCESS! GELD KANN FLIEGEN! 💸💸💸")
            print("🚀 All critical payment systems are ready for PROFIT GENERATION!")
        else:
            print("\n💀 STRIPE EXPLOSION FAILED! NEED MORE FIREPOWER!")
            print("🔧 Critical systems need fixing before money can flow!")
        
        return critical_tests_passed

if __name__ == "__main__":
    tester = StripeExplosionTester()
    success = tester.run_all_explosion_tests()
    
    if success:
        print("\n🎉 STRIPE EXPLOSION COMPLETE - READY FOR PROFIT! 💰")
        sys.exit(0)
    else:
        print(f"\n💀 STRIPE EXPLOSION FAILED - {len(tester.failed_tests)} CRITICAL ISSUES!")
        sys.exit(1)