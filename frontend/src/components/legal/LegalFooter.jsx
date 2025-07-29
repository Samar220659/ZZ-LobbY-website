import React from 'react';
import { Link } from 'react-router-dom';

const LegalFooter = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-xl border-t border-blue-500/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ZZ Lobby
            </h3>
            <p className="text-gray-400 text-sm">
              Professionelle Business-Automatisierung für maximalen Erfolg.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Daniel Oettel</p>
              <p>Pekinger Straße 5</p>
              <p>06712 Zeitz</p>
              <p>Deutschland</p>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/automation" className="hover:text-blue-400 transition-colors">Automation Hub</Link></li>
              <li><Link to="/ai-marketing" className="hover:text-blue-400 transition-colors">AI Marketing</Link></li>
              <li><Link to="/analytics" className="hover:text-blue-400 transition-colors">Analytics</Link></li>
              <li><Link to="/payment" className="hover:text-blue-400 transition-colors">Payment Solutions</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="mailto:samar220659@gmail.com" className="hover:text-blue-400 transition-colors">
                  📧 E-Mail Support
                </a>
              </li>
              <li>
                <a href="tel:+49015731873862" className="hover:text-blue-400 transition-colors">
                  📞 Telefon Support
                </a>
              </li>
              <li><Link to="/widerruf" className="hover:text-blue-400 transition-colors">Widerruf</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/impressum" className="hover:text-blue-400 transition-colors">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:text-blue-400 transition-colors">Datenschutz</Link></li>
              <li><Link to="/agb" className="hover:text-blue-400 transition-colors">AGB</Link></li>
              <li><Link to="/widerruf" className="hover:text-blue-400 transition-colors">Widerrufsrecht</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} ZZ Lobby - Daniel Oettel. Alle Rechte vorbehalten.
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link to="/impressum" className="hover:text-blue-400 transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="hover:text-blue-400 transition-colors">
                Datenschutz
              </Link>
              <Link to="/agb" className="hover:text-blue-400 transition-colors">
                AGB
              </Link>
              <Link to="/widerruf" className="hover:text-blue-400 transition-colors">
                Widerruf
              </Link>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-4">
            <p>Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet.</p>
            <p className="mt-1">
              🔒 SSL-verschlüsselt | 
              🍪 <button className="hover:text-blue-400 transition-colors ml-1" onClick={() => {
                // Clear cookie consent to show banner again
                localStorage.removeItem('cookie-consent');
                window.location.reload();
              }}>
                Cookie-Einstellungen ändern
              </button>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;