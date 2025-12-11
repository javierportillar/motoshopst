import React, { useMemo, useState } from 'react';
import { Calendar, Bell, Phone, Clock, AlertTriangle, CheckCircle, Filter, Check, X } from 'lucide-react';

type WeekFilterOption = 'esta' | 'proxima' | 'todas';

type Novedad = {
  id: string;
  cliente: string;
  telefono: string;
  moto: string;
  placa: string;
  servicio: string;
  ultimoServicio: string;
  fechaContacto: string;
  prioridad: 'alta' | 'media' | 'baja';
  contactado: boolean;
  interes?: 'si' | 'no';
  nota?: string;
};

type EventoHistorial = {
  fecha: string;
  descripcion: string;
  observaciones?: string;
};

type MantenimientoProgramado = {
  id: string;
  cliente: string;
  moto: string;
  placa: string;
  servicio: string;
  proximoMantenimiento: string;
  kilometrajeActual: number;
  kilometrajeProximo: number;
  diasRestantes: number;
  historial: EventoHistorial[];
  citaProgramada?: {
    fecha: string;
    nota?: string;
  };
};

const MantenimientoPreventivo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'novedades' | 'programados'>('novedades');
  const [filterWeek, setFilterWeek] = useState<WeekFilterOption>('esta');
  const [novedadesData, setNovedadesData] = useState<Novedad[]>([
    {
      id: '1',
      cliente: 'Carlos Pérez',
      telefono: '300-123-4567',
      moto: 'Honda CB 160F',
      placa: 'ABC123',
      servicio: 'Cambio de aceite',
      ultimoServicio: '2024-11-15',
      fechaContacto: '2025-01-13',
      prioridad: 'alta',
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
      prioridad: 'media',
      contactado: true,
      interes: 'si',
      nota: 'Quiere agendar la próxima semana'
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
      prioridad: 'alta',
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
      prioridad: 'alta',
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
      prioridad: 'media',
      contactado: true,
      interes: 'no',
      nota: 'Prefiere esperar hasta el próximo mes'
    }
  ]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [contactNotes, setContactNotes] = useState<Record<string, { nota: string; interes: 'si' | 'no' | '' }>>({});
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<MantenimientoProgramado | null>(null);
  const [modalAction, setModalAction] = useState<'programar' | 'historial' | null>(null);
  const [citaFecha, setCitaFecha] = useState('');
  const [citaNota, setCitaNota] = useState('');
  const [agendando, setAgendando] = useState(false);
  const [mantenimientosProgramados, setMantenimientosProgramados] = useState<MantenimientoProgramado[]>([
    {
      id: '1',
      cliente: 'Sandra Ruiz',
      moto: 'KTM 200 Duke',
      placa: 'PQR678',
      servicio: 'Mantenimiento 5.000 km',
      proximoMantenimiento: '2025-01-20',
      kilometrajeActual: 4800,
      kilometrajeProximo: 5000,
      diasRestantes: 8,
      historial: [
        { fecha: '2024-08-18', descripcion: 'Ajuste de válvulas y torque de culata' },
        { fecha: '2024-10-12', descripcion: 'Cambio de líquido de frenos', observaciones: 'Se usó DOT 4' }
      ]
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
      diasRestantes: 13,
      historial: [
        { fecha: '2024-07-02', descripcion: 'Cambio de kit de arrastre', observaciones: 'Se ajustó tensión' },
        { fecha: '2024-11-05', descripcion: 'Cambio de aceite y filtro' }
      ]
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
      diasRestantes: 20,
      historial: [
        { fecha: '2024-06-15', descripcion: 'Revisión de frenos' },
        { fecha: '2024-09-20', descripcion: 'Ajuste de suspensión delantera', observaciones: 'Se cambiaron retenedores' }
      ]
    }
  ]);

  const handleFilterWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === 'esta' || value === 'proxima' || value === 'todas') {
      setFilterWeek(value);
    }
  };

  const abrirProgramarCita = (mantenimiento: MantenimientoProgramado) => {
    setSelectedMantenimiento(mantenimiento);
    setModalAction('programar');
    setCitaFecha(mantenimiento.citaProgramada?.fecha || mantenimiento.proximoMantenimiento);
    setCitaNota(mantenimiento.citaProgramada?.nota || '');
  };

  const abrirHistorial = (mantenimiento: MantenimientoProgramado) => {
    setSelectedMantenimiento(mantenimiento);
    setModalAction('historial');
  };

  const cerrarModal = () => {
    setSelectedMantenimiento(null);
    setModalAction(null);
    setCitaFecha('');
    setCitaNota('');
    setAgendando(false);
  };

  const confirmarCita = () => {
    if (!selectedMantenimiento || !citaFecha) return;
    setAgendando(true);
    setMantenimientosProgramados((prev) =>
      prev.map((mantenimiento) =>
        mantenimiento.id === selectedMantenimiento.id
          ? {
              ...mantenimiento,
              proximoMantenimiento: citaFecha,
              citaProgramada: {
                fecha: citaFecha,
                nota: citaNota.trim() || undefined
              }
            }
          : mantenimiento
      )
    );
    setAgendando(false);
    cerrarModal();
  };


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
    setActiveContactId(id);
    setContactNotes((prev) => ({
      ...prev,
      [id]: prev[id] ?? { nota: '', interes: '' }
    }));
  };

  const guardarContacto = (id: string) => {
    const notas = contactNotes[id];
    if (!notas?.interes) return;

    setNovedadesData((prev) =>
      prev.map((novedad) =>
        novedad.id === id
          ? {
              ...novedad,
              contactado: true,
              nota: notas.nota.trim() ? notas.nota.trim() : undefined,
              interes: notas.interes === 'si' ? 'si' : 'no'
            }
          : novedad
      )
    );
    setActiveContactId(null);
  };

  const filteredNovedades = useMemo(
    () =>
      novedadesData.filter((novedad) => {
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
      }),
    [filterWeek, novedadesData]
  );

  const pendientesContactar = filteredNovedades.filter((n) => !n.contactado).length;

  return (
    <>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            {filteredNovedades.map((novedad) => {
              const notas = contactNotes[novedad.id] ?? { nota: '', interes: '' };
              return (
                <div key={novedad.id} className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{novedad.cliente}</h3>
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            novedad.prioridad
                          )}`}
                        >
                          {getPriorityIcon(novedad.prioridad)}
                          <span className="capitalize">{novedad.prioridad}</span>
                        </span>
                        {novedad.contactado && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="h-3 w-3" /> Contactado
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p>
                            <span className="font-medium">Moto:</span> {novedad.moto} ({novedad.placa})
                          </p>
                          <p>
                            <span className="font-medium">Servicio:</span> {novedad.servicio}
                          </p>
                        </div>
                        <div>
                          <p>
                            <span className="font-medium">Último servicio:</span>{' '}
                            {new Date(novedad.ultimoServicio).toLocaleDateString('es-ES')}
                          </p>
                          <p>
                            <span className="font-medium">Contactar:</span> {new Date(novedad.fechaContacto).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>

                      {novedad.contactado && (
                        <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-900">
                          <p className="font-medium">Interés: {novedad.interes === 'si' ? 'Sí quiere volver' : 'No está interesado'}</p>
                          {novedad.nota && <p className="mt-1 text-green-800">Nota: {novedad.nota}</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                      <a
                        href={`tel:${novedad.telefono}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors duration-200"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{novedad.telefono}</span>
                      </a>

                      {!novedad.contactado && activeContactId !== novedad.id && (
                        <button
                          onClick={() => marcarComoContactado(novedad.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Marcar Contactado
                        </button>
                      )}
                    </div>
                  </div>

                  {!novedad.contactado && activeContactId === novedad.id && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-medium text-gray-900">Registrar contacto</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>¿Interesado en volver?</span>
                          <div className="flex gap-2">
                            {(['si', 'no'] as const).map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  setContactNotes((prev) => ({
                                    ...prev,
                                    [novedad.id]: { ...notas, interes: option }
                                  }))
                                }
                                className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                                  notas.interes === option
                                    ? option === 'si'
                                      ? 'bg-green-600 text-white border-green-600'
                                      : 'bg-red-600 text-white border-red-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {option === 'si' ? 'Sí' : 'No'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notas del contacto</label>
                        <textarea
                          value={notas.nota}
                          onChange={(e) =>
                            setContactNotes((prev) => ({
                              ...prev,
                              [novedad.id]: { ...notas, nota: e.target.value }
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          rows={3}
                          placeholder="Ej: Acordamos volver a llamar el lunes"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <button
                          onClick={() => setActiveContactId(null)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => guardarContacto(novedad.id)}
                          disabled={!notas.interes}
                          className={`px-4 py-2 rounded-lg text-sm text-white transition-colors ${
                            notas.interes
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-green-300 cursor-not-allowed'
                          }`}
                        >
                          Guardar contacto
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mantenimiento.diasRestantes <= 7
                            ? 'bg-red-100 text-red-800'
                            : mantenimiento.diasRestantes <= 14
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {mantenimiento.diasRestantes} días restantes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p>
                          <span className="font-medium">Moto:</span> {mantenimiento.moto} ({mantenimiento.placa})
                        </p>
                        <p>
                          <span className="font-medium">Servicio:</span> {mantenimiento.servicio}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Fecha programada:</span>{' '}
                          {new Date(mantenimiento.proximoMantenimiento).toLocaleDateString('es-ES')}
                        </p>
                        <p>
                          <span className="font-medium">Kilometraje:</span> {mantenimiento.kilometrajeActual.toLocaleString()}/{
                            ' '
                          }
                          {mantenimiento.kilometrajeProximo.toLocaleString()} km
                        </p>
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
                            mantenimiento.kilometrajeActual / mantenimiento.kilometrajeProximo >= 0.9
                              ? 'bg-red-500'
                              : mantenimiento.kilometrajeActual / mantenimiento.kilometrajeProximo >= 0.7
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              (mantenimiento.kilometrajeActual / mantenimiento.kilometrajeProximo) * 100,
                              100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => abrirProgramarCita(mantenimiento)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      Programar Cita
                    </button>
                    <button
                      onClick={() => abrirHistorial(mantenimiento)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      Ver Historial
                    </button>
                  </div>
                </div>

                {mantenimiento.citaProgramada && (
                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                    <p className="font-medium">
                      Cita programada para {new Date(mantenimiento.citaProgramada.fecha).toLocaleDateString('es-ES')}
                    </p>
                    {mantenimiento.citaProgramada.nota && (
                      <p className="mt-1 text-blue-800">{mantenimiento.citaProgramada.nota}</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {mantenimientosProgramados.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay mantenimientos programados</h3>
                <p className="mt-1 text-sm text-gray-500">Todos los mantenimientos están al día.</p>
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {modalAction && selectedMantenimiento && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  {selectedMantenimiento.cliente} • {selectedMantenimiento.moto} ({selectedMantenimiento.placa})
                </p>
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalAction === 'programar' ? 'Programar cita' : 'Historial de mantenimiento'}
                </h3>
              </div>
              <button
                onClick={cerrarModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalAction === 'programar' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Servicio:</span> {selectedMantenimiento.servicio}
                  </p>
                  <p>
                    <span className="font-medium">Fecha sugerida:</span>{' '}
                    {new Date(selectedMantenimiento.proximoMantenimiento).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de la cita</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={citaFecha}
                    onChange={(e) => setCitaFecha(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas para el equipo</label>
                  <textarea
                    value={citaNota}
                    onChange={(e) => setCitaNota(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    rows={3}
                    placeholder="Ej: Confirmar disponibilidad de repuestos o preferencia de horario"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={cerrarModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarCita}
                    disabled={agendando || !citaFecha}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {agendando ? 'Guardando...' : 'Guardar cita'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedMantenimiento.historial.length > 0 ? (
                  [...selectedMantenimiento.historial]
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map((evento) => (
                      <div
                        key={`${selectedMantenimiento.id}-${evento.fecha}-${evento.descripcion}`}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <p className="text-sm text-gray-500">
                          {new Date(evento.fecha).toLocaleDateString('es-ES')}
                        </p>
                        <p className="font-medium text-gray-900">{evento.descripcion}</p>
                        {evento.observaciones && (
                          <p className="text-sm text-gray-700 mt-1">{evento.observaciones}</p>
                        )}
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-600">Aún no hay historial registrado para este mantenimiento.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MantenimientoPreventivo;
