import React from 'react';
import { Recycle as Motorcycle, Clock, CheckCircle, AlertCircle, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const stats = [
    {
      title: 'Motos en Taller',
      value: '12',
      change: '+2 desde ayer',
      icon: Motorcycle,
      color: 'bg-blue-500'
    },
    {
      title: 'En Proceso',
      value: '8',
      change: '+1 desde ayer',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completados Hoy',
      value: '5',
      change: '+3 desde ayer',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Ingresos del Día',
      value: '$485.000',
      change: '+12% vs ayer',
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  const urgentes = [
    { moto: 'Honda CB 160F', cliente: 'Carlos Pérez', servicio: 'Calibración de válvula', tiempo: '2 días' },
    { moto: 'Yamaha FZ16', cliente: 'Ana García', servicio: 'Cambio de aceite', tiempo: '1 día' },
    { moto: 'Suzuki GN125', cliente: 'Luis Rojas', servicio: 'Frenos y seguridad', tiempo: '3 días' }
  ];

  const proximosMantenimientos = [
    { cliente: 'María López', moto: 'Honda XR 150L', fecha: '2025-01-15', servicio: 'Mantenimiento 10.000 km' },
    { cliente: 'Pedro Silva', moto: 'Yamaha YBR 125', fecha: '2025-01-16', servicio: 'Cambio de aceite' },
    { cliente: 'Sandra Ruiz', moto: 'KTM 200 Duke', fecha: '2025-01-18', servicio: 'Revisión general' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Vista general del taller</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trabajos Urgentes */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trabajos Urgentes</h3>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-4">
            {urgentes.map((trabajo, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{trabajo.moto}</p>
                  <p className="text-sm text-gray-600">{trabajo.cliente} • {trabajo.servicio}</p>
                </div>
                <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                  {trabajo.tiempo}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onPageChange('ordenes')}
            className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas las órdenes →
          </button>
        </div>

        {/* Próximos Mantenimientos */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Mantenimientos</h3>
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {proximosMantenimientos.map((mantenimiento, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">{mantenimiento.cliente}</p>
                  <p className="text-sm text-gray-600">{mantenimiento.moto} • {mantenimiento.servicio}</p>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {new Date(mantenimiento.fecha).toLocaleDateString('es-ES')}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onPageChange('preventivo')}
            className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver mantenimiento preventivo →
          </button>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => onPageChange('ordenes')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-sm transition-colors duration-200"
        >
          <Motorcycle className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold">Nueva Orden de Trabajo</h3>
          <p className="text-blue-100 text-sm mt-1">Registrar nueva moto</p>
        </button>

        <button 
          onClick={() => onPageChange('clientes')}
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-sm transition-colors duration-200"
        >
          <Users className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold">Gestionar Clientes</h3>
          <p className="text-green-100 text-sm mt-1">Ver y editar clientes</p>
        </button>

        <button 
          onClick={() => onPageChange('balance')}
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-sm transition-colors duration-200"
        >
          <TrendingUp className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold">Ver Balance</h3>
          <p className="text-purple-100 text-sm mt-1">Reportes financieros</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;