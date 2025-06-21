import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

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
  const { user, profile, company, loading } = useAuth()
  const location = useLocation()

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-secondary-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Usuário não autenticado
  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verifica role necessária
  if (requiredRole && profile.role !== requiredRole) {
    // Redireciona para dashboard apropriado baseado na role
    const redirectPath = profile.role === 'super_admin' 
      ? '/superadmin/dashboard' 
      : '/admin/dashboard'
    
    return <Navigate to={redirectPath} replace />
  }

  // Para empresas, verifica se está ativa (quando requireActive = true)
  if (requireActive && profile.role === 'empresa_admin' && company && !company.active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-6 bg-white rounded-lg shadow-lg border">
          <div className="text-danger-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-secondary-900 mb-2">
            Conta Inativa
          </h1>
          <p className="text-secondary-600 mb-4">
            Sua conta está temporariamente inativa. Entre em contato com o suporte para mais informações.
          </p>
          <button
            onClick={() => window.location.href = 'mailto:suporte@exemplo.com'}
            className="btn btn-primary"
          >
            Entrar em Contato
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
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