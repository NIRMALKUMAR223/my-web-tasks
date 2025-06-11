import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    // fetch(`https://dummyjson.com/products/${id}`) use this for displaying dynamic product
    
    fetch(`https://dummyjson.com/products/80`)
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
            <h1>{product.title}</h1>
            <div className="image-container">
              <img
                src={product.thumbnail || product.images[0]}
                alt={product.title}
                className="product-image"
              />
            </div>
            <p><strong>Price: </strong> <span className='price'>${product.price}</span></p>
            <p><strong>Description: </strong> {product.description}</p>
            <p><strong>Category: </strong> {product.category}</p>
            <p><strong>Created At: </strong> {new Date().toLocaleDateString()}</p>
            <div className="btn">
              <button className='buy-button'>Buy Now</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductDetail;
