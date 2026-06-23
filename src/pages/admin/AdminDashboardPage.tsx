import { Box, Download, Package, Store, Users } from 'lucide-react'
import { useAdminDashboard } from '../../features/admin/admin.hooks'
import { formatMoney } from '../../utils/money'

export function AdminDashboardPage() {
  const dashboardQuery = useAdminDashboard()
  const data = dashboardQuery.data

  if (dashboardQuery.isLoading) {
    return <p className="text-sm text-slate-500">Carregando dashboard...</p>
  }

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card icon={Users} label="Clientes" value={data?.counters?.customers || 0} />
        <Card icon={Store} label="Sellers" value={data?.counters?.sellers || 0} />
        <Card icon={Box} label="Produtos" value={data?.counters?.products || 0} />
        <Card icon={Package} label="Pedidos" value={data?.counters?.orders || 0} />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Money label="Vendas hoje" value={data?.today?.total || 0} />
        <Money label="Taxa hoje" value={data?.today?.platformFeeTotal || 0} />
        <Money label="Vendas no mês" value={data?.month?.total || 0} />
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Download size={20} className="text-slate-950" />
          <h2 className="text-lg font-black text-slate-950">
            Pendências
          </h2>
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-500">
            Produtos aguardando aprovação
          </p>
          <p className="mt-1 text-3xl font-black text-slate-950">
            {data?.counters?.pendingProducts || 0}
          </p>
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
  value: number
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <Icon size={22} className="text-slate-950" />
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  )
}

function Money({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">
        {formatMoney(value)}
      </p>
    </div>
  )
}
