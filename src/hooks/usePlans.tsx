import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export interface Plan {
  id: string
  name: string
  price: number
  active: boolean
  created_at: string
}

export interface CreatePlanData {
  name: string
  price: number
  active?: boolean
}

export interface UpdatePlanData {
  name?: string
  price?: number
  active?: boolean
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os planos
  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar planos:', error)
        throw error
      }

      setPlans(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar planos:', err)
      setError(err.message || 'Erro ao carregar planos')
      toast.error('Erro ao carregar planos')
    } finally {
      setLoading(false)
    }
  }

  // Buscar apenas planos ativos
  const fetchActivePlans = async (): Promise<Plan[]> => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (err: any) {
      console.error('Erro ao buscar planos ativos:', err)
      return []
    }
  }

  // Criar novo plano
  const createPlan = async (data: CreatePlanData): Promise<boolean> => {
    try {
      console.log('📋 Criando novo plano:', data.name)

      const { error } = await supabase
        .from('plans')
        .insert({
          name: data.name,
          price: data.price,
          active: data.active ?? true
        })

      if (error) {
        console.error('❌ Erro ao criar plano:', error)
        throw error
      }

      console.log('✅ Plano criado')
      toast.success(`Plano "${data.name}" criado com sucesso!`)
      
      // Atualiza a lista
      await fetchPlans()
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao criar plano:', err)
      toast.error(err.message || 'Erro ao criar plano')
      return false
    }
  }

  // Atualizar plano
  const updatePlan = async (id: string, data: UpdatePlanData): Promise<boolean> => {
    try {
      console.log('📝 Atualizando plano:', id)

      const { error } = await supabase
        .from('plans')
        .update(data)
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao atualizar plano:', error)
        throw error
      }

      console.log('✅ Plano atualizado')
      toast.success('Plano atualizado com sucesso!')
      
      // Atualiza a lista
      await fetchPlans()
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao atualizar plano:', err)
      toast.error(err.message || 'Erro ao atualizar plano')
      return false
    }
  }

  // Deletar plano
  const deletePlan = async (id: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deletando plano:', id)

      // Verifica se há empresas usando este plano
      const { data: companies, error: checkError } = await supabase
        .from('companies')
        .select('id')
        .eq('plan_id', id)
        .limit(1)

      if (checkError) {
        throw checkError
      }

      if (companies && companies.length > 0) {
        throw new Error('Não é possível deletar um plano que está sendo usado por empresas')
      }

      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao deletar plano:', error)
        throw error
      }

      console.log('✅ Plano deletado')
      toast.success('Plano deletado com sucesso!')
      
      // Atualiza a lista
      await fetchPlans()
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao deletar plano:', err)
      toast.error(err.message || 'Erro ao deletar plano')
      return false
    }
  }

  // Toggle status ativo/inativo
  const togglePlanStatus = async (id: string, active: boolean): Promise<boolean> => {
    try {
      console.log(`📋 ${active ? 'Ativando' : 'Desativando'} plano:`, id)

      const { error } = await supabase
        .from('plans')
        .update({ active })
        .eq('id', id)

      if (error) {
        throw error
      }

      console.log(`✅ Plano ${active ? 'ativado' : 'desativado'}`)
      toast.success(`Plano ${active ? 'ativado' : 'desativado'} com sucesso!`)
      
      // Atualiza a lista
      await fetchPlans()
      
      return true
    } catch (err: any) {
      console.error('💥 Erro ao alterar status:', err)
      toast.error(err.message || 'Erro ao alterar status do plano')
      return false
    }
  }

  // Carregar planos na inicialização
  useEffect(() => {
    fetchPlans()
  }, [])

  return {
    plans,
    loading,
    error,
    fetchPlans,
    fetchActivePlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus
  }
}