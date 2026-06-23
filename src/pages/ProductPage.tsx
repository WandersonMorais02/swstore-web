/* eslint-disable react-hooks/preserve-manual-memoization */
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react'

import { SEO } from '../components/seo/SEO'
import { useProduct } from '../features/products/product.hooks'
import { useCheckFavorite, useToggleFavorite } from '../features/products/favorite.hooks'
import { useProductReviews } from '../features/products/review.hooks'
import { useAddCartItem } from '../features/cart/cart.hooks'
import { assetUrl } from '../utils/assets'
import { formatMoney } from '../utils/money'

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

  const isDigital = product?.type === 'DIGITAL' || product?.type === 'HYBRID'
  const isPhysical = product?.type === 'PHYSICAL' || product?.type === 'HYBRID'

  const selectedPlan = useMemo(() => {
    if (!product?.downloadPlans?.length) return null
    return product.downloadPlans.find(plan => plan._id === selectedPlanId) || null
  }, [product?.downloadPlans, selectedPlanId])

  const currentPrice = selectedPlan
    ? selectedPlan.price
    : product?.promotionalPrice ?? product?.price ?? 0

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
          if (goToCart) navigate('/carrinho')
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

  const image = product.previewImages?.[selectedImage]?.url
  const mainImage = product.previewImages?.[0]?.url
  const seoImage = mainImage ? assetUrl(mainImage) : undefined
  const seoUrl = window.location.href
  const isFavorited = favoriteQuery.data?.favorited === true
  const reviews = reviewsQuery.data || []

  const seoDescription =
    product.description?.slice(0, 160) ||
    'Produto disponível no Digital Commerce.'

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
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <button
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
          <div className="aspect-square bg-slate-100">
            {image ? (
              <img
                src={assetUrl(image)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Sem imagem
              </div>
            )}
          </div>

          {product.previewImages?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {product.previewImages.map((item, index) => (
                <button
                  key={item.url}
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl border ${
                    selectedImage === index
                      ? 'border-sky-600'
                      : 'border-slate-200'
                  }`}
                >
                  <img
                    src={assetUrl(item.url)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
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
              {product.downloadPlans.map(plan => (
                <button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`w-full rounded-3xl border p-4 text-left ${
                    selectedPlanId === plan._id
                      ? 'border-sky-600 bg-sky-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">{plan.name}</p>

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
              ))}
            </div>
          </section>
        )}

        {isPhysical && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Quantidade</h2>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setQuantity(value => Math.max(1, value - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
              >
                <Minus size={18} />
              </button>

              <span className="w-10 text-center text-lg font-black">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(value => value + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
              >
                <Plus size={18} />
              </button>
            </div>

            {typeof product.stock === 'number' && (
              <p className="mt-2 text-xs text-slate-500">
                Estoque disponível: {product.stock}
              </p>
            )}
          </section>
        )}

        <section className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">Avaliações</h2>
              <p className="text-xs text-slate-500">
                Opiniões de clientes que compraram
              </p>
            </div>

            <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
              <Star size={16} fill="currentColor" />
              {product.averageRating || 0}
            </span>
          </div>

          <div className="space-y-3">
            {reviews.map(review => (
              <div
                key={review.id}
                className="rounded-3xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-950">
                    {review.title || 'Avaliação'}
                  </p>

                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {review.rating}
                  </span>
                </div>

                {review.comment && (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}

            {!reviews.length && (
              <p className="rounded-3xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                Nenhuma avaliação ainda.
              </p>
            )}
          </div>
        </section>

        <div className="sticky bottom-20 z-30 grid grid-cols-2 gap-3 md:bottom-4">
          <button
            onClick={() => handleAddToCart(false)}
            disabled={addCartMutation.isPending}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white shadow-lg disabled:opacity-60"
          >
            <ShoppingCart size={18} />
            Adicionar
          </button>

          <button
            onClick={() => handleAddToCart(true)}
            disabled={addCartMutation.isPending}
            className="rounded-2xl bg-sky-600 px-4 py-4 text-sm font-black text-white shadow-lg disabled:opacity-60"
          >
            Comprar agora
          </button>
        </div>
      </div>
    </>
  )
}
