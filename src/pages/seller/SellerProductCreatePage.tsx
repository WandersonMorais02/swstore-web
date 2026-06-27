import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileArchive,
  GripVertical,
  ImagePlus,
  Info,
  Star,
  Trash2,
  Upload
} from 'lucide-react'

import { useCategories } from '../../features/products/product.hooks'
import { useCreateSellerProduct } from '../../features/seller/product.hooks'
import {
  uploadProductOriginal,
  uploadProductPreview,
  type UploadedFile
} from '../../features/seller/file.service'
import { assetUrl } from '../../utils/assets'

type ProductType = 'DIGITAL' | 'PHYSICAL' | 'HYBRID'

type PlanForm = {
  name: string
  price: string
  downloadLimit: string
  isPermanent: boolean
}

const MAX_PREVIEW_IMAGES = 15

function moneyToCents(value: string) {
  const clean = value.replace(/\D/g, '')
  return Number(clean || 0)
}

function fileSizeMB(size: number) {
  return (size / 1024 / 1024).toFixed(2)
}

function normalizeImages(images: UploadedFile[]) {
  return images.map((image, index) => ({
    ...image,
    order: index,
    isMain: index === 0,
    alt: image.alt || image.name || ''
  }))
}

export function SellerProductCreatePage() {
  const navigate = useNavigate()

  const categoriesQuery = useCategories()
  const createProductMutation = useCreateSellerProduct()

  const categories = categoriesQuery.data || []

  const [type, setType] = useState<ProductType>('DIGITAL')
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [promotionalPrice, setPromotionalPrice] = useState('')
  const [stock, setStock] = useState('1')

  const [weight, setWeight] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [length, setLength] = useState('')

  const [previewImages, setPreviewImages] = useState<UploadedFile[]>([])
  const [digitalFiles, setDigitalFiles] = useState<UploadedFile[]>([])

  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const [uploadingPreview, setUploadingPreview] = useState(false)
  const [uploadingOriginal, setUploadingOriginal] = useState(false)

  const [plans, setPlans] = useState<PlanForm[]>([
    {
      name: 'Básico',
      price: '',
      downloadLimit: '5',
      isPermanent: false
    }
  ])

  const isDigital = type === 'DIGITAL' || type === 'HYBRID'
  const isPhysical = type === 'PHYSICAL' || type === 'HYBRID'

  const previewTotalSize = useMemo(() => {
    return previewImages.reduce((sum, image) => sum + image.size, 0)
  }, [previewImages])

  const selectedPreview = previewImages[selectedPreviewIndex]

  async function handlePreviewUpload(files: FileList | null) {
    if (!files?.length) return

    const incomingFiles = Array.from(files)
    const availableSlots = MAX_PREVIEW_IMAGES - previewImages.length

    if (availableSlots <= 0) {
      alert(`Você pode enviar no máximo ${MAX_PREVIEW_IMAGES} imagens.`)
      return
    }

    const filesToUpload = incomingFiles.slice(0, availableSlots)

    if (incomingFiles.length > availableSlots) {
      alert(
        `Limite de ${MAX_PREVIEW_IMAGES} imagens. Algumas imagens foram ignoradas.`
      )
    }

    setUploadingPreview(true)

    try {
      const uploaded = await Promise.all(
        filesToUpload.map(file => uploadProductPreview(file))
      )

      setPreviewImages(current => {
        const next = normalizeImages([...current, ...uploaded])
        setSelectedPreviewIndex(current.length)
        return next
      })
    } finally {
      setUploadingPreview(false)
    }
  }

  async function handleOriginalUpload(files: FileList | null) {
    if (!files?.length) return

    setUploadingOriginal(true)

    try {
      const uploaded = await Promise.all(
        Array.from(files).map(file => uploadProductOriginal(file))
      )

      setDigitalFiles(current => [...current, ...uploaded])
    } finally {
      setUploadingOriginal(false)
    }
  }

    function removePreview(index: number) {
    setPreviewImages(current => {
      const next = normalizeImages(
        current.filter((_, itemIndex) => itemIndex !== index)
      )

      setSelectedPreviewIndex(value => {
        if (next.length === 0) return 0
        if (value >= next.length) return next.length - 1
        if (index === value) return 0
        return value
      })

      return next
    })
  }

  function setMainPreview(index: number) {
    setPreviewImages(current => {
      const selected = current[index]
      const others = current.filter((_, itemIndex) => itemIndex !== index)

      setSelectedPreviewIndex(0)

      return normalizeImages([selected, ...others])
    })
  }

  function updatePreviewAlt(index: number, alt: string) {
    setPreviewImages(current => {
      const next = [...current]

      next[index] = {
        ...next[index],
        alt
      }

      return normalizeImages(next)
    })
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index)
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  function handleDrop(index: number) {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null)
      return
    }

    setPreviewImages(current => {
      const next = [...current]
      const [draggedItem] = next.splice(draggedIndex, 1)

      next.splice(index, 0, draggedItem)

      setSelectedPreviewIndex(index)

      return normalizeImages(next)
    })

    setDraggedIndex(null)
  }

  function removeDigitalFile(index: number) {
    setDigitalFiles(current => {
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  function addPlan() {
    setPlans(current => [
      ...current,
      {
        name: '',
        price: '',
        downloadLimit: '',
        isPermanent: false
      }
    ])
  }

  function updatePlan(
    index: number,
    field: keyof PlanForm,
    value: string | boolean
  ) {
    setPlans(current => {
      const copy = [...current]

      copy[index] = {
        ...copy[index],
        [field]: value
      }

      return copy
    })
  }

  function removePlan(index: number) {
    setPlans(current => {
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  function validateBeforeSubmit() {
    if (previewImages.length === 0) {
      alert('Envie pelo menos uma imagem de preview.')
      return false
    }

    if (isDigital && digitalFiles.length === 0) {
      alert('Envie pelo menos um arquivo original para download.')
      return false
    }

    if (isDigital) {
      const invalidPlan = plans.some(plan => {
        const hasName = plan.name.trim().length > 0
        const hasPrice = moneyToCents(plan.price) > 0
        const hasLimit = plan.isPermanent || Number(plan.downloadLimit || 0) > 0

        return !hasName || !hasPrice || !hasLimit
      })

      if (invalidPlan) {
        alert('Preencha corretamente todos os planos de download.')
        return false
      }
    }

    if (isPhysical) {
      if (Number(stock || 0) <= 0) {
        alert('Informe o estoque do produto físico.')
        return false
      }

      if (
        Number(weight || 0) <= 0 ||
        Number(width || 0) <= 0 ||
        Number(height || 0) <= 0 ||
        Number(length || 0) <= 0
      ) {
        alert('Informe peso, largura, altura e comprimento.')
        return false
      }
    }

    return true
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateBeforeSubmit()) return

    createProductMutation.mutate(
      {
        categoryId,
        type,
        name,
        description,
        price: moneyToCents(price),
        promotionalPrice: promotionalPrice ? moneyToCents(promotionalPrice) : null,

        previewImages: normalizeImages(previewImages),
        digitalFiles: isDigital ? digitalFiles : [],

        stock: isPhysical ? Number(stock || 0) : 0,

        dimensions: isPhysical
          ? {
              weight: Number(weight || 0),
              width: Number(width || 0),
              height: Number(height || 0),
              length: Number(length || 0)
            }
          : undefined,

        downloadPlans: isDigital
          ? plans.map(plan => ({
              name: plan.name,
              price: moneyToCents(plan.price),
              downloadLimit: plan.isPermanent
                ? null
                : Number(plan.downloadLimit || 0),
              isPermanent: plan.isPermanent
            }))
          : []
      },
      {
        onSuccess: () => {
          navigate('/seller/produtos')
        }
      }
    )
  }

    return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[2rem] bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-black text-slate-950">Novo produto</h2>
        <p className="text-sm text-slate-500">
          Cadastre o produto com imagens de preview, descrição detalhada e
          arquivos originais.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-100 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="font-black text-slate-950">Imagens de preview</h3>
            <p className="mt-1 text-xs text-slate-500">
              A primeira imagem será a capa da vitrine. Arraste para reordenar.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <strong className="text-slate-950">{previewImages.length}</strong>/
            {MAX_PREVIEW_IMAGES} imagens ·{' '}
            <strong className="text-slate-950">
              {fileSizeMB(previewTotalSize)}
            </strong>{' '}
            MB
          </div>
        </div>

        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sky-200 bg-sky-50 p-6 text-center transition hover:bg-sky-100">
          <ImagePlus size={32} className="text-sky-600" />
          <span className="mt-2 text-sm font-black text-slate-950">
            {uploadingPreview ? 'Enviando...' : 'Enviar imagens'}
          </span>
          <span className="text-xs text-slate-500">
            JPG, PNG ou WEBP · máximo {MAX_PREVIEW_IMAGES} imagens
          </span>

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploadingPreview}
            onChange={event => {
              handlePreviewUpload(event.target.files)
              event.currentTarget.value = ''
            }}
          />
        </label>

        {selectedPreview?.url && (
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-slate-100">
            <img
              src={assetUrl(selectedPreview.url)}
              alt={selectedPreview.alt || selectedPreview.name}
              className="max-h-[520px] w-full object-contain"
            />
          </div>
        )}

        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {previewImages.map((file, index) => (
              <div
                key={`${file.path}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onClick={() => setSelectedPreviewIndex(index)}
                className={`group cursor-pointer overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
                  selectedPreviewIndex === index
                    ? 'border-sky-500 ring-2 ring-sky-100'
                    : 'border-slate-100'
                }`}
              >
                <div className="relative bg-slate-100">
                  {file.url && (
                    <img
                      src={assetUrl(file.url)}
                      alt={file.alt || file.name}
                      className="aspect-square w-full object-cover"
                    />
                  )}

                  <button
                    type="button"
                    className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-slate-600 shadow-sm"
                  >
                    <GripVertical size={13} />
                    Arrastar
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-black text-amber-950 shadow-sm">
                      <Star size={12} fill="currentColor" />
                      Principal
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      removePreview(index)
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-500 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2 p-3">
                  <input
                    value={file.alt || ''}
                    onClick={event => event.stopPropagation()}
                    onChange={event => updatePreviewAlt(index, event.target.value)}
                    placeholder="Texto alternativo"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-500"
                  />

                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      setMainPreview(index)
                    }}
                    disabled={index === 0}
                    className="w-full rounded-xl bg-sky-50 px-3 py-2 text-xs font-black text-sky-700 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {index === 0 ? 'Imagem principal' : 'Definir como principal'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

            {isDigital && (
        <section className="rounded-3xl border border-slate-100 p-4">
          <h3 className="font-black text-slate-950">Arquivo original</h3>
          <p className="mt-1 text-xs text-slate-500">
            Esse arquivo fica privado e só será liberado após pagamento.
          </p>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:bg-slate-100">
            <Upload size={32} className="text-slate-700" />

            <span className="mt-2 text-sm font-black text-slate-950">
              {uploadingOriginal ? 'Enviando...' : 'Enviar arquivo'}
            </span>

            <span className="text-xs text-slate-500">
              PDF, ZIP, imagens, SVG, DOCX, XLSX ou PPTX
            </span>

            <input
              type="file"
              multiple
              className="hidden"
              disabled={uploadingOriginal}
              onChange={event => {
                handleOriginalUpload(event.target.files)
                event.currentTarget.value = ''
              }}
            />
          </label>

          {digitalFiles.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {digitalFiles.map((file, index) => (
                <div
                  key={`${file.path}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-600">
                      <FileArchive size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">
                        {file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {fileSizeMB(file.size)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDigitalFile(index)}
                    className="rounded-full bg-white p-2 text-red-500 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            required
            className="input"
          />
        </Field>

        <Field label="Categoria">
          <select
            value={categoryId}
            onChange={event => setCategoryId(event.target.value)}
            required
            className="input"
          >
            <option value="">Selecione</option>

            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tipo">
          <select
            value={type}
            onChange={event => setType(event.target.value as ProductType)}
            className="input"
          >
            <option value="DIGITAL">Digital</option>
            <option value="PHYSICAL">Físico</option>
            <option value="HYBRID">Híbrido</option>
          </select>
        </Field>

        <Field label="Preço em centavos">
          <input
            value={price}
            onChange={event => setPrice(event.target.value)}
            placeholder="Ex: 2990"
            required
            className="input"
          />
        </Field>

        <Field label="Preço promocional em centavos">
          <input
            value={promotionalPrice}
            onChange={event => setPromotionalPrice(event.target.value)}
            placeholder="Opcional"
            className="input"
          />
        </Field>
      </div>

      <Field label="Descrição">
        <textarea
          value={description}
          onChange={event => setDescription(event.target.value)}
          required
          rows={7}
          placeholder={`Descreva o produto com detalhes.

Exemplo:
- O que acompanha
- Como usar
- Formatos disponíveis
- Observações importantes`}
          className="input resize-none leading-6"
        />
      </Field>

      {isDigital && (
        <section className="rounded-3xl border border-slate-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-950">
                Planos de download
              </h3>

              <p className="text-xs text-slate-500">
                Defina limites como 5, 10 ou permanente.
              </p>
            </div>

            <button
              type="button"
              onClick={addPlan}
              className="rounded-2xl bg-sky-600 px-4 py-2 text-xs font-black text-white"
            >
              Adicionar
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {plans.map((plan, index) => (
              <div key={index} className="rounded-3xl bg-slate-50 p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Nome do plano">
                    <input
                      value={plan.name}
                      onChange={event =>
                        updatePlan(index, 'name', event.target.value)
                      }
                      required
                      className="input"
                    />
                  </Field>

                  <Field label="Preço em centavos">
                    <input
                      value={plan.price}
                      onChange={event =>
                        updatePlan(index, 'price', event.target.value)
                      }
                      required
                      className="input"
                    />
                  </Field>

                  <Field label="Limite de downloads">
                    <input
                      value={plan.downloadLimit}
                      disabled={plan.isPermanent}
                      onChange={event =>
                        updatePlan(index, 'downloadLimit', event.target.value)
                      }
                      className="input disabled:opacity-50"
                    />
                  </Field>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={plan.isPermanent}
                      onChange={event =>
                        updatePlan(index, 'isPermanent', event.target.checked)
                      }
                    />
                    Permanente
                  </label>

                  {plans.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlan(index)}
                      className="text-xs font-black text-red-500"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isPhysical && (
        <section className="rounded-3xl border border-slate-100 p-4">
          <div className="flex items-start gap-2">
            <Info size={18} className="mt-0.5 text-sky-600" />

            <div>
              <h3 className="font-black text-slate-950">
                Estoque e envio
              </h3>

              <p className="text-xs leading-5 text-slate-500">
                Essas medidas são usadas para cálculo de frete e organização
                logística.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-5">
            <Field label="Estoque">
              <input
                value={stock}
                onChange={event => setStock(event.target.value)}
                className="input"
              />
            </Field>

            <Field label="Peso">
              <input
                value={weight}
                onChange={event => setWeight(event.target.value)}
                placeholder="gramas"
                className="input"
              />
            </Field>

            <Field label="Largura">
              <input
                value={width}
                onChange={event => setWidth(event.target.value)}
                placeholder="cm"
                className="input"
              />
            </Field>

            <Field label="Altura">
              <input
                value={height}
                onChange={event => setHeight(event.target.value)}
                placeholder="cm"
                className="input"
              />
            </Field>

            <Field label="Comprimento">
              <input
                value={length}
                onChange={event => setLength(event.target.value)}
                placeholder="cm"
                className="input"
              />
            </Field>
          </div>
        </section>
      )}

      {createProductMutation.isError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível cadastrar o produto.
        </p>
      )}

      <button
        type="submit"
        disabled={
          createProductMutation.isPending ||
          uploadingPreview ||
          uploadingOriginal
        }
        className="w-full rounded-2xl bg-sky-600 px-4 py-4 text-sm font-black text-white disabled:opacity-60"
      >
        {createProductMutation.isPending ? 'Salvando...' : 'Cadastrar produto'}
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
