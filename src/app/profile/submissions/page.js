"use client";

import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import NavBar from '@/Components/NavBar';
import ProductList from '@/Components/ProductList';

const Submissions = () => {
  const [products, setProducts] = useState(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/reviewProduct/userSubmission?user_id=${userId}`);
      if (res.status === 200) {
        setProducts(res.data.reviewProduct);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (products === null) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col justify-center items-center">
        <p className="text-6xl text-orange-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto my-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-orange-500">My Submissions</h1>
          <Link href="/profile">
            <button className="py-2 px-6 text-white bg-orange-500 rounded-md shadow-md hover:bg-orange-600 transition duration-300">
              Back to Profile
            </button>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="mb-4">
                <ProductList product={product} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-gray-500 text-lg">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Submissions;
