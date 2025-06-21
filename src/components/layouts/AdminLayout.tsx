import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  MapPin,
  Tag,
  PlaneTakeoff,
  ChevronDown,
  Bell,
  Loader2
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  active?: boolean
  subItems?: NavItem[]
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { profile, company, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isSuperAdmin = profile?.role === 'super_admin'
  const isCompanyAdmin = profile?.role === 'empresa_admin'

  // Navegação para Super Admin
  const superAdminNavigation: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/superadmin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Empresas',
      href: '/superadmin/empresas',
      icon: Building2
    },
    {
      label: 'Planos',
      href: '/superadmin/planos',
      icon: PlaneTakeoff
    },
    {
      label: 'Categorias',
      href: '/superadmin/categorias',
      icon: Tag
    },
    {
      label: 'Localização',
      href: '/superadmin/localizacao',
      icon: MapPin
    },
    {
      label: 'Configurações',
      href: '/superadmin/configuracoes',
      icon: Settings
    }
  ]

  // Navegação para Company Admin
  const companyAdminNavigation: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Perfil da Empresa',
      href: '/admin/perfil',
      icon: Building2
    },
    {
      label: 'Cartões Fidelidade',
      href: '/admin/cartoes',
      icon: CreditCard
    },
    {
      label: 'Clientes',
      href: '/admin/clientes',
      icon: Users
    },
    {
      label: 'Configurações',
      href: '/admin/configuracoes',
      icon: Settings
    }
  ]

  const navigation = isSuperAdmin ? superAdminNavigation : companyAdminNavigation

  const handleSignOut = async () => {
    console.log('🚪 Clique no botão de logout')
    
    if (isLoggingOut) {
      console.log('⏳ Já está fazendo logout')
      return
    }

    setIsLoggingOut(true)
    setProfileDropdownOpen(false)
    
    try {
      await signOut()
      console.log('✅ Logout concluído, redirecionando...')
      // Força o redirecionamento
      window.location.href = '/login'
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      setIsLoggingOut(false)
    }
  }

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  // Loading state durante logout
  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Saindo do sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-200">
          <Link to="/" className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-primary-600" />
            <span className="text-lg font-semibold text-secondary-900">
              {isSuperAdmin ? 'Super Admin' : 'Empresa'}
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-secondary-400 hover:text-secondary-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Company info for company admin */}
        {isCompanyAdmin && company && (
          <div className="p-4 border-b border-secondary-200 bg-secondary-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">
                  {company.name}
                </p>
                <p className="text-xs text-secondary-500 truncate">
                  {company.email}
                </p>
              </div>
              <div className={cn(
                "flex-shrink-0 h-2 w-2 rounded-full",
                company.active ? "bg-success-500" : "bg-danger-500"
              )} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActiveRoute(item.href)
                  ? "bg-primary-100 text-primary-700 border-r-2 border-primary-600"
                  : "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-secondary-200">
          <div className="text-xs text-secondary-500 text-center">
            © 2024 FideliCard
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title - can be customized per page */}
            <div className="flex-1 lg:ml-0">
              <h1 className="text-lg font-semibold text-secondary-900">
                {/* This will be overridden by page components */}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-md relative">
                <Bell className="h-5 w-5" />
                {/* Badge de notificação */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-md text-sm hover:bg-secondary-100 transition-colors"
                  disabled={isLoggingOut}
                >
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-secondary-900">
                      {isSuperAdmin ? 'Super Admin' : company?.name || 'Empresa'}
                    </p>
                    <p className="text-xs text-secondary-500 capitalize">
                      {profile?.role.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-secondary-400 transition-transform",
                    profileDropdownOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border">
                    <div className="py-1">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-secondary-100">
                        <p className="text-sm font-medium text-secondary-900">
                          {isSuperAdmin ? 'Super Administrador' : company?.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {profile?.role === 'super_admin' ? 'Acesso total ao sistema' : 'Administrador da empresa'}
                        </p>
                      </div>

                      {/* Menu items */}
                      <Link
                        to={isSuperAdmin ? "/superadmin/configuracoes" : "/admin/configuracoes"}
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Configurações
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-secondary-100" />

                      {/* Logout button */}
                      <button
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-danger-700 hover:bg-danger-50 transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <>
                            <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                            Saindo...
                          </>
                        ) : (
                          <>
                            <LogOut className="mr-3 h-4 w-4" />
                            Sair
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  )
}