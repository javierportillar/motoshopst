import { CategoriaServicio, Servicio } from '../types';

export const CATEGORIAS: CategoriaServicio[] = [
  {
    id: '1',
    nombre: 'Motor y combustión',
    icono: 'Engine',
    color: '#EF4444'
  },
  {
    id: '2',
    nombre: 'Transmisión y partes móviles',
    icono: 'Settings',
    color: '#F59E0B'
  },
  {
    id: '3',
    nombre: 'Sistema eléctrico y batería',
    icono: 'Battery',
    color: '#3B82F6'
  },
  {
    id: '4',
    nombre: 'Frenos y seguridad',
    icono: 'ShieldCheck',
    color: '#DC2626'
  },
  {
    id: '5',
    nombre: 'Suspensión y dirección',
    icono: 'Move',
    color: '#7C3AED'
  },
  {
    id: '6',
    nombre: 'Ruedas y soporte',
    icono: 'Circle',
    color: '#059669'
  },
  {
    id: '7',
    nombre: 'Estructura y ajustes',
    icono: 'Wrench',
    color: '#0891B2'
  },
  {
    id: '8',
    nombre: 'Emisiones y escape',
    icono: 'Wind',
    color: '#65A30D'
  }
];

export const SERVICIOS: Servicio[] = [
  // Motor y combustión
  { id: '1', categoria_id: '1', nombre: 'Línea Combustible', precio_base: 25000, descripcion: 'Revisión y limpieza del sistema de combustible' },
  { id: '2', categoria_id: '1', nombre: 'Operación de acelerador', precio_base: 15000, descripcion: 'Ajuste y calibración del acelerador' },
  { id: '3', categoria_id: '1', nombre: 'Carburador / Cuerpo de aceleración', precio_base: 45000, descripcion: 'Limpieza y ajuste del carburador' },
  { id: '4', categoria_id: '1', nombre: 'Filtro de aire', precio_base: 20000, descripcion: 'Cambio o limpieza del filtro de aire' },
  { id: '5', categoria_id: '1', nombre: 'Bujía del motor', precio_base: 18000, descripcion: 'Cambio de bujía' },
  { id: '6', categoria_id: '1', nombre: 'Calibración de válvula', precio_base: 65000, descripcion: 'Calibración de válvulas del motor' },
  { id: '7', categoria_id: '1', nombre: 'Aceite del motor', precio_base: 35000, descripcion: 'Cambio de aceite del motor' },
  { id: '8', categoria_id: '1', nombre: 'Malla filtro aceite motor', precio_base: 12000, descripcion: 'Limpieza de malla del filtro de aceite' },
  { id: '9', categoria_id: '1', nombre: 'Filtro Centrífugo de aceite del motor', precio_base: 25000, descripcion: 'Limpieza del filtro centrífugo' },
  { id: '10', categoria_id: '1', nombre: 'Arranque eléctrico', precio_base: 40000, descripcion: 'Revisión del sistema de arranque' },
  { id: '11', categoria_id: '1', nombre: 'Circulación de aceite', precio_base: 30000, descripcion: 'Revisión del sistema de circulación de aceite' },

  // Transmisión y partes móviles
  { id: '12', categoria_id: '2', nombre: 'Cadena de transmisión', precio_base: 35000, descripcion: 'Ajuste y lubricación de cadena' },
  { id: '13', categoria_id: '2', nombre: 'Embrague', precio_base: 55000, descripcion: 'Revisión y ajuste del embrague' },

  // Sistema eléctrico y batería
  { id: '14', categoria_id: '3', nombre: 'Voltaje de la batería', precio_base: 15000, descripcion: 'Prueba y carga de batería' },
  { id: '15', categoria_id: '3', nombre: 'Interruptor lámpara de freno', precio_base: 18000, descripcion: 'Revisión del interruptor de freno' },
  { id: '16', categoria_id: '3', nombre: 'Foco de luz principal', precio_base: 22000, descripcion: 'Cambio de foco principal' },

  // Frenos y seguridad
  { id: '17', categoria_id: '4', nombre: 'Bandas / Pastillas de freno', precio_base: 45000, descripcion: 'Cambio de pastillas de freno' },
  { id: '18', categoria_id: '4', nombre: 'Líquido de frenos', precio_base: 25000, descripcion: 'Cambio de líquido de frenos' },
  { id: '19', categoria_id: '4', nombre: 'Sistema de frenos (leval / pedal)', precio_base: 35000, descripcion: 'Ajuste del sistema de frenos' },

  // Suspensión y dirección
  { id: '20', categoria_id: '5', nombre: 'Rodamientos de dirección', precio_base: 40000, descripcion: 'Cambio de rodamientos de dirección' },
  { id: '21', categoria_id: '5', nombre: 'Suspensión delantera / Aceite', precio_base: 65000, descripcion: 'Servicio de suspensión delantera' },

  // Ruedas y soporte
  { id: '22', categoria_id: '6', nombre: 'Ruedas / Llantas', precio_base: 80000, descripcion: 'Cambio o reparación de llantas' },
  { id: '23', categoria_id: '6', nombre: 'Soporte lateral / central', precio_base: 25000, descripcion: 'Ajuste de soportes' },

  // Estructura y ajustes
  { id: '24', categoria_id: '7', nombre: 'Abrazaderas y ajustes (Torques)', precio_base: 30000, descripcion: 'Ajuste general de tornillería' },

  // Emisiones y escape
  { id: '25', categoria_id: '8', nombre: 'Silenciador (Convertidor catalítico)', precio_base: 120000, descripcion: 'Servicio del sistema de escape' }
];