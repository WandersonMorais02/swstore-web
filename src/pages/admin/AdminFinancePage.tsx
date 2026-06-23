import {
  CreditCard,
  DollarSign,
  Package,
  Percent,
  Wallet
} from 'lucide-react'

import { useAdminFinancial } from '../../features/admin/admin.hooks'
import { formatMoney } from '../../utils/money'

export function AdminFinancePage() {
  const financialQuery = useAdminFinancial()
  const data = financialQuery.data

  if (financialQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-3xl bg-white" />
        <div className="h-80 animate-pulse rounded-3xl bg-white" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">
          Financeiro
        </h1>

        <p className="text-sm text-slate-500">
          Controle vendas, taxas da plataforma e repasses aos sellers.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card
          icon={DollarSign}
          label="Vendas hoje"
          value={formatMoney(data?.today?.total || 0)}
        />

        <Card
          icon={Percent}
          label="Taxa hoje"
          value={formatMoney(data?.today?.platformFeeTotal || 0)}
        />

        <Card
          icon={Wallet}
          label="Vendas mês"
          value={formatMoney(data?.month?.total || 0)}
        />

        <Card
          icon={Package}
          label="Pedidos"
          value={data?.counters?.orders || 0}
        />
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-slate-950" />
          <h2 className="text-lg font-black text-slate-950">
            Resumo financeiro
          </h2>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <MoneyBox
            label="Receita total"
            value={data?.total?.total || data?.month?.total || 0}
          />

          <MoneyBox
            label="Taxas da plataforma"
            value={
              data?.total?.platformFeeTotal ||
              data?.month?.platformFeeTotal ||
              0
            }
          />

          <MoneyBox
            label="Valor líquido dos sellers"
            value={
              data?.total?.sellersNetTotal ||
              data?.month?.sellersNetTotal ||
              0
            }
          />
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">
          Repasses
        </h2>

        <div className="mt-5 space-y-3">
          <SummaryRow
            label="Repasses pendentes"
            value={formatMoney(data?.payouts?.pendingAmount || 0)}
          />

          <SummaryRow
            label="Repasses realizados"
            value={formatMoney(data?.payouts?.paidAmount || 0)}
          />

          <SummaryRow
            label="Quantidade pendente"
            value={data?.payouts?.pendingCount || 0}
          />

          <SummaryRow
            label="Quantidade paga"
            value={data?.payouts?.paidCount || 0}
          />
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
      <Icon size={22} className="text-slate-950" />

      <p className="mt-3 text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs font-bold text-slate-500">
        {label}
      </p>
    </div>
  )
}

function MoneyBox({
  label,
  value
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-3xl border border-slate-100 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>

      <p className="mt-1 text-xl font-black text-slate-950">
        {formatMoney(value)}
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
