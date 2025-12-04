const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 text-accent">Tribe Bharat</h3>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              Celebrating Ancient Indian Heritage Through Contemporary Fashion. We bring you the finest craftsmanship from across Bharat.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-6 uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-4 text-gray-400">
              <p className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <a href="mailto:heritage@tribebharat.com" className="hover:text-accent transition-colors">heritage@tribebharat.com</a>
              </p>
              <p className="flex items-center space-x-3">
                <span className="text-xl">📞</span>
                <a href="tel:9876543210" className="hover:text-accent transition-colors">+91 9876543210</a>
              </p>
              <p className="flex items-center space-x-3">
                <span className="text-xl">📍</span>
                <span>Heritage Capital, New Delhi, Bharat</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-6 uppercase tracking-wider">Connect</h4>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">Twitter</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Tribe Bharat. Preserving Heritage, Creating Future.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
