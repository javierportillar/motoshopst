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

  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      console.warn(
        'El inicio de sesión anónimo no está disponible; usa el rol público (anon) y asegúrate de tener políticas RLS para este rol.',
        signInError
      );
    }
  }
};
