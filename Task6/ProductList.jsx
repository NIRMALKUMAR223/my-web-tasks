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

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories with name and slug
  useEffect(() => {
    axios.get('https://dummyjson.com/products/categories')
      .then(res => {
        const catArray = res.data.map(item => {
          if (typeof item === 'object') return item;
          return { name: item, slug: item, url: `https://dummyjson.com/products/category/${item}` };
        });
        setCategories(catArray);
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const fetchProducts = async (pageNumber) => {
    setLoading(true);
    setError(false);
    try {
      const skip = (pageNumber - 1) * PRODUCTS_PER_PAGE;
      let resultProducts = [];

      if (searchTerm.trim()) {
        const res = await axios.get(`https://dummyjsons/search?q=${searchTerm}`);
        resultProducts = res.data.products || [];

        if (category) {
          resultProducts = resultProducts.filter(p => p.category === category);
        }

        setProducts(resultProducts);
        setTotalProducts(resultProducts.length);
      } else {
        let endpoint = category
          ? `https://dummyjson.com/products/category/${category}?limit=10&skip=${skip}`
          : `https://dummyjson.com/products?limit=10&skip=${skip}`;

        const res = await axios.get(endpoint);
        resultProducts = res.data.products || [];

        setProducts(resultProducts);
        setTotalProducts(res.data.total);
      }

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
  }, [page, searchTerm, category]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="container">
      <h2 className="title">Product List</h2>

      {/* Search and Filter */}
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="filter-dropdown"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error or Loading */}
      {error ? (
        <div className="error-box">
          <p>⚠️ Failed to load products. Please try again.</p>
          <button className="retry-button" onClick={() => fetchProducts(page)}>Retry</button>
        </div>
      ) : loading ? (
        <div className="product-grid">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.thumbnail} alt={product.title} className="product-img" />
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">$ {product.price}</p>
              <div className="btn">
                <button className='buy-button'>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!error && !searchTerm && products.length > 0 && (
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
