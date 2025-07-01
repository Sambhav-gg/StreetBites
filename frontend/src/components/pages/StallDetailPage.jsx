import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageSlider from '../pages/ImageSlider';
import ReviewsPopover from './ReviewsPopover';
import StallMenuDrawer from './StallMenuDrawer';

const StallDetailPage = () => {
  const { id } = useParams();
  const [stall, setStall] = useState(null);

  // ✅ Moved outside useEffect
  const fetchStall = async () => {
    try {
      const res = await axios.get(`/api/stalls/${id}`);
      setStall(res.data);
    } catch (err) {
      console.error("Failed to load stall details", err.message);
    }
  };

  useEffect(() => {
    fetchStall();
  }, [id]);

  if (!stall) return <p>Loading...</p>;

  const allImages = [
    stall.mainImage,                 // ✅ Correct field for main image
    ...(stall.otherImages || [])     // ✅ Correct field for other images
  ].filter(Boolean);  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      {allImages.length > 0 ? (
        <ImageSlider images={allImages} />
      ) : (
        <img
          src="/placeholder.jpg"
          alt="No image"
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
      )}

      <h2 className="text-3xl font-bold mb-2">{stall.stallName}</h2>
      <p className="text-gray-600 mb-2">{stall.description}</p>
      <p className="text-gray-700 font-semibold">📍 Address: {stall.address}</p>
      <p className="text-gray-700">⏰ {stall.openingTime} - {stall.closingTime}</p>
      <p className="text-gray-700 mt-2">📞 {stall.phoneNumber}</p>
      <p className="mt-2">Category: <strong>{stall.category}</strong></p>
      <p className="mt-2">Rating: ⭐ {stall.averageRating ?? "N/A"} ({stall.numReviews} reviews)</p>

      <div className="flex gap-4 mt-4">
        <StallMenuDrawer stall={stall} />
        <ReviewsPopover
          stallId={stall._id}
          reviews={stall.reviews || []}
          onReviewAdded={fetchStall} // ✅ Fixed: Pass refetch function
        />
      </div>

      {/* Additional Images */}
      {stall.images?.others?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stall.images.others.map((url, idx) => (
              <img key={idx} src={url} alt={`Stall image ${idx}`} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StallDetailPage;
