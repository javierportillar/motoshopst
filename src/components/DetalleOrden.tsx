import React from 'react';
import { X, Calendar, User, Recycle as Motorcycle, Wrench, FileText } from 'lucide-react';
import { OrdenTrabajo } from '../types';
import { useServicios } from '../context/ServiciosContext';

interface DetalleOrdenProps {
  orden: OrdenTrabajo;
  onClose: () => void;
}

const DetalleOrden: React.FC<DetalleOrdenProps> = ({ orden, onClose }) => {
  const { servicios, categorias } = useServicios();

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

  // Mock services data for this order
  const serviciosOrden = [
    { servicio_id: '7', precio: 35000, observaciones: 'Aceite 20W-50 semi-sintético', completado: true },
    { servicio_id: '4', precio: 20000, observaciones: 'Filtro original Honda', completado: true },
    { servicio_id: '5', precio: 18000, observaciones: 'Bujía NGK', completado: false },
    { servicio_id: '12', precio: 35000, observaciones: 'Cadena DID con tensor', completado: false }
  ];

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
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          servicioOrden.completado 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {servicioOrden.completado ? 'Completado' : 'Pendiente'}
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
      <div className="flex space-x-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Editar Orden
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Cambiar Estado
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Imprimir
        </button>
      </div>
    </div>
  );
};

export default DetalleOrden;