// Formatação de datas
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'relative') {
    return formatRelativeDate(dateObj)
  }
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: format === 'long' ? 'long' : '2-digit',
    year: 'numeric'
  }
  
  return dateObj.toLocaleDateString('pt-BR', options)
}

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeDate = (date: Date): string => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Hoje'
  } else if (diffInDays === 1) {
    return 'Ontem'
  } else if (diffInDays < 7) {
    return `${diffInDays} dias atrás`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return months === 1 ? '1 mês atrás' : `${months} meses atrás`
  } else {
    const years = Math.floor(diffInDays / 365)
    return years === 1 ? '1 ano atrás' : `${years} anos atrás`
  }
}

// Formatação de números
export const formatNumber = (num: number, options?: {
  decimals?: number
  compact?: boolean
  currency?: boolean
}): string => {
  const { decimals = 0, compact = false, currency = false } = options || {}
  
  if (currency) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }
  
  if (compact && num >= 1000) {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
  }
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

export const formatCurrency = (value: number): string => {
  return formatNumber(value, { currency: true, decimals: 2 })
}

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

// Formatação de texto
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

// Formatação de WhatsApp
export const formatWhatsAppNumber = (whatsapp: string): string => {
  const numbers = whatsapp.replace(/\D/g, '')
  
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return whatsapp
}

export const formatWhatsAppLink = (whatsapp: string, message?: string): string => {
  const numbers = whatsapp.replace(/\D/g, '')
  const formattedNumber = numbers.startsWith('55') ? numbers : `55${numbers}`
  
  let url = `https://wa.me/${formattedNumber}`
  
  if (message) {
    url += `?text=${encodeURIComponent(message)}`
  }
  
  return url
}

// Formatação de CEP
export const formatCEP = (cep: string): string => {
  const numbers = cep.replace(/\D/g, '')
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// Formatação de CNPJ
export const formatCNPJ = (cnpj: string): string => {
  const numbers = cnpj.replace(/\D/g, '')
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

// Formatação de slug
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
}

// Formatação de status
export const formatStatus = (active: boolean): {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  color: string
} => {
  if (active) {
    return {
      label: 'Ativo',
      variant: 'default',
      color: 'text-green-600'
    }
  } else {
    return {
      label: 'Inativo',
      variant: 'secondary',
      color: 'text-red-600'
    }
  }
}

// Formatação de tamanho de arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Formatação de variação percentual
export const formatVariation = (current: number, previous: number): {
  percentage: number
  isPositive: boolean
  formatted: string
} => {
  if (previous === 0) {
    return {
      percentage: current > 0 ? 100 : 0,
      isPositive: current > 0,
      formatted: current > 0 ? '+100%' : '0%'
    }
  }
  
  const percentage = ((current - previous) / previous) * 100
  const isPositive = percentage >= 0
  
  return {
    percentage: Math.abs(percentage),
    isPositive,
    formatted: `${isPositive ? '+' : '-'}${Math.abs(percentage).toFixed(1)}%`
  }
}

// Formatação de range de datas
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = formatDate(startDate, 'short')
  const end = formatDate(endDate, 'short')
  
  if (start === end) {
    return start
  }
  
  return `${start} - ${end}`
}

// Formatação de tempo decorrido
export const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInMinutes < 1) {
    return 'Agora mesmo'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`
  } else if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  } else if (diffInDays < 7) {
    return `${diffInDays} dias atrás`
  } else {
    return formatDate(date, 'short')
  }
}

// Formatação de horário de funcionamento
export const formatBusinessHours = (opening: string, closing: string): string => {
  if (!opening || !closing) return 'Não informado'
  
  return `${opening} às ${closing}`
}

// Formatação de initials para avatar
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Formatação de lista para texto
export const formatList = (items: string[], conjunction: string = 'e'): string => {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`
  
  const lastItem = items[items.length - 1]
  const otherItems = items.slice(0, -1)
  
  return `${otherItems.join(', ')} ${conjunction} ${lastItem}`
}