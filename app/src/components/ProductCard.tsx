import { useMemo, useState } from 'react'
import type { CartItem, Product } from '../types'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../utils/format'
import QuantityStepper from './QuantityStepper'

interface ProductCardProps {
  product: Product
  /** استخدم هذا لإضافة الصنف إلى قائمة محلية بدل سلة الطلب العادية (مثل تبويب "سفرة لأهلي") */
  onAdd?: (item: Omit<CartItem, 'lineId'>) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const { addItem } = useCart()
  const [sizeId, setSizeId] = useState(product.sizes?.[0]?.id)
  const [weightId, setWeightId] = useState(product.weightOptions?.[0]?.id)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const selectedSize = product.sizes?.find((s) => s.id === sizeId)
  const selectedWeight = product.weightOptions?.find((w) => w.id === weightId)

  const unitPrice = useMemo(() => {
    if (product.sellMode === 'sizes') return selectedSize?.price ?? 0
    if (product.sellMode === 'weight') return (product.pricePerKg ?? 0) * (selectedWeight?.kg ?? 1)
    if (product.sellMode === 'piece') return product.pricePerPiece ?? 0
    return product.price ?? 0
  }, [product, selectedSize, selectedWeight])

  function handleAdd() {
    const variantLabel =
      product.sellMode === 'sizes' ? selectedSize?.label : product.sellMode === 'weight' ? selectedWeight?.label : undefined
    const payload: Omit<CartItem, 'lineId'> = {
      productId: product.id,
      name: product.name,
      category: product.category,
      variantLabel,
      variantBadge: product.sellMode === 'sizes' ? selectedSize?.badge : undefined,
      quantity,
      unitPrice,
    }
    if (onAdd) onAdd(payload)
    else addItem(payload)
    setQuantity(1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card overflow-hidden flex flex-col">
      <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" loading="lazy" />
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="font-extrabold text-sm leading-snug">{product.name}</h3>

        {product.sellMode === 'sizes' && product.sizes && (
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSizeId(size.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                  sizeId === size.id
                    ? 'bg-brick-500 border-brick-500 text-white'
                    : 'border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}
        {product.sellMode === 'sizes' && selectedSize?.badge && (
          <span className="inline-block w-fit text-[10px] font-bold px-2 py-0.5 rounded-full bg-ember-500/15 text-ember-600 dark:text-ember-400">
            {selectedSize.badge}
          </span>
        )}

        {product.sellMode === 'weight' && product.weightOptions && (
          <select
            value={weightId}
            onChange={(e) => setWeightId(e.target.value)}
            className="w-full text-xs font-bold rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-2 py-1.5"
          >
            {product.weightOptions.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-extrabold text-brick-600 dark:text-ember-400 text-sm">{formatMoney(unitPrice)}</span>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </div>

        <button
          onClick={handleAdd}
          className={`w-full h-10 rounded-xl font-extrabold text-sm transition-colors ${
            justAdded ? 'bg-green-600 text-white' : 'bg-brick-500 text-white active:bg-brick-600'
          }`}
        >
          {justAdded ? 'أُضيفت ✓' : 'إضافة'}
        </button>
      </div>
    </div>
  )
}
