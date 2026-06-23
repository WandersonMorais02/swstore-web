export type UserRole = 'ADMIN' | 'SELLER' | 'CUSTOMER'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  sellerProfile?: {
    storeName?: string
    isApproved?: boolean
  }
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role?: 'CUSTOMER'
}
