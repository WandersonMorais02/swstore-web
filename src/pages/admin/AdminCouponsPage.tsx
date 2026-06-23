/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Plus, TicketPercent, Trash2 } from 'lucide-react'

import {
  useAdminCoupons,
  useCreateAdminCoupon,
  useDeleteAdminCoupon,
  useUpdateAdminCoupon
} from '../../features/admin/coupon.hooks'
import { formatMoney } from '../../utils/money'
import type { CouponType } from '../../features/admin/coupon.service'

function moneyToCents(value: string) {
  return Number(value.replace(/\D/g, '') || 0)
}

function formatCouponValue(type: CouponType, value: number) {
  if (type === 'PERCENTAGE') return `${value}%`
  if (type === 'FREE_SHIPPING') return 'Frete grátis'
  return formatMoney(value)
}

export function AdminCouponsPage() {
  const couponsQuery = useAdminCoupons()
  const createCouponMutation = useCreateAdminCoupon()
  const updateCouponMutation = useUpdateAdminCoupon()
  const deleteCouponMutation = useDeleteAdminCoupon()

  const coupons = couponsQuery.data || []

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE' as CouponType,
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    startsAt: '',
    expiresAt: '',
    isActive: true
  })

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm(current => ({
      ...current,
      [field]: value
    }))
  }

  function normalizeValue() {
    if (form.type === 'FREE_SHIPPING') return 0
    if (form.type === 'PERCENTAGE') return Number(form.value || 0)
    return moneyToCents(form.value)
  }

  function submitCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    createCouponMutation.mutate(
      {
        code: form.code.trim().toUpperCase(),
        name: form.name,
        description: form.description || undefined,
        type: form.type,
        value: normalizeValue(),
        minOrderAmount: form.minOrderAmount
          ? moneyToCents(form.minOrderAmount)
          : undefined,
        maxDiscountAmount: form.maxDiscountAmount
          ? moneyToCents(form.maxDiscountAmount)
          : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        startsAt: form.startsAt || undefined,
        expiresAt: form.expiresAt || undefined,
        isActive: form.isActive
      },
      {
        onSuccess: () => {
          setForm({
            code: '',
            name: '',
            description: '',
            type: 'PERCENTAGE',
            value: '',
            minOrderAmount: '',
            maxDiscountAmount: '',
            usageLimit: '',
            startsAt: '',
            expiresAt: '',
            isActive: true
          })
        }
      }
    )
  }

  function toggleCoupon(coupon: any) {
    updateCouponMutation.mutate({
      id: coupon.id || coupon._id,
      payload: {
        isActive: !coupon.isActive
      }
    })
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <TicketPercent size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-950">Cupons</h1>
            <p className="text-sm text-slate-500">
              Crie códigos promocionais para aplicar no checkout.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={submitCoupon}
        className="rounded-[2rem] bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-black text-slate-950">Novo cupom</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Código">
            <input
              value={form.code}
              onChange={event => updateField('code', event.target.value)}
              required
              placeholder="Ex: BLACK20"
              className="input uppercase"
            />
          </Field>

          <Field label="Nome">
            <input
              value={form.name}
              onChange={event => updateField('name', event.target.value)}
              required
              placeholder="Black Friday"
              className="input"
            />
          </Field>

          <Field label="Tipo">
            <select
              value={form.type}
              onChange={event => updateField('type', event.target.value)}
              className="input"
            >
              <option value="PERCENTAGE">Percentual</option>
              <option value="FIXED">Valor fixo</option>
              <option value="FREE_SHIPPING">Frete grátis</option>
            </select>
          </Field>

          {form.type !== 'FREE_SHIPPING' && (
            <Field
              label={
                form.type === 'PERCENTAGE'
                  ? 'Percentual (%)'
                  : 'Valor em centavos'
              }
            >
              <input
                value={form.value}
                onChange={event => updateField('value', event.target.value)}
                required
                placeholder={form.type === 'PERCENTAGE' ? '20' : '1000'}
                className="input"
              />
            </Field>
          )}

          <Field label="Pedido mínimo em centavos">
            <input
              value={form.minOrderAmount}
              onChange={event => updateField('minOrderAmount', event.target.value)}
              placeholder="Opcional"
              className="input"
            />
          </Field>

          <Field label="Desconto máximo em centavos">
            <input
              value={form.maxDiscountAmount}
              onChange={event => updateField('maxDiscountAmount', event.target.value)}
              placeholder="Opcional"
              className="input"
            />
          </Field>

          <Field label="Limite de uso">
            <input
              type="number"
              min={0}
              value={form.usageLimit}
              onChange={event => updateField('usageLimit', event.target.value)}
              placeholder="Opcional"
              className="input"
            />
          </Field>

          <Field label="Início">
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={event => updateField('startsAt', event.target.value)}
              className="input"
            />
          </Field>

          <Field label="Fim">
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={event => updateField('expiresAt', event.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Descrição">
          <textarea
            value={form.description}
            onChange={event => updateField('description', event.target.value)}
            rows={3}
            className="input resize-none"
            placeholder="Descrição interna do cupom"
          />
        </Field>

        <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={event => updateField('isActive', event.target.checked)}
          />
          Cupom ativo
        </label>

        {createCouponMutation.isError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            Não foi possível criar o cupom.
          </p>
        )}

        <button
          disabled={createCouponMutation.isPending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          <Plus size={18} />
          {createCouponMutation.isPending ? 'Salvando...' : 'Criar cupom'}
        </button>
      </form>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">
          Cupons cadastrados
        </h2>

        <div className="mt-4 space-y-3">
          {coupons.map((coupon: any) => {
            const id = coupon.id || coupon._id

            return (
              <div
                key={id}
                className="flex flex-col gap-3 rounded-3xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-black text-slate-950">
                    {coupon.code}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {coupon.name} · {formatCouponValue(coupon.type, coupon.value)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Usado: {coupon.usedCount || 0}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCoupon(coupon)}
                    className={`rounded-2xl px-4 py-2 text-xs font-black ${
                      coupon.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {coupon.isActive ? 'Ativo' : 'Inativo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCouponMutation.mutate(id)}
                    className="rounded-full bg-red-50 p-2 text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            )
          })}

          {!coupons.length && (
            <p className="rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              Nenhum cupom cadastrado.
            </p>
          )}
        </div>
      </section>

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
    <label className="mt-3 block">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
