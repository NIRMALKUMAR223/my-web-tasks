import React from 'react';

const SkeletonCard = () => (
  <div className="product-card skeleton">
    <div className="skeleton-img shimmer"></div>
    <div className="skeleton-text shimmer short"></div>
    <div className="skeleton-text shimmer"></div>
  </div>
);

export default SkeletonCard;
