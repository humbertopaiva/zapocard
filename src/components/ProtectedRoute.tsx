import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../hooks/useAuth'
import { Loader2, AlertTriangle, Mail, Phone } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requireActive?: boolean
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireActive = false 
}: ProtectedRouteProps) {
  const { user, profile, company, loading, initialized } = useAuth()
  const location = useLocation()

  // Se ainda está inicializando, mostra loading
  if (!initialized || loading) {
    return <LoadingScreen />
  }

  // Usuário não autenticado - redireciona para login
  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verifica role necessária
  if (requiredRole && profile.role !== requiredRole) {
    // Redireciona para dashboard apropriado baseado na role atual
    const redirectPath = profile.role === 'super_admin' 
      ? '/superadmin/dashboard' 
      : '/admin/dashboard'
    
    return <Navigate to={redirectPath} replace />
  }

  // Para empresa_admin, verifica se a empresa está ativa (quando requireActive = true)
  if (requireActive && profile.role === 'empresa_admin') {
    if (!company) {
      return <CompanyNotFoundScreen />
    }
    
    if (!company.active) {
      return <InactiveCompanyScreen company={company} />
    }
  }

  // Tudo ok, renderiza o conteúdo protegido
  return <>{children}</>
}

// Tela de loading
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="flex flex-col items-center gap-4 p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Verificando autenticação...
          </h3>
          <p className="text-sm text-muted-foreground">
            Aguarde enquanto validamos seus dados
          </p>
        </div>
      </div>
    </div>
  )
}

// Tela para empresa não encontrada
function InactiveCompanyScreen({ company }: { company: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full bg-background rounded-lg shadow-lg border p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-warning/10 mb-6">
          <AlertTriangle className="h-8 w-8 text-warning" />
        </div>
        
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Conta Inativa
        </h1>
        
        <p className="text-muted-foreground mb-6">
          A empresa <strong>{company.name}</strong> está temporariamente inativa. 
          Entre em contato com o suporte para reativar sua conta.
        </p>

        <div className="space-y-3 mb-6">
          <a
            href="mailto:suporte@fidelicard.com"
            className="flex items-center justify-center gap-2 w-full p-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Enviar Email
          </a>
          
          <a
            href="tel:+5532999999999"
            className="flex items-center justify-center gap-2 w-full p-3 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <Phone className="h-4 w-4" />
            Ligar para Suporte
          </a>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            <strong>Empresa:</strong> {company.name}<br />
            <strong>Email:</strong> {company.email}<br />
            <strong>Status:</strong> {company.active ? 'Ativa' : 'Inativa'}
          </p>
        </div>
      </div>
    </div>
  )
}

// Tela para quando não encontra dados da empresa
function CompanyNotFoundScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full bg-background rounded-lg shadow-lg border p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Dados da Empresa Não Encontrados
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Não foi possível carregar os dados da sua empresa. 
          Entre em contato com o suporte técnico.
        </p>

        <a
          href="mailto:suporte@fidelicard.com"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Contatar Suporte
        </a>
      </div>
    </div>
  )
}

// Hook para verificar permissões
export function usePermissions() {
  const { profile, company } = useAuth()

  const isSuperAdmin = profile?.role === 'super_admin'
  const isCompanyAdmin = profile?.role === 'empresa_admin'
  const isActiveCompany = company?.active || false

  const canAccessSuperAdmin = isSuperAdmin
  const canAccessCompanyAdmin = isCompanyAdmin && isActiveCompany
  const canManageSystem = isSuperAdmin
  const canManageOwnCompany = isCompanyAdmin && isActiveCompany

  return {
    isSuperAdmin,
    isCompanyAdmin,
    isActiveCompany,
    canAccessSuperAdmin,
    canAccessCompanyAdmin,
    canManageSystem,
    canManageOwnCompany
  }
}