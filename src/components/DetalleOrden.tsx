import React, { useEffect, useState } from 'react';
import { X, Calendar, User, Recycle as Motorcycle, Wrench, FileText } from 'lucide-react';
import { OrdenTrabajo } from '../types';
import { useServicios } from '../context/ServiciosContext';

interface DetalleOrdenProps {
  orden: OrdenTrabajo;
  onClose: () => void;
  onEdit?: (orden: OrdenTrabajo) => void;
  onChangeEstado?: (estado: OrdenTrabajo['estado']) => void;
}

const DetalleOrden: React.FC<DetalleOrdenProps> = ({ orden, onClose, onEdit, onChangeEstado }) => {
  const { servicios, categorias } = useServicios();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<OrdenTrabajo['estado']>(orden.estado);
  const isEntregado = orden.estado === 'entregado';

  useEffect(() => {
    setEstadoSeleccionado(orden.estado);
  }, [orden.estado]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'entregado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'completado':
        return 'Completado';
      case 'entregado':
        return 'Entregado';
      default:
        return estado;
    }
  };

  const getEstadoServicio = (estadoOrden: OrdenTrabajo['estado']) => {
    switch (estadoOrden) {
      case 'completado':
      case 'entregado':
        return { etiqueta: 'Completado', clases: 'bg-green-100 text-green-800' };
      case 'en_proceso':
        return { etiqueta: 'En Proceso', clases: 'bg-blue-100 text-blue-800' };
      default:
        return { etiqueta: 'Pendiente', clases: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const serviciosOrden = orden.servicios?.length
    ? orden.servicios
    : [
        { servicio_id: '7', precio: 35000, observaciones: 'Aceite 20W-50 semi-sintético', completado: true },
        { servicio_id: '4', precio: 20000, observaciones: 'Filtro original Honda', completado: true },
        { servicio_id: '5', precio: 18000, observaciones: 'Bujía NGK', completado: false },
        { servicio_id: '12', precio: 35000, observaciones: 'Cadena DID con tensor', completado: false }
      ];

  const handlePrint = () => {
    const serviciosHtml = serviciosOrden
      .map((servicio) => {
        const infoServicio = servicios.find((s) => s.id === servicio.servicio_id);
        return `
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <div>
              <div style="font-weight:600;">${infoServicio?.nombre || 'Servicio'}</div>
              ${servicio.observaciones ? `<div style="color:#4b5563;">${servicio.observaciones}</div>` : ''}
            </div>
            <div style="font-weight:600;">$${servicio.precio.toLocaleString('es-CO')}</div>
          </div>
        `;
      })
      .join('');

    const printWindow = window.open('', '_blank', 'width=420,height=720');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo Orden #${orden.id}</title>
          <style>
            body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 24px; color: #111827; }
            h1 { font-size: 20px; margin: 0 0 8px; }
            h2 { font-size: 16px; margin: 16px 0 8px; }
            .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 14px; margin-bottom: 12px; }
            .label { color: #6b7280; font-size: 12px; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.03em; }
            .value { font-weight: 600; }
            .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
            .total { font-size: 16px; font-weight: 700; display:flex; justify-content: space-between; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Recibo Orden #${orden.id}</h1>
          <div class="row" style="margin-bottom:14px;">
            <span>Estado: ${getStatusText(orden.estado)}</span>
            <span>${new Date(orden.created_at).toLocaleDateString('es-ES')}</span>
          </div>
          <div class="card">
            <h2>Cliente</h2>
            <div class="row"><span class="label">Nombre</span><span class="value">${orden.moto?.cliente?.nombre || ''}</span></div>
            <div class="row"><span class="label">Teléfono</span><span class="value">${orden.moto?.cliente?.telefono || ''}</span></div>
            <div class="row"><span class="label">Cédula</span><span class="value">${orden.moto?.cliente?.cedula || ''}</span></div>
          </div>
          <div class="card">
            <h2>Moto</h2>
            <div class="row"><span class="label">Modelo</span><span class="value">${`${orden.moto?.marca || ''} ${orden.moto?.modelo || ''}`}</span></div>
            <div class="row"><span class="label">Placa</span><span class="value">${orden.moto?.placa || ''}</span></div>
            <div class="row"><span class="label">Kilometraje</span><span class="value">${orden.moto?.kilometraje?.toLocaleString() || ''} km</span></div>
          </div>
          <div class="card">
            <h2>Servicios</h2>
            ${serviciosHtml}
            <div class="total"><span>Total</span><span>$${orden.total.toLocaleString('es-CO')}</span></div>
          </div>
          ${orden.observaciones ? `<div class="card"><h2>Observaciones</h2><div style="font-size:13px;">${orden.observaciones}</div></div>` : ''}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orden de Trabajo #{orden.id}</h2>
          <p className="text-gray-600 mt-1">
            Creada el {new Date(orden.created_at).toLocaleDateString('es-ES')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-4">
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(orden.estado)}`}>
          {getStatusText(orden.estado)}
        </span>
        <span className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">${orden.total.toLocaleString('es-CO')}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cliente y Moto */}
        <div className="space-y-6">
          {/* Información del Cliente */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-gray-900">{orden.moto?.cliente?.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-gray-900">{orden.moto?.cliente?.telefono}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cédula</label>
                <p className="text-gray-900">{orden.moto?.cliente?.cedula}</p>
              </div>
              {orden.moto?.cliente?.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{orden.moto.cliente.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de la Moto */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center space-x-3 mb-4">
              <Motorcycle className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Motocicleta</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Marca</label>
                  <p className="text-gray-900">{orden.moto?.marca}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Modelo</label>
                  <p className="text-gray-900">{orden.moto?.modelo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Año</label>
                  <p className="text-gray-900">{orden.moto?.año}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Placa</label>
                  <p className="text-gray-900 font-mono">{orden.moto?.placa}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Color</label>
                  <p className="text-gray-900">{orden.moto?.color}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kilometraje</label>
                  <p className="text-gray-900">{orden.moto?.kilometraje.toLocaleString()} km</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fechas y Servicios */}
        <div className="space-y-6">
          {/* Fechas */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Fechas</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ingreso</label>
                  <p className="text-gray-900">{new Date(orden.fecha_ingreso).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Entrega Estimada</label>
                  <p className="text-gray-900">{new Date(orden.fecha_entrega_estimada).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
              {orden.fecha_entrega_real && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Entrega Real</label>
                  <p className="text-gray-900">{new Date(orden.fecha_entrega_real).toLocaleDateString('es-ES')}</p>
                </div>
              )}
              {orden.mano_obra && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mecánico</label>
                    <p className="text-gray-900">{orden.mano_obra.mecanico_nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mano de obra</label>
                    <p className="text-gray-900">${orden.mano_obra.valor.toLocaleString('es-CO')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Servicios */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center space-x-3 mb-4">
              <Wrench className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
            </div>
            <div className="space-y-4">
              {serviciosOrden.map((servicioOrden) => {
                const servicio = servicios.find(s => s.id === servicioOrden.servicio_id);
                const categoria = categorias.find(c => c.id === servicio?.categoria_id);
                const estadoServicio = getEstadoServicio(orden.estado);

                return (
                  <div key={servicioOrden.servicio_id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoria?.color || '#6B7280' }}
                        />
                        <span className="font-medium text-gray-900">{servicio?.nombre}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">
                          ${servicioOrden.precio.toLocaleString('es-CO')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${estadoServicio.clases}`}>
                          {estadoServicio.etiqueta}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{categoria?.nombre}</p>
                    {servicioOrden.observaciones && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Notas:</span> {servicioOrden.observaciones}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Total */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${orden.total.toLocaleString('es-CO')}</span>
              </div>
              {orden.mano_obra && (
                <p className="text-sm text-gray-600 mt-1">Incluye mano de obra asignada</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Observaciones */}
      {orden.observaciones && (
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Observaciones</h3>
          </div>
          <p className="text-gray-700">{orden.observaciones}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-2">
          <select
            value={estadoSeleccionado}
            onChange={(e) => setEstadoSeleccionado(e.target.value as OrdenTrabajo['estado'])}
            className="px-3 py-2 border border-gray-300 rounded-lg"
            disabled={isEntregado}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completado">Completado</option>
            <option value="entregado">Entregado</option>
          </select>
          <button
            onClick={() => onChangeEstado?.(estadoSeleccionado)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 text-white ${
              isEntregado ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={isEntregado}
          >
            Guardar estado
          </button>
        </div>
        {isEntregado && (
          <p className="text-sm text-gray-500 mt-2">
            Esta orden ya fue entregada; el estado no se puede modificar.
          </p>
        )}
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit?.(orden)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Editar Orden
          </button>
          <button
            onClick={handlePrint}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleOrden;