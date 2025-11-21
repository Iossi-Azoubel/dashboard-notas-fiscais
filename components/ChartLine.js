'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartLine({ timeline }) {
  const data = {
    labels: timeline.labels,
    datasets: [
      {
        label: 'Faturamento Mensal',
        data: timeline.faturamento,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: 'Impostos',
        data: timeline.impostos,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
        }
      }
    }
  };

  // Calcular estatísticas
  const totalMeses = timeline.labels.length;
  const mediaMensal = timeline.faturamento.reduce((a, b) => a + b, 0) / totalMeses;
  const maiorMes = Math.max(...timeline.faturamento);
  const menorMes = Math.min(...timeline.faturamento);
  const indexMaiorMes = timeline.faturamento.indexOf(maiorMes);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        📈 Evolução Temporal do Faturamento
      </h3>
      
      <div className="mb-6">
        <Line data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600 font-semibold">Média Mensal</p>
          <p className="text-lg font-bold text-blue-700">
            R$ {mediaMensal.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600 font-semibold">Melhor Mês</p>
          <p className="text-lg font-bold text-green-700">
            R$ {maiorMes.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <p className="text-xs text-green-600">{timeline.labels[indexMaiorMes]}</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-orange-600 font-semibold">Menor Mês</p>
          <p className="text-lg font-bold text-orange-700">
            R$ {menorMes.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-600 font-semibold">Total de Meses</p>
          <p className="text-lg font-bold text-purple-700">
            {totalMeses} meses
          </p>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm text-blue-800">
          <strong>📊 Análise:</strong> O faturamento teve uma variação de{' '}
          <strong>R$ {(maiorMes - menorMes).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</strong> entre o melhor e o pior mês do período.
        </p>
      </div>
    </div>
  );
}