import { useState } from 'react'
import {
  Bell,
  Download,
  LogOut,
  MapPin,
  Package,
  Plus,
  User,
  X
} from 'lucide-react'

import { useAuthStore } from '../stores/auth.store'
import { useLogout } from '../features/auth/auth.hooks'
import {
  useDownloadLink,
  useMyLicenses,
  useMyNotifications,
  useMyOrders,
  useReadNotification
} from '../features/account/account.hooks'
import {
  useAddresses,
  useCreateAddress
} from '../features/account/address.hooks'
import { formatMoney } from '../utils/money'


type AccountTab = 'orders' | 'downloads' | 'addresses' | 'notifications'

const tabs = [
  { id: 'orders', label: 'Pedidos', icon: Package },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'addresses', label: 'Endereços', icon: MapPin },
  { id: 'notifications', label: 'Avisos', icon: Bell }
] as const

export function AccountPage() {
  const user = useAuthStore(state => state.user)
  const logoutMutation = useLogout()

  const ordersQuery = useMyOrders()
  const licensesQuery = useMyLicenses()
  const addressesQuery = useAddresses()
  const notificationsQuery = useMyNotifications()

  const downloadMutation = useDownloadLink()
  const readNotificationMutation = useReadNotification()

  const [activeTab, setActiveTab] = useState<AccountTab>('orders')
  const [showAddressForm, setShowAddressForm] = useState(false)

  const orders = ordersQuery.data || []
  const licenses = licensesQuery.data || []
  const addresses = addressesQuery.data || []
  const notifications = notificationsQuery.data || []

  return (
    <div className="space-y-5">

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <User size={30} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-black text-slate-950">
              {user?.name}
            </h1>
            <p className="truncate text-sm text-slate-500">{user?.email}</p>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            className="rounded-full bg-slate-100 p-3 text-slate-600"
          >
            <LogOut size={20} />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard icon={Package} label="Pedidos" value={orders.length} />
        <SummaryCard icon={Download} label="Downloads" value={licenses.length} />
        <SummaryCard icon={MapPin} label="Endereços" value={addresses.length} />
        <SummaryCard
          icon={Bell}
          label="Avisos"
          value={notifications.filter(n => !n.isRead).length}
        />
      </section>

      <section className="rounded-[2rem] bg-white p-2 shadow-sm">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-xs font-black transition ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      {activeTab === 'orders' && (
        <Panel title="Meus pedidos" subtitle="Acompanhe suas compras">
          <div className="space-y-3">
            {orders.map(order => (
              <div
                key={order.id}
                className="rounded-3xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{order.code}</p>
                    <p className="text-xs text-slate-500">{order.status}</p>
                  </div>

                  <p className="font-black text-slate-950">
                    {formatMoney(order.total)}
                  </p>
                </div>
              </div>
            ))}

            {!orders.length && (
              <EmptyState text="Você ainda não fez pedidos." />
            )}
          </div>
        </Panel>
      )}

      {activeTab === 'downloads' && (
        <Panel title="Meus downloads" subtitle="Arquivos comprados e liberados">
          <div className="space-y-3">
            {licenses.map(license => (
              <div
                key={license.id}
                className="rounded-3xl border border-slate-100 p-4"
              >
                <p className="font-black text-slate-950">
                  {license.productId?.name || 'Produto digital'}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Plano: {license.planName || 'Download'}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {license.isPermanent
                    ? 'Downloads permanentes'
                    : `Restantes: ${license.downloadsRemaining}`}
                </p>

                <button
                  onClick={() => downloadMutation.mutate(license.id)}
                  className="mt-3 rounded-2xl bg-sky-600 px-4 py-2 text-xs font-black text-white"
                >
                  Baixar
                </button>
              </div>
            ))}

            {!licenses.length && (
              <EmptyState text="Nenhum download disponível." />
            )}
          </div>
        </Panel>
      )}

      {activeTab === 'addresses' && (
        <Panel
          title="Endereços"
          subtitle="Gerencie seus locais de entrega"
          action={
            <button
              onClick={() => setShowAddressForm(value => !value)}
              className="flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-xs font-black text-white"
            >
              {showAddressForm ? <X size={16} /> : <Plus size={16} />}
              {showAddressForm ? 'Fechar' : 'Novo'}
            </button>
          }
        >
          {showAddressForm && (
            <AddressForm onCreated={() => setShowAddressForm(false)} />
          )}

          <div className="mt-4 space-y-3">
            {addresses.map(address => (
              <div
                key={address.id}
                className="rounded-3xl border border-slate-100 p-4"
              >
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
              <EmptyState text="Nenhum endereço cadastrado." />
            )}
          </div>
        </Panel>
      )}

      {activeTab === 'notifications' && (
        <Panel title="Notificações" subtitle="Avisos importantes da sua conta">
          <div className="space-y-3">
            {notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => readNotificationMutation.mutate(notification.id)}
                className={`w-full rounded-3xl border p-4 text-left ${
                  notification.isRead
                    ? 'border-slate-100'
                    : 'border-sky-200 bg-sky-50'
                }`}
              >
                <p className="font-black text-slate-950">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {notification.message}
                </p>
              </button>
            ))}

            {!notifications.length && (
              <EmptyState text="Nenhuma notificação." />
            )}
          </div>
        </Panel>
      )}
    </div>
  )
}

function Panel({
  title,
  subtitle,
  action,
  children
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {action}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500">
      {text}
    </div>
  )
}

type SummaryCardProps = {
  icon: React.ElementType
  label: string
  value: number
}

function SummaryCard({ icon: Icon, label, value }: SummaryCardProps) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <Icon size={22} className="text-sky-600" />
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
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
        onSuccess: () => {
          onCreated()
        }
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label="Nome do endereço"
          placeholder="Casa, trabalho..."
          value={form.label}
          onChange={value => updateField('label', value)}
        />

        <Input
          label="Recebedor"
          value={form.recipientName}
          onChange={value => updateField('recipientName', value)}
          required
        />

        <Input
          label="CEP"
          value={form.zipcode}
          onChange={value => updateField('zipcode', value)}
          required
        />

        <Input
          label="Rua"
          value={form.street}
          onChange={value => updateField('street', value)}
          required
        />

        <Input
          label="Número"
          value={form.number}
          onChange={value => updateField('number', value)}
          required
        />

        <Input
          label="Complemento"
          value={form.complement}
          onChange={value => updateField('complement', value)}
        />

        <Input
          label="Bairro"
          value={form.district}
          onChange={value => updateField('district', value)}
          required
        />

        <Input
          label="Cidade"
          value={form.city}
          onChange={value => updateField('city', value)}
          required
        />

        <Input
          label="UF"
          value={form.state}
          onChange={value => updateField('state', value)}
          required
          maxLength={2}
        />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={event => updateField('isDefault', event.target.checked)}
        />
        Definir como endereço padrão
      </label>

      {createAddressMutation.isError && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível cadastrar o endereço.
        </p>
      )}

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
  placeholder,
  maxLength
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
      />
    </label>
  )
}
