import { api } from '../../services/api'

export type LocalShippingZone = {
  id: string
  name: string
  city: string
  state: string
  zipcode: string
  isActive: boolean
}

export type LocalShippingPrice = {
  id: string
  city: string
  state: string
  zipcode: string
  originZoneId: LocalShippingZone
  destinationZoneId: LocalShippingZone
  price: number
  deliveryTime: number
  isBidirectional: boolean
  isActive: boolean
}

export async function getLocalShippingZones() {
  const { data } = await api.get<LocalShippingZone[]>('/local-shipping/zones')
  return data
}

export async function createLocalShippingZone(payload: {
  name: string
  city: string
  state: string
  zipcode: string
  isActive?: boolean
}) {
  const { data } = await api.post('/local-shipping/zones', payload)
  return data
}

export async function deleteLocalShippingZone(id: string) {
  const { data } = await api.delete(`/local-shipping/zones/${id}`)
  return data
}

export async function getLocalShippingPrices() {
  const { data } = await api.get<LocalShippingPrice[]>('/local-shipping/prices')
  return data
}

export async function createLocalShippingPrice(payload: {
  city: string
  state: string
  zipcode: string
  originZoneId: string
  destinationZoneId: string
  price: number
  deliveryTime?: number
  isBidirectional?: boolean
  isActive?: boolean
}) {
  const { data } = await api.post('/local-shipping/prices', payload)
  return data
}

export async function deleteLocalShippingPrice(id: string) {
  const { data } = await api.delete(`/local-shipping/prices/${id}`)
  return data
}
