import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css'; 
import SkeletonCard from './SkeletonCard'; 

const ProductList = () => {
  const PRODUCTS_PER_PAGE = 10;
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = async (pageNumber) => {
    const skip = (pageNumber - 1) * PRODUCTS_PER_PAGE;
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(`https://dummyjson.com/products?limit=10&skip=${skip}`);
      setProducts(res.data.products);
      setTotalProducts(res.data.total);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="container">
      <h2 className="title">Product List</h2>

      {error ? (
        <div className="error-box">
          <p>⚠️ Failed to load products. Please try again.</p>
          <button className="retry-button" onClick={() => fetchProducts(page)}>Retry</button>
        </div>
      ) : (
        <div className="product-grid">
          {loading
            ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.thumbnail} alt={product.title} className="product-img" />
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">₹ {product.price}</p>
                </div>
              ))}
        </div>
      )}

      {!error && (
        <div className="pagination">
          <button
            className="page-button"
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
          >
            {loading ? '...' : 'Previous'}
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button
            className="page-button"
            disabled={page === totalPages || loading}
            onClick={() => setPage(page + 1)}
          >
            {loading ? '...' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
