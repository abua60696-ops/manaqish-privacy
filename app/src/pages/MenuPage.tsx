import { useEffect, useMemo, useState } from 'react'
import CategoryChips from '../components/CategoryChips'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeletons'
import { CATEGORY_ORDER, LOCAL_MENU } from '../data/menu'
import { fetchMenu } from '../services/menuService'
import type { Category, Product } from '../types'

export default function MenuPage() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORY_ORDER[0])

  useEffect(() => {
    let mounted = true
    fetchMenu().then((data) => {
      if (mounted) setProducts(data.length ? data : LOCAL_MENU)
    })
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => (products || []).filter((p) => p.category === activeCategory), [products, activeCategory])

  return (
    <div className="page-enter pb-28">
      <CategoryChips categories={CATEGORY_ORDER} active={activeCategory} onSelect={setActiveCategory} />

      {products === null ? (
        <ProductGridSkeleton />
      ) : filtered.length === 0 ? (
        <p className="text-center text-neutral-500 py-16">لا توجد أصناف في هذا القسم حالياً</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
