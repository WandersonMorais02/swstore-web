import { CreditCard, DollarSign, Percent, Wallet } from 'lucide-react'

import { useSellerFinancial } from '../../features/seller/seller.hooks'
import { useSellerWallet } from '../../features/seller/wallet.hooks'
import { formatMoney } from '../../utils/money'

export function SellerFinancePage() {
  const financialQuery = useSellerFinancial()
  const walletQuery = useSellerWallet()

  const data = financialQuery.data
  const wallet = walletQuery.data

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Financeiro</h1>
        <p className="text-sm text-slate-500">
          Acompanhe faturamento, taxa da plataforma e valor líquido.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card
          icon={DollarSign}
          label="Bruto"
          value={formatMoney(data?.total?.grossAmount || 0)}
        />
        <Card
          icon={Percent}
          label="Taxa"
          value={formatMoney(data?.total?.platformFeeAmount || 0)}
        />
        <Card
          icon={Wallet}
          label="Líquido"
          value={formatMoney(data?.total?.netAmount || 0)}
        />
        <Card
          icon={CreditCard}
          label="Pedidos"
          value={data?.total?.orders || 0}
        />
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Resumo do mês</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Money label="Faturamento bruto" value={data?.month?.grossAmount || 0} />
          <Money label="Desconto da plataforma" value={data?.month?.platformFeeAmount || 0} />
          <Money label="Valor a receber" value={data?.month?.netAmount || 0} />
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Recebimento</h2>

        {!wallet ? (
          <p className="mt-3 text-sm text-slate-500">
            Nenhum dado de recebimento cadastrado.
          </p>
        ) : (
          <div className="mt-4 rounded-3xl border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-500">
              Método preferido
            </p>

            <p className="mt-1 text-xl font-black text-slate-950">
              {wallet.preferredMethod === 'PIX' ? 'PIX' : 'Conta bancária'}
            </p>

            {wallet.preferredMethod === 'PIX' && (
              <div className="mt-3 text-sm text-slate-600">
                <p>Tipo: {wallet.pix?.type || '-'}</p>
                <p>Chave: {wallet.pix?.key || '-'}</p>
                <p>Titular: {wallet.pix?.holderName || '-'}</p>
              </div>
            )}

            {wallet.preferredMethod === 'BANK_ACCOUNT' && (
              <div className="mt-3 text-sm text-slate-600">
                <p>Banco: {wallet.bankAccount?.bankName || '-'}</p>
                <p>Agência: {wallet.bankAccount?.agency || '-'}</p>
                <p>
                  Conta: {wallet.bankAccount?.account || '-'}-
                  {wallet.bankAccount?.accountDigit || '-'}
                </p>
                <p>Titular: {wallet.bankAccount?.holderName || '-'}</p>
              </div>
            )}
          </div>
        )}
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
