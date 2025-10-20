import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://pvtzlkghifwckxeypdye.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// إنشاء عميل Supabase مع إعدادات Realtime محسنة
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export default supabase