import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, Shield, Check } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always enabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    saveCookiePreferences(allAccepted);
    setIsVisible(false);
  };

  const acceptSelected = () => {
    saveCookiePreferences(preferences);
    setIsVisible(false);
  };

  const declineAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(onlyNecessary);
    saveCookiePreferences(onlyNecessary);
    setIsVisible(false);
  };

  const saveCookiePreferences = (prefs) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...prefs,
      timestamp: new Date().getTime(),
      version: '1.0'
    }));
    
    // Set cookies based on preferences
    if (prefs.analytics) {
      // Enable analytics cookies
      console.log('Analytics cookies enabled');
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
    
    if (prefs.functional) {
      // Enable functional cookies
      console.log('Functional cookies enabled');
    }
  };

  const handlePreferenceChange = (type, value) => {
    if (type === 'necessary') return; // Cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-lg border border-purple-500/30 rounded-xl shadow-2xl">
            
            {!showSettings ? (
              // Main Cookie Banner
              <div className="p-6 lg:p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Cookie className="h-8 w-8 text-purple-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      🍪 Cookie-Einstellungen
                    </h3>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern und unseren Service zu optimieren. 
                      Einige Cookies sind für den Betrieb der Website erforderlich, während andere uns helfen, die Website zu analysieren und zu verbessern.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <button
                        onClick={acceptAll}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
                      >
                        <Check className="h-5 w-5" />
                        <span>Alle akzeptieren</span>
                      </button>
                      
                      <button
                        onClick={declineAll}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                      >
                        Nur erforderliche
                      </button>
                      
                      <button
                        onClick={() => setShowSettings(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Einstellungen</span>
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-4">
                      Mehr Informationen finden Sie in unserer{' '}
                      <a href="/datenschutz" className="text-purple-400 hover:text-purple-300 underline">
                        Datenschutzerklärung
                      </a>
                    </p>
                  </div>
                  
                  <button
                    onClick={declineAll}
                    className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Schließen"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ) : (
              // Cookie Settings Panel
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Settings className="h-6 w-6 text-purple-400" />
                    <span>Cookie-Einstellungen anpassen</span>
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-1">Erforderliche Cookies</h4>
                        <p className="text-sm text-gray-300">Diese Cookies sind für die Grundfunktionen der Website erforderlich.</p>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-green-400 font-semibold">Immer aktiv</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Cookies */}
                  <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-1">Analytics Cookies</h4>
                        <p className="text-sm text-gray-300">Diese Cookies helfen uns, die Nutzung der Website zu verstehen und zu verbessern.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Marketing Cookies */}
                  <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-pink-400 mb-1">Marketing Cookies</h4>
                        <p className="text-sm text-gray-300">Diese Cookies werden verwendet, um Ihnen relevante Werbung zu zeigen.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Functional Cookies */}
                  <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">Funktionale Cookies</h4>
                        <p className="text-sm text-gray-300">Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    onClick={acceptSelected}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Check className="h-5 w-5" />
                    <span>Auswahl speichern</span>
                  </button>
                  
                  <button
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Alle akzeptieren
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;