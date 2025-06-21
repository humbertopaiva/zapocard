import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicLayout } from './components/layouts/PublicLayout'
import { AdminLayout } from './components/layouts/AdminLayout'

// Auth Components
import { LoginForm } from './components/auth/LoginForm'
import { RecoveryForm } from './components/auth/RecoveryForm'
import { PasswordChangeForm } from './components/auth/PasswordChangeForm'

// // Public Pages (to be created)
// import { HomePage } from './pages/public/HomePage'
// import { EstablishmentsPage } from './pages/public/EstablishmentsPage'
// import { CompanyProfilePage } from './pages/public/CompanyProfilePage'
// import { LoyaltyCardPage } from './pages/public/LoyaltyCardPage'

// // Super Admin Pages (to be created)
// import { SuperAdminDashboard } from './pages/superadmin/Dashboard'
// import { SuperAdminCompanies } from './pages/superadmin/Companies'
// import { SuperAdminPlans } from './pages/superadmin/Plans'
// import { SuperAdminCategories } from './pages/superadmin/Categories'
// import { SuperAdminLocation } from './pages/superadmin/Location'
// import { SuperAdminSettings } from './pages/superadmin/Settings'

// // Company Admin Pages (to be created)
// import { CompanyDashboard } from './pages/company/Dashboard'
// import { CompanyProfile } from './pages/company/Profile'
// import { CompanyLoyaltyCards } from './pages/company/LoyaltyCards'
// import { CompanyCustomers } from './pages/company/Customers'
// import { CompanySettings } from './pages/company/Settings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/recuperar-senha" element={<RecoveryForm />} />
            <Route path="/alterar-senha" element={<PasswordChangeForm />} />

            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              {/* <Route index element={<HomePage />} />
              <Route path="estabelecimentos" element={<EstablishmentsPage />} />
              <Route path="estabelecimentos/:cidade" element={<EstablishmentsPage />} />
              <Route path="estabelecimentos/:cidade/:categoria" element={<EstablishmentsPage />} />
              <Route path=":cidade/:empresa" element={<CompanyProfilePage />} />
              <Route path=":cidade/:empresa/:cartao" element={<LoyaltyCardPage />} /> */}
            </Route>

            {/* Super Admin Routes */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
              {/* <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="empresas" element={<SuperAdminCompanies />} />
              <Route path="empresas/nova" element={<SuperAdminCompanies />} />
              <Route path="empresas/:id" element={<SuperAdminCompanies />} />
              <Route path="planos" element={<SuperAdminPlans />} />
              <Route path="categorias" element={<SuperAdminCategories />} />
              <Route path="localizacao" element={<SuperAdminLocation />} />
              <Route path="configuracoes" element={<SuperAdminSettings />} /> */}
            </Route>

            {/* Company Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="empresa_admin" requireActive>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              {/* <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="perfil" element={<CompanyProfile />} />
              <Route path="cartoes" element={<CompanyLoyaltyCards />} />
              <Route path="cartoes/novo" element={<CompanyLoyaltyCards />} />
              <Route path="cartoes/:id" element={<CompanyLoyaltyCards />} />
              <Route path="clientes" element={<CompanyCustomers />} />
              <Route path="configuracoes" element={<CompanySettings />} /> */}
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff'
                }
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App