import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../services/api'

const Women = () => {
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    priceRange: 'all',
    color: 'all'
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await products.getAll({ category: 'Women' })
        setProductList(Array.isArray(data?.results) ? data.results : [])
      } catch (error) {
        console.error('Failed to load products:', error)
        setProductList([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = productList.filter(product => {
    if (filters.priceRange !== 'all') {
      const price = Number(product.price)
      if (filters.priceRange === 'under-1000' && price >= 1000) return false
      if (filters.priceRange === '1000-2000' && (price < 1000 || price > 2000)) return false
      if (filters.priceRange === '2000-5000' && (price <= 2000 || price > 5000)) return false
      if (filters.priceRange === 'above-5000' && price <= 5000) return false
    }
    if (filters.color !== 'all' && product.color?.toLowerCase() !== filters.color.toLowerCase()) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Page Header */}
      <div className="bg-surface py-16 mb-8">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Handwoven Sarees</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Embrace your style with our elegant collection of handwoven sarees, crafted by master artisans.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 mb-8 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Filter by:</span>
              <div className="flex gap-4">
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer hover:text-accent transition-colors"
                >
                  <option value="all">Price: All</option>
                  <option value="under-1000">Under ₹1,000</option>
                  <option value="1000-2000">₹1,000 - ₹2,000</option>
                  <option value="2000-5000">₹2,000 - ₹5,000</option>
                  <option value="above-5000">Above ₹5,000</option>
                </select>
                <select
                  value={filters.color}
                  onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                  className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer hover:text-accent transition-colors"
                >
                  <option value="all">Color: All</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="blue">Blue</option>
                  <option value="pink">Pink</option>
                  <option value="red">Red</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {filteredProducts.length} products found
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-custom pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100 mb-4">
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <button className="absolute bottom-4 left-4 right-4 bg-white text-primary py-3 px-4 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    Quick View
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-primary group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category_name}</p>
                  <p className="text-lg font-bold text-primary">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Women
