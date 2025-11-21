'use client';

export default function TopTable({ top5 }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    
    // Tentar diferentes formatos de data
    let date;
    if (typeof dateString === 'number') {
      // Data em formato Excel (número serial)
      date = new Date((dateString - 25569) * 86400 * 1000);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString('pt-BR');
  };

  const getPositionEmoji = (index) => {
    const emojis = ['🥇', '🥈', '🥉', '4º', '5º'];
    return emojis[index] || `${index + 1}º`;
  };

  const getPaymentBadge = (formaPagamento) => {
    const forma = formaPagamento.toUpperCase();
    
    if (forma.includes('CARTAO') || forma.includes('CARTÃO')) {
      return {
        text: 'CARTÃO',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      };
    } else if (forma.includes('PIX')) {
      return {
        text: 'PIX',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    } else if (forma.includes('TED')) {
      return {
        text: 'TED',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800'
      };
    } else if (forma.includes('DINHEIRO')) {
      return {
        text: 'DINHEIRO',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      };
    } else {
      return {
        text: formaPagamento,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800'
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        🏆 Top 5 Maiores Notas Fiscais
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Posição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Forma Pgto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {top5.map((nota, index) => {
              const badge = getPaymentBadge(nota.formaPagamento);
              
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-2xl">
                      {getPositionEmoji(index)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(nota.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {nota.paciente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {formatCurrency(nota.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.bgColor} ${badge.textColor}`}>
                      {badge.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}