import React from 'react';
import './ProductTable.css';

function ProductTable({ products, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Size</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Date Stocked</th>
          <th>Expiry Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>{product.size}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
              <span className={product.stock_amount < 10 ? 'low-stock' : ''}>
                {product.stock_amount}
              </span>
            </td>
            <td>{product.date_stocked}</td>
            <td>
              {product.expiry_date ? (
                <span className={new Date(product.expiry_date) < new Date() ? 'expired' : ''}>
                  {product.expiry_date}
                </span>
              ) : (
                '-'
              )}
            </td>
            <td>
              <button 
                className="btn-delete" 
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
