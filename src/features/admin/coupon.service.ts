import { api } from '../../services/api'

export type CouponType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'

export type CouponPayload = {
  code: string
  name: string
  description?: string
  type: CouponType
  value: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  startsAt?: string
  expiresAt?: string
  isActive?: boolean
}

export async function getAdminCoupons() {
  const { data } = await api.get('/coupons')
  return data
}

export async function createAdminCoupon(payload: CouponPayload) {
  const { data } = await api.post('/coupons', payload)
  return data
}

export async function updateAdminCoupon(id: string, payload: Partial<CouponPayload>) {
  const { data } = await api.patch(`/coupons/${id}`, payload)
  return data
}

export async function deleteAdminCoupon(id: string) {
  const { data } = await api.delete(`/coupons/${id}`)
  return data
}
