'use client';

export default function Comparison({ cartaoVsPix }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        🔄 Comparativo: Cartão vs PIX
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cartão */}
        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
          <div className="text-center">
            <div className="text-4xl mb-2">💳</div>
            <h4 className="font-bold text-lg text-red-800">Cartão de Crédito</h4>
            
            <div className="mt-4 space-y-2">
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Notas Emitidas</p>
                <p className="text-2xl font-bold text-red-700">
                  {cartaoVsPix.cartao.count}
                </p>
              </div>
              
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Taxa Média por Nota</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(cartaoVsPix.cartao.taxaMedia)}
                </p>
              </div>
              
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Total em Taxas</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(cartaoVsPix.cartao.taxaTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Balança de Comparação */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl">⚖️</div>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              Economia Potencial
            </p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {formatCurrency(cartaoVsPix.economiaPotencial)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Se todos usassem PIX
            </p>
          </div>
        </div>

        {/* PIX */}
        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
          <div className="text-center">
            <div className="text-4xl mb-2">🟢</div>
            <h4 className="font-bold text-lg text-green-800">PIX</h4>
            
            <div className="mt-4 space-y-2">
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Notas Emitidas</p>
                <p className="text-2xl font-bold text-green-700">
                  {cartaoVsPix.pix.count}
                </p>
              </div>
              
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Taxa Média por Nota</p>
                <p className="text-2xl font-bold text-green-700">
                  R$ 0,00
                </p>
              </div>
              
              <div className="bg-white rounded p-2">
                <p className="text-xs text-gray-600">Total em Taxas</p>
                <p className="text-2xl font-bold text-green-700">
                  R$ 0,00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}