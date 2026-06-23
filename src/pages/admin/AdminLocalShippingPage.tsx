import { useState } from 'react'
import { MapPin, Plus, Trash2, Truck } from 'lucide-react'

import {
  useCreateLocalShippingPrice,
  useCreateLocalShippingZone,
  useDeleteLocalShippingPrice,
  useDeleteLocalShippingZone,
  useLocalShippingPrices,
  useLocalShippingZones
} from '../../features/admin/local-shipping.hooks'
import { formatMoney } from '../../utils/money'

function onlyNumbers(value: string) {
  return value.replace(/\D/g, '')
}

function moneyToCents(value: string) {
  return Number(value.replace(/\D/g, '') || 0)
}

export function AdminLocalShippingPage() {
  const zonesQuery = useLocalShippingZones()
  const pricesQuery = useLocalShippingPrices()

  const createZoneMutation = useCreateLocalShippingZone()
  const deleteZoneMutation = useDeleteLocalShippingZone()

  const createPriceMutation = useCreateLocalShippingPrice()
  const deletePriceMutation = useDeleteLocalShippingPrice()

  const zones = zonesQuery.data || []
  const prices = pricesQuery.data || []

  const [zoneForm, setZoneForm] = useState({
    name: '',
    city: 'Ponta de Pedras',
    state: 'PA',
    zipcode: '68830000'
  })

  const [priceForm, setPriceForm] = useState({
    originZoneId: '',
    destinationZoneId: '',
    price: '',
    deliveryTime: '1',
    isBidirectional: true
  })

  function updateZone(field: keyof typeof zoneForm, value: string) {
    setZoneForm(current => ({
      ...current,
      [field]: value
    }))
  }

  function updatePrice(field: keyof typeof priceForm, value: string | boolean) {
    setPriceForm(current => ({
      ...current,
      [field]: value
    }))
  }

  function submitZone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    createZoneMutation.mutate(
      {
        ...zoneForm,
        state: zoneForm.state.toUpperCase(),
        zipcode: onlyNumbers(zoneForm.zipcode),
        isActive: true
      },
      {
        onSuccess: () => {
          setZoneForm(current => ({
            ...current,
            name: ''
          }))
        }
      }
    )
  }

  function submitPrice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const originZone = zones.find(zone => zone.id === priceForm.originZoneId)
    const destinationZone = zones.find(zone => zone.id === priceForm.destinationZoneId)

    if (!originZone) {
      alert('Selecione uma origem válida.')
      return
    }

    if (!destinationZone) {
      alert('Selecione um destino válido.')
      return
    }

    if (originZone.id === destinationZone.id) {
      alert('Origem e destino não podem ser iguais.')
      return
    }

    if (
      originZone.city !== destinationZone.city ||
      originZone.state !== destinationZone.state ||
      onlyNumbers(originZone.zipcode) !== onlyNumbers(destinationZone.zipcode)
    ) {
      alert('Origem e destino precisam pertencer à mesma cidade/CEP.')
      return
    }

    createPriceMutation.mutate(
      {
        city: originZone.city,
        state: originZone.state.toUpperCase(),
        zipcode: onlyNumbers(originZone.zipcode),
        originZoneId: priceForm.originZoneId,
        destinationZoneId: priceForm.destinationZoneId,
        price: moneyToCents(priceForm.price),
        deliveryTime: Number(priceForm.deliveryTime || 1),
        isBidirectional: priceForm.isBidirectional,
        isActive: true
      },
      {
        onSuccess: () => {
          setPriceForm(current => ({
            ...current,
            originZoneId: '',
            destinationZoneId: '',
            price: ''
          }))
        }
      }
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <Truck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Fretes locais
            </h1>
            <p className="text-sm text-slate-500">
              Cadastre cidades, bairros e valores de entrega local.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <form
          onSubmit={submitZone}
          className="rounded-[2rem] bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-sky-600" />
            <h2 className="text-lg font-black text-slate-950">
              Cadastrar bairro/zona
            </h2>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Bairro/Zona">
              <input
                value={zoneForm.name}
                onChange={event => updateZone('name', event.target.value)}
                required
                placeholder="Ex: Centro"
                className="input"
              />
            </Field>

            <Field label="Cidade">
              <input
                value={zoneForm.city}
                onChange={event => updateZone('city', event.target.value)}
                required
                className="input"
              />
            </Field>

            <Field label="UF">
              <input
                value={zoneForm.state}
                onChange={event => updateZone('state', event.target.value)}
                required
                maxLength={2}
                className="input"
              />
            </Field>

            <Field label="CEP">
              <input
                value={zoneForm.zipcode}
                onChange={event => updateZone('zipcode', event.target.value)}
                required
                minLength={8}
                className="input"
              />
            </Field>
          </div>

          {createZoneMutation.isError && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              Não foi possível cadastrar o bairro.
            </p>
          )}

          <button
            disabled={createZoneMutation.isPending}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            <Plus size={18} />
            {createZoneMutation.isPending ? 'Salvando...' : 'Cadastrar bairro'}
          </button>
        </form>

        <form
          onSubmit={submitPrice}
          className="rounded-[2rem] bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-sky-600" />
            <h2 className="text-lg font-black text-slate-950">
              Cadastrar preço
            </h2>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Origem">
              <select
                value={priceForm.originZoneId}
                onChange={event => updatePrice('originZoneId', event.target.value)}
                required
                className="input"
              >
                <option value="">Selecione</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} - {zone.city}/{zone.state}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Destino">
              <select
                value={priceForm.destinationZoneId}
                onChange={event => updatePrice('destinationZoneId', event.target.value)}
                required
                className="input"
              >
                <option value="">Selecione</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} - {zone.city}/{zone.state}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Valor em centavos">
              <input
                value={priceForm.price}
                onChange={event => updatePrice('price', event.target.value)}
                required
                placeholder="Ex: 500"
                className="input"
              />
            </Field>

            <Field label="Prazo em dias">
              <input
                type="number"
                min={0}
                value={priceForm.deliveryTime}
                onChange={event => updatePrice('deliveryTime', event.target.value)}
                className="input"
              />
            </Field>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={priceForm.isBidirectional}
              onChange={event => updatePrice('isBidirectional', event.target.checked)}
            />
            Valer ida e volta
          </label>

          {createPriceMutation.isError && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              Não foi possível cadastrar o preço.
            </p>
          )}

          <button
            disabled={createPriceMutation.isPending || zones.length < 2}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            <Plus size={18} />
            {createPriceMutation.isPending ? 'Salvando...' : 'Cadastrar preço'}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">
          Bairros cadastrados
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {zones.map(zone => (
            <div
              key={zone.id}
              className="rounded-3xl border border-slate-100 p-4"
            >
              <p className="font-black text-slate-950">{zone.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {zone.city}/{zone.state} - {zone.zipcode}
              </p>

              <button
                type="button"
                onClick={() => deleteZoneMutation.mutate(zone.id)}
                className="mt-3 flex items-center gap-2 text-xs font-black text-red-600"
              >
                <Trash2 size={15} />
                Remover
              </button>
            </div>
          ))}

          {!zones.length && (
            <p className="text-sm text-slate-500">
              Nenhum bairro cadastrado.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">
          Tabela de preços
        </h2>

        <div className="mt-4 space-y-3">
          {prices.map(price => (
            <div
              key={price.id}
              className="flex flex-col gap-3 rounded-3xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-black text-slate-950">
                  {price.originZoneId?.name} → {price.destinationZoneId?.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {price.city}/{price.state} · {price.deliveryTime} dia(s)
                  {price.isBidirectional ? ' · ida e volta' : ''}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xl font-black text-slate-950">
                  {formatMoney(price.price)}
                </p>

                <button
                  type="button"
                  onClick={() => deletePriceMutation.mutate(price.id)}
                  className="rounded-full bg-red-50 p-2 text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}

          {!prices.length && (
            <p className="rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              Nenhum preço cadastrado.
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
    <label className="block">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
