/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Check, Eye, X } from 'lucide-react'

import {
  useAdminProducts,
  useApproveProduct,
  useRejectProduct
} from '../../features/admin/admin.hooks'
import { assetUrl } from '../../utils/assets'
import { formatMoney } from '../../utils/money'

type RejectTarget = {
  id: string
  name: string
}

export function AdminProductsPage() {
  const [status, setStatus] = useState('PENDING_APPROVAL')
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null)
  const [reason, setReason] = useState('')

  const productsQuery = useAdminProducts({
    status: status || undefined
  })

  const approveMutation = useApproveProduct()
  const rejectMutation = useRejectProduct()

  const products = productsQuery.data || []

  function approve(productId: string) {
    approveMutation.mutate(productId)
  }

  function openReject(product: any) {
    setRejectTarget({
      id: product.id || product._id,
      name: product.name
    })
    setReason('')
  }

  function closeReject() {
    setRejectTarget(null)
    setReason('')
  }

  function confirmReject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!rejectTarget) return

    rejectMutation.mutate(
      {
        productId: rejectTarget.id,
        rejectionReason: reason
      },
      {
        onSuccess: closeReject
      }
    )
  }

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Produtos</h2>
          <p className="text-xs text-slate-500">
            Aprove ou rejeite produtos enviados pelos vendedores.
          </p>
        </div>

        <select
          value={status}
          onChange={event => setStatus(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-slate-950"
        >
          <option value="">Todos</option>
          <option value="PENDING_APPROVAL">Pendentes</option>
          <option value="APPROVED">Aprovados</option>
          <option value="REJECTED">Rejeitados</option>
          <option value="DRAFT">Rascunhos</option>
          <option value="INACTIVE">Inativos</option>
        </select>
      </div>

      {productsQuery.isLoading ? (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl bg-slate-50"
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {products.map((product: any) => {
            const id = product.id || product._id
            const image = product.previewImages?.[0]?.url
            const sellerName =
              product.sellerId?.sellerProfile?.storeName ||
              product.sellerId?.name ||
              'Seller'

            return (
              <article
                key={id}
                className="rounded-3xl border border-slate-100 p-3"
              >
                <div className="flex gap-3">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    {image ? (
                      <img
                        src={assetUrl(image)}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-black text-slate-950">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {product.type} · {product.status}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Seller: {sellerName}
                        </p>

                        <p className="mt-2 font-black text-slate-950">
                          {formatMoney(product.promotionalPrice ?? product.price)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {product.slug && product.status === 'APPROVED' && (
                          <a
                            href={`/produto/${product.slug}`}
                            target="_blank"
                            className="flex items-center gap-1 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700"
                          >
                            <Eye size={15} />
                            Ver
                          </a>
                        )}

                        {product.status === 'PENDING_APPROVAL' && (
                          <>
                            <button
                              onClick={() => approve(id)}
                              disabled={approveMutation.isPending}
                              className="flex items-center gap-1 rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60"
                            >
                              <Check size={15} />
                              Aprovar
                            </button>

                            <button
                              onClick={() => openReject(product)}
                              disabled={rejectMutation.isPending}
                              className="flex items-center gap-1 rounded-2xl bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60"
                            >
                              <X size={15} />
                              Rejeitar
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {product.rejectionReason && (
                      <p className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-700">
                        Motivo: {product.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            )
          })}

          {!products.length && (
            <p className="rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-[80] flex items-end bg-black/40 p-4 md:items-center md:justify-center">
          <form
            onSubmit={confirmReject}
            className="w-full rounded-[2rem] bg-white p-5 shadow-xl md:max-w-md"
          >
            <h3 className="text-xl font-black text-slate-950">
              Rejeitar produto
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {rejectTarget.name}
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-black text-slate-700">
                Motivo da rejeição
              </span>

              <textarea
                value={reason}
                onChange={event => setReason(event.target.value)}
                required
                minLength={2}
                rows={4}
                placeholder="Explique o que o seller precisa corrigir..."
                className="mt-1 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950"
              />
            </label>

            {rejectMutation.isError && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Não foi possível rejeitar o produto.
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeReject}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={rejectMutation.isPending}
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {rejectMutation.isPending ? 'Rejeitando...' : 'Rejeitar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
