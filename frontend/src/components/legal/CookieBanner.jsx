import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(newPreferences);
    saveConsent(newPreferences);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(newPreferences);
    saveConsent(newPreferences);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const saveConsent = (prefs) => {
    const consentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    
    // Here you would typically trigger your analytics/marketing scripts based on consent
    if (prefs.analytics) {
      // Initialize analytics
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Initialize marketing pixels
      console.log('Marketing enabled');
    }
    if (prefs.functional) {
      // Initialize functional cookies
      console.log('Functional cookies enabled');
    }
  };

  const handlePreferenceChange = (category) => {
    if (category === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-blue-500/20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                🍪 Cookie-Einstellungen
              </h3>
              <p className="text-gray-300 text-sm">
                Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. 
                Einige Cookies sind für das Funktionieren der Website unerlässlich, während andere uns helfen, 
                die Website zu verbessern und Ihnen personalisierte Inhalte anzubieten.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Weitere Informationen finden Sie in unserer{' '}
                <a href="/datenschutz" className="text-blue-400 hover:text-blue-300 underline">
                  Datenschutzerklärung
                </a>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 min-w-max">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-all duration-200"
              >
                ⚙️ Einstellungen
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-all duration-200"
              >
                ❌ Nur notwendige
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                ✅ Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/20 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">🍪 Cookie-Einstellungen</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-400">🔧 Notwendige Cookies</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Diese Cookies sind für das Funktionieren der Website unerlässlich und können nicht deaktiviert werden.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Speichern: Session-Management, Sicherheits-Token, Cookie-Einstellungen
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <p className="text-xs text-blue-400 mt-1 text-center">Immer an</p>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">📊 Analyse-Cookies</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Helfen uns zu verstehen, wie Besucher mit der Website interagieren, um die Benutzererfahrung zu verbessern.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Speichern: Seitenaufrufe, Verweildauer, Klickverhalten (anonymisiert)
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-200 ${
                          preferences.analytics 
                            ? 'bg-green-600 justify-end' 
                            : 'bg-gray-600 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">📢 Marketing-Cookies</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Werden verwendet, um Werbeanzeigen relevanter zu machen und die Effektivität von Werbekampagnen zu messen.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Speichern: Werbepräferenzen, Kampagnen-Tracking, Social Media Integration
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-200 ${
                          preferences.marketing 
                            ? 'bg-green-600 justify-end' 
                            : 'bg-gray-600 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">⚙️ Funktionale Cookies</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Ermöglichen erweiterte Funktionalitäten und Personalisierung der Website.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Speichern: Spracheinstellungen, Benutzereinstellungen, Chat-Funktionen
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('functional')}
                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-200 ${
                          preferences.functional 
                            ? 'bg-green-600 justify-end' 
                            : 'bg-gray-600 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-600">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 text-gray-300 border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Einstellungen speichern
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center">
                Sie können Ihre Einstellungen jederzeit in der{' '}
                <a href="/datenschutz" className="text-blue-400 hover:text-blue-300 underline">
                  Datenschutzerklärung
                </a>
                {' '}ändern.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;