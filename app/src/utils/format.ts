// أدوات تنسيق مشتركة
export function formatMoney(amount: number): string {
  return `${Math.round(amount).toLocaleString('ar-SY')} ل.س`
}

export function formatCurrency(amount: number, symbol: string): string {
  const rounded = Math.round(amount * 100) / 100
  return `${rounded.toLocaleString('ar-SY')} ${symbol}`
}
