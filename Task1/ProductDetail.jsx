import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Product not found');
        }
        return res.json();  
      })
      .then((data) => {
        setProduct(data);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="container">
      
      {loading ? (
        <div className="loading-message">Loading product details !</div>
      ) 
      : error ? (
        <div className="error-message">Product not found !</div>
      ) : (
        <div className="product-info">
          <p><strong>Name: </strong>{product.title}</p>
          <p><strong>Price: </strong> ${product.price}</p>
          <p><strong>Description: </strong> {product.description}</p>
          <p><strong>Category: </strong> {product.category}</p>
          <p><strong>Created At: </strong> {new Date().toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
