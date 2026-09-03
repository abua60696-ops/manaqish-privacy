// الأنواع المشتركة في كل أنحاء التطبيق

export type Category = 'بيتزا' | 'فطائر' | 'حلويات' | 'مشروبات'

export type SellMode = 'sizes' | 'flat' | 'weight' | 'piece'

/** خيار حجم لصنف البيتزا (وسط/كبير/عائلي/سوبر بيتزا) */
export interface SizeOption {
  id: string
  label: string
  price: number
  /** شارة صغيرة تظهر بجانب الخيار، مثل شارة السوبر بيتزا */
  badge?: string
}

/** خيار وزن للأصناف التي تُباع بالكيلو */
export interface WeightOption {
  id: string
  label: string
  /** عدد الكيلوغرامات المكافئ لهذا الخيار، يُضرب في pricePerKg */
  kg: number
}

export interface Product {
  id: string
  category: Category
  name: string
  image: string
  description?: string
  sellMode: SellMode
  /** لصنف "sizes" مثل البيتزا */
  sizes?: SizeOption[]
  /** لصنف "flat" مثل الفطائر والمشروبات */
  price?: number
  /** لصنف "weight" مثل الحلويات المباعة بالكيلو */
  pricePerKg?: number
  weightOptions?: WeightOption[]
  /** لصنف "piece" مثل الشعيبيات */
  pricePerPiece?: number
}

export interface CartItem {
  /** معرف فريد لسطر السلة (نفس الصنف بخيارين مختلفين = سطران) */
  lineId: string
  productId: string
  name: string
  category: Category
  /** وصف الخيار المختار: "عائلي"، "كيلو"، أو فارغ للأصناف البسيطة */
  variantLabel?: string
  variantBadge?: string
  quantity: number
  unitPrice: number
}

export interface OrderItemRecord {
  name: string
  category: Category
  variant?: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type OrderStatus = 'جديد' | 'قيد التحضير' | 'خرج للتوصيل' | 'تم التسليم'
export type OrderType = 'عادي' | 'سفرة لأهلي'

export interface OrderRecord {
  id?: string
  orderId: string
  customerName: string
  customerPhone: string
  customerUid?: string | null
  items: OrderItemRecord[]
  total: number
  address: string
  mapLink?: string | null
  notes?: string
  orderType: OrderType
  status: OrderStatus
  createdAt: unknown
  pointsEarned: number

  // حقول إضافية خاصة بطلبات "سفرة لأهلي"
  senderName?: string
  senderPhone?: string
  senderCountry?: string
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
  personalMessage?: string
  currency?: string
  totalInCurrency?: number
}

export type LoyaltyTier = 'برونزي' | 'فضي' | 'ذهبي'

export interface AppUser {
  uid: string
  displayName: string
  phone: string
  photoURL?: string
  email?: string
  role?: 'admin' | 'customer'
  points: number
  createdAt?: unknown
  lastAddress?: string
  lastMapLink?: string | null
}

export type ContestKind = 'مشاركة' | 'سؤال'

export interface Contest {
  id: string
  title: string
  description: string
  image?: string
  startDate: string
  endDate: string
  prize: string
  kind: ContestKind
  question?: string
  isActive: boolean
  winnerName?: string
  winnerAnnouncedAt?: string
}

export interface ContestEntry {
  id?: string
  contestId: string
  uid: string
  name: string
  answer?: string
  createdAt: unknown
}

export type RedemptionStatus = 'قيد الانتظار' | 'تم الاعتماد' | 'مرفوض'

export interface Redemption {
  id?: string
  code: string
  uid: string
  customerName: string
  rewardLabel: string
  pointsCost: number
  status: RedemptionStatus
  createdAt: unknown
}

export interface LoyaltyReward {
  id: string
  label: string
  pointsCost: number
}

export interface LoyaltySettings {
  /** كم ليرة سورية = نقطة واحدة */
  syrianPoundsPerPoint: number
  rewards: LoyaltyReward[]
}

export interface PointsHistoryEntry {
  id?: string
  date: unknown
  reason: string
  points: number
}

export type CurrencyCode = 'TRY' | 'EUR' | 'USD' | 'SYP'

/** أسعار الصرف: كم ليرة سورية يساوي وحدة واحدة من كل عملة */
export type ExchangeRates = Record<CurrencyCode, number>
