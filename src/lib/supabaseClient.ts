import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ensureSupabaseSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.warn('No se pudo obtener la sesión de Supabase; se continuará con el rol público (anon).', error);
    return;
  }

  // Si no existe sesión, seguimos con el rol público (anon) sin intentar sign-up anónimo para evitar errores 422.
  if (!data.session) return;
};
