import React, { useEffect, useState } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import ProductTable from '../components/ProductTable';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(filters);
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const filters = {};
    if (nameFilter) filters.name = nameFilter;
    if (categoryFilter) filters.category = categoryFilter;
    if (priceMin) filters.price_min = parseFloat(priceMin);
    if (priceMax) filters.price_max = parseFloat(priceMax);
    loadProducts(filters);
  };

  const handleClearFilters = () => {
    setNameFilter('');
    setCategoryFilter('');
    setPriceMin('');
    setPriceMax('');
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
        console.error(error);
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Products</h1>
      
      <div className="filter-section">
        <div className="filter-grid">
          <input
            type="text"
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="filter-input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-input"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="filter-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-buttons">
          <button className="btn btn-primary" onClick={handleFilter}>Filter</button>
          <button className="btn btn-secondary" onClick={handleClearFilters}>Clear</button>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ProductTable products={products} onDelete={handleDeleteProduct} />
      )}
    </div>
  );
}

export default Products;
