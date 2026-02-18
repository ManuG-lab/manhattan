# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses static data authentication (demo credentials). In production, implement JWT tokens.

## Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "data": {},
  "error": "error message if failed"
}
```

## Endpoints

### Products

#### Get All Products
```
GET /products
```
Query Parameters:
- `name` (string): Filter by product name (contains search)
- `category` (string): Filter by category
- `price_min` (number): Minimum price
- `price_max` (number): Maximum price

Example:
```
GET /products?name=paint&category=Paints&price_min=10&price_max=100
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Acrylic Paint",
      "category": "Paints",
      "price": 25.99,
      "date_stocked": "2024-01-15",
      "stock_amount": 50,
      "expiry_date": "2025-01-15",
      "size": "20L"
    }
  ]
}
```

#### Get Single Product
```
GET /products/<id>
```

#### Add Product
```
POST /products
Content-Type: application/json
```

Request Body:
```json
{
  "name": "Acrylic Paint",
  "category": "Paints",
  "price": 25.99,
  "date_stocked": "2024-01-15",
  "stock_amount": 50,
  "expiry_date": "2025-01-15",
  "size": "20L"
}
```

Response:
```json
{
  "success": true,
  "message": "Product added successfully",
  "id": 1
}
```

#### Update Product
```
PUT /products/<id>
Content-Type: application/json
```

Request Body (partial update):
```json
{
  "price": 29.99,
  "stock_amount": 45
}
```

#### Delete Product
```
DELETE /products/<id>
```

Response:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Sales

#### Get All Sales
```
GET /sales
```

Response includes product details joined with sales data.

#### Get Single Sale
```
GET /sales/<id>
```

#### Record Sale
```
POST /sales
Content-Type: application/json
```

Request Body:
```json
{
  "product_id": 1,
  "quantity_sold": 5,
  "sale_price": 25.99,
  "sale_date": "2024-01-20"
}
```

Note: Stock is automatically deducted from the product.

Error if insufficient stock:
```json
{
  "success": false,
  "error": "Insufficient stock"
}
```

#### Update Sale
```
PUT /sales/<id>
Content-Type: application/json
```

Request Body:
```json
{
  "quantity_sold": 6,
  "sale_price": 26.99
}
```

Note: Stock adjustment is automatic based on quantity change.

#### Delete Sale
```
DELETE /sales/<id>
```

Note: Stock is automatically restored to the product.

---

### Stock Management

#### Check Stock Levels
```
GET /stock/check
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Acrylic Paint",
      "category": "Paints",
      "size": "20L",
      "stock_amount": 50
    }
  ]
}
```

---

### Expiry Tracking

#### Get Products Closest to Expiry
```
GET /products/expiry/closest?days=30
```

Query Parameters:
- `days` (number, default: 30): Get products expiring within N days

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Acrylic Paint",
      "category": "Paints",
      "size": "20L",
      "price": 25.99,
      "expiry_date": "2024-02-10",
      "stock_amount": 50
    }
  ]
}
```

---

### Categories

#### Get All Categories
```
GET /categories
```

Response:
```json
{
  "success": true,
  "data": ["Paints", "Tools", "Hardware", "Solvents"]
}
```

---

### Dashboard

#### Get Dashboard Statistics
```
GET /dashboard/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "total_products": 15,
    "total_stock": 250,
    "total_sales": 42,
    "total_revenue": 1234.56
  }
}
```

---

### Health Check

#### Health Status
```
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Backend is running"
}
```

---

## Error Handling

Common HTTP Status Codes:
- `200 OK`: Successful GET, PUT request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid request data or parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Example Error Response:
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

---

## CURL Examples

### Add a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acrylic Paint",
    "category": "Paints",
    "price": 25.99,
    "date_stocked": "2024-01-15",
    "stock_amount": 50,
    "expiry_date": "2025-01-15",
    "size": "20L"
  }'
```

### Record a Sale
```bash
curl -X POST http://localhost:5000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_sold": 5,
    "sale_price": 25.99,
    "sale_date": "2024-01-20"
  }'
```

### Filter Products
```bash
curl "http://localhost:5000/api/products?name=paint&price_min=10&price_max=100"
```

### Get Expiry Check
```bash
curl "http://localhost:5000/api/products/expiry/closest?days=30"
```

---

## Database Relationships

### Products ↔ Sales (One-to-Many)
- A product can have multiple sales
- Each sale references exactly one product
- Deleting a product cascades to delete its sales

### Stock Management
- Sales automatically decrement product stock
- Deleting a sale restores the stock
- Updating a sale adjusts stock accordingly

---

## Rate Limiting

Currently not implemented but can be added using Flask-Limiter.

## CORS

CORS is enabled for all routes to allow frontend access. Configure allowed origins in production.

