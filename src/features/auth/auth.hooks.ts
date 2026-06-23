import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { getMe, login, logout, register } from './auth.service'
import { useAuthStore } from '../../stores/auth.store'
import type { LoginPayload, RegisterPayload } from '../../types/auth'

import { useEffect } from 'react'

export function useMe() {
  const setUser = useAuthStore(state => state.setUser)

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    }

    if (query.isError) {
      setUser(null)
    }
  }, [query.data, query.isError, setUser])

  return query
}

export function useLogin() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore(state => state.setUser)

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      setUser(data.user)
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    }
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      navigate('/login')
    }
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clear = useAuthStore(state => state.clear)

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      clear()
      await queryClient.clear()
      navigate('/')
    }
  })
}
