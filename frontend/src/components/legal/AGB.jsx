import React from 'react';

const AGB = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 1 Geltungsbereich</h2>
              <p className="mb-2">(1) Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen</p>
              <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p><strong>Daniel Oettel</strong></p>
                <p>ZZ Lobby</p>
                <p>Pekinger Straße 5</p>
                <p>06712 Zeitz</p>
                <p>Deutschland</p>
                <p className="mt-2">E-Mail: samar220659@gmail.com</p>
                <p>Telefon: 015731873862</p>
              </div>
              <p className="mb-4">(nachfolgend „Anbieter") und dem Kunden über die Erbringung von Dienstleistungen im Bereich digitaler Business-Automatisierung und -Optimierung.</p>
              <p>(2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 2 Vertragsgegenstand und Leistungen</h2>
              <p className="mb-4">(1) Der Anbieter erbringt Dienstleistungen im Bereich:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Digitale Business-Automatisierung</li>
                <li>Marketing-Automation und Lead-Generierung</li>
                <li>E-Commerce und PayPal-Integration</li>
                <li>Business-Optimierung und Performance-Steigerung</li>
                <li>Beratung und Coaching im Online-Business</li>
              </ul>
              <p className="mb-4">(2) Die konkreten Leistungen ergeben sich aus der jeweiligen Leistungsbeschreibung und Auftragsbestätigung.</p>
              <p>(3) Der Anbieter schuldet die Erbringung der Leistung nach dem Stand der Technik, jedoch keinen bestimmten Erfolg, soweit nicht ausdrücklich anders vereinbart.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 3 Vertragsschluss</h2>
              <p className="mb-4">(1) Die Darstellung der Leistungen auf der Website stellt kein bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Abgabe eines Angebots (invitatio ad offerendum).</p>
              <p className="mb-4">(2) Durch das Absenden einer Bestellung gibt der Kunde ein verbindliches Angebot zum Abschluss eines Vertrages ab.</p>
              <p className="mb-4">(3) Der Anbieter kann das Angebot durch Zusendung einer Auftragsbestätigung in Textform oder durch Beginn der Leistungserbringung annehmen.</p>
              <p>(4) Bei digitalen Inhalten beginnt die Vertragserfüllung nach ausdrücklicher Zustimmung des Kunden sofort nach Vertragsschluss.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 4 Preise und Zahlungsbedingungen</h2>
              <p className="mb-4">(1) Es gelten die zum Zeitpunkt der Bestellung angegebenen Preise. Alle Preise verstehen sich als Endpreise inklusive der gesetzlichen Umsatzsteuer, soweit diese anfällt.</p>
              <p className="mb-4">(2) Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet.</p>
              <p className="mb-4">(3) Die Zahlung erfolgt über PayPal oder andere angebotene Zahlungsmethoden.</p>
              <p className="mb-4">(4) Bei Zahlungsverzug werden Verzugszinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz berechnet.</p>
              <p>(5) Der Kunde ist nur zur Aufrechnung berechtigt, wenn seine Gegenansprüche rechtskräftig festgestellt oder vom Anbieter anerkannt sind.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 5 Leistungserbringung und Mitwirkungspflichten</h2>
              <p className="mb-4">(1) Der Anbieter erbringt die vereinbarten Leistungen mit der gebotenen Sorgfalt und nach bestem Wissen und Gewissen.</p>
              <p className="mb-4">(2) Der Kunde ist verpflichtet, alle für die Leistungserbringung erforderlichen Informationen vollständig und wahrheitsgemäß zur Verfügung zu stellen.</p>
              <p className="mb-4">(3) Verzögerungen aufgrund unzureichender oder verspäteter Mitwirkung des Kunden gehen zu dessen Lasten.</p>
              <p>(4) Der Kunde trägt die Verantwortung für die Rechtmäßigkeit seiner Geschäftstätigkeit und die Einhaltung aller relevanten Gesetze und Bestimmungen.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 6 Widerrufsrecht</h2>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Widerrufsbelehrung</h3>
                <p className="mb-2"><strong>Widerrufsrecht</strong></p>
                <p className="mb-4">Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
                
                <p className="mb-2"><strong>Ausübung des Widerrufsrechts</strong></p>
                <p className="mb-4">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren:</p>
                
                <div className="mb-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                  <p>Daniel Oettel, ZZ Lobby</p>
                  <p>Pekinger Straße 5, 06712 Zeitz</p>
                  <p>E-Mail: samar220659@gmail.com</p>
                </div>
                
                <p className="mb-4">Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
                
                <p className="mb-2"><strong>Folgen des Widerrufs</strong></p>
                <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Vorzeitiges Erlöschen des Widerrufsrechts</h3>
              <p>Das Widerrufsrecht erlischt bei Verträgen über die Lieferung digitaler Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden, wenn der Anbieter mit der Ausführung des Vertrags begonnen hat, nachdem der Kunde ausdrücklich zugestimmt hat und seine Kenntnis davon bestätigt hat, dass er sein Widerrufsrecht bei vollständiger Vertragserfüllung verliert.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 7 Gewährleistung und Haftung</h2>
              <p className="mb-4">(1) Der Anbieter leistet Gewähr für die vertragsgemäße Erbringung der Dienstleistungen.</p>
              <p className="mb-4">(2) Die Haftung des Anbieters ist ausgeschlossen, soweit gesetzlich zulässig. Dies gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit oder für Schäden aus der Verletzung wesentlicher Vertragspflichten.</p>
              <p className="mb-4">(3) Bei der Verletzung wesentlicher Vertragspflichten haftet der Anbieter nur auf den vertragstypischen, vorhersehbaren Schaden.</p>
              <p>(4) Der Anbieter übernimmt keine Garantie für bestimmte Umsätze, Gewinne oder geschäftliche Erfolge des Kunden.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 8 Vertraulichkeit und Datenschutz</h2>
              <p className="mb-4">(1) Beide Vertragsparteien verpflichten sich, alle im Rahmen der Geschäftsbeziehung bekannt gewordenen Informationen vertraulich zu behandeln.</p>
              <p className="mb-4">(2) Die Verarbeitung personenbezogener Daten erfolgt nach den gesetzlichen Bestimmungen, insbesondere der DSGVO.</p>
              <p>(3) Nähere Informationen zum Datenschutz finden Sie in unserer Datenschutzerklärung.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 9 Kündigung</h2>
              <p className="mb-4">(1) Verträge über einmalige Leistungen enden mit vollständiger Erfüllung.</p>
              <p className="mb-4">(2) Dauerschuldverhältnisse können von beiden Seiten mit einer Frist von 4 Wochen zum Monatsende gekündigt werden.</p>
              <p>(3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">§ 10 Schlussbestimmungen</h2>
              <p className="mb-4">(1) Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform.</p>
              <p className="mb-4">(2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
              <p className="mb-4">(3) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
              <p>(4) Gerichtsstand für alle Streitigkeiten ist der Sitz des Anbieters, sofern der Kunde Kaufmann ist.</p>
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

export default AGB;