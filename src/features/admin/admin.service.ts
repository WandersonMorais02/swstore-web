import { api } from '../../services/api'

export async function getAdminDashboard() {
  const { data } = await api.get('/dashboard/admin')
  return data
}

export async function getAdminProducts(params?: {
  status?: string
  type?: string
  sellerId?: string
}) {
  const { data } = await api.get('/products/admin', {
    params
  })

  return data
}

export async function approveProduct(productId: string) {
  const { data } = await api.patch(`/products/${productId}/approve`)
  return data
}

export async function rejectProduct(productId: string, rejectionReason: string) {
  const { data } = await api.patch(`/products/${productId}/reject`, {
    rejectionReason
  })

  return data
}

export async function getAdminSellers() {
  const { data } = await api.get('/users', {
    params: {
      role: 'SELLER'
    }
  })

  return data
}

export async function approveSeller(sellerId: string) {
  const { data } = await api.patch(`/users/${sellerId}`, {
    sellerProfile: {
      isApproved: true
    },
    isActive: true
  })

  return data
}

export async function blockSeller(sellerId: string) {
  const { data } = await api.patch(`/users/${sellerId}`, {
    sellerProfile: {
      isApproved: false
    },
    isActive: false
  })

  return data
}


export async function getAdminFinancial() {
  const { data } = await api.get('/dashboard/admin')
  return data
}
