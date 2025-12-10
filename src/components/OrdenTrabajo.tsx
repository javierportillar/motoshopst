import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Trash2 } from 'lucide-react';
import FormularioOrden from './FormularioOrden';
import DetalleOrden from './DetalleOrden';
import { OrdenTrabajo as OrdenTrabajoType } from '../types';

const OrdenTrabajo: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdenTrabajoType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ordenes, setOrdenes] = useState<OrdenTrabajoType[]>([
    {
      id: '1',
      moto_id: '1',
      moto: {
        id: '1',
        cliente_id: '1',
        cliente: {
          id: '1',
          nombre: 'Carlos Pérez',
          telefono: '300-123-4567',
          cedula: '12345678',
          created_at: '2025-01-01'
        },
        marca: 'Honda',
        modelo: 'CB 160F',
        año: 2020,
        placa: 'ABC123',
        kilometraje: 15000,
        color: 'Rojo',
        created_at: '2025-01-01'
      },
      fecha_ingreso: '2025-01-10',
      fecha_entrega_estimada: '2025-01-12',
      estado: 'en_proceso',
      total: 85000,
      observaciones: 'Revisión general y cambio de aceite',
      created_at: '2025-01-10'
    },
    {
      id: '2',
      moto_id: '2',
      moto: {
        id: '2',
        cliente_id: '2',
        cliente: {
          id: '2',
          nombre: 'Ana García',
          telefono: '301-234-5678',
          cedula: '23456789',
          created_at: '2025-01-01'
        },
        marca: 'Yamaha',
        modelo: 'FZ16',
        año: 2019,
        placa: 'DEF456',
        kilometraje: 22000,
        color: 'Azul',
        created_at: '2025-01-01'
      },
      fecha_ingreso: '2025-01-09',
      fecha_entrega_estimada: '2025-01-11',
      estado: 'completado',
      total: 125000,
      observaciones: 'Mantenimiento de 20.000 km',
      created_at: '2025-01-09'
    }
  ]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'entregado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const filteredOrdenes = ordenes.filter(orden => {
    const matchesSearch = orden.moto?.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orden.moto?.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${orden.moto?.marca} ${orden.moto?.modelo}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || orden.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showForm) {
    return (
      <FormularioOrden
        onClose={() => setShowForm(false)}
        onSubmit={(nuevaOrden) => {
          setOrdenes((prev) => [nuevaOrden, ...prev]);
        }}
      />
    );
  }

  if (selectedOrder) {
    return <DetalleOrden orden={selectedOrder} onClose={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Órdenes de Trabajo</h2>
          <p className="text-gray-600 mt-1">Gestión de motos en mantenimiento</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva Orden</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por cliente, placa o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Órdenes */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Moto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrega Est.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrdenes.map((orden) => (
                <tr key={orden.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {orden.moto?.cliente?.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {orden.moto?.marca} {orden.moto?.modelo} • {orden.moto?.placa}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(orden.fecha_ingreso).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(orden.fecha_entrega_estimada).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(orden.estado)}`}>
                      {getStatusText(orden.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${orden.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(orden)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrdenes.length === 0 && (
          <div className="text-center py-12">
            <Motorcycle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter ? 'No se encontraron órdenes con los filtros aplicados.' : 'Comienza creando una nueva orden de trabajo.'}
            </p>
            {!searchTerm && !statusFilter && (
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Orden
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdenTrabajo;