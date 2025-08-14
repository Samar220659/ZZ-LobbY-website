import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MessageCircle, Target, Copy, Check, Plus, Edit } from 'lucide-react';
import api from '../services/api';

const SmartAkquiseCenter = () => {
  const [prospects, setProspects] = useState([]);
  const [messageTemplates, setMessageTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [prospectForm, setProspectForm] = useState({
    name: '',
    company: '',
    email: '',
    linkedin: '',
    phone: '',
    industry: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProspects();
    loadMessageTemplates();
  }, []);

  const loadProspects = async () => {
    try {
      const response = await api.get('/akquise/prospects');
      if (response.data.success) {
        setProspects(response.data.prospects);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Prospects:', error);
    }
  };

  const loadMessageTemplates = async () => {
    const templates = {
      linkedin_initial: {
        subject: "Affiliate Marketing Opportunity - 50% Commission",
        template: `Hallo {name},

ich bin auf dein Profil bei {company} aufmerksam geworden und finde deine Expertise in {industry} sehr beeindruckend!

Ich habe ein Affiliate Programm mit außergewöhnlich guten Konditionen:
• 50% Provision (24,50€ pro Verkauf)
• Sofortige Auszahlung über Digistore24  
• Professionelle Marketing-Materialien inklusive
• Persönlicher Support von mir

Das Produkt ist ein Marketing Automation System für 49€, das bereits über 500 zufriedene Kunden hat.

Falls du Interesse hast, können wir gerne kurz telefonieren oder ich sende dir weitere Informationen.

Beste Grüße,
Daniel Oettel

P.S: Hier ist ein Beispiel-Link: https://www.digistore24.com/redir/1417598/{affiliate_id}`
      },
      facebook_groups: {
        subject: "Erfahrung mit Affiliate Marketing teilen",
        template: `Hey zusammen! 👋

ich teile hier meine Erfahrung mit Affiliate Marketing. Nach 6 Monaten mit verschiedenen Programmen habe ich endlich eines gefunden, das wirklich funktioniert:

🎯 **Was anders ist:**
• 50% Provision (nicht die üblichen 10-20%)
• Sofort-Auszahlung über Digistore24
• Produkt für 49€ (nicht überteuert wie oft)
• Echte Erfolgsgeschichten von Kunden

🔥 **Meine bisherigen Zahlen:**
• 23 Verkäufe in 6 Wochen
• 562,50€ Provisionen erhalten
• Durchschnittlich 4-5 Verkäufe pro Woche

Falls jemand Interesse an seriösem Affiliate Marketing hat (kein MLM!), kann mich gerne anschreiben.

#AffiliateMarketing #PassivesEinkommen #OnlineBusiness`
      },
      email_follow_up: {
        subject: "Kurze Nachfrage - Affiliate Partnership",
        template: `Hallo {name},

ich hatte dir vor einer Woche unser Affiliate Programm vorgestellt und wollte kurz nachfragen, ob du Fragen dazu hast.

Zur Erinnerung die wichtigsten Fakten:
• 50% Provision = 24,50€ pro Verkauf
• Produkt: Marketing Automation System für 49€
• Zielgruppe: Online-Unternehmer, Freelancer, Coaches
• Durchschnittliche Conversion Rate: 5-8%

Vielleicht hilft es dir zu wissen, dass bereits 89 Partner dabei sind und der durchschnittliche Partner 2-3 Verkäufe pro Monat macht.

Falls du erstmal unverbindlich testen möchtest, kann ich dir gerne ein kostenloses Testprodukt zur Verfügung stellen, damit du siehst wie gut es bei deiner Zielgruppe ankommt.

Lass mich wissen was du denkst!

Beste Grüße,
Daniel`
      },
      phone_script: {
        subject: "Telefonskript - Affiliate Partnership",
        template: `📞 **TELEFONSKRIPT - AFFILIATE PARTNERSHIP**

**Eröffnung:**
"Hallo {name}, hier ist Daniel Oettel. Ich hatte dir eine Nachricht bzgl. Affiliate Marketing geschickt. Hast du kurz Zeit für ein 5-Minuten Gespräch?"

**Falls JA - Nutzen erklären:**
"Super! Ich erkläre dir kurz worum es geht:
- Ich habe ein Marketing System entwickelt für 49€
- Du bekommst 50% Provision, also 24,50€ pro Verkauf  
- Das läuft über Digistore24, kennst du das?"

**Einwände behandeln:**
- "Zu wenig Zeit" → "Verstehe ich. Kannst du es passiv nebenbei machen, 2-3 Posts pro Woche reichen"
- "Zu niedriger Preis" → "Genau das ist der Vorteil. Niedrige Hemmschwelle, höhere Conversion Rate"
- "Keine Erfahrung" → "Kein Problem, ich gebe dir alle Marketing-Materialien und persönlichen Support"

**Abschluss:**
"Soll ich dir erstmal unverbindlich die Marketing-Materialien zusenden, damit du dir ein Bild machen kannst?"

**Follow-up:**
"Perfekt, ich schicke dir in den nächsten 2 Stunden alle Infos per Email. Können wir uns dann in 2-3 Tagen nochmal kurz austauschen?"

**Call-Ende:**
"Danke für das Gespräch {name}, bis bald!"

---

🎯 **WICHTIGE TIPPS:**
• Immer freundlich und authentisch bleiben
• Nicht pushy werden - Vertrauen aufbauen
• Bei "Nein" höflich verabschieden
• Follow-up Termine einhalten
• Erfolgsgeschichten anderer Partner erwähnen`
      }
    };

    setMessageTemplates(templates);
  };

  const addProspect = async () => {
    try {
      const response = await api.post('/akquise/prospects', prospectForm);
      if (response.data.success) {
        setProspects([...prospects, response.data.prospect]);
        setProspectForm({
          name: '',
          company: '',
          email: '',
          linkedin: '',
          phone: '',
          industry: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Prospects:', error);
    }
  };

  const personalizeMessage = (templateKey, prospect) => {
    const template = messageTemplates[templateKey];
    if (!template) return '';

    let message = template.template;
    
    // Replace placeholders
    message = message.replace(/\{name\}/g, prospect.name || '[NAME]');
    message = message.replace(/\{company\}/g, prospect.company || '[COMPANY]');  
    message = message.replace(/\{industry\}/g, prospect.industry || '[INDUSTRY]');
    message = message.replace(/\{affiliate_id\}/g, prospect.name ? prospect.name.toLowerCase().replace(/\s+/g, '_') : '[AFFILIATE_ID]');

    return message;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard! 📋');
  };

  const generateAffiliateLink = (prospectName) => {
    const affiliateId = prospectName.toLowerCase().replace(/\s+/g, '_');
    return `https://www.digistore24.com/redir/1417598/${affiliateId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Target className="h-12 w-12 text-pink-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Smart Akquise Center
            </h1>
            <Users className="h-12 w-12 text-pink-400" />
          </div>
          <p className="text-xl text-gray-300">
            🎯 Intelligente Tools für ethische Partner-Akquise • Templates für alle Kanäle • CRM Integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Prospect Management */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-purple-400" />
              Prospect Management
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={prospectForm.name}
                  onChange={(e) => setProspectForm({...prospectForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                />
                <input
                  type="text" 
                  placeholder="Unternehmen"
                  value={prospectForm.company}
                  onChange={(e) => setProspectForm({...prospectForm, company: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={prospectForm.email}
                  onChange={(e) => setProspectForm({...prospectForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                />
                <input
                  type="text"
                  placeholder="LinkedIn Profile"
                  value={prospectForm.linkedin}
                  onChange={(e) => setProspectForm({...prospectForm, linkedin: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                />
                <input
                  type="text"
                  placeholder="Telefon"
                  value={prospectForm.phone}
                  onChange={(e) => setProspectForm({...prospectForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                />
                <input
                  type="text"
                  placeholder="Branche"
                  value={prospectForm.industry}
                  onChange={(e) => setProspectForm({...prospectForm, industry: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                />
              </div>
              <textarea
                placeholder="Notizen"
                value={prospectForm.notes}
                onChange={(e) => setProspectForm({...prospectForm, notes: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                rows={3}
              />
              <button
                onClick={addProspect}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Prospect Hinzufügen
              </button>
            </div>
          </div>

          {/* Message Templates */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-pink-400" />
              Message Templates
            </h3>
            
            <div className="space-y-4">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value="">Template auswählen...</option>
                <option value="linkedin_initial">LinkedIn - Initial Outreach</option>
                <option value="facebook_groups">Facebook Groups - Experience Share</option>
                <option value="email_follow_up">Email - Follow-up</option>
                <option value="phone_script">Telefon - Gesprächsskript</option>
              </select>
              
              {selectedTemplate && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">
                      {messageTemplates[selectedTemplate]?.subject}
                    </h4>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {messageTemplates[selectedTemplate]?.template}
                    </pre>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(messageTemplates[selectedTemplate]?.template || '')}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition duration-200 flex items-center justify-center"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Template Kopieren
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prospects Liste */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-purple-400" />
            Meine Prospects ({prospects.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Unternehmen</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Branche</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prospects.length > 0 ? (
                  prospects.map((prospect, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-purple-900/10 transition duration-200">
                      <td className="py-3 px-4 font-medium text-white">{prospect.name}</td>
                      <td className="py-3 px-4 text-gray-300">{prospect.company}</td>
                      <td className="py-3 px-4 text-gray-300">{prospect.industry}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-600 text-white rounded-full">
                          New
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(generateAffiliateLink(prospect.name))}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            title="Affiliate Link kopieren"
                          >
                            Link
                          </button>
                          <button
                            onClick={() => {
                              if (prospect.email) {
                                const message = personalizeMessage('linkedin_initial', prospect);
                                copyToClipboard(message);
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            title="Personalisierte Message kopieren"
                          >
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>Noch keine Prospects hinzugefügt</p>
                      <p className="text-sm">Füge deine ersten potenziellen Partner hinzu!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Akquise Strategie */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-pink-400" />
            Empfohlene Akquise-Strategie
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
              <div className="text-center">
                <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-400">LinkedIn Outreach</h4>
                <p className="text-sm text-gray-300 mt-1">10 Messages/Tag</p>
              </div>
            </div>
            
            <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h4 className="font-semibold text-green-400">Facebook Groups</h4>
                <p className="text-sm text-gray-300 mt-1">3 Posts/Woche</p>
              </div>
            </div>
            
            <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
              <div className="text-center">
                <Mail className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-400">Email Follow-up</h4>
                <p className="text-sm text-gray-300 mt-1">Nach 7 Tagen</p>
              </div>
            </div>
            
            <div className="p-4 bg-pink-900/20 border border-pink-500/20 rounded-lg">
              <div className="text-center">
                <Phone className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <h4 className="font-semibold text-pink-400">Telefon-Calls</h4>
                <p className="text-sm text-gray-300 mt-1">Bei Interesse</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg">
            <h4 className="font-semibold text-white mb-2">📋 Tägliche Routine:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Morgens: 10 LinkedIn Messages versenden (mit Templates)</li>
              <li>• Mittags: Facebook Groups checken und wertvollen Content posten</li>
              <li>• Abends: Follow-ups auf interessierte Prospects</li>
              <li>• Wöchentlich: Telefonate mit heißen Leads führen</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-2">🎯 Ethische Akquise Tools</h3>
            <p className="text-purple-100 mb-4">
              Alle Templates und Strategien für authentische, persönliche Partner-Akquise
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                Templates Ready
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                CRM Integration
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                Ethisch & Legal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAkquiseCenter;