import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  XCircle, 
  ArrowLeft,
  CreditCard,
  HelpCircle
} from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4">
        <Card className="bg-black/40 border-red-400/20 backdrop-blur-sm">
          <CardHeader>
            <div className="text-center space-y-4">
              <XCircle className="h-16 w-16 text-red-400 mx-auto" />
              <div>
                <CardTitle className="text-2xl font-serif text-red-400">
                  Zahlung abgebrochen
                </CardTitle>
                <p className="text-gray-300 font-serif italic mt-2">
                  Ihre Zahlung wurde abgebrochen. Keine Sorge, es wurden keine Kosten berechnet.
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Info Section */}
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-yellow-200 font-semibold text-sm mb-2">
                      Was passiert jetzt?
                    </h3>
                    <ul className="text-xs text-yellow-300 space-y-1">
                      <li>• Keine Gebühren wurden berechnet</li>
                      <li>• Sie können jederzeit erneut kaufen</li>
                      <li>• Ihre Daten sind sicher</li>
                      <li>• Bei Problemen kontaktieren Sie uns</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/profit-center')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-serif"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Erneut versuchen
                </Button>
                
                <Button
                  onClick={() => navigate('/control')}
                  variant="outline"
                  className="flex-1 border-yellow-400/20 text-yellow-200 hover:bg-yellow-400/10 font-serif"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zum Control Center
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <Card className="bg-black/20 border-gray-400/10 backdrop-blur-sm mt-6">
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-400">
              <p>
                Haben Sie Fragen zu unseren Paketen oder der Zahlung?
              </p>
              <p className="mt-2">
                Kontaktieren Sie uns über das Control Center oder probieren Sie eine andere Zahlungsmethode.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}