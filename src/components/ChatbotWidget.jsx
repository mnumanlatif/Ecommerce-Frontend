/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  const toggleChat = () => setOpen((prev) => !prev);

  // Close chat when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { from: 'user', text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5006/api/chatbot/ask', {
        message,
      });

      const reply = res.data?.reply || '🤖 No response from AI.';
      setChat((prev) => [...prev, { from: 'bot', text: reply }]);
    } catch (error) {
      toast.error('Chatbot failed to respond');
      setChat((prev) => [
        ...prev,
        { from: 'bot', text: '❌ Sorry, I couldn\'t process that.' },
      ]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        onClick={toggleChat}
      >
        {open ? <FaTimes size={20} /> : <FaRobot size={24} />}
      </div>

      {/* Chat Box */}
      {open && (
        <div
          ref={chatRef}
          className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white border border-gray-300 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in"
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 font-semibold text-lg">
            AI Chat Assistant
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-2 text-sm bg-gray-50">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.from === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[75%] ${
                    msg.from === 'user'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center p-2 border-t border-gray-300 bg-white">
            <input
              type="text"
              value={message}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="text-indigo-600 hover:text-indigo-800 px-3 transition"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
