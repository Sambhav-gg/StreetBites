import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin } from "react-icons/fi";
import Select from "react-select";

const SearchBar = ({ searchTerm, setSearchTerm, selectedCity, setSelectedCity, selectedFilter }) => {
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

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(251, 146, 60, 0.3)',
      borderRadius: '12px',
      padding: '8px 4px',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(251, 146, 60, 0.1)' : 'none',
      borderColor: state.isFocused ? 'rgb(251, 146, 60)' : 'rgba(251, 146, 60, 0.3)',
      '&:hover': {
        borderColor: 'rgb(251, 146, 60)',
      },
      minHeight: '52px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'rgb(251, 146, 60)' 
        : state.isFocused 
        ? 'rgba(251, 146, 60, 0.1)' 
        : 'white',
      color: state.isSelected ? 'white' : 'rgb(55, 65, 81)',
      fontWeight: state.isSelected ? '600' : '500',
      '&:hover': {
        backgroundColor: state.isSelected ? 'rgb(251, 146, 60)' : 'rgba(251, 146, 60, 0.1)',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgb(107, 114, 128)',
      fontWeight: '500',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'rgb(55, 65, 81)',
      fontWeight: '600',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(251, 146, 60, 0.2)',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-white/80 to-orange-50/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-white/50 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
        {/* Search Input */}
        <div className="relative w-full lg:flex-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-orange-500 z-10">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search for delicious dishes or stalls..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-orange-200 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white/70 backdrop-blur-sm transition-all duration-200 text-gray-800 font-medium placeholder-gray-500 text-lg"
            />
            {/* Search suggestions indicator */}
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* City Dropdown */}
        <div className="w-full lg:w-80">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {loading ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 border-orange-200 flex items-center justify-center">
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  <span className="font-medium">Loading cities...</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-orange-500 z-10 pointer-events-none">
                  <FiMapPin size={18} />
                </div>
                <Select
                  options={cities}
                  value={selectedCity}
                  onChange={(selectedOption) => setSelectedCity(selectedOption)}
                  placeholder="🏙️ Select city"
                  isClearable
                  isDisabled={selectedFilter === "nearby"}
                  styles={customStyles}
                  className="city-select"
                  classNamePrefix="react-select"
                />
                {selectedFilter === "nearby" && (
                  <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm rounded-xl flex items-center justify-center pointer-events-none">
                    <span className="text-sm font-medium text-gray-600 bg-white/80 px-3 py-1 rounded-lg">
                      📍 Using your location
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Search Button */}
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(251, 146, 60, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <FiSearch size={18} />
          Search
        </motion.button>
      </div>

      {/* Search Hints */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4 flex flex-wrap gap-2"
      >
        <span className="text-sm font-medium text-gray-600 mb-2 block w-full">💡 Popular searches:</span>
        {['Chaat', 'Dosa', 'Vada Pav', 'Biryani', 'Samosa', 'Pani Puri'].map((hint, index) => (
          <motion.button
            key={hint}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchTerm(hint)}
            className="bg-white/60 hover:bg-orange-100 text-gray-700 hover:text-orange-700 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border border-orange-200 hover:border-orange-300"
          >
            {hint}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SearchBar;