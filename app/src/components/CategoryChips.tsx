import type { Category } from '../types'

export default function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: Category[]
  active: Category
  onSelect: (c: Category) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-5 h-11 rounded-full text-sm font-bold whitespace-nowrap shrink-0 transition-colors ${
            active === cat
              ? 'bg-brick-500 text-white shadow-card'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-black/5 dark:border-white/10'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
