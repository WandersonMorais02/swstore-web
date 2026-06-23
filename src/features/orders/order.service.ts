import { api } from '../../services/api'

export async function getSellerOrders() {
  const { data } = await api.get('/orders/seller')
  return data
}
