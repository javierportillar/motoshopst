import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Trash2, User, Recycle as Motorcycle, Wrench, Clock3 } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type {
  Cliente as ClienteType,
  Moto as MotoType,
  OrdenTrabajo as OrdenTrabajoType,
  Mecanico,
  Servicio
} from '../types';
import { useServicios } from '../context/ServiciosContext';
import { ensureSupabaseSession, supabase } from '../lib/supabaseClient';

interface FormularioOrdenProps {
  onClose: () => void;
  onSubmit: (orden: OrdenTrabajoType) => void;
  ordenEdicion?: OrdenTrabajoType | null;
}

interface ClienteRegistro {
  cliente: ClienteType;
  motos: MotoType[];
}

const STORAGE_MECANICOS = 'mecanicos';

const FormularioOrden: React.FC<FormularioOrdenProps> = ({ onClose, onSubmit, ordenEdicion }) => {
  const { categorias, servicios } = useServicios();
  const [currentStep, setCurrentStep] = useState(1);

  const [clientesGuardados, setClientesGuardados] = useState<ClienteRegistro[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteRegistro | null>(null);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [mecanicoId, setMecanicoId] = useState('');
  const [valorManoObra, setValorManoObra] = useState(0);

  // Estado del cliente
  const [cliente, setCliente] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  // Estado de la moto
  const [moto, setMoto] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    placa: '',
    kilometraje: 0,
    color: ''
  });

  const [motoSeleccionadaId, setMotoSeleccionadaId] = useState('');

  // Estado de los servicios seleccionados
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<{
    servicio_id: string;
    precio: number;
    observaciones: string;
  }[]>([]);

  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState('');

  type MotoRow = {
    id: string;
    cliente_id: string;
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
    kilometraje: number;
    color: string;
    created_at: string;
  };

  type ClienteRow = {
    id: string;
    nombre: string;
    telefono: string;
    email: string | null;
    cedula: string;
    direccion: string | null;
    created_at: string;
    motos: MotoRow[] | null;
  };

  const cargarClientes = useCallback(async () => {
    try {
      await ensureSupabaseSession();

      const { data, error } = await supabase
        .from('clientes')
        .select(
          'id, nombre, telefono, email, cedula, direccion, created_at, motos(id, cliente_id, marca, modelo, anio, placa, kilometraje, color, created_at)'
        )
        .order('nombre');

      if (error) {
        throw error;
      }

      const registros: ClienteRegistro[] = (data || []).map((cliente: ClienteRow) => ({
        cliente: {
          id: cliente.id,
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          email: cliente.email || undefined,
          cedula: cliente.cedula,
          direccion: cliente.direccion || undefined,
          created_at: cliente.created_at
        },
        motos: (cliente.motos || []).map((moto) => ({
          id: moto.id,
          cliente_id: moto.cliente_id,
          marca: moto.marca,
          modelo: moto.modelo,
          año: moto.anio,
          placa: moto.placa,
          kilometraje: moto.kilometraje,
          color: moto.color,
          created_at: moto.created_at
        }))
      }));

      setClientesGuardados(registros);
    } catch (error) {
      console.error('No se pudieron cargar clientes desde Supabase', error);
    }
  }, []);

  useEffect(() => {
    void cargarClientes();
  }, [cargarClientes]);

  useEffect(() => {
    try {
      const storedMecanicos = localStorage.getItem(STORAGE_MECANICOS);
      if (storedMecanicos) {
        setMecanicos(JSON.parse(storedMecanicos));
        return;
      }

      const baseMecanicos: Mecanico[] = [
        {
          id: 'mec-1',
          nombre: 'Juan Torres',
          especialidad: 'Motor y diagnóstico',
          trabajos_realizados: 0,
          balance_mano_obra: 0,
          updated_at: new Date().toISOString()
        },
        {
          id: 'mec-2',
          nombre: 'Laura Méndez',
          especialidad: 'Frenos y suspensión',
          trabajos_realizados: 0,
          balance_mano_obra: 0,
          updated_at: new Date().toISOString()
        }
      ];

      setMecanicos(baseMecanicos);
      localStorage.setItem(STORAGE_MECANICOS, JSON.stringify(baseMecanicos));
    } catch (error) {
      console.error('No se pudieron cargar los mecánicos', error);
    }
  }, []);

  useEffect(() => {
    if (!ordenEdicion) return;

    setCliente({
      nombre: ordenEdicion.moto?.cliente?.nombre || '',
      cedula: ordenEdicion.moto?.cliente?.cedula || '',
      telefono: ordenEdicion.moto?.cliente?.telefono || '',
      email: ordenEdicion.moto?.cliente?.email || '',
      direccion: ordenEdicion.moto?.cliente?.direccion || ''
    });

    setMoto({
      marca: ordenEdicion.moto?.marca || '',
      modelo: ordenEdicion.moto?.modelo || '',
      año: ordenEdicion.moto?.año || new Date().getFullYear(),
      placa: ordenEdicion.moto?.placa || '',
      kilometraje: ordenEdicion.moto?.kilometraje || 0,
      color: ordenEdicion.moto?.color || ''
    });

    const serviciosPrevios =
      ordenEdicion.servicios?.map((s) => ({
        servicio_id: s.servicio_id,
        precio: s.precio,
        observaciones: s.observaciones || ''
      })) || [];

    setServiciosSeleccionados(serviciosPrevios);
    setObservacionesGenerales(ordenEdicion.observaciones || '');
    setFechaEntregaEstimada(ordenEdicion.fecha_entrega_estimada.split('T')[0]);
    setValorManoObra(ordenEdicion.mano_obra?.valor || 0);
    setMecanicoId(ordenEdicion.mano_obra?.mecanico_id || '');
  }, [ordenEdicion]);

  const agregarServicio = (servicioId: string) => {
    const servicio = servicios.find((s) => s.id === servicioId);
    if (servicio && !serviciosSeleccionados.find((s) => s.servicio_id === servicioId)) {
      setServiciosSeleccionados([
        ...serviciosSeleccionados,
        {
          servicio_id: servicioId,
          precio: servicio.precio_base,
          observaciones: ''
        }
      ]);
    }
  };

  const removerServicio = (servicioId: string) => {
    setServiciosSeleccionados(serviciosSeleccionados.filter((s) => s.servicio_id !== servicioId));
  };

  const actualizarPrecioServicio = (servicioId: string, precio: number) => {
    const precioSeguro = Number.isNaN(precio) || precio < 0 ? 0 : precio;
    setServiciosSeleccionados(
      serviciosSeleccionados.map((s) => (s.servicio_id === servicioId ? { ...s, precio: precioSeguro } : s))
    );
  };

  const actualizarObservacionServicio = (servicioId: string, observaciones: string) => {
    setServiciosSeleccionados(
      serviciosSeleccionados.map((s) => (s.servicio_id === servicioId ? { ...s, observaciones } : s))
    );
  };

  const calcularTotal = () => {
    return serviciosSeleccionados.reduce((total, s) => total + s.precio, 0) + (valorManoObra || 0);
  };

  const obtenerTextoRetorno = (servicioInfo?: Servicio) => {
    if (!servicioInfo?.retorno) return null;
    const { tipo, valor, unidad, nota } = servicioInfo.retorno;
    const unidadLabel = unidad === 'km' ? 'km' : unidad;
    const base = tipo === 'kilometraje'
      ? `Regresa en ${valor.toLocaleString('es-CO')} ${unidadLabel}`
      : `Regresa en ${valor} ${unidadLabel}`;

    return nota ? `${base} • ${nota}` : base;
  };

  const handleSubmit = () => {
    const timestamp = Date.now();
    const now = new Date();
    const createdAt = ordenEdicion?.created_at || now.toISOString();

    const clienteId = ordenEdicion?.moto?.cliente?.id || clienteSeleccionado?.cliente.id || `cliente-${timestamp}`;
    const motoId = ordenEdicion?.moto?.id || motoSeleccionadaId || `moto-${timestamp}`;
    const ordenId = ordenEdicion?.id || `orden-${timestamp}`;

    const nuevoCliente: ClienteType = {
      id: clienteId,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email || undefined,
      cedula: cliente.cedula,
      direccion: cliente.direccion || undefined,
      created_at: createdAt
    };

    const nuevaMoto: MotoType = {
      id: motoId,
      cliente_id: clienteId,
      cliente: nuevoCliente,
      marca: moto.marca,
      modelo: moto.modelo,
      año: moto.año,
      placa: moto.placa,
      kilometraje: moto.kilometraje,
      color: moto.color,
      created_at: createdAt
    };

    const fechaEntregaISO = new Date(`${fechaEntregaEstimada}T00:00:00`).toISOString();

    const serviciosOrden = serviciosSeleccionados.map((servicio) => ({
      servicio_id: servicio.servicio_id,
      precio: servicio.precio,
      observaciones: servicio.observaciones || undefined,
      completado: false
    }));

    const nuevaOrden: OrdenTrabajoType = {
      id: ordenId,
      moto_id: motoId,
      moto: nuevaMoto,
      fecha_ingreso: ordenEdicion?.fecha_ingreso || new Date().toISOString(),
      fecha_entrega_estimada: fechaEntregaISO,
      estado: ordenEdicion?.estado || 'pendiente',
      observaciones: observacionesGenerales || undefined,
      servicios: serviciosOrden,
      mano_obra: mecanicoId
        ? {
            mecanico_id: mecanicoId,
            mecanico_nombre: mecanicos.find((m) => m.id === mecanicoId)?.nombre || 'Pendiente',
            valor: valorManoObra
          }
        : undefined,
      total: calcularTotal(),
      created_at: createdAt
    };

    const actualizarBalanceMecanico = (id: string, delta: number) => {
      if (!id || Number.isNaN(delta)) return;
      setMecanicos((prev) => {
        const actualizados = prev.map((mecanico) =>
          mecanico.id === id
            ? {
                ...mecanico,
                balance_mano_obra: mecanico.balance_mano_obra + delta,
                trabajos_realizados: mecanico.trabajos_realizados + (delta !== 0 ? 1 : 0),
                updated_at: new Date().toISOString()
              }
            : mecanico
        );
        localStorage.setItem(STORAGE_MECANICOS, JSON.stringify(actualizados));
        return actualizados;
      });
    };

    if (ordenEdicion?.mano_obra?.mecanico_id) {
      const delta = valorManoObra - (ordenEdicion.mano_obra?.valor || 0);
      actualizarBalanceMecanico(ordenEdicion.mano_obra.mecanico_id, delta);
      if (ordenEdicion.mano_obra.mecanico_id !== mecanicoId) {
        actualizarBalanceMecanico(mecanicoId, valorManoObra);
        actualizarBalanceMecanico(ordenEdicion.mano_obra.mecanico_id, -(ordenEdicion.mano_obra?.valor || 0));
      }
    } else {
      actualizarBalanceMecanico(mecanicoId, valorManoObra);
    }

    onSubmit(nuevaOrden);
    onClose();
  };

  const coincidenciasClientes = useMemo(() => {
    if (!cliente.nombre || cliente.nombre.length < 2) return [];
    const term = cliente.nombre.toLowerCase();
    return clientesGuardados.filter((registro) => registro.cliente.nombre.toLowerCase().includes(term));
  }, [cliente.nombre, clientesGuardados]);

  const aplicarCliente = (registro: ClienteRegistro) => {
    setCliente({
      nombre: registro.cliente.nombre,
      cedula: registro.cliente.cedula,
      telefono: registro.cliente.telefono,
      email: registro.cliente.email || '',
      direccion: registro.cliente.direccion || ''
    });
    setClienteSeleccionado(registro);
    if (registro.motos.length > 0) {
      const motoSeleccionada = registro.motos[0];
      setMoto({
        marca: motoSeleccionada.marca,
        modelo: motoSeleccionada.modelo,
        año: motoSeleccionada.año,
        placa: motoSeleccionada.placa,
        kilometraje: motoSeleccionada.kilometraje,
        color: motoSeleccionada.color || ''
      });
      setMotoSeleccionadaId(motoSeleccionada.id);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            value={cliente.nombre}
            onChange={(e) => {
              setCliente({ ...cliente, nombre: e.target.value });
              setClienteSeleccionado(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            list="clientes-registrados"
            placeholder="Escribe para buscar clientes guardados"
          />
          <datalist id="clientes-registrados">
            {clientesGuardados.map((registro) => (
              <option key={registro.cliente.id} value={registro.cliente.nombre} />
            ))}
          </datalist>
          {coincidenciasClientes.length > 0 && (
            <div className="mt-2 bg-gray-50 border rounded-lg p-2 space-y-1">
              <p className="text-xs text-gray-600">Selecciona un cliente registrado:</p>
              {coincidenciasClientes.map((registro) => (
                <button
                  key={registro.cliente.id}
                  type="button"
                  onClick={() => aplicarCliente(registro)}
                  className="w-full text-left px-2 py-1 rounded hover:bg-blue-50 text-sm"
                >
                  {registro.cliente.nombre} • {registro.cliente.cedula}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cédula *
          </label>
          <input
            type="text"
            value={cliente.cedula}
            onChange={(e) => setCliente({ ...cliente, cedula: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            value={cliente.telefono}
            onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={cliente.email}
            onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          type="text"
          value={cliente.direccion}
          onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Motorcycle className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Información de la Motocicleta</h3>
      </div>

      {clienteSeleccionado && clienteSeleccionado.motos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usar moto registrada
          </label>
          <select
            value={motoSeleccionadaId}
            onChange={(e) => {
              const seleccion = clienteSeleccionado.motos.find((m) => m.id === e.target.value);
              if (seleccion) {
                setMoto({
                  marca: seleccion.marca,
                  modelo: seleccion.modelo,
                  año: seleccion.año,
                  placa: seleccion.placa,
                  kilometraje: seleccion.kilometraje,
                  color: seleccion.color || ''
                });
                setMotoSeleccionadaId(seleccion.id);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar una moto</option>
            {clienteSeleccionado.motos.map((motoGuardada) => (
              <option key={motoGuardada.id} value={motoGuardada.id}>
                {motoGuardada.marca} {motoGuardada.modelo} • {motoGuardada.placa}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <input
            type="text"
            value={moto.marca}
            onChange={(e) => setMoto({ ...moto, marca: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Honda, Yamaha, Suzuki..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo *
          </label>
          <input
            type="text"
            value={moto.modelo}
            onChange={(e) => setMoto({ ...moto, modelo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="CB 160F, FZ16, GN125..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año *
          </label>
          <input
            type="number"
            value={moto.año}
            onChange={(e) => setMoto({ ...moto, año: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1990"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placa *
          </label>
          <input
            type="text"
            value={moto.placa}
            onChange={(e) => setMoto({ ...moto, placa: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ABC123"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kilometraje Actual *
          </label>
          <input
            type="number"
            value={moto.kilometraje}
            onChange={(e) => setMoto({ ...moto, kilometraje: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="text"
            value={moto.color}
            onChange={(e) => setMoto({ ...moto, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rojo, Azul, Negro..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Servicios a Realizar</h3>
        <span className="text-sm text-gray-500">
          Total: ${calcularTotal().toLocaleString('es-CO')}
        </span>
      </div>

      {/* Categorías de Servicios */}
      <div className="space-y-4">
        {categorias.map((categoria) => {
          const IconComponent = Icons[categoria.icono as keyof typeof Icons] as LucideIcon | undefined;
          const serviciosCategoria = servicios.filter((s) => s.categoria_id === categoria.id);

          return (
            <div key={categoria.id} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  {IconComponent && <IconComponent className="h-5 w-5" style={{ color: categoria.color }} />}
                  <h4 className="font-medium text-gray-900">{categoria.nombre}</h4>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviciosCategoria.map((servicio) => {
                    const isSelected = serviciosSeleccionados.find((s) => s.servicio_id === servicio.id);
                    const retornoTexto = obtenerTextoRetorno(servicio);

                    return (
                      <div
                        key={servicio.id}
                        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors duration-150 shadow-sm ${
                          isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              agregarServicio(servicio.id);
                            } else {
                              removerServicio(servicio.id);
                            }
                          }}
                          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <label className="text-sm font-semibold text-gray-800">{servicio.nombre}</label>
                              {servicio.descripcion && (
                                <p className="text-xs text-gray-500 leading-5">{servicio.descripcion}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 min-w-[110px]">
                              <span className="text-sm font-semibold text-gray-900">
                                ${servicio.precio_base.toLocaleString('es-CO')}
                              </span>
                              <span className="text-[11px] text-gray-500">Precio base</span>
                            </div>
                          </div>
                          {retornoTexto && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                              <Clock3 className="h-3 w-3" />
                              <span>{retornoTexto}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Servicios Seleccionados */}
      {serviciosSeleccionados.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Servicios Seleccionados</h4>
          <div className="space-y-3">
            {serviciosSeleccionados.map((servicio) => {
              const servicioInfo = servicios.find((s) => s.id === servicio.servicio_id);
              const retornoTexto = obtenerTextoRetorno(servicioInfo);

              return (
                <div key={servicio.servicio_id} className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{servicioInfo?.nombre}</p>
                      {servicioInfo?.descripcion && (
                        <p className="text-xs text-gray-500">{servicioInfo.descripcion}</p>
                      )}
                      {retornoTexto && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] text-blue-800">
                          <Clock3 className="h-3 w-3" />
                          <span>{retornoTexto}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-gray-600">Precio</label>
                      <input
                        type="number"
                        value={servicio.precio}
                        onChange={(e) => actualizarPrecioServicio(servicio.servicio_id, parseInt(e.target.value))}
                        className="w-28 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => removerServicio(servicio.servicio_id)}
                        className="text-red-500 hover:text-red-700"
                        title="Quitar servicio"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Notas</label>
                      <input
                        type="text"
                        value={servicio.observaciones}
                        onChange={(e) => actualizarObservacionServicio(servicio.servicio_id, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Notas específicas..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Finalizar Orden</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Entrega Estimada *
            </label>
            <input
              type="date"
              value={fechaEntregaEstimada}
              onChange={(e) => setFechaEntregaEstimada(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <p className="font-medium text-gray-900">Mano de obra obligatoria</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mecánico responsable *</label>
              <select
                value={mecanicoId}
                onChange={(e) => setMecanicoId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona un mecánico</option>
                {mecanicos.map((mecanico) => (
                  <option key={mecanico.id} value={mecanico.id}>
                    {mecanico.nombre} {mecanico.especialidad ? `• ${mecanico.especialidad}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor mano de obra *</label>
              <input
                type="number"
                value={valorManoObra}
                onChange={(e) => setValorManoObra(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={0}
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Resumen</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span>{cliente.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span>Moto:</span>
              <span>
                {moto.marca} {moto.modelo}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Servicios:</span>
              <span>{serviciosSeleccionados.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Mano de obra:</span>
              <span>${(valorManoObra || 0).toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between font-medium text-base border-t pt-1">
              <span>Total:</span>
              <span>${calcularTotal().toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones Generales
        </label>
        <textarea
          value={observacionesGenerales}
          onChange={(e) => setObservacionesGenerales(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Notas adicionales sobre el trabajo a realizar..."
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{ordenEdicion ? 'Editar Orden' : 'Nueva Orden de Trabajo'}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < 4 && <div className={`flex-1 h-1 mx-4 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg p-6 border">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose())}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          {currentStep === 1 ? 'Cancelar' : 'Anterior'}
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 1 && (!cliente.nombre || !cliente.cedula || !cliente.telefono)) ||
              (currentStep === 2 && (!moto.marca || !moto.modelo || !moto.placa)) ||
              (currentStep === 3 && serviciosSeleccionados.length === 0)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!fechaEntregaEstimada || serviciosSeleccionados.length === 0 || !mecanicoId || valorManoObra <= 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ordenEdicion ? 'Guardar cambios' : 'Crear Orden'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormularioOrden;
