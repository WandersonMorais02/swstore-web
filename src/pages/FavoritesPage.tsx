/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

import { useMyFavorites } from '../features/products/favorite.hooks'
import { ProductCard } from '../features/products/ProductCard'
import { SEO } from '../components/seo/SEO'

export function FavoritesPage() {
  const favoritesQuery = useMyFavorites()

  const favorites = favoritesQuery.data || []

  const products = favorites
    .map((favorite: any) => favorite.productId)
    .filter(Boolean)

  if (favoritesQuery.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-3xl bg-white shadow-sm"
          />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <>
          <SEO
            title="SWstore - Favoritos"
            description="Verifique seus favoritos"
          />

          <div className="space-y-10">
            ...
          </div>
        </>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <Heart size={34} />
        </div>

        <h1 className="mt-5 text-2xl font-black text-slate-950">
          Nenhum favorito ainda
        </h1>

        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          Salve produtos que você gostou para encontrar depois com facilidade.
        </p>

        <Link
          to="/catalogo"
          className="mt-6 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white"
        >
          Explorar produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <>
        <SEO
          title="SWstore - Favoritos"
          description="Verifique seus favoritos"
        />

        <div className="space-y-10">
          ...
        </div>
      </>

      <div>
        <h1 className="text-2xl font-black text-slate-950">Favoritos</h1>
        <p className="text-sm text-slate-500">
          Produtos salvos na sua conta.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {products.map((product: any) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
