import React, { useState } from 'react';
import { Calendar, Bell, Phone, Clock, AlertTriangle, CheckCircle, Filter } from 'lucide-react';

type WeekFilterOption = 'esta' | 'proxima' | 'todas';

const MantenimientoPreventivo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'novedades' | 'programados'>('novedades');
  const [filterWeek, setFilterWeek] = useState<WeekFilterOption>('esta');

  const handleFilterWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === 'esta' || value === 'proxima' || value === 'todas') {
      setFilterWeek(value);
    }
  };

  // Mock data for maintenance notifications
  const novedades = [
    {
      id: '1',
      cliente: 'Carlos Pérez',
      telefono: '300-123-4567',
      moto: 'Honda CB 160F',
      placa: 'ABC123',
      servicio: 'Cambio de aceite',
      ultimoServicio: '2024-11-15',
      fechaContacto: '2025-01-13',
      prioridad: 'alta' as const,
      contactado: false
    },
    {
      id: '2',
      cliente: 'Ana García',
      telefono: '301-234-5678',
      moto: 'Yamaha FZ16',
      placa: 'DEF456',
      servicio: 'Mantenimiento 10.000 km',
      ultimoServicio: '2024-10-20',
      fechaContacto: '2025-01-14',
      prioridad: 'media' as const,
      contactado: true
    },
    {
      id: '3',
      cliente: 'Luis Rojas',
      telefono: '302-345-6789',
      moto: 'Suzuki GN125',
      placa: 'GHI789',
      servicio: 'Revisión de frenos',
      ultimoServicio: '2024-12-01',
      fechaContacto: '2025-01-15',
      prioridad: 'alta' as const,
      contactado: false
    },
    {
      id: '4',
      cliente: 'María López',
      telefono: '303-456-7890',
      moto: 'Honda XR 150L',
      placa: 'JKL012',
      servicio: 'Calibración de válvula',
      ultimoServicio: '2024-09-10',
      fechaContacto: '2025-01-16',
      prioridad: 'alta' as const,
      contactado: false
    },
    {
      id: '5',
      cliente: 'Pedro Silva',
      telefono: '304-567-8901',
      moto: 'Yamaha YBR 125',
      placa: 'MNO345',
      servicio: 'Cambio de cadena',
      ultimoServicio: '2024-11-25',
      fechaContacto: '2025-01-18',
      prioridad: 'media' as const,
      contactado: true
    }
  ];

  // Mock data for scheduled maintenance
  const mantenimientosProgramados = [
    {
      id: '1',
      cliente: 'Sandra Ruiz',
      moto: 'KTM 200 Duke',
      placa: 'PQR678',
      servicio: 'Mantenimiento 5.000 km',
      proximoMantenimiento: '2025-01-20',
      kilometrajeActual: 4800,
      kilometrajeProximo: 5000,
      diasRestantes: 8
    },
    {
      id: '2',
      cliente: 'Roberto Gómez',
      moto: 'Honda CB 125F',
      placa: 'STU901',
      servicio: 'Cambio de aceite',
      proximoMantenimiento: '2025-01-25',
      kilometrajeActual: 8900,
      kilometrajeProximo: 9000,
      diasRestantes: 13
    },
    {
      id: '3',
      cliente: 'Carmen Torres',
      moto: 'Yamaha Crypton',
      placa: 'VWX234',
      servicio: 'Revisión general',
      proximoMantenimiento: '2025-02-01',
      kilometrajeActual: 12000,
      kilometrajeProximo: 12500,
      diasRestantes: 20
    }
  ];

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return <AlertTriangle className="h-4 w-4" />;
      case 'media':
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const marcarComoContactado = (id: string) => {
    // Aquí se actualizaría el estado en la base de datos
    console.log(`Marcando como contactado: ${id}`);
  };

  const filteredNovedades = novedades.filter(novedad => {
    if (filterWeek === 'todas') return true;
    
    const fechaContacto = new Date(novedad.fechaContacto);
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    
    const inicioProximaSemana = new Date(finSemana);
    inicioProximaSemana.setDate(finSemana.getDate() + 1);
    const finProximaSemana = new Date(inicioProximaSemana);
    finProximaSemana.setDate(inicioProximaSemana.getDate() + 6);

    if (filterWeek === 'esta') {
      return fechaContacto >= inicioSemana && fechaContacto <= finSemana;
    } else if (filterWeek === 'proxima') {
      return fechaContacto >= inicioProximaSemana && fechaContacto <= finProximaSemana;
    }
    
    return true;
  });

  const pendientesContactar = filteredNovedades.filter(n => !n.contactado).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mantenimiento Preventivo</h2>
        <p className="text-gray-600 mt-1">Seguimiento y notificaciones de mantenimiento</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('novedades')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'novedades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Novedades</span>
              {pendientesContactar > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {pendientesContactar}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('programados')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'programados'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Mantenimientos Programados</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Novedades Tab */}
      {activeTab === 'novedades' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterWeek}
                  onChange={handleFilterWeekChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="esta">Esta semana</option>
                  <option value="proxima">Próxima semana</option>
                  <option value="todas">Todas</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{pendientesContactar}</span> clientes pendientes por contactar
              </div>
            </div>
          </div>

          {/* Lista de Novedades */}
          <div className="grid gap-4">
            {filteredNovedades.map((novedad) => (
              <div key={novedad.id} className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{novedad.cliente}</h3>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(novedad.prioridad)}`}>
                        {getPriorityIcon(novedad.prioridad)}
                        <span className="capitalize">{novedad.prioridad}</span>
                      </span>
                      {novedad.contactado && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Contactado
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Moto:</span> {novedad.moto} ({novedad.placa})</p>
                        <p><span className="font-medium">Servicio:</span> {novedad.servicio}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Último servicio:</span> {new Date(novedad.ultimoServicio).toLocaleDateString('es-ES')}</p>
                        <p><span className="font-medium">Contactar:</span> {new Date(novedad.fechaContacto).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <a
                      href={`tel:${novedad.telefono}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors duration-200"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{novedad.telefono}</span>
                    </a>
                    
                    {!novedad.contactado && (
                      <button
                        onClick={() => marcarComoContactado(novedad.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        Marcar Contactado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredNovedades.length === 0 && (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay novedades</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No hay clientes para contactar en el período seleccionado.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mantenimientos Programados Tab */}
      {activeTab === 'programados' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {mantenimientosProgramados.map((mantenimiento) => (
              <div key={mantenimiento.id} className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{mantenimiento.cliente}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mantenimiento.diasRestantes <= 7 
                          ? 'bg-red-100 text-red-800' 
                          : mantenimiento.diasRestantes <= 14
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {mantenimiento.diasRestantes} días restantes
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Moto:</span> {mantenimiento.moto} ({mantenimiento.placa})</p>
                        <p><span className="font-medium">Servicio:</span> {mantenimiento.servicio}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Fecha programada:</span> {new Date(mantenimiento.proximoMantenimiento).toLocaleDateString('es-ES')}</p>
                        <p><span className="font-medium">Kilometraje:</span> {mantenimiento.kilometrajeActual.toLocaleString()} / {mantenimiento.kilometrajeProximo.toLocaleString()} km</p>
                      </div>
                    </div>

                    {/* Progress bar for kilometraje */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso de kilometraje</span>
                        <span>{Math.round((mantenimiento.kilometrajeActual / mantenimiento.kilometrajeProximo) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (mantenimiento.kilometrajeActual / mantenimiento.kilometrajeProximo) >= 0.9
                              ? 'bg-red-500'
                              : (mantenimiento.kilometrajeActual / mantenimiento.kilometrajeProximo) >= 0.7
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((mantenimiento.kilometrajeActual / mantenimiento.kilometrajeProximo) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                      Programar Cita
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                      Ver Historial
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {mantenimientosProgramados.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay mantenimientos programados</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Todos los mantenimientos están al día.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MantenimientoPreventivo;