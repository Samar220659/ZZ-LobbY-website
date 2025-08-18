#!/usr/bin/env python3
"""
Advanced AI Revenue Optimizer Testing
Test only the new Advanced AI system
"""

import sys
sys.path.append('/app')
from backend_test import BackendTester

def test_advanced_ai_only():
    """Test only Advanced AI Revenue Optimizer endpoints"""
    tester = BackendTester()
    
    print("🚀 ADVANCED AI REVENUE OPTIMIZER 2025 TESTING")
    print("=" * 60)
    print(f"Testing backend at: {tester.api_url}")
    print("-" * 60)
    
    # Test Advanced AI endpoints only
    ai_tests = [
        ("Advanced AI Dashboard", tester.test_advanced_ai_dashboard),
        ("Advanced AI Lead Scoring", tester.test_advanced_ai_lead_scoring),
        ("Advanced AI Pricing Optimization", tester.test_advanced_ai_pricing_optimization),
        ("Advanced AI Market Intelligence", tester.test_advanced_ai_market_intelligence),
        ("Advanced AI Full Optimization", tester.test_advanced_ai_full_optimization),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in ai_tests:
        try:
            print(f"\n🔍 Testing: {test_name}")
            if test_func():
                passed += 1
                print(f"✅ {test_name} - PASSED")
            else:
                failed += 1
                print(f"❌ {test_name} - FAILED")
        except Exception as e:
            tester.log_test(test_name, False, f"Test execution failed: {str(e)}")
            failed += 1
            print(f"❌ {test_name} - ERROR: {str(e)}")
        
        print("-" * 40)
    
    # Summary
    total = passed + failed
    success_rate = (passed / total * 100) if total > 0 else 0
    
    print("=" * 60)
    print("ADVANCED AI TEST SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {total}")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {failed} ❌")
    print(f"Success Rate: {success_rate:.1f}%")
    
    # Detailed results
    print("\nDETAILED RESULTS:")
    print("-" * 60)
    for test_name, result in tester.test_results.items():
        if "Advanced AI" in test_name:
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"{status} {test_name}")
            print(f"    Message: {result['message']}")
            if result["details"]:
                print(f"    Details: {result['details']}")
    
    return tester.test_results

if __name__ == "__main__":
    test_advanced_ai_only()