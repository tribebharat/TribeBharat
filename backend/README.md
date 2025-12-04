# TribeBharat Django Backend

Django REST Framework backend for the TribeBharat e-commerce platform with PostgreSQL database.

## Features

- **Django REST Framework** - Powerful API framework
- **PostgreSQL** - Robust relational database
- **JWT Authentication** - Secure token-based authentication
- **Django ORM** - Database abstraction layer with migrations
- **CORS Support** - Cross-origin resource sharing for frontend integration
- **Admin Interface** - Built-in Django admin for data management

## Tech Stack

- **Python 3.13**
- **Django 5.0.1**
- **Django REST Framework 3.14.0**
- **PostgreSQL** (via psycopg2-binary)
- **JWT** (via djangorestframework-simplejwt)

## Project Structure

```
backend-django/
├── api/                    # Main API app
│   ├── management/        # Custom management commands
│   │   └── commands/
│   │       └── load_sample_data.py
│   ├── migrations/        # Database migrations
│   ├── admin.py          # Django admin configuration
│   ├── models.py         # Database models
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # API views
│   └── urls.py           # API URL routing
├── tribebharat/          # Project settings
│   ├── settings.py       # Django settings
│   └── urls.py           # Main URL configuration
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
└── README.md            # This file
```

## Prerequisites

- Python 3.10 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## Installation

### 1. Set up PostgreSQL

Install PostgreSQL and create a database:

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb tribebharat_db

# Or using psql
psql postgres
CREATE DATABASE tribebharat_db;
\q
```

### 2. Set up Python Environment

```bash
cd backend-django

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Update the `.env` file with your PostgreSQL credentials:

```env
# Database Configuration
DB_NAME=tribebharat_db
DB_USER=postgres          # Your PostgreSQL username
DB_PASSWORD=postgres      # Your PostgreSQL password
DB_HOST=localhost
DB_PORT=5432

# Django Configuration
DEBUG=True
SECRET_KEY=django-insecure-change-this-in-production

# Server Configuration
PORT=8080
```

### 4. Run Migrations

Create database tables:

```bash
# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### 5. Create Superuser (Optional)

Create an admin user to access Django admin:

```bash
python manage.py createsuperuser
```

Follow the prompts to set phone, email, and password.

### 6. Load Sample Data

Load sample categories and products:

```bash
python manage.py load_sample_data
```

## Running the Server

### Development Server

```bash
# Activate virtual environment first
source venv/bin/activate

# Run server on port 8080
python manage.py runserver 8080
```

The API will be available at `http://localhost:8080/api/`

### Django Admin

Access the admin interface at `http://localhost:8080/admin/`

## API Endpoints

### Authentication

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns JWT tokens)
- `GET /api/auth/profile/` - Get user profile (requires auth)
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Products

- `GET /api/products/` - List all products (with filters)
- `GET /api/products/{id}/` - Get product details

**Query Parameters:**
- `category` - Filter by category name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `color` - Filter by color

### Categories

- `GET /api/categories/` - List all categories
- `GET /api/categories/{id}/` - Get category details

### Orders

- `GET /api/orders/` - List user's orders (requires auth)
- `POST /api/orders/` - Create new order (requires auth)
- `GET /api/orders/{id}/` - Get order details (requires auth)

### Cart

- `GET /api/cart/` - Get cart items (requires auth)
- `POST /api/cart/` - Add item to cart (requires auth)
- `PUT /api/cart/{id}/` - Update cart item (requires auth)
- `DELETE /api/cart/{id}/` - Remove cart item (requires auth)
- `DELETE /api/cart/clear/` - Clear all cart items (requires auth)

### Test

- `GET /api/test/` - Test endpoint to verify API is working

## Database Models

### User
- Custom user model with phone-based authentication
- Fields: phone (unique), email, first_name, last_name, dob, password

### Category
- Product categories
- Fields: name, description

### Product
- Product catalog
- Fields: name, description, price, category, color, sizes (JSON), images (JSON), stock_quantity, is_active

### Order
- Customer orders
- Fields: user, total_amount, status, shipping_address, payment_method, payment_status

### OrderItem
- Items within orders
- Fields: order, product, quantity, price, size

### CartItem
- Shopping cart persistence
- Fields: user, product, quantity, size

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive access and refresh tokens
2. Include the access token in the Authorization header:
   ```
   Authorization: Bearer <access_token>
   ```
3. Refresh the token when it expires using the refresh endpoint

## Development

### Making Model Changes

```bash
# After modifying models.py
python manage.py makemigrations
python manage.py migrate
```

### Running Tests

```bash
python manage.py test
```

### Checking for Issues

```bash
python manage.py check
```

## Common Commands

```bash
# Create superuser
python manage.py createsuperuser

# Load sample data
python manage.py load_sample_data

# Open Django shell
python manage.py shell

# Collect static files (for production)
python manage.py collectstatic
```

## Troubleshooting

### Database Connection Error

If you see "could not connect to server":
1. Ensure PostgreSQL is running: `brew services start postgresql`
2. Verify database exists: `psql -l`
3. Check credentials in `.env` file

### Port Already in Use

If port 8080 is busy, run on a different port:
```bash
python manage.py runserver 8000
```

### Migration Errors

Reset migrations (⚠️ deletes data):
```bash
# Delete migration files (except __init__.py)
find api/migrations -name "*.py" ! -name "__init__.py" -delete

# Recreate migrations
python manage.py makemigrations
python manage.py migrate
```

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in settings
2. Generate a new `SECRET_KEY`
3. Update `ALLOWED_HOSTS` in settings.py
4. Use a production-grade server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn tribebharat.wsgi:application --bind 0.0.0.0:8080
   ```
5. Set up proper database backups
6. Use environment variables for sensitive data
7. Enable HTTPS
8. Configure static file serving

## Integrating with Frontend

The frontend React app should be configured to use this API:

```javascript
// In frontend src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';
```

CORS is already configured to allow requests from `http://localhost:3000`.

## License

MIT License
