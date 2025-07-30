import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  Crown, 
  TrendingUp, 
  Target, 
  CheckCircle,
  XCircle,
  ArrowRight,
  DollarSign,
  Users,
  Building,
  Lightbulb,
  Zap,
  Award,
  Star,
  ArrowLeft,
  Clock,
  Calendar,
  MapPin,
  Route,
  Flag,
  Trophy,
  Briefcase,
  GraduationCap,
  Rocket,
  Shield,
  AlertTriangle,
  CheckSquare,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EliteRoadmap = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const roadmapSteps = [
    {
      id: 0,
      level: "STARTPUNKT",
      title: "Arbeitslos",
      description: "Der Anfang Ihrer Transformation",
      timeframe: "Tag 0",
      income: "€0",
      icon: <Flag className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      tasks_do: [
        "🧠 Mindset auf Erfolg programmieren",
        "📚 Elite-Wissen konsumieren (Bücher, Podcasts)",
        "💪 Tägliche Routine etablieren (5:30 Uhr aufstehen)",
        "🎯 Klare Ziele definieren und aufschreiben",
        "🔍 Marktchancen recherchieren",
        "💻 Online-Präsenz aufbauen (LinkedIn, Website)"
      ],
      tasks_dont: [
        "❌ Sich als Opfer sehen",
        "❌ TV/Netflix mehr als 1h täglich",
        "❌ Negative Menschen um sich haben",
        "❌ Ausreden erfinden",
        "❌ Auf staatliche Hilfe warten",
        "❌ Comfort Zone nicht verlassen"
      ]
    },
    {
      id: 1,
      level: "PHASE 1",
      title: "Freelancer/Nebentätigkeit",
      description: "Erste Einnahmen generieren",
      timeframe: "Woche 1-4",
      income: "€500-2.000/Monat",
      icon: <Briefcase className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      tasks_do: [
        "🔥 Skills monetarisieren (Dienstleistungen anbieten)",
        "🌐 Fiverr, Upwork, lokale Kontakte nutzen",
        "📞 Minimum 20 Kunden täglich kontaktieren",
        "💰 Jede Einnahme reinvestieren (80/20 Regel)",
        "📊 Einfache Buchhaltung einführen",
        "🎯 Spezialisierung auf profitable Nische"
      ],
      tasks_dont: [
        "❌ Preise zu niedrig ansetzen",
        "❌ Geld für Luxus ausgeben",
        "❌ Kunden ohne Vertrag arbeiten",
        "❌ Sich auf einen Kunden verlassen",
        "❌ Perfektionismus paralysieren lassen",
        "❌ Familie/Freunde als erste Kunden"
      ]
    },
    {
      id: 2,
      level: "PHASE 2", 
      title: "Skalierte Services",
      description: "System statt Stunden verkaufen",
      timeframe: "Monat 2-6",
      income: "€2.000-8.000/Monat",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      tasks_do: [
        "⚡ Prozesse automatisieren und systematisieren",
        "👥 Erste Mitarbeiter/Freelancer einsetzen",
        "🏗️ Standardisierte Pakete/Angebote erstellen",
        "📈 Premium-Preise durchsetzen (3x Erhöhung)",
        "🎭 Personal Brand aufbauen",
        "🤝 Strategische Partnerschaften eingehen"
      ],
      tasks_dont: [
        "❌ Alles selbst machen wollen",
        "❌ Billiger Konkurrenz hinterherrennen", 
        "❌ Ohne Vertrag/Anzahlung arbeiten",
        "❌ Schlechte Kunden behalten",
        "❌ Expansion ohne System",
        "❌ Steueroptimierung ignorieren"
      ]
    },
    {
      id: 3,
      level: "PHASE 3",
      title: "Digitale Produkte",
      description: "Passive Einkommensströme aufbauen",
      timeframe: "Monat 6-12",
      income: "€5.000-20.000/Monat",
      icon: <Rocket className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      tasks_do: [
        "📚 Wissen in Kurse/Coaching verwandeln",
        "🤖 Sales Funnels und Marketing-Automation",
        "💎 Premium-Coaching-Programme (€2.000+)",
        "🎬 Content-Marketing systematisch betreiben",
        "💸 Paid Ads meistern (Facebook, Google, TikTok)",
        "📊 Daten-driven Entscheidungen treffen"
      ],
      tasks_dont: [
        "❌ Kostenlose Beratungen geben",
        "❌ Alle Plattformen gleichzeitig bespielen",
        "❌ Ohne Testimonials/Beweise starten",
        "❌ Komplizierte Produkte bauen",
        "❌ Marketing-Budget begrenzen",
        "❌ Shiny Object Syndrome"
      ]
    },
    {
      id: 4,
      level: "PHASE 4",
      title: "Online Business Empire",
      description: "Mehrere Einkommensströme koordinieren",
      timeframe: "Jahr 1-2",
      income: "€20.000-50.000/Monat",
      icon: <Building className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      tasks_do: [
        "🏢 GmbH/UG gründen für Steueroptimierung",
        "🎯 Multiple Zielgruppen systematisch bedienen",
        "👥 Team von 5-10 Leuten aufbauen",
        "🔄 Wiederkehrende Umsätze etablieren",
        "📈 Skalierbare Systeme implementieren",
        "💰 Erste Investments tätigen (Immobilien/Aktien)"
      ],
      tasks_dont: [
        "❌ Mikromanagement betreiben",
        "❌ Alle Gewinne privat entnehmen",
        "❌ Ohne Notfall-Rücklage operieren", 
        "❌ Rechtliche Strukturen ignorieren",
        "❌ Team ohne klare KPIs führen",
        "❌ Persönlich in der Produktion arbeiten"
      ]
    },
    {
      id: 5,
      level: "ZIEL",
      title: "Firmenchef/Investor",
      description: "Wahre finanzielle Freiheit erreicht",
      timeframe: "Jahr 2+",
      income: "€50.000+/Monat",
      icon: <Crown className="w-8 h-8" />,
      color: "from-yellow-500 to-yellow-600",
      tasks_do: [
        "👑 Als CEO strategisch führen, nicht operativ",
        "🏦 Portfolio aus mehreren Unternehmen",
        "💎 Angel Investing in andere Startups", 
        "🎓 Mastermind-Gruppen und Elite-Netzwerke",
        "📚 Eigene Bücher/Thought Leadership",
        "🌍 Internationales Business aufbauen"
      ],
      tasks_dont: [
        "❌ Auf den Lorbeeren ausruhen",
        "❌ Risiko-Management vernachlässigen",
        "❌ Team/Kultur nicht weiterentwickeln",
        "❌ Innovation stoppen",
        "❌ Persönliche Weiterbildung beenden",
        "❌ Soziale Verantwortung ignorieren"
      ]
    }
  ];

  const toggleStepComplete = (stepId) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const getCompletionPercentage = () => {
    return (completedSteps.length / roadmapSteps.length) * 100;
  };

  const getCurrentLevelColor = (step) => {
    if (completedSteps.includes(step.id)) {
      return "from-green-600 to-green-700";
    }
    if (step.id === currentLevel) {
      return step.color;
    }
    return "from-gray-600 to-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="absolute left-4 top-4 text-purple-400 hover:text-purple-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <div className="relative">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              ELITE ROADMAP
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Von Arbeitslos zum Firmenchef • Der komplette Fahrplan
            </p>
            
            {/* Progress Overview */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Fortschritt</span>
                <span className="text-sm text-gray-400">{completedSteps.length}/{roadmapSteps.length} Phasen</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-3 mb-2" />
              <p className="text-sm text-center text-purple-300">
                {getCompletionPercentage().toFixed(0)}% Ihrer Transformation abgeschlossen
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-gradient-to-b from-red-500 via-purple-500 to-yellow-500 h-full"></div>
          
          <div className="space-y-12">
            {roadmapSteps.map((step, index) => (
              <div key={step.id} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCurrentLevelColor(step)} flex items-center justify-center border-4 border-gray-900 shadow-xl transition-all duration-300`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <div className="text-white">
                        {step.icon}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                  <Card className={`bg-gradient-to-r ${getCurrentLevelColor(step)} border-2 border-white/20 shadow-2xl transition-all duration-300 hover:scale-105`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-black/30 text-white border-white/30 mb-2">
                            {step.level}
                          </Badge>
                          <CardTitle className="text-2xl font-bold text-white">
                            {step.title}
                          </CardTitle>
                        </div>
                        <Button
                          onClick={() => toggleStepComplete(step.id)}
                          size="sm"
                          variant={completedSteps.includes(step.id) ? "default" : "outline"}
                          className={completedSteps.includes(step.id) ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {completedSteps.includes(step.id) ? <CheckSquare className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-white/80">{step.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {step.timeframe}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {step.income}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="do" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-black/30">
                          <TabsTrigger value="do" className="text-white data-[state=active]:bg-green-600/50">
                            ✅ MACHEN (JACK)
                          </TabsTrigger>
                          <TabsTrigger value="dont" className="text-white data-[state=active]:bg-red-600/50">
                            ❌ NICHT MACHEN
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="do" className="space-y-2">
                          {step.tasks_do.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-start gap-2 p-2 bg-green-900/20 rounded-lg border border-green-500/30">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-white text-sm">{task}</span>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="dont" className="space-y-2">
                          {step.tasks_dont.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-start gap-2 p-2 bg-red-900/20 rounded-lg border border-red-500/30">
                              <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-white text-sm">{task}</span>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-400 flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8" />
                IHRE TRANSFORMATION BEGINNT HEUTE
                <Trophy className="w-8 h-8" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xl text-gray-300">
                Jeder erfolgreiche Unternehmer hat diese Phasen durchlaufen. 
                Der Unterschied: Sie haben einen klaren Fahrplan!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-400/30">
                  <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <h4 className="font-semibold text-green-400">Klarer Weg</h4>
                  <p className="text-sm text-green-200">Jede Phase hat konkrete Schritte</p>
                </div>
                
                <div className="text-center p-4 bg-blue-900/30 rounded-lg border border-blue-400/30">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <h4 className="font-semibold text-blue-400">Bewährte Methoden</h4>
                  <p className="text-sm text-blue-200">Getestet von erfolgreichen Unternehmern</p>
                </div>
                
                <div className="text-center p-4 bg-purple-900/30 rounded-lg border border-purple-400/30">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <h4 className="font-semibold text-purple-400">Elite Mindset</h4>
                  <p className="text-sm text-purple-200">Die richtige Denkweise für Erfolg</p>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={() => navigate('/hyperschwarm')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 text-lg"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  TRANSFORMATION MIT HYPERSCHWARM STARTEN
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  Nutzen Sie die Kraft von 20+ KI-Agenten für Ihre Reise
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EliteRoadmap;