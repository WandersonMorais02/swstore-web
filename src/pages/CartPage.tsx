import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem
} from '../features/cart/cart.hooks'
import { assetUrl } from '../utils/assets'
import { formatMoney } from '../utils/money'
import type { ProductFile } from '../types/product'

function getMainImage(images?: ProductFile[]) {
  if (!images?.length) return null

  return images.find(image => image.isMain) || images[0]
}

export function CartPage() {
  const navigate = useNavigate()

  const cartQuery = useCart()
  const updateItemMutation = useUpdateCartItem()
  const removeItemMutation = useRemoveCartItem()

  const cart = cartQuery.data
  const items = cart?.items || []

  const subtotal = items.reduce((sum, item) => {
    const product = item.productId

    const selectedPlan = product.downloadPlans?.find(plan => {
      return plan._id === item.planId || plan.id === item.planId
    })

    const price = selectedPlan
      ? selectedPlan.price
      : product.promotionalPrice ?? product.price

    return sum + price * item.quantity
  }, 0)

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return

    updateItemMutation.mutate({
      itemId,
      quantity
    })
  }

  if (cartQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl bg-white"
          />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-sky-600">
          <ShoppingBag size={34} />
        </div>

        <h1 className="mt-5 text-2xl font-black text-slate-950">
          Seu carrinho está vazio
        </h1>

        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          Adicione artes digitais, e-books, kits ou produtos físicos para
          continuar.
        </p>

        <Link
          to="/catalogo"
          className="mt-6 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white"
        >
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-950">Carrinho</h1>
        <p className="text-sm text-slate-500">
          Revise seus produtos antes de continuar.
        </p>
      </div>

      <div className="space-y-3">
        {items.map(item => {
          const product = item.productId
          const image = getMainImage(product.previewImages)

          const selectedPlan = product.downloadPlans?.find(plan => {
            return plan._id === item.planId || plan.id === item.planId
          })

          const unitPrice = selectedPlan
            ? selectedPlan.price
            : product.promotionalPrice ?? product.price

          const itemTotal = unitPrice * item.quantity

          const isPhysical =
            product.type === 'PHYSICAL' || product.type === 'HYBRID'

          return (
            <article
              key={item._id}
              className="rounded-[2rem] bg-white p-3 shadow-sm"
            >
              <div className="flex gap-3">
                <Link
                  to={`/produto/${product.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-slate-100"
                >
                  {image?.url ? (
                    <img
                      src={assetUrl(image.url)}
                      alt={image.alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Sem imagem
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/produto/${product.slug}`}
                        className="line-clamp-2 text-sm font-black text-slate-950"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 text-xs font-bold uppercase text-sky-600">
                        {product.type}
                      </p>

                      {selectedPlan && (
                        <p className="mt-1 text-xs text-slate-500">
                          Plano: {selectedPlan.name}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItemMutation.mutate(item._id)}
                      className="rounded-full p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    {isPhysical ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-8 text-center text-sm font-black">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Quantidade: {item.quantity}
                      </p>
                    )}

                    <div className="text-right">
                      <p className="text-xs text-slate-400">
                        {formatMoney(unitPrice)} un.
                      </p>
                      <p className="text-lg font-black text-slate-950">
                        {formatMoney(itemTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <strong className="text-slate-950">{formatMoney(subtotal)}</strong>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>Frete</span>
          <span>Calculado no checkout</span>
        </div>

        <div className="my-4 border-t border-slate-100" />

        <div className="flex items-center justify-between">
          <span className="font-black text-slate-950">Total parcial</span>
          <strong className="text-2xl font-black text-slate-950">
            {formatMoney(subtotal)}
          </strong>
        </div>

        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="mt-5 w-full rounded-2xl bg-sky-600 px-5 py-4 text-sm font-black text-white"
        >
          Continuar para checkout
        </button>
      </section>
    </div>
  )
}
