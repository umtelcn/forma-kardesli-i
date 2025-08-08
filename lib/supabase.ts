import { createClient } from '@supabase/supabase-js';

// process.env ile .env.local dosyasındaki bilgileri güvenli bir şekilde okuyoruz.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
