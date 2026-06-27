import { useState } from 'react'
import { Camera, Save, User } from 'lucide-react'

import { SEO } from '../../components/seo/SEO'
import { useAuthStore } from '../../stores/auth.store'
import { useUpdateMyProfile } from '../../features/account/account.hooks'
import {
  uploadUserAvatar,
  type UploadedFile
} from '../../features/seller/file.service'
import { assetUrl } from '../../utils/assets'

export function AccountSettingsPage() {
  const user = useAuthStore(state => state.user)
  const updateProfileMutation = useUpdateMyProfile()

  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState<UploadedFile | null>(
    (user?.avatar as UploadedFile | null) || null
  )
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  async function handleAvatarUpload(file: File | null) {
    if (!file) return

    setUploadingAvatar(true)

    try {
      const uploaded = await uploadUserAvatar(file)
      setAvatar(uploaded)
    } finally {
      setUploadingAvatar(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user?.id) return

    updateProfileMutation.mutate({
      name,
      avatar
    })
  }

  return (
    <>
      <SEO title="Configurações da conta" />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-[2rem] bg-white p-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <User size={24} />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">
              Configurações
            </h2>
            <p className="text-xs text-slate-500">Dados da sua conta</p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-100 p-4">
          <h3 className="font-black text-slate-950">Foto de perfil</h3>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-sky-50 text-sky-600">
              {avatar?.url ? (
                <img
                  src={assetUrl(avatar.url)}
                  alt={user?.name || 'Usuário'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={42} />
              )}
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white">
              <Camera size={18} />
              {uploadingAvatar ? 'Enviando...' : 'Alterar foto'}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingAvatar}
                onChange={event => {
                  handleAvatarUpload(event.target.files?.[0] || null)
                  event.currentTarget.value = ''
                }}
                className="hidden"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 p-4">
          <h3 className="font-black text-slate-950">Dados pessoais</h3>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Nome">
              <input
                value={name}
                onChange={event => setName(event.target.value)}
                required
                className="input"
              />
            </Field>

            <Info label="Email" value={user?.email || '-'} />
            <Info label="Tipo de conta" value={user?.role || '-'} />
          </div>
        </section>

        {updateProfileMutation.isSuccess && (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            Perfil atualizado com sucesso.
          </p>
        )}

        {updateProfileMutation.isError && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            Não foi possível atualizar o perfil.
          </p>
        )}

        <button
          type="submit"
          disabled={updateProfileMutation.isPending || uploadingAvatar}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-4 text-sm font-black text-white disabled:opacity-60"
        >
          <Save size={18} />
          {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
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
            border-color: rgb(14 165 233);
          }
        `}</style>
      </form>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
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
