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
    detectSessionInUrl: true
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
      company_profiles: {
        Row: {
          id: string
          company_id: string
          name: string | null
          description: string | null
          email: string | null
          whatsapp: string | null
          phone: string | null
          whatsapp_catalog: string | null
          instagram: string | null
          facebook: string | null
          tiktok: string | null
          kawai: string | null
          youtube: string | null
          linkedin: string | null
          opening_hours: string | null
          closing_hours: string | null
          avatar_url: string | null
          banner_url: string | null
          city_id: string | null
          state_id: string | null
          address: string | null
          cep: string | null
          category_id: string | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name?: string | null
          description?: string | null
          email?: string | null
          whatsapp?: string | null
          phone?: string | null
          whatsapp_catalog?: string | null
          instagram?: string | null
          facebook?: string | null
          tiktok?: string | null
          kawai?: string | null
          youtube?: string | null
          linkedin?: string | null
          opening_hours?: string | null
          closing_hours?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          city_id?: string | null
          state_id?: string | null
          address?: string | null
          cep?: string | null
          category_id?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string | null
          description?: string | null
          email?: string | null
          whatsapp?: string | null
          phone?: string | null
          whatsapp_catalog?: string | null
          instagram?: string | null
          facebook?: string | null
          tiktok?: string | null
          kawai?: string | null
          youtube?: string | null
          linkedin?: string | null
          opening_hours?: string | null
          closing_hours?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          city_id?: string | null
          state_id?: string | null
          address?: string | null
          cep?: string | null
          category_id?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          active?: boolean
          created_at?: string
        }
      }
      states: {
        Row: {
          id: string
          name: string
          uf: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          uf: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          uf?: string
          created_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          state_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          state_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          state_id?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          active?: boolean
          created_at?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          name: string
          category_id: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category_id: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category_id?: string
          active?: boolean
          created_at?: string
        }
      }
      company_subcategories: {
        Row: {
          company_id: string
          subcategory_id: string
          created_at: string
        }
        Insert: {
          company_id: string
          subcategory_id: string
          created_at?: string
        }
        Update: {
          company_id?: string
          subcategory_id?: string
          created_at?: string
        }
      }
      loyalty_cards: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          stamps_required: number
          rules: string | null
          expiration_date: string | null
          consumption_value_per_stamp: number
          image_url: string | null
          prize_slug: string
          prize_redemption_deadline: number
          active: boolean
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          stamps_required: number
          rules?: string | null
          expiration_date?: string | null
          consumption_value_per_stamp: number
          image_url?: string | null
          prize_slug: string
          prize_redemption_deadline?: number
          active?: boolean
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          stamps_required?: number
          rules?: string | null
          expiration_date?: string | null
          consumption_value_per_stamp?: number
          image_url?: string | null
          prize_slug?: string
          prize_redemption_deadline?: number
          active?: boolean
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          whatsapp: string
          company_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          whatsapp: string
          company_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          whatsapp?: string
          company_id?: string
          created_at?: string
        }
      }
      customer_stamps: {
        Row: {
          id: string
          customer_id: string
          loyalty_card_id: string
          stamps_count: number
          total_spent: number
          completed_at: string | null
          prize_redeemed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          loyalty_card_id: string
          stamps_count?: number
          total_spent?: number
          completed_at?: string | null
          prize_redeemed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          loyalty_card_id?: string
          stamps_count?: number
          total_spent?: number
          completed_at?: string | null
          prize_redeemed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stamp_transactions: {
        Row: {
          id: string
          customer_id: string
          loyalty_card_id: string
          stamps_added: number
          purchase_value: number | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          loyalty_card_id: string
          stamps_added: number
          purchase_value?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          loyalty_card_id?: string
          stamps_added?: number
          purchase_value?: number | null
          created_at?: string
        }
      }
      whatsapp_auth_tokens: {
        Row: {
          id: string
          whatsapp: string
          token: string
          expires_at: string
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          whatsapp: string
          token: string
          expires_at: string
          used_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          whatsapp?: string
          token?: string
          expires_at?: string
          used_at?: string | null
          created_at?: string
        }
      }
      daily_stats: {
        Row: {
          id: string
          company_id: string
          date: string
          stamps_redeemed: number
          cards_completed: number
          new_customers: number
          total_revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          date: string
          stamps_redeemed?: number
          cards_completed?: number
          new_customers?: number
          total_revenue?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          date?: string
          stamps_redeemed?: number
          cards_completed?: number
          new_customers?: number
          total_revenue?: number
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