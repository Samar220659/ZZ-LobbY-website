import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Cookie, AlertTriangle } from 'lucide-react';

const LegalFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white border-t border-purple-500/30">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-400">ZZ-Lobby Elite Marketing</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Daniel Oettel</p>
              <p>Gewerbetreibender</p>
              <p className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>USt-IdNr: DE453548228</span>
              </p>
            </div>
          </div>
          
          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-400">Rechtliches</h3>
            <div className="space-y-3">
              <Link 
                to="/impressum" 
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Impressum</span>
              </Link>
              <Link 
                to="/datenschutz" 
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-green-400 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Datenschutzerklärung</span>
              </Link>
              <Link 
                to="/agb" 
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-purple-400 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>AGB</span>
              </Link>
            </div>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400">Services</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <Link to="/affiliate-explosion" className="block hover:text-yellow-400 transition-colors">
                🚀 Affiliate Marketing (50% Provision)
              </Link>
              <Link to="/automation-center" className="block hover:text-yellow-400 transition-colors">
                🤖 Marketing Automation (98%)
              </Link>
              <Link to="/smart-akquise" className="block hover:text-yellow-400 transition-colors">
                🎯 Smart Akquise Center
              </Link>
              <Link to="/business-dashboard" className="block hover:text-yellow-400 transition-colors">
                🏦 Business Dashboard
              </Link>
            </div>
          </div>
          
          {/* Contact & Compliance */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-pink-400">Kontakt & Compliance</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:a22061981@gmx.de" className="hover:text-pink-400 transition-colors">
                  a22061981@gmx.de
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span>DSGVO-konform</span>
              </p>
              <p className="flex items-center space-x-2">
                <Cookie className="h-4 w-4 text-orange-400" />
                <button 
                  onClick={() => {
                    localStorage.removeItem('cookie-consent');
                    window.location.reload();
                  }}
                  className="hover:text-orange-400 transition-colors underline"
                >
                  Cookie-Einstellungen
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Daniel Oettel • ZZ-Lobby Elite Marketing • Alle Rechte vorbehalten
            </div>
            
            {/* Affiliate Disclaimer */}
            <div className="text-xs text-gray-500 max-w-md text-center md:text-right">
              <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs font-semibold mr-2">
                WERBUNG
              </span>
              Diese Website enthält Affiliate-Links. Bei Käufen über diese Links erhalten wir möglicherweise eine Provision.
            </div>
          </div>
          
          {/* Legal Compliance Bar */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-lg">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span>DSGVO-konform</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <span>SSL-verschlüsselt</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                <span>Deutscher Datenschutz</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                <span>Steuerlich angemeldet</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
                <span>Gewerblich registriert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;