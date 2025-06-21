import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, Loader2, CreditCard } from 'lucide-react'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || null

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  // Redireciona quando usuário e perfil estão carregados
  useEffect(() => {
    if (!loading && user && profile) {
      console.log('✅ Redirecionando usuário logado:', { email: user.email, role: profile.role })
      
      // Determina para onde redirecionar baseado no role
      const redirectPath = profile.role === 'super_admin' 
        ? '/superadmin/dashboard' 
        : '/admin/dashboard'
      
      console.log('📍 Redirecionando para:', redirectPath)
      
      // Usa window.location para garantir o redirecionamento
      window.location.href = redirectPath
    }
  }, [user, profile, loading])

  // Se já está logado e carregado, não mostra o form
  if (!loading && user && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      console.log('Submetendo login para:', data.email)
      const { error } = await signIn(data.email, data.password)
      
      if (error) {
        console.error('Erro no login:', error)
      }
      // O redirecionamento será feito pelo useEffect quando o perfil carregar
    } catch (error) {
      console.error('Erro no login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <CreditCard className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              FideliCard
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com suas credenciais para continuar
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Digite seus dados para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className={cn(errors.email && 'border-destructive')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={cn(
                      'pr-10',
                      errors.password && 'border-destructive'
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
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
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot password link */}
              <div className="flex items-center justify-end">
                <Link
                  to="/recuperar-senha"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading || loading}
                className="w-full"
                size="lg"
              >
                {isLoading || loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <a
              href="mailto:vendas@fidelicard.com"
              className="font-medium text-primary hover:text-primary/80"
            >
              Entre em contato conosco
            </a>
          </p>
        </div>

        {/* Demo credentials */}
        <Card className="bg-warning/10 border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-warning-foreground">
              Credenciais de Demonstração:
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-warning-foreground/80 space-y-1">
              <p><strong>Super Admin:</strong> humbertomoreira93@gmail.com</p>
              <p><strong>Empresa:</strong> empresa@exemplo.com / empresa123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}