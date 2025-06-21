// Public Pages
import { PlaceholderPage } from '../../components/PlaceholderPage'

export function HomePage() {
  return (
    <PlaceholderPage
      title="Página Inicial"
      description="A página inicial do sistema estará disponível em breve."
      backTo="/login"
      backLabel="Ir para Login"
    />
  )
}

export function EstablishmentsPage() {
  return (
    <PlaceholderPage
      title="Estabelecimentos"
      description="A listagem de estabelecimentos estará disponível em breve."
      backTo="/"
      backLabel="Voltar ao início"
    />
  )
}

export function CompanyProfilePage() {
  return (
    <PlaceholderPage
      title="Perfil da Empresa"
      description="A página de perfil da empresa estará disponível em breve."
      backTo="/estabelecimentos"
      backLabel="Ver estabelecimentos"
    />
  )
}

export function LoyaltyCardPage() {
  return (
    <PlaceholderPage
      title="Cartão Fidelidade"
      description="A página do cartão fidelidade estará disponível em breve."
      backTo="/estabelecimentos"
      backLabel="Ver estabelecimentos"
    />
  )
}