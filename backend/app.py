from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)
# Explicit CORS configuration for API routes to ensure Access-Control-Allow-Origin is returned
# This allows requests from any origin; in production, restrict `origins` to your frontend domain(s).
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE = 'hardware_management.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with tables"""
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    # Products table
    c.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            date_stocked DATE NOT NULL,
            stock_amount INTEGER NOT NULL,
            expiry_date DATE,
            size TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Sales table
    c.execute('''
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity_sold INTEGER NOT NULL,
            sale_price REAL NOT NULL,
            sale_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
if not os.path.exists(DATABASE):
    init_db()

# ==================== PRODUCTS ENDPOINTS ====================

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Get filter parameters
        name_filter = request.args.get('name', '').strip()
        price_min = request.args.get('price_min', type=float)
        price_max = request.args.get('price_max', type=float)
        category_filter = request.args.get('category', '').strip()
        
        query = 'SELECT * FROM products WHERE 1=1'
        params = []
        
        if name_filter:
            query += ' AND name LIKE ?'
            params.append(f'%{name_filter}%')
        
        if category_filter:
            query += ' AND category LIKE ?'
            params.append(f'%{category_filter}%')
        
        if price_min is not None:
            query += ' AND price >= ?'
            params.append(price_min)
        
        if price_max is not None:
            query += ' AND price <= ?'
            params.append(price_max)
        
        query += ' ORDER BY expiry_date ASC'
        
        c.execute(query, params)
        products = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': products}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        product = c.fetchone()
        conn.close()
        
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        return jsonify({'success': True, 'data': dict(product)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products', methods=['POST'])
def add_product():
    """Add a new product"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category', 'price', 'date_stocked', 'stock_amount', 'size']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        conn = get_db_connection()
        c = conn.cursor()
        
        c.execute('''
            INSERT INTO products (name, category, price, date_stocked, stock_amount, expiry_date, size)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['category'],
            data['price'],
            data['date_stocked'],
            data['stock_amount'],
            data.get('expiry_date'),
            data['size']
        ))
        
        conn.commit()
        product_id = c.lastrowid
        conn.close()
        
        return jsonify({'success': True, 'message': 'Product added successfully', 'id': product_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        c = conn.cursor()
        
        # Check if product exists
        c.execute('SELECT id FROM products WHERE id = ?', (product_id,))
        if not c.fetchone():
            conn.close()
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        # Build update query dynamically
        update_fields = []
        params = []
        
        if 'name' in data:
            update_fields.append('name = ?')
            params.append(data['name'])
        if 'category' in data:
            update_fields.append('category = ?')
            params.append(data['category'])
        if 'price' in data:
            update_fields.append('price = ?')
            params.append(data['price'])
        if 'stock_amount' in data:
            update_fields.append('stock_amount = ?')
            params.append(data['stock_amount'])
        if 'expiry_date' in data:
            update_fields.append('expiry_date = ?')
            params.append(data['expiry_date'])
        if 'size' in data:
            update_fields.append('size = ?')
            params.append(data['size'])
        
        if not update_fields:
            conn.close()
            return jsonify({'success': False, 'error': 'No fields to update'}), 400
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        params.append(product_id)
        
        query = f'UPDATE products SET {", ".join(update_fields)} WHERE id = ?'
        c.execute(query, params)
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Product updated successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Check if product exists
        c.execute('SELECT id FROM products WHERE id = ?', (product_id,))
        if not c.fetchone():
            conn.close()
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        c.execute('DELETE FROM products WHERE id = ?', (product_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== SALES ENDPOINTS ====================

@app.route('/api/sales', methods=['GET'])
def get_sales():
    """Get all sales"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        c.execute('''
            SELECT s.*, p.name, p.category, p.size 
            FROM sales s 
            JOIN products p ON s.product_id = p.id 
            ORDER BY s.sale_date DESC
        ''')
        
        sales = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': sales}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sales', methods=['POST'])
def add_sale():
    """Add a new sale"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['product_id', 'quantity_sold', 'sale_price', 'sale_date']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        conn = get_db_connection()
        c = conn.cursor()
        
        # Check if product exists and has sufficient stock
        c.execute('SELECT stock_amount FROM products WHERE id = ?', (data['product_id'],))
        product = c.fetchone()
        
        if not product:
            conn.close()
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        if product['stock_amount'] < data['quantity_sold']:
            conn.close()
            return jsonify({'success': False, 'error': 'Insufficient stock'}), 400
        
        # Add sale
        c.execute('''
            INSERT INTO sales (product_id, quantity_sold, sale_price, sale_date)
            VALUES (?, ?, ?, ?)
        ''', (
            data['product_id'],
            data['quantity_sold'],
            data['sale_price'],
            data['sale_date']
        ))
        
        # Update product stock
        c.execute('''
            UPDATE products 
            SET stock_amount = stock_amount - ? 
            WHERE id = ?
        ''', (data['quantity_sold'], data['product_id']))
        
        conn.commit()
        sale_id = c.lastrowid
        conn.close()
        
        return jsonify({'success': True, 'message': 'Sale recorded successfully', 'id': sale_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sales/<int:sale_id>', methods=['GET'])
def get_sale(sale_id):
    """Get a single sale by ID"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            SELECT s.*, p.name, p.category, p.size 
            FROM sales s 
            JOIN products p ON s.product_id = p.id 
            WHERE s.id = ?
        ''', (sale_id,))
        sale = c.fetchone()
        conn.close()
        
        if not sale:
            return jsonify({'success': False, 'error': 'Sale not found'}), 404
        
        return jsonify({'success': True, 'data': dict(sale)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sales/<int:sale_id>', methods=['PUT'])
def update_sale(sale_id):
    """Update a sale"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        c = conn.cursor()
        
        # Get current sale to check previous quantity
        c.execute('SELECT product_id, quantity_sold FROM sales WHERE id = ?', (sale_id,))
        current_sale = c.fetchone()
        
        if not current_sale:
            conn.close()
            return jsonify({'success': False, 'error': 'Sale not found'}), 404
        
        # Build update query
        update_fields = []
        params = []
        
        if 'quantity_sold' in data:
            update_fields.append('quantity_sold = ?')
            params.append(data['quantity_sold'])
        if 'sale_price' in data:
            update_fields.append('sale_price = ?')
            params.append(data['sale_price'])
        if 'sale_date' in data:
            update_fields.append('sale_date = ?')
            params.append(data['sale_date'])
        
        if not update_fields:
            conn.close()
            return jsonify({'success': False, 'error': 'No fields to update'}), 400
        
        # Handle stock adjustment if quantity changed
        if 'quantity_sold' in data and data['quantity_sold'] != current_sale['quantity_sold']:
            quantity_diff = data['quantity_sold'] - current_sale['quantity_sold']
            
            # Check if sufficient stock available
            c.execute('SELECT stock_amount FROM products WHERE id = ?', (current_sale['product_id'],))
            product = c.fetchone()
            
            if product['stock_amount'] < quantity_diff:
                conn.close()
                return jsonify({'success': False, 'error': 'Insufficient stock for this adjustment'}), 400
            
            c.execute('''
                UPDATE products 
                SET stock_amount = stock_amount - ? 
                WHERE id = ?
            ''', (quantity_diff, current_sale['product_id']))
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        params.append(sale_id)
        
        query = f'UPDATE sales SET {", ".join(update_fields)} WHERE id = ?'
        c.execute(query, params)
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Sale updated successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sales/<int:sale_id>', methods=['DELETE'])
def delete_sale(sale_id):
    """Delete a sale and restore product stock"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Get sale details
        c.execute('SELECT product_id, quantity_sold FROM sales WHERE id = ?', (sale_id,))
        sale = c.fetchone()
        
        if not sale:
            conn.close()
            return jsonify({'success': False, 'error': 'Sale not found'}), 404
        
        # Restore product stock
        c.execute('''
            UPDATE products 
            SET stock_amount = stock_amount + ? 
            WHERE id = ?
        ''', (sale['quantity_sold'], sale['product_id']))
        
        # Delete sale
        c.execute('DELETE FROM sales WHERE id = ?', (sale_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Sale deleted and stock restored'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== STOCK & EXPIRY ENDPOINTS ====================

@app.route('/api/stock/check', methods=['GET'])
def check_stock():
    """Check stock levels"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        c.execute('''
            SELECT id, name, category, size, stock_amount 
            FROM products 
            ORDER BY stock_amount ASC
        ''')
        
        stock_data = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': stock_data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/expiry/closest', methods=['GET'])
def get_closest_expiry():
    """Get products closest to expiry date"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        days_threshold = request.args.get('days', 30, type=int)
        
        c.execute(f'''
            SELECT id, name, category, size, price, expiry_date, stock_amount
            FROM products
            WHERE expiry_date IS NOT NULL
            ORDER BY expiry_date ASC
            LIMIT {days_threshold}
        ''')
        
        expiry_data = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': expiry_data}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== CATEGORIES ENDPOINTS ====================

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all unique categories"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        c.execute('SELECT DISTINCT category FROM products ORDER BY category')
        categories = [row[0] for row in c.fetchall()]
        conn.close()
        
        return jsonify({'success': True, 'data': categories}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== DASHBOARD ENDPOINTS ====================

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Total products
        c.execute('SELECT COUNT(*) as count FROM products')
        total_products = c.fetchone()['count']
        
        # Total stock
        c.execute('SELECT SUM(stock_amount) as total FROM products')
        result = c.fetchone()
        total_stock = result['total'] if result['total'] else 0
        
        # Total sales
        c.execute('SELECT COUNT(*) as count FROM sales')
        total_sales = c.fetchone()['count']
        
        # Revenue
        c.execute('SELECT SUM(quantity_sold * sale_price) as revenue FROM sales')
        result = c.fetchone()
        total_revenue = result['revenue'] if result['revenue'] else 0
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'total_products': total_products,
                'total_stock': total_stock,
                'total_sales': total_sales,
                'total_revenue': total_revenue
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'success': True, 'message': 'Backend is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
