'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import KPICards from '@/components/KPICards';
import ChartPie from '@/components/ChartPie';
import ChartBar from '@/components/ChartBar';
import Comparison from '@/components/Comparison';
import TopTable from '@/components/TopTable';
import { processExcel } from '@/utils/processExcel';

export default function Home() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await processExcel(file);
      setDashboardData(data);
    } catch (err) {
      setError('Erro ao processar a planilha. Verifique se o formato está correto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDashboardData(null);
    setError(null);
  };

  // Tela de upload
  if (!dashboardData && !loading) {
    return (
      <>
        <UploadZone onFileUpload={handleFileUpload} />
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </>
    );
  }

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processando sua planilha...
          </h2>
          <p className="text-gray-600">
            Aguarde alguns instantes
          </p>
        </div>
      </div>
    );
  }

  // Dashboard completo
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📊 Dashboard Financeiro
            </h1>
            <p className="text-gray-600 mt-2">
              Dr. Roberto Zambelli - Análise de Notas Fiscais
            </p>
          </div>
          <button
            onClick={handleReset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            📁 Nova Planilha
          </button>
        </div>

        {/* KPIs */}
        <div className="mb-6">
          <KPICards kpis={dashboardData.kpis} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartPie formasPagamento={dashboardData.formasPagamento} />
          <ChartBar formasPagamento={dashboardData.formasPagamento} />
        </div>

        {/* Comparativo */}
        <div className="mb-6">
          <Comparison cartaoVsPix={dashboardData.cartaoVsPix} />
        </div>

        {/* Top 5 */}
        <div className="mb-6">
          <TopTable top5={dashboardData.top5} />
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>🔒 Seus dados são processados localmente no navegador e não são enviados para nenhum servidor</p>
        </div>
      </div>
    </div>
  );
}
