import React, { useEffect, useMemo, useState } from 'react';
import { Wrench, Plus, Phone, DollarSign, ClipboardList } from 'lucide-react';
import { Mecanico } from '../types';

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_MECANICOS);
      if (stored) {
        setMecanicos(JSON.parse(stored));
        return;
      }
      setMecanicos([]);
    } catch (error) {
      console.error('No se pudieron cargar los mecánicos', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_MECANICOS, JSON.stringify(mecanicos));
  }, [mecanicos]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nuevo: Mecanico = {
      id: `mec-${Date.now()}`,
      nombre: formState.nombre,
      telefono: formState.telefono || undefined,
      especialidad: formState.especialidad || undefined,
      balance_mano_obra: 0,
      trabajos_realizados: 0,
      updated_at: new Date().toISOString()
    };
    setMecanicos((prev) => [...prev, nuevo]);
    setFormState({ nombre: '', telefono: '', especialidad: '' });
    setMostrarFormulario(false);
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Guardar
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
          </tbody>
        </table>
        {mecanicos.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-6">Aún no hay mecánicos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default Mecanicos;
