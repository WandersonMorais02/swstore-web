import { api } from '../../services/api'

export async function getSellerDashboard() {
  const { data } = await api.get('/dashboard/seller')
  return data
}

export async function getSellerProducts() {
  const { data } = await api.get('/products/me')
  return data
}

export async function getSellerFinancial() {
  const { data } = await api.get('/dashboard/seller')
  return data
}

export async function getSellerMetrics() {
  const { data } = await api.get('/dashboard/seller')
  return data
}
