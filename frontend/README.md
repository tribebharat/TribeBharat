# TribeBharat - E-commerce Clothing Website

A modern, responsive e-commerce website for selling clothes built with React, Node.js, and SQL Server.

## Features

### Frontend Features
- **User Authentication**: Login and signup with phone number
- **Product Catalog**: Browse products by categories (Men, Women, Kids, Accessories)
- **Product Filtering**: Filter by price range and colors
- **Product Details**: Detailed product pages with image slider
- **Shopping Cart**: Add/remove items, quantity management
- **Responsive Design**: Mobile-friendly interface
- **User Profile**: User dropdown with profile and orders

### Backend Features
- **REST API**: Express.js backend with SQL Server
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations for products
- **Order Management**: Order creation and tracking
- **Database Integration**: SQL Server with proper schema

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQL Server** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Project Structure

```
tribebharat/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/                    # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   ├── Men.jsx
│   │   ├── Women.jsx
│   │   └── Product.jsx
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── services/                 # API integration
│   │   └── api.js
│   ├── App.jsx                   # Main app component
│   └── App.css                   # Global styles
├── backend/                      # Backend source code
│   ├── server.js                 # Express server
│   ├── database_schema.sql       # SQL Server schema
│   ├── package.json             # Backend dependencies
│   └── .env.example             # Environment variables template
└── public/                       # Static assets
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- SQL Server (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tribebharat
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Setup Database**
   - Create a SQL Server database
   - Run the SQL script from `backend/database_schema.sql`
   - Update database connection details in `.env` file

5. **Configure Environment Variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

6. **Start the Development Servers**
   
   Frontend (from root directory):
   ```bash
   npm run dev
   ```
   
   Backend (from backend directory):
   ```bash
   npm run dev
   ```

### Default URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Database Schema

### Main Tables
- **users**: User accounts with authentication
- **categories**: Product categories (Men, Women, Kids, Accessories)
- **products**: Product catalog with details, pricing, and inventory
- **orders**: Customer orders and order tracking
- **order_items**: Individual items within orders
- **cart_items**: Shopping cart persistence (optional)

### Key Features of Schema
- Proper foreign key relationships
- Indexes for performance optimization
- Stored procedures for complex queries
- Sample data for testing

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products with optional filters
- `GET /api/products/:id` - Get product by ID

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Cart (Optional)
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

## Key Components

### Authentication Flow
1. User registers with name, phone, email, password, and DOB
2. Password validation ensures security requirements
3. User logs in with phone number and password
4. JWT token manages session (to be implemented)

### Product Catalog
1. Products organized by categories
2. Filtering by price range and color
3. Responsive grid layout
4. Product cards with images and basic info

### Product Details
1. Image slider with multiple product images
2. Detailed product information
3. Size selection
4. Add to cart functionality
5. Product features and description

### Shopping Cart
1. Client-side cart using React Context
2. Add/remove items
3. Quantity management
4. Cart persistence in localStorage
5. Cart item count in header

## Responsive Design

The website is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Responsive images
- Touch-friendly navigation
- Optimized for all screen sizes

## Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper error handling
- Follow consistent naming conventions
- Write clean, commented code
- Use proper TypeScript if converting

### Security Considerations
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## Future Enhancements

### Features to Add
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Search functionality
- [ ] Inventory management
- [ ] Discount and coupon system
- [ ] Social media integration

### Technical Improvements
- [ ] TypeScript conversion
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] PWA features
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Error logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact:
- Email: info@tribebharat.com
- Phone: +91 9876543210

## Deployment

### Frontend Deployment
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar platforms

### Backend Deployment
- Deploy to Heroku, AWS, Azure, or similar platforms
- Configure environment variables
- Set up production database

### Database Deployment
- Use cloud SQL Server instances
- Configure connection strings
- Run migration scripts

---

**Built with ❤️ for fashion enthusiasts**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
