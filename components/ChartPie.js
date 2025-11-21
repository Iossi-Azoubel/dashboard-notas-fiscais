'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartPie({ formasPagamento }) {
  const labels = [];
  const values = [];
  const colors = {
    'CARTAO': '#3B82F6',
    'PIX': '#10B981',
    'DINHEIRO': '#F59E0B',
    'TED': '#8B5CF6',
    'OUTROS': '#6B7280'
  };
  const backgroundColors = [];

  // Preparar dados para o gráfico
  Object.keys(formasPagamento).forEach(forma => {
    if (formasPagamento[forma].count > 0) {
      labels.push(forma);
      values.push(formasPagamento[forma].count);
      backgroundColors.push(colors[forma] || '#6B7280');
    }
  });

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: backgroundColors,
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} notas (${percentage}%)`;
          }
        }
      }
    }
  };

  const totalNotas = values.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        💳 Formas de Pagamento
      </h3>
      
      <div className="mb-6">
        <Doughnut data={data} options={options} />
      </div>

      <div className="space-y-2">
        {labels.map((label, index) => {
          const count = values[index];
          const percentage = ((count / totalNotas) * 100).toFixed(1);
          
          return (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: backgroundColors[index] }}
                ></span>
                <span>{label.charAt(0) + label.slice(1).toLowerCase()}</span>
              </div>
              <span className="font-semibold">
                {count} notas ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}