import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./components/Dashboard";
import PayPalPayment from "./components/PayPalPayment";
import AutomationHub from "./components/AutomationHub";
import Analytics from "./components/Analytics";
import SaasLaunch from "./components/SaasLaunch";
import ControlCenter from "./components/ControlCenter";
import AutomationControl from "./components/AutomationControl";
import EasyAutomation from "./components/EasyAutomation";
import AIMarketingHub from "./components/AIMarketingHub";
import SystemFusion from "./components/SystemFusion";
import SalesExplosionBot from "./components/SalesExplosionBot";
import SystemOptimizer from "./components/SystemOptimizer";
import StripeExplosion from "./components/StripeExplosion";
import LiveProfitDashboard from "./components/LiveProfitDashboard";
import ProfitCenter from "./components/ProfitCenter";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payment" element={<PayPalPayment />} />
          <Route path="/automation" element={<AutomationHub />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/saas" element={<SaasLaunch />} />
          <Route path="/control" element={<ControlCenter />} />
          <Route path="/automation-control" element={<AutomationControl />} />
          <Route path="/easy-automation" element={<EasyAutomation />} />
          <Route path="/ai-marketing" element={<AIMarketingHub />} />
          <Route path="/sales-bot" element={<SalesExplosionBot />} />
          <Route path="/system-optimizer" element={<SystemOptimizer />} />
          <Route path="/stripe-explosion" element={<StripeExplosion />} />
          <Route path="/profit-center" element={<ProfitCenter />} />
          <Route path="/live-profit" element={<LiveProfitDashboard />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;