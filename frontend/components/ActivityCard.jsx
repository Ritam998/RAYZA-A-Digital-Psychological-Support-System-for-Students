import React from "react";
import { motion } from "framer-motion";

export default function ActivityCard({ icon: Icon, title, desc, action }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl backdrop-blur text-center space-y-3 border border-orange-100"
    >
      <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
        <Icon size={28} />
      </div>
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
      <button className="mt-2 px-5 py-2 rounded-full bg-orange-400 text-white text-sm font-medium hover:bg-orange-500 transition">
        {action}
      </button>
    </motion.div>
  );
}