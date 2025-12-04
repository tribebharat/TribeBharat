import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Men from './pages/Men'
import Women from './pages/Women'
import Collections from './pages/Collections'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import Orders from './pages/Orders'

import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ErrorBoundary>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collections/:category" element={<Collections />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
