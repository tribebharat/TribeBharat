import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getMediaUrl } from '../utils/image'

const Product = () => {
  const { id } = useParams()
  const { addToCart, updateCart, cartItems } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [cartItem, setCartItem] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeAccordion, setActiveAccordion] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await products.getById(id)
        setProduct(data)
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }
      } catch (error) {
        console.error('Failed to load product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product && cartItems.length > 0) {
      const existingItem = cartItems.find(item =>
        (item.product?.id === product.id || item.product_id === product.id) &&
        item.size === selectedSize &&
        item.color === selectedColor
      )
      setCartItem(existingItem)
      if (existingItem) {
        setQuantity(existingItem.quantity)
      } else {
        setQuantity(1)
      }
    } else {
      setCartItem(null)
      setQuantity(1)
    }
  }, [cartItems, product, selectedSize, selectedColor])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size')
      return
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      alert('Please select a color')
      return
    }
    const result = await addToCart(product, quantity, selectedSize, selectedColor)
    if (result.success) {
      // alert('Product added to cart!') // Removed alert for smoother UX
    } else {
      alert(result.error || 'Failed to add product to cart')
    }
  }

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return
    if (cartItem) {
      // Update existing cart item
      // We need a way to update cart item quantity directly if we have the ID
      // But addToCart handles updates too if logic allows, or we use updateCart
      // For now, let's use addToCart which usually handles "add or update" or use updateCart if we have item ID
      // Assuming updateCart takes (id, quantity)
      // We need to import updateCart from context
    } else {
      setQuantity(newQuantity)
    }
  }

  const incrementQuantity = async () => {
    if (cartItem) {
      await updateCart(cartItem.id, cartItem.quantity + 1)
    } else {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = async () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        await updateCart(cartItem.id, cartItem.quantity - 1)
      }
    } else {
      setQuantity(q => Math.max(1, q - 1))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Product not found</h2>
          <Link to="/" className="btn-primary inline-block">Go Home</Link>
        </div>
      </div>
    )
  }

  const images = product.images || []
  const sizes = product.sizes || []
  const colors = product.colors || []

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="container-custom">
        <nav className="text-lg text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/collections/${product.collection}`} className="hover:text-primary transition-colors capitalize">
            {product.collection}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <img
                src={getMediaUrl(images[currentImageIndex]) || 'https://via.placeholder.com/600x600.png?text=Tribe+Bharat+Product'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-accent' : 'border-transparent hover:border-gray-300'
                      }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={getMediaUrl(image)} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6">{product.name}</h1>
            <p className="text-gray-500 mb-8 capitalize text-2xl">{product.collection}</p>
            <p className="text-4xl font-bold text-primary mb-12">₹{product.price}</p>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-700 mb-4">Color: <span className="text-gray-500">{selectedColor}</span></label>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color
                        ? 'border-accent ring-2 ring-accent ring-offset-2'
                        : 'border-gray-200 hover:border-gray-400'
                        }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {/* Show checkmark if selected, or nothing if color is obvious. 
                          If color is white, border handles visibility. */}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-10">
                <label className="block text-lg font-medium text-gray-700 mb-4">Size</label>
                <div className="flex flex-wrap gap-4">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-2 text-lg font-medium transition-all ${selectedSize === size
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart / Quantity Control */}
            <div className="mb-12">
              {cartItem ? (
                <div className="flex flex-col gap-4">
                  <label className="block text-lg font-medium text-green-600 mb-2">Item in Cart</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-md">
                      <button
                        className="w-16 h-14 flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={decrementQuantity}
                      >
                        −
                      </button>
                      <span className="w-16 text-center font-bold text-xl">{cartItem.quantity}</span>
                      <button
                        className="w-16 h-14 flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={incrementQuantity}
                      >
                        +
                      </button>
                    </div>
                    <Link to="/cart" className="btn-accent py-4 px-8 text-lg">
                      Go to Cart
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center border-2 border-gray-300 rounded-md w-40">
                    <button
                      className="w-12 h-full flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-bold text-xl">{quantity}</span>
                    <button
                      className="w-12 h-full flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn-primary flex-1 py-4 text-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200">
              <div className="border-b border-gray-200">
                <button
                  className="w-full py-6 flex justify-between items-center text-left"
                  onClick={() => setActiveAccordion(activeAccordion === 0 ? null : 0)}
                >
                  <span className="font-medium text-primary text-xl">Description</span>
                  <span className="text-2xl">{activeAccordion === 0 ? '−' : '+'}</span>
                </button>
                {activeAccordion === 0 && (
                  <div className="pb-6 text-gray-600 leading-relaxed animate-fade-in space-y-3 text-lg">
                    <p>{product.description || 'No description available.'}</p>
                    {product.fabric && <p><strong>Fabric:</strong> {product.fabric}</p>}
                    {product.gsm && <p><strong>GSM:</strong> {product.gsm}</p>}
                    {product.printing_type && <p><strong>Printing:</strong> {product.printing_type}</p>}
                  </div>
                )}
              </div>
              <div className="border-b border-gray-200">
                <button
                  className="w-full py-6 flex justify-between items-center text-left"
                  onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
                >
                  <span className="font-medium text-primary text-xl">Shipping & Returns</span>
                  <span className="text-2xl">{activeAccordion === 1 ? '−' : '+'}</span>
                </button>
                {activeAccordion === 1 && (
                  <div className="pb-6 text-gray-600 leading-relaxed animate-fade-in text-lg">
                    <p>Free shipping on orders over ₹999. Returns accepted within 7 days of delivery.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
