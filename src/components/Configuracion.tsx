import React, { useState } from 'react';
import { Plus, Wrench } from 'lucide-react';
import { useServicios } from '../context/ServiciosContext';

const Configuracion: React.FC = () => {
  const { categorias, servicios, actualizarPrecioServicio, agregarServicio } = useServicios();
  const [formData, setFormData] = useState({
    categoria_id: categorias[0]?.id ?? '',
    nombre: '',
    precio_base: '',
    descripcion: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleAgregarServicio = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const precio = Number(formData.precio_base);
    if (!formData.nombre.trim() || Number.isNaN(precio) || precio <= 0 || !formData.categoria_id) {
      setMensaje('Completa todos los campos con información válida antes de guardar.');
      return;
    }

    agregarServicio({
      categoria_id: formData.categoria_id,
      nombre: formData.nombre.trim(),
      precio_base: precio,
      descripcion: formData.descripcion.trim() || undefined
    });

    setFormData({
      categoria_id: categorias[0]?.id ?? '',
      nombre: '',
      precio_base: '',
      descripcion: ''
    });
    setMensaje('Servicio agregado correctamente.');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Configuración de Servicios</h2>
          <p className="text-gray-600 mt-1">
            Actualiza los precios base y añade nuevos servicios disponibles en las órdenes de trabajo.
          </p>
        </div>
        <Wrench className="h-10 w-10 text-blue-600" />
      </div>

      <section className="space-y-6">
        {categorias.map((categoria) => {
          const serviciosDeCategoria = servicios.filter((servicio) => servicio.categoria_id === categoria.id);
          return (
            <div key={categoria.id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{categoria.nombre}</h3>
                  <p className="text-sm text-gray-500">
                    Gestiona los servicios asociados a esta categoría.
                  </p>
                </div>
              </header>

              <div className="divide-y divide-gray-100">
                {serviciosDeCategoria.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-gray-500">Aún no hay servicios registrados.</p>
                ) : (
                  serviciosDeCategoria.map((servicio) => (
                    <div key={servicio.id} className="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{servicio.nombre}</p>
                        {servicio.descripcion && (
                          <p className="text-xs text-gray-500 max-w-xl">{servicio.descripcion}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500" htmlFor={`precio-${servicio.id}`}>
                          Precio base (COP)
                        </label>
                        <input
                          id={`precio-${servicio.id}`}
                          type="number"
                          className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={servicio.precio_base}
                          min={0}
                          onChange={(event) => actualizarPrecioServicio(servicio.id, Number(event.target.value))}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="bg-white border border-dashed border-blue-200 rounded-xl p-6 shadow-sm">
        <header className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Añadir nuevo servicio</h3>
            <p className="text-sm text-gray-500">
              El nuevo servicio quedará disponible inmediatamente en las órdenes de trabajo.
            </p>
          </div>
        </header>

        <form onSubmit={handleAgregarServicio} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="categoria">
              Categoría
            </label>
            <select
              id="categoria"
              value={formData.categoria_id}
              onChange={(event) => {
                setMensaje('');
                setFormData((prev) => ({ ...prev, categoria_id: event.target.value }));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre">
              Nombre del servicio
            </label>
            <input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(event) => {
                setMensaje('');
                setFormData((prev) => ({ ...prev, nombre: event.target.value }));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Cambio de filtro, ajuste general..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="precio">
              Precio base (COP)
            </label>
            <input
              id="precio"
              type="number"
              value={formData.precio_base}
              onChange={(event) => {
                setMensaje('');
                setFormData((prev) => ({ ...prev, precio_base: event.target.value }));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              min={0}
              step={1000}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion">
              Descripción (opcional)
            </label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(event) => {
                setMensaje('');
                setFormData((prev) => ({ ...prev, descripcion: event.target.value }));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={3}
              placeholder="Información adicional sobre el servicio"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between">
            <p className={`text-sm ${mensaje ? 'text-blue-600' : 'text-gray-500'}`}>
              {mensaje || 'Completa el formulario para guardar el servicio.'}
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Guardar servicio
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Configuracion;
