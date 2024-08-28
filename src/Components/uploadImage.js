import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

const ExampleModal = ({ onClose, imageUrl, onCropComplete }) => {
    const [croppedArea, setCroppedArea] = useState(null);

    const handleCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const handleUpload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
            const { width, height } = croppedArea;
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(
                image,
                croppedArea.x,
                croppedArea.y,
                width,
                height,
                0,
                0,
                width,
                height
            );

            canvas.toBlob(async (blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    onCropComplete(base64data); // Pass the cropped image as a base64 string
                    onClose();
                };
            }, 'image/jpeg');
        };
    };

    return (
        <div className="modal">
            <Cropper
                image={imageUrl}
                cropShape="rect"
                aspect={4 / 3}
                onCropComplete={handleCropComplete}
            />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ExampleModal;
