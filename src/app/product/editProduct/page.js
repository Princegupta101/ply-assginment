"use client";

import axios from 'axios';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useRouter, useSearchParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { storage } from '@/firebaseConfig';
import ExampleModal from '@/Components/uploadImage';
import NavBar from '@/Components/NavBar';

export default function EditProductPage() {
    const [product, setProduct] = useState({
        productName: '',
        image: '',
        price: '',
        productDescription: '',
        department: ''
    });

    const [modal, setModal] = useState(false);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
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
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
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
            setModal(false); // Close the modal after cropping
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (role === "admin") {
                await axios.put(`/api/products/updateProduct?id=${id}`, product);
            } else if (role === "team_member") {
                await axios.post(`/api/products/updateProduct?id=${id}&user_id=${userId}`, product);
            } else {
                throw new Error('Unauthorized');
            }
            enqueueSnackbar('Updated successfully', { variant: "success" });
            router.push(`/product?id=${id}`);
        } catch (err) {
            enqueueSnackbar('Error updating product', { variant: "error" });
            console.error("Error updating product:", err);
        }
    };

    const onClose = () => setModal(false);

    const buttonText = role === "admin" ? "Save changes as admin" : "Save changes for review";

    return (
        <>
            <NavBar />
            <div className="container mx-auto my-8 p-4 space-y-4 border border-gray-200 rounded-lg shadow-md">
                <div className='flex items-center justify-between'>
                    <h1 className="text-3xl uppercase font-semibold text-orange-400 mb-6">Edit Product</h1>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-orange-400 text-white uppercase"
                    >
                        Cancel
                    </button>
                </div>

                {product ? (
                    !modal ? (
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
                                <label htmlFor="image" className="block text-lg font-medium">Image URL</label>
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
                                    type="button"
                                    onClick={() => setModal(true)}
                                    className='px-3 py-1 bg-orange-400 uppercase text-white'
                                >
                                    Crop
                                </button>
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
                            <div className='space-x-2'>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-400 text-white uppercase"
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className='w-[500px]'>
                            <ExampleModal onClose={onClose} imageUrl={product.image} onCropComplete={onCropComplete} />
                        </div>
                    )
                ) : (
                    <div className="h-[680px] xl:h-screen bg-white flex flex-col justify-center items-center">
                        <p className="text-6xl text-orange-400 animate-bounce">....</p>
                    </div>
                )}
            </div>
        </>
    );
}
