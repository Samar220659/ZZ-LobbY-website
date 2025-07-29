#!/usr/bin/env python3
"""
ZZ-Lobby Elite Backend API Testing Suite
Tests all critical endpoints for the €500/day revenue system
"""
import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class ZZLobbyEliteAPITester:
    def __init__(self, base_url="https://a217503f-f77c-48e4-819a-1223e37262bb.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int = 200, data: Dict = None) -> tuple:
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            details = f"Status: {response.status_code}, Expected: {expected_status}"
            if not success:
                details += f", Response: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response_data, response.status_code

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}, 0

    def test_system_status(self):
        """Test system status endpoint"""
        print("\n🔍 Testing System Status...")
        success, data, status = self.run_test(
            "System Status Check",
            "GET", 
            "",
            200
        )
        
        if success:
            print(f"   System Message: {data.get('message', 'N/A')}")
            print(f"   Status: {data.get('status', 'N/A')}")
            print(f"   Daily Target: {data.get('daily_target', 'N/A')}")
            print(f"   Version: {data.get('version', 'N/A')}")
        
        return success

    def test_products_endpoints(self):
        """Test all product-related endpoints"""
        print("\n🛍️ Testing Product Endpoints...")
        
        # Test get all products
        success, products_data, _ = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        
        if success and products_data:
            products = products_data.get('products', [])
            print(f"   Found {len(products)} products")
            
            # Test individual product endpoints
            for product in products[:2]:  # Test first 2 products
                product_id = product.get('id')
                if product_id:
                    self.run_test(
                        f"Get Product {product_id}",
                        "GET",
                        f"products/{product_id}",
                        200
                    )
                    
                    # Test product upsells
                    self.run_test(
                        f"Get Product Upsells {product_id}",
                        "GET",
                        f"products/{product_id}/upsells",
                        200
                    )
        
        # Test products by category
        self.run_test(
            "Get Products by Category",
            "GET",
            "products?category=starter",
            200
        )
        
        return success

    def test_offers_endpoint(self):
        """Test limited time offers"""
        print("\n🔥 Testing Limited Time Offers...")
        
        success, offers_data, _ = self.run_test(
            "Get Limited Time Offers",
            "GET",
            "offers/limited-time",
            200
        )
        
        if success and offers_data:
            offers = offers_data.get('offers', [])
            print(f"   Found {len(offers)} limited time offers")
            for offer in offers:
                print(f"   - {offer.get('product_id')}: {offer.get('discount')}% off")
        
        return success

    def test_analytics_endpoints(self):
        """Test analytics endpoints"""
        print("\n📊 Testing Analytics Endpoints...")
        
        # Test revenue stats
        success, revenue_data, _ = self.run_test(
            "Get Revenue Statistics",
            "GET",
            "analytics/revenue",
            200
        )
        
        if success and revenue_data:
            print(f"   Daily Revenue: €{revenue_data.get('daily_revenue', 0)}")
            print(f"   Daily Target: €{revenue_data.get('daily_target', 0)}")
            print(f"   Achievement: {revenue_data.get('achievement_percentage', 0):.1f}%")
            print(f"   Total Orders: {revenue_data.get('total_orders', 0)}")
        
        # Test bestsellers
        self.run_test(
            "Get Bestsellers",
            "GET",
            "analytics/bestsellers",
            200
        )
        
        return success

    def test_order_creation(self):
        """Test order creation endpoint"""
        print("\n💰 Testing Order Creation...")
        
        # Test order creation
        order_data = {
            "customer_email": "test@zz-lobby-elite.com",
            "customer_name": "Test Customer",
            "product_id": "zz_starter",
            "payment_method": "paypal",
            "conversion_source": "api_test"
        }
        
        success, response_data, _ = self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            order_data
        )
        
        if success and response_data:
            order = response_data.get('order', {})
            order_id = order.get('id')
            print(f"   Order ID: {order_id}")
            print(f"   Payment URL: {response_data.get('payment_url', 'N/A')}")
            
            # Test get order by ID
            if order_id:
                self.run_test(
                    f"Get Order {order_id}",
                    "GET",
                    f"orders/{order_id}",
                    200
                )
        
        return success

    def test_recommendations_endpoint(self):
        """Test product recommendations"""
        print("\n🎯 Testing Product Recommendations...")
        
        user_behavior = {
            "is_beginner": True,
            "has_experience": False,
            "is_serious_buyer": False
        }
        
        success, _, _ = self.run_test(
            "Get Product Recommendations",
            "POST",
            "recommendations",
            200,
            user_behavior
        )
        
        return success

    def test_legacy_endpoints(self):
        """Test legacy status endpoints for compatibility"""
        print("\n🔄 Testing Legacy Endpoints...")
        
        # Test create status check
        status_data = {
            "client_name": "API Test Client"
        }
        
        success, _, _ = self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            status_data
        )
        
        # Test get status checks
        self.run_test(
            "Get Status Checks",
            "GET",
            "status",
            200
        )
        
        return success

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        print("\n⚠️ Testing Error Handling...")
        
        # Test invalid product ID
        self.run_test(
            "Invalid Product ID",
            "GET",
            "products/invalid_id",
            404
        )
        
        # Test invalid order creation
        invalid_order = {
            "customer_email": "invalid-email",
            "product_id": "non_existent_product",
            "payment_method": "invalid_method"
        }
        
        self.run_test(
            "Invalid Order Creation",
            "POST",
            "orders",
            500,  # Should return error
            invalid_order
        )
        
        return True

    def run_performance_tests(self):
        """Test API performance"""
        print("\n⚡ Testing API Performance...")
        
        import time
        
        # Test response times
        endpoints_to_test = [
            ("", "System Status"),
            ("products", "Products List"),
            ("analytics/revenue", "Revenue Stats"),
            ("offers/limited-time", "Limited Offers")
        ]
        
        for endpoint, name in endpoints_to_test:
            start_time = time.time()
            success, _, _ = self.run_test(
                f"Performance: {name}",
                "GET",
                endpoint,
                200
            )
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to ms
            
            if success:
                if response_time < 500:
                    print(f"   ✅ {name}: {response_time:.0f}ms (EXCELLENT)")
                elif response_time < 1000:
                    print(f"   ⚠️ {name}: {response_time:.0f}ms (ACCEPTABLE)")
                else:
                    print(f"   ❌ {name}: {response_time:.0f}ms (SLOW)")

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 ZZ-LOBBY ELITE API TESTING SUITE")
        print("=" * 50)
        print(f"Testing API: {self.api_url}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run all test categories
        test_categories = [
            ("System Status", self.test_system_status),
            ("Products", self.test_products_endpoints),
            ("Limited Offers", self.test_offers_endpoint),
            ("Analytics", self.test_analytics_endpoints),
            ("Orders", self.test_order_creation),
            ("Recommendations", self.test_recommendations_endpoint),
            ("Legacy Endpoints", self.test_legacy_endpoints),
            ("Error Handling", self.test_error_handling),
            ("Performance", self.run_performance_tests)
        ]
        
        for category_name, test_func in test_categories:
            try:
                print(f"\n{'='*20} {category_name} {'='*20}")
                test_func()
            except Exception as e:
                print(f"❌ Error in {category_name}: {str(e)}")
        
        # Print final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive test results"""
        print("\n" + "="*60)
        print("🏆 FINAL TEST RESULTS")
        print("="*60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 EXCELLENT: API is performing exceptionally well!")
        elif success_rate >= 75:
            print("👍 GOOD: API is working well with minor issues")
        elif success_rate >= 50:
            print("⚠️ MODERATE: API has some issues that need attention")
        else:
            print("🚨 CRITICAL: API has major issues requiring immediate attention")
        
        # Print failed tests
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"   - {test['test']}: {test['details']}")
        
        print(f"\nTesting completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return success_rate >= 75  # Return True if success rate is acceptable

def main():
    """Main test execution"""
    print("🎯 ZZ-LOBBY ELITE - COMPREHENSIVE API TESTING")
    print("Target: €500/day revenue system validation")
    print("=" * 60)
    
    tester = ZZLobbyEliteAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n⏹️ Testing interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Critical error during testing: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())