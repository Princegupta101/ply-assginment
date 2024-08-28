"use client";

import { useRouter } from 'next/navigation';
import React from 'react';

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product?id=${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="max-w-sm mx-2 my-4 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
    >
      <div className="relative w-full h-56">
        <img
          src={product.image}
          alt={product.productName}
          style={{ objectFit: 'cover' }}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h2>
        <p className="text-gray-600 mb-4">{product.productDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900">${product.price}</span>
          <span className="text-sm font-medium text-gray-500">ID: {product._id}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
