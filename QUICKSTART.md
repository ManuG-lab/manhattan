# Quick Start Guide

## Prerequisites
- Python 3.7 or higher
- Node.js 14 or higher
- npm or yarn

## Installation Steps

### 1. Clone/Navigate to Project
```bash
cd /home/emmanuel-gitau/Bussines/manhattan
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
```

The database will be automatically created on first run.

### 3. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

The application will open at `http://localhost:3000`

## First Time Setup

### Demo Data Entry

1. **Login** with any demo credentials:
   - Email: `admin@hardware.com` | Password: `admin123`
   - Email: `manager@hardware.com` | Password: `manager123`
   - Email: `user@hardware.com` | Password: `user123`

2. **Go to Dashboard** - See empty statistics

3. **Add Products**:
   - Click "Add Product"
   - Fill in product details:
     - Name: "Acrylic Paint Blue"
     - Category: "Paints"
     - Price: 25.99
     - Size: 20L
     - Stock Amount: 50
     - Expiry Date: 2025-12-31
   - Click "Add Product"
   - Repeat to add more products

4. **View Products**:
   - Click "Products"
   - Try filtering by name, category, or price range

5. **Record Sales**:
   - Click "Sales"
   - Click "Record Sale"
   - Select product
   - Enter quantity and sale price
   - Click "Record Sale"
   - Notice stock is automatically reduced

6. **Check Expiry**:
   - Click "Expiry Check"
   - View products organized by expiry date
   - Change the days threshold (7, 14, 30, 60, 90 days)

7. **Monitor Dashboard**:
   - Go back to Dashboard
   - See statistics updated with your data

## Troubleshooting

### Backend Issues

**Port 5000 already in use**:
```bash
# On macOS/Linux
lsof -i :5000
kill -9 <PID>

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Database issues**:
```bash
# Delete the database to start fresh
rm hardware_management.db

# Backend will recreate it on startup
python app.py
```

### Frontend Issues

**Port 3000 already in use**:
```bash
npm start -- --port 3001
```

**Dependencies issues**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Blank page or errors**:
1. Check browser console (F12)
2. Verify backend is running on http://localhost:5000
3. Check network tab for API calls

### Connection Issues

**Backend API unreachable**:
1. Verify backend is running: `python app.py` in backend folder
2. Test health endpoint: `curl http://localhost:5000/api/health`
3. Check CORS is enabled in `backend/app.py`

**Database locked**:
```bash
# Close any other instances and restart backend
```

## File Structure Overview

```
manhattan/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   └── hardware_management.db # SQLite database (created automatically)
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components (Login, Dashboard, etc.)
│   │   ├── components/       # Reusable components (Navbar, ProductTable)
│   │   ├── services/         # API integration (api.js)
│   │   ├── App.js            # Main app routing
│   │   └── index.js          # React entry point
│   ├── public/
│   │   └── index.html        # HTML template
│   └── package.json          # Node dependencies
│
├── README.md                 # Main documentation
├── API_DOCUMENTATION.md      # Detailed API docs
├── setup.sh                  # Automated setup script
└── QUICKSTART.md            # This file
```

## Key Endpoints to Test

Once both servers are running, test these:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all products (should be empty at first)
curl http://localhost:5000/api/products

# Get dashboard stats
curl http://localhost:5000/api/dashboard/stats

# Get categories
curl http://localhost:5000/api/categories
```

## Common Tasks

### Add a Product via API
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paint Blue",
    "category": "Paints",
    "price": 25.99,
    "date_stocked": "2024-01-15",
    "stock_amount": 50,
    "expiry_date": "2025-12-31",
    "size": "20L"
  }'
```

### Record a Sale via API
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

## Development Tips

### Hot Reload
- **Frontend**: Changes auto-reload in browser
- **Backend**: Run with `python -m flask run` or use `flask --reload`

### Debugging
- **Frontend**: Open DevTools (F12)
- **Backend**: Check terminal output for errors and add `print()` statements

### Database Inspection
```bash
# Connect to SQLite database
sqlite3 hardware_management.db

# List tables
.tables

# View products
SELECT * FROM products;

# View sales
SELECT * FROM sales;

# Exit
.quit
```

## Next Steps

1. Customize the demo credentials in `frontend/src/pages/Login.js`
2. Add more product categories
3. Implement user authentication with JWT tokens
4. Add reporting features
5. Deploy to production

## Support Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [SQLite Documentation](https://www.sqlite.org/)
- [Axios Documentation](https://axios-http.com/)
- [React Router Documentation](https://reactrouter.com/)

Enjoy building! 🚀
