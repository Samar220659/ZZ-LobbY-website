import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Cookie } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Datenschutz = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 text-white p-6">
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
            <Shield className="h-10 w-10 text-green-400" />
            <div>
              <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
              <p className="text-gray-300">Gemäß DSGVO (EU-GDPR)</p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <div className="space-y-8">

          {/* Allgemeine Hinweise */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-green-400 mb-4">1. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Datenschutz</h3>
                <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Hinweis zur verantwortlichen Stelle</h3>
                <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                <div className="mt-2 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                  <p><strong>Daniel Oettel</strong><br />
                     ZZ-Lobby Elite Marketing<br />
                     E-Mail: a22061981@gmx.de</p>
                </div>
                <p className="mt-2">Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Speicherdauer</h3>
                <p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen).</p>
              </div>
            </div>
          </div>

          {/* Datenerfassung */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2" />
              2. Datenerfassung auf dieser Website
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Cookies</h3>
                <p>Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.</p>
                <p className="mt-2">Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Server-Log-Dateien</h3>
                <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
                <ul className="mt-2 ml-4 space-y-1">
                  <li>• Browsertyp und Browserversion</li>
                  <li>• verwendetes Betriebssystem</li>
                  <li>• Referrer URL</li>
                  <li>• Hostname des zugreifenden Rechners</li>
                  <li>• Uhrzeit der Serveranfrage</li>
                  <li>• IP-Adresse</li>
                </ul>
                <p className="mt-2">Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Daten werden nach 7 Tagen automatisch gelöscht.</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Kontaktformular & E-Mail-Kontakt</h3>
                <p>Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
                <p className="mt-2">Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen).</p>
              </div>
            </div>
          </div>

          {/* Externe Dienste */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-purple-400 mb-4">3. Externe Dienste</h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Mailchimp (Newsletter)</h3>
                <p>Diese Website nutzt die Dienste von Mailchimp für den Versand von Newslettern. Anbieter ist die Rocket Science Group LLC, 675 Ponce De Leon Ave NE, Suite 5000, Atlanta, GA 30308, USA.</p>
                <div className="mt-2 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <p><strong>Verarbeitete Daten:</strong> E-Mail-Adresse, Name, IP-Adresse, Browser- und Geräteinformationen</p>
                  <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
                  <p><strong>Datenschutzerklärung:</strong> <a href="https://mailchimp.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">https://mailchimp.com/legal/privacy/</a></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Digistore24 (Affiliate-System)</h3>
                <p>Wir nutzen Digistore24 für Affiliate-Marketing und Zahlungsabwicklung. Anbieter ist die Digistore24 GmbH, St.-Godehard-Straße 32, 31139 Hildesheim, Deutschland.</p>
                <div className="mt-2 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <p><strong>Verarbeitete Daten:</strong> Name, E-Mail-Adresse, Zahlungsdaten, Transaktionsdaten</p>
                  <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
                  <p><strong>Datenschutzerklärung:</strong> <a href="https://www.digistore24.com/page/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">https://www.digistore24.com/page/privacy</a></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">PayPal</h3>
                <p>Auf dieser Website bieten wir u. a. die Bezahlung via PayPal an. Anbieter dieses Zahlungsdienstes ist die PayPal (Europe) S.à.r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg.</p>
                <div className="mt-2 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
                  <p><strong>Datenschutzerklärung:</strong> <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">https://www.paypal.com/de/webapps/mpp/ua/privacy-full</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Ihre Rechte */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-yellow-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-2" />
              4. Ihre Rechte
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
              
              <ul className="space-y-2 ml-4">
                <li>• <strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
                <li>• <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
                <li>• <strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
                <li>• <strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
                <li>• <strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                <li>• <strong>Recht auf Widerspruch</strong> (Art. 21 DSGVO)</li>
                <li>• <strong>Recht auf Beschwerde</strong> bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
              </ul>

              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Kontakt für Datenschutzanfragen</h3>
                <p><strong>Daniel Oettel</strong><br />
                   E-Mail: a22061981@gmx.de<br />
                   Betreff: "Datenschutzanfrage"</p>
              </div>

              <div className="mt-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                <p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Stand: {new Date().toLocaleDateString('de-DE')} • Erstellt nach DSGVO-Vorgaben</p>
        </div>

      </div>
    </div>
  );
};

export default Datenschutz;