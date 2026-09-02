// يضمن ألا تبقى الواجهة عالقة بانتظار Firestore إلى ما لا نهاية عند انقطاع الإنترنت
export function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}
