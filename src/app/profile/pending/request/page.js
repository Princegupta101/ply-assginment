"use client";

import axios from 'axios';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import ExampleModal from '@/Components/ImageUploadModal';
import NavBar from '@/Components/NavBar';

export default function ProductPendingPage() {
  const [product, setProduct] = useState({
    productName: '',
    image: '',
    price: '',
    productDescription: '',
    department: ''
  });
  const [originalProduct, setOriginalProduct] = useState(null);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get('request_id');
  const router = useRouter();

  useEffect(() => {
    getProductData();
  }, [id]);

  const getProductData = async () => {
    try {
      const res = await axios.get(`/api/reviewProduct/getReview?request_id=${id}`);
      if (res.status === 200) {
        setProduct(res.data);
        setOriginalProduct(res.data.originalId);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      enqueueSnackbar('Error fetching product data', { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/products/updateProduct?id=${originalProduct?._id}&request_id=${id}`,  { ...product, status: 'approved' });
      if (res.status === 200) {
        enqueueSnackbar('Updated successfully', { variant: "success" });
        router.push(`/product?id=${originalProduct?._id}`);
      }
    } catch (err) {
      enqueueSnackbar('Error updating product', { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/reviewProduct/updateReview?request_id=${id}`, { ...product, status: 'rejected' });
      if (res.status === 200) {
        enqueueSnackbar('Review rejected', { variant: "success" });
        router.push(`/pending`);
      }
    } catch (err) {
      enqueueSnackbar('Error rejecting review', { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = (croppedImage) => {
    setProduct(prev => ({ ...prev, image: croppedImage }));
  };

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
        <div className="flex items-center justify-between mb-6">
          <h1 className='text-3xl font-semibold text-orange-500'>Change Request</h1>
          <button
            onClick={() => router.push('/pending')}
            className="px-4 py-2 bg-gray-800 text-white uppercase rounded-md shadow-md hover:bg-gray-700 transition duration-300"
          >
            Back to Pending
          </button>
        </div>

        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6">
            <form className="space-y-4">
              <InputField label="Product Name" name="productName" value={product.productName} onChange={handleChange} />
              <ImageField 
                value={product.image} 
                onChange={handleChange} 
                onCrop={() => setModal(true)} 
              />
              <InputField label="Price" name="price" type="number" value={product.price} onChange={handleChange} />
              <TextAreaField label="Description" name="productDescription" value={product.productDescription} onChange={handleChange} />
              <InputField label="Category" name="department" value={product.department} onChange={handleChange} />
              
              <div className="flex space-x-4">
                <ActionButton onClick={handleAccept} disabled={isLoading} color="green">Accept</ActionButton>
                <ActionButton onClick={handleReject} disabled={isLoading} color="red">Reject</ActionButton>
              </div>
            </form>
          </div>

          <OriginalProductDisplay product={originalProduct} isLoading={isLoading} />
        </div>
      </div>

      {modal && (
        <ExampleModal
          onClose={() => setModal(false)}
          imageUrl={product.image}
          onCropComplete={onCropComplete}
        />
      )}
    </>
  );
}

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-lg font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      required
    />
  </div>
);

const ImageField = ({ value, onChange, onCrop }) => (
  <div className='space-y-2'>
    <label htmlFor="image" className="block text-lg font-medium text-gray-700">Image URL</label>
    <input
      type="text"
      id="image"
      name="image"
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      required
    />
    <button
      onClick={onCrop}
      type="button"
      className='px-3 py-1 bg-orange-500 text-white uppercase rounded-md hover:bg-orange-400 transition duration-300'
    >
      Crop
    </button>
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-lg font-medium text-gray-700">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      rows="4"
      required
    />
  </div>
);

const ActionButton = ({ onClick, disabled, color, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-${color}-600 text-white uppercase rounded-md shadow-md hover:bg-${color}-500 transition duration-300 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
  >
    {children}
  </button>
);

const OriginalProductDisplay = ({ product, isLoading }) => (
  <div className="w-full lg:w-1/2 border border-gray-300 rounded-lg bg-white p-6">
    {!isLoading && product ? (
      <div className="flex flex-col md:flex-row items-start md:items-center">
        {product.image && (
          <div className="w-full md:w-32 h-32 relative mb-4 md:mb-0">
            <Image
              src={product.image}
              alt={product.productName}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <div className="md:ml-4">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            {product.productName}
          </h2>
          <p className="text-lg">
            <strong>Price:</strong> ${product.price}
          </p>
          <p className="text-lg mt-2">
            <strong>Department:</strong> {product.department}
          </p>
          <p className="text-lg mt-2">
            <strong>Description:</strong> {product.productDescription}
          </p>
        </div>
      </div>
    ) : (
      <div className='min-h-[200px] bg-white flex flex-col justify-center items-center'>
        <p className='text-4xl text-orange-500 animate-pulse'>Loading...</p>
      </div>
    )}
  </div>
);