// CameraButton.jsx
import React, { useRef } from "react";
import { Camera } from "lucide-react";

const CameraButton = ({ onImageSelected }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      onImageSelected(e.target.files[0]);
      e.target.value = ""; // reset input for same file re-upload
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        aria-label="Upload image for product search"
        className="
          fixed bottom-42 right-6
          w-16 h-16
          bg-indigo-600 hover:bg-indigo-700
          text-white rounded-full
          shadow-xl
          flex items-center justify-center
          focus:outline-none focus:ring-4 focus:ring-indigo-400
          transition-all
          z-50
        "
      >
        <Camera size={28} strokeWidth={2.5} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default CameraButton;
