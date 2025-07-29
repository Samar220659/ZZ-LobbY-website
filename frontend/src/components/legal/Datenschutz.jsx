import React from 'react';

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Datenschutzerklärung
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">1. Datenschutz auf einen Blick</h2>
              
              <h3 className="text-lg font-semibold text-white mb-2">Allgemeine Hinweise</h3>
              <p className="mb-4">Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
              
              <h3 className="text-lg font-semibold text-white mb-2">Datenerfassung auf dieser Website</h3>
              <p className="mb-2"><strong className="text-blue-400">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
              <p className="mb-4">Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.</p>
              
              <p className="mb-2"><strong className="text-blue-400">Wie erfassen wir Ihre Daten?</strong></p>
              <p className="mb-4">Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>
              
              <p className="mb-2"><strong className="text-blue-400">Wofür nutzen wir Ihre Daten?</strong></p>
              <p className="mb-4">Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>
              
              <p className="mb-2"><strong className="text-blue-400">Welche Rechte haben Sie bezüglich Ihrer Daten?</strong></p>
              <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">2. Hosting</h2>
              <p className="mb-2">Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
              <p className="mb-4">Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">3. Allgemeine Hinweise und Pflichtinformationen</h2>
              
              <h3 className="text-lg font-semibold text-white mb-2">Datenschutz</h3>
              <p className="mb-4">Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzbestimmungen sowie dieser Datenschutzerklärung.</p>
              
              <h3 className="text-lg font-semibold text-white mb-2">Hinweis zur verantwortlichen Stelle</h3>
              <p className="mb-2">Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
              <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p><strong>Daniel Oettel</strong></p>
                <p>ZZ Lobby</p>
                <p>Pekinger Straße 5</p>
                <p>06712 Zeitz</p>
                <p>Deutschland</p>
                <p className="mt-2">Telefon: 015731873862</p>
                <p>E-Mail: <a href="mailto:samar220659@gmail.com" className="text-blue-400 hover:text-blue-300">samar220659@gmail.com</a></p>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Speicherdauer</h3>
              <p className="mb-4">Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">4. Datenerfassung auf dieser Website</h2>
              
              <h3 className="text-lg font-semibold text-white mb-2">Server-Log-Dateien</h3>
              <p className="mb-4">Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-white mb-2">Kontaktformular</h3>
              <p className="mb-4">Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">5. Zahlungsdienstleister</h2>
              
              <h3 className="text-lg font-semibold text-white mb-2">PayPal</h3>
              <p className="mb-4">Auf dieser Website bieten wir u.a. die Bezahlung via PayPal an. Anbieter dieses Zahlungsdienstes ist die PayPal (Europe) S.à.r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg (im Folgenden „PayPal").</p>
              <p className="mb-4">Wenn Sie die Bezahlung via PayPal auswählen, werden die von Ihnen eingegebenen Zahlungsdaten an PayPal übermittelt. Die Übermittlung Ihrer Daten an PayPal erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO (Verarbeitung zur Erfüllung eines Vertrags). Sie haben die Möglichkeit, Ihre Einwilligung zur Datenverarbeitung jederzeit zu widerrufen. Ein Widerruf wirkt sich auf die Wirksamkeit von in der Vergangenheit liegenden Datenverarbeitungsvorgängen nicht aus.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">6. Ihre Rechte</h2>
              <p className="mb-4">Sie haben folgende Rechte:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-blue-400">Auskunftsrecht:</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
                <li><strong className="text-blue-400">Berichtigungsrecht:</strong> Sie haben ein Recht auf Berichtigung unrichtiger oder unvollständiger personenbezogener Daten.</li>
                <li><strong className="text-blue-400">Löschungsrecht:</strong> Sie können die Löschung Ihrer personenbezogenen Daten verlangen.</li>
                <li><strong className="text-blue-400">Einschränkungsrecht:</strong> Sie können die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.</li>
                <li><strong className="text-blue-400">Widerspruchsrecht:</strong> Sie können der Verarbeitung Ihrer personenbezogenen Daten widersprechen.</li>
                <li><strong className="text-blue-400">Datenübertragbarkeit:</strong> Sie können die Herausgabe Ihrer Daten in einem strukturierten, gängigen und maschinenlesbaren Format verlangen.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-3">7. Kontakt bei Datenschutzfragen</h2>
              <p className="mb-2">Bei Fragen zum Datenschutz wenden Sie sich bitte an:</p>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p><strong>Daniel Oettel</strong></p>
                <p>E-Mail: <a href="mailto:samar220659@gmail.com" className="text-blue-400 hover:text-blue-300">samar220659@gmail.com</a></p>
                <p>Telefon: 015731873862</p>
              </div>
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

export default Datenschutz;