import React, { useEffect, useState } from 'react';
import { salesAPI, productsAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Sales.css';

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity_sold: '',
    sale_price: '',
    sale_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [salesRes, productsRes] = await Promise.all([
        salesAPI.getAll(),
        productsAPI.getAll()
      ]);
      setSales(salesRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.quantity_sold || !formData.sale_price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await salesAPI.create({
        ...formData,
        product_id: parseInt(formData.product_id),
        quantity_sold: parseInt(formData.quantity_sold),
        sale_price: parseFloat(formData.sale_price),
      });
      toast.success('Sale recorded successfully');
      setFormData({
        product_id: '',
        quantity_sold: '',
        sale_price: '',
        sale_date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to record sale');
      console.error(error);
    }
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await salesAPI.delete(id);
        toast.success('Sale deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete sale');
        console.error(error);
      }
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? `${product.name} (${product.size})` : 'Unknown';
  };

  return (
    <div className="page-container">
      <h1>Sales Management</h1>
      
      <button 
        className="btn btn-primary" 
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '1.5rem' }}
      >
        {showForm ? 'Cancel' : 'Record Sale'}
      </button>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product_id">Product *</label>
            <select
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.size}) - Stock: {product.stock_amount}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity_sold">Quantity Sold *</label>
            <input
              id="quantity_sold"
              type="number"
              name="quantity_sold"
              value={formData.quantity_sold}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sale_price">Sale Price ($) *</label>
            <input
              id="sale_price"
              type="number"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sale_date">Sale Date *</label>
            <input
              id="sale_date"
              type="date"
              name="sale_date"
              value={formData.sale_date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Record Sale</button>
        </form>
      )}

      {loading ? (
        <p>Loading sales...</p>
      ) : sales.length === 0 ? (
        <p>No sales recorded</p>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Sale Price</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{getProductName(sale.product_id)}</td>
                <td>{sale.quantity_sold}</td>
                <td>${sale.sale_price.toFixed(2)}</td>
                <td>${(sale.quantity_sold * sale.sale_price).toFixed(2)}</td>
                <td>{sale.sale_date}</td>
                <td>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDeleteSale(sale.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Sales;
