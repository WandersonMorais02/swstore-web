/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Check, Search, Shield, Store, User, X } from 'lucide-react'

import {
  useAdminUsers,
  useUpdateAdminUser
} from '../../features/admin/admin.hooks'

type Role = 'ADMIN' | 'SELLER' | 'CUSTOMER'

const roleLabel: Record<Role, string> = {
  ADMIN: 'Admin',
  SELLER: 'Seller',
  CUSTOMER: 'Cliente'
}

export function AdminUsersPage() {
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')

  const usersQuery = useAdminUsers({
    role: role || undefined,
    search: search || undefined
  })

  const updateUserMutation = useUpdateAdminUser()

  const users = usersQuery.data || []

  function getUserId(user: any) {
    return user.id || user._id
  }

  function updateRole(user: any, nextRole: Role) {
    const userId = getUserId(user)

    const payload: any = {
      role: nextRole
    }

    if (nextRole === 'SELLER') {
      payload.sellerProfile = {
        ...(user.sellerProfile || {}),
        isApproved: user.sellerProfile?.isApproved || false,
        storeName: user.sellerProfile?.storeName || user.name
      }
    }

    updateUserMutation.mutate({
      userId,
      payload
    })
  }

  function toggleActive(user: any) {
    updateUserMutation.mutate({
      userId: getUserId(user),
      payload: {
        isActive: user.isActive === false
      }
    })
  }

  function approveSeller(user: any) {
    updateUserMutation.mutate({
      userId: getUserId(user),
      payload: {
        role: 'SELLER',
        isActive: true,
        sellerProfile: {
          ...(user.sellerProfile || {}),
          storeName: user.sellerProfile?.storeName || user.name,
          isApproved: true
        }
      }
    })
  }

  function blockSeller(user: any) {
    updateUserMutation.mutate({
      userId: getUserId(user),
      payload: {
        isActive: false,
        sellerProfile: {
          ...(user.sellerProfile || {}),
          isApproved: false
        }
      }
    })
  }

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Usuários</h1>
          <p className="text-sm text-slate-500">
            Gerencie permissões, sellers e administradores.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3">
            <Search size={17} className="text-slate-400" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar usuário"
              className="h-11 bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={role}
            onChange={event => setRole(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none"
          >
            <option value="">Todos</option>
            <option value="CUSTOMER">Clientes</option>
            <option value="SELLER">Sellers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {usersQuery.isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl bg-slate-50"
            />
          ))
        ) : (
          users.map((user: any) => {
            const userId = getUserId(user)
            const isSeller = user.role === 'SELLER'
            const sellerApproved = user.sellerProfile?.isApproved === true
            const active = user.isActive !== false

            return (
              <article
                key={userId}
                className="rounded-3xl border border-slate-100 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                      {isSeller ? <Store size={24} /> : <User size={24} />}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">
                        {user.name}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {user.email}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge>{roleLabel[user.role as Role] || user.role}</Badge>

                        <Badge variant={active ? 'success' : 'danger'}>
                          {active ? 'Ativo' : 'Bloqueado'}
                        </Badge>

                        {isSeller && (
                          <Badge variant={sellerApproved ? 'success' : 'warning'}>
                            {sellerApproved ? 'Seller aprovado' : 'Seller pendente'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                    <select
                      value={user.role}
                      onChange={event => updateRole(user, event.target.value as Role)}
                      disabled={updateUserMutation.isPending}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black outline-none"
                    >
                      <option value="CUSTOMER">Cliente</option>
                      <option value="SELLER">Seller</option>
                      <option value="ADMIN">Admin</option>
                    </select>

                    {isSeller && !sellerApproved && (
                      <button
                        onClick={() => approveSeller(user)}
                        disabled={updateUserMutation.isPending}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                      >
                        <Check size={15} />
                        Aprovar seller
                      </button>
                    )}

                    {isSeller && sellerApproved && active && (
                      <button
                        onClick={() => blockSeller(user)}
                        disabled={updateUserMutation.isPending}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                      >
                        <X size={15} />
                        Bloquear seller
                      </button>
                    )}

                    <button
                      onClick={() => toggleActive(user)}
                      disabled={updateUserMutation.isPending}
                      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-black text-white disabled:opacity-60 ${
                        active ? 'bg-slate-950' : 'bg-emerald-600'
                      }`}
                    >
                      <Shield size={15} />
                      {active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        )}

        {!usersQuery.isLoading && !users.length && (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>
    </section>
  )
}

function Badge({
  children,
  variant = 'default'
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700'
  }

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${variants[variant]}`}>
      {children}
    </span>
  )
}
