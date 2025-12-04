import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../services/api'
import { getMediaUrl } from '../utils/image'

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await products.getAll({})
        setTrendingProducts(Array.isArray(data?.results) ? data.results.slice(0, 4) : [])
      } catch (error) {
        console.error('Failed to load products:', error)
        setTrendingProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    alert(`Thank you! We'll send updates to ${email}`)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Fashion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Artistry in <span className="text-accent italic">Every Thread</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto font-light tracking-wide drop-shadow-md">
            Discover our latest collection of handcrafted luxury, where timeless tradition meets contemporary elegance.
          </p>
          <div className="flex justify-center">
            <Link to="/collections" className="btn-primary text-lg px-12 py-4 shadow-xl hover:scale-105 transition-transform duration-300">
              Shop Now
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-primary">Curated Collections</h2>
            <div className="w-24 h-1 bg-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { title: "T-Shirts", link: "/collections/tshirts", image: getMediaUrl("media/products/Tshirts.jpeg") },
              { title: "Hoodies", link: "/collections/hoodies", image: getMediaUrl("media/products/Hoodie.jpeg") }
            ].map((category, index) => (
              <Link key={index} to={category.link} className="group relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10"></div>
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-6">
                  <h3 className="text-4xl font-serif font-bold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{category.title}</h3>
                  <span className="text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 border-b border-accent pb-1">Shop Collection</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-primary">Trending Now</h2>
              <p className="text-gray-500">Our most coveted pieces this season</p>
            </div>
            <Link to="/collections" className="hidden md:block text-accent hover:text-primary transition-colors font-medium">View All Products &rarr;</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100 mb-4">
                    <img
                      src={getMediaUrl(product.images?.[0]) || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
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
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/collections" className="btn-outline inline-block">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605218427368-35b0160d5c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-fixed opacity-20"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-accent uppercase tracking-widest text-sm font-bold mb-4 block">Our Heritage</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">Commitment to <br />Timeless Craftsmanship</h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
              Tribe Bharat is born from a deep respect for heritage and an unwavering commitment to the finest craftsmanship. Each piece tells a story of tradition, woven into the fabric of modern life.
            </p>
            <Link to="#story" className="btn-accent inline-block">
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-surface">
        <div className="container-custom">
          <div className="bg-white p-8 md:p-16 rounded-2xl shadow-sm text-center max-w-4xl mx-auto border border-gray-100">
            <h2 className="text-3xl font-serif font-bold mb-4 text-primary">Stay in the Loop</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and heritage stories.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
