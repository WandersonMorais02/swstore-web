import { Link } from 'react-router-dom'
import { Images, Star } from 'lucide-react'

import type { Product, ProductFile } from '../../types/product'
import { assetUrl } from '../../utils/assets'
import { formatMoney } from '../../utils/money'

type ProductCardProps = {
  product: Product
}

function getMainImage(images?: ProductFile[]) {
  if (!images?.length) return null

  const mainImage = images.find(image => image.isMain)
  return mainImage || images[0]
}

export function ProductCard({ product }: ProductCardProps) {
  const image = getMainImage(product.previewImages)

  const price = product.promotionalPrice ?? product.price
  const hasMultipleImages = (product.previewImages?.length || 0) > 1

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-slate-100">
        {image?.url ? (
          <img
            src={assetUrl(image.url)}
            alt={image.alt || product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sem imagem
          </div>
        )}

        {hasMultipleImages && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-slate-700 shadow-sm">
            <Images size={13} />
            {product.previewImages.length}
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase text-sky-700">
            {product.type}
          </span>

          <span className="flex items-center gap-1 text-xs text-amber-500">
            <Star size={13} fill="currentColor" />
            {product.averageRating || 0}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-slate-900">
          {product.name}
        </h3>

        <div className="mt-3">
          {product.promotionalPrice && (
            <p className="text-xs text-slate-400 line-through">
              {formatMoney(product.price)}
            </p>
          )}

          <p className="text-lg font-black text-slate-950">
            {formatMoney(price)}
          </p>
        </div>
      </div>
    </Link>
  )
}
