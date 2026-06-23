/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'

import {
  useSaveSellerWallet,
  useSellerWallet
} from '../../features/seller/wallet.hooks'

import type { SellerWalletPayload } from '../../features/seller/wallet.service'

type PreferredMethod = 'PIX' | 'BANK_ACCOUNT'
type PixType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'
type AccountType = 'CHECKING' | 'SAVINGS'

export function SellerSettingsPage() {
  const walletQuery = useSellerWallet()
  const saveWalletMutation = useSaveSellerWallet()

  const [form, setForm] = useState({
    preferredMethod: 'PIX' as PreferredMethod,

    pixType: 'CPF' as PixType,
    pixKey: '',
    pixHolderName: '',
    pixDocument: '',

    bankName: '',
    bankCode: '',
    agency: '',
    account: '',
    accountDigit: '',
    accountType: 'CHECKING' as AccountType,
    bankHolderName: '',
    bankDocument: ''
  })

  useEffect(() => {
    if (walletQuery.data) {
      setForm({
        preferredMethod: walletQuery.data.preferredMethod || 'PIX',

        pixType: walletQuery.data.pix?.type || 'CPF',
        pixKey: walletQuery.data.pix?.key || '',
        pixHolderName: walletQuery.data.pix?.holderName || '',
        pixDocument: walletQuery.data.pix?.document || '',

        bankName: walletQuery.data.bankAccount?.bankName || '',
        bankCode: walletQuery.data.bankAccount?.bankCode || '',
        agency: walletQuery.data.bankAccount?.agency || '',
        account: walletQuery.data.bankAccount?.account || '',
        accountDigit: walletQuery.data.bankAccount?.accountDigit || '',
        accountType: walletQuery.data.bankAccount?.accountType || 'CHECKING',
        bankHolderName: walletQuery.data.bankAccount?.holderName || '',
        bankDocument: walletQuery.data.bankAccount?.document || ''
      })
    }
  }, [walletQuery.data])

  function updateField(field: keyof typeof form, value: string) {
    setForm(current => ({
      ...current,
      [field]: value
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload: SellerWalletPayload =
      form.preferredMethod === 'PIX'
        ? {
            preferredMethod: 'PIX',
            pix: {
              type: form.pixType,
              key: form.pixKey,
              holderName: form.pixHolderName,
              document: form.pixDocument
            }
          }
        : {
            preferredMethod: 'BANK_ACCOUNT',
            bankAccount: {
              bankName: form.bankName,
              bankCode: form.bankCode,
              agency: form.agency,
              account: form.account,
              accountDigit: form.accountDigit,
              accountType: form.accountType,
              holderName: form.bankHolderName,
              document: form.bankDocument
            }
          }

    saveWalletMutation.mutate(payload)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[2rem] bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <CreditCard size={24} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">
            Dados de recebimento
          </h2>
          <p className="text-sm text-slate-500">
            Escolha PIX ou conta bancária para receber os repasses.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-100 p-4">
        <h3 className="font-black text-slate-950">Forma preferida</h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateField('preferredMethod', 'PIX')}
            className={`rounded-2xl border px-4 py-3 text-sm font-black ${
              form.preferredMethod === 'PIX'
                ? 'border-sky-600 bg-sky-50 text-sky-700'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            PIX
          </button>

          <button
            type="button"
            onClick={() => updateField('preferredMethod', 'BANK_ACCOUNT')}
            className={`rounded-2xl border px-4 py-3 text-sm font-black ${
              form.preferredMethod === 'BANK_ACCOUNT'
                ? 'border-sky-600 bg-sky-50 text-sky-700'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            Conta bancária
          </button>
        </div>
      </section>

      {form.preferredMethod === 'PIX' && (
        <section className="rounded-3xl border border-slate-100 p-4">
          <h3 className="font-black text-slate-950">PIX</h3>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Tipo de chave">
              <select
                value={form.pixType}
                onChange={event => updateField('pixType', event.target.value)}
                className="input"
                required
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
                <option value="EMAIL">Email</option>
                <option value="PHONE">Telefone</option>
                <option value="RANDOM">Aleatória</option>
              </select>
            </Field>

            <Field label="Chave PIX">
              <input
                value={form.pixKey}
                onChange={event => updateField('pixKey', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="Nome do titular">
              <input
                value={form.pixHolderName}
                onChange={event => updateField('pixHolderName', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="CPF/CNPJ do titular">
              <input
                value={form.pixDocument}
                onChange={event => updateField('pixDocument', event.target.value)}
                required
                className="input"
              />
            </Field>
          </div>
        </section>
      )}

      {form.preferredMethod === 'BANK_ACCOUNT' && (
        <section className="rounded-3xl border border-slate-100 p-4">
          <h3 className="font-black text-slate-950">Conta bancária</h3>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Nome do titular">
              <input
                value={form.bankHolderName}
                onChange={event => updateField('bankHolderName', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="CPF/CNPJ do titular">
              <input
                value={form.bankDocument}
                onChange={event => updateField('bankDocument', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="Banco">
              <input
                value={form.bankName}
                onChange={event => updateField('bankName', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="Código do banco">
              <input
                value={form.bankCode}
                onChange={event => updateField('bankCode', event.target.value)}
                placeholder="Ex: 001"
                className="input"
              />
            </Field>

            <Field label="Agência">
              <input
                value={form.agency}
                onChange={event => updateField('agency', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="Conta">
              <input
                value={form.account}
                onChange={event => updateField('account', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="Dígito">
              <input
                value={form.accountDigit}
                onChange={event => updateField('accountDigit', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="Tipo de conta">
              <select
                value={form.accountType}
                onChange={event => updateField('accountType', event.target.value)}
                className="input"
                required
              >
                <option value="CHECKING">Corrente</option>
                <option value="SAVINGS">Poupança</option>
              </select>
            </Field>
          </div>
        </section>
      )}

      {saveWalletMutation.isSuccess && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          Dados salvos com sucesso.
        </p>
      )}

      {saveWalletMutation.isError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          Não foi possível salvar os dados.
        </p>
      )}

      <button
        type="submit"
        disabled={saveWalletMutation.isPending}
        className="w-full rounded-2xl bg-sky-600 px-4 py-4 text-sm font-black text-white disabled:opacity-60"
      >
        {saveWalletMutation.isPending ? 'Salvando...' : 'Salvar dados'}
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
