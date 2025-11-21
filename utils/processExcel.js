import * as XLSX from 'xlsx';

export const processExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Ler o arquivo Excel
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Pegar a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converter para JSON
        let jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Limpar espaços extras dos nomes das colunas
        jsonData = jsonData.map(row => {
          const cleanRow = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim(); // Remove espaços do início e fim
            cleanRow[cleanKey] = row[key];
          });
          return cleanRow;
        });
        
        // Processar os dados
        const processedData = analyzeData(jsonData);
        
        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const analyzeData = (data) => {
  // DEBUG: Ver estrutura dos dados
  console.log('=== DEBUG: Dados brutos ===');
  console.log('Total de linhas:', data.length);
  console.log('Primeira linha:', data[0]);
  console.log('Colunas disponíveis:', Object.keys(data[0] || {}));

  // Filtrar dados válidos
  const validData = data.filter(row => 
    row['VALOR BRUTO DA NOTA FISCAL'] && 
    row['VALOR BRUTO DA NOTA FISCAL'] > 0
  );

  // 1. Calcular totais
  const totalBruto = validData.reduce((sum, row) => 
    sum + (row['VALOR BRUTO DA NOTA FISCAL'] || 0), 0
  );
  
  const totalImpostos = validData.reduce((sum, row) => 
    sum + (row['VALOR DO IMPOSTO'] || 0), 0
  );
  
  const totalTaxas = validData.reduce((sum, row) => 
    sum + (row['VALOR TAXA DE CARTAO'] || 0), 0
  );
  
  const totalLiquido = totalBruto - totalImpostos - totalTaxas;
  
  const ticketMedio = totalBruto / validData.length;

  // 2. Agrupar por forma de pagamento
  const formasPagamento = {};
  validData.forEach(row => {
    const forma = (row['FORMA DE PAGAMENTO'] || 'NÃO INFORMADO').trim().toUpperCase();
    
    if (!formasPagamento[forma]) {
      formasPagamento[forma] = {
        count: 0,
        total: 0,
        taxas: 0
      };
    }
    
    formasPagamento[forma].count++;
    formasPagamento[forma].total += row['VALOR BRUTO DA NOTA FISCAL'] || 0;
    formasPagamento[forma].taxas += row['VALOR TAXA DE CARTAO'] || 0;
  });

  // 3. Simplificar formas de pagamento (agrupar variações)
  const formasSimplificadas = simplifyPaymentMethods(formasPagamento);

  // 4. Top 5 maiores notas
  const top5 = validData
    .sort((a, b) => (b['VALOR BRUTO DA NOTA FISCAL'] || 0) - (a['VALOR BRUTO DA NOTA FISCAL'] || 0))
    .slice(0, 5)
    .map(row => ({
      data: row['DATA DA EMISSAO DA NOTA'],
      paciente: row['NOME DO PACIENTE'] || 'Não informado',
      valor: row['VALOR BRUTO DA NOTA FISCAL'],
      formaPagamento: (row['FORMA DE PAGAMENTO'] || 'NÃO INFORMADO').trim()
    }));

  // 5. Estatísticas de cartão vs PIX
  const cartaoStats = calculateCardStats(formasSimplificadas);

  // 6. Análise temporal (por mês)
  const timelineData = analyzeTimeline(validData);

  // 7. Detectar período dos dados
  const dateRange = getDateRange(validData);

  return {
    kpis: {
      totalBruto: totalBruto.toFixed(2),
      totalLiquido: totalLiquido.toFixed(2),
      totalImpostos: totalImpostos.toFixed(2),
      totalTaxas: totalTaxas.toFixed(2),
      ticketMedio: ticketMedio.toFixed(2),
      totalNotas: validData.length
    },
    formasPagamento: formasSimplificadas,
    top5,
    cartaoVsPix: cartaoStats,
    timeline: timelineData,
    dateRange: dateRange
  };
};

const simplifyPaymentMethods = (formas) => {
  const simplified = {
    'CARTAO': { count: 0, total: 0, taxas: 0 },
    'PIX': { count: 0, total: 0, taxas: 0 },
    'DINHEIRO': { count: 0, total: 0, taxas: 0 },
    'TED': { count: 0, total: 0, taxas: 0 },
    'OUTROS': { count: 0, total: 0, taxas: 0 }
  };

  Object.keys(formas).forEach(forma => {
    if (forma.includes('CARTAO') || forma.includes('CARTÃO') || forma.includes('DEBITO')) {
      simplified['CARTAO'].count += formas[forma].count;
      simplified['CARTAO'].total += formas[forma].total;
      simplified['CARTAO'].taxas += formas[forma].taxas;
    } else if (forma.includes('PIX')) {
      simplified['PIX'].count += formas[forma].count;
      simplified['PIX'].total += formas[forma].total;
      simplified['PIX'].taxas += formas[forma].taxas;
    } else if (forma.includes('DINHEIRO')) {
      simplified['DINHEIRO'].count += formas[forma].count;
      simplified['DINHEIRO'].total += formas[forma].total;
      simplified['DINHEIRO'].taxas += formas[forma].taxas;
    } else if (forma.includes('TED')) {
      simplified['TED'].count += formas[forma].count;
      simplified['TED'].total += formas[forma].total;
      simplified['TED'].taxas += formas[forma].taxas;
    } else {
      simplified['OUTROS'].count += formas[forma].count;
      simplified['OUTROS'].total += formas[forma].total;
      simplified['OUTROS'].taxas += formas[forma].taxas;
    }
  });

  return simplified;
};

const calculateCardStats = (formas) => {
  const cartao = formas['CARTAO'] || { count: 0, taxas: 0 };
  const pix = formas['PIX'] || { count: 0, taxas: 0 };

  return {
    cartao: {
      count: cartao.count,
      taxaTotal: cartao.taxas.toFixed(2),
      taxaMedia: cartao.count > 0 ? (cartao.taxas / cartao.count).toFixed(2) : 0
    },
    pix: {
      count: pix.count,
      taxaTotal: 0,
      taxaMedia: 0
    },
    economiaPotencial: cartao.taxas.toFixed(2)
  };
};

const analyzeTimeline = (data) => {
  const monthlyData = {};
  
  data.forEach(row => {
    const dateValue = row['DATA DA EMISSAO DA NOTA'];
    if (!dateValue) return;
    
    let date;
    if (typeof dateValue === 'number') {
      // Data em formato Excel (número serial)
      date = new Date((dateValue - 25569) * 86400 * 1000);
    } else {
      date = new Date(dateValue);
    }
    
    if (isNaN(date.getTime())) return;
    
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        faturamento: 0,
        impostos: 0,
        taxas: 0,
        notas: 0
      };
    }
    
    monthlyData[monthKey].faturamento += row['VALOR BRUTO DA NOTA FISCAL'] || 0;
    monthlyData[monthKey].impostos += row['VALOR DO IMPOSTO'] || 0;
    monthlyData[monthKey].taxas += row['VALOR TAXA DE CARTAO'] || 0;
    monthlyData[monthKey].notas += 1;
  });
  
  // Ordenar por data
  const sortedMonths = Object.keys(monthlyData).sort();
  
  return {
    labels: sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return `${monthNames[parseInt(month) - 1]}/${year}`;
    }),
    faturamento: sortedMonths.map(m => monthlyData[m].faturamento),
    impostos: sortedMonths.map(m => monthlyData[m].impostos),
    taxas: sortedMonths.map(m => monthlyData[m].taxas),
    notas: sortedMonths.map(m => monthlyData[m].notas),
    rawData: monthlyData
  };
};

const getDateRange = (data) => {
  let minDate = null;
  let maxDate = null;
  
  data.forEach(row => {
    const dateValue = row['DATA DA EMISSAO DA NOTA'];
    if (!dateValue) return;
    
    let date;
    if (typeof dateValue === 'number') {
      date = new Date((dateValue - 25569) * 86400 * 1000);
    } else {
      date = new Date(dateValue);
    }
    
    if (isNaN(date.getTime())) return;
    
    if (!minDate || date < minDate) minDate = date;
    if (!maxDate || date > maxDate) maxDate = date;
  });
  
  if (!minDate || !maxDate) {
    return { start: null, end: null, months: 0, label: 'Período não detectado' };
  }
  
  const months = ((maxDate.getFullYear() - minDate.getFullYear()) * 12) + (maxDate.getMonth() - minDate.getMonth()) + 1;
  
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const label = `${monthNames[minDate.getMonth()]}/${minDate.getFullYear()} - ${monthNames[maxDate.getMonth()]}/${maxDate.getFullYear()}`;
  
  return { start: minDate, end: maxDate, months, label };
};
