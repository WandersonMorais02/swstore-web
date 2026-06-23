import { useState } from 'react'
import { Star } from 'lucide-react'

import { useMyOrders } from '../../features/account/account.hooks'
import { useCreateReview } from '../../features/products/review.hooks'
import { formatMoney } from '../../utils/money'
import type { OrderItem } from '../../types/order'

type ReviewTarget = {
  orderId: string
  productId: string
  productName: string
}

export function AccountOrdersPage() {
  const ordersQuery = useMyOrders()
  const createReviewMutation = useCreateReview()

  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

  const orders = ordersQuery.data || []

  function getProductId(item: OrderItem) {
    if (typeof item.productId === 'string') return item.productId

    return item.productId?.id || item.productId?._id
  }

  function canReview(orderStatus: string) {
    return ['PAID', 'PROCESSING', 'COMPLETED'].includes(orderStatus)
  }

  function openReview(orderId: string, item: OrderItem) {
    setReviewTarget({
      orderId,
      productId: getProductId(item),
      productName: item.name
    })

    setRating(5)
    setTitle('')
    setComment('')
  }

  function closeReview() {
    setReviewTarget(null)
    setRating(5)
    setTitle('')
    setComment('')
  }

  function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!reviewTarget) return

    createReviewMutation.mutate(
      {
        orderId: reviewTarget.orderId,
        productId: reviewTarget.productId,
        rating,
        title: title || undefined,
        comment: comment || undefined
      },
      {
        onSuccess: () => {
          closeReview()
        }
      }
    )
  }

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Meus pedidos</h2>

      <div className="mt-4 space-y-3">
        {orders.map(order => {
          const orderId = order.id || order._id || ''

          return (
            <div
              key={orderId}
              className="rounded-3xl border border-slate-100 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-slate-950">{order.code}</p>
                  <p className="text-xs text-slate-500">{order.status}</p>
                </div>

                <p className="font-black text-slate-950">
                  {formatMoney(order.total)}
                </p>
              </div>

              {!!order.items?.length && (
                <div className="mt-4 space-y-3">
                  {order.items.map(item => (
                    <div
                      key={item._id}
                      className="rounded-2xl bg-slate-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-950">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Qtd: {item.quantity} · {formatMoney(item.total)}
                          </p>
                        </div>

                        {canReview(order.status) && (
                          <button
                            onClick={() => openReview(orderId, item)}
                            className="shrink-0 rounded-2xl bg-sky-600 px-3 py-2 text-xs font-black text-white"
                          >
                            Avaliar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {!orders.length && (
          <p className="text-sm text-slate-500">Você ainda não fez pedidos.</p>
        )}
      </div>

      {reviewTarget && (
        <div className="fixed inset-0 z-[80] flex items-end bg-black/40 p-4 md:items-center md:justify-center">
          <form
            onSubmit={submitReview}
            className="w-full rounded-[2rem] bg-white p-5 shadow-xl md:max-w-md"
          >
            <h3 className="text-xl font-black text-slate-950">
              Avaliar produto
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {reviewTarget.productName}
            </p>

            <div className="mt-5">
              <p className="text-sm font-black text-slate-700">Nota</p>

              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-2xl p-1 text-amber-500"
                  >
                    <Star
                      size={30}
                      fill={value <= rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-black text-slate-700">
                Título
              </span>

              <input
                value={title}
                onChange={event => setTitle(event.target.value)}
                placeholder="Ex: Produto excelente"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-black text-slate-700">
                Comentário
              </span>

              <textarea
                value={comment}
                onChange={event => setComment(event.target.value)}
                placeholder="Conte como foi sua experiência..."
                rows={4}
                className="mt-1 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </label>

            {createReviewMutation.isError && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Não foi possível enviar a avaliação. Talvez você já tenha
                avaliado esse produto neste pedido.
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeReview}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={createReviewMutation.isPending}
                className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {createReviewMutation.isPending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
