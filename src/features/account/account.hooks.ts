import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getDownloadLink,
  getMyLicenses,
  getMyNotifications,
  getMyOrders,
  readNotification,
  updateMyProfile,
  type UpdateProfilePayload
} from './account.service'

export function useMyOrders() {
  return useQuery({
    queryKey: ['account', 'orders'],
    queryFn: getMyOrders
  })
}

export function useMyLicenses() {
  return useQuery({
    queryKey: ['account', 'licenses'],
    queryFn: getMyLicenses
  })
}

export function useDownloadLink() {
  return useMutation({
    mutationFn: (licenseId: string) => getDownloadLink(licenseId),
    onSuccess: (data) => {
      window.open(`${import.meta.env.VITE_SOCKET_URL}${data.downloadUrl}`, '_blank')
    }
  })
}

export function useMyNotifications() {
  return useQuery({
    queryKey: ['account', 'notifications'],
    queryFn: getMyNotifications
  })
}

export function useReadNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => readNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'notifications'] })
    }
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      await queryClient.invalidateQueries({ queryKey: ['account'] })
    }
  })
}
