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
import HyperschwarmDashboard from "./components/HyperschwarmDashboard";
import EliteControlCenter from "./components/EliteControlCenter";
import EliteRoadmap from "./components/EliteRoadmap";
// Legal Components
import Impressum from "./components/legal/Impressum";
import Datenschutz from "./components/legal/Datenschutz";
import AGB from "./components/legal/AGB";
import Widerruf from "./components/legal/Widerruf";
import CookieBanner from "./components/legal/CookieBanner";
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
          <Route path="/hyperschwarm" element={<HyperschwarmDashboard />} />
          <Route path="/elite-control" element={<EliteControlCenter />} />
          {/* Legal Routes */}
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/widerruf" element={<Widerruf />} />
        </Routes>
        <Toaster />
        {/* Cookie Banner appears on all pages */}
        <CookieBanner />
      </BrowserRouter>
    </div>
  );
}

export default App;