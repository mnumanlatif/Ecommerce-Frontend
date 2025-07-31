import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsappButton = () => {
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=03054572698&text&type=phone_number&app_absent=0';

  return (
    <div className="group fixed bottom-6 right-6">
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <FaWhatsapp size={28} />
  </a>
  <span className="absolute bottom-16 right-0 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-1 rounded-md whitespace-nowrap">
    Chat with us on WhatsApp
  </span>
</div>

  );
};

export default WhatsappButton;
