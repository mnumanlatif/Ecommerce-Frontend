import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const WhatsappButton = () => {
  const { t } = useTranslation();

  const phoneNumber = '923464080360';
  const message = "Hello! I’d like to get in touch with you.";

  const openWhatsapp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <button
        onClick={openWhatsapp}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400"
        title={t('whatsappChatTitle')}
        aria-label={t('whatsappChatAriaLabel')}
      >
        <FaWhatsapp size={28} />
      </button>
    </div>
  );
};

export default WhatsappButton;
