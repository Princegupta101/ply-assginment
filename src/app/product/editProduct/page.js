"use client"
import axios from 'axios';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { storage } from '@/app/dbConfig/firebaseConfig';
import ImageUploadModal from '@/Components/ImageUploadModal';
import NavBar from '@/Components/NavBar';

export default function EditProductPage() {
    const [product, setProduct] = useState({
        productName: '',
        image: '',
        price: '',
        productDescription: '',
        department: ''
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    useEffect(() => {
        setRole(localStorage.getItem('role'));
        setUserId(localStorage.getItem('user_id'));
    }, []);

    useEffect(() => {
        if (id) {
            getProductData();
        }
    }, [id]);

    const getProductData = async () => {
        try {
            const res = await axios.get(`/api/products/getProduct?id=${id}`);
            if (res && res.data) {
                setProduct(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch product data:", err);
            enqueueSnackbar('Failed to fetch product data', { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setModalOpen(true);
        }
    };

    const onCropComplete = async (croppedImageUrl) => {
        try {
            const storageRef = ref(storage, `images/${uuidv4()}`);
            const snapshot = await uploadString(storageRef, croppedImageUrl, 'data_url');
            const downloadURL = await getDownloadURL(snapshot.ref);
            setProduct((prev) => ({
                ...prev,
                image: downloadURL
            }));
            enqueueSnackbar('Image uploaded successfully', { variant: "success" });
        } catch (err) {
            enqueueSnackbar('Failed to upload image', { variant: "error" });
            console.error("Error uploading image:", err);
        } finally {
            setModalOpen(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = role === "admin" 
                ? `/api/products/updateProduct?id=${id}`
                : `/api/products/updateProduct?id=${id}&user_id=${userId}`;
            
            const method = role === "admin" ? "put" : "post";
            
            await axios[method](endpoint, product);
            enqueueSnackbar('Updated successfully', { variant: "success" });
            router.push(`/product?id=${id}`);
        } catch (err) {
            enqueueSnackbar('Error updating product', { variant: "error" });
            console.error("Error updating product:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonText = role === "admin" ? "Save changes as admin" : "Save changes for review";

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <p className="text-4xl text-orange-500 animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow-lg max-w-4xl">
                <div className='flex items-center justify-between mb-6'>
                    <h1 className="text-3xl font-semibold text-gray-800">Edit Product</h1>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-400 transition duration-300"
                    >
                        Cancel
                    </button>
                </div>

                {!modalOpen ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="productName" className="block text-lg font-medium">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                value={product.productName}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="image" className="block text-lg font-medium">Image</label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={product.image}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Paste image URL or upload file"
                            />
                            <input
                                type="file"
                                id="imageFile"
                                onChange={handleFileChange}
                                className="mt-2"
                                accept="image/*"
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-lg font-medium">Price</label>
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
                            <label htmlFor="productDescription" className="block text-lg font-medium">Description</label>
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
                            <label htmlFor="department" className="block text-lg font-medium">Category</label>
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
                        <div className='flex justify-end'>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-400 transition duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : buttonText}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='w-full max-w-lg mx-auto'>
                        <ImageUploadModal 
                            onClose={() => setModalOpen(false)} 
                            imageUrl={imageFile ? URL.createObjectURL(imageFile) : product.image} 
                            onCropComplete={onCropComplete} 
                        />
                    </div>
                )}
            </div>
        </>
    );
}