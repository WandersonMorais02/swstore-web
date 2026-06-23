import { useState } from 'react'
import { Plus, X } from 'lucide-react'

import {
  useAddresses,
  useCreateAddress
} from '../../features/account/address.hooks'

export function AccountAddressesPage() {
  const addressesQuery = useAddresses()
  const [showForm, setShowForm] = useState(false)

  const addresses = addressesQuery.data || []

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Endereços</h2>
          <p className="text-xs text-slate-500">Locais de entrega cadastrados</p>
        </div>

        <button
          onClick={() => setShowForm(value => !value)}
          className="flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-xs font-black text-white"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Fechar' : 'Novo'}
        </button>
      </div>

      {showForm && (
        <AddressForm onCreated={() => setShowForm(false)} />
      )}

      <div className="mt-4 space-y-3">
        {addresses.map(address => (
          <div key={address.id} className="rounded-3xl border border-slate-100 p-4">
            <p className="font-black text-slate-950">
              {address.label || 'Endereço'}
              {address.isDefault && (
                <span className="ml-2 rounded-full bg-sky-50 px-2 py-1 text-[10px] text-sky-600">
                  Padrão
                </span>
              )}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {address.street}, {address.number} - {address.district}
            </p>

            <p className="text-xs text-slate-400">
              {address.city}/{address.state} - {address.zipcode}
            </p>
          </div>
        ))}

        {!addresses.length && (
          <p className="text-sm text-slate-500">Nenhum endereço cadastrado.</p>
        )}
      </div>
    </section>
  )
}

function AddressForm({ onCreated }: { onCreated: () => void }) {
  const createAddressMutation = useCreateAddress()

  const [form, setForm] = useState({
    label: '',
    recipientName: '',
    zipcode: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    isDefault: false
  })

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm(current => ({
      ...current,
      [field]: value
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    createAddressMutation.mutate(
      {
        ...form,
        state: form.state.toUpperCase()
      },
      {
        onSuccess: onCreated
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Nome do endereço" value={form.label} onChange={value => updateField('label', value)} />
        <Input label="Recebedor" value={form.recipientName} onChange={value => updateField('recipientName', value)} required />
        <Input label="CEP" value={form.zipcode} onChange={value => updateField('zipcode', value)} required />
        <Input label="Rua" value={form.street} onChange={value => updateField('street', value)} required />
        <Input label="Número" value={form.number} onChange={value => updateField('number', value)} required />
        <Input label="Complemento" value={form.complement} onChange={value => updateField('complement', value)} />
        <Input label="Bairro" value={form.district} onChange={value => updateField('district', value)} required />
        <Input label="Cidade" value={form.city} onChange={value => updateField('city', value)} required />
        <Input label="UF" value={form.state} onChange={value => updateField('state', value)} required maxLength={2} />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={event => updateField('isDefault', event.target.checked)}
        />
        Definir como endereço padrão
      </label>

      <button
        type="submit"
        disabled={createAddressMutation.isPending}
        className="mt-5 w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
      >
        {createAddressMutation.isPending ? 'Salvando...' : 'Salvar endereço'}
      </button>
    </form>
  )
}

function Input({
  label,
  value,
  onChange,
  required,
  maxLength
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
      />
    </label>
  )
}
