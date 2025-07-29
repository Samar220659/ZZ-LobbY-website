import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ZZ-Lobby Elite Landing Page Component
const ZZLobbyElite = () => {
  const [products, setProducts] = useState([]);
  const [revenueStats, setRevenueStats] = useState(null);
  const [limitedOffers, setLimitedOffers] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
    
    // Update revenue stats every 30 seconds
    const interval = setInterval(loadRevenueStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadProducts(),
        loadRevenueStats(),
        loadLimitedOffers()
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadRevenueStats = async () => {
    try {
      const response = await axios.get(`${API}/analytics/revenue`);
      setRevenueStats(response.data);
    } catch (error) {
      console.error("Error loading revenue stats:", error);
    }
  };

  const loadLimitedOffers = async () => {
    try {
      const response = await axios.get(`${API}/offers/limited-time`);
      setLimitedOffers(response.data.offers);
    } catch (error) {
      console.error("Error loading offers:", error);
    }
  };

  const handlePurchase = async (productId) => {
    try {
      const orderData = {
        customer_email: "kunde@example.com", // Would be from form
        product_id: productId,
        payment_method: "paypal",
        conversion_source: "landing_page"
      };

      const response = await axios.post(`${API}/orders`, orderData);
      
      if (response.data.success) {
        // Redirect to payment
        window.open(response.data.payment_url, '_blank');
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Fehler beim Erstellen der Bestellung. Bitte versuchen Sie es erneut.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">ZZ-Lobby Elite wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          
          {/* Live Revenue Counter */}
          {revenueStats && (
            <div className="mb-8 bg-red-600 text-white px-6 py-3 rounded-full inline-block animate-pulse">
              <span className="text-sm font-bold">
                🔴 LIVE: Heute schon €{revenueStats.daily_revenue.toFixed(0)} verdient 
                ({revenueStats.achievement_percentage.toFixed(1)}% des Tagesziels)
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent leading-tight">
            ZZ-LOBBY ELITE
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-bold mb-8 text-yellow-400">
            💰 AUTOMATISCHES €500/TAG SYSTEM
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
            <span className="text-red-400 font-bold">5.000+ erfolgreiche Mitglieder</span> verdienen bereits 
            <span className="text-green-400 font-bold"> täglich €500+ vollautomatisch</span> - 
            ohne Erfahrung, ohne Startkapital, ohne Risiko!
          </p>

          {/* Urgency Timer */}
          <div className="bg-red-600 text-white p-6 rounded-lg mb-8 border-2 border-red-400 shadow-lg shadow-red-500/50">
            <p className="text-lg font-bold mb-2">⏰ WARNUNG: Nur noch begrenzte Plätze verfügbar!</p>
            <div className="text-3xl font-black text-yellow-300">
              SCHLIESSТ IN: 02:47:23
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 mb-12">
            <button 
              onClick={() => setShowVideoModal(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-12 py-6 rounded-full text-xl font-black hover:scale-105 transform transition-all duration-300 shadow-lg shadow-yellow-500/50 mr-4"
            >
              🎥 BEWEIS-VIDEO ANSEHEN
            </button>
            
            <button 
              onClick={() => document.getElementById('products').scrollIntoView({behavior: 'smooth'})}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-12 py-6 rounded-full text-xl font-black hover:scale-105 transform transition-all duration-300 shadow-lg shadow-green-500/50 ml-4"
            >
              🚀 JETZT STARTEN
            </button>
          </div>

          {/* Social Proof */}
          <div className="bg-gray-800 p-6 rounded-lg border border-yellow-400">
            <p className="text-lg mb-4">
              <span className="text-green-400 font-bold">✅ 5.000+ TikTok Follower</span> |
              <span className="text-blue-400 font-bold"> ✅ 12.500+ E-Mail Abonnenten</span> |
              <span className="text-purple-400 font-bold"> ✅ 0.96% → 5%+ Conversion</span>
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div>⭐⭐⭐⭐⭐ <span className="text-yellow-400">4.9/5 Bewertung</span></div>
              <div>💰 <span className="text-green-400">€2.8M+ Gesamtumsatz</span></div>
              <div>🏆 <span className="text-orange-400">#1 Automation System</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Time Offers */}
      {limitedOffers.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-red-900 to-red-700">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-12 text-yellow-300">
              🔥 BLITZ-ANGEBOTE - NUR WENIGE STUNDEN!
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {limitedOffers.map((offer, index) => (
                <div key={index} className="bg-black p-8 rounded-lg border-2 border-yellow-400 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    -{offer.discount}%
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-yellow-400">FLASH SALE</h3>
                  <div className="text-4xl font-black mb-2">
                    <span className="line-through text-red-400 text-2xl">€{(offer.final_price / (1 - offer.discount/100)).toFixed(0)}</span>
                    <span className="text-green-400 ml-2">€{offer.final_price}</span>
                  </div>
                  <p className="text-red-300 font-bold mb-6">{offer.urgency_message}</p>
                  <button 
                    onClick={() => handlePurchase(offer.product_id)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-full font-black hover:scale-105 transform transition-all"
                  >
                    JETZT SICHERN
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center mb-16 bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
            WÄHLE DEIN ERFOLGSSYSTEM
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.id} className={`relative bg-black p-8 rounded-lg border-2 transform hover:scale-105 transition-all duration-300 ${
                index === 2 ? 'border-yellow-400 shadow-lg shadow-yellow-500/50' : 'border-gray-600'
              }`}>
                
                {index === 2 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                    🏆 BESTSELLER
                  </div>
                )}
                
                {product.discount_percentage && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount_percentage}%
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-4 text-yellow-400">{product.name}</h3>
                <p className="text-gray-300 mb-6">{product.description}</p>
                
                <div className="mb-6">
                  {product.original_price && (
                    <div className="text-red-400 line-through text-lg mb-2">
                      Statt €{product.original_price}
                    </div>
                  )}
                  <div className="text-4xl font-black text-green-400">
                    €{product.price}
                  </div>
                </div>

                <ul className="space-y-2 mb-8 text-sm">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-200">{feature}</li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePurchase(product.id)}
                  className={`w-full py-4 rounded-full font-black text-lg transition-all hover:scale-105 ${
                    index === 2 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50' 
                      : 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                  }`}
                >
                  JETZT KAUFEN
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center mb-16 text-yellow-400">
            💎 ERFOLGSGESCHICHTEN
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {name: "Sarah M.", age: 24, income: "€847/Tag", story: "Als Studentin brauchte ich dringend Geld. Nach nur 3 Tagen hatte ich mein System am Laufen!"},
              {name: "Michael K.", age: 35, income: "€1.247/Tag", story: "Endlich kann ich meinen Job kündigen und habe mehr Zeit für meine Familie."},
              {name: "Lisa H.", age: 28, income: "€2.156/Tag", story: "Unglaublich! In 2 Wochen mehr verdient als in 6 Monaten im alten Job."}
            ].map((story, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-lg border border-yellow-400">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center text-black font-bold text-2xl">
                    {story.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400">{story.name} ({story.age})</h3>
                  <p className="text-green-400 font-bold text-2xl">{story.income}</p>
                </div>
                <p className="text-gray-300 text-center italic">"{story.story}"</p>
                <div className="text-center mt-4">
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-black text-yellow-400 mb-4">ZZ-LOBBY ELITE</h3>
            <p className="text-gray-400">Das #1 automatische Einkommenssystem</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-yellow-400 mb-4">💰 GARANTIEN</h4>
              <ul className="space-y-2 text-gray-300">
                <li>✅ 30-Tage Geld-zurück</li>
                <li>✅ 24/7 Support</li>
                <li>✅ Lifetime Updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-yellow-400 mb-4">📞 KONTAKT</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📧 support@zz-lobby-elite.com</li>
                <li>📱 WhatsApp: +49 XXX XXXXXXX</li>
                <li>💬 Telegram: @zz_lobby_elite</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-yellow-400 mb-4">🚀 SOCIAL MEDIA</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📱 TikTok: 5.000+ Follower</li>
                <li>📧 Newsletter: 12.500+ Abonnenten</li>
                <li>💬 Community: 2.800+ Mitglieder</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-500">© 2025 ZZ-Lobby Elite. Alle Rechte vorbehalten.</p>
            <p className="text-gray-600 text-sm mt-2">
              Haftungsausschluss: Individuelle Ergebnisse können variieren. Vergangene Leistungen sind keine Garantie für zukünftige Ergebnisse.
            </p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400">🎥 LIVE-BEWEIS: €500/Tag System</h3>
              <button 
                onClick={() => setShowVideoModal(false)}
                className="text-white text-3xl hover:text-red-400"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <p className="text-white text-xl">Video Player würde hier sein</p>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setShowVideoModal(false);
                  document.getElementById('products').scrollIntoView({behavior: 'smooth'});
                }}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transform transition-all"
              >
                JETZT SYSTEM SICHERN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transform transition-all">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ZZLobbyElite />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;