import { api } from '../../services/api'

export type SellerWalletPayload = {
  preferredMethod: 'PIX' | 'BANK_ACCOUNT'

  pix?: {
    type?: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'
    key?: string
    holderName?: string
    document?: string
  }

  bankAccount?: {
    bankName?: string
    bankCode?: string
    agency?: string
    account?: string
    accountDigit?: string
    accountType?: 'CHECKING' | 'SAVINGS'
    holderName?: string
    document?: string
  }
}

export async function getSellerWallet() {
  const { data } = await api.get('/seller-wallets/me')
  return data
}

export async function saveSellerWallet(payload: SellerWalletPayload) {
  const { data } = await api.put('/seller-wallets/me', payload)
  return data
}
