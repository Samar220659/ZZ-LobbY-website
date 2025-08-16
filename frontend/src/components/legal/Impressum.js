import React from 'react';
import { ArrowLeft, Building2, Mail, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Impressum = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
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
            <FileText className="h-10 w-10 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">Impressum</h1>
              <p className="text-gray-300">Angaben gemäß § 5 TMG</p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
          
          {/* Diensteanbieter */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <Building2 className="h-6 w-6 mr-2" />
              Diensteanbieter
            </h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Daniel Oettel</strong></p>
              <p>ZZ-Lobby Elite Marketing</p>
              <p>Gewerbetreibender</p>
            </div>
          </div>

          {/* Kontaktdaten */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              Kontaktdaten
            </h2>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-400" />
                E-Mail: a22061981@gmx.de
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-400" />
                Telefon: Auf Anfrage per E-Mail
              </p>
            </div>
          </div>

          {/* Umsatzsteuer-ID */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Umsatzsteuer-Identifikationsnummer</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>USt-IdNr.:</strong> DE453548228</p>
              <p><strong>Steuer-Nr.:</strong> 69377041825</p>
              <p className="text-sm text-gray-400">Gemäß § 27 a Umsatzsteuergesetz</p>
            </div>
          </div>

          {/* Wirtschafts-ID */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Wirtschafts-Identifikationsnummer</h2>
            <div className="space-y-2 text-gray-300">
              <p>Als Gewerbetreibender registriert</p>
              <p className="text-sm text-gray-400">Anmeldung erfolgte ordnungsgemäß bei der zuständigen Gemeinde</p>
            </div>
          </div>

          {/* EU-Streitschlichtung */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-red-400 mb-4">EU-Streitschlichtung</h2>
            <div className="space-y-3 text-gray-300">
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
              <p><a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-400 hover:text-blue-300 underline">
                https://ec.europa.eu/consumers/odr/
              </a></p>
              <p className="text-sm">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </div>
          </div>

          {/* Verbraucherstreitbeilegung */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <div className="space-y-3 text-gray-300">
              <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </div>
          </div>

          {/* Redaktionell Verantwortlicher */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">Redaktionell verantwortlich</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Daniel Oettel</strong></p>
              <p>E-Mail: a22061981@gmx.de</p>
              <p className="text-sm text-gray-400">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</p>
            </div>
          </div>

          {/* Haftungshinweis */}
          <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Haftungshinweis</h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p><strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
              
              <p><strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
              
              <p><strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Stand: {new Date().toLocaleDateString('de-DE')} • Erstellt nach deutschen Rechtsvorschriften</p>
        </div>

      </div>
    </div>
  );
};

export default Impressum;