import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { toast } from 'react-toastify';
import './AddProduct.css';

const SIZES = [
  '20L', '4L', '1L', '200ML', '100ML', '50ML', '5L', '1/2L', '3L', '0.75L', 
  '0.25L', '0.63L', '0.5L', '30KG', '25KG', '20KG', '5KG', '1KG', '0.5KG', 
  '1"', '11"', '0.75"', '150', '200', '250', '300', '350', '400'
];

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    date_stocked: new Date().toISOString().split('T')[0],
    stock_amount: '',
    expiry_date: '',
    size: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.stock_amount || !formData.size) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await productsAPI.create({
        ...formData,
        price: parseFloat(formData.price),
        stock_amount: parseInt(formData.stock_amount),
      });
      toast.success('Product added successfully');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Add New Product</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Acrylic Paint"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <input
            id="category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Paint, Tools, Hardware"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="size">Size/Variant *</label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          >
            <option value="">Select a size</option>
            {SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date_stocked">Date Stocked *</label>
          <input
            id="date_stocked"
            type="date"
            name="date_stocked"
            value={formData.date_stocked}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock_amount">Stock Amount (Quantity) *</label>
          <input
            id="stock_amount"
            type="number"
            name="stock_amount"
            value={formData.stock_amount}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiry_date">Expiry Date</label>
          <input
            id="expiry_date"
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
