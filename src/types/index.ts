export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  cedula: string;
  direccion?: string;
  created_at: string;
}

export interface Moto {
  id: string;
  cliente_id: string;
  cliente?: Cliente;
  marca: string;
  modelo: string;
  año: number;
  placa: string;
  kilometraje: number;
  color: string;
  created_at: string;
}

export interface CategoriaServicio {
  id: string;
  nombre: string;
  icono: string;
  color: string;
}

export interface Servicio {
  id: string;
  categoria_id: string;
  categoria?: CategoriaServicio;
  nombre: string;
  precio_base: number;
  descripcion?: string;
}

export interface OrdenTrabajo {
  id: string;
  moto_id: string;
  moto?: Moto;
  fecha_ingreso: string;
  fecha_entrega_estimada: string;
  fecha_entrega_real?: string;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'entregado';
  observaciones?: string;
  total: number;
  created_at: string;
}

export interface DetalleServicio {
  id: string;
  orden_trabajo_id: string;
  servicio_id: string;
  servicio?: Servicio;
  precio: number;
  observaciones?: string;
  completado: boolean;
}

export interface MantenimientoPreventivo {
  id: string;
  moto_id: string;
  moto?: Moto;
  tipo_mantenimiento: string;
  ultimo_servicio: string;
  proximo_servicio: string;
  kilometraje_actual: number;
  kilometraje_proximo: number;
  notificado: boolean;
  created_at: string;
}