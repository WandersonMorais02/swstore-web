/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingBag,
  DollarSign,
  User
} from 'lucide-react'

import { useSellerOrders } from '../../features/orders/order.hooks'
import { formatMoney } from '../../utils/money'

const statusMap: Record<string, string> = {
  PENDING_PAYMENT: 'Pagamento pendente',
  PAID: 'Pago',
  PROCESSING: 'Processando',
  COMPLETED: 'Concluído',
  CANCELED: 'Cancelado',
  REFUNDED: 'Reembolsado'
}

export function SellerOrdersPage() {
  const ordersQuery = useSellerOrders()

  const orders = ordersQuery.data || []

  if (ordersQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-3xl bg-white"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">
          Meus pedidos
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Todas as vendas realizadas pela sua loja.
        </p>
      </section>

      {orders.length === 0 && (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <ShoppingBag
            size={48}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-lg font-black text-slate-950">
            Nenhuma venda ainda
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quando alguém comprar seus produtos eles aparecerão aqui.
          </p>
        </div>
      )}

      {orders.map((order: any) => (
        <article
          key={order.id}
          className="rounded-[2rem] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Pedido
              </p>

              <h2 className="text-lg font-black text-slate-950">
                {order.code}
              </h2>
            </div>

            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
              {statusMap[order.status] || order.status}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <InfoCard
              icon={User}
              label="Cliente"
              value={order.customer?.name || 'Cliente'}
            />

            <InfoCard
              icon={Package}
              label="Produtos"
              value={`${order.items?.length || 0}`}
            />

            <InfoCard
              icon={DollarSign}
              label="Bruto"
              value={formatMoney(order.sellerSubtotal || 0)}
            />

            <InfoCard
              icon={DollarSign}
              label="Líquido"
              value={formatMoney(order.sellerNet || 0)}
            />
          </div>

          <div className="mt-5 space-y-3">
            {order.items?.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-bold text-slate-950">
                    {item.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    Quantidade: {item.quantity}
                  </p>
                </div>

                <p className="font-black text-slate-950">
                  {formatMoney(item.total)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">
                Taxa plataforma
              </p>

              <p className="font-bold text-red-600">
                {formatMoney(order.sellerFee || 0)}
              </p>
            </div>

            <Link
              to={`/seller/pedidos/${order.id}`}
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
            >
              Ver pedido
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

function InfoCard({
  icon: Icon,
  label,
  value
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon size={18} className="text-slate-600" />

      <p className="mt-2 text-xs font-bold text-slate-500">
        {label}
      </p>

      <p className="font-black text-slate-950">
        {value}
      </p>
    </div>
  )
}
