import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { ArrowLeft, Loader2, CreditCard, Mail } from 'lucide-react'
import { cn } from '../../lib/utils'

const recoverySchema = z.object({
  email: z.string().email('Email inválido')
})

type RecoveryFormData = z.infer<typeof recoverySchema>

export function RecoveryForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { resetPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema)
  })

  const onSubmit = async (data: RecoveryFormData) => {
    setIsLoading(true)
    try {
      const { error } = await resetPassword(data.email)
      
      if (!error) {
        setEmailSent(true)
      }
    } catch (error) {
      console.error('Erro na recuperação:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <CreditCard className="h-10 w-10 text-primary-600" />
              <span className="text-2xl font-bold text-secondary-900">
                FideliCard
              </span>
            </Link>
            
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 mb-4">
              <Mail className="h-6 w-6 text-success-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-secondary-900">
              Email enviado!
            </h2>
            <p className="mt-2 text-sm text-secondary-600">
              Enviamos um link de recuperação para{' '}
              <span className="font-medium text-secondary-900">
                {getValues('email')}
              </span>
            </p>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
            <div className="text-sm text-primary-800">
              <p className="font-medium mb-2">Próximos passos:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Verifique sua caixa de entrada</li>
                <li>Clique no link de recuperação</li>
                <li>Defina uma nova senha</li>
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setEmailSent(false)}
              className="btn btn-outline w-full"
            >
              Enviar para outro email
            </button>
            
            <Link
              to="/login"
              className="btn btn-primary w-full text-center"
            >
              Voltar ao login
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-secondary-500">
              Não recebeu o email? Verifique sua pasta de spam ou entre em contato conosco.
            </p>
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
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <CreditCard className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-secondary-900">
              FideliCard
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-secondary-900">
            Recuperar senha
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Digite seu email para receber o link de recuperação
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="label text-secondary-700">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={cn(
                'input mt-1',
                errors.email && 'border-danger-300 focus-visible:ring-danger-500'
              )}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar link de recuperação'
            )}
          </button>
        </form>

        {/* Back to login */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}