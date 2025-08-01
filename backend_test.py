#!/usr/bin/env python3
"""
Backend API Testing for ZZ-Lobby Elite System
Tests all backend API endpoints including Digistore24 Affiliate System
"""

import requests
import json
import os
from datetime import datetime
import sys
import hashlib
import hmac

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
print(f"Testing backend at: {API_BASE}")

class Digistore24AffiliateTester:
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
    
    def test_affiliate_stats_endpoint(self):
        """Test GET /api/affiliate/stats endpoint"""
        try:
            response = requests.get(f"{self.api_base}/affiliate/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'stats' in data:
                    stats = data['stats']
                    required_fields = ['total_sales', 'total_commission', 'total_profit', 'active_affiliates', 'commission_rate', 'platform']
                    
                    missing_fields = [field for field in required_fields if field not in stats]
                    if not missing_fields:
                        self.log_test("Affiliate Stats Endpoint", True, f"Stats structure correct: {stats}")
                        return True
                    else:
                        self.log_test("Affiliate Stats Endpoint", False, f"Missing fields: {missing_fields}")
                        return False
                else:
                    self.log_test("Affiliate Stats Endpoint", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Affiliate Stats Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Affiliate Stats Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_affiliate_link_generation(self):
        """Test POST /api/affiliate/generate-link endpoint"""
        payload = {
            "affiliate_name": "MaxMustermann",
            "campaign_key": "zzlobby_boost_2025"
        }
        
        try:
            response = requests.post(f"{self.api_base}/affiliate/generate-link", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if (data.get('success') and 
                    'affiliate_link' in data and 
                    'affiliate_name' in data and
                    data['affiliate_name'] == payload['affiliate_name']):
                    
                    # Validate link format
                    link = data['affiliate_link']
                    if 'digistore24.com/redir' in link and payload['affiliate_name'] in link:
                        self.log_test("Affiliate Link Generation", True, f"Generated link: {link}")
                        return True
                    else:
                        self.log_test("Affiliate Link Generation", False, f"Invalid link format: {link}")
                        return False
                else:
                    self.log_test("Affiliate Link Generation", False, f"Invalid response: {data}")
                    return False
            else:
                self.log_test("Affiliate Link Generation", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Affiliate Link Generation", False, f"Exception: {str(e)}")
            return False
    
    def test_affiliate_link_generation_missing_name(self):
        """Test affiliate link generation with missing affiliate name"""
        payload = {
            "campaign_key": "test_campaign"
            # affiliate_name missing
        }
        
        try:
            response = requests.post(f"{self.api_base}/affiliate/generate-link", json=payload, timeout=10)
            
            if response.status_code == 400:
                data = response.json()
                if "Affiliate name required" in data.get('detail', ''):
                    self.log_test("Affiliate Link Generation - Missing Name", True, f"Correctly rejected: {data}")
                    return True
                else:
                    self.log_test("Affiliate Link Generation - Missing Name", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Affiliate Link Generation - Missing Name", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Affiliate Link Generation - Missing Name", False, f"Exception: {str(e)}")
            return False
    
    def test_affiliate_sales_endpoint(self):
        """Test GET /api/affiliate/sales endpoint"""
        try:
            response = requests.get(f"{self.api_base}/affiliate/sales?limit=10", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'sales' in data and 'count' in data:
                    sales = data['sales']
                    count = data['count']
                    
                    # Should return list (even if empty)
                    if isinstance(sales, list) and isinstance(count, int):
                        self.log_test("Affiliate Sales Endpoint", True, f"Sales count: {count}, Structure correct")
                        return True
                    else:
                        self.log_test("Affiliate Sales Endpoint", False, f"Invalid data types: sales={type(sales)}, count={type(count)}")
                        return False
                else:
                    self.log_test("Affiliate Sales Endpoint", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Affiliate Sales Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Affiliate Sales Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_affiliate_payments_endpoint(self):
        """Test GET /api/affiliate/payments endpoint"""
        try:
            response = requests.get(f"{self.api_base}/affiliate/payments", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'payments' in data and 'count' in data:
                    payments = data['payments']
                    count = data['count']
                    
                    # Should return list (even if empty)
                    if isinstance(payments, list) and isinstance(count, int):
                        self.log_test("Affiliate Payments Endpoint", True, f"Payments count: {count}, Structure correct")
                        return True
                    else:
                        self.log_test("Affiliate Payments Endpoint", False, f"Invalid data types: payments={type(payments)}, count={type(count)}")
                        return False
                else:
                    self.log_test("Affiliate Payments Endpoint", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Affiliate Payments Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Affiliate Payments Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_affiliate_payments_with_status_filter(self):
        """Test GET /api/affiliate/payments with status filter"""
        try:
            response = requests.get(f"{self.api_base}/affiliate/payments?status=pending", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'payments' in data and 'count' in data:
                    self.log_test("Affiliate Payments - Status Filter", True, f"Filtered payments: {data['count']}")
                    return True
                else:
                    self.log_test("Affiliate Payments - Status Filter", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Affiliate Payments - Status Filter", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Affiliate Payments - Status Filter", False, f"Exception: {str(e)}")
            return False
    
    def test_digistore24_webhook_endpoint_structure(self):
        """Test POST /api/affiliate/digistore24/webhook endpoint structure (without valid signature)"""
        # Mock IPN data
        form_data = {
            'buyer_email': 'kunde@example.com',
            'order_id': 'DS24_TEST_12345',
            'product_id': '12345',
            'vendor_id': 'test_vendor',
            'affiliate_name': 'TestAffiliate',
            'amount': '49.00',
            'currency': 'EUR',
            'payment_method': 'paypal',
            'transaction_id': 'TXN_TEST_67890',
            'order_date': '2025-01-27 10:30:00',
            'affiliate_link': 'https://www.digistore24.com/redir/12345/TestAffiliate',
            'campaignkey': 'test_campaign'
        }
        
        try:
            # Send as form data (not JSON) as Digistore24 sends form data
            response = requests.post(f"{self.api_base}/affiliate/digistore24/webhook", 
                                   data=form_data, 
                                   headers={'X-Digistore24-Signature': 'invalid_signature'},
                                   timeout=10)
            
            # Should return 400 for invalid signature (which is expected behavior)
            if response.status_code == 400:
                data = response.json()
                if "Invalid signature" in data.get('detail', ''):
                    self.log_test("Digistore24 Webhook - Signature Validation", True, f"Correctly validates signature: {data}")
                    return True
                else:
                    self.log_test("Digistore24 Webhook - Signature Validation", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Digistore24 Webhook - Signature Validation", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Digistore24 Webhook - Signature Validation", False, f"Exception: {str(e)}")
            return False
    
    def test_environment_configuration(self):
        """Test that environment variables are properly configured"""
        try:
            # Read backend .env file
            env_file = '/app/backend/.env'
            if not os.path.exists(env_file):
                self.log_test("Environment Configuration", False, "Backend .env file not found")
                return False
            
            required_vars = [
                'DIGISTORE24_VENDOR_ID',
                'DIGISTORE24_API_KEY', 
                'DIGISTORE24_IPN_PASSPHRASE',
                'DIGISTORE24_PRODUCT_ID',
                'AFFILIATE_COMMISSION_RATE',
                'DIGISTORE24_WEBHOOK_URL'
            ]
            
            found_vars = []
            with open(env_file, 'r') as f:
                content = f.read()
                for var in required_vars:
                    if f"{var}=" in content:
                        found_vars.append(var)
            
            missing_vars = [var for var in required_vars if var not in found_vars]
            
            if not missing_vars:
                self.log_test("Environment Configuration", True, f"All required Digistore24 variables present: {found_vars}")
                return True
            else:
                self.log_test("Environment Configuration", False, f"Missing variables: {missing_vars}")
                return False
                
        except Exception as e:
            self.log_test("Environment Configuration", False, f"Exception: {str(e)}")
            return False
    
    def test_commission_rate_configuration(self):
        """Test that commission rate is properly set to 50%"""
        try:
            # Check if commission rate is set correctly in environment
            env_file = '/app/backend/.env'
            with open(env_file, 'r') as f:
                content = f.read()
                if 'AFFILIATE_COMMISSION_RATE=0.50' in content or 'AFFILIATE_COMMISSION_RATE=0.5' in content:
                    self.log_test("Commission Rate Configuration", True, "Commission rate set to 50% (0.50)")
                    return True
                else:
                    self.log_test("Commission Rate Configuration", False, "Commission rate not set to 50%")
                    return False
                    
        except Exception as e:
            self.log_test("Commission Rate Configuration", False, f"Exception: {str(e)}")
            return False
    
    def run_all_affiliate_tests(self):
        """Run all affiliate system tests"""
        print("\n" + "=" * 80)
        print("🚀 DIGISTORE24 AFFILIATE SYSTEM COMPREHENSIVE TESTING")
        print("=" * 80)
        
        print("\n--- Environment & Configuration Tests ---")
        self.test_environment_configuration()
        self.test_commission_rate_configuration()
        
        print("\n--- Affiliate API Endpoints Tests ---")
        self.test_affiliate_stats_endpoint()
        self.test_affiliate_link_generation()
        self.test_affiliate_link_generation_missing_name()
        self.test_affiliate_sales_endpoint()
        self.test_affiliate_payments_endpoint()
        self.test_affiliate_payments_with_status_filter()
        self.test_digistore24_webhook_endpoint_structure()
        
        # Summary
        print("\n" + "=" * 80)
        print("🎯 AFFILIATE SYSTEM TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['success']])
        failed_tests = len(self.failed_tests)
        
        print(f"Total Affiliate Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Affiliate Tests:")
            for test in self.failed_tests:
                print(f"  - {test}")
        else:
            print("\n✅ ALL AFFILIATE SYSTEM TESTS PASSED!")
        
        return failed_tests == 0


class SocialMediaConnectTester:
    def __init__(self):
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
    
    def test_valid_facebook_connection(self):
        """Test valid Facebook connection"""
        payload = {
            "platform": "facebook",
            "email": "maria.schmidt@facebook.com",
            "password": "SecurePass123!"
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'facebook erfolgreich verbunden!' in data.get('message', ''):
                    self.log_test("Valid Facebook Connection", True, f"Response: {data}")
                    return True
                else:
                    self.log_test("Valid Facebook Connection", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Valid Facebook Connection", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Valid Facebook Connection", False, f"Exception: {str(e)}")
            return False
    
    def test_valid_instagram_connection(self):
        """Test valid Instagram connection"""
        payload = {
            "platform": "instagram",
            "email": "anna.mueller@instagram.com",
            "password": "InstagramPass456!"
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'instagram erfolgreich verbunden!' in data.get('message', ''):
                    self.log_test("Valid Instagram Connection", True, f"Response: {data}")
                    return True
                else:
                    self.log_test("Valid Instagram Connection", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Valid Instagram Connection", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Valid Instagram Connection", False, f"Exception: {str(e)}")
            return False
    
    def test_valid_linkedin_connection(self):
        """Test valid LinkedIn connection"""
        payload = {
            "platform": "linkedin",
            "email": "thomas.weber@linkedin.com",
            "password": "LinkedInSecure789!"
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'linkedin erfolgreich verbunden!' in data.get('message', ''):
                    self.log_test("Valid LinkedIn Connection", True, f"Response: {data}")
                    return True
                else:
                    self.log_test("Valid LinkedIn Connection", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Valid LinkedIn Connection", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Valid LinkedIn Connection", False, f"Exception: {str(e)}")
            return False
    
    def test_missing_email_validation(self):
        """Test missing email field validation"""
        payload = {
            "platform": "facebook",
            "password": "testpassword123"
            # email field missing
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            # Should return 400 or 422 for validation error
            if response.status_code in [400, 422]:
                self.log_test("Missing Email Validation", True, f"Correctly rejected with status {response.status_code}")
                return True
            else:
                self.log_test("Missing Email Validation", False, f"Expected 400/422, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Missing Email Validation", False, f"Exception: {str(e)}")
            return False
    
    def test_missing_password_validation(self):
        """Test missing password field validation"""
        payload = {
            "platform": "facebook",
            "email": "test@facebook.com"
            # password field missing
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            # Should return 400 or 422 for validation error
            if response.status_code in [400, 422]:
                self.log_test("Missing Password Validation", True, f"Correctly rejected with status {response.status_code}")
                return True
            else:
                self.log_test("Missing Password Validation", False, f"Expected 400/422, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Missing Password Validation", False, f"Exception: {str(e)}")
            return False
    
    def test_empty_email_validation(self):
        """Test empty email field validation"""
        payload = {
            "platform": "facebook",
            "email": "",
            "password": "testpassword123"
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            # Should return 400 for validation error
            if response.status_code == 400:
                data = response.json()
                if "E-Mail und Passwort sind erforderlich" in data.get('detail', ''):
                    self.log_test("Empty Email Validation", True, f"Correctly rejected: {data}")
                    return True
                else:
                    self.log_test("Empty Email Validation", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Empty Email Validation", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Empty Email Validation", False, f"Exception: {str(e)}")
            return False
    
    def test_empty_password_validation(self):
        """Test empty password field validation"""
        payload = {
            "platform": "facebook",
            "email": "test@facebook.com",
            "password": ""
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            # Should return 400 for validation error
            if response.status_code == 400:
                data = response.json()
                if "E-Mail und Passwort sind erforderlich" in data.get('detail', ''):
                    self.log_test("Empty Password Validation", True, f"Correctly rejected: {data}")
                    return True
                else:
                    self.log_test("Empty Password Validation", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Empty Password Validation", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Empty Password Validation", False, f"Exception: {str(e)}")
            return False
    
    def test_unsupported_platform(self):
        """Test unsupported platform validation"""
        payload = {
            "platform": "twitter",
            "email": "test@twitter.com",
            "password": "testpassword123"
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            # Should return 400 for unsupported platform
            if response.status_code == 400:
                data = response.json()
                if "Unsupported platform" in data.get('detail', ''):
                    self.log_test("Unsupported Platform Validation", True, f"Correctly rejected: {data}")
                    return True
                else:
                    self.log_test("Unsupported Platform Validation", False, f"Wrong error message: {data}")
                    return False
            else:
                self.log_test("Unsupported Platform Validation", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Unsupported Platform Validation", False, f"Exception: {str(e)}")
            return False
    
    def test_case_insensitive_platforms(self):
        """Test that platform names are case insensitive"""
        payload = {
            "platform": "FACEBOOK",
            "email": "test@facebook.com",
            "password": "testpassword123"
        }
        
        try:
            response = requests.post(f"{API_BASE}/social-connect", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'FACEBOOK erfolgreich verbunden!' in data.get('message', ''):
                    self.log_test("Case Insensitive Platform", True, f"Response: {data}")
                    return True
                else:
                    self.log_test("Case Insensitive Platform", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Case Insensitive Platform", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Case Insensitive Platform", False, f"Exception: {str(e)}")
            return False
    
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
    
    def run_all_tests(self):
        """Run all tests"""
        print("=" * 60)
        print("SOCIAL MEDIA CONNECT API TESTING")
        print("=" * 60)
        
        # Test API health first
        self.test_api_health_check()
        
        print("\n--- Valid Connection Tests ---")
        self.test_valid_facebook_connection()
        self.test_valid_instagram_connection()
        self.test_valid_linkedin_connection()
        self.test_case_insensitive_platforms()
        
        print("\n--- Validation Tests ---")
        self.test_missing_email_validation()
        self.test_missing_password_validation()
        self.test_empty_email_validation()
        self.test_empty_password_validation()
        self.test_unsupported_platform()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
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
    tester = SocialMediaConnectTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print(f"\n❌ {len(tester.failed_tests)} test(s) failed!")
        sys.exit(1)