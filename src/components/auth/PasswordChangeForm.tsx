import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, Loader2, CreditCard, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const passwordChangeSchema = z.object({
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos 1 letra minúscula, 1 maiúscula e 1 número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

export function PasswordChangeForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { updatePassword, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema)
  })

  const password = watch('password')

  // Verifica se o usuário está logado e se há um token de recuperação
  useEffect(() => {
    const hasRecoveryToken = searchParams.get('access_token')
    
    if (!hasRecoveryToken && !user) {
      navigate('/login')
    }
  }, [user, searchParams, navigate])

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsLoading(true)
    try {
      const { error } = await updatePassword(data.password)
      
      if (!error) {
        setSuccess(true)
        // Redireciona após 3 segundos
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Validação visual da senha
  const passwordRequirements = [
    { label: 'Pelo menos 8 caracteres', valid: password?.length >= 8 },
    { label: 'Uma letra minúscula', valid: /[a-z]/.test(password || '') },
    { label: 'Uma letra maiúscula', valid: /[A-Z]/.test(password || '') },
    { label: 'Um número', valid: /\d/.test(password || '') }
  ]

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 mb-6">
              <CheckCircle className="h-8 w-8 text-success-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-secondary-900">
              Senha alterada!
            </h2>
            <p className="mt-2 text-sm text-secondary-600">
              Sua senha foi alterada com sucesso. Você será redirecionado para a página de login.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-primary-100 text-primary-800 rounded-md">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecionando em 3 segundos...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <CreditCard className="mx-auto h-12 w-12 text-primary-600 mb-6" />
          <h2 className="text-3xl font-bold text-secondary-900">
            Nova senha
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Defina uma nova senha segura para sua conta
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="label text-secondary-700">
                Nova senha
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    'input pr-10',
                    errors.password && 'border-danger-300 focus-visible:ring-danger-500'
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-danger-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password requirements */}
            {password && (
              <div className="bg-secondary-50 border border-secondary-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-secondary-900 mb-2">
                  Requisitos da senha:
                </h4>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className={cn(
                        "mr-2 h-4 w-4 rounded-full flex items-center justify-center",
                        req.valid ? "bg-success-100" : "bg-secondary-200"
                      )}>
                        {req.valid && (
                          <CheckCircle className="h-3 w-3 text-success-600" />
                        )}
                      </div>
                      <span className={cn(
                        req.valid ? "text-success-700" : "text-secondary-600"
                      )}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label text-secondary-700">
                Confirmar nova senha
              </label>
              <div className="relative mt-1">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={cn(
                    'input pr-10',
                    errors.confirmPassword && 'border-danger-300 focus-visible:ring-danger-500'
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Alterando senha...
              </>
            ) : (
              'Alterar senha'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}