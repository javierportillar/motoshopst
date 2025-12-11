import React, { useEffect, useMemo, useState } from 'react';
import { Recycle as Motorcycle, Clock, CheckCircle, AlertCircle, DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { OrdenTrabajo } from '../types';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);

  useEffect(() => {
    const loadOrdenes = () => {
      try {
        const stored = localStorage.getItem('ordenes');
        setOrdenes(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error('No se pudieron cargar las órdenes para el dashboard', error);
        setOrdenes([]);
      }
    };

    loadOrdenes();
    window.addEventListener('storage', loadOrdenes);

    return () => window.removeEventListener('storage', loadOrdenes);
  }, []);

  const stats = useMemo(() => {
    const completadasHoy = ordenes.filter((orden) => {
      if (orden.estado !== 'completado') return false;
      const fecha = orden.fecha_entrega_real || orden.fecha_entrega_estimada || orden.fecha_ingreso;
      const fechaOrden = new Date(fecha);
      const hoy = new Date();
      return (
        fechaOrden.getDate() === hoy.getDate() &&
        fechaOrden.getMonth() === hoy.getMonth() &&
        fechaOrden.getFullYear() === hoy.getFullYear()
      );
    });

    const ingresosHoy = completadasHoy.reduce((total, orden) => total + (orden.total || 0), 0);

    return [
      {
        title: 'Motos en Taller',
        value: ordenes.length.toString(),
        change: ordenes.length === 0 ? 'Sin registros aún' : 'Conteo actualizado',
        icon: Motorcycle,
        color: 'bg-blue-500'
      },
      {
        title: 'En Proceso',
        value: ordenes.filter((o) => o.estado === 'en_proceso').length.toString(),
        change: 'Seguimiento en vivo',
        icon: Clock,
        color: 'bg-yellow-500'
      },
      {
        title: 'Completados Hoy',
        value: completadasHoy.length.toString(),
        change: completadasHoy.length === 0 ? 'Aún no hay entregas' : 'Listo para entregar',
        icon: CheckCircle,
        color: 'bg-green-500'
      },
      {
        title: 'Ingresos del Día',
        value: `$ ${ingresosHoy.toLocaleString('es-CO')}`,
        change: ingresosHoy === 0 ? 'Genera una orden para ver ingresos' : 'Calculado con entregas de hoy',
        icon: DollarSign,
        color: 'bg-purple-500'
      }
    ];
  }, [ordenes]);

  const urgentes = useMemo(() => {
    const hoy = new Date();
    return ordenes
      .filter((orden) => orden.estado === 'pendiente' || orden.estado === 'en_proceso')
      .map((orden) => {
        const fechaEntrega = new Date(orden.fecha_entrega_estimada || orden.fecha_ingreso);
        const diffMs = fechaEntrega.getTime() - hoy.getTime();
        const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return {
          moto: `${orden.moto?.marca || ''} ${orden.moto?.modelo || ''}`.trim(),
          cliente: orden.moto?.cliente?.nombre || 'Cliente por registrar',
          servicio: `${orden.servicios?.length || 0} servicio(s)` ,
          diasRestantes,
          tiempoLabel: diasRestantes <= 0 ? 'Entrega hoy' : `${diasRestantes} día(s)`
        };
      })
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
      .slice(0, 4);
  }, [ordenes]);

  const proximosMantenimientos = useMemo(() => {
    return ordenes
      .filter((orden) => orden.estado === 'completado' || orden.estado === 'entregado')
      .slice(0, 4)
      .map((orden) => ({
        cliente: orden.moto?.cliente?.nombre || 'Cliente por registrar',
        moto: `${orden.moto?.marca || ''} ${orden.moto?.modelo || ''}`.trim(),
        fecha: orden.fecha_entrega_estimada,
        servicio: `${orden.servicios?.length || 0} servicio(s)`
      }));
  }, [ordenes]);

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
            {urgentes.length === 0 ? (
              <p className="text-sm text-gray-600">Sin órdenes en curso. Crea una nueva orden para empezar.</p>
            ) : (
              urgentes.map((trabajo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{trabajo.moto || 'Moto por registrar'}</p>
                    <p className="text-sm text-gray-600">{trabajo.cliente} • {trabajo.servicio}</p>
                  </div>
                  <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                    {trabajo.tiempoLabel}
                  </span>
                </div>
              ))
            )}
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
            {proximosMantenimientos.length === 0 ? (
              <p className="text-sm text-gray-600">Registra y entrega órdenes para ver los próximos mantenimientos.</p>
            ) : (
              proximosMantenimientos.map((mantenimiento, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-gray-900">{mantenimiento.cliente}</p>
                    <p className="text-sm text-gray-600">{mantenimiento.moto} • {mantenimiento.servicio}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {mantenimiento.fecha ? new Date(mantenimiento.fecha).toLocaleDateString('es-ES') : 'Fecha por definir'}
                  </span>
                </div>
              ))
            )}
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