/* eslint-disable react-hooks/preserve-manual-memoization */
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Images,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  X,
  ZoomIn
} from 'lucide-react'

import { SEO } from '../components/seo/SEO'
import { useProduct } from '../features/products/product.hooks'
import { useCheckFavorite, useToggleFavorite } from '../features/products/favorite.hooks'
import { useProductReviews } from '../features/products/review.hooks'
import { useAddCartItem } from '../features/cart/cart.hooks'
import { assetUrl } from '../utils/assets'
import { formatMoney } from '../utils/money'
import type { ProductFile } from '../types/product'
import type { Review } from '../types/review'

function sortImages(images: ProductFile[] = []) {
  return [...images].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1
    if (!a.isMain && b.isMain) return 1

    return (a.order || 0) - (b.order || 0)
  })
}

function getReviewCustomerName(review: Review) {
  if (typeof review.customerId === 'string') return 'Cliente'

  return review.customerId?.name || 'Cliente'
}

function getReviewCustomerAvatar(review: Review) {
  if (typeof review.customerId === 'string') return null

  return review.customerId?.avatar?.url || null
}

export function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const productQuery = useProduct(slug)
  const addCartMutation = useAddCartItem()
  const toggleFavoriteMutation = useToggleFavorite()

  const product = productQuery.data

  const favoriteQuery = useCheckFavorite(product?.id)
  const reviewsQuery = useProductReviews(product?.id)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const images = useMemo(() => {
    return sortImages(product?.previewImages || [])
  }, [product?.previewImages])

  const isDigital = product?.type === 'DIGITAL' || product?.type === 'HYBRID'
  const isPhysical = product?.type === 'PHYSICAL' || product?.type === 'HYBRID'

  const selectedPlan = useMemo(() => {
    if (!product?.downloadPlans?.length) return null

    return product.downloadPlans.find(plan => {
      return plan._id === selectedPlanId || plan.id === selectedPlanId
    }) || null
  }, [product?.downloadPlans, selectedPlanId])

  const currentPrice = selectedPlan
    ? selectedPlan.price
    : product?.promotionalPrice ?? product?.price ?? 0

  function selectPreviousImage() {
    if (!images.length) return

    setSelectedImage(current => {
      if (current === 0) return images.length - 1
      return current - 1
    })
  }

  function selectNextImage() {
    if (!images.length) return

    setSelectedImage(current => {
      if (current === images.length - 1) return 0
      return current + 1
    })
  }

    function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.touches[0].clientX)
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return

    const touchEndX = event.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        selectNextImage()
      } else {
        selectPreviousImage()
      }
    }

    setTouchStartX(null)
  }

  function handleToggleFavorite() {
    if (!product) return

    toggleFavoriteMutation.mutate(product.id)
  }

  function handleAddToCart(goToCart = false) {
    if (!product) return

    if (isDigital && !selectedPlanId) {
      alert('Selecione um plano de download.')
      return
    }

    addCartMutation.mutate(
      {
        productId: product.id,
        planId: selectedPlanId,
        quantity
      },
      {
        onSuccess: () => {
          if (goToCart) {
            navigate('/carrinho')
          }
        }
      }
    )
  }

  if (productQuery.isLoading) {
    return (
      <>
        <SEO title="Carregando produto" />

        <div className="space-y-4">
          <div className="h-80 animate-pulse rounded-[2rem] bg-white" />
          <div className="h-40 animate-pulse rounded-[2rem] bg-white" />
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <SEO
          title="Produto não encontrado"
          description="O produto que você tentou acessar não foi encontrado."
        />

        <div className="rounded-3xl bg-white p-6 text-center">
          <p className="font-bold text-slate-950">Produto não encontrado.</p>

          <Link
            to="/catalogo"
            className="mt-4 inline-block text-sm font-bold text-sky-600"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </>
    )
  }

  const image = images[selectedImage]
  const seoImage = images[0]?.url ? assetUrl(images[0].url) : undefined
  const seoUrl = window.location.href
  const isFavorited = favoriteQuery.data?.favorited === true
  const reviews = reviewsQuery.data || []

  const seoDescription =
    product.description?.slice(0, 160) ||
    'Produto disponível no SWStore.'

  return (
    <>
      <SEO
        title={product.name}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
        type="product"
      />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={toggleFavoriteMutation.isPending}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition disabled:opacity-60 ${
              isFavorited ? 'text-red-500' : 'text-slate-700'
            }`}
          >
            <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative aspect-square bg-slate-100"
          >
            {image?.url ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="h-full w-full"
              >
                <img
                  src={assetUrl(image.url)}
                  alt={image.alt || product.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Sem imagem
              </div>
            )}

                        {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={selectPreviousImage}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={selectNextImage}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
                >
                  <ChevronRight size={22} />
                </button>

                <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
                  <Images size={15} />
                  {selectedImage + 1}/{images.length}
                </span>
              </>
            )}

            {image?.url && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-slate-700 shadow-sm"
              >
                <ZoomIn size={15} />
                Zoom
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((item, index) => (
                <button
                  key={`${item.path}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl border ${
                    selectedImage === index
                      ? 'border-sky-600'
                      : 'border-slate-200'
                  }`}
                >
                  {item.url ? (
                    <img
                      src={assetUrl(item.url)}
                      alt={item.alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100" />
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase text-sky-700">
              {product.type}
            </span>

            <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
              <Star size={16} fill="currentColor" />
              {product.averageRating || 0}
              <span className="text-slate-400">
                ({product.reviewsCount || 0})
              </span>
            </span>
          </div>

          <h1 className="text-2xl font-black leading-tight text-slate-950">
            {product.name}
          </h1>

          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
            {product.description}
          </p>

          <div className="mt-5">
            {product.promotionalPrice && !selectedPlan && (
              <p className="text-sm text-slate-400 line-through">
                {formatMoney(product.price)}
              </p>
            )}

            <p className="text-3xl font-black text-slate-950">
              {formatMoney(currentPrice)}
            </p>
          </div>
        </section>

        {isDigital && product.downloadPlans && product.downloadPlans.length > 0 && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Escolha o plano
            </h2>

            <div className="mt-3 space-y-3">
              {product.downloadPlans.map(plan => {
                const planId = plan._id || plan.id || ''

                return (
                  <button
                    key={planId}
                    type="button"
                    onClick={() => setSelectedPlanId(planId)}
                    className={`w-full rounded-3xl border p-4 text-left ${
                      selectedPlanId === planId
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-950">
                          {plan.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {plan.isPermanent
                            ? 'Downloads permanentes'
                            : `${plan.downloadLimit} downloads disponíveis`}
                        </p>
                      </div>

                      <p className="font-black text-sky-600">
                        {formatMoney(plan.price)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

                {isPhysical && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Quantidade
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(value => Math.max(1, value - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
              >
                <Minus size={18} />
              </button>

              <span className="min-w-10 text-center text-xl font-black">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity(value => value + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
              >
                <Plus size={18} />
              </button>
            </div>

            {typeof product.stock === 'number' && (
              <p className="mt-3 text-xs text-slate-500">
                Estoque disponível: <strong>{product.stock}</strong>
              </p>
            )}
          </section>
        )}

        <section className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              disabled={addCartMutation.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-sky-600 px-5 py-4 font-black text-sky-600 transition hover:bg-sky-50 disabled:opacity-60"
            >
              <ShoppingCart size={20} />
              Adicionar ao carrinho
            </button>

            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              disabled={addCartMutation.isPending}
              className="flex flex-1 items-center justify-center rounded-2xl bg-sky-600 px-5 py-4 font-black text-white transition hover:bg-sky-700 disabled:opacity-60"
            >
              Comprar agora
            </button>
          </div>
        </section>

        {reviews.length > 0 && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Avaliações
            </h2>

            <div className="mt-4 space-y-4">
              {reviews.map(review => {
                const customerName = getReviewCustomerName(review)
                const customerAvatar = getReviewCustomerAvatar(review)

                return (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-50 text-sky-600">
                          {customerAvatar ? (
                            <img
                              src={assetUrl(customerAvatar)}
                              alt={customerName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-black">
                              {customerName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-black text-slate-950">
                            {customerName}
                          </p>

                          {review.title && (
                            <p className="text-xs font-bold text-slate-500">
                              {review.title}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 text-amber-500">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <Star key={index} size={15} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {review.comment}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {lightboxOpen && image?.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950"
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={selectPreviousImage}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-950"
              >
                <ChevronLeft size={26} />
              </button>

              <button
                type="button"
                onClick={selectNextImage}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-950"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <img
            src={assetUrl(image.url)}
            alt={image.alt || product.name}
            className="max-h-[88vh] max-w-full object-contain"
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950">
              {selectedImage + 1}/{images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
