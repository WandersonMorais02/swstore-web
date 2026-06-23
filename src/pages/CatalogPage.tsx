import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'

import { CategoryPills } from '../features/products/CategoryPills'
import { ProductCard } from '../features/products/ProductCard'
import { useCategories, useProducts } from '../features/products/product.hooks'

import { SEO } from '../components/seo/SEO'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialCategory = searchParams.get('categoria') || undefined

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>(initialCategory)
  const [type, setType] = useState<string | undefined>()

  const params = useMemo(() => {
    return {
      search: search || undefined,
      categoryId,
      type
    }
  }, [search, categoryId, type])

  const categoriesQuery = useCategories()
  const productsQuery = useProducts(params)

  function handleCategory(category?: string) {
    setCategoryId(category)

    if (category) {
      setSearchParams({ categoria: category })
    } else {
      setSearchParams({})
    }
  }

  const products = productsQuery.data || []
  const categories = categoriesQuery.data || []

  return (
    <div className="space-y-5">
      <>
        <SEO
          title="SWStore - Catálogo"
          description="Explore produtos digitais, físicos e híbridos disponíveis no marketplace."
        />

        ...
      </>

      <div>
        <h1 className="text-2xl font-black text-slate-950">Catálogo</h1>
        <p className="text-sm text-slate-500">
          Encontre produtos digitais, físicos e híbridos.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3">
          <Search size={18} className="text-slate-400" />

          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Buscar produto..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <CategoryPills
        categories={categories}
        selected={categoryId}
        onSelect={handleCategory}
      />

      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-2">
          {[
            { label: 'Todos', value: undefined },
            { label: 'Digital', value: 'DIGITAL' },
            { label: 'Físico', value: 'PHYSICAL' },
            { label: 'Híbrido', value: 'HYBRID' }
          ].map(item => (
            <button
              key={item.label}
              onClick={() => setType(item.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                type === item.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {productsQuery.isLoading ? (
        <p className="text-sm text-slate-500">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
