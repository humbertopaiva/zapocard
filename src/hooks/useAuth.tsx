import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
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
  initialized: boolean
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

  // Função para limpar dados de autenticação
  const clearAuthData = useCallback(() => {
    console.log('🧹 Limpando dados de autenticação')
    setUser(null)
    setSession(null)
    setProfile(null)
    setCompany(null)
  }, [])

  // Função para carregar perfil do usuário
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('👤 Carregando perfil para:', userId)
      
      // Busca o perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError)
        throw profileError
      }

      if (!profileData) {
        console.error('❌ Perfil não encontrado')
        throw new Error('Perfil não encontrado')
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
          // Para empresa_admin, é obrigatório ter empresa
          throw companyError
        }

        if (!companyData) {
          console.error('❌ Empresa não encontrada')
          throw new Error('Empresa não encontrada')
        }

        console.log('🏢 Empresa carregada:', companyData.name, `(${companyData.active ? 'ativa' : 'inativa'})`)
        setCompany(companyData)
      }

      return profileData
    } catch (error) {
      console.error('💥 Erro ao carregar perfil:', error)
      // Se não conseguir carregar o perfil, faz logout
      await supabase.auth.signOut()
      clearAuthData()
      throw error
    }
  }, [clearAuthData])

  // Inicialização da autenticação
  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        console.log('🚀 Inicializando autenticação...')
        
        // Busca a sessão atual
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (error) {
          console.error('❌ Erro ao buscar sessão:', error)
          setLoading(false)
          setInitialized(true)
          return
        }

        if (session?.user) {
          console.log('👍 Sessão encontrada para:', session.user.email)
          setSession(session)
          setUser(session.user)
          
          try {
            await loadUserProfile(session.user.id)
          } catch (profileError) {
            console.error('❌ Erro ao carregar perfil na inicialização:', profileError)
            // Se erro ao carregar perfil, limpa tudo
            clearAuthData()
          }
        } else {
          console.log('👎 Nenhuma sessão ativa')
        }

      } catch (error) {
        console.error('💥 Erro na inicialização:', error)
      } finally {
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
  }, [loadUserProfile, clearAuthData])

  // Listener de mudanças de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth event: ${event}`, session?.user?.email || 'sem usuário')
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session)
          setUser(session.user)
          
          try {
            await loadUserProfile(session.user.id)
          } catch (error) {
            console.error('❌ Erro ao carregar perfil no SIGNED_IN:', error)
            toast.error('Erro ao carregar dados do usuário')
          }
          
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
  }, [loadUserProfile, clearAuthData])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando login para:', email)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        console.error('❌ Erro no login:', error.message)
        let errorMessage = 'Erro ao fazer login'
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos'
        }
        
        toast.error(errorMessage)
        return { error }
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido para:', data.user.email)
        toast.success('Login realizado com sucesso!')
      }

      return { error: null }
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error)
      toast.error('Erro inesperado ao fazer login')
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Iniciando logout...')
      setLoading(true)
      
      // Primeiro limpa os dados locais
      clearAuthData()
      
      // Depois chama o logout do Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Erro no logout:', error)
        // Mesmo com erro, os dados já foram limpos
      } else {
        console.log('✅ Logout concluído')
      }
      
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      console.error('💥 Erro inesperado no logout:', error)
      // Mesmo com erro, limpa os dados locais
      clearAuthData()
      toast.success('Sessão encerrada!')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/alterar-senha`
      })

      if (error) {
        console.error('❌ Erro ao enviar email de recuperação:', error)
        let errorMessage = 'Erro ao enviar email de recuperação'
        
        if (error.message.includes('For security purposes')) {
          errorMessage = 'Por segurança, aguarde alguns minutos antes de tentar novamente'
        }
        
        toast.error(errorMessage)
      } else {
        toast.success('Email de recuperação enviado!')
      }

      return { error }
    } catch (error) {
      console.error('💥 Erro inesperado na recuperação:', error)
      toast.error('Erro inesperado')
      return { error: error as AuthError }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error('❌ Erro ao alterar senha:', error)
        toast.error('Erro ao alterar senha: ' + error.message)
      } else {
        console.log('✅ Senha alterada com sucesso')
        toast.success('Senha alterada com sucesso!')
      }

      return { error }
    } catch (error) {
      console.error('💥 Erro inesperado ao alterar senha:', error)
      toast.error('Erro inesperado')
      return { error: error as AuthError }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      try {
        await loadUserProfile(user.id)
      } catch (error) {
        console.error('❌ Erro ao atualizar perfil:', error)
        toast.error('Erro ao atualizar dados do usuário')
      }
    }
  }

  const value = {
    user,
    session,
    profile,
    company,
    loading,
    initialized,
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
  const { user, profile, loading, initialized } = useAuth()
  
  const isAuthenticated = !!user && !!profile
  const hasRequiredRole = requiredRole ? profile?.role === requiredRole : true
  
  return {
    isAuthenticated,
    hasRequiredRole,
    loading,
    initialized,
    user,
    profile
  }
}