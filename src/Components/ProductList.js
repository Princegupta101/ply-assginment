import Image from "next/image";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="p-4 border flex flex-col md:flex-row items-center justify-between border-gray-300 rounded-md shadow-lg bg-white">
      {/* Product Image */}
      <div className="mb-4 md:mb-0">
        <Image
          src={product.image}
          alt={product.productName}
          width={192} // Adjusted to match the w-48 (48 * 4 = 192px)
          height={192} // Adjusted to match the h-48 (48 * 4 = 192px)
          className="object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 md:ml-6">
        <h2 className="text-lg font-semibold mb-1">Product Name: {product.productName}</h2>
        <h3 className="text-md font-medium mb-2">Product ID: {product.id}</h3>
        <p className="text-gray-700 mb-2">Price: ${product.price}</p>
      </div>

      {/* Product Status */}
      <div className="p-2">
        <p
          className={`text-sm font-bold uppercase ${
            product.status === "approved"
              ? "text-green-500"
              : product.status === "rejected"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          Status: {product.status}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
