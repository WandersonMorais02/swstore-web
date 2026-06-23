import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminCoupons,
  updateAdminCoupon,
  type CouponPayload
} from './coupon.service'

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: getAdminCoupons
  })
}

export function useCreateAdminCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CouponPayload) => createAdminCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    }
  })
}

export function useUpdateAdminCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string
      payload: Partial<CouponPayload>
    }) => updateAdminCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    }
  })
}

export function useDeleteAdminCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAdminCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    }
  })
}
