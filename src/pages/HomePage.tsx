/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Box,
  Gift,
  Grid2X2,
  Paintbrush,
  TrendingUp
} from 'lucide-react'

import { useCategories, useProducts } from '../features/products/product.hooks'
import { ProductCard } from '../features/products/ProductCard'

import { SEO } from '../components/seo/SEO'

const categoryIcons = [Paintbrush, BookOpen, Gift, Box, Grid2X2]

export function HomePage() {
  const categoriesQuery = useCategories()
  const productsQuery = useProducts()

  const products = productsQuery.data || []
  const categories = categoriesQuery.data || []

  const recentProducts = products.slice(0, 8)
  const bestProducts = [...products]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 8)

  return (
    <div className="space-y-10">
      <>
        <SEO
          title="SWstore - Início"
          description="Compre artes digitais, e-books, kits festa e produtos criativos em um marketplace seguro."
        />

        <div className="space-y-10">
          ...
        </div>
      </>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950 md:text-3xl">
              Categorias
            </h1>
            <p className="text-sm text-slate-500">
              Compre por tipo de produto
            </p>
          </div>

          <Link to="/catalogo" className="text-sm font-black text-sky-600">
            Ver tudo
          </Link>
        </div>

        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex gap-3 pb-2">
            {categories.slice(0, 8).map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length]

              return (
                <Link
                  key={category.id}
                  to={`/catalogo?categoria=${category.id}`}
                  className="min-w-[150px] rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Icon size={24} />
                  </div>

                  <p className="line-clamp-1 font-black text-slate-950">
                    {category.name}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {category.description || 'Produtos selecionados para você'}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <ProductSection
        title="Recentes"
        subtitle="Novidades adicionadas"
        linkLabel="Ver tudo"
        products={recentProducts}
        loading={productsQuery.isLoading}
      />

      <ProductSection
        title="Mais vendidos"
        subtitle="Produtos em destaque"
        linkLabel="Comprar"
        products={bestProducts}
        loading={productsQuery.isLoading}
        icon
      />
    </div>
  )
}

function ProductSection({
  title,
  subtitle,
  linkLabel,
  products,
  loading,
  icon
}: {
  title: string
  subtitle: string
  linkLabel: string
  products: any[]
  loading: boolean
  icon?: boolean
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            {icon && <TrendingUp size={20} className="text-sky-600" />}
            <h2 className="text-xl font-black text-slate-950">{title}</h2>
          </div>

          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        <Link to="/catalogo" className="text-sm font-black text-sky-600">
          {linkLabel}
        </Link>
      </div>

      {loading ? (
        <ProductSkeletonGrid />
      ) : products.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="grid auto-cols-[170px] grid-flow-col gap-3 pb-2 md:auto-cols-[220px]">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function ProductSkeletonGrid() {
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
