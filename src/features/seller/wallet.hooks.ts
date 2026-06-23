import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getSellerWallet,
  saveSellerWallet,
  type SellerWalletPayload
} from './wallet.service'

export function useSellerWallet() {
  return useQuery({
    queryKey: ['seller', 'wallet'],
    queryFn: getSellerWallet,
    retry: false
  })
}

export function useSaveSellerWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SellerWalletPayload) => saveSellerWallet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'wallet'] })
    }
  })
}
