/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  const toggleChat = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = { from: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5006/api/chatbot/ask", {
        message,
      });
      const reply = res.data?.reply || "🤖 No response from AI.";
      setChat((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (error) {
      toast.error("Chatbot failed to respond");
      setChat((prev) => [
        ...prev,
        { from: "bot", text: "❌ Sorry, I couldn't process that." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                   hover:scale-110 transition-transform duration-300 text-white p-4 rounded-full shadow-lg shadow-purple-300"
        onClick={toggleChat}
      >
        {open ? <FaTimes size={22} /> : <FaRobot size={26} />}
      </div>

      {/* Chat Box */}
      {open && (
        <div
          ref={chatRef}
          className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white/70 backdrop-blur-xl border border-gray-200 
                     rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center gap-3 px-4 py-3">
            <div className="bg-white/30 p-2 rounded-full">
              <FaRobot size={20} />
            </div>
            <span className="font-semibold text-lg">AI Assistant</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-3 text-sm bg-white/40">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm transition-all duration-300 ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-indigo-200 to-purple-200 text-gray-800"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center p-2 border-t border-gray-200 bg-white/70 backdrop-blur-md">
            <input
              type="text"
              value={message}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-300 bg-white/80"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-lg hover:scale-105 transition-transform"
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
