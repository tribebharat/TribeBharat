import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()

  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Force scrolled state (white background) on non-home pages
  const isHome = location.pathname === '/'
  const headerClass = !isHome || scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'
  const textClass = !isHome || scrolled ? 'text-primary' : 'text-white'
  const linkClass = !isHome || scrolled ? 'text-primary' : 'text-white/90 hover:text-white'

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowDropdown(false)
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${headerClass}`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="z-50">
          <h1 className={`font-serif text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${textClass}`}>
            Tribe Bharat
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: 'Home', path: '/' },
            { name: 'T-Shirts', path: '/collections/tshirts' },
            { name: 'Hoodies', path: '/collections/hoodies' },
            { name: 'Our Story', path: '/about' }
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xl font-medium uppercase tracking-widest hover:text-accent transition-colors duration-300 ${linkClass}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className={`hidden md:flex items-center gap-6 ${textClass}`}>
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-lg w-64 animate-fade-in">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full text-sm text-gray-700 focus:outline-none px-2"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
                <button className="text-gray-400 hover:text-primary">
                  <span className="material-symbols-outlined text-sm">search</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="hover:text-accent transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-accent transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <span className="material-symbols-outlined">person</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-primary truncate">{user?.name || 'User'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent"
                      onClick={() => setShowDropdown(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-accent transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-xs px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className={`md:hidden ${textClass}`}>
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </header>
  )
}

export default Header
