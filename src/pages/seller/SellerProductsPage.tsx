/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { useSellerProducts } from '../../features/seller/seller.hooks'
import { assetUrl } from '../../utils/assets'
import { formatMoney } from '../../utils/money'

export function SellerProductsPage() {
  const productsQuery = useSellerProducts()
  const products = productsQuery.data || []

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Produtos</h2>
          <p className="text-xs text-slate-500">
            Cadastre e acompanhe seus produtos.
          </p>
        </div>

        <Link
          to="/seller/produtos/novo"
          className="flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-xs font-black text-white"
        >
          <Plus size={16} />
          Novo
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {products.map((product: any) => {
          const image = product.previewImages?.[0]?.url

          return (
            <div
              key={product.id}
              className="flex gap-3 rounded-3xl border border-slate-100 p-3"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                {image && (
                  <img
                    src={assetUrl(image)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-black text-slate-950">
                  {product.name}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  {product.type} · {product.status}
                </p>

                <p className="mt-2 font-black text-slate-950">
                  {formatMoney(product.promotionalPrice ?? product.price)}
                </p>
              </div>
            </div>
          )
        })}

        {!products.length && (
          <p className="rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            Nenhum produto cadastrado ainda.
          </p>
        )}
      </div>
    </section>
  )
}
