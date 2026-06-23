import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Ticket, X } from 'lucide-react'

import { SEO } from '../components/seo/SEO'
import { useCart } from '../features/cart/cart.hooks'
import { useAddresses } from '../features/account/address.hooks'
import {
  useCreateOrderFromCart,
  useCreatePaymentCheckout
} from '../features/checkout/checkout.hooks'
import { formatMoney } from '../utils/money'

export function CheckoutPage() {
  const navigate = useNavigate()

  const cartQuery = useCart()
  const addressesQuery = useAddresses()
  const createOrderMutation = useCreateOrderFromCart()
  const paymentMutation = useCreatePaymentCheckout()

  const [addressId, setAddressId] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCouponCode, setAppliedCouponCode] = useState('')

  const cart = cartQuery.data
  const addresses = addressesQuery.data || []
  const items = cart?.items || []

  const needsShipping = items.some(item => {
    return item.productId.type === 'PHYSICAL' || item.productId.type === 'HYBRID'
  })

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = item.productId

      const selectedPlan = product.downloadPlans?.find(plan => {
        return plan._id === item.planId
      })

      const price = selectedPlan
        ? selectedPlan.price
        : product.promotionalPrice ?? product.price

      return sum + price * item.quantity
    }, 0)
  }, [items])

  const shippingGroups = useMemo(() => {
    if (!needsShipping) return []

    const sellerIds = Array.from(
      new Set(
        items
          .filter(item => {
            return (
              item.productId.type === 'PHYSICAL' ||
              item.productId.type === 'HYBRID'
            )
          })
          .map(item => {
            const seller = item.productId.sellerId
            return typeof seller === 'string' ? seller : seller.id || seller._id
          })
      )
    )

    return sellerIds.map(sellerId => ({
      sellerId,
      provider: 'PICKUP' as const,
      serviceName: 'Retirada/entrega combinada',
      amount: 0,
      deliveryTime: 1
    }))
  }, [items, needsShipping])

  function applyCoupon() {
    const normalizedCoupon = couponCode.trim().toUpperCase()

    if (!normalizedCoupon) {
      alert('Informe um cupom.')
      return
    }

    setAppliedCouponCode(normalizedCoupon)
  }

  function removeCoupon() {
    setCouponCode('')
    setAppliedCouponCode('')
  }

  async function handleFinish() {
    if (needsShipping && !addressId) {
      alert('Selecione um endereço de entrega.')
      return
    }

    const order = await createOrderMutation.mutateAsync({
      addressId: needsShipping ? addressId : undefined,
      shippingGroups,
      couponCode: appliedCouponCode || undefined
    })

    const payment = await paymentMutation.mutateAsync(order.id)

    const url = payment.checkoutUrl || payment.sandboxCheckoutUrl

    if (url) {
      window.location.href = url
      return
    }

    navigate('/minha-conta')
  }

  if (cartQuery.isLoading) {
    return (
      <>
        <SEO title="Checkout" description="Finalize sua compra com segurança." />
        <p className="text-sm text-slate-500">Carregando checkout...</p>
      </>
    )
  }

  if (!items.length) {
    return (
      <>
        <SEO title="Carrinho vazio" description="Seu carrinho está vazio." />

        <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="font-bold text-slate-950">Seu carrinho está vazio.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Checkout"
        description="Revise seus itens, endereço, cupom e finalize sua compra."
      />

      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Checkout</h1>
          <p className="text-sm text-slate-500">
            Revise os dados antes de finalizar.
          </p>
        </div>

        {needsShipping && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-sky-600" />
                <h2 className="font-black text-slate-950">Endereço</h2>
              </div>

              <button
                onClick={() => navigate('/minha-conta/enderecos')}
                className="flex items-center gap-1 text-sm font-black text-sky-600"
              >
                <Plus size={16} />
                Novo
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map(address => (
                <button
                  key={address.id}
                  onClick={() => setAddressId(address.id)}
                  className={`w-full rounded-3xl border p-4 text-left ${
                    addressId === address.id
                      ? 'border-sky-600 bg-sky-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="font-black text-slate-950">
                    {address.label || 'Endereço'}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {address.street}, {address.number} - {address.district}
                  </p>

                  <p className="text-xs text-slate-400">
                    {address.city}/{address.state} - {address.zipcode}
                  </p>
                </button>
              ))}

              {!addresses.length && (
                <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
                  Cadastre um endereço em Minha conta antes de continuar.
                </p>
              )}
            </div>
          </section>
        )}

        <section className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Ticket size={20} className="text-sky-600" />
            <h2 className="font-black text-slate-950">Cupom</h2>
          </div>

          {appliedCouponCode ? (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div>
                <p className="text-xs font-bold text-emerald-700">
                  Cupom aplicado
                </p>
                <p className="font-black text-emerald-800">
                  {appliedCouponCode}
                </p>
              </div>

              <button
                type="button"
                onClick={removeCoupon}
                className="rounded-full bg-white p-2 text-emerald-700"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={event => setCouponCode(event.target.value.toUpperCase())}
                placeholder="Ex: BEMVINDO10"
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />

              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
              >
                Aplicar
              </button>
            </div>
          )}

          <p className="mt-2 text-xs text-slate-500">
            O desconto será validado e aplicado no fechamento do pedido.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white p-5 shadow-sm">
          <h2 className="font-black text-slate-950">Resumo</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <strong className="text-slate-950">
                {formatMoney(subtotal)}
              </strong>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Frete</span>
              <strong className="text-slate-950">
                {needsShipping ? 'A combinar / retirada' : formatMoney(0)}
              </strong>
            </div>

            {appliedCouponCode && (
              <div className="flex justify-between text-emerald-600">
                <span>Cupom</span>
                <strong>{appliedCouponCode}</strong>
              </div>
            )}

            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="font-black text-slate-950">
                  Total parcial
                </span>

                <strong className="text-2xl font-black text-slate-950">
                  {formatMoney(subtotal)}
                </strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinish}
            disabled={createOrderMutation.isPending || paymentMutation.isPending}
            className="mt-5 w-full rounded-2xl bg-sky-600 px-5 py-4 text-sm font-black text-white disabled:opacity-60"
          >
            {createOrderMutation.isPending || paymentMutation.isPending
              ? 'Finalizando...'
              : 'Finalizar e pagar'}
          </button>
        </section>
      </div>
    </>
  )
}
