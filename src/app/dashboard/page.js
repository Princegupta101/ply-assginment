import axios from 'axios';
import Image from 'next/image';

import NavBar from '@/Components/NavBar';
import ProductCard from '@/Components/ProductCard';

export default async function Dashboard() {
  let products = null;

  try {
    const response = await axios.get("/api/products/getProducts/");
    products = response.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    products = [];
  }

  return (
    <>
      <NavBar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-orange-500 font-extrabold mb-6 text-center drop-shadow-lg">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                className="transform transition duration-300 hover:scale-105 hover:shadow-lg"
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col justify-center items-center">
              
              <p className="text-lg text-gray-600">No products available at the moment. Please check back later!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
