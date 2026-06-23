import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettingsPayload
} from './settings.service'

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: getAdminSettings
  })
}

export function useSaveAdminSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminSettingsPayload) => saveAdminSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    }
  })
}
