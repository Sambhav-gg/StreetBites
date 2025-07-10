import React from 'react'
import Navbar from "../shared/Navbar"
import Footer from '../shared/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Vendor Images with Enhanced Effects */}
        <div 
          className="absolute top-20 right-10 w-72 h-48 bg-cover bg-center rounded-3xl opacity-15 transform rotate-12 hover:rotate-6 transition-transform duration-700 shadow-2xl border-4 border-white/30"
          style={{
            backgroundImage: "url('https://img.freepik.com/premium-photo/street-food-vendor-india-prepares-dinner-hungry-customers-busy-market-capture-essence-street-food-vendors-preparing-chaat-bustling-indian-streets_538213-94117.jpg')",
            filter: "sepia(20%) saturate(120%) hue-rotate(10deg)"
          }}
        ></div>
        
        <div 
          className="absolute bottom-32 left-10 w-64 h-44 bg-cover bg-center rounded-3xl opacity-12 transform -rotate-6 hover:rotate-0 transition-transform duration-700 shadow-2xl border-4 border-white/30"
          style={{
            backgroundImage: "url('https://img.freepik.com/free-photo/enjoying-street-food-fest_23-2151543796.jpg')",
            filter: "sepia(15%) saturate(110%) hue-rotate(5deg)"
          }}
        ></div>
        
        <div 
          className="absolute top-1/2 left-1/4 w-56 h-40 bg-cover bg-center rounded-3xl opacity-10 transform rotate-3 hover:-rotate-3 transition-transform duration-700 shadow-2xl border-4 border-white/30"
          style={{
            backgroundImage: "url('https://img.freepik.com/free-photo/portrait-indian-man-bazaar_23-2150913316.jpg')",
            filter: "sepia(25%) saturate(130%) hue-rotate(15deg)"
          }}
        ></div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-52 h-52 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-44 h-44 bg-gradient-to-br from-yellow-400/20 to-amber-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Food Emoji Scattered Elements */}
        <div className="absolute top-32 left-20 text-4xl opacity-20 animate-bounce">🌮</div>
        <div className="absolute top-1/3 right-32 text-3xl opacity-15 animate-bounce delay-200">🍛</div>
        <div className="absolute bottom-40 right-40 text-5xl opacity-10 animate-bounce delay-700">🥘</div>
        <div className="absolute top-2/3 left-16 text-3xl opacity-20 animate-bounce delay-1000">🍜</div>
      </div>

      <Navbar/>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center space-y-10 backdrop-blur-md bg-gradient-to-br from-white/60 to-orange-50/40 rounded-3xl p-12 border-2 border-white/40 shadow-2xl">
          {/* Main Heading */}
          <div className="space-y-6">
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-6xl animate-bounce">🍛</span>
              <span className="text-6xl animate-bounce delay-100">🌮</span>
              <span className="text-6xl animate-bounce delay-200">🥘</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 drop-shadow-2xl leading-tight">
              Welcome to <br/>
              <span className="text-orange-700">Street</span>
              <span className="text-amber-500">Bites</span>!
            </h1>
            <p className="text-2xl md:text-3xl text-gray-800 max-w-4xl mx-auto leading-relaxed font-semibold">
              🌟 Discover authentic street food vendors near you and connect with the 
              <span className="text-orange-600 font-bold"> flavors that make your neighborhood special</span> 🌟
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <button className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 border-2 border-orange-400">
              <span className="flex items-center gap-3">
                🍜 Find Street Food Near Me
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            <button className="group bg-gradient-to-r from-yellow-400 to-amber-300 text-orange-900 px-10 py-5 rounded-2xl font-bold text-xl hover:from-yellow-300 hover:to-amber-200 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 border-2 border-yellow-500">
              <span className="flex items-center gap-3">
                🏪 List Your Stall FREE
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-orange-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="font-semibold">100% Free for Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="font-semibold">50+ Cities</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">❤️</span>
              <span className="font-semibold">25K+ Happy Foodies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group bg-gradient-to-br from-white/70 to-orange-50/50 backdrop-blur-lg p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-white/50 hover:border-orange-300/50 transform hover:-translate-y-4 hover:scale-105">
            <div className="text-6xl mb-6 group-hover:animate-bounce">🌍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Discover Locally</h3>
            <p className="text-gray-700 font-medium text-lg leading-relaxed">
              Find amazing street food vendors in your neighborhood and explore new flavors from around the world. Every bite tells a story! 🗺️
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-gradient-to-br from-white/70 to-yellow-50/50 backdrop-blur-lg p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-white/50 hover:border-yellow-300/50 transform hover:-translate-y-4 hover:scale-105">
            <div className="text-6xl mb-6 group-hover:animate-bounce">🆓</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Free for Vendors</h3>
            <p className="text-gray-700 font-medium text-lg leading-relaxed">
              Local vendors can list their stalls completely free of charge. No hidden fees, no commissions. Just pure support for local business! 💝
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-gradient-to-br from-white/70 to-amber-50/50 backdrop-blur-lg p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-white/50 hover:border-amber-300/50 transform hover:-translate-y-4 hover:scale-105">
            <div className="text-6xl mb-6 group-hover:animate-bounce">🤝</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Connect Communities</h3>
            <p className="text-gray-700 font-medium text-lg leading-relaxed">
              Bridge the gap between food lovers and local vendors, strengthening community bonds through the universal language of food! 🌈
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🍛</div>
          <div className="absolute top-20 right-20 text-6xl">🌮</div>
          <div className="absolute bottom-10 left-1/4 text-7xl">🥘</div>
          <div className="absolute bottom-20 right-1/3 text-5xl">🍜</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">📊 StreetBites Impact</h2>
            <p className="text-2xl text-orange-100">Making a difference, one bite at a time!</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-6xl font-black mb-4 text-yellow-200">1000+</div>
              <div className="text-xl text-orange-100 font-semibold">🏪 Vendors Listed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-6xl font-black mb-4 text-yellow-200">50+</div>
              <div className="text-xl text-orange-100 font-semibold">🌆 Cities Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-6xl font-black mb-4 text-yellow-200">25K+</div>
              <div className="text-xl text-orange-100 font-semibold">😋 Happy Customers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-6xl font-black mb-4 text-yellow-200">100%</div>
              <div className="text-xl text-orange-100 font-semibold">🆓 Free to Use</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16 backdrop-blur-md bg-gradient-to-br from-white/50 to-amber-50/30 rounded-3xl p-10 border-2 border-white/40">
          <h2 className="text-5xl font-black text-gray-900 mb-6">🚀 How It Works</h2>
          <p className="text-2xl text-gray-700 font-semibold">Simple steps to get started on your food journey!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* For Food Lovers */}
          <div className="space-y-8 bg-gradient-to-br from-white/60 to-orange-50/40 backdrop-blur-lg rounded-3xl p-10 border-2 border-white/50 shadow-2xl">
            <h3 className="text-3xl font-black text-orange-600 mb-8 flex items-center gap-4">
              🍽️ For Food Lovers
              <span className="text-lg bg-orange-100 text-orange-700 px-3 py-1 rounded-full">FREE</span>
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-6 group">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">🔍 Browse & Discover</h4>
                  <p className="text-gray-700 text-lg">Search for street food vendors in your area and discover hidden gems!</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">📱 View Details</h4>
                  <p className="text-gray-700 text-lg">Check menus, ratings, photos, and location details before you go!</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">😋 Visit & Enjoy</h4>
                  <p className="text-gray-700 text-lg">Head to your chosen stall and enjoy authentic, delicious street food!</p>
                </div>
              </div>
            </div>
          </div>

          {/* For Vendors */}
          <div className="space-y-8 bg-gradient-to-br from-white/60 to-yellow-50/40 backdrop-blur-lg rounded-3xl p-10 border-2 border-white/50 shadow-2xl">
            <h3 className="text-3xl font-black text-amber-600 mb-8 flex items-center gap-4">
              🏪 For Vendors
              <span className="text-lg bg-green-100 text-green-700 px-3 py-1 rounded-full">100% FREE</span>
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-6 group">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">📝 Sign Up Free</h4>
                  <p className="text-gray-700 text-lg">Create your vendor account at absolutely no cost - forever free!</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">📸 List Your Stall</h4>
                  <p className="text-gray-700 text-lg">Add mouth-watering photos, menu items, and location details!</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">🚀 Get Discovered</h4>
                  <p className="text-gray-700 text-lg">Reach thousands of hungry customers and grow your business!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <Footer/>
    </div>
  )
}

export default LandingPage