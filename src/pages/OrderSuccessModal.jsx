import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

export default function OrderSuccessModal({ onClose }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Show toast success message when modal mounts
    // toast.success('Order completed successfully! Thank you for your purchase.');

    // Trigger animation start on mount
    setAnimate(true);

    // Auto close modal after animation (4 seconds)
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          width: '320px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <h2>Order Completed!</h2>
        <p>Thank you for your purchase.</p>

        <div
          style={{
            position: 'relative',
            height: '60px',
            overflow: 'hidden',
            marginTop: '1.5rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: animate ? 'calc(100% + 50px)' : '-50px',
              width: '50px',
              height: '50px',
              backgroundImage:
                "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2PwMQg4ljOlCP3MZWD4seqMu8n7d498-saK32qhJGbIBrxj2aKQX32lmE0utGS2m9ods&usqp=CAU')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              transition: 'left 3s ease-in-out',
              animation: animate ? 'moveVan 10s forwards' : 'none',
            }}
          ></div>
        </div>
      </div>

      <style>
        {`
          @keyframes moveVan {
            0% { left: -50px; }
            100% { left: calc(100% + 50px); }
          }
        `}
      </style>
    </div>
  );
}
