import { useState, useEffect, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { AuthError } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export type UserRole = 'super_admin' | 'empresa_admin'

export interface UserProfile {
  id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Company {
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

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  company: Company | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Busca a sessão inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
          setCompany(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      // Busca o perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
        return
      }

      setProfile(profileData)

      // Se for empresa_admin, busca os dados da empresa
      if (profileData.role === 'empresa_admin') {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (companyError) {
          console.error('Erro ao buscar empresa:', companyError)
        } else {
          setCompany(companyData)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error('Erro ao fazer login: ' + error.message)
    } else {
      toast.success('Login realizado com sucesso!')
    }

    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      toast.error('Erro ao fazer logout: ' + error.message)
    } else {
      toast.success('Logout realizado com sucesso!')
      setProfile(null)
      setCompany(null)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/alterar-senha`
    })

    if (error) {
      toast.error('Erro ao enviar email de recuperação: ' + error.message)
    } else {
      toast.success('Email de recuperação enviado com sucesso!')
    }

    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      toast.error('Erro ao alterar senha: ' + error.message)
    } else {
      toast.success('Senha alterada com sucesso!')
    }

    return { error }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const value = {
    user,
    session,
    profile,
    company,
    loading,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export function useRequireAuth(requiredRole?: UserRole) {
  const { user, profile, loading } = useAuth()
  
  const isAuthenticated = !!user && !!profile
  const hasRequiredRole = requiredRole ? profile?.role === requiredRole : true
  
  return {
    isAuthenticated,
    hasRequiredRole,
    loading,
    user,
    profile
  }
}