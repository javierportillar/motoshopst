/*
  # Datos iniciales: Categorías y Servicios

  1. Datos insertados
    - 8 categorías de servicios
    - 25 servicios con sus precios base y períodos de retorno

  2. Notas
    - Los IDs son generados automáticamente por UUID
    - Los servicios incluyen información de retorno para mantenimiento preventivo
*/

-- Insertar categorías de servicio
insert into categorias_servicio (nombre, icono, color) values
  ('Motor y combustión', 'Engine', '#EF4444'),
  ('Transmisión y partes móviles', 'Settings', '#F59E0B'),
  ('Sistema eléctrico y batería', 'Battery', '#3B82F6'),
  ('Frenos y seguridad', 'ShieldCheck', '#DC2626'),
  ('Suspensión y dirección', 'Move', '#7C3AED'),
  ('Ruedas y soporte', 'Circle', '#059669'),
  ('Estructura y ajustes', 'Wrench', '#0891B2'),
  ('Emisiones y escape', 'Wind', '#65A30D')
on conflict do nothing;

-- Insertar servicios
-- Motor y combustión
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Línea Combustible',
  25000,
  'Revisión y limpieza del sistema de combustible',
  'tiempo'::retorno_tipo,
  6,
  'meses'::retorno_unidad,
  'Limpiar o reemplazar filtros y mangueras'
where not exists (select 1 from servicios where nombre = 'Línea Combustible');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Operación de acelerador',
  15000,
  'Ajuste y calibración del acelerador',
  'tiempo'::retorno_tipo,
  6,
  'meses'::retorno_unidad,
  'Verificar tensión del chicote'
where not exists (select 1 from servicios where nombre = 'Operación de acelerador');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Carburador / Cuerpo de aceleración',
  45000,
  'Limpieza y ajuste del carburador',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  'Antes si se perciben fallos de ralentí'
where not exists (select 1 from servicios where nombre = 'Carburador / Cuerpo de aceleración');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Filtro de aire',
  20000,
  'Cambio o limpieza del filtro de aire',
  'kilometraje'::retorno_tipo,
  4000,
  'km'::retorno_unidad,
  'Reducir a 3000 km en ambientes polvorientos'
where not exists (select 1 from servicios where nombre = 'Filtro de aire');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Bujía del motor',
  18000,
  'Cambio de bujía',
  'kilometraje'::retorno_tipo,
  8000,
  'km'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Bujía del motor');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Calibración de válvula',
  65000,
  'Calibración de válvulas del motor',
  'kilometraje'::retorno_tipo,
  10000,
  'km'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Calibración de válvula');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Aceite del motor',
  35000,
  'Cambio de aceite del motor',
  'kilometraje'::retorno_tipo,
  3000,
  'km'::retorno_unidad,
  'O cada 3 meses, lo que ocurra primero'
where not exists (select 1 from servicios where nombre = 'Aceite del motor');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Malla filtro aceite motor',
  12000,
  'Limpieza de malla del filtro de aceite',
  'kilometraje'::retorno_tipo,
  6000,
  'km'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Malla filtro aceite motor');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Filtro Centrífugo de aceite del motor',
  25000,
  'Limpieza del filtro centrífugo',
  'kilometraje'::retorno_tipo,
  6000,
  'km'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Filtro Centrífugo de aceite del motor');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Arranque eléctrico',
  40000,
  'Revisión del sistema de arranque',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Arranque eléctrico');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Motor y combustión'),
  'Circulación de aceite',
  30000,
  'Revisión del sistema de circulación de aceite',
  'kilometraje'::retorno_tipo,
  12000,
  'km'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Circulación de aceite');

-- Transmisión y partes móviles
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Transmisión y partes móviles'),
  'Cadena de transmisión',
  35000,
  'Ajuste y lubricación de cadena',
  'kilometraje'::retorno_tipo,
  1000,
  'km'::retorno_unidad,
  'Lubricar cada 500 km bajo lluvia'
where not exists (select 1 from servicios where nombre = 'Cadena de transmisión');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Transmisión y partes móviles'),
  'Embrague',
  55000,
  'Revisión y ajuste del embrague',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Embrague');

-- Sistema eléctrico y batería
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Sistema eléctrico y batería'),
  'Voltaje de la batería',
  15000,
  'Prueba y carga de batería',
  'tiempo'::retorno_tipo,
  6,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Voltaje de la batería');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Sistema eléctrico y batería'),
  'Interruptor lámpara de freno',
  18000,
  'Revisión del interruptor de freno',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Interruptor lámpara de freno');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Sistema eléctrico y batería'),
  'Foco de luz principal',
  22000,
  'Cambio de foco principal',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  'Antes si presenta baja iluminación'
where not exists (select 1 from servicios where nombre = 'Foco de luz principal');

-- Frenos y seguridad
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Frenos y seguridad'),
  'Bandas / Pastillas de freno',
  45000,
  'Cambio de pastillas de freno',
  'kilometraje'::retorno_tipo,
  8000,
  'km'::retorno_unidad,
  'Revisar desgaste cada 3000 km'
where not exists (select 1 from servicios where nombre = 'Bandas / Pastillas de freno');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Frenos y seguridad'),
  'Líquido de frenos',
  25000,
  'Cambio de líquido de frenos',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Líquido de frenos');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Frenos y seguridad'),
  'Sistema de frenos (leval / pedal)',
  35000,
  'Ajuste del sistema de frenos',
  'tiempo'::retorno_tipo,
  6,
  'meses'::retorno_unidad,
  'O ante pérdida de sensibilidad'
where not exists (select 1 from servicios where nombre = 'Sistema de frenos (leval / pedal)');

-- Suspensión y dirección
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Suspensión y dirección'),
  'Rodamientos de dirección',
  40000,
  'Cambio de rodamientos de dirección',
  'kilometraje'::retorno_tipo,
  20000,
  'km'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Rodamientos de dirección');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Suspensión y dirección'),
  'Suspensión delantera / Aceite',
  65000,
  'Servicio de suspensión delantera',
  'kilometraje'::retorno_tipo,
  12000,
  'km'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Suspensión delantera / Aceite');

-- Ruedas y soporte
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Ruedas y soporte'),
  'Ruedas / Llantas',
  80000,
  'Cambio o reparación de llantas',
  'kilometraje'::retorno_tipo,
  10000,
  'km'::retorno_unidad,
  'Revisar presión cada 15 días'
where not exists (select 1 from servicios where nombre = 'Ruedas / Llantas');

insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Ruedas y soporte'),
  'Soporte lateral / central',
  25000,
  'Ajuste de soportes',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Soporte lateral / central');

-- Estructura y ajustes
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Estructura y ajustes'),
  'Abrazaderas y ajustes (Torques)',
  30000,
  'Ajuste general de tornillería',
  'tiempo'::retorno_tipo,
  6,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Abrazaderas y ajustes (Torques)');

-- Emisiones y escape
insert into servicios (categoria_id, nombre, precio_base, descripcion, retorno_tipo, retorno_valor, retorno_unidad, retorno_nota)
select 
  (select id from categorias_servicio where nombre = 'Emisiones y escape'),
  'Silenciador (Convertidor catalítico)',
  120000,
  'Servicio del sistema de escape',
  'tiempo'::retorno_tipo,
  12,
  'meses'::retorno_unidad,
  null
where not exists (select 1 from servicios where nombre = 'Silenciador (Convertidor catalítico)');
