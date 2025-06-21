import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Tipagem para o banco de dados
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          role: 'super_admin' | 'empresa_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'super_admin' | 'empresa_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'super_admin' | 'empresa_admin'
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          whatsapp: string
          address: string | null
          plan_id: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          whatsapp: string
          address?: string | null
          plan_id?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          whatsapp?: string
          address?: string | null
          plan_id?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'super_admin' | 'empresa_admin'
    }
  }
}