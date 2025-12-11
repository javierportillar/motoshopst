-- Permitir que el rol público (anon) lea e inserte clientes y motos.
-- Esto permite usar únicamente la URL y la anon key sin requerir sesión autenticada.

-- Clientes
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

-- Motos
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
