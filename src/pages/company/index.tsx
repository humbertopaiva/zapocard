// Company Admin Pages
import { PlaceholderPage } from '../../components/PlaceholderPage'

export function CompanyDashboard() {
  return (
    <PlaceholderPage
      title="Dashboard da Empresa"
      description="O dashboard com métricas da empresa estará disponível em breve."
      backTo="/admin/perfil"
      backLabel="Ver perfil"
    />
  )
}

export function CompanyProfile() {
  return (
    <PlaceholderPage
      title="Perfil da Empresa"
      description="O gerenciamento do perfil da empresa estará disponível em breve."
      backTo="/admin/dashboard"
      backLabel="Voltar ao dashboard"
    />
  )
}

export function CompanyLoyaltyCards() {
  return (
    <PlaceholderPage
      title="Cartões Fidelidade"
      description="O gerenciamento de cartões fidelidade estará disponível em breve."
      backTo="/admin/dashboard"
      backLabel="Voltar ao dashboard"
    />
  )
}

export function CompanyCustomers() {
  return (
    <PlaceholderPage
      title="Clientes"
      description="O gerenciamento de clientes estará disponível em breve."
      backTo="/admin/dashboard"
      backLabel="Voltar ao dashboard"
    />
  )
}

export function CompanySettings() {
  return (
    <PlaceholderPage
      title="Configurações"
      description="As configurações da conta estarão disponíveis em breve."
      backTo="/admin/dashboard"
      backLabel="Voltar ao dashboard"
    />
  )
}