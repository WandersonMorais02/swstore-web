import { Box, CreditCard, Package, TrendingUp } from 'lucide-react'
import { useSellerDashboard } from '../../features/seller/seller.hooks'
import { formatMoney } from '../../utils/money'

export function SellerDashboardPage() {
  const dashboardQuery = useSellerDashboard()
  const data = dashboardQuery.data

  if (dashboardQuery.isLoading) {
    return <p className="text-sm text-slate-500">Carregando dashboard...</p>
  }

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card
          icon={Box}
          label="Produtos"
          value={data?.counters?.products || 0}
        />
        <Card
          icon={Package}
          label="Pedidos"
          value={data?.total?.orders || 0}
        />
        <Card
          icon={TrendingUp}
          label="Faturamento"
          value={formatMoney(data?.total?.grossAmount || 0)}
        />
        <Card
          icon={CreditCard}
          label="Líquido"
          value={formatMoney(data?.total?.netAmount || 0)}
        />
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Resumo do mês</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Money label="Bruto" value={data?.month?.grossAmount || 0} />
          <Money label="Taxa da plataforma" value={data?.month?.platformFeeAmount || 0} />
          <Money label="Líquido" value={data?.month?.netAmount || 0} />
        </div>
      </section>
    </div>
  )
}

function Card({
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
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  )
}

function Money({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-100 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">
        {formatMoney(value)}
      </p>
    </div>
  )
}
