// بناء رسالة واتساب الجاهزة وفتحها في تطبيق واتساب
import { WHATSAPP_NUMBER } from './firebase'
import type { OrderItemRecord } from '../types'

interface WhatsAppOrderInfo {
  orderId: string
  customerName: string
  customerPhone: string
  items: OrderItemRecord[]
  total: number
  address: string
  mapLink?: string | null
  notes?: string
}

function formatMoney(n: number) {
  return `${n.toLocaleString('ar-SY')} ل.س`
}

export function buildOrderMessage(info: WhatsAppOrderInfo): string {
  const lines: string[] = []
  lines.push(`🍕 طلب جديد ${info.orderId}`)
  lines.push('━━━━━━━━━━━━━')
  lines.push(`الاسم: ${info.customerName}`)
  lines.push(`الهاتف: ${info.customerPhone}`)
  lines.push('━━━━━━━━━━━━━')
  for (const item of info.items) {
    const variant = item.variant ? ` — ${item.variant}` : ''
    lines.push(`• ${item.name}${variant} × ${item.quantity} = ${item.subtotal}`)
  }
  lines.push('━━━━━━━━━━━━━')
  lines.push(`الإجمالي: ${formatMoney(info.total)}`)
  lines.push('التوصيل: مجاني')
  lines.push(`العنوان: ${info.address}`)
  if (info.mapLink) lines.push(`الموقع: ${info.mapLink}`)
  if (info.notes) lines.push(`ملاحظات: ${info.notes}`)
  return lines.join('\n')
}

export function openWhatsAppOrder(info: WhatsAppOrderInfo) {
  const text = buildOrderMessage(info)
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

interface WhatsAppGiftOrderInfo {
  orderId: string
  senderName: string
  senderPhone: string
  senderCountry: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  items: OrderItemRecord[]
  total: number
  personalMessage?: string
}

export function buildGiftOrderMessage(info: WhatsAppGiftOrderInfo): string {
  const lines: string[] = []
  lines.push(`✈️ طلب سفرة لأهلي ${info.orderId}`)
  lines.push('━━━━━━━━━━━━━')
  lines.push(`المُرسِل: ${info.senderName} (${info.senderCountry}) — ${info.senderPhone}`)
  lines.push(`المستلم: ${info.receiverName} — ${info.receiverPhone}`)
  lines.push(`عنوان المستلم: ${info.receiverAddress}`)
  lines.push('━━━━━━━━━━━━━')
  for (const item of info.items) {
    const variant = item.variant ? ` — ${item.variant}` : ''
    lines.push(`• ${item.name}${variant} × ${item.quantity} = ${item.subtotal}`)
  }
  lines.push('━━━━━━━━━━━━━')
  lines.push(`الإجمالي: ${formatMoney(info.total)}`)
  lines.push('التوصيل: مجاني')
  if (info.personalMessage) lines.push(`رسالة شخصية: ${info.personalMessage}`)
  return lines.join('\n')
}

export function openWhatsAppGiftOrder(info: WhatsAppGiftOrderInfo) {
  const text = buildGiftOrderMessage(info)
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}
