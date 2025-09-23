import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CATEGORIAS as CATEGORIAS_BASE, SERVICIOS as SERVICIOS_BASE } from '../data/servicios';
import { CategoriaServicio, Servicio } from '../types';

interface NuevoServicioInput {
  categoria_id: string;
  nombre: string;
  precio_base: number;
  descripcion?: string;
}

interface ServiciosContextValue {
  categorias: CategoriaServicio[];
  servicios: Servicio[];
  actualizarPrecioServicio: (id: string, nuevoPrecio: number) => void;
  agregarServicio: (servicio: NuevoServicioInput) => void;
}

const ServiciosContext = createContext<ServiciosContextValue | undefined>(undefined);

interface ServiciosProviderProps {
  children: React.ReactNode;
}

export const ServiciosProvider: React.FC<ServiciosProviderProps> = ({ children }) => {
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS_BASE);

  const actualizarPrecioServicio = useCallback((id: string, nuevoPrecio: number) => {
    if (Number.isNaN(nuevoPrecio) || nuevoPrecio < 0) {
      return;
    }

    setServicios((prevServicios) =>
      prevServicios.map((servicio) =>
        servicio.id === id ? { ...servicio, precio_base: nuevoPrecio } : servicio
      )
    );
  }, []);

  const agregarServicio = useCallback((servicio: NuevoServicioInput) => {
    setServicios((prevServicios) => [
      ...prevServicios,
      {
        ...servicio,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      }
    ]);
  }, []);

  const value = useMemo(
    () => ({
      categorias: CATEGORIAS_BASE,
      servicios,
      actualizarPrecioServicio,
      agregarServicio
    }),
    [servicios, actualizarPrecioServicio, agregarServicio]
  );

  return <ServiciosContext.Provider value={value}>{children}</ServiciosContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useServicios = (): ServiciosContextValue => {
  const context = useContext(ServiciosContext);
  if (!context) {
    throw new Error('useServicios debe utilizarse dentro de un ServiciosProvider');
  }
  return context;
};
