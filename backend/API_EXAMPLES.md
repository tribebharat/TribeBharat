# TribeBharat API - CURL Examples

Base URL: `http://localhost:8080/api`

## 📋 Table of Contents
- [Test Endpoint](#test-endpoint)
- [Authentication APIs](#authentication-apis)
- [Category APIs](#category-apis)
- [Product APIs](#product-apis)
- [Order APIs](#order-apis)
- [Cart APIs](#cart-apis)

---

## Test Endpoint

### Test API Connection
```bash
curl -X GET http://localhost:8080/api/test/
```

**Response:**
```json
{
  "message": "Backend is working!"
}
```

---

## Authentication APIs

### 1. Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "email": "user@example.com",
    "first_name": "John",
    "dob": "1990-01-01",
    "password": "SecurePass123!",
    "password2": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "phone": "9876543210",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "",
    "dob": "1990-01-01",
    "created_at": "2024-11-14T10:30:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 2. Login User
```bash
curl -X POST http://localhost:8080/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "phone": "9876543210",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "",
    "dob": "1990-01-01",
    "created_at": "2024-11-14T10:30:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 3. Get User Profile (Requires Authentication)
```bash
curl -X GET http://localhost:8080/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "phone": "9876543210",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "",
  "dob": "1990-01-01",
  "created_at": "2024-11-14T10:30:00Z"
}
```

### 4. Refresh Access Token
```bash
curl -X POST http://localhost:8080/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## Category APIs

### 1. List All Categories
```bash
curl -X GET http://localhost:8080/api/categories/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Men",
    "description": "Men's clothing and accessories",
    "created_at": "2024-11-14T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Women",
    "description": "Women's clothing and accessories",
    "created_at": "2024-11-14T10:00:00Z"
  },
  {
    "id": 3,
    "name": "Kids",
    "description": "Children's clothing",
    "created_at": "2024-11-14T10:00:00Z"
  },
  {
    "id": 4,
    "name": "Accessories",
    "description": "Fashion accessories for all",
    "created_at": "2024-11-14T10:00:00Z"
  }
]
```

### 2. Get Category by ID
```bash
curl -X GET http://localhost:8080/api/categories/1/
```

**Response:**
```json
{
  "id": 1,
  "name": "Men",
  "description": "Men's clothing and accessories",
  "created_at": "2024-11-14T10:00:00Z"
}
```

---

## Product APIs

### 1. List All Products
```bash
curl -X GET http://localhost:8080/api/products/
```

### 2. List Products with Pagination
```bash
curl -X GET "http://localhost:8080/api/products/?page=1"
```

### 3. Filter Products by Category
```bash
curl -X GET "http://localhost:8080/api/products/?category=Men"
```

### 4. Filter Products by Price Range
```bash
curl -X GET "http://localhost:8080/api/products/?minPrice=500&maxPrice=2000"
```

### 5. Filter Products by Color
```bash
curl -X GET "http://localhost:8080/api/products/?color=blue"
```

### 6. Multiple Filters Combined
```bash
curl -X GET "http://localhost:8080/api/products/?category=Men&minPrice=1000&maxPrice=3000&color=blue"
```

**Response (List):**
```json
{
  "count": 16,
  "next": "http://localhost:8080/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Classic Cotton T-Shirt",
      "price": "799.00",
      "category": 1,
      "category_name": "Men",
      "color": "blue",
      "images": ["/images/placeholder-product.svg"],
      "stock_quantity": 50,
      "is_active": true
    }
  ]
}
```

### 7. Get Product Details
```bash
curl -X GET http://localhost:8080/api/products/1/
```

**Response:**
```json
{
  "id": 1,
  "name": "Classic Cotton T-Shirt",
  "description": "A classic cotton t-shirt perfect for everyday wear",
  "price": "799.00",
  "category": 1,
  "category_name": "Men",
  "color": "blue",
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "images": ["/images/placeholder-product.svg"],
  "stock_quantity": 50,
  "is_active": true,
  "created_at": "2024-11-14T10:00:00Z",
  "updated_at": "2024-11-14T10:00:00Z",
  "product_images": []
}
```

---

## Order APIs

### 1. List User Orders (Requires Authentication)
```bash
curl -X GET http://localhost:8080/api/orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 1,
      "user_phone": "9876543210",
      "total_amount": "2598.00",
      "status": "pending",
      "shipping_address": "123 Main St, City, State 12345",
      "payment_method": "COD",
      "payment_status": "pending",
      "created_at": "2024-11-14T11:00:00Z",
      "updated_at": "2024-11-14T11:00:00Z",
      "items": [
        {
          "id": 1,
          "product": 1,
          "product_name": "Classic Cotton T-Shirt",
          "product_image": "/images/placeholder-product.svg",
          "quantity": 2,
          "price": "799.00",
          "size": "L"
        }
      ]
    }
  ]
}
```

### 2. Get Order Details (Requires Authentication)
```bash
curl -X GET http://localhost:8080/api/orders/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create New Order (Requires Authentication)
```bash
curl -X POST http://localhost:8080/api/orders/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "123 Main St, City, State 12345",
    "payment_method": "COD",
    "items": [
      {
        "product": 1,
        "quantity": 2,
        "price": 799.00,
        "size": "L"
      },
      {
        "product": 3,
        "quantity": 1,
        "price": 1299.00,
        "size": "M"
      }
    ]
  }'
```

**Response:**
```json
{
  "id": 1,
  "user": 1,
  "user_phone": "9876543210",
  "total_amount": "2897.00",
  "status": "pending",
  "shipping_address": "123 Main St, City, State 12345",
  "payment_method": "COD",
  "payment_status": "pending",
  "created_at": "2024-11-14T11:00:00Z",
  "updated_at": "2024-11-14T11:00:00Z",
  "items": [
    {
      "id": 1,
      "product": 1,
      "product_name": "Classic Cotton T-Shirt",
      "product_image": "/images/placeholder-product.svg",
      "quantity": 2,
      "price": "799.00",
      "size": "L"
    },
    {
      "id": 2,
      "product": 3,
      "product_name": "Formal Shirt",
      "product_image": "/images/placeholder-product.svg",
      "quantity": 1,
      "price": "1299.00",
      "size": "M"
    }
  ]
}
```

---

## Cart APIs

### 1. Get Cart Items (Requires Authentication)
```bash
curl -X GET http://localhost:8080/api/cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "product": 1,
      "product_name": "Classic Cotton T-Shirt",
      "product_price": "799.00",
      "product_image": "/images/placeholder-product.svg",
      "quantity": 2,
      "size": "L",
      "created_at": "2024-11-14T10:45:00Z"
    },
    {
      "id": 2,
      "product": 3,
      "product_name": "Formal Shirt",
      "product_price": "1299.00",
      "product_image": "/images/placeholder-product.svg",
      "quantity": 1,
      "size": "M",
      "created_at": "2024-11-14T10:50:00Z"
    }
  ]
}
```

### 2. Add Item to Cart (Requires Authentication)
```bash
curl -X POST http://localhost:8080/api/cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": 1,
    "quantity": 2,
    "size": "L"
  }'
```

**Response:**
```json
{
  "id": 1,
  "product": 1,
  "product_name": "Classic Cotton T-Shirt",
  "product_price": "799.00",
  "product_image": "/images/placeholder-product.svg",
  "quantity": 2,
  "size": "L",
  "created_at": "2024-11-14T10:45:00Z"
}
```

### 3. Update Cart Item (Requires Authentication)
```bash
curl -X PUT http://localhost:8080/api/cart/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": 1,
    "quantity": 3,
    "size": "L"
  }'
```

### 4. Partially Update Cart Item (Requires Authentication)
```bash
curl -X PATCH http://localhost:8080/api/cart/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

### 5. Delete Cart Item (Requires Authentication)
```bash
curl -X DELETE http://localhost:8080/api/cart/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```
204 No Content
```

### 6. Clear All Cart Items (Requires Authentication)
```bash
curl -X DELETE http://localhost:8080/api/cart/clear/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

---

## 🔐 Authentication Notes

Most endpoints require JWT authentication. To use authenticated endpoints:

1. **Register or Login** to get tokens
2. **Save the access token** from the response
3. **Include the token** in subsequent requests:
   ```bash
   -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

### Token Expiry
- **Access Token**: Valid for 24 hours
- **Refresh Token**: Valid for 7 days

When access token expires, use the refresh endpoint to get a new one.

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (Delete successful) |
| 400 | Bad Request (Validation error) |
| 401 | Unauthorized (Invalid/missing token) |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🧪 Testing Flow

### Complete User Journey Example

```bash
# 1. Register new user
ACCESS_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "email": "test@example.com",
    "first_name": "Test",
    "dob": "1990-01-01",
    "password": "SecurePass123!",
    "password2": "SecurePass123!"
  }' | jq -r '.tokens.access')

echo "Access Token: $ACCESS_TOKEN"

# 2. Browse products
curl -X GET "http://localhost:8080/api/products/?category=Men"

# 3. Add items to cart
curl -X POST http://localhost:8080/api/cart/ \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": 1,
    "quantity": 2,
    "size": "L"
  }'

# 4. View cart
curl -X GET http://localhost:8080/api/cart/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 5. Create order
curl -X POST http://localhost:8080/api/orders/ \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "123 Main St, City, State 12345",
    "payment_method": "COD",
    "items": [
      {
        "product": 1,
        "quantity": 2,
        "price": 799.00,
        "size": "L"
      }
    ]
  }'

# 6. View orders
curl -X GET http://localhost:8080/api/orders/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 💡 Tips

1. **Use jq** for pretty JSON output:
   ```bash
   curl http://localhost:8080/api/products/ | jq
   ```

2. **Save token to variable**:
   ```bash
   TOKEN="your_access_token_here"
   curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/auth/profile/
   ```

3. **Check response headers**:
   ```bash
   curl -i http://localhost:8080/api/products/
   ```

4. **Verbose output** for debugging:
   ```bash
   curl -v http://localhost:8080/api/products/
   ```
