import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AGB = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <FileText className="h-10 w-10 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold">Allgemeine Geschäftsbedingungen</h1>
              <p className="text-gray-300">ZZ-Lobby Elite Marketing</p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <div className="space-y-8">

          {/* Anwendungsbereich */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-purple-400 mb-4">§ 1 Anwendungsbereich</h2>
            <div className="space-y-4 text-gray-300">
              <p>1.1 Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Daniel Oettel (nachfolgend "Anbieter") und dem Kunden über die Nutzung des ZZ-Lobby Elite Marketing Systems und die Teilnahme am Affiliate-Programm.</p>
              <p>1.2 Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
              <p>1.3 Diese AGB gelten auch für alle künftigen Geschäftsbeziehungen, auch wenn sie nicht nochmals ausdrücklich vereinbart werden.</p>
            </div>
          </div>

          {/* Vertragsschluss */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-blue-400 mb-4">§ 2 Vertragsschluss</h2>
            <div className="space-y-4 text-gray-300">
              <p>2.1 Die Darstellung der Produkte und Dienstleistungen auf der Website stellt kein bindendes Angebot dar, sondern einen unverbindlichen Katalog.</p>
              <p>2.2 Durch das Absenden einer Bestellung gibt der Kunde ein verbindliches Angebot zum Vertragsschluss ab.</p>
              <p>2.3 Der Vertrag kommt durch die Bestätigung des Anbieters per E-Mail oder durch die Bereitstellung der Zugangsdaten zustande.</p>
              <p>2.4 Der Vertragstext wird vom Anbieter gespeichert und ist für den Kunden nach Vertragsschluss nicht mehr zugänglich.</p>
            </div>
          </div>

          {/* Leistungen */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center">
              <DollarSign className="h-6 w-6 mr-2" />
              § 3 Leistungen des Anbieters
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>3.1 Der Anbieter stellt dem Kunden das ZZ-Lobby Elite Marketing System zur Verfügung, welches folgende Funktionen umfasst:</p>
              <ul className="ml-6 space-y-2">
                <li>• Zugang zu Marketing-Automatisierungstools</li>
                <li>• Affiliate-Management-System</li>
                <li>• Prospect-Management (SmartAkquiseCenter)</li>
                <li>• Integrationen zu Drittanbietern (Mailchimp, Digistore24, PayPal)</li>
                <li>• Dashboard-System für Business-Metriken</li>
              </ul>
              
              <p>3.2 <strong>Affiliate-Programm:</strong></p>
              <ul className="ml-6 space-y-2">
                <li>• Commission Rate: 50% der Verkaufspreise</li>
                <li>• Produkt: ZZ-Lobby Elite Marketing System (€49,00)</li>
                <li>• Commission pro Sale: €24,50</li>
                <li>• Auszahlung über Digistore24</li>
              </ul>

              <p>3.3 Der Anbieter gewährleistet eine Verfügbarkeit des Systems von mindestens 95% im Jahresdurchschnitt.</p>
            </div>
          </div>

          {/* Preise und Zahlung */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-yellow-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">§ 4 Preise und Zahlungsbedingungen</h2>
            <div className="space-y-4 text-gray-300">
              <p>4.1 <strong>Produktpreise (Stand 2025):</strong></p>
              <div className="ml-6 space-y-2 bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4">
                <p>• ZZ-Lobby Boost Package: €49,00 (einmalig)</p>
                <p>• Basic Plan: €19,00 (einmalig)</p>
                <p>• Pro Plan: €99,00 (einmalig)</p>
                <p className="text-sm text-yellow-400">Alle Preise inkl. gesetzl. MwSt.</p>
              </div>

              <p>4.2 Die Zahlung erfolgt über die Zahlungsdienstleister Digistore24, PayPal oder Stripe.</p>
              <p>4.3 Die Zahlung ist sofort bei Vertragsschluss fällig.</p>
              <p>4.4 Bei Zahlungsverzug werden Verzugszinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz berechnet.</p>
            </div>
          </div>

          {/* Pflichten des Kunden */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              § 5 Pflichten des Kunden
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>5.1 Der Kunde verpflichtet sich, das System nur zu rechtmäßigen Zwecken zu nutzen.</p>
              <p>5.2 <strong>Verboten ist insbesondere:</strong></p>
              <ul className="ml-6 space-y-2">
                <li>• Spam-Versendung oder unerwünschte Werbung</li>
                <li>• Verwendung für betrügerische Aktivitäten</li>
                <li>• Missbrauch der Automatisierungsfunktionen</li>
                <li>• Verletzung von Persönlichkeitsrechten Dritter</li>
              </ul>

              <p>5.3 <strong>Affiliate-Marketing Pflichten:</strong></p>
              <ul className="ml-6 space-y-2">
                <li>• Wahrheitsgemäße Bewerbung der Produkte</li>
                <li>• Kennzeichnungspflicht bei Werbung ("Werbung"/"Anzeige")</li>
                <li>• Einhaltung der DSGVO bei Datensammlung</li>
                <li>• Keine irreführende Werbung</li>
              </ul>

              <p>5.4 Der Kunde ist für die Sicherheit seiner Zugangsdaten verantwortlich.</p>
            </div>
          </div>

          {/* Widerrufsrecht */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-indigo-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">§ 6 Widerrufsrecht</h2>
            <div className="space-y-4 text-gray-300">
              <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-6">
                <h3 className="font-bold text-white mb-3">Widerrufsbelehrung</h3>
                
                <p className="mb-3"><strong>Widerrufsrecht</strong></p>
                <p className="mb-3">Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
                
                <p className="mb-3">Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
                
                <p className="mb-3">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Daniel Oettel, E-Mail: a22061981@gmx.de) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
                
                <p className="mb-3"><strong>Folgen des Widerrufs</strong></p>
                <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>
              </div>

              <p className="text-sm text-indigo-400"><strong>Vorzeitiges Erlöschen des Widerrufsrechts:</strong> Das Widerrufsrecht erlischt vorzeitig bei Verträgen über die Erbringung von Dienstleistungen, wenn wir mit der Ausführung der Dienstleistung nach ausdrücklicher Zustimmung des Verbrauchers begonnen haben.</p>
            </div>
          </div>

          {/* Haftung */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-pink-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-pink-400 mb-4">§ 7 Haftungsbeschränkung</h2>
            <div className="space-y-4 text-gray-300">
              <p>7.1 Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei der Verletzung von Leben, Körper und Gesundheit sowie nach dem Produkthaftungsgesetz.</p>
              <p>7.2 Bei der Verletzung wesentlicher Vertragspflichten haftet der Anbieter auch bei leichter Fahrlässigkeit, jedoch begrenzt auf den vorhersehbaren, vertragstypischen Schaden.</p>
              <p>7.3 Im Übrigen ist die Haftung des Anbieters ausgeschlossen.</p>
              <p>7.4 <strong>Affiliate-Marketing:</strong> Der Anbieter übernimmt keine Haftung für die Richtigkeit der vom Kunden beworbenen Inhalte oder für Schäden, die durch unsachgemäße Nutzung der Affiliate-Tools entstehen.</p>
            </div>
          </div>

          {/* Kündigung */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-orange-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-orange-400 mb-4">§ 8 Kündigung</h2>
            <div className="space-y-4 text-gray-300">
              <p>8.1 Beide Parteien können den Vertrag jederzeit ohne Einhaltung einer Kündigungsfrist kündigen.</p>
              <p>8.2 Das Recht zur fristlosen Kündigung aus wichtigem Grund bleibt unberührt.</p>
              <p>8.3 Die Kündigung bedarf der Textform (E-Mail ausreichend).</p>
              <p>8.4 <strong>Affiliate-Programm:</strong> Die Teilnahme am Affiliate-Programm kann jederzeit durch beide Parteien beendet werden. Bereits entstandene Provisionsansprüche bleiben davon unberührt.</p>
            </div>
          </div>

          {/* Schlussbestimmungen */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-400 mb-4">§ 9 Schlussbestimmungen</h2>
            <div className="space-y-4 text-gray-300">
              <p>9.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
              <p>9.2 Sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist, ist Gerichtsstand für alle Streitigkeiten aus diesem Vertrag der Sitz des Anbieters.</p>
              <p>9.3 Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.</p>
              <p>9.4 Änderungen dieser AGB werden dem Kunden per E-Mail mitgeteilt. Sie gelten als genehmigt, wenn der Kunde nicht binnen vier Wochen nach Zugang der Mitteilung widerspricht.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Stand: {new Date().toLocaleDateString('de-DE')} • Daniel Oettel • ZZ-Lobby Elite Marketing</p>
        </div>

      </div>
    </div>
  );
};

export default AGB;