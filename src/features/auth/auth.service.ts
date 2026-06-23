import { api } from '../../services/api'
import type { LoginPayload, RegisterPayload, User } from '../../types/auth'

type AuthResponse = {
  token: string
  user: User
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)

  return data
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<User>('/auth/register', {
    ...payload,
    role: 'CUSTOMER'
  })

  return data
}

export async function getMe() {
  const { data } = await api.get<User>('/auth/me')

  return data
}

export async function logout() {
  const { data } = await api.post('/auth/logout')

  return data
}
