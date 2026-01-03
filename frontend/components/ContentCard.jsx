import React from "react";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";

export default function ContentCard({ item }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      <div className="relative">
        <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <button className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play size={28} className="ml-1" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800">{item.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-2">
            <item.icon size={16} />
            <span>{item.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{item.duration} min</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}