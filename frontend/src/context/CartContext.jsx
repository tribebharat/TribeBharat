import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { cart } from '../services/api'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCartItems([])
      return
    }
    setLoading(true)
    try {
      const data = await cart.get()
      setCartItems(Array.isArray(data) ? data : [])
    } catch {
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [isAuthenticated])

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login' }
    }
    try {
      const item = await cart.add(product.id || product, quantity, size, color)
      await loadCart()
      return { success: true, item }
    } catch (error) {
      return { success: false, error: error?.response?.data?.detail || 'Failed to add' }
    }
  }

  const updateCart = async (id, quantity) => {
    if (!isAuthenticated) return
    try {
      await cart.update(id, quantity)
      await loadCart()
    } catch {
      // Silent fail
    }
  }

  const removeCart = async (id) => {
    if (!isAuthenticated) return
    try {
      await cart.remove(id)
      await loadCart()
    } catch {
      // Silent fail
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) return
    try {
      await cart.clear()
      setCartItems([])
    } catch {
      // Silent fail
    }
  }

  const cartTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || item.product_price || 0
      return sum + (price * item.quantity)
    }, 0)
  }

  const cartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      loadCart,
      addToCart,
      updateCart,
      removeCart,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}
