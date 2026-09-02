// ============================================================================
// ملف القائمة الرئيسي — كل الأصناف والأسعار في مكان واحد
// عدّل أي سعر أو أضف صنفاً جديداً من هنا فقط. الأسعار كلها بالليرة السورية الجديدة.
// إن كانت هناك مجموعة "menu" في Firestore فسيتم استخدامها بدل هذا الملف تلقائياً،
// وتبقى هذه القائمة نسخة احتياطية تعمل حتى دون إنترنت.
// ============================================================================

import type { Product } from '../types'

// ---------------------------------------------------------------------------
// أسعار أحجام البيتزا — موحّدة لكل النكهات
// السوبر بيتزا هي خيار رابع ضمن الأحجام لكل نكهة، وليست صنفاً مستقلاً
// ---------------------------------------------------------------------------
const PIZZA_SIZES = [
  { id: 'medium', label: 'وسط', price: 400 },
  { id: 'large', label: 'كبير', price: 500 },
  { id: 'family', label: 'عائلي', price: 750 },
  { id: 'super', label: 'سوبر بيتزا', price: 1000, badge: 'الأفضل للعزائم والضيوف المميزين' },
]

// نكهات البيتزا الستة
const PIZZA_FLAVORS: { id: string; name: string; image: string }[] = [
  { id: 'pepperoni', name: 'بيتزا بيبروني', image: '/images/pizza.svg' },
  { id: 'chicken', name: 'بيتزا دجاج', image: '/images/pizza.svg' },
  { id: 'cheese', name: 'بيتزا جبنة', image: '/images/pizza.svg' },
  { id: 'four-seasons', name: 'بيتزا فصول أربعة', image: '/images/pizza.svg' },
  { id: 'vegetable', name: 'بيتزا خضار', image: '/images/pizza.svg' },
  { id: 'margherita', name: 'بيتزا مارغريتا', image: '/images/pizza.svg' },
]

const pizzaProducts: Product[] = PIZZA_FLAVORS.map((flavor) => ({
  id: `pizza-${flavor.id}`,
  category: 'بيتزا',
  name: flavor.name,
  image: flavor.image,
  sellMode: 'sizes',
  sizes: PIZZA_SIZES,
}))

// ---------------------------------------------------------------------------
// الفطائر — تباع بالحبة بسعر ثابت لكل صنف
// ---------------------------------------------------------------------------
const pastryProducts: Product[] = [
  { id: 'pastry-meat', category: 'فطائر', name: 'فطيرة لحمة', image: '/images/pastry.svg', sellMode: 'flat', price: 50 },
  { id: 'pastry-cheese', category: 'فطائر', name: 'فطيرة جبنة', image: '/images/pastry.svg', sellMode: 'flat', price: 40 },
  { id: 'pastry-mhammara', category: 'فطائر', name: 'فطيرة محمرة', image: '/images/pastry.svg', sellMode: 'flat', price: 30 },
  { id: 'pastry-mini-pizza', category: 'فطائر', name: 'ميني بيتزا (القطعة الواحدة)', image: '/images/pizza.svg', sellMode: 'flat', price: 50 },
]

// ---------------------------------------------------------------------------
// الحلويات — الشعيبيات بالحبة، والباقي بالكيلو (نصف/1/2/3 كيلو)
// ---------------------------------------------------------------------------
const KG_OPTIONS = [
  { id: 'half', label: 'نصف كيلو', kg: 0.5 },
  { id: 'one', label: 'كيلو', kg: 1 },
  { id: 'two', label: 'كيلوين', kg: 2 },
  { id: 'three', label: 'ثلاثة كيلو', kg: 3 },
]

const dessertProducts: Product[] = [
  {
    id: 'dessert-shaibiyat',
    category: 'حلويات',
    name: 'شعيبيات',
    image: '/images/dessert-piece.svg',
    sellMode: 'piece',
    pricePerPiece: 50,
  },
  {
    id: 'dessert-harisa-cheese',
    category: 'حلويات',
    name: 'هريسة بجبن',
    image: '/images/dessert-kg.svg',
    sellMode: 'weight',
    pricePerKg: 400,
    weightOptions: KG_OPTIONS,
  },
  {
    id: 'dessert-baklava',
    category: 'حلويات',
    name: 'بقلاوة',
    image: '/images/dessert-kg.svg',
    sellMode: 'weight',
    pricePerKg: 400,
    weightOptions: KG_OPTIONS,
  },
]

// ---------------------------------------------------------------------------
// المشروبات — سعر موحّد لجميع الأصناف
// ---------------------------------------------------------------------------
const drinkProducts: Product[] = [
  { id: 'drink-pepsi', category: 'مشروبات', name: 'بيبسي', image: '/images/drink.svg', sellMode: 'flat', price: 80 },
  { id: 'drink-mirinda-orange', category: 'مشروبات', name: 'ميرندا برتقال', image: '/images/drink.svg', sellMode: 'flat', price: 80 },
  { id: 'drink-mirinda-apple', category: 'مشروبات', name: 'ميرندا تفاح أخضر', image: '/images/drink.svg', sellMode: 'flat', price: 80 },
  { id: 'drink-seven-up', category: 'مشروبات', name: 'سفن أب', image: '/images/drink.svg', sellMode: 'flat', price: 80 },
]

// القائمة الكاملة — تُستخدم كنسخة احتياطية إذا تعذّر الوصول إلى Firestore
export const LOCAL_MENU: Product[] = [
  ...pizzaProducts,
  ...pastryProducts,
  ...dessertProducts,
  ...drinkProducts,
]

// ترتيب عرض التبويبات الفرعية داخل صفحة القائمة
export const CATEGORY_ORDER: Product['category'][] = ['بيتزا', 'فطائر', 'حلويات', 'مشروبات']
