'use client';

import { useCallback } from 'react';

export default function UploadZone({ onFileUpload }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Verificar se é um arquivo Excel
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileUpload(file);
      } else {
        alert('Por favor, envie um arquivo Excel (.xlsx ou .xls)');
      }
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileUpload(file);
      } else {
        alert('Por favor, envie um arquivo Excel (.xlsx ou .xls)');
      }
    }
  }, [onFileUpload]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Dashboard de Notas Fiscais
          </h1>
          <p className="text-gray-600">
            Faça upload da sua planilha Excel para visualizar o dashboard automaticamente
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="bg-white rounded-2xl shadow-xl p-12 border-4 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-300 cursor-pointer"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Arraste e solte sua planilha aqui
            </h2>
            <p className="text-gray-500 mb-6">
              ou clique no botão abaixo para selecionar
            </p>
            
            <label className="inline-block">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg cursor-pointer transition-colors duration-300 inline-block">
                Selecionar Arquivo
              </span>
            </label>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ✅ Formatos aceitos: .xlsx, .xls
              </p>
              <p className="text-sm text-gray-500 mt-1">
                🔒 Seus dados são processados localmente no navegador
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-sm font-semibold text-gray-700">Processamento Instantâneo</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm font-semibold text-gray-700">100% Privado</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-semibold text-gray-700">Dashboard Completo</p>
          </div>
        </div>
      </div>
    </div>
  );
}