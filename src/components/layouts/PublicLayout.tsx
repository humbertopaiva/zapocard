import { Outlet, Link } from 'react-router-dom'
import { CreditCard, MapPin, Building2, Phone, Mail } from 'lucide-react'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-40 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-secondary-900">
                FideliCard
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/estabelecimentos"
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
              >
                Estabelecimentos
              </Link>
              <Link
                to="/como-funciona"
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
              >
                Como Funciona
              </Link>
              <Link
                to="/contato"
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
              >
                Contato
              </Link>
            </nav>

            {/* Login button */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="btn btn-outline btn-sm"
              >
                Área do Cliente
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">FideliCard</span>
              </div>
              <p className="text-secondary-300 mb-4 max-w-md">
                A plataforma completa para gerenciar cartões fidelidade digitais.
                Conecte sua empresa aos seus clientes de forma moderna e eficiente.
              </p>
              <div className="flex space-x-4">
                <a
                  href="tel:+5532999999999"
                  className="flex items-center text-secondary-300 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  (32) 99999-9999
                </a>
                <a
                  href="mailto:contato@fidelicard.com"
                  className="flex items-center text-secondary-300 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  contato@fidelicard.com
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/estabelecimentos"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Estabelecimentos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/como-funciona"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contato"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termos"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacidade"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>

            {/* For companies */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Para Empresas</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/login"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Área do Cliente
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:vendas@fidelicard.com"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Seja um Parceiro
                  </a>
                </li>
                <li>
                  <Link
                    to="/planos"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Planos e Preços
                  </Link>
                </li>
                <li>
                  <Link
                    to="/suporte"
                    className="text-secondary-300 hover:text-white transition-colors"
                  >
                    Suporte
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © 2024 FideliCard. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <MapPin className="h-4 w-4 text-secondary-400" />
              <span className="text-secondary-400 text-sm">
                Juiz de Fora, MG - Brasil
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}