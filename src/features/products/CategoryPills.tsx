import type { Category } from '../../types/product'

type CategoryPillsProps = {
  categories: Category[]
  selected?: string
  onSelect: (categoryId?: string) => void
}

export function CategoryPills({
  categories,
  selected,
  onSelect
}: CategoryPillsProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => onSelect(undefined)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
            !selected
              ? 'bg-slate-950 text-white'
              : 'bg-white text-slate-700'
          }`}
        >
          Todos
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
              selected === category.id
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
