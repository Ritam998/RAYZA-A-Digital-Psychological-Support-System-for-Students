import React from "react";
import { motion } from "framer-motion";

export default function ActionCard({ icon: Icon, title, description, buttonText, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-orange-200/50 flex flex-col text-center items-center"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
      <button
        onClick={onClick}
        className="w-full mt-auto px-4 py-2 rounded-full bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition"
      >
        {buttonText}
      </button>
    </motion.div>
  );
}