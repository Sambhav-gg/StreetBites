import React, { useEffect, useState } from "react";
import axios from "axios";
import StallCard from "../shared/StallCard"; // Adjust path as needed
import { PERSON_API_END_POINT } from "../utils/constants";
const LikedByYou = () => {
  const [likedStalls, setLikedStalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedStalls = async () => {
    try {
      const res = await axios.get(`${ PERSON_API_END_POINT }/liked-stalls`);
      setLikedStalls(res.data || []);
    } catch (error) {
      console.error("Failed to fetch liked stalls:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedStalls();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Liked By You</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : likedStalls.length === 0 ? (
        <p className="text-gray-500">You haven’t liked any stalls yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {likedStalls.map((stall) => (
            <StallCard key={stall._id} stall={{ ...stall, liked: true }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedByYou;
