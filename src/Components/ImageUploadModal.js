import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const ImageUploadModal = ({ onClose, imageUrl, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = async () => {
        if (!croppedAreaPixels) {
            console.error("Cropped area is not defined");
            return;
        }
    
        setIsProcessing(true);
    
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = new Image();
    
            image.crossOrigin = "Anonymous"; // Handle CORS
            image.src = imageUrl;
    
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
            });
    
            const { width, height, x, y } = croppedAreaPixels;
            canvas.width = width;
            canvas.height = height;
    
            ctx.drawImage(
                image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
            );
    
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
            
            if (!blob) {
                // Fallback to Data URL if Blob is null
                const dataUrl = canvas.toDataURL('image/jpeg');
                onCropComplete(dataUrl);
                return;
            }
    
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64Image = reader.result;
                onCropComplete(base64Image);
            };
        } catch (error) {
            console.error("Error processing image:", error);
        } finally {
            setIsProcessing(false);
        }
    };
    
    

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg'>
                <div className='relative h-64 mb-4'>
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteCallback}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="zoom" className="block text-sm font-medium text-gray-700">
                        Zoom
                    </label>
                    <input
                        type="range"
                        id="zoom"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div className='flex justify-between'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        className={`px-4 py-2 text-white rounded-md ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-400 transition duration-300'}`}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;