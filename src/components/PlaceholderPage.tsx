import { Construction, ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface PlaceholderPageProps {
  title?: string
  description?: string
  backTo?: string
  backLabel?: string
}

export function PlaceholderPage({ 
  title = "Página em Desenvolvimento",
  description = "Esta página está sendo construída e estará disponível em breve.",
  backTo = "/",
  backLabel = "Voltar ao início"
}: PlaceholderPageProps) {
  const location = useLocation()

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-warning-100 mb-6">
          <Construction className="h-10 w-10 text-warning-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
          {title}
        </h1>
        
        <p className="text-secondary-600 mb-8">
          {description}
        </p>
        
        <div className="space-y-4">
          <Link
            to={backTo}
            className="btn btn-primary inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Link>
          
          <div className="text-xs text-secondary-500">
            Rota atual: {location.pathname}
          </div>
        </div>
      </div>
    </div>
  )
}