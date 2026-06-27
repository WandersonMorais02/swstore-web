/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../../services/api'
import type { Order } from '../../types/order'
import type { User } from '../../types/auth'
import type { UploadedFile } from '../seller/file.service'

export type License = {
  id: string
  productId: any
  planName: string
  downloadLimit: number | null
  downloadsUsed: number
  downloadsRemaining: number | null
  isPermanent: boolean
  downloadHash: string
}

export type Notification = {
  id: string
  type: string
  title: string
  message: string
  data: any
  readAt: string | null
  isRead: boolean
  createdAt: string
}

export type UpdateProfilePayload = {
  name?: string
  avatar?: UploadedFile | null
}

export async function getMyOrders() {
  const { data } = await api.get<Order[]>('/orders/me')
  return data
}

export async function getMyLicenses() {
  const { data } = await api.get<License[]>('/licenses/my')
  return data
}

export async function getDownloadLink(licenseId: string) {
  const { data } = await api.post<{ downloadUrl: string }>(
    `/licenses/${licenseId}/download-link`
  )

  return data
}

export async function getMyNotifications() {
  const { data } = await api.get<Notification[]>('/notifications/me')
  return data
}

export async function readNotification(id: string) {
  const { data } = await api.patch(`/notifications/${id}/read`)
  return data
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const { data } = await api.patch<User>('/users/me', payload)

  return data
}

export async function logoutAccount() {
  const { data } = await api.post('/auth/logout')
  return data
}
