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
    getProductData();
  }, []);

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
        <div className="container mx-auto my-8 p-4 space-y-6 border border-gray-200 rounded-lg shadow-md">
          <h1 className="text-4xl uppercase text-gray-600 font-semibold mb-6">
            {product.productName}
          </h1>
          <div className="flex flex-col items-start md:flex-row">
            <div className="md:w-1/2">
              <Image
                src={product.image}
                alt={product.productName}
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-8 space-y-4 p-4">
              <div>
                <h2 className="text-lg font-bold text-gray-500">
                  Product ID: {product._id}
                </h2>
                <p className="text-2xl font-semibold mb-4">${product.price}</p>
                <p className="text-lg text-gray-700 mb-6">
                  {product.productDescription}
                </p>
                <p className="text-lg text-gray-600">
                  Category: {product.department}
                </p>
              </div>
              <div>
                <button
                  className="font-semibold py-2 px-4 w-full text-white flex items-center justify-center bg-orange-500 hover:bg-orange-400 transition duration-300 rounded-md"
                  onClick={() => {
                    router.push(`/product/editProduct?id=${product._id}`);
                  }}
                >
                  EDIT
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[680px] xl:h-screen bg-white flex flex-col justify-center items-center">
          <p className="text-6xl text-orange-500 animate-pulse">Loading...</p>
        </div>
      )}
    </>
  );
}
