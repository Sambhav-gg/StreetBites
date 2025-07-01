import React from 'react'
import Navbar from "../shared/Navbar"
const LandingPage = () => {
  return (
    <div>
        <Navbar/>
        <div className="p-4">
            <h1 className="text-4xl font-bold text-center mt-10">Welcome to StreetBites!</h1>
            <p className="text-center text-gray-600 mt-4">Explore stalls near you and enjoy your favorite street food.</p>
        </div>
    </div>
  )
}

export default LandingPage