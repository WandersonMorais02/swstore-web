import { api } from '../../services/api'
import type { Address, CreateAddressPayload } from '../../types/address'

export async function getAddresses() {
  const { data } = await api.get<Address[]>('/addresses/me')
  return data
}

export async function createAddress(payload: CreateAddressPayload) {
  const { data } = await api.post<Address>('/addresses', payload)
  return data
}
