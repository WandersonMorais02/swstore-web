import { useQuery } from '@tanstack/react-query'
import { getSellerOrders } from './order.service'

export function useSellerOrders() {
  return useQuery({
    queryKey: ['seller-orders'],
    queryFn: getSellerOrders
  })
}
