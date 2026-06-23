import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Ticket } from 'lucide-react'

import { useCart } from '../features/cart/cart.hooks'
import { useAddresses } from '../features/account/address.hooks'
import {
  useCreateOrderFromCart,
  useCreatePaymentCheckout
} from '../features/checkout/checkout.hooks'
import { formatMoney } from '../utils/money'

import { SEO } from '../components/seo/SEO'

export function CheckoutPage() {
  const navigate = useNavigate()

  const cartQuery = useCart()
  const addressesQuery = useAddresses()
  const createOrderMutation = useCreateOrderFromCart()
  const paymentMutation = useCreatePaymentCheckout()

  const [addressId, setAddressId] = useState('')
  const [couponCode, setCouponCode] = useState('')

  const cart = cartQuery.data
  const addresses = addressesQuery.data || []
  const items = cart?.items || []

  const needsShipping = items.some(item => {
    return item.productId.type === 'PHYSICAL' || item.productId.type === 'HYBRID'
  })

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = item.productId
      const selectedPlan = product.downloadPlans?.find(plan => plan._id === item.planId)

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
          .filter(item => item.productId.type === 'PHYSICAL' || item.productId.type === 'HYBRID')
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

  async function handleFinish() {
    if (needsShipping && !addressId) {
      alert('Selecione um endereço de entrega.')
      return
    }

    const order = await createOrderMutation.mutateAsync({
      addressId: needsShipping ? addressId : undefined,
      shippingGroups,
      couponCode: couponCode || undefined
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
    return <p className="text-sm text-slate-500">Carregando checkout...</p>
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
        <p className="font-bold text-slate-950">Seu carrinho está vazio.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
        <>
          <SEO
            title="SWstore - Checkout"
            description="Faça o checkout de sua compra"
          />

          <div className="space-y-10">
            ...
          </div>
        </>
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
              <MapPin size={20} className="text-indigo-600" />
              <h2 className="font-black text-slate-950">Endereço</h2>
            </div>

            <button
              onClick={() => navigate('/minha-conta')}
              className="flex items-center gap-1 text-sm font-black text-indigo-600"
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
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <p className="font-black text-slate-950">{address.label}</p>
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
          <Ticket size={20} className="text-indigo-600" />
          <h2 className="font-black text-slate-950">Cupom</h2>
        </div>

        <input
          value={couponCode}
          onChange={event => setCouponCode(event.target.value.toUpperCase())}
          placeholder="Ex: BEMVINDO10"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
        />
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="font-black text-slate-950">Resumo</h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <strong className="text-slate-950">{formatMoney(subtotal)}</strong>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>Frete</span>
            <strong className="text-slate-950">
              {needsShipping ? 'A combinar / retirada' : formatMoney(0)}
            </strong>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span className="font-black text-slate-950">Total parcial</span>
              <strong className="text-2xl font-black text-slate-950">
                {formatMoney(subtotal)}
              </strong>
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={createOrderMutation.isPending || paymentMutation.isPending}
          className="mt-5 w-full rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-black text-white disabled:opacity-60"
        >
          {createOrderMutation.isPending || paymentMutation.isPending
            ? 'Finalizando...'
            : 'Finalizar e pagar'}
        </button>
      </section>
    </div>
  )
}
