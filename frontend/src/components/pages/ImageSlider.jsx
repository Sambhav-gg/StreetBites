import React, { useState } from 'react';

const ImageSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-60 mb-4 overflow-hidden rounded-lg bg-black">
      {/* Slider image */}
      <img
        src={images[current]}
        alt={`Image ${current}`}
        className="w-full h-full object-contain cursor-pointer"
        onClick={() => setModalOpen(true)} // ✅ Tap to open modal
      />

      {/* Prev/Next buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
          >
            ›
          </button>
        </>
      )}

      {/* Fullscreen modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={images[current]}
            alt="Full preview"
            className="max-w-[90%] max-h-[90%] rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
