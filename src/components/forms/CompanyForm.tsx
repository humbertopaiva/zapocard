import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Building2, Eye, EyeOff } from 'lucide-react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { usePlans } from '../../hooks/usePlans'
import type { Company, CreateCompanyData, UpdateCompanyData } from '../../hooks/useCompanies'

const createCompanySchema = z.object({
  name: z.string()
    .min(1, 'Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  
  whatsapp: z.string()
    .min(1, 'WhatsApp é obrigatório')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'WhatsApp deve estar no formato (99) 99999-9999'),
  
  address: z.string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional(),
  
  plan_id: z.string()
    .min(1, 'Plano é obrigatório'),
  
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
  
  active: z.boolean().default(true)
})

const updateCompanySchema = createCompanySchema
  .omit({ password: true })
  .extend({
    password: z.string().optional()
  })

type CreateFormData = z.infer<typeof createCompanySchema>
type UpdateFormData = z.infer<typeof updateCompanySchema>

interface CompanyFormProps {
  company?: Company | null
  onSubmit: (data: CreateCompanyData | UpdateCompanyData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function CompanyForm({ company, onSubmit, onCancel, loading = false }: CompanyFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { plans, loading: plansLoading, fetchActivePlans } = usePlans()
  const [availablePlans, setAvailablePlans] = useState<any[]>([])

  const isEditing = !!company

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CreateFormData | UpdateFormData>({
    resolver: zodResolver(isEditing ? updateCompanySchema : createCompanySchema),
    defaultValues: isEditing
      ? ({
          name: company?.name ?? '',
          email: company?.email ?? '',
          whatsapp: company?.whatsapp ?? '',
          address: company?.address ?? '',
          plan_id: company?.plan_id ?? '',
          active: company?.active ?? true,
          password: undefined
        } as UpdateFormData)
      : ({
          name: '',
          email: '',
          whatsapp: '',
          address: '',
          plan_id: '',
          active: true,
          password: ''
        } as CreateFormData)
  })

  // Carrega planos ativos
  useEffect(() => {
    const loadActivePlans = async () => {
      const activePlans = await fetchActivePlans()
      setAvailablePlans(activePlans)
    }
    loadActivePlans()
  }, [fetchActivePlans])

  // Máscara para WhatsApp
  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value)
    setValue('whatsapp', formatted)
  }

  const handleFormSubmit = async (data: CreateFormData | UpdateFormData) => {
    try {
      if (isEditing) {
        // Remove password se estiver vazio na edição
        const updateData = { ...data } as UpdateCompanyData
        if (!updateData.password || updateData.password.trim() === '') {
          delete updateData.password
        }
        await onSubmit(updateData)
      } else {
        await onSubmit(data as CreateCompanyData)
      }
    } catch (error) {
      console.error('Erro no formulário:', error)
    }
  }

  const isFormLoading = loading || isSubmitting || plansLoading

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>
              {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
            </CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Altere as informações da empresa abaixo'
                : 'Preencha os dados para criar uma nova empresa'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Nome da Empresa */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="Ex: Restaurante do João"
              disabled={isFormLoading}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="empresa@exemplo.com"
              disabled={isFormLoading}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            {!isEditing && (
              <p className="text-xs text-muted-foreground">
                Este será o email de login da empresa
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <Input
              {...register('whatsapp')}
              id="whatsapp"
              placeholder="(99) 99999-9999"
              disabled={isFormLoading}
              onChange={handleWhatsAppChange}
              maxLength={15}
              className={errors.whatsapp ? 'border-destructive' : ''}
            />
            {errors.whatsapp && (
              <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
            )}
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              {...register('address')}
              id="address"
              placeholder="Rua, número, bairro, cidade"
              disabled={isFormLoading}
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          {/* Plano */}
          <div className="space-y-2">
            <Label htmlFor="plan_id">Plano *</Label>
            <Select
              value={watch('plan_id')}
              onValueChange={(value) => setValue('plan_id', value)}
              disabled={isFormLoading}
            >
              <SelectTrigger className={errors.plan_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {availablePlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - R$ {plan.price.toFixed(2)}/mês
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.plan_id && (
              <p className="text-sm text-destructive">{errors.plan_id.message}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Senha {isEditing ? '(deixe vazio para manter atual)' : '*'}
            </Label>
            <div className="relative">
              <Input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isEditing ? 'Nova senha (opcional)' : 'Senha da empresa'}
                disabled={isFormLoading}
                className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isFormLoading}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
            {!isEditing && (
              <p className="text-xs text-muted-foreground">
                A empresa poderá alterar a senha após o primeiro login
              </p>
            )}
          </div>

          {/* Status Ativo */}
          <div className="flex items-center space-x-2">
            <input
              {...register('active')}
              id="active"
              type="checkbox"
              disabled={isFormLoading}
              className="rounded border-border"
            />
            <Label htmlFor="active" className="text-sm">
              Empresa ativa
            </Label>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isFormLoading}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isFormLoading}
            >
              {isFormLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Empresa'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}