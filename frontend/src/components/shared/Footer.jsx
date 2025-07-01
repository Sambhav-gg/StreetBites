import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

        <p className="text-center md:text-left text-base font-medium">
          © {new Date().getFullYear()} <span className="font-semibold text-red-500">StreetBites</span>. All rights reserved.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Sambhav Garg Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/yourprofile1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition text-lg"
            >
              <FaLinkedin className="bg-gray-300 p-1 rounded-full text-3xl" />
              <span>Sambhav Garg</span>
            </a>
            <a
              href="https://www.instagram.com/yourprofile1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition text-lg"
            >
              <FaInstagram className="bg-gray-300 p-1 rounded-full text-3xl" />
              <span>Sambhav Garg</span>
            </a>
          </div>

          {/* Swyam Yadav Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/yourprofile2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition text-lg"
            >
              <FaLinkedin className="bg-gray-300 p-1 rounded-full text-3xl" />
              <span>Swyam Yadav</span>
            </a>
            <a
              href="https://www.instagram.com/yourprofile2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition text-lg"
            >
              <FaInstagram className="bg-gray-300 p-1 rounded-full text-3xl" />
              <span>Swyam Yadav</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
