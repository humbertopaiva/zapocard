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
  const [initialized, setInitialized] = useState(false)

  // Função para limpar todos os dados
  const clearAuthData = () => {
    console.log('🧹 Limpando dados de autenticação')
    setUser(null)
    setSession(null)
    setProfile(null)
    setCompany(null)
  }

  // Função para carregar perfil do usuário
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('👤 Carregando perfil para:', userId)
      
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError)
        return null
      }

      console.log('✅ Perfil carregado:', profileData.role)
      setProfile(profileData)

      // Se for empresa_admin, busca dados da empresa
      if (profileData.role === 'empresa_admin') {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (companyError) {
          console.error('❌ Erro ao buscar empresa:', companyError)
        } else {
          console.log('🏢 Empresa carregada:', companyData.name)
          setCompany(companyData)
        }
      }

      return profileData
    } catch (error) {
      console.error('💥 Erro inesperado ao carregar perfil:', error)
      return null
    }
  }

  // Inicialização única
  useEffect(() => {
    if (initialized) return

    let isMounted = true

    const initializeAuth = async () => {
      try {
        console.log('🚀 Inicializando autenticação...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (error) {
          console.error('❌ Erro ao buscar sessão inicial:', error)
          setLoading(false)
          setInitialized(true)
          return
        }

        if (session?.user) {
          console.log('👍 Sessão encontrada para:', session.user.email)
          setSession(session)
          setUser(session.user)
          
          const profileData = await loadUserProfile(session.user.id)
          if (!profileData) {
            console.log('⚠️ Perfil não encontrado, fazendo logout')
            await supabase.auth.signOut()
          }
        } else {
          console.log('👎 Nenhuma sessão encontrada')
        }

        setLoading(false)
        setInitialized(true)
      } catch (error) {
        console.error('💥 Erro na inicialização:', error)
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [initialized])

  // Listener de mudanças de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth state: ${event}`, session?.user?.email || 'sem usuário')
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session)
          setUser(session.user)
          await loadUserProfile(session.user.id)
          
        } else if (event === 'SIGNED_OUT') {
          clearAuthData()
          
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setSession(session)
          setUser(session.user)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando login para:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Erro no login:', error.message)
        toast.error('Erro ao fazer login: ' + error.message)
        return { error }
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido!')
        toast.success('Login realizado com sucesso!')
      }

      return { error: null }
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error)
      toast.error('Erro inesperado no login')
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Iniciando logout...')
      
      // Primeiro limpa os dados locais
      clearAuthData()
      
      // Depois chama o logout do Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Erro no logout do Supabase:', error)
        // Mesmo com erro, mantém os dados limpos localmente
      } else {
        console.log('✅ Logout concluído')
      }
      
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      console.error('💥 Erro inesperado no logout:', error)
      // Mesmo com erro, limpa os dados locais
      clearAuthData()
      toast.success('Logout realizado!')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/alterar-senha`
      })

      if (error) {
        toast.error('Erro ao enviar email: ' + error.message)
      } else {
        toast.success('Email de recuperação enviado!')
      }

      return { error }
    } catch (error) {
      toast.error('Erro inesperado')
      return { error: error as AuthError }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        toast.error('Erro ao alterar senha: ' + error.message)
      } else {
        toast.success('Senha alterada com sucesso!')
      }

      return { error }
    } catch (error) {
      toast.error('Erro inesperado')
      return { error: error as AuthError }
    }
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