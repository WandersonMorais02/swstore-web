export type Address = {
  id: string
  customerId: string
  label: string
  recipientName: string
  zipcode: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  isDefault: boolean
  isActive: boolean
}

export type CreateAddressPayload = {
  label?: string
  recipientName: string
  zipcode: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  isDefault?: boolean
}
