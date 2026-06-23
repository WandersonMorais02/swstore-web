import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet
} from 'lucide-react'

import { useSellerMetrics } from '../../features/seller/seller.hooks'
import { formatMoney } from '../../utils/money'

export function SellerMetricsPage() {
  const metricsQuery = useSellerMetrics()

  const data = metricsQuery.data

  if (metricsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-3xl bg-white" />
        <div className="h-96 animate-pulse rounded-3xl bg-white" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">
          Métricas
        </h1>

        <p className="text-sm text-slate-500">
          Indicadores gerais da sua operação.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          icon={Package}
          label="Produtos"
          value={data?.total?.products || 0}
        />

        <MetricCard
          icon={ShoppingCart}
          label="Pedidos"
          value={data?.total?.orders || 0}
        />

        <MetricCard
          icon={TrendingUp}
          label="Vendas"
          value={formatMoney(data?.total?.grossAmount || 0)}
        />

        <MetricCard
          icon={Wallet}
          label="Recebido"
          value={formatMoney(data?.total?.netAmount || 0)}
        />
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} />
          <h2 className="text-lg font-black text-slate-950">
            Performance
          </h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <MetricBox
            title="Pedidos aprovados"
            value={data?.completedOrders || 0}
          />

          <MetricBox
            title="Pedidos pendentes"
            value={data?.pendingOrders || 0}
          />

          <MetricBox
            title="Produtos ativos"
            value={data?.activeProducts || 0}
          />

          <MetricBox
            title="Produtos pendentes"
            value={data?.pendingProducts || 0}
          />

          <MetricBox
            title="Ticket médio"
            value={formatMoney(data?.averageTicket || 0)}
          />

          <MetricBox
            title="Faturamento mensal"
            value={formatMoney(data?.month?.grossAmount || 0)}
          />
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">
          Resumo operacional
        </h2>

        <div className="mt-5 space-y-3">
          <SummaryRow
            label="Total vendido"
            value={formatMoney(data?.total?.grossAmount || 0)}
          />

          <SummaryRow
            label="Taxas da plataforma"
            value={formatMoney(data?.total?.platformFeeAmount || 0)}
          />

          <SummaryRow
            label="Valor líquido"
            value={formatMoney(data?.total?.netAmount || 0)}
          />

          <SummaryRow
            label="Quantidade de pedidos"
            value={data?.total?.orders || 0}
          />

          <SummaryRow
            label="Produtos cadastrados"
            value={data?.total?.products || 0}
          />
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: React.ElementType
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <Icon size={22} className="text-sky-600" />

      <p className="mt-3 text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs font-bold text-slate-500">
        {label}
      </p>
    </div>
  )
}

function MetricBox({
  title,
  value
}: {
  title: string
  value: string | number
}) {
  return (
    <div className="rounded-3xl border border-slate-100 p-4">
      <p className="text-sm font-bold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="font-medium text-slate-600">
        {label}
      </span>

      <span className="font-black text-slate-950">
        {value}
      </span>
    </div>
  )
}
