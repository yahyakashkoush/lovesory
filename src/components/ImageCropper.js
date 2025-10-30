'use client';

import { useState, useRef } from 'react';
import ReactEasyCrop from 'react-easy-crop';

export default function ImageCropper({ onCropComplete, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(3 / 4); // Portrait by default
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropAreaChange = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          onCropComplete(blob);
          setImageSrc(null);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
        }, 'image/jpeg', 0.95);
      };
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  if (!imageSrc) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-rose-700 mb-6">Select Image to Crop</h3>

          <div className="border-2 border-dashed border-rose-300 rounded-lg p-8 text-center hover:border-rose-500 transition-smooth cursor-pointer mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <label
              htmlFor="image-input"
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-4xl mb-2">📸</div>
              <p className="text-rose-600 font-semibold">Click to select image</p>
              <p className="text-sm text-rose-500">PNG, JPG, GIF</p>
            </label>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-smooth"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-rose-700 mb-6">Crop Image</h3>

        {/* Aspect Ratio Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-rose-700 mb-3">
            Aspect Ratio
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setAspectRatio(3 / 4)}
              className={`px-4 py-2 rounded-lg font-semibold transition-smooth ${
                aspectRatio === 3 / 4
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Portrait (3:4)
            </button>
            <button
              onClick={() => setAspectRatio(4 / 3)}
              className={`px-4 py-2 rounded-lg font-semibold transition-smooth ${
                aspectRatio === 4 / 3
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Landscape (4:3)
            </button>
            <button
              onClick={() => setAspectRatio(1 / 1)}
              className={`px-4 py-2 rounded-lg font-semibold transition-smooth ${
                aspectRatio === 1 / 1
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Square (1:1)
            </button>
            <button
              onClick={() => setAspectRatio(16 / 9)}
              className={`px-4 py-2 rounded-lg font-semibold transition-smooth ${
                aspectRatio === 16 / 9
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Wide (16:9)
            </button>
          </div>
        </div>

        {/* Crop Area */}
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden mb-6">
          <ReactEasyCrop
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropAreaChange={onCropAreaChange}
            onZoomChange={setZoom}
          />
        </div>

        {/* Zoom Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-rose-700 mb-2">
            Zoom: {(zoom * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCropImage}
            className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-smooth"
          >
            Crop & Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-smooth"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
