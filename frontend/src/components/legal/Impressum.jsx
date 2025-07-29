import React from 'react';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Impressum
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Angaben gemäß § 5 TMG</h2>
              <div className="space-y-1">
                <p className="font-semibold text-white">Daniel Oettel</p>
                <p>ZZ Lobby</p>
                <p>Pekinger Straße 5</p>
                <p>06712 Zeitz</p>
                <p>Deutschland</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Kontakt</h2>
              <div className="space-y-1">
                <p>E-Mail: <a href="mailto:samar220659@gmail.com" className="text-blue-400 hover:text-blue-300">samar220659@gmail.com</a></p>
                <p>Telefon: <a href="tel:+49015731873862" className="text-blue-400 hover:text-blue-300">015731873862</a></p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Umsatzsteuer-ID</h2>
              <p>Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">EU-Streitschlichtung</h2>
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
              <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Haftung für Inhalte</h2>
              <p className="mb-2">Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
              <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Haftung für Links</h2>
              <p className="mb-2">Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
              <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Urheberrecht</h2>
              <p className="mb-2">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
              <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
            </div>

            <div className="pt-6 border-t border-blue-500/20">
              <p className="text-sm text-gray-400">
                Erstellt am: {new Date().toLocaleDateString('de-DE')} | 
                Stand: {new Date().toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impressum;