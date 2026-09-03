import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import TopTabBar from './components/TopTabBar'
import CartBar from './components/CartBar'
import ProfileCompletionModal from './components/ProfileCompletionModal'
import MenuPage from './pages/MenuPage'
import GiftOrderPage from './pages/GiftOrderPage'
import ContestsPage from './pages/ContestsPage'
import LoyaltyPage from './pages/LoyaltyPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import TrackingPage from './pages/TrackingPage'

// شريط السلة السفلي يظهر فقط في التبويبات الرئيسية، ويختفي في السلة وإتمام الطلب وشاشات ما بعد الطلب
const TABS_WITH_CART_BAR = ['/menu', '/gift', '/contests', '/loyalty']

function AppShell() {
  const location = useLocation()
  const { needsProfileCompletion } = useAuth()
  const showCartBar = TABS_WITH_CART_BAR.some((p) => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="sticky top-0 z-40 max-w-lg mx-auto">
        <Header />
        <TopTabBar />
      </div>

      <main className="max-w-lg mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/gift" element={<GiftOrderPage />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/track/:docId" element={<TrackingPage />} />
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </main>

      {showCartBar && <CartBar />}
      {needsProfileCompletion && <ProfileCompletionModal />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <AppShell />
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
