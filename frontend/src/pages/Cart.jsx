import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orders } from '../services/api'

const Cart = () => {
  const { cartItems, removeCart, updateCart, cartTotal, loading, loadCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold mb-4">Please Login</h2>
          <p className="text-gray-500 mb-8">You need to be logged in to view your cart.</p>
          <Link to="/login" className="btn-primary inline-block w-full">Login</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-white">
        <div className="container-custom">
          <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/men" className="btn-primary inline-block">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleBuyAll = async () => {
    if (cartItems.length === 0) return

    if (!window.confirm('Are you sure you want to place this order?')) return

    setCheckoutLoading(true)
    try {
      await orders.create('Default Address') // Simplified for now
      await loadCart() // Refresh cart (should be empty)
      navigate('/orders')
    } catch (error) {
      alert('Failed to place order. Please try again.')
      console.error(error)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const subtotal = cartTotal()
  const shipping = subtotal > 999 ? 0 : 100
  const total = subtotal + shipping

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="container-custom">
        <h1 className="text-3xl font-serif font-bold mb-2">Shopping Cart</h1>
        <p className="text-gray-500 mb-8">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 hidden sm:table-header-group">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Product</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Price</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Quantity</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Total</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems.map(item => {
                    const itemPrice = item.product?.price || item.product_price || 0
                    const itemTotal = itemPrice * item.quantity
                    return (
                      <tr key={item.id} className="flex flex-col sm:table-row">
                        <td className="py-6 px-6">
                          <div className="flex items-center">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.product?.images?.[0] || item.product_image || '/placeholder.jpg'}
                                alt={item.product?.name || item.product_name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-base font-medium text-primary">
                                <Link to={`/product/${item.product?.id || item.product_id}`} className="hover:text-accent transition-colors">
                                  {item.product?.name || item.product_name}
                                </Link>
                              </h3>
                              {item.size && (
                                <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900 sm:table-cell flex justify-between items-center">
                          <span className="sm:hidden text-gray-500">Price:</span>
                          ₹{itemPrice}
                        </td>
                        <td className="py-4 px-6 sm:table-cell flex justify-between items-center">
                          <span className="sm:hidden text-gray-500">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-md w-24">
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() => updateCart(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="flex-1 text-center text-sm">{item.quantity}</span>
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() => updateCart(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-primary sm:table-cell flex justify-between items-center">
                          <span className="sm:hidden text-gray-500">Total:</span>
                          ₹{itemTotal}
                        </td>
                        <td className="py-4 px-6 text-right sm:table-cell flex justify-end">
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeCart(item.id)}
                            aria-label="Remove item"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24">
              <h2 className="text-lg font-medium text-primary mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {subtotal < 999 && (
                  <div className="text-xs text-accent bg-accent/10 p-2 rounded text-center">
                    Add ₹{999 - subtotal} more for free shipping!
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-base font-bold text-primary">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                className="btn-primary w-full py-4 mb-4"
                onClick={handleBuyAll}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Processing...' : 'Buy All'}
              </button>

              <Link to="/men" className="block text-center text-sm text-primary hover:text-accent transition-colors font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
