import { Bell, Download, MapPin, Package } from 'lucide-react'

import { useMyLicenses, useMyNotifications, useMyOrders } from '../../features/account/account.hooks'
import { useAddresses } from '../../features/account/address.hooks'

export function AccountDashboardPage() {
  const ordersQuery = useMyOrders()
  const licensesQuery = useMyLicenses()
  const addressesQuery = useAddresses()
  const notificationsQuery = useMyNotifications()

  const orders = ordersQuery.data || []
  const licenses = licensesQuery.data || []
  const addresses = addressesQuery.data || []
  const notifications = notificationsQuery.data || []

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <SummaryCard icon={Package} label="Pedidos" value={orders.length} />
      <SummaryCard icon={Download} label="Downloads" value={licenses.length} />
      <SummaryCard icon={MapPin} label="Endereços" value={addresses.length} />
      <SummaryCard
        icon={Bell}
        label="Avisos"
        value={notifications.filter(item => !item.isRead).length}
      />
    </div>
  )
}

function SummaryCard({
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
      <Icon size={22} className="text-sky-600" />
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  )
}
