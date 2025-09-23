import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, FileText, Filter, Download } from 'lucide-react';

type DateRangeOption = 'today' | 'week' | 'month' | 'custom';

const DATE_RANGE_OPTIONS: { key: DateRangeOption; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'custom', label: 'Personalizado' }
];

const Balance: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Mock data for financial information
  const balanceData = {
    today: {
      ingresos: 485000,
      ordenes: 5,
      promedio: 97000
    },
    week: {
      ingresos: 2100000,
      ordenes: 18,
      promedio: 116667
    },
    month: {
      ingresos: 8750000,
      ordenes: 72,
      promedio: 121528
    }
  };

  const currentData = balanceData[dateRange === 'custom' ? 'month' : dateRange];

  // Mock detailed transactions
  const transacciones = [
    {
      id: '1',
      fecha: '2025-01-12',
      cliente: 'Carlos Pérez',
      moto: 'Honda CB 160F',
      servicios: ['Cambio de aceite', 'Filtro de aire'],
      total: 55000,
      estado: 'pagado'
    },
    {
      id: '2',
      fecha: '2025-01-12',
      cliente: 'Ana García',
      moto: 'Yamaha FZ16',
      servicios: ['Mantenimiento 10.000 km'],
      total: 125000,
      estado: 'pagado'
    },
    {
      id: '3',
      fecha: '2025-01-11',
      cliente: 'Luis Rojas',
      moto: 'Suzuki GN125',
      servicios: ['Calibración de válvula', 'Cambio de cadena'],
      total: 100000,
      estado: 'pagado'
    },
    {
      id: '4',
      fecha: '2025-01-11',
      cliente: 'María López',
      moto: 'Honda XR 150L',
      servicios: ['Revisión de frenos', 'Aceite de suspensión'],
      total: 80000,
      estado: 'pendiente'
    },
    {
      id: '5',
      fecha: '2025-01-10',
      cliente: 'Pedro Silva',
      moto: 'Yamaha YBR 125',
      servicios: ['Cambio de bujía', 'Limpieza de carburador'],
      total: 65000,
      estado: 'pagado'
    }
  ];

  // Mock monthly comparison data
  const comparacionMensual = [
    { mes: 'Sep', ingresos: 7200000 },
    { mes: 'Oct', ingresos: 8100000 },
    { mes: 'Nov', ingresos: 7800000 },
    { mes: 'Dic', ingresos: 9200000 },
    { mes: 'Ene', ingresos: 8750000 }
  ];

  const getDateRangeText = () => {
    switch (dateRange) {
      case 'today':
        return 'Hoy';
      case 'week':
        return 'Esta semana';
      case 'month':
        return 'Este mes';
      case 'custom':
        return startDate && endDate ? `${startDate} - ${endDate}` : 'Rango personalizado';
      default:
        return 'Este mes';
    }
  };

  const getChangePercentage = () => {
    // Mock calculation - in real app would compare with previous period
    const changePercentages = {
      today: 12.5,
      week: 8.3,
      month: -4.8
    };
    return changePercentages[dateRange === 'custom' ? 'month' : dateRange];
  };

  const changePercentage = getChangePercentage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Balance Financiero</h2>
          <p className="text-gray-600 mt-1">Análisis de ingresos y transacciones</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Download className="h-5 w-5" />
          <span>Exportar</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-700">Período:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {DATE_RANGE_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDateRange(key)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  dateRange === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos {getDateRangeText()}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${currentData.ingresos.toLocaleString('es-CO')}
              </p>
              <div className="flex items-center mt-2">
                {changePercentage >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  changePercentage >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Órdenes Completadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{currentData.ordenes}</p>
              <p className="text-sm text-gray-500 mt-2">
                {currentData.ordenes} motos atendidas
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio por Orden</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${currentData.promedio.toLocaleString('es-CO')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Valor promedio de servicios
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h3>
        <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
          {comparacionMensual.map((item) => (
            <div key={item.mes} className="flex flex-col items-center">
              <div 
                className="bg-blue-600 rounded-t-md w-12 transition-all duration-300 hover:bg-blue-700"
                style={{ 
                  height: `${(item.ingresos / Math.max(...comparacionMensual.map(i => i.ingresos))) * 200}px` 
                }}
              />
              <span className="text-sm text-gray-600 mt-2">{item.mes}</span>
              <span className="text-xs text-gray-500">
                ${(item.ingresos / 1000000).toFixed(1)}M
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transacciones Detalladas</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showDetails ? 'Ocultar detalles' : 'Ver todos los detalles'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Moto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacciones.slice(0, showDetails ? undefined : 5).map((transaccion) => (
                <tr key={transaccion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaccion.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaccion.cliente}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaccion.moto}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {transaccion.servicios.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${transaccion.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaccion.estado === 'pagado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaccion.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!showDetails && transacciones.length > 5 && (
          <div className="px-6 py-3 text-center border-t border-gray-200">
            <button
              onClick={() => setShowDetails(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver {transacciones.length - 5} transacciones más
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;