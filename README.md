# Hardware Management System - 1st MVP

A complete hardware inventory management system with both frontend and backend components.

## Features

### Frontend (React)
- **Authentication**: Static user login with demo credentials
- **Dashboard**: Real-time statistics on products, stock, sales, and revenue
- **Product Management**: 
  - View all products with advanced filtering (name, price, category)
  - Add new products with size variants
  - Delete products
  - Low stock indicators
- **Sales Management**: Record, update, and delete sales
- **Expiry Tracking**: Monitor products closest to expiry dates with alerts
- **Responsive UI**: Mobile-friendly design with Toastify notifications

### Backend (Flask)
- **RESTful API** with CORS support
- **SQLite Database** with proper schema
- **Product Management**: Full CRUD operations
- **Sales Management**: Track sales with automatic stock adjustment
- **Stock Management**: Monitor inventory levels
- **Expiry Tracking**: Query products by expiry dates
- **Dashboard Stats**: Aggregate statistics

## Project Structure

```
manhattan/
├── backend/
│   ├── app.py                 # Flask application with all endpoints
│   ├── requirements.txt       # Python dependencies
│   └── hardware_management.db # SQLite database (auto-created)
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable React components
    │   ├── pages/            # Page components
    │   ├── services/         # API service layer
    │   ├── App.js            # Main App component
    │   └── index.js          # React entry point
    └── package.json          # Node dependencies
```

## Tech Stack

### Backend
- **Python 3.x**
- **Flask 2.3.3**: Web framework
- **Flask-CORS 4.0.0**: Cross-origin support
- **SQLite3**: Database (built-in)

### Frontend
- **React 18.2.0**: UI library
- **React Router 6.15.0**: Navigation
- **Axios 1.5.0**: HTTP client
- **React-Toastify 9.1.3**: Notifications
- **CSS3**: Styling

## Installation

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/<id>` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/<id>` - Update product
- `DELETE /api/products/<id>` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/<id>` - Get single sale
- `POST /api/sales` - Record new sale
- `PUT /api/sales/<id>` - Update sale
- `DELETE /api/sales/<id>` - Delete sale

### Stock & Expiry
- `GET /api/stock/check` - Check stock levels
- `GET /api/products/expiry/closest` - Get products closest to expiry

### Categories
- `GET /api/categories` - Get all unique categories

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Health
- `GET /api/health` - Health check

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@hardware.com | admin123 | Admin |
| manager@hardware.com | manager123 | Manager |
| user@hardware.com | user123 | User |

## Product Sizes

The system supports various product sizes:

**Volume Sizes**: 20L, 4L, 1L, 200ML, 100ML, 50ML, 5L, 1/2L, 3L, 0.75L, 0.25L, 0.63L, 0.5L

**Weight Sizes**: 30KG, 25KG, 20KG, 5KG, 1KG, 0.5KG

**Dimension Sizes**: 1", 11", 0.75", 150-400

## Database Schema

### Products Table
- `id`: Unique identifier (AUTO_INCREMENT)
- `name`: Product name
- `category`: Product category
- `price`: Product price
- `date_stocked`: When product was added to inventory
- `stock_amount`: Current quantity in stock
- `expiry_date`: Product expiration date
- `size`: Product size/variant
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Sales Table
- `id`: Unique identifier (AUTO_INCREMENT)
- `product_id`: Reference to product (Foreign Key)
- `quantity_sold`: Quantity sold in this transaction
- `sale_price`: Price at which product was sold
- `sale_date`: Date of sale
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Usage Flow

1. **Login**: Use demo credentials to access the system
2. **Dashboard**: View overall statistics
3. **Add Products**: Navigate to "Add Product" and fill in details
4. **View Products**: Browse all products with advanced filtering
5. **Record Sales**: Go to Sales page and record new sales (auto-adjusts stock)
6. **Monitor Expiry**: Check "Expiry Check" page for products nearing expiration
7. **Track Sales**: View all sales history with details

## Key Features

### Filtering System
- Filter by product name (contains search)
- Filter by category
- Filter by price range
- Combine multiple filters

### Stock Management
- Automatic stock deduction on sale
- Stock restoration when sale is deleted
- Low stock indicators (< 10 items)

### Expiry Tracking
- Filter by days threshold (7, 14, 30, 60, 90 days)
- Visual indicators for urgency
- Color-coded alerts

### Sales Tracking
- Complete sale history
- Calculate total revenue
- Update and delete sales with stock adjustment
- Product details visible in sales list

## Error Handling

The application includes comprehensive error handling:
- API errors with meaningful messages
- Form validation
- Toast notifications for user feedback
- Graceful fallbacks for missing data

## Future Enhancements

- User role-based access control
- Advanced reporting and analytics
- Barcode scanning
- Multi-currency support
- Batch operations
- Data export functionality
- Mobile app version

## Support

For issues or questions, please refer to the API documentation or check console logs for debugging information.
