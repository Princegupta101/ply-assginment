"use client";

import axios from 'axios';
import Image from 'next/image'; // Import Image component
import { useRouter, useSearchParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import ExampleModal from '@/Components/ExampleModal';
import NavBar from '@/Components/NavBar';

export default function ProductPendingPage() {
  const [product, setProduct] = useState({
    name: '',
    image: '',
    price: '',
    productDescription: '',
    department: ''
  });
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get('request_id');
  const router = useRouter();

  useEffect(() => {
    getProductData();
  }, []);

  const getProductData = async () => {
    try {
      const res = await axios.get(`/api/reviewProduct/getReview?request_id=${id}`);
      if (res.status === 200) {
        setProduct(res.data);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/products/updateProduct?id=${product.originalId?._id}&request_id=${id}`, product);
      if (res.status === 200) {
        enqueueSnackbar('Updated successfully', { variant: "success" });
        router.push(`/product?id=${product.originalId?._id}`);
      }
    } catch (err) {
      setIsLoading(false);
      enqueueSnackbar('Error updating product', { variant: "error" });
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/reviewProduct/updateReview?request_id=${id}`, product);
      if (res.status === 200) {
        enqueueSnackbar('Updated successfully', { variant: "success" });
        router.push(`/product?id=${product.originalId._id}`);
      }
    } catch (err) {
      setIsLoading(false);
      enqueueSnackbar('Error updating product', { variant: "error" });
    }
  };

  const onClose = () => {
    setModal(false);
  };

  const onCropComplete = (croppedImage) => {
    setProduct(prev => ({
      ...prev,
      image: croppedImage
    }));
  };

  if (!product.name) {
    return (
      <div className='h-[680px] xl:h-screen bg-white flex flex-col justify-center items-center'>
        <p className='text-6xl text-orange-500 animate-pulse'>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto my-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className='text-2xl font-semibold text-orange-500'>Change Request</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-800 text-white uppercase rounded-md shadow-md hover:bg-gray-700 transition duration-300"
          >
            Cancel
          </button>
        </div>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {!modal ? (
            <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.productName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor="image" className="block text-lg font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={product.image}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                  <button
                    onClick={() => setModal(true)}
                    className='px-3 py-1 bg-orange-500 text-white uppercase rounded-md hover:bg-orange-400 transition duration-300'
                  >
                    Crop
                  </button>
                </div>

                <div>
                  <label htmlFor="price" className="block text-lg font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productDescription" className="block text-lg font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="productDescription"
                    name="productDescription"
                    value={product.productDescription}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-lg font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={product.department}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    disabled={isLoading}
                    onClick={handleAccept}
                    className={`px-4 py-2 bg-green-600 text-white uppercase rounded-md shadow-md hover:bg-green-500 transition duration-300 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Accept
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={handleReject}
                    className={`px-4 py-2 bg-red-600 text-white uppercase rounded-md shadow-md hover:bg-red-500 transition duration-300 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ExampleModal
              onClose={onClose}
              imageUrl={product.image}
              onCropComplete={onCropComplete}
            />
          )}

          <div className="w-full md:w-1/2 border border-gray-300 rounded-lg bg-white p-6">
            {!isLoading ? (
              <div className="flex items-center">
                {product.originalId?.image && (
                  <div className="w-32 h-32 relative">
                    <Image
                      src={product.originalId?.image}
                      alt={product.originalId?.productName}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                )}
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-orange-500 mb-2">
                    {product.originalId?.productName}
                  </h2>
                  <p className="text-lg">
                    <strong>Price:</strong> ${product.originalId?.price}
                  </p>
                  <p className="text-lg mt-2">
                    <strong>Department:</strong> {product.originalId?.department}
                  </p>
                </div>
              </div>
            ) : (
              <div className='min-h-[200px] bg-white flex flex-col justify-center items-center'>
                <p className='text-6xl text-orange-500 animate-pulse'>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
