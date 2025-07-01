import React from 'react';
import { FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const Sidebar = ({ selected, onSelect }) => {
  const options = [
    { label: 'All Stalls', value: 'all', icon: <FaMapMarkerAlt /> }, 
    { label: 'Nearby', value: 'nearby', icon: <FaMapMarkerAlt /> },
    { label: 'Top Rated', value: 'top-rated', icon: <FaStar /> },
    { label: 'Liked By You', value: 'liked', icon: <FaHeart /> },
  ];

  return (
    <div className="w-52 bg-white shadow-lg p-4 border-r">
      {options.map(({ label, value, icon }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg text-left transition-all 
            ${selected === value ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100'}`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
