/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Settings } from 'lucide-react'

import {
  useAdminSettings,
  useSaveAdminSettings
} from '../../features/admin/settings.hooks'

export function AdminSettingsPage() {
  const settingsQuery = useAdminSettings()
  const saveSettingsMutation = useSaveAdminSettings()

  const [form, setForm] = useState({
    marketplaceName: '',
    supportEmail: '',
    supportPhone: '',
    platformFeePercent: '5'
  })

  useEffect(() => {
    if (settingsQuery.data) {
      setForm({
        marketplaceName: settingsQuery.data.marketplaceName || '',
        supportEmail: settingsQuery.data.supportEmail || '',
        supportPhone: settingsQuery.data.supportPhone || '',
        platformFeePercent: String(settingsQuery.data.platformFeePercent ?? 5)
      })
    }
  }, [settingsQuery.data])

  function updateField(field: keyof typeof form, value: string) {
    setForm(current => ({
      ...current,
      [field]: value
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    saveSettingsMutation.mutate({
      marketplaceName: form.marketplaceName,
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      platformFeePercent: Number(form.platformFeePercent || 0)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[2rem] bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
          <Settings size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-950">
            Configurações
          </h1>
          <p className="text-sm text-slate-500">
            Ajuste dados da plataforma, suporte e taxa sobre vendas.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-100 p-4">
        <h2 className="font-black text-slate-950">Marketplace</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Nome da plataforma">
            <input
              value={form.marketplaceName}
              onChange={event => updateField('marketplaceName', event.target.value)}
              className="input"
              placeholder="Digital Commerce"
            />
          </Field>

          <Field label="Taxa da plataforma (%)">
            <input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={form.platformFeePercent}
              onChange={event => updateField('platformFeePercent', event.target.value)}
              className="input"
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 p-4">
        <h2 className="font-black text-slate-950">Suporte</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Email de suporte">
            <input
              type="email"
              value={form.supportEmail}
              onChange={event => updateField('supportEmail', event.target.value)}
              className="input"
              placeholder="suporte@site.com"
            />
          </Field>

          <Field label="Telefone/WhatsApp">
            <input
              value={form.supportPhone}
              onChange={event => updateField('supportPhone', event.target.value)}
              className="input"
              placeholder="(00) 00000-0000"
            />
          </Field>
        </div>
      </section>

      {saveSettingsMutation.isSuccess && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          Configurações salvas com sucesso.
        </p>
      )}

      {saveSettingsMutation.isError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          Não foi possível salvar as configurações.
        </p>
      )}

      <button
        type="submit"
        disabled={saveSettingsMutation.isPending}
        className="w-full rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white disabled:opacity-60"
      >
        {saveSettingsMutation.isPending ? 'Salvando...' : 'Salvar configurações'}
      </button>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }

        .input:focus {
          border-color: rgb(15 23 42);
        }
      `}</style>
    </form>
  )
}

function Field({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
