import { useState, useEffect } from 'react'
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
  Loader2,
  AlertCircle
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
  const { profile, company, signOut, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isSuperAdmin = profile?.role === 'super_admin'
  const isCompanyAdmin = profile?.role === 'empresa_admin'

  // Fecha dropdown quando clica em qualquer lugar
  useEffect(() => {
    function handleClickOutside() {
      setProfileDropdownOpen(false)
    }

    if (profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [profileDropdownOpen])

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

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🚪 Iniciando processo de logout')
    
    if (isLoggingOut) {
      console.log('⏳ Logout já em andamento')
      return
    }

    setIsLoggingOut(true)
    setProfileDropdownOpen(false)
    
    try {
      console.log('🔄 Chamando signOut...')
      await signOut()
      
      console.log('✅ SignOut concluído, redirecionando...')
      // Força redirecionamento para login
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      // Mesmo com erro, tenta redirecionar
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  // Se está fazendo logout, mostra tela de loading
  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Saindo do sistema...
            </h3>
            <p className="text-sm text-muted-foreground">
              Aguarde enquanto encerramos sua sessão
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link to="/" className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              {isSuperAdmin ? 'Super Admin' : 'Empresa'}
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Company info for company admin */}
        {isCompanyAdmin && company && (
          <div className="p-4 border-b border-border bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {company.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {company.email}
                </p>
              </div>
              <div className="flex items-center">
                {company.active ? (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-700 dark:text-green-400">Ativa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-700 dark:text-red-400">Inativa</span>
                  </div>
                )}
              </div>
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
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActiveRoute(item.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2024 FideliCard
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <header className="bg-background shadow-sm border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title */}
            <div className="flex-1 lg:ml-0">
              <h1 className="text-lg font-semibold text-foreground">
                {/* Será sobrescrito pelas páginas */}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md relative">
                <Bell className="h-5 w-5" />
                {/* Badge de notificação */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setProfileDropdownOpen(!profileDropdownOpen)
                  }}
                  disabled={isLoggingOut || loading}
                  className="flex items-center space-x-3 p-2 rounded-md text-sm hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-foreground">
                      {isSuperAdmin ? 'Super Admin' : company?.name || 'Empresa'}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile?.role.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    profileDropdownOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-background rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-border"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {isSuperAdmin ? 'Super Administrador' : company?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {profile?.role === 'super_admin' ? 'Acesso total ao sistema' : 'Administrador da empresa'}
                        </p>
                      </div>

                      {/* Menu items */}
                      <Link
                        to={isSuperAdmin ? "/superadmin/configuracoes" : "/admin/configuracoes"}
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Configurações
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-border" />

                      {/* Logout button */}
                      <button
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors disabled:opacity-50"
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
    </div>
  )
}