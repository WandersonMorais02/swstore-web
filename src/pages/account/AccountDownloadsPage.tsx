import { useDownloadLink, useMyLicenses } from '../../features/account/account.hooks'

export function AccountDownloadsPage() {
  const licensesQuery = useMyLicenses()
  const downloadMutation = useDownloadLink()

  const licenses = licensesQuery.data || []

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Meus downloads</h2>

      <div className="mt-4 space-y-3">
        {licenses.map(license => (
          <div key={license.id} className="rounded-3xl border border-slate-100 p-4">
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
          <p className="text-sm text-slate-500">Nenhum download disponível.</p>
        )}
      </div>
    </section>
  )
}
