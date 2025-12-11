/*
  # Schema completo para MotoShopST

  1. Nuevas Tablas
    - `categorias_servicio`: Categorías de servicios (Motor, Transmisión, etc.)
    - `servicios`: Catálogo de servicios con precios y períodos de retorno
    - `clientes`: Información de clientes del taller
    - `motos`: Motocicletas registradas vinculadas a clientes
    - `ordenes_trabajo`: Órdenes de trabajo/mantenimiento
    - `orden_servicios`: Servicios aplicados en cada orden
    - `mecanicos`: Mecánicos del taller
    - `orden_mano_obra`: Mano de obra asignada por orden
    - `mantenimientos_preventivos`: Seguimiento de mantenimientos programados

  2. Enums
    - `estado_orden`: Estados de las órdenes (pendiente, en_proceso, completado, entregado)
    - `retorno_tipo`: Tipo de período de retorno (kilometraje, tiempo)
    - `retorno_unidad`: Unidad del período (km, meses, días)

  3. Índices
    - Índices en relaciones frecuentes (moto_id, estado, etc.)

  4. Vistas
    - `vw_balance_mecanicos`: Balance de mano de obra por mecánico
    - `vw_proximos_mantenimientos`: Mantenimientos próximos a vencer

  5. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para usuarios autenticados (aplicación de negocio interno)
*/

-- Extensiones
create extension if not exists "uuid-ossp";

-- Enums (con manejo seguro de duplicados)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_orden') then
    create type estado_orden as enum ('pendiente', 'en_proceso', 'completado', 'entregado');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'retorno_tipo') then
    create type retorno_tipo as enum ('kilometraje', 'tiempo');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'retorno_unidad') then
    create type retorno_unidad as enum ('km', 'meses', 'días');
  end if;
end $$;

-- ============================================
-- TABLAS: Catálogo de servicios
-- ============================================

create table if not exists categorias_servicio (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  icono text not null,
  color text not null,
  created_at timestamptz default now()
);

create table if not exists servicios (
  id uuid primary key default uuid_generate_v4(),
  categoria_id uuid not null references categorias_servicio(id) on delete cascade,
  nombre text not null,
  precio_base numeric not null default 0,
  descripcion text,
  retorno_tipo retorno_tipo,
  retorno_valor numeric,
  retorno_unidad retorno_unidad,
  retorno_nota text,
  created_at timestamptz default now()
);

-- ============================================
-- TABLAS: Clientes y motos
-- ============================================

create table if not exists clientes (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  telefono text not null,
  email text,
  cedula text not null unique,
  direccion text,
  created_at timestamptz not null default now()
);

create table if not exists motos (
  id uuid primary key default uuid_generate_v4(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  marca text not null,
  modelo text not null,
  anio integer not null,
  placa text not null unique,
  kilometraje numeric not null default 0,
  color text not null,
  created_at timestamptz not null default now()
);

-- ============================================
-- TABLAS: Órdenes de trabajo
-- ============================================

create table if not exists ordenes_trabajo (
  id uuid primary key default uuid_generate_v4(),
  moto_id uuid not null references motos(id) on delete cascade,
  fecha_ingreso timestamptz not null default now(),
  fecha_entrega_estimada timestamptz not null,
  fecha_entrega_real timestamptz,
  estado estado_orden not null default 'pendiente',
  observaciones text,
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_ordenes_trabajo_moto on ordenes_trabajo(moto_id);
create index if not exists idx_ordenes_trabajo_estado on ordenes_trabajo(estado);
create index if not exists idx_ordenes_trabajo_fecha_entrega on ordenes_trabajo(fecha_entrega_estimada);

create table if not exists orden_servicios (
  id uuid primary key default uuid_generate_v4(),
  orden_trabajo_id uuid not null references ordenes_trabajo(id) on delete cascade,
  servicio_id uuid not null references servicios(id),
  precio numeric not null default 0,
  observaciones text,
  completado boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists idx_orden_servicios_orden on orden_servicios(orden_trabajo_id);

-- ============================================
-- TABLAS: Mecánicos y mano de obra
-- ============================================

create table if not exists mecanicos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  telefono text,
  especialidad text,
  trabajos_realizados integer not null default 0,
  balance_mano_obra numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orden_mano_obra (
  id uuid primary key default uuid_generate_v4(),
  orden_trabajo_id uuid not null references ordenes_trabajo(id) on delete cascade,
  mecanico_id uuid not null references mecanicos(id),
  mecanico_nombre text,
  valor numeric not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_orden_mano_obra_orden on orden_mano_obra(orden_trabajo_id);
create index if not exists idx_orden_mano_obra_mecanico on orden_mano_obra(mecanico_id);

-- ============================================
-- TABLAS: Mantenimiento preventivo
-- ============================================

create table if not exists mantenimientos_preventivos (
  id uuid primary key default uuid_generate_v4(),
  moto_id uuid not null references motos(id) on delete cascade,
  tipo_mantenimiento text not null,
  ultimo_servicio timestamptz not null,
  proximo_servicio timestamptz not null,
  kilometraje_actual numeric not null default 0,
  kilometraje_proximo numeric not null default 0,
  notificado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_mantenimientos_moto on mantenimientos_preventivos(moto_id);
create index if not exists idx_mantenimientos_proximo on mantenimientos_preventivos(proximo_servicio);

-- ============================================
-- VISTAS
-- ============================================

create or replace view vw_balance_mecanicos as
select
  m.id,
  m.nombre,
  m.especialidad,
  m.trabajos_realizados,
  m.balance_mano_obra,
  coalesce(sum(o.valor), 0) as total_mano_obra_ordenes
from mecanicos m
left join orden_mano_obra o on o.mecanico_id = m.id
group by m.id, m.nombre, m.especialidad, m.trabajos_realizados, m.balance_mano_obra;

create or replace view vw_proximos_mantenimientos as
select
  mp.id,
  mp.moto_id,
  mp.tipo_mantenimiento,
  mp.proximo_servicio,
  mp.kilometraje_proximo,
  mp.kilometraje_actual,
  mp.notificado,
  m.marca,
  m.modelo,
  m.placa,
  c.nombre as cliente_nombre,
  c.telefono as cliente_telefono
from mantenimientos_preventivos mp
join motos m on m.id = mp.moto_id
join clientes c on c.id = m.cliente_id
where mp.proximo_servicio <= now() + interval '30 days'
   or mp.kilometraje_proximo <= mp.kilometraje_actual + 1000;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Categorías de servicio
alter table categorias_servicio enable row level security;

create policy "Usuarios autenticados pueden leer categorías"
  on categorias_servicio for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar categorías"
  on categorias_servicio for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar categorías"
  on categorias_servicio for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar categorías"
  on categorias_servicio for delete
  to authenticated
  using (true);

-- Servicios
alter table servicios enable row level security;

create policy "Usuarios autenticados pueden leer servicios"
  on servicios for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar servicios"
  on servicios for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar servicios"
  on servicios for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar servicios"
  on servicios for delete
  to authenticated
  using (true);

-- Clientes
alter table clientes enable row level security;

create policy "Usuarios autenticados pueden leer clientes"
  on clientes for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar clientes"
  on clientes for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar clientes"
  on clientes for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar clientes"
  on clientes for delete
  to authenticated
  using (true);

-- Motos
alter table motos enable row level security;

create policy "Usuarios autenticados pueden leer motos"
  on motos for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar motos"
  on motos for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar motos"
  on motos for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar motos"
  on motos for delete
  to authenticated
  using (true);

-- Órdenes de trabajo
alter table ordenes_trabajo enable row level security;

create policy "Usuarios autenticados pueden leer órdenes"
  on ordenes_trabajo for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar órdenes"
  on ordenes_trabajo for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar órdenes"
  on ordenes_trabajo for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar órdenes"
  on ordenes_trabajo for delete
  to authenticated
  using (true);

-- Orden servicios
alter table orden_servicios enable row level security;

create policy "Usuarios autenticados pueden leer orden_servicios"
  on orden_servicios for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar orden_servicios"
  on orden_servicios for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar orden_servicios"
  on orden_servicios for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar orden_servicios"
  on orden_servicios for delete
  to authenticated
  using (true);

-- Mecánicos
alter table mecanicos enable row level security;

create policy "Usuarios autenticados pueden leer mecánicos"
  on mecanicos for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar mecánicos"
  on mecanicos for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar mecánicos"
  on mecanicos for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar mecánicos"
  on mecanicos for delete
  to authenticated
  using (true);

-- Orden mano de obra
alter table orden_mano_obra enable row level security;

create policy "Usuarios autenticados pueden leer orden_mano_obra"
  on orden_mano_obra for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar orden_mano_obra"
  on orden_mano_obra for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar orden_mano_obra"
  on orden_mano_obra for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar orden_mano_obra"
  on orden_mano_obra for delete
  to authenticated
  using (true);

-- Mantenimientos preventivos
alter table mantenimientos_preventivos enable row level security;

create policy "Usuarios autenticados pueden leer mantenimientos"
  on mantenimientos_preventivos for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar mantenimientos"
  on mantenimientos_preventivos for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar mantenimientos"
  on mantenimientos_preventivos for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden eliminar mantenimientos"
  on mantenimientos_preventivos for delete
  to authenticated
  using (true);
