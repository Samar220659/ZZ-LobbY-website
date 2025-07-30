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
            "hyperschwarm_optimization": {"status": "unknown", "details": []},
            "hyperschwarm_opal_templates": {"status": "unknown", "details": []},
            "hyperschwarm_opal_create_app": {"status": "unknown", "details": []},
            "hyperschwarm_opal_landing_page": {"status": "unknown", "details": []},
            "hyperschwarm_claude_tiktok": {"status": "unknown", "details": []},
            "hyperschwarm_claude_email": {"status": "unknown", "details": []},
            "hyperschwarm_integrated_campaign": {"status": "unknown", "details": []}
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

    def test_hyperschwarm_status(self):
        """Test HYPERSCHWARM System Status API"""
        print("\n=== Testing HYPERSCHWARM System Status ===")
        
        try:
            response = self.session.get(f"{API_BASE}/hyperschwarm/status")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'system_status', 'message']
                
                if all(field in data for field in required_fields):
                    system_status = data['system_status']
                    status_fields = ['system_health', 'total_agents', 'active_agents', 'avg_performance_score']
                    
                    if all(field in system_status for field in status_fields):
                        # Check if system health is close to 99.99%
                        health = system_status['system_health']
                        if health >= 99.0:
                            self.log_result("hyperschwarm_status", True, 
                                          f"HYPERSCHWARM status OK - Health: {health}%, Agents: {system_status['total_agents']}", 
                                          data)
                        else:
                            self.log_result("hyperschwarm_status", False, 
                                          f"System health too low: {health}%")
                    else:
                        missing = [f for f in status_fields if f not in system_status]
                        self.log_result("hyperschwarm_status", False, f"Missing system status fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_status", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_status", False, 
                              f"HYPERSCHWARM status API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_status", False, f"HYPERSCHWARM status error: {str(e)}")

    def test_hyperschwarm_agents(self):
        """Test HYPERSCHWARM Agents Details API"""
        print("\n=== Testing HYPERSCHWARM Agents Details ===")
        
        try:
            response = self.session.get(f"{API_BASE}/hyperschwarm/agents")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'agents', 'total_agents', 'message']
                
                if all(field in data for field in required_fields):
                    agents = data['agents']
                    total_agents = data['total_agents']
                    
                    # Check if we have 20+ agents as expected
                    if total_agents >= 20:
                        # Verify agent structure
                        if len(agents) > 0:
                            agent = agents[0]
                            agent_fields = ['agent_id', 'specialization', 'performance_score', 'tasks_completed', 'revenue_generated', 'active']
                            
                            if all(field in agent for field in agent_fields):
                                # Check for expected agent types
                                specializations = [agent['specialization'] for agent in agents]
                                expected_types = ['Marketing', 'Sales', 'Traffic Generation', 'Automation', 'Data Analytics', 'Compliance & Legal']
                                found_types = [spec for spec in expected_types if spec in specializations]
                                
                                if len(found_types) >= 5:  # At least 5 different types
                                    self.log_result("hyperschwarm_agents", True, 
                                                  f"All {total_agents} agents retrieved successfully with {len(found_types)} specializations", 
                                                  {"total_agents": total_agents, "specializations": found_types})
                                else:
                                    self.log_result("hyperschwarm_agents", False, 
                                                  f"Insufficient agent specializations: {found_types}")
                            else:
                                missing = [f for f in agent_fields if f not in agent]
                                self.log_result("hyperschwarm_agents", False, f"Missing agent fields: {missing}")
                        else:
                            self.log_result("hyperschwarm_agents", False, "No agent details found")
                    else:
                        self.log_result("hyperschwarm_agents", False, 
                                      f"Insufficient agents: {total_agents} (expected 20+)")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_agents", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_agents", False, 
                              f"HYPERSCHWARM agents API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_agents", False, f"HYPERSCHWARM agents error: {str(e)}")

    def test_hyperschwarm_strategy_execution(self):
        """Test HYPERSCHWARM Strategy Execution API"""
        print("\n=== Testing HYPERSCHWARM Strategy Execution ===")
        
        try:
            # Test different strategy objectives
            test_strategies = [
                {
                    "objective": "Increase revenue through automated marketing campaigns",
                    "priority": "high",
                    "target_revenue": 5000.0,
                    "timeframe": "24h"
                },
                {
                    "objective": "Optimize conversion rates across all funnels",
                    "priority": "medium",
                    "target_revenue": 3000.0,
                    "timeframe": "48h"
                }
            ]
            
            successful_executions = 0
            
            for i, strategy_data in enumerate(test_strategies):
                response = self.session.post(f"{API_BASE}/hyperschwarm/execute-strategy", json=strategy_data)
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ['success', 'strategy_execution', 'message']
                    
                    if all(field in data for field in required_fields):
                        execution = data['strategy_execution']
                        execution_fields = ['strategy_id', 'objective', 'execution_time', 'participating_agents']
                        
                        if all(field in execution for field in execution_fields):
                            successful_executions += 1
                            self.log_result("hyperschwarm_strategy", True, 
                                          f"Strategy {i+1} executed successfully - ID: {execution['strategy_id']}, Agents: {execution['participating_agents']}")
                        else:
                            missing = [f for f in execution_fields if f not in execution]
                            self.log_result("hyperschwarm_strategy", False, 
                                          f"Strategy {i+1} missing execution fields: {missing}")
                    else:
                        missing = [f for f in required_fields if f not in data]
                        self.log_result("hyperschwarm_strategy", False, 
                                      f"Strategy {i+1} missing required fields: {missing}")
                else:
                    self.log_result("hyperschwarm_strategy", False, 
                                  f"Strategy {i+1} execution failed: {response.status_code} - {response.text}")
            
            # Overall assessment
            if successful_executions == len(test_strategies):
                self.log_result("hyperschwarm_strategy", True, 
                              f"All {successful_executions} strategy executions successful")
            elif successful_executions > 0:
                self.log_result("hyperschwarm_strategy", True, 
                              f"Partial success: {successful_executions}/{len(test_strategies)} strategies executed")
            else:
                self.log_result("hyperschwarm_strategy", False, "No strategies executed successfully")
                
        except Exception as e:
            self.log_result("hyperschwarm_strategy", False, f"HYPERSCHWARM strategy execution error: {str(e)}")

    def test_hyperschwarm_performance_metrics(self):
        """Test HYPERSCHWARM Performance Metrics API"""
        print("\n=== Testing HYPERSCHWARM Performance Metrics ===")
        
        try:
            response = self.session.get(f"{API_BASE}/hyperschwarm/performance-metrics")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'performance_metrics', 'message']
                
                if all(field in data for field in required_fields):
                    metrics = data['performance_metrics']
                    metrics_fields = [
                        'total_revenue_generated', 'average_performance_score', 
                        'total_tasks_completed', 'active_agents', 'performance_by_category',
                        'system_efficiency', 'daily_revenue_projection', 'monthly_revenue_projection'
                    ]
                    
                    if all(field in metrics for field in metrics_fields):
                        # Validate revenue projections format
                        daily_proj = metrics['daily_revenue_projection']
                        monthly_proj = metrics['monthly_revenue_projection']
                        
                        if daily_proj.startswith('€') and monthly_proj.startswith('€'):
                            # Check performance by category
                            perf_by_cat = metrics['performance_by_category']
                            if isinstance(perf_by_cat, dict) and len(perf_by_cat) > 0:
                                self.log_result("hyperschwarm_performance", True, 
                                              f"Performance metrics retrieved - Revenue: €{metrics['total_revenue_generated']}, Efficiency: {metrics['system_efficiency']}", 
                                              metrics)
                            else:
                                self.log_result("hyperschwarm_performance", False, 
                                              "Performance by category data missing or invalid")
                        else:
                            self.log_result("hyperschwarm_performance", False, 
                                          "Revenue projections format invalid")
                    else:
                        missing = [f for f in metrics_fields if f not in metrics]
                        self.log_result("hyperschwarm_performance", False, f"Missing metrics fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_performance", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_performance", False, 
                              f"HYPERSCHWARM performance API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_performance", False, f"HYPERSCHWARM performance error: {str(e)}")

    def test_hyperschwarm_agent_optimization(self):
        """Test HYPERSCHWARM Agent Optimization API"""
        print("\n=== Testing HYPERSCHWARM Agent Optimization ===")
        
        try:
            response = self.session.post(f"{API_BASE}/hyperschwarm/optimize-agents")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'optimization_results', 'optimized_agents', 'message']
                
                if all(field in data for field in required_fields):
                    optimization_results = data['optimization_results']
                    optimized_agents = data['optimized_agents']
                    
                    # Check if optimization was performed
                    if isinstance(optimization_results, list):
                        if len(optimization_results) > 0:
                            # Verify optimization result structure
                            result = optimization_results[0]
                            result_fields = ['agent_id', 'action', 'improvement']
                            
                            if all(field in result for field in result_fields):
                                self.log_result("hyperschwarm_optimization", True, 
                                              f"Agent optimization successful - {optimized_agents} agents optimized", 
                                              {"optimized_count": optimized_agents, "sample_result": result})
                            else:
                                missing = [f for f in result_fields if f not in result]
                                self.log_result("hyperschwarm_optimization", False, 
                                              f"Missing optimization result fields: {missing}")
                        else:
                            # No agents needed optimization - still success
                            self.log_result("hyperschwarm_optimization", True, 
                                          "Agent optimization completed - no agents required optimization")
                    else:
                        self.log_result("hyperschwarm_optimization", False, 
                                      "Optimization results not in expected format")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_optimization", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_optimization", False, 
                              f"HYPERSCHWARM optimization API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_optimization", False, f"HYPERSCHWARM optimization error: {str(e)}")

    def test_hyperschwarm_opal_templates(self):
        """Test HYPERSCHWARM Google Opal Templates API"""
        print("\n=== Testing HYPERSCHWARM Google Opal Templates ===")
        
        try:
            response = self.session.get(f"{API_BASE}/hyperschwarm/opal/templates")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'templates', 'total_templates', 'message']
                
                if all(field in data for field in required_fields):
                    templates = data['templates']
                    total_templates = data['total_templates']
                    
                    if isinstance(templates, list) and len(templates) > 0:
                        # Verify template structure
                        template = templates[0]
                        template_fields = ['template_id', 'name', 'description', 'features', 'use_cases']
                        
                        if all(field in template for field in template_fields):
                            # Check for expected template types
                            template_ids = [t['template_id'] for t in templates]
                            expected_types = ['landing_page', 'quiz_funnel', 'calculator', 'webinar_registration', 'viral_contest']
                            found_types = [t_id for t_id in expected_types if t_id in template_ids]
                            
                            if len(found_types) >= 3:  # At least 3 template types
                                self.log_result("hyperschwarm_opal_templates", True, 
                                              f"Google Opal templates retrieved successfully - {total_templates} templates with {len(found_types)} types", 
                                              {"total_templates": total_templates, "template_types": found_types})
                            else:
                                self.log_result("hyperschwarm_opal_templates", False, 
                                              f"Insufficient template types: {found_types}")
                        else:
                            missing = [f for f in template_fields if f not in template]
                            self.log_result("hyperschwarm_opal_templates", False, f"Missing template fields: {missing}")
                    else:
                        self.log_result("hyperschwarm_opal_templates", False, "No templates found or invalid format")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_opal_templates", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_opal_templates", False, 
                              f"Opal templates API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_opal_templates", False, f"Opal templates error: {str(e)}")

    def test_hyperschwarm_opal_create_app(self):
        """Test HYPERSCHWARM Google Opal Create App API"""
        print("\n=== Testing HYPERSCHWARM Google Opal Create App ===")
        
        try:
            # Test app creation with Elite Trading System parameters
            app_data = {
                "app_type": "landing_page",
                "product_name": "Elite Trading System",
                "product_price": 997.0,
                "target_audience": "digital_entrepreneurs",
                "campaign_config": {
                    "hook": "Entdecke das Elite Trading System - Das System das alles verändert",
                    "urgency": "Limitiertes Angebot - Nur 48 Stunden",
                    "social_proof": "5000+ erfolgreiche Trader"
                }
            }
            
            response = self.session.post(f"{API_BASE}/hyperschwarm/opal/create-app", json=app_data)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'opal_app', 'message']
                
                if all(field in data for field in required_fields):
                    opal_app = data['opal_app']
                    app_fields = ['app_id', 'app_name', 'app_url', 'app_type', 'created_at', 'performance_metrics']
                    
                    if all(field in opal_app for field in app_fields):
                        # Verify app URL format
                        app_url = opal_app['app_url']
                        if app_url.startswith('https://') and 'opal' in app_url.lower():
                            self.log_result("hyperschwarm_opal_create_app", True, 
                                          f"Google Opal app created successfully - ID: {opal_app['app_id']}, URL: {app_url}", 
                                          opal_app)
                        else:
                            self.log_result("hyperschwarm_opal_create_app", False, 
                                          f"Invalid app URL format: {app_url}")
                    else:
                        missing = [f for f in app_fields if f not in opal_app]
                        self.log_result("hyperschwarm_opal_create_app", False, f"Missing opal app fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_opal_create_app", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_opal_create_app", False, 
                              f"Opal create app API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_opal_create_app", False, f"Opal create app error: {str(e)}")

    def test_hyperschwarm_opal_landing_page(self):
        """Test HYPERSCHWARM Google Opal Landing Page API"""
        print("\n=== Testing HYPERSCHWARM Google Opal Landing Page ===")
        
        try:
            # Test landing page creation
            landing_data = {
                "product_data": {
                    "name": "Elite Trading System",
                    "price": 997.0
                },
                "campaign_config": {
                    "hook": "Entdecke das Elite Trading System",
                    "target_audience": "digital_entrepreneurs",
                    "urgency": "Limitierte Zeit",
                    "social_proof": "5000+ erfolgreiche Nutzer"
                }
            }
            
            response = self.session.post(f"{API_BASE}/hyperschwarm/opal/create-landing-page", json=landing_data)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'landing_page', 'message']
                
                if all(field in data for field in required_fields):
                    landing_page = data['landing_page']
                    page_fields = ['app_id', 'app_name', 'app_url', 'created_at', 'features']
                    
                    if all(field in landing_page for field in page_fields):
                        # Verify features
                        features = landing_page['features']
                        expected_features = ['countdown_timer', 'social_proof', 'payment_integration', 'mobile_responsive']
                        
                        if all(feature in features for feature in expected_features):
                            self.log_result("hyperschwarm_opal_landing_page", True, 
                                          f"Google Opal landing page created successfully - ID: {landing_page['app_id']}", 
                                          landing_page)
                        else:
                            missing_features = [f for f in expected_features if f not in features]
                            self.log_result("hyperschwarm_opal_landing_page", False, 
                                          f"Missing landing page features: {missing_features}")
                    else:
                        missing = [f for f in page_fields if f not in landing_page]
                        self.log_result("hyperschwarm_opal_landing_page", False, f"Missing landing page fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_opal_landing_page", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_opal_landing_page", False, 
                              f"Opal landing page API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_opal_landing_page", False, f"Opal landing page error: {str(e)}")

    def test_hyperschwarm_claude_tiktok(self):
        """Test HYPERSCHWARM Claude AI TikTok Content API"""
        print("\n=== Testing HYPERSCHWARM Claude AI TikTok Content ===")
        
        try:
            # Test TikTok content generation with Elite Trading System parameters
            tiktok_params = {
                "product_name": "Elite Trading System",
                "product_price": 997.0,
                "target_audience": "digital_entrepreneurs"
            }
            
            response = self.session.post(f"{API_BASE}/hyperschwarm/ai-content/tiktok", params=tiktok_params)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'ai_content', 'message']
                
                if all(field in data for field in required_fields):
                    ai_content = data['ai_content']
                    content_fields = ['content_id', 'title', 'content', 'target_audience', 'predicted_performance', 'ai_confidence']
                    
                    if all(field in ai_content for field in content_fields):
                        # Verify content quality
                        content = ai_content['content']
                        predicted_performance = ai_content['predicted_performance']
                        ai_confidence = ai_content['ai_confidence']
                        
                        if len(content) > 100 and predicted_performance > 0 and ai_confidence > 0.8:
                            self.log_result("hyperschwarm_claude_tiktok", True, 
                                          f"Claude AI TikTok content generated successfully - Confidence: {ai_confidence:.2f}, Performance: {predicted_performance:.2f}", 
                                          {"content_id": ai_content['content_id'], "content_length": len(content)})
                        else:
                            self.log_result("hyperschwarm_claude_tiktok", False, 
                                          f"Content quality insufficient - Length: {len(content)}, Confidence: {ai_confidence}")
                    else:
                        missing = [f for f in content_fields if f not in ai_content]
                        self.log_result("hyperschwarm_claude_tiktok", False, f"Missing AI content fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_claude_tiktok", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_claude_tiktok", False, 
                              f"Claude TikTok API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_claude_tiktok", False, f"Claude TikTok error: {str(e)}")

    def test_hyperschwarm_claude_email(self):
        """Test HYPERSCHWARM Claude AI Email Campaign API"""
        print("\n=== Testing HYPERSCHWARM Claude AI Email Campaign ===")
        
        try:
            # Test email campaign generation
            email_params = {
                "product_name": "Elite Trading System",
                "product_price": 997.0,
                "campaign_type": "launch"
            }
            
            response = self.session.post(f"{API_BASE}/hyperschwarm/ai-content/email", params=email_params)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'email_campaign', 'message']
                
                if all(field in data for field in required_fields):
                    email_campaign = data['email_campaign']
                    campaign_fields = ['content_id', 'title', 'content', 'predicted_performance', 'ai_confidence']
                    
                    if all(field in email_campaign for field in campaign_fields):
                        # Verify email content quality
                        content = email_campaign['content']
                        predicted_performance = email_campaign['predicted_performance']
                        ai_confidence = email_campaign['ai_confidence']
                        
                        if len(content) > 200 and predicted_performance > 0 and ai_confidence > 0.8:
                            self.log_result("hyperschwarm_claude_email", True, 
                                          f"Claude AI email campaign generated successfully - Confidence: {ai_confidence:.2f}, Performance: {predicted_performance:.2f}", 
                                          {"content_id": email_campaign['content_id'], "content_length": len(content)})
                        else:
                            self.log_result("hyperschwarm_claude_email", False, 
                                          f"Email content quality insufficient - Length: {len(content)}, Confidence: {ai_confidence}")
                    else:
                        missing = [f for f in campaign_fields if f not in email_campaign]
                        self.log_result("hyperschwarm_claude_email", False, f"Missing email campaign fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_claude_email", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_claude_email", False, 
                              f"Claude email API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_claude_email", False, f"Claude email error: {str(e)}")

    def test_hyperschwarm_integrated_campaign(self):
        """Test HYPERSCHWARM Integrated Campaign API (VOLLAUTOMATISIERTE KAMPAGNE)"""
        print("\n=== Testing HYPERSCHWARM Integrated Campaign (VOLLAUTOMATISIERT) ===")
        
        try:
            # Test integrated campaign with Elite Trading System parameters
            campaign_params = {
                "product_name": "Elite Trading System",
                "product_price": 997.0,
                "target_audience": "digital_entrepreneurs"
            }
            
            response = self.session.post(f"{API_BASE}/hyperschwarm/integrated-campaign", params=campaign_params)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['success', 'integrated_campaign', 'message']
                
                if all(field in data for field in required_fields):
                    campaign = data['integrated_campaign']
                    campaign_fields = ['tiktok_content', 'email_campaign', 'landing_page', 'campaign_summary']
                    
                    if all(field in campaign for field in campaign_fields):
                        # Verify each component
                        tiktok_content = campaign['tiktok_content']
                        email_campaign = campaign['email_campaign']
                        landing_page = campaign['landing_page']
                        campaign_summary = campaign['campaign_summary']
                        
                        # Check if all components were generated
                        components_generated = [
                            tiktok_content.get('generated', False),
                            email_campaign.get('generated', False),
                            'app_id' in landing_page
                        ]
                        
                        if all(components_generated):
                            # Verify AI integrations
                            ai_integrations = campaign_summary.get('ai_integrations', [])
                            expected_integrations = ['Claude AI', 'Google Opal', 'Telegram Bot']
                            
                            if all(integration in ai_integrations for integration in expected_integrations):
                                self.log_result("hyperschwarm_integrated_campaign", True, 
                                              f"Integrated campaign created successfully - All AI services coordinated", 
                                              {
                                                  "tiktok_generated": tiktok_content.get('generated'),
                                                  "email_generated": email_campaign.get('generated'),
                                                  "landing_page_id": landing_page.get('app_id'),
                                                  "ai_integrations": ai_integrations
                                              })
                            else:
                                missing_integrations = [i for i in expected_integrations if i not in ai_integrations]
                                self.log_result("hyperschwarm_integrated_campaign", False, 
                                              f"Missing AI integrations: {missing_integrations}")
                        else:
                            failed_components = []
                            if not tiktok_content.get('generated', False):
                                failed_components.append('TikTok Content')
                            if not email_campaign.get('generated', False):
                                failed_components.append('Email Campaign')
                            if 'app_id' not in landing_page:
                                failed_components.append('Landing Page')
                            
                            self.log_result("hyperschwarm_integrated_campaign", False, 
                                          f"Failed to generate components: {failed_components}")
                    else:
                        missing = [f for f in campaign_fields if f not in campaign]
                        self.log_result("hyperschwarm_integrated_campaign", False, f"Missing campaign fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("hyperschwarm_integrated_campaign", False, f"Missing required fields: {missing}")
            else:
                self.log_result("hyperschwarm_integrated_campaign", False, 
                              f"Integrated campaign API failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_result("hyperschwarm_integrated_campaign", False, f"Integrated campaign error: {str(e)}")

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
        
        # Test in priority order - existing tests
        self.test_paypal_integration()      # High priority
        self.test_database_service()        # High priority
        self.test_dashboard_stats_api()     # Medium priority
        self.test_automations_api()         # Medium priority
        self.test_analytics_api()           # Medium priority
        self.test_saas_status_api()         # Low priority
        
        # HYPERSCHWARM System V3.0 Tests - existing
        self.test_hyperschwarm_status()     # High priority
        self.test_hyperschwarm_agents()     # High priority
        self.test_hyperschwarm_strategy_execution()  # High priority
        self.test_hyperschwarm_performance_metrics() # Medium priority
        self.test_hyperschwarm_agent_optimization()  # Medium priority
        
        # NEW HYPERSCHWARM Google Opal + Claude AI Integration Tests
        self.test_hyperschwarm_opal_templates()      # High priority
        self.test_hyperschwarm_opal_create_app()     # High priority
        self.test_hyperschwarm_opal_landing_page()   # High priority
        self.test_hyperschwarm_claude_tiktok()       # High priority
        self.test_hyperschwarm_claude_email()        # High priority
        self.test_hyperschwarm_integrated_campaign() # High priority
        
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