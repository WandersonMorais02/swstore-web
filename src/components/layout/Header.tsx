import { useEffect, useState } from 'react'
import { Download, Smartphone, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

const DISMISSED_KEY = 'swstore:pwa-install-dismissed'

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(DISMISSED_KEY) === 'true'
  })

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    function handleInstalled() {
      setInstalled(true)
      setDeferredPrompt(null)
      localStorage.setItem(DISMISSED_KEY, 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function installApp() {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setDismissed(true)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }

  function closeBanner() {
    setDismissed(true)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }

  if (!deferredPrompt || installed || dismissed) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[90] px-4 pt-3">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-3xl border border-sky-100 bg-white p-3 shadow-xl shadow-sky-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <Smartphone size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-black text-slate-950">Instale o app SWStore</p>
          <p className="text-xs leading-5 text-slate-500">
            Acesse mais rápido, receba uma experiência melhor e use como app no
            celular.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={closeBanner}
            className="hidden rounded-2xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-600 sm:inline-flex"
          >
            Agora não
          </button>

          <button
            onClick={installApp}
            className="flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-xs font-black text-white"
          >
            <Download size={16} />
            Instalar
          </button>

          <button
            onClick={closeBanner}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
