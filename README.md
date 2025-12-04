# TribeBharat - Full-Stack E-Commerce Platform

A modern e-commerce platform built with Django REST Framework (backend) and React + Vite (frontend).

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database
- pip (Python package manager)
- npm or yarn

## Backend Setup (Django)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create virtual environment (recommended)
```bash
python -m venv venv
```

### 3. Activate virtual environment
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **Linux/Mac:**
  ```bash
  source venv/bin/activate
  ```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Create `.env` file in `backend/` directory
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL Database Configuration
PGHOST=your-db-host
PGPORT=5432
PGDATABASE=tribebharat_db
PGUSER=your-db-user
PGPASSWORD=your-db-password
PGSSLMODE=require

# Optional
PORT=5000
LOG_LEVEL=DEBUG
```

### 6. Run migrations
```bash
python manage.py migrate
```

### 7. Create superuser (optional)
```bash
python manage.py createsuperuser
```

### 8. Run development server
```bash
python manage.py runserver 0.0.0.0:5000
```

Backend will be available at `http://localhost:5000`

## Frontend Setup (React + Vite)

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```
or
```bash
yarn install
```

### 3. Create `.env` file in `frontend/` directory (optional)
```env
VITE_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

### 4. Run development server
```bash
npm run dev
```
or
```bash
yarn dev
```

Frontend will be available at `http://localhost:5173`

## Required Environment Variables

### Backend (.env in `backend/`)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `True` for development, `False` for production
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `PGHOST` - PostgreSQL host
- `PGPORT` - PostgreSQL port (default: 5432)
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `PGPASSWORD` - Database password
- `PGSSLMODE` - SSL mode (use `require` for production)

### Frontend (.env in `frontend/`)
- `VITE_API_URL` - Backend API URL (default: `http://localhost:5000/api`)

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/profile/` - Get user profile (authenticated)
- `POST /api/auth/token/refresh/` - Refresh access token

### Products
- `GET /api/products/` - List all products
- `GET /api/products/:id/` - Get product details

### Cart
- `GET /api/cart/` - Get user cart (authenticated)
- `POST /api/cart/` - Add item to cart (authenticated)
- `PATCH /api/cart/:id/` - Update cart item quantity (authenticated)
- `DELETE /api/cart/:id/` - Remove cart item (authenticated)
- `DELETE /api/cart/clear/` - Clear entire cart (authenticated)

### Test
- `GET /api/test/` - Health check endpoint

## Project Structure

```
TribeBharat/
├── backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── tribebharat/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Development Notes

- Backend uses JWT authentication via `rest_framework_simplejwt`
- Frontend uses React Context API for state management
- CORS is configured to allow `http://localhost:5173` and `http://localhost:3000`
- Database uses PostgreSQL with SSL mode required
- Frontend automatically refreshes tokens on 401 errors

## Troubleshooting

1. **Database connection errors**: Ensure PostgreSQL is running and credentials in `.env` are correct
2. **CORS errors**: Verify `CORS_ALLOWED_ORIGINS` in `backend/tribebharat/settings.py` includes your frontend URL
3. **Module not found**: Ensure virtual environment is activated and dependencies are installed
4. **Port already in use**: Change `PORT` in `.env` or kill the process using the port

## License

MIT

