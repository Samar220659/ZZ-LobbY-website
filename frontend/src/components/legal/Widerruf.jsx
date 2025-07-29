import React, { useState } from 'react';

const Widerruf = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    orderNumber: '',
    orderDate: '',
    productDescription: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create email content
    const emailContent = `
Widerruf

Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:

Bestellt am: ${formData.orderDate}
Bestellnummer: ${formData.orderNumber}
Leistungsbeschreibung: ${formData.productDescription}

Verbraucher:
Name: ${formData.name}
Anschrift: ${formData.address}
E-Mail: ${formData.email}

Datum: ${new Date().toLocaleDateString('de-DE')}

Unterschrift: [Unterschrift erforderlich bei Versendung per Post]
    `;
    
    // Create mailto link
    const subject = encodeURIComponent('Widerruf - Bestellung ' + formData.orderNumber);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:samar220659@gmail.com?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Widerrufsbelehrung & Widerrufsformular
          </h1>
          
          <div className="space-y-8 text-gray-300">
            {/* Widerrufsbelehrung */}
            <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/20">
              <h2 className="text-2xl font-semibold text-red-400 mb-4">Widerrufsbelehrung</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Widerrufsrecht</h3>
                  <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
                  <p className="mt-2">Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ausübung des Widerrufsrechts</h3>
                  <p className="mb-4">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4">
                    <p><strong>Daniel Oettel</strong></p>
                    <p>ZZ Lobby</p>
                    <p>Pekinger Straße 5</p>
                    <p>06712 Zeitz</p>
                    <p>Deutschland</p>
                    <p className="mt-2">E-Mail: <a href="mailto:samar220659@gmail.com" className="text-blue-400 hover:text-blue-300">samar220659@gmail.com</a></p>
                    <p>Telefon: 015731873862</p>
                  </div>
                  <p>mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
                  <p className="mt-2">Sie können das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
                  <p className="mt-2">Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Folgen des Widerrufs</h3>
                  <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>
                  <p className="mt-2">Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</p>
                </div>

                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Vorzeitiges Erlöschen des Widerrufsrechts</h3>
                  <p>Das Widerrufsrecht erlischt bei Verträgen über die Lieferung digitaler Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden, wenn der Unternehmer mit der Ausführung des Vertrags begonnen hat, nachdem der Verbraucher ausdrücklich zugestimmt hat, dass der Unternehmer mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnt, und seine Kenntnis davon bestätigt hat, dass er durch seine Zustimmung mit Beginn der Ausführung des Vertrags sein Widerrufsrecht verliert.</p>
                </div>
              </div>
            </div>

            {/* Widerrufsformular */}
            <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/20">
              <h2 className="text-2xl font-semibold text-green-400 mb-4">Muster-Widerrufsformular</h2>
              <p className="mb-4 text-sm">(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    An: Daniel Oettel, ZZ Lobby, Pekinger Straße 5, 06712 Zeitz, samar220659@gmail.com
                  </label>
                </div>

                <div>
                  <p className="mb-4">Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="orderDate">
                      Bestellt am *
                    </label>
                    <input
                      type="date"
                      id="orderDate"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="orderNumber">
                      Bestellnummer
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      placeholder="z.B. PayPal-Transaktions-ID"
                      className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="productDescription">
                    Beschreibung der Dienstleistung *
                  </label>
                  <textarea
                    id="productDescription"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="z.B. ZZ-Lobby Elite Package - Business Automation"
                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className="mb-4 font-medium">Name und Anschrift des Verbrauchers:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="name">
                        Vollständiger Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="address">
                        Vollständige Anschrift *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        placeholder="Straße, Hausnummer&#10;PLZ Ort&#10;Land"
                        className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="email">
                        E-Mail-Adresse *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Datum: {new Date().toLocaleDateString('de-DE')}
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    Unterschrift des Verbrauchers: (nur bei Mitteilung auf Papier erforderlich)
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  📧 Widerruf per E-Mail senden
                </button>

                <p className="text-sm text-gray-400 text-center">
                  Das Formular wird in Ihrem E-Mail-Programm geöffnet
                </p>
              </form>
            </div>

            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Alternative Kontaktmöglichkeiten</h3>
              <p><strong>Post:</strong> Daniel Oettel, ZZ Lobby, Pekinger Straße 5, 06712 Zeitz</p>
              <p><strong>E-Mail:</strong> <a href="mailto:samar220659@gmail.com" className="text-blue-400 hover:text-blue-300">samar220659@gmail.com</a></p>
              <p><strong>Telefon:</strong> 015731873862</p>
            </div>

            <div className="pt-6 border-t border-blue-500/20">
              <p className="text-sm text-gray-400">
                Stand: {new Date().toLocaleDateString('de-DE')} | 
                ZZ Lobby - Daniel Oettel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widerruf;