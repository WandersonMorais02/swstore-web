import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createLocalShippingPrice,
  createLocalShippingZone,
  deleteLocalShippingPrice,
  deleteLocalShippingZone,
  getLocalShippingPrices,
  getLocalShippingZones
} from './local-shipping.service'

export function useLocalShippingZones() {
  return useQuery({
    queryKey: ['admin', 'local-shipping', 'zones'],
    queryFn: getLocalShippingZones
  })
}

export function useCreateLocalShippingZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLocalShippingZone,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'local-shipping', 'zones']
      })
    }
  })
}

export function useDeleteLocalShippingZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLocalShippingZone,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'local-shipping', 'zones']
      })
    }
  })
}

export function useLocalShippingPrices() {
  return useQuery({
    queryKey: ['admin', 'local-shipping', 'prices'],
    queryFn: getLocalShippingPrices
  })
}

export function useCreateLocalShippingPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLocalShippingPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'local-shipping', 'prices']
      })
    }
  })
}

export function useDeleteLocalShippingPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLocalShippingPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'local-shipping', 'prices']
      })
    }
  })
}
