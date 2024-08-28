"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import NavBar from "@/Components/NavBar";

export default function Page() {
  const [product, setProduct] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getProductData();
    }
  }, [id]);

  const getProductData = async () => {
    try {
      const res = await axios.get(`/api/products/getProduct?id=${id}`);
      if (res.status === 200) {
        setProduct(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch product data:", err);
    }
  };

  return (
    <>
      <NavBar />
      {product ? (
        <div className="container mx-auto px-4 md:px-8 my-8">
          <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{product.productName}</h1>
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src={product.image}
                  alt={product.productName}
                  width={500}
                  height={350}
                  className="rounded-lg shadow-md"
                  layout="intrinsic"
                />
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold text-gray-700">Product ID</h2>
                  <p className="text-xl text-gray-800 mb-2">{product._id}</p>
                  <h2 className="text-lg font-semibold text-gray-700">Price</h2>
                  <p className="text-2xl font-bold text-gray-900 mb-4">${product.price}</p>
                  <h2 className="text-lg font-semibold text-gray-700">Description</h2>
                  <p className="text-lg text-gray-600 mb-4">{product.productDescription}</p>
                  <h2 className="text-lg font-semibold text-gray-700">Category</h2>
                  <p className="text-lg font-medium text-gray-600">{product.department}</p>
                </div>
                <div className="flex flex-col gap-5">
                  <button
                    className="w-full py-3 px-6 bg-orange-500 text-white font-semibold rounded-md shadow-lg hover:bg-orange-400 transition duration-300"
                    onClick={() => router.push(`/product/editProduct?id=${product._id}`)}
                  >
                    Edit Product
                  </button>
                  <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 px-6 bg-gray-700 text-white uppercase rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
            >
              Back to Dashboard
            </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[680px] flex items-center justify-center bg-gray-100">
          <p className="text-4xl text-orange-500 animate-pulse">Loading...</p>
        </div>
      )}
    </>
  );
}
