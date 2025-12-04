import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { products } from '../services/api'
import { getMediaUrl } from '../utils/image'

const Collections = () => {
  const { category } = useParams()
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const filters = category ? { collection: category } : {}
        const data = await products.getAll(filters)
        setProductList(Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []))
      } catch (error) {
        console.error('Failed to load products:', error)
        setProductList([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category])

  const getTitle = () => {
    if (!category) return 'All Collections'
    return category === 'tshirts' ? 'T-Shirts' : category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Page Header */}
      <div className="bg-surface py-16 mb-8">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">{getTitle()}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Explore our premium range of {getTitle().toLowerCase()}, crafted for comfort and style.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-custom pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : productList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productList.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100 mb-4">
                  <img
                    src={getMediaUrl(product.images?.[0]) || 'https://via.placeholder.com/600x600.png?text=Tribe+Bharat+Product'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <button className="absolute bottom-4 left-4 right-4 bg-white text-primary py-3 px-4 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    Quick View
                  </button>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium text-primary group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-lg text-gray-500 capitalize">{product.collection}</p>
                  <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-500">Check back soon for new additions to this collection.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collections

