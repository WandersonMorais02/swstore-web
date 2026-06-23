import { User } from 'lucide-react'
import { useAuthStore } from '../../stores/auth.store'

export function AccountSettingsPage() {
  const user = useAuthStore(state => state.user)

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <User size={24} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">Configurações</h2>
          <p className="text-xs text-slate-500">Dados da sua conta</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Info label="Nome" value={user?.name || '-'} />
        <Info label="Email" value={user?.email || '-'} />
        <Info label="Tipo de conta" value={user?.role || '-'} />
      </div>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
  )
}
