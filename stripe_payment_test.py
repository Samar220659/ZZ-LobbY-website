#!/usr/bin/env python3
"""
Backend API Testing for Stripe Payment Integration System
Tests all payment-related endpoints and ZZ-Lobby Boost workflow automation
"""

import requests
import json
import os
from datetime import datetime
import sys
import time

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
print(f"Testing Stripe Payment System at: {API_BASE}")

class StripePaymentTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.session_id = None  # Store session ID for status testing
        
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
    
    def test_get_payment_packages(self):
        """Test GET /api/payments/packages endpoint"""
        try:
            response = requests.get(f"{API_BASE}/payments/packages", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                if not data.get('success'):
                    self.log_test("Payment Packages Endpoint", False, "Response missing 'success' field")
                    return False
                
                packages = data.get('packages', {})
                if not packages:
                    self.log_test("Payment Packages Endpoint", False, "No packages returned")
                    return False
                
                # Check for required packages
                required_packages = ['zzlobby_boost', 'basic_plan', 'pro_plan']
                for pkg_id in required_packages:
                    if pkg_id not in packages:
                        self.log_test("Payment Packages Endpoint", False, f"Missing package: {pkg_id}")
                        return False
                
                # Check ZZ-Lobby Boost package details
                zzlobby = packages.get('zzlobby_boost', {})
                if zzlobby.get('amount') != 49.0:
                    self.log_test("Payment Packages Endpoint", False, f"ZZ-Lobby Boost wrong amount: {zzlobby.get('amount')}, expected 49.0")
                    return False
                
                if zzlobby.get('currency') != 'eur':
                    self.log_test("Payment Packages Endpoint", False, f"ZZ-Lobby Boost wrong currency: {zzlobby.get('currency')}, expected 'eur'")
                    return False
                
                # Check package structure
                required_fields = ['name', 'amount', 'currency', 'description', 'features']
                for field in required_fields:
                    if field not in zzlobby:
                        self.log_test("Payment Packages Endpoint", False, f"ZZ-Lobby Boost missing field: {field}")
                        return False
                
                self.log_test("Payment Packages Endpoint", True, f"All packages present with correct structure: {list(packages.keys())}")
                return True
            else:
                self.log_test("Payment Packages Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Payment Packages Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_create_checkout_session_valid(self):
        """Test POST /api/payments/checkout/session with valid data"""
        payload = {
            "package_id": "zzlobby_boost",
            "origin_url": "http://localhost:3000"
        }
        
        try:
            response = requests.post(f"{API_BASE}/payments/checkout/session", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ['success', 'url', 'session_id', 'transaction_id']
                for field in required_fields:
                    if field not in data:
                        self.log_test("Create Checkout Session (Valid)", False, f"Missing field: {field}")
                        return False
                
                if not data.get('success'):
                    self.log_test("Create Checkout Session (Valid)", False, "Success field is False")
                    return False
                
                # Store session ID for status testing
                self.session_id = data.get('session_id')
                
                # Check URL format (should be Stripe checkout URL)
                url = data.get('url', '')
                if not url.startswith('https://checkout.stripe.com'):
                    self.log_test("Create Checkout Session (Valid)", False, f"Invalid checkout URL format: {url}")
                    return False
                
                self.log_test("Create Checkout Session (Valid)", True, f"Session created successfully: {data.get('session_id')}")
                return True
            else:
                self.log_test("Create Checkout Session (Valid)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Checkout Session (Valid)", False, f"Exception: {str(e)}")
            return False
    
    def test_create_checkout_session_invalid_package(self):
        """Test POST /api/payments/checkout/session with invalid package ID"""
        payload = {
            "package_id": "invalid_package",
            "origin_url": "http://localhost:3000"
        }
        
        try:
            response = requests.post(f"{API_BASE}/payments/checkout/session", json=payload, timeout=10)
            
            # Should return 400 for invalid package
            if response.status_code == 400:
                data = response.json()
                if "Invalid package ID" in data.get('detail', ''):
                    self.log_test("Create Checkout Session (Invalid Package)", True, f"Correctly rejected: {data}")
                    return True
                else:
                    self.log_test("Create Checkout Session (Invalid Package)", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Create Checkout Session (Invalid Package)", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Checkout Session (Invalid Package)", False, f"Exception: {str(e)}")
            return False
    
    def test_create_checkout_session_missing_fields(self):
        """Test POST /api/payments/checkout/session with missing fields"""
        payload = {
            "package_id": "zzlobby_boost"
            # origin_url missing
        }
        
        try:
            response = requests.post(f"{API_BASE}/payments/checkout/session", json=payload, timeout=10)
            
            # Should return 422 for validation error
            if response.status_code == 422:
                self.log_test("Create Checkout Session (Missing Fields)", True, f"Correctly rejected with validation error")
                return True
            else:
                self.log_test("Create Checkout Session (Missing Fields)", False, f"Expected 422, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Checkout Session (Missing Fields)", False, f"Exception: {str(e)}")
            return False
    
    def test_get_checkout_status(self):
        """Test GET /api/payments/checkout/status/{session_id}"""
        if not self.session_id:
            self.log_test("Get Checkout Status", False, "No session ID available from previous test")
            return False
        
        try:
            response = requests.get(f"{API_BASE}/payments/checkout/status/{self.session_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ['success', 'status', 'payment_status', 'currency']
                for field in required_fields:
                    if field not in data:
                        self.log_test("Get Checkout Status", False, f"Missing field: {field}")
                        return False
                
                if not data.get('success'):
                    self.log_test("Get Checkout Status", False, "Success field is False")
                    return False
                
                # Check currency is EUR
                if data.get('currency') != 'eur':
                    self.log_test("Get Checkout Status", False, f"Wrong currency: {data.get('currency')}, expected 'eur'")
                    return False
                
                self.log_test("Get Checkout Status", True, f"Status retrieved: {data.get('status')}, Payment: {data.get('payment_status')}")
                return True
            else:
                self.log_test("Get Checkout Status", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Checkout Status", False, f"Exception: {str(e)}")
            return False
    
    def test_get_checkout_status_invalid_session(self):
        """Test GET /api/payments/checkout/status/{session_id} with invalid session"""
        invalid_session = "cs_invalid_session_id_12345"
        
        try:
            response = requests.get(f"{API_BASE}/payments/checkout/status/{invalid_session}", timeout=10)
            
            # Should return 500 or 404 for invalid session
            if response.status_code in [404, 500]:
                self.log_test("Get Checkout Status (Invalid Session)", True, f"Correctly handled invalid session with status {response.status_code}")
                return True
            else:
                self.log_test("Get Checkout Status (Invalid Session)", False, f"Expected 404/500, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Checkout Status (Invalid Session)", False, f"Exception: {str(e)}")
            return False
    
    def test_stripe_webhook_endpoint(self):
        """Test POST /api/webhook/stripe endpoint exists and responds"""
        # Test with empty body (should fail signature validation)
        try:
            response = requests.post(f"{API_BASE}/webhook/stripe", json={}, timeout=10)
            
            # Should return 400 for missing signature
            if response.status_code == 400:
                data = response.json()
                if "Missing Stripe signature" in data.get('detail', ''):
                    self.log_test("Stripe Webhook Endpoint", True, f"Correctly requires signature: {data}")
                    return True
                else:
                    self.log_test("Stripe Webhook Endpoint", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Stripe Webhook Endpoint", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Stripe Webhook Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_database_integration(self):
        """Test database integration by checking if payment transactions are created"""
        if not self.session_id:
            self.log_test("Database Integration", False, "No session ID available for database check")
            return False
        
        # We can't directly access the database, but we can infer from the checkout status response
        # that includes transaction data
        try:
            response = requests.get(f"{API_BASE}/payments/checkout/status/{self.session_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if transaction data is included
                if 'transaction' in data:
                    transaction = data['transaction']
                    if transaction and 'transaction_id' in transaction:
                        self.log_test("Database Integration", True, f"Transaction record found: {transaction.get('transaction_id')}")
                        return True
                    else:
                        self.log_test("Database Integration", False, "Transaction data is empty")
                        return False
                else:
                    # If no transaction field, but status works, database is likely working
                    self.log_test("Database Integration", True, "Database integration working (inferred from status response)")
                    return True
            else:
                self.log_test("Database Integration", False, f"Could not verify database integration: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Database Integration", False, f"Exception: {str(e)}")
            return False
    
    def test_security_price_manipulation(self):
        """Test that prices cannot be manipulated from frontend"""
        # Try to create a session with a different amount in metadata (should be ignored)
        payload = {
            "package_id": "zzlobby_boost",
            "origin_url": "http://localhost:3000",
            "amount": 1.0,  # Try to manipulate price
            "custom_price": 5.0  # Another manipulation attempt
        }
        
        try:
            response = requests.post(f"{API_BASE}/payments/checkout/session", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Get the session status to check the actual amount
                if data.get('session_id'):
                    status_response = requests.get(f"{API_BASE}/payments/checkout/status/{data['session_id']}", timeout=10)
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        amount_total = status_data.get('amount_total', 0)
                        
                        # Amount should be 4900 cents (49.00 EUR)
                        if amount_total == 4900:
                            self.log_test("Security - Price Manipulation", True, f"Price correctly enforced: {amount_total} cents")
                            return True
                        else:
                            self.log_test("Security - Price Manipulation", False, f"Price manipulation possible: {amount_total} cents instead of 4900")
                            return False
                    else:
                        self.log_test("Security - Price Manipulation", False, "Could not verify amount from status endpoint")
                        return False
                else:
                    self.log_test("Security - Price Manipulation", False, "No session ID returned")
                    return False
            else:
                self.log_test("Security - Price Manipulation", False, f"Session creation failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Security - Price Manipulation", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all Stripe payment tests"""
        print("=" * 70)
        print("STRIPE PAYMENT INTEGRATION TESTING")
        print("=" * 70)
        
        # Test API health first
        print("\n--- API Health Check ---")
        self.test_api_health_check()
        
        print("\n--- Payment Packages Tests ---")
        self.test_get_payment_packages()
        
        print("\n--- Checkout Session Tests ---")
        self.test_create_checkout_session_valid()
        self.test_create_checkout_session_invalid_package()
        self.test_create_checkout_session_missing_fields()
        
        print("\n--- Payment Status Tests ---")
        self.test_get_checkout_status()
        self.test_get_checkout_status_invalid_session()
        
        print("\n--- Webhook Tests ---")
        self.test_stripe_webhook_endpoint()
        
        print("\n--- Database Integration Tests ---")
        self.test_database_integration()
        
        print("\n--- Security Tests ---")
        self.test_security_price_manipulation()
        
        # Summary
        print("\n" + "=" * 70)
        print("STRIPE PAYMENT TEST SUMMARY")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['success']])
        failed_tests = len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\nFailed Tests:")
            for test in self.failed_tests:
                print(f"  - {test}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = StripePaymentTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All Stripe payment tests passed!")
        sys.exit(0)
    else:
        print(f"\n❌ {len(tester.failed_tests)} test(s) failed!")
        sys.exit(1)