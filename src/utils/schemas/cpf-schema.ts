import { z } from 'zod'

function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/[^\d]/g, '')

  if (cleanCPF.length !== 11) {
    return false
  }

  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i)
  }
  let firstDigit = 11 - (sum % 11)
  if (firstDigit >= 10) {
    firstDigit = 0
  }

  if (firstDigit !== parseInt(cleanCPF[9])) {
    return false
  }

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i)
  }
  let secondDigit = 11 - (sum % 11)
  if (secondDigit >= 10) {
    secondDigit = 0
  }

  return secondDigit === parseInt(cleanCPF[10])
}

export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF must have 11 digits')
  .refine(isValidCPF, {
    message: 'Invalid CPF',
  })
