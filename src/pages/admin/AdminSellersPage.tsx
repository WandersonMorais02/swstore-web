/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Mail, ShieldOff, Store, User, X } from 'lucide-react'

import {
  useAdminSellers,
  useApproveSeller,
  useBlockSeller
} from '../../features/admin/admin.hooks'

export function AdminSellersPage() {
  const sellersQuery = useAdminSellers()
  const approveMutation = useApproveSeller()
  const blockMutation = useBlockSeller()

  const sellers = sellersQuery.data || []

  if (sellersQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl bg-white"
          />
        ))}
      </div>
    )
  }

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div>
        <h1 className="text-2xl font-black text-slate-950">
          Sellers
        </h1>
        <p className="text-sm text-slate-500">
          Gerencie vendedores, aprovações e bloqueios.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {sellers.map((seller: any) => {
          const sellerId = seller.id || seller._id
          const approved = seller.sellerProfile?.isApproved === true
          const active = seller.isActive !== false

          return (
            <article
              key={sellerId}
              className="rounded-3xl border border-slate-100 p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Store size={26} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">
                      {seller.sellerProfile?.storeName || seller.name}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User size={13} />
                        {seller.name}
                      </span>

                      <span className="flex items-center gap-1">
                        <Mail size={13} />
                        {seller.email}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge
                        label={approved ? 'Aprovado' : 'Pendente'}
                        variant={approved ? 'success' : 'warning'}
                      />

                      <StatusBadge
                        label={active ? 'Ativo' : 'Bloqueado'}
                        variant={active ? 'success' : 'danger'}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!approved || !active ? (
                    <button
                      onClick={() => approveMutation.mutate(sellerId)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                    >
                      <Check size={16} />
                      Aprovar
                    </button>
                  ) : null}

                  {active ? (
                    <button
                      onClick={() => blockMutation.mutate(sellerId)}
                      disabled={blockMutation.isPending}
                      className="flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                    >
                      <ShieldOff size={16} />
                      Bloquear
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}

        {!sellers.length && (
          <div className="rounded-3xl bg-slate-50 p-8 text-center">
            <X size={36} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-500">
              Nenhum seller encontrado.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function StatusBadge({
  label,
  variant
}: {
  label: string
  variant: 'success' | 'warning' | 'danger'
}) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700'
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-black ${variants[variant]}`}
    >
      {label}
    </span>
  )
}
