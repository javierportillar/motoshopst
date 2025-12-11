import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Wrench, Plus, Phone, DollarSign, ClipboardList } from 'lucide-react';
import { Mecanico } from '../types';
import { ensureSupabaseSession, supabase } from '../lib/supabaseClient';

const STORAGE_MECANICOS = 'mecanicos';

interface FormState {
  nombre: string;
  telefono: string;
  especialidad: string;
}

const Mecanicos: React.FC = () => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formState, setFormState] = useState<FormState>({ nombre: '', telefono: '', especialidad: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const cargarMecanicos = useCallback(async () => {
    setIsLoading(true);
    let cargado = false;
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
    try {
      await ensureSupabaseSession();
      const { data, error } = await supabase
        .from('mecanicos')
        .select('id, nombre, telefono, especialidad, trabajos_realizados, balance_mano_obra, updated_at')
        .order('nombre');

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const registros = data.map((mecanico) => ({
          id: mecanico.id,
          nombre: mecanico.nombre,
          telefono: mecanico.telefono || undefined,
          especialidad: mecanico.especialidad || undefined,
          trabajos_realizados: mecanico.trabajos_realizados ?? 0,
          balance_mano_obra: Number(mecanico.balance_mano_obra ?? 0),
          updated_at: mecanico.updated_at || new Date().toISOString()
        }));

        setMecanicos(registros);
        localStorage.setItem(STORAGE_MECANICOS, JSON.stringify(registros));
        cargado = true;
      }
    } catch (error) {
      console.error('No se pudieron cargar los mecánicos desde Supabase', error);
    }

    if (!cargado) {
      try {
        const stored = localStorage.getItem(STORAGE_MECANICOS);
        const locales = stored ? JSON.parse(stored) : [];
        if (locales.length > 0) {
          setMecanicos(locales);
        } else {
          setMecanicos(baseMecanicos);
          localStorage.setItem(STORAGE_MECANICOS, JSON.stringify(baseMecanicos));
        }
      } catch (error) {
        console.error('No se pudieron cargar los mecánicos desde almacenamiento local', error);
        setMecanicos(baseMecanicos);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void cargarMecanicos();
  }, [cargarMecanicos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_MECANICOS, JSON.stringify(mecanicos));
  }, [mecanicos]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSaving) return;
    setIsSaving(true);

    try {
      await ensureSupabaseSession();

      const { data, error } = await supabase
        .from('mecanicos')
        .insert({
          nombre: formState.nombre,
          telefono: formState.telefono || null,
          especialidad: formState.especialidad || null
        })
        .select('id, nombre, telefono, especialidad, trabajos_realizados, balance_mano_obra, updated_at')
        .single();

      if (error) {
        throw error;
      }

      const nuevo: Mecanico = {
        id: data.id,
        nombre: data.nombre,
        telefono: data.telefono || undefined,
        especialidad: data.especialidad || undefined,
        balance_mano_obra: Number(data.balance_mano_obra ?? 0),
        trabajos_realizados: data.trabajos_realizados ?? 0,
        updated_at: data.updated_at || new Date().toISOString()
      };

      setMecanicos((prev) => {
        const actualizados = [...prev, nuevo];
        localStorage.setItem(STORAGE_MECANICOS, JSON.stringify(actualizados));
        return actualizados;
      });

      setFormState({ nombre: '', telefono: '', especialidad: '' });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('No se pudo registrar el mecánico', error);
    } finally {
      setIsSaving(false);
    }
  };

  const totalBalance = useMemo(
    () => mecanicos.reduce((acc, mecanico) => acc + mecanico.balance_mano_obra, 0),
    [mecanicos]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mecánicos</h2>
          <p className="text-gray-600 mt-1">Seguimiento de mano de obra y responsables</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Registrar mecánico</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Mecánicos activos</p>
              <p className="text-2xl font-semibold text-gray-900">{mecanicos.length}</p>
            </div>
            <Wrench className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Trabajos asignados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mecanicos.reduce((acc, m) => acc + m.trabajos_realizados, 0)}
              </p>
            </div>
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Balance de mano de obra</p>
              <p className="text-2xl font-semibold text-gray-900">${totalBalance.toLocaleString('es-CO')}</p>
            </div>
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo mecánico</h3>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={formState.nombre}
                onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={formState.telefono}
                onChange={(e) => setFormState({ ...formState, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
              <input
                type="text"
                value={formState.especialidad}
                onChange={(e) => setFormState({ ...formState, especialidad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-3 flex space-x-3">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajos</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mecanicos.map((mecanico) => (
              <tr key={mecanico.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mecanico.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{mecanico.telefono || 'No registrado'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mecanico.especialidad || 'General'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  ${mecanico.balance_mano_obra.toLocaleString('es-CO')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {mecanico.trabajos_realizados}
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Cargando mecánicos...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!isLoading && mecanicos.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-6">Aún no hay mecánicos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default Mecanicos;
