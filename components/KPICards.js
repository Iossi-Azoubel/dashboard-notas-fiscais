'use client';

export default function KPICards({ kpis }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: 'Faturamento Bruto',
      value: formatCurrency(kpis.totalBruto),
      subtitle: `${kpis.totalNotas} notas fiscais`,
      icon: '💰',
      gradient: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-100'
    },
    {
      title: 'Faturamento Líquido',
      value: formatCurrency(kpis.totalLiquido),
      subtitle: 'Após impostos e taxas',
      icon: '✅',
      gradient: 'from-green-500 to-green-600',
      textColor: 'text-green-100'
    },
    {
      title: 'Total de Impostos',
      value: formatCurrency(kpis.totalImpostos),
      subtitle: `${((kpis.totalImpostos / kpis.totalBruto) * 100).toFixed(1)}% do faturamento`,
      icon: '📋',
      gradient: 'from-red-500 to-red-600',
      textColor: 'text-red-100'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(kpis.ticketMedio),
      subtitle: 'Média por nota fiscal',
      icon: '📊',
      gradient: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.gradient} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${card.textColor} text-sm font-medium`}>
                {card.title}
              </p>
              <h2 className="text-3xl font-bold mt-2">
                {card.value}
              </h2>
              <p className={`${card.textColor} text-xs mt-1`}>
                {card.subtitle}
              </p>
            </div>
            <div className="text-5xl opacity-20">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}