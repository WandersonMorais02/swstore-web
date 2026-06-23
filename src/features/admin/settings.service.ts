import { api } from '../../services/api'

export type AdminSettingsPayload = {
  platformFeePercent?: number
  marketplaceName?: string
  supportEmail?: string
  supportPhone?: string
}

export async function getAdminSettings() {
  const { data } = await api.get('/settings')
  return data
}

export async function saveAdminSettings(payload: AdminSettingsPayload) {
  const { data } = await api.put('/settings', payload)
  return data
}
