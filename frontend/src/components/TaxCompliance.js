import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Calendar, AlertTriangle, CheckCircle, Download, Building2 } from 'lucide-react';
import api from '../services/api';

const TaxCompliance = () => {
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      loadMonthlyData();
    }
  }, [selectedMonth, selectedYear]);

  const loadComplianceData = async () => {
    try {
      const response = await api.get('/tax/compliance');
      if (response.data.success) {
        setComplianceStatus(response.data.compliance);
      }
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Compliance-Daten:', error);
      setLoading(false);
    }
  };

  const loadMonthlyData = async () => {
    try {
      const response = await api.get(`/tax/monthly-summary/${selectedYear}/${selectedMonth}`);
      if (response.data.success) {
        setMonthlyData(response.data.summary);
      }
    } catch (error) {
      console.error('Fehler beim Laden der monatlichen Daten:', error);
    }
  };

  const loadYearlyData = async () => {
    try {
      const response = await api.get(`/tax/yearly-summary/${selectedYear}`);
      if (response.data.success) {
        setYearlyData(response.data.summary);
      }
    } catch (error) {
      console.error('Fehler beim Laden der jährlichen Daten:', error);
    }
  };

  const downloadElsterExport = async () => {
    try {
      const response = await api.get(`/tax/elster-export/${selectedYear}/${selectedMonth}`);
      if (response.data.success) {
        const elsterData = response.data.elster_export;
        
        // Create downloadable file
        const dataStr = JSON.stringify(elsterData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `Elster-Export-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Fehler beim Export:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return <Calculator className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-12 w-12 mx-auto mb-4 animate-spin text-green-400" />
          <p className="text-xl">Lade Steuer-Compliance Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Building2 className="h-12 w-12 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Steuer & Compliance Center
            </h1>
            <Calculator className="h-12 w-12 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300">
            🏛️ Deutsche Steuerliche Compliance • USt-Voranmeldung • Elster Integration
          </p>
        </div>

        {complianceStatus && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Compliance Status */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                {getStatusIcon(complianceStatus.compliance_level)}
                <span className="ml-2">Compliance Status</span>
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-1">Steuer-Nr</h4>
                    <p className="text-white">{complianceStatus.steuer_id}</p>
                  </div>
                  <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-1">USt-IdNr</h4>
                    <p className="text-white">{complianceStatus.umsatzsteuer_id}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-1">Inhaber</h4>
                  <p className="text-white">{complianceStatus.business_owner}</p>
                </div>
              </div>
            </div>

            {/* USt-Voranmeldung Deadline */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-yellow-400" />
                Nächste USt-Voranmeldung
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getStatusColor(complianceStatus.deadline_status)}`}>
                    {complianceStatus.days_until_deadline} Tage
                  </div>
                  <p className="text-gray-300">bis {complianceStatus.next_ust_deadline}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-1">Periode</h4>
                    <p className="text-white">{complianceStatus.current_period}</p>
                  </div>
                  <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-1">Rechnungen</h4>
                    <p className="text-white">{complianceStatus.monthly_invoices}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Period Selection */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-400" />
            Periode auswählen
          </h3>
          
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Jahr</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 bg-gray-700 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Monat</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 bg-gray-700 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleDateString('de-DE', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2 pt-6">
              <button
                onClick={loadYearlyData}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition duration-200"
              >
                Jahresübersicht
              </button>
              <button
                onClick={downloadElsterExport}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-200 flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Elster Export
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        {monthlyData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Revenue Overview */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-green-400 mb-4">
                Umsatz {monthlyData.period}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      €{monthlyData.total_revenue_net.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-300">Netto-Umsatz</p>
                  </div>
                  <div className="text-center p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      €{monthlyData.total_tax_collected.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-300">MwSt (19%)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">
                      €{monthlyData.b2b_revenue.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-300">B2B Umsatz</p>
                  </div>
                  <div className="text-center p-3 bg-pink-900/20 border border-pink-500/20 rounded-lg">
                    <div className="text-lg font-bold text-pink-400">
                      €{monthlyData.b2c_revenue.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-300">B2C Umsatz</p>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">
                    {monthlyData.total_invoices} Rechnungen
                  </div>
                  <p className="text-xs text-gray-300">Gesamt erstellt</p>
                </div>
              </div>
            </div>

            {/* Elster Preview */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                Elster USt-Voranmeldung
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <span className="text-gray-300">Kz 60 (Umsätze 19%):</span>
                  <span className="font-semibold text-white">€{monthlyData.elster_data.kz_60.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <span className="text-gray-300">Kz 81 (Steuer 19%):</span>
                  <span className="font-semibold text-white">€{monthlyData.elster_data.kz_81.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                  <span className="text-gray-300">Zahllast:</span>
                  <span className="font-semibold text-green-400">€{(monthlyData.elster_data.kz_81 - monthlyData.elster_data.kz_83).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Yearly Overview */}
        {yearlyData && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              Jahresübersicht {yearlyData.year}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  €{yearlyData.total_revenue_net.toFixed(2)}
                </div>
                <p className="text-gray-300">Gesamt-Umsatz (Netto)</p>
              </div>
              
              <div className="text-center p-6 bg-orange-900/20 border border-orange-500/20 rounded-lg">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  €{yearlyData.total_tax_collected.toFixed(2)}
                </div>
                <p className="text-gray-300">Gesamt-MwSt</p>
              </div>
              
              <div className="text-center p-6 bg-red-900/20 border border-red-500/20 rounded-lg">
                <div className="text-2xl font-bold text-red-400 mb-2">
                  {yearlyData.kleinunternehmer_status ? 'JA' : 'NEIN'}
                </div>
                <p className="text-gray-300">Kleinunternehmer</p>
                <p className="text-xs text-gray-400">(&lt; €22.000)</p>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Footer */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-2">🏛️ Deutsche Steuer-Compliance</h3>
            <p className="text-green-100 mb-4">
              Vollständige Integration mit deutschen Steuervorschriften und Elster-System
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                DSGVO Konform
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                Elster Ready
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                USt-Voranmeldung
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                Rechtskonform
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaxCompliance;