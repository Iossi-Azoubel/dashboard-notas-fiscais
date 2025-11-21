'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartBar({ formasPagamento }) {
  const labels = [];
  const taxas = [];
  const colors = [];
  
  const colorMap = {
    'CARTAO': '#EF4444',
    'PIX': '#10B981',
    'DINHEIRO': '#F59E0B',
    'TED': '#8B5CF6'
  };

  // Preparar dados (apenas formas principais)
  ['CARTAO', 'PIX', 'DINHEIRO', 'TED'].forEach(forma => {
    if (formasPagamento[forma] && formasPagamento[forma].count > 0) {
      labels.push(forma.charAt(0) + forma.slice(1).toLowerCase());
      taxas.push(parseFloat(formasPagamento[forma].taxas) || 0);
      colors.push(colorMap[forma]);
    }
  });

  const data = {
    labels,
    datasets: [{
      label: 'Custo Total em Taxas (R$)',
      data: taxas,
      backgroundColor: colors,
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return 'R$ ' + context.parsed.y.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          }
        }
      }
    }
  };

  const totalTaxas = taxas.reduce((a, b) => a + b, 0);
  const economiaAnual = totalTaxas * 12;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        💸 Custos por Forma de Pagamento
      </h3>
      
      <div className="mb-4">
        <Bar data={data} options={options} />
      </div>

      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm text-yellow-800">
          <strong>💡 Insight:</strong> As taxas de cartão custam{' '}
          <strong>R$ {totalTaxas.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</strong> mensalmente. Incentivando PIX, você economizaria{' '}
          <strong>~R$ {economiaAnual.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}/ano</strong>!
        </p>
      </div>
    </div>
  );
}