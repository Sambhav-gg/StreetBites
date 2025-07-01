import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Select from "react-select";

const SearchBar = ({ searchTerm, setSearchTerm, selectedCity, setSelectedCity, selectedFilter }) => { // ✅ Receive filter
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'India' }),
        });
        const data = await res.json();
        const formattedCities = data.data.map((city) => ({
          value: city,
          label: city,
        }));
        setCities(formattedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
      {/* 🔍 Dish Search Input */}
      <div className="relative w-full max-w-md">
        <FiSearch className="absolute top-3.5 left-4 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search dish or stall..."
          className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* 🏙️ City Dropdown */}
      <div className="w-full max-w-xs">
        {loading ? (
          <p className="text-sm text-gray-500">Loading cities...</p>
        ) : (
          <Select
            options={cities}
            value={selectedCity}
            onChange={(selectedOption) => setSelectedCity(selectedOption)}
            placeholder="Select city"
            isClearable
            isDisabled={selectedFilter === "nearby"} // ✅ Disable when nearby is selected
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
