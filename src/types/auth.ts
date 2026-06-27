export type UserRole = 'ADMIN' | 'SELLER' | 'CUSTOMER'

export type User = {
  id: string
  name: string
  email: string

  role: UserRole

  avatar?: {
    url: string
    path?: string
  } | null

  sellerProfile?: {
    storeName?: string
    document?: string
    phone?: string

    customFeePercent?: number | null
    useCustomFee?: boolean

    balanceAvailable?: number
    balancePending?: number

    isApproved?: boolean
  }

  isActive: boolean

  createdAt: string
  updatedAt: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}
