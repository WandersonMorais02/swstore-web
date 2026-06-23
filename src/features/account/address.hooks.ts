import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAddress, getAddresses } from './address.service'
import type { CreateAddressPayload } from '../../types/address'

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    }
  })
}
