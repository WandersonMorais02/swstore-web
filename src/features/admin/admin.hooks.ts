import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveProduct,
  getAdminDashboard,
  getAdminProducts,
  rejectProduct,
  getAdminFinancial,
  getAdminSellers,
  approveSeller,
  blockSeller
} from './admin.service'

import {

} from './admin.service'


export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboard
  })
}

export function useAdminProducts(params?: {
  status?: string
  type?: string
  sellerId?: string
}) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => getAdminProducts(params)
  })
}

export function useApproveProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => approveProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}

export function useRejectProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      rejectionReason
    }: {
      productId: string
      rejectionReason: string
    }) => rejectProduct(productId, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}


export function useAdminSellers() {
  return useQuery({
    queryKey: ['admin', 'sellers'],
    queryFn: getAdminSellers
  })
}

export function useApproveSeller() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sellerId: string) => approveSeller(sellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    }
  })
}

export function useBlockSeller() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sellerId: string) => blockSeller(sellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    }
  })
}

export function useAdminFinancial() {
  return useQuery({
    queryKey: ['admin', 'financial'],
    queryFn: getAdminFinancial
  })
}
