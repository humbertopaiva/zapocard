import { useState, useMemo } from 'react'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Power, 
  PowerOff,
  Mail,
  Phone,
  Calendar,
  Users,
  CreditCard,
  AlertCircle
} from 'lucide-react'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

import { useCompanies, type Company } from '../../hooks/useCompanies'
import { CompanyForm } from '../../components/forms/CompanyForm'
import { cn } from '../../lib/utils'

type FilterStatus = 'all' | 'active' | 'inactive'
type SortField = 'name' | 'created_at' | 'email'
type SortOrder = 'asc' | 'desc'

export function SuperAdminCompanies() {
  const { 
    companies, 
    loading, 
    createCompany, 
    updateCompany, 
    deleteCompany, 
    toggleCompanyStatus,
    resetCompanyPassword
  } = useCompanies()

  // Estados do componente
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  
  // Estados dos modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null)
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null)
  
  // Estados de loading
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Filtrar e ordenar empresas
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      // Filtro de busca
      const matchesSearch = searchTerm === '' || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.whatsapp.includes(searchTerm)

      // Filtro de status
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && company.active) ||
        (filterStatus === 'inactive' && !company.active)

      return matchesSearch && matchesStatus
    })

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'created_at') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else {
        aValue = aValue?.toLowerCase() || ''
        bValue = bValue?.toLowerCase() || ''
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [companies, searchTerm, filterStatus, sortField, sortOrder])

  // Handlers
  const handleCreateCompany = async (data: any) => {
    setActionLoading('create')
    try {
      const result = await createCompany(data)
      if (result.success) {
        setShowCreateModal(false)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateCompany = async (data: any) => {
    if (!editingCompany) return
    
    setActionLoading('update')
    try {
      const success = await updateCompany(editingCompany.id, data)
      if (success) {
        setEditingCompany(null)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCompany = async () => {
    if (!deletingCompany) return
    
    setActionLoading('delete')
    try {
      const success = await deleteCompany(deletingCompany.id)
      if (success) {
        setDeletingCompany(null)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleStatus = async (company: Company) => {
    setActionLoading(`toggle-${company.id}`)
    try {
      await toggleCompanyStatus(company.id, !company.active)
    } finally {
      setActionLoading(null)
    }
  }

  const handleResetPassword = async (company: Company) => {
    setActionLoading(`reset-${company.id}`)
    try {
      await resetCompanyPassword(company.email)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as empresas do sistema
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Power className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">
                  {companies.filter(c => c.active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PowerOff className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Inativas</p>
                <p className="text-2xl font-bold">
                  {companies.filter(c => !c.active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Receita/Mês</p>
                <p className="text-2xl font-bold">
                  R$ {(companies.filter(c => c.active).length * 30).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou WhatsApp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Filtro de status */}
            <div className="w-full sm:w-48">
              <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ordenação */}
            <div className="w-full sm:w-48">
              <Select 
                value={`${sortField}-${sortOrder}`} 
                onValueChange={(value) => {
                  const [field, order] = value.split('-')
                  setSortField(field as SortField)
                  setSortOrder(order as SortOrder)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Nome A-Z</SelectItem>
                  <SelectItem value="name-desc">Nome Z-A</SelectItem>
                  <SelectItem value="created_at-desc">Mais recentes</SelectItem>
                  <SelectItem value="created_at-asc">Mais antigas</SelectItem>
                  <SelectItem value="email-asc">Email A-Z</SelectItem>
                  <SelectItem value="email-desc">Email Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAndSortedCompanies.length} empresa(s) encontrada(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAndSortedCompanies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">Nenhuma empresa encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando sua primeira empresa'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          {company.address && (
                            <div className="text-sm text-muted-foreground">{company.address}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {company.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {company.whatsapp}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.active ? 'default' : 'secondary'}>
                          {company.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(company.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            
                            <DropdownMenuItem onClick={() => setViewingCompany(company)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => setEditingCompany(company)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(company)}
                              disabled={actionLoading === `toggle-${company.id}`}
                            >
                              {company.active ? (
                                <>
                                  <PowerOff className="mr-2 h-4 w-4" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <Power className="mr-2 h-4 w-4" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => handleResetPassword(company)}
                              disabled={actionLoading === `reset-${company.id}`}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Resetar Senha
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => setDeletingCompany(company)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Criar Empresa */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <CompanyForm
            onSubmit={handleCreateCompany}
            onCancel={() => setShowCreateModal(false)}
            loading={actionLoading === 'create'}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Editar Empresa */}
      <Dialog open={!!editingCompany} onOpenChange={() => setEditingCompany(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <CompanyForm
            company={editingCompany}
            onSubmit={handleUpdateCompany}
            onCancel={() => setEditingCompany(null)}
            loading={actionLoading === 'update'}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Confirmar Exclusão */}
      <Dialog open={!!deletingCompany} onOpenChange={() => setDeletingCompany(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar a empresa <strong>{deletingCompany?.name}</strong>?
              <br /><br />
              <span className="text-destructive font-medium">
                Esta ação é irreversível e irá deletar:
              </span>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>A conta de usuário da empresa</li>
                <li>Todos os cartões fidelidade</li>
                <li>Todos os clientes e selos</li>
                <li>Todas as transações e histórico</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCompany(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCompany}
              disabled={actionLoading === 'delete'}
            >
              {actionLoading === 'delete' ? 'Deletando...' : 'Deletar Empresa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar Empresa */}
      <Dialog open={!!viewingCompany} onOpenChange={() => setViewingCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {viewingCompany?.name}
            </DialogTitle>
          </DialogHeader>
          
          {viewingCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{viewingCompany.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">WhatsApp</label>
                  <p className="text-sm">{viewingCompany.whatsapp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>
                    <Badge variant={viewingCompany.active ? 'default' : 'secondary'}>
                      {viewingCompany.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Criada em</label>
                  <p className="text-sm">{formatDate(viewingCompany.created_at)}</p>
                </div>
              </div>
              
              {viewingCompany.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                  <p className="text-sm">{viewingCompany.address}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}