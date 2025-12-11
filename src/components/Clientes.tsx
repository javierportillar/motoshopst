import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserPlus, Search, Phone, Mail, MapPin, Bike as Motorcycle, Clock, ClipboardList, Plus } from 'lucide-react';
import { Cliente, Moto, OrdenTrabajo } from '../types';
import { ensureSupabaseSession, supabase } from '../lib/supabaseClient';

interface ClienteRegistro {
  cliente: Cliente;
  motos: Moto[];
  ultimaOrden?: OrdenTrabajo;
}

interface ClienteFormState {
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  direccion: string;
  motoMarca: string;
  motoModelo: string;
  motoPlaca: string;
  motoColor: string;
  motoKilometraje: number;
  motoAnio: number;
}

const STORAGE_ORDENES = 'ordenes';

const Clientes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientesExtras, setClientesExtras] = useState<ClienteRegistro[]>([]);
  const [ordenesRegistradas, setOrdenesRegistradas] = useState<OrdenTrabajo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formState, setFormState] = useState<ClienteFormState>({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    direccion: '',
    motoMarca: '',
    motoModelo: '',
    motoPlaca: '',
    motoColor: '',
    motoKilometraje: 0,
    motoAnio: new Date().getFullYear()
  });

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

      setClientesExtras(registros);
    } catch (error) {
      console.error('No se pudieron cargar los clientes desde Supabase', error);
    }
  }, []);

  useEffect(() => {
    void cargarClientes();
  }, [cargarClientes]);

  useEffect(() => {
    try {
      const storedOrdenes = localStorage.getItem(STORAGE_ORDENES);
      if (storedOrdenes) {
        setOrdenesRegistradas(JSON.parse(storedOrdenes));
      }
    } catch (error) {
      console.error('No se pudieron cargar las órdenes guardadas', error);
    }
  }, []);

  const clientesDesdeOrdenes = useMemo(() => {
    const map = new Map<string, ClienteRegistro>();

    ordenesRegistradas.forEach((orden) => {
      const clienteOrden = orden.moto?.cliente;
      if (!clienteOrden || !orden.moto) return;

      const existente = map.get(clienteOrden.id) || { cliente: clienteOrden, motos: [], ultimaOrden: undefined };
      const motoExiste = existente.motos.some((m) => m.id === orden.moto?.id);
      if (!motoExiste && orden.moto) {
        existente.motos.push(orden.moto);
      }

      if (!existente.ultimaOrden || new Date(orden.created_at) > new Date(existente.ultimaOrden.created_at)) {
        existente.ultimaOrden = orden;
      }

      map.set(clienteOrden.id, existente);
    });

    return Array.from(map.values());
  }, [ordenesRegistradas]);

  const clientes = useMemo(() => {
    const map = new Map<string, ClienteRegistro>();

    [...clientesDesdeOrdenes, ...clientesExtras].forEach((registro) => {
      const existente = map.get(registro.cliente.id);
      if (existente) {
        const motos = [...existente.motos];
        registro.motos.forEach((m) => {
          if (!motos.some((mt) => mt.id === m.id)) {
            motos.push(m);
          }
        });
        const ultimaOrden = existente.ultimaOrden || registro.ultimaOrden;
        map.set(registro.cliente.id, { ...existente, motos, ultimaOrden });
      } else {
        map.set(registro.cliente.id, registro);
      }
    });

    return Array.from(map.values()).sort((a, b) => a.cliente.nombre.localeCompare(b.cliente.nombre));
  }, [clientesDesdeOrdenes, clientesExtras]);

  const filteredClientes = useMemo(() => {
    if (!searchTerm) return clientes;
    const term = searchTerm.toLowerCase();

    return clientes.filter(({ cliente, motos }) => {
      const coincideCliente =
        cliente.nombre.toLowerCase().includes(term) ||
        cliente.cedula.toLowerCase().includes(term) ||
        cliente.telefono.toLowerCase().includes(term);

      const coincideMoto = motos.some(
        (moto) =>
          moto.placa.toLowerCase().includes(term) ||
          `${moto.marca} ${moto.modelo}`.toLowerCase().includes(term)
      );

      return coincideCliente || coincideMoto;
    });
  }, [clientes, searchTerm]);

  const handleSubmitCliente = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await ensureSupabaseSession();

      const { data: clienteInsertado, error: clienteError } = await supabase
        .from('clientes')
        .insert({
          nombre: formState.nombre,
          telefono: formState.telefono,
          email: formState.email || null,
          cedula: formState.cedula,
          direccion: formState.direccion || null
        })
        .select('id, nombre, telefono, email, cedula, direccion, created_at')
        .single();

      if (clienteError) {
        throw clienteError;
      }

      const { data: motoInsertada, error: motoError } = await supabase
        .from('motos')
        .insert({
          cliente_id: clienteInsertado.id,
          marca: formState.motoMarca,
          modelo: formState.motoModelo,
          anio: formState.motoAnio,
          placa: formState.motoPlaca.toUpperCase(),
          kilometraje: formState.motoKilometraje,
          color: formState.motoColor
        })
        .select('id, cliente_id, marca, modelo, anio, placa, kilometraje, color, created_at')
        .single();

      if (motoError) {
        throw motoError;
      }

      const nuevoCliente: Cliente = {
        id: clienteInsertado.id,
        nombre: clienteInsertado.nombre,
        telefono: clienteInsertado.telefono,
        email: clienteInsertado.email || undefined,
        cedula: clienteInsertado.cedula,
        direccion: clienteInsertado.direccion || undefined,
        created_at: clienteInsertado.created_at
      };

      const nuevaMoto: Moto = {
        id: motoInsertada.id,
        cliente_id: motoInsertada.cliente_id,
        marca: motoInsertada.marca,
        modelo: motoInsertada.modelo,
        año: motoInsertada.anio,
        placa: motoInsertada.placa,
        kilometraje: motoInsertada.kilometraje,
        color: motoInsertada.color,
        created_at: motoInsertada.created_at
      };

      const nuevoRegistro: ClienteRegistro = {
        cliente: nuevoCliente,
        motos: [nuevaMoto]
      };

      setClientesExtras((prev) => [...prev, nuevoRegistro]);
      setShowForm(false);
      setFormState({
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        direccion: '',
        motoMarca: '',
        motoModelo: '',
        motoPlaca: '',
        motoColor: '',
        motoKilometraje: 0,
        motoAnio: new Date().getFullYear()
      });
    } catch (error) {
      console.error('No se pudo registrar el cliente', error);
    } finally {
      setIsSaving(false);
    }
  };

  const totalMotos = clientes.reduce((acc, registro) => acc + registro.motos.length, 0);
  const clientesConMantenimiento = clientes.filter((c) => c.ultimaOrden).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600 mt-1">Gestión de clientes y motos registradas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <UserPlus className="h-5 w-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes activos</p>
              <p className="text-2xl font-semibold text-gray-900">{clientes.length}</p>
            </div>
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Motos registradas</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMotos}</p>
            </div>
            <Motorcycle className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Últimas órdenes</p>
              <p className="text-2xl font-semibold text-gray-900">{clientesConMantenimiento}</p>
            </div>
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cédula, placa o modelo"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClientes.map(({ cliente, motos, ultimaOrden }) => (
          <div key={cliente.id} className="bg-white border rounded-lg p-4 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <h3 className="text-xl font-semibold text-gray-900">{cliente.nombre}</h3>
                <p className="text-sm text-gray-600">Cédula: {cliente.cedula}</p>
              </div>
              <div className="flex space-x-2 text-gray-500">
                {cliente.telefono && (
                  <a href={`tel:${cliente.telefono}`} className="hover:text-blue-600" title="Llamar">
                    <Phone className="h-5 w-5" />
                  </a>
                )}
                {cliente.email && (
                  <a href={`mailto:${cliente.email}`} className="hover:text-blue-600" title="Enviar correo">
                    <Mail className="h-5 w-5" />
                  </a>
                )}
                {cliente.direccion && <MapPin className="h-5 w-5" title="Dirección" />}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Motos</p>
              <div className="space-y-2">
                {motos.map((moto) => (
                  <div key={moto.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <div>
                      <p className="font-medium text-gray-900">{moto.marca} {moto.modelo}</p>
                      <p className="text-sm text-gray-600">Placa {moto.placa} • {moto.kilometraje.toLocaleString()} km</p>
                    </div>
                    <span className="text-xs text-gray-500">Año {moto.año}</span>
                  </div>
                ))}
              </div>
            </div>

            {ultimaOrden && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Última orden</span>
                  </div>
                  <span className="text-blue-900 font-semibold">{ultimaOrden.estado.replace('_', ' ')}</span>
                </div>
                <p className="text-blue-900 mt-1">{new Date(ultimaOrden.created_at).toLocaleDateString('es-ES')}</p>
                <p className="text-blue-900">Total: ${ultimaOrden.total.toLocaleString('es-CO')}</p>
              </div>
            )}
          </div>
        ))}

        {filteredClientes.length === 0 && (
          <div className="bg-white border rounded-lg p-6 text-center text-gray-600 col-span-2">
            No se encontraron clientes con los criterios de búsqueda.
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Registrar nuevo cliente</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmitCliente} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    required
                    value={formState.nombre}
                    onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
                  <input
                    required
                    value={formState.cedula}
                    onChange={(e) => setFormState({ ...formState, cedula: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    required
                    value={formState.telefono}
                    onChange={(e) => setFormState({ ...formState, telefono: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    value={formState.direccion}
                    onChange={(e) => setFormState({ ...formState, direccion: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Motorcycle className="h-5 w-5 text-blue-600" />
                  <p className="font-medium text-gray-900">Datos de la moto</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                    <input
                      required
                      value={formState.motoMarca}
                      onChange={(e) => setFormState({ ...formState, motoMarca: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                    <input
                      required
                      value={formState.motoModelo}
                      onChange={(e) => setFormState({ ...formState, motoModelo: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                    <input
                      required
                      value={formState.motoPlaca}
                      onChange={(e) => setFormState({ ...formState, motoPlaca: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="ABC123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje *</label>
                    <input
                      required
                      type="number"
                      min={0}
                      value={formState.motoKilometraje}
                      onChange={(e) => setFormState({ ...formState, motoKilometraje: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      value={formState.motoColor}
                      onChange={(e) => setFormState({ ...formState, motoColor: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                    <input
                      required
                      type="number"
                      min={1990}
                      max={new Date().getFullYear() + 1}
                      value={formState.motoAnio}
                      onChange={(e) => setFormState({ ...formState, motoAnio: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Guardando...' : 'Guardar cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
