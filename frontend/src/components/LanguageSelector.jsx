// src/components/LanguageSelector.jsx
import React from "react";

const LanguageSelector = () => {
  const changeLanguage = (language) => {
    const googleFrame = document.querySelector('iframe.goog-te-banner-frame');
    if (googleFrame) {
      googleFrame.style.display = 'none';
    }

    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = language;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-white">Language:</span>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
      >
        <option value="">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
