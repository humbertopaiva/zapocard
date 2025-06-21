import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

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
  // Dados do perfil, se existir
  profile?: {
    description?: string
    city_id?: string
    state_id?: string
    category_id?: string
  }
  // Dados de estatísticas
  stats?: {
    total_cards: number
    total_customers: number
    last_activity: string | null
  }
}

export interface CreateCompanyData {
  name: string
  email: string
  whatsapp: string
  address?: string
  plan_id?: string
  password: string
  active?: boolean
}

export interface UpdateCompanyData {
  name?: string
  email?: string
  whatsapp?: string
  address?: string
  plan_id?: string
  active?: boolean
  password?: string // Para atualizar senha
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todas as empresas
  const fetchCompanies = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          user_profiles!companies_user_id_fkey(role)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar empresas:', error)
        throw error
      }

      setCompanies(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar empresas:', err)
      setError(err.message || 'Erro ao carregar empresas')
      toast.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  // Criar nova empresa
  const createCompany = async (data: CreateCompanyData): Promise<{ success: boolean; company?: Company }> => {
    try {
      console.log('🏢 Criando nova empresa:', data.name)

      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true, // Confirma email automaticamente
        user_metadata: {
          role: 'empresa_admin',
          company_name: data.name
        }
      })

      if (authError || !authData.user) {
        console.error('❌ Erro ao criar usuário:', authError)
        throw authError || new Error('Falha ao criar usuário')
      }

      console.log('✅ Usuário criado:', authData.user.id)

      // 2. Criar perfil de usuário
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          role: 'empresa_admin'
        })

      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError)
        // Se falhou, limpa o usuário criado
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw profileError
      }

      console.log('✅ Perfil criado')

      // 3. Criar empresa
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          user_id: authData.user.id,
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          address: data.address,
          plan_id: data.plan_id,
          active: data.active ?? true
        })
        .select()
        .single()

      if (companyError) {
        console.error('❌ Erro ao criar empresa:', companyError)
        // Se falhou, limpa tudo
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw companyError
      }

      console.log('✅ Empresa criada:', companyData.id)
      
      toast.success(`Empresa "${data.name}" criada com sucesso!`)
      
      // Atualiza a lista
      await fetchCompanies()

      return { success: true, company: companyData }
    } catch (err: any) {
      console.error('💥 Erro ao criar empresa:', err)
      const message = err.message || 'Erro ao criar empresa'
      toast.error(message)
      return { success: false }
    }
  }

  // Atualizar empresa
  const updateCompany = async (id: string, data: UpdateCompanyData): Promise<boolean> => {
    try {
      console.log('📝 Atualizando empresa:', id)

      const { error } = await supabase
        .from('companies')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao atualizar empresa:', error)
        throw error
      }

      console.log('✅ Empresa atualizada')
      toast.success('Empresa atualizada com sucesso!')
      
      // Atualiza a lista
      await fetchCompanies()
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao atualizar empresa:', err)
      toast.error(err.message || 'Erro ao atualizar empresa')
      return false
    }
  }

  // Deletar empresa (deleta usuário também)
  const deleteCompany = async (id: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deletando empresa:', id)

      // Primeiro busca o user_id da empresa
      const { data: company, error: fetchError } = await supabase
        .from('companies')
        .select('user_id')
        .eq('id', id)
        .single()

      if (fetchError || !company) {
        throw new Error('Empresa não encontrada')
      }

      // Deleta o usuário (isso vai deletar empresa e perfil por CASCADE)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(company.user_id)

      if (deleteError) {
        console.error('❌ Erro ao deletar usuário:', deleteError)
        throw deleteError
      }

      console.log('✅ Empresa deletada')
      toast.success('Empresa deletada com sucesso!')
      
      // Atualiza a lista
      await fetchCompanies()
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao deletar empresa:', err)
      toast.error(err.message || 'Erro ao deletar empresa')
      return false
    }
  }

  // Toggle status ativo/inativo
  const toggleCompanyStatus = async (id: string, active: boolean): Promise<boolean> => {
    try {
      console.log(`📋 ${active ? 'Ativando' : 'Desativando'} empresa:`, id)

      const { error } = await supabase
        .from('companies')
        .update({ 
          active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      console.log(`✅ Empresa ${active ? 'ativada' : 'desativada'}`)
      toast.success(`Empresa ${active ? 'ativada' : 'desativada'} com sucesso!`)
      
      // Atualiza a lista
      await fetchCompanies()
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao alterar status:', err)
      toast.error(err.message || 'Erro ao alterar status da empresa')
      return false
    }
  }

  // Resetar senha da empresa
  const resetCompanyPassword = async (email: string): Promise<boolean> => {
    try {
      console.log('🔑 Resetando senha para:', email)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/alterar-senha`
      })

      if (error) {
        throw error
      }

      console.log('✅ Email de reset enviado')
      toast.success('Email de recuperação enviado para a empresa!')
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao resetar senha:', err)
      toast.error(err.message || 'Erro ao enviar email de recuperação')
      return false
    }
  }

  // Buscar empresa por ID
  const getCompanyById = async (id: string): Promise<Company | null> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err: any) {
      console.error('Erro ao buscar empresa:', err)
      return null
    }
  }

  // Carregar empresas na inicialização
  useEffect(() => {
    fetchCompanies()
  }, [])

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    toggleCompanyStatus,
    resetCompanyPassword,
    getCompanyById
  }
}