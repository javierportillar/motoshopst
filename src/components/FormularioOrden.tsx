import React, { useState } from 'react';
import { X, Trash2, User, Recycle as Motorcycle } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useServicios } from '../context/ServiciosContext';

interface FormularioOrdenProps {
  onClose: () => void;
}

const FormularioOrden: React.FC<FormularioOrdenProps> = ({ onClose }) => {
  const { categorias, servicios } = useServicios();
  const [currentStep, setCurrentStep] = useState(1);
  
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

  // Estado de los servicios seleccionados
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<{
    servicio_id: string;
    precio: number;
    observaciones: string;
  }[]>([]);

  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState('');

  const agregarServicio = (servicioId: string) => {
    const servicio = servicios.find(s => s.id === servicioId);
    if (servicio && !serviciosSeleccionados.find(s => s.servicio_id === servicioId)) {
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
    setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.servicio_id !== servicioId));
  };

  const actualizarPrecioServicio = (servicioId: string, precio: number) => {
    setServiciosSeleccionados(serviciosSeleccionados.map(s => 
      s.servicio_id === servicioId ? { ...s, precio } : s
    ));
  };

  const actualizarObservacionServicio = (servicioId: string, observaciones: string) => {
    setServiciosSeleccionados(serviciosSeleccionados.map(s => 
      s.servicio_id === servicioId ? { ...s, observaciones } : s
    ));
  };

  const calcularTotal = () => {
    return serviciosSeleccionados.reduce((total, s) => total + s.precio, 0);
  };

  const handleSubmit = () => {
    // Aquí se guardaría en la base de datos
    console.log('Nueva orden:', {
      cliente,
      moto,
      serviciosSeleccionados,
      observacionesGenerales,
      fechaEntregaEstimada,
      total: calcularTotal()
    });
    
    // Simular guardado exitoso
    alert('Orden de trabajo creada exitosamente');
    onClose();
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
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
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
          const serviciosCategoria = servicios.filter(s => s.categoria_id === categoria.id);
          
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
                    const isSelected = serviciosSeleccionados.find(s => s.servicio_id === servicio.id);
                    
                    return (
                      <div key={servicio.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {servicio.nombre}
                            </label>
                            {servicio.descripcion && (
                              <p className="text-xs text-gray-500">{servicio.descripcion}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          ${servicio.precio_base.toLocaleString('es-CO')}
                        </span>
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
              const servicioInfo = servicios.find(s => s.id === servicio.servicio_id);
              return (
                <div key={servicio.servicio_id} className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{servicioInfo?.nombre}</span>
                    <button
                      onClick={() => removerServicio(servicio.servicio_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Precio</label>
                      <input
                        type="number"
                        value={servicio.precio}
                        onChange={(e) => actualizarPrecioServicio(servicio.servicio_id, parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Observaciones</label>
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

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Resumen</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span>{cliente.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span>Moto:</span>
              <span>{moto.marca} {moto.modelo}</span>
            </div>
            <div className="flex justify-between">
              <span>Servicios:</span>
              <span>{serviciosSeleccionados.length}</span>
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
        <h2 className="text-3xl font-bold text-gray-900">Nueva Orden de Trabajo</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
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
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          {currentStep === 1 ? 'Cancelar' : 'Anterior'}
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 1 && (!cliente.nombre || !cliente.cedula || !cliente.telefono)) ||
              (currentStep === 2 && (!moto.marca || !moto.modelo || !moto.placa))
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!fechaEntregaEstimada || serviciosSeleccionados.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear Orden
          </button>
        )}
      </div>
    </div>
  );
};

export default FormularioOrden;