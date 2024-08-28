"use client";

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import NavBar from '@/Components/NavBar';
import ReviewProductList from '@/Components/ReviewProductList';

const Pending = () => {
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/reviewProduct/allReviews`);
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Error fetching pending reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className='h-screen bg-gray-100 flex flex-col justify-center items-center'>
        <p className='text-4xl text-orange-500 animate-pulse'>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto my-8 p-6">
        <div className='flex items-center justify-between mb-6'>
          <h1 className="text-3xl font-semibold text-orange-500">Pending Requests</h1>
          <Link href="/profile">
            <span className='px-4 py-2 bg-gray-800 text-white uppercase rounded-lg shadow-md hover:bg-gray-700 transition duration-300 cursor-pointer'>
              Back to Profile
            </span>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <div key={product._id || index} className='p-4 border-b last:border-0 hover:bg-gray-50 transition duration-300'>
                <ReviewProductList product={product} />
              </div>
            ))
          ) : (
            <div className='flex items-center justify-center p-8 text-gray-500'>
              <p className="text-xl">No pending review requests found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pending;