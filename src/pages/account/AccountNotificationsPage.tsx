import {
  useMyNotifications,
  useReadNotification
} from '../../features/account/account.hooks'

export function AccountNotificationsPage() {
  const notificationsQuery = useMyNotifications()
  const readMutation = useReadNotification()

  const notifications = notificationsQuery.data || []

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Notificações</h2>

      <div className="mt-4 space-y-3">
        {notifications.map(notification => (
          <button
            key={notification.id}
            onClick={() => readMutation.mutate(notification.id)}
            className={`w-full rounded-3xl border p-4 text-left ${
              notification.isRead
                ? 'border-slate-100'
                : 'border-sky-200 bg-sky-50'
            }`}
          >
            <p className="font-black text-slate-950">{notification.title}</p>
            <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
          </button>
        ))}

        {!notifications.length && (
          <p className="text-sm text-slate-500">Nenhuma notificação.</p>
        )}
      </div>
    </section>
  )
}
