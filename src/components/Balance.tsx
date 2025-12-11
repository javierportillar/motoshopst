import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, FileText, Filter, Download } from 'lucide-react';
import { OrdenTrabajo } from '../types';

type DateRangeOption = 'today' | 'week' | 'month' | 'custom';

const DATE_RANGE_OPTIONS: { key: DateRangeOption; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'custom', label: 'Personalizado' }
];

const getRangeBounds = (option: DateRangeOption, start?: string, end?: string) => {
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  switch (option) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate.setDate(today.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'month':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'custom':
      if (start) {
        startDate.setTime(new Date(start).getTime());
      }
      if (end) {
        endDate.setTime(new Date(end).getTime());
        endDate.setHours(23, 59, 59, 999);
      }
      break;
  }

  return { startDate, endDate };
};

const parseFechaOrden = (orden: OrdenTrabajo) =>
  new Date(orden.fecha_entrega_real || orden.fecha_entrega_estimada || orden.fecha_ingreso);

const Balance: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ordenes');
      setOrdenes(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error('No se pudieron cargar las órdenes para el balance', error);
      setOrdenes([]);
    }
  }, []);

  useEffect(() => {
    if (showExportModal && !exportStartDate && !exportEndDate) {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      setExportStartDate(monthStart);
      setExportEndDate(today.toISOString().slice(0, 10));
    }
  }, [showExportModal, exportEndDate, exportStartDate]);

  const { startDate: rangoInicio, endDate: rangoFin } = useMemo(
    () => getRangeBounds(dateRange, startDate, endDate),
    [dateRange, startDate, endDate]
  );

  const ordenesEntregadas = useMemo(() => {
    return ordenes.filter((orden) => {
      if (orden.estado !== 'entregado') return false;
      const fechaOrden = parseFechaOrden(orden);
      return fechaOrden >= rangoInicio && fechaOrden <= rangoFin;
    });
  }, [ordenes, rangoFin, rangoInicio]);

  const totalIngresos = ordenesEntregadas.reduce((total, orden) => total + (orden.total || 0), 0);
  const totalOrdenes = ordenesEntregadas.length;
  const promedio = totalOrdenes > 0 ? Math.round(totalIngresos / totalOrdenes) : 0;

  const comparacionMensual = useMemo(() => {
    const entregadas = ordenes.filter((orden) => orden.estado === 'entregado');
    const ingresosPorMes = new Map<string, number>();

    entregadas.forEach((orden) => {
      const fecha = parseFechaOrden(orden);
      const llave = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      ingresosPorMes.set(llave, (ingresosPorMes.get(llave) || 0) + (orden.total || 0));
    });

    const items = Array.from(ingresosPorMes.entries())
      .map(([llave, ingresos]) => {
        const [year, month] = llave.split('-').map(Number);
        const fecha = new Date(year, month, 1);
        return {
          mes: fecha.toLocaleDateString('es-ES', { month: 'short' }),
          ingresos,
          orden: fecha.getTime()
        };
      })
      .sort((a, b) => a.orden - b.orden)
      .slice(-5);

    return items;
  }, [ordenes]);

  const transacciones = useMemo(() => {
    return ordenesEntregadas
      .slice()
      .sort((a, b) => parseFechaOrden(b).getTime() - parseFechaOrden(a).getTime());
  }, [ordenesEntregadas]);

  const getChangePercentage = () => {
    const previousRange = getRangeBounds(dateRange, startDate, endDate);
    if (dateRange === 'week') {
      previousRange.startDate.setDate(previousRange.startDate.getDate() - 7);
      previousRange.endDate.setDate(previousRange.endDate.getDate() - 7);
    } else if (dateRange === 'month') {
      previousRange.startDate.setMonth(previousRange.startDate.getMonth() - 1);
      previousRange.endDate.setMonth(previousRange.endDate.getMonth() - 1);
    } else if (dateRange === 'today') {
      previousRange.startDate.setDate(previousRange.startDate.getDate() - 1);
      previousRange.endDate.setDate(previousRange.endDate.getDate() - 1);
    }

    const totalPrevio = ordenes
      .filter((orden) => {
        if (orden.estado !== 'entregado') return false;
        const fecha = parseFechaOrden(orden);
        return fecha >= previousRange.startDate && fecha <= previousRange.endDate;
      })
      .reduce((total, orden) => total + (orden.total || 0), 0);

    if (totalPrevio === 0) return 0;

    return ((totalIngresos - totalPrevio) / totalPrevio) * 100;
  };

  const changePercentage = getChangePercentage();

  const handleExport = () => {
    const { startDate: inicio, endDate: fin } = getRangeBounds('custom', exportStartDate, exportEndDate);

    const datos = ordenes
      .filter((orden) => orden.estado === 'entregado')
      .filter((orden) => {
        const fecha = parseFechaOrden(orden);
        return fecha >= inicio && fecha <= fin;
      })
      .map((orden) => {
        const servicios = orden.servicios?.map((s) => `${s.servicio_id} ($${s.precio})`).join('; ') || 'Sin servicios';
        return [
          orden.id,
          parseFechaOrden(orden).toISOString().slice(0, 10),
          orden.moto?.cliente?.nombre || 'Cliente no registrado',
          `${orden.moto?.marca || ''} ${orden.moto?.modelo || ''}`.trim(),
          servicios,
          orden.total
        ];
      });

    const encabezados = ['ID', 'Fecha', 'Cliente', 'Moto', 'Servicios', 'Total'];
    const csvContent = [encabezados, ...datos]
      .map((fila) =>
        fila
          .map((campo) => {
            const valor = typeof campo === 'string' ? campo : campo.toString();
            return `"${valor.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transacciones_${exportStartDate || 'inicio'}_${exportEndDate || 'fin'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Balance Financiero</h2>
          <p className="text-gray-600 mt-1">Análisis de ingresos y transacciones</p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Download className="h-5 w-5" />
          <span>Exportar</span>
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${totalIngresos.toLocaleString('es-CO')}
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
              <p className="text-sm font-medium text-gray-600">Órdenes Entregadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalOrdenes}</p>
              <p className="text-sm text-gray-500 mt-2">
                {totalOrdenes} motos entregadas en el período
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
                ${promedio.toLocaleString('es-CO')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Valor promedio de servicios entregados
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h3>
        <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
          {comparacionMensual.length === 0 ? (
            <p className="text-gray-500">No hay datos de ingresos aún.</p>
          ) : (
            comparacionMensual.map((item) => (
              <div key={item.orden} className="flex flex-col items-center">
                <div
                  className="bg-blue-600 rounded-t-md w-12 transition-all duration-300 hover:bg-blue-700"
                  style={{
                    height: `${
                      (item.ingresos /
                        Math.max(...comparacionMensual.map((i) => i.ingresos))) * 200
                    }px`
                  }}
                />
                <span className="text-sm text-gray-600 mt-2">{item.mes}</span>
                <span className="text-xs text-gray-500">
                  ${(item.ingresos / 1000000).toFixed(1)}M
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
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

        <div className="md:hidden divide-y divide-gray-200">
          {transacciones.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-500">No hay transacciones en el período seleccionado.</p>
          )}
          {transacciones.slice(0, showDetails ? undefined : 5).map((transaccion) => (
            <div key={transaccion.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {transaccion.moto?.cliente?.nombre || 'Cliente no registrado'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaccion.moto?.marca} {transaccion.moto?.modelo} • {transaccion.moto?.placa}
                  </p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Pagado
                </span>
              </div>
              <div className="text-xs text-gray-500">{parseFechaOrden(transaccion).toLocaleDateString('es-ES')}</div>
              <div className="text-sm text-gray-800">
                {transaccion.servicios?.map((s) => `${s.servicio_id} ($${s.precio.toLocaleString('es-CO')})`).join(', ') ||
                  'Sin servicios registrados'}
              </div>
              <div className="text-sm font-semibold text-gray-900">${transaccion.total.toLocaleString('es-CO')}</div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
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
              {transacciones.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No hay transacciones en el período seleccionado.
                  </td>
                </tr>
              )}
              {transacciones.slice(0, showDetails ? undefined : 5).map((transaccion) => (
                <tr key={transaccion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parseFechaOrden(transaccion).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaccion.moto?.cliente?.nombre || 'Cliente no registrado'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaccion.moto?.marca} {transaccion.moto?.modelo} • {transaccion.moto?.placa}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {transaccion.servicios?.map((s) => `${s.servicio_id} ($${s.precio.toLocaleString('es-CO')})`).join(', ') ||
                        'Sin servicios registrados'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${transaccion.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Pagado
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

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar transacciones</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Desde
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Hasta
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Exportar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balance;
