import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsappButton = () => {
  // Use international format without "+" and leading zero (92 for Pakistan)
  const phoneNumber = '923464080360';
  const message = encodeURIComponent('Hello! I’d like to get in touch with you.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="group fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
      <span className="absolute bottom-16 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-sm px-3 py-1 rounded-md whitespace-nowrap shadow-md">
        Chat with us on WhatsApp
      </span>
    </div>
  );
};

export default WhatsappButton;
