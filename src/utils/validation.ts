// Validações para WhatsApp
export const validateWhatsApp = (whatsapp: string): boolean => {
  // Remove todos os caracteres não numéricos
  const numbers = whatsapp.replace(/\D/g, '')
  
  // Verifica se tem 10 ou 11 dígitos (com DDD)
  return numbers.length === 10 || numbers.length === 11
}

export const formatWhatsApp = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '')
  
  // Aplica a máscara baseada na quantidade de dígitos
  if (numbers.length <= 10) {
    // Formato: (99) 9999-9999
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else {
    // Formato: (99) 99999-9999
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
}

export const cleanWhatsApp = (whatsapp: string): string => {
  return whatsapp.replace(/\D/g, '')
}

// Validações para email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validações para senha
export const validatePassword = (password: string): { 
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres')
  }
  
  if (password.length > 50) {
    errors.push('Senha deve ter no máximo 50 caracteres')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validação de CEP
export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.length === 8
}

export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// Validação de CNPJ (básica)
export const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '')
  return numbers.length === 14
}

export const formatCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

// Validação de slug
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
}

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

// Validação de URL
export const validateURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validação de horário (HH:MM)
export const validateTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

// Formatação de moeda (Real brasileiro)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Parse de moeda para número
export const parseCurrency = (value: string): number => {
  const numbers = value.replace(/[^\d,]/g, '').replace(',', '.')
  return parseFloat(numbers) || 0
}

// Validação de arquivo de imagem
export const validateImageFile = (file: File): { 
  isValid: boolean
  error?: string 
} => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.'
    }
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Arquivo muito grande. Máximo 5MB.'
    }
  }
  
  return { isValid: true }
}

// Debounce para inputs
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}