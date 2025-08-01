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