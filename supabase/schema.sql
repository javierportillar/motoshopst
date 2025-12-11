-- Supabase schema for MotoShopST
-- Defines catalogs, customers, vehicles, work orders, services, mechanics, and preventive maintenance.

-- Enable UUID generation (Supabase ships with this extension enabled by default).
create extension if not exists "uuid-ossp";

-- Enums
create type if not exists estado_orden as enum ('pendiente', 'en_proceso', 'completado', 'entregado');
create type if not exists retorno_tipo as enum ('kilometraje', 'tiempo');
create type if not exists retorno_unidad as enum ('km', 'meses', 'días');

-- Catálogo de servicios
create table if not exists categorias_servicio (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  icono text not null,
  color text not null
);

create table if not exists servicios (
  id uuid primary key default uuid_generate_v4(),
  categoria_id uuid not null references categorias_servicio(id) on delete cascade,
  nombre text not null,
  precio_base numeric not null,
  descripcion text,
  retorno_tipo retorno_tipo,
  retorno_valor numeric,
  retorno_unidad retorno_unidad,
  retorno_nota text
);

-- Clientes y motos
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
  kilometraje numeric not null,
  color text not null,
  created_at timestamptz not null default now()
);

-- Órdenes de trabajo
create table if not exists ordenes_trabajo (
  id uuid primary key default uuid_generate_v4(),
  moto_id uuid not null references motos(id) on delete cascade,
  fecha_ingreso timestamptz not null,
  fecha_entrega_estimada timestamptz not null,
  fecha_entrega_real timestamptz,
  estado estado_orden not null default 'pendiente',
  observaciones text,
  total numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_ordenes_trabajo_moto on ordenes_trabajo(moto_id);
create index if not exists idx_ordenes_trabajo_estado on ordenes_trabajo(estado);

create table if not exists orden_servicios (
  id uuid primary key default uuid_generate_v4(),
  orden_trabajo_id uuid not null references ordenes_trabajo(id) on delete cascade,
  servicio_id uuid not null references servicios(id),
  precio numeric not null,
  observaciones text,
  completado boolean not null default false
);

-- Mecánicos y mano de obra
create table if not exists mecanicos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  telefono text,
  especialidad text,
  trabajos_realizados integer not null default 0,
  balance_mano_obra numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists orden_mano_obra (
  id uuid primary key default uuid_generate_v4(),
  orden_trabajo_id uuid not null references ordenes_trabajo(id) on delete cascade,
  mecanico_id uuid not null references mecanicos(id),
  mecanico_nombre text,
  valor numeric not null
);

-- Mantenimiento preventivo
create table if not exists mantenimientos_preventivos (
  id uuid primary key default uuid_generate_v4(),
  moto_id uuid not null references motos(id) on delete cascade,
  tipo_mantenimiento text not null,
  ultimo_servicio timestamptz not null,
  proximo_servicio timestamptz not null,
  kilometraje_actual numeric not null,
  kilometraje_proximo numeric not null,
  notificado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_mantenimientos_moto on mantenimientos_preventivos(moto_id);

-- Vistas útiles
create or replace view vw_balance_mecanicos as
select
  m.id,
  m.nombre,
  coalesce(sum(o.valor), 0) as total_mano_obra
from mecanicos m
left join orden_mano_obra o on o.mecanico_id = m.id
group by m.id, m.nombre;

create or replace view vw_proximos_mantenimientos as
select
  mp.id,
  mp.moto_id,
  mp.tipo_mantenimiento,
  mp.proximo_servicio,
  mp.kilometraje_proximo,
  mp.notificado
from mantenimientos_preventivos mp
where mp.proximo_servicio <= now() + interval '30 days'
   or mp.kilometraje_proximo <= mp.kilometraje_actual + 1000;

-- Políticas adicionales para permitir el acceso con el rol público (anon)
-- cuando solo se proporciona la URL y la anon key desde el frontend.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clientes'
      AND policyname = 'Anon puede leer clientes'
  ) THEN
    CREATE POLICY "Anon puede leer clientes"
      ON clientes FOR SELECT
      TO anon
      USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clientes'
      AND policyname = 'Anon puede insertar clientes'
  ) THEN
    CREATE POLICY "Anon puede insertar clientes"
      ON clientes FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'motos'
      AND policyname = 'Anon puede leer motos'
  ) THEN
    CREATE POLICY "Anon puede leer motos"
      ON motos FOR SELECT
      TO anon
      USING (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'motos'
      AND policyname = 'Anon puede insertar motos'
  ) THEN
    CREATE POLICY "Anon puede insertar motos"
      ON motos FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END$$;
