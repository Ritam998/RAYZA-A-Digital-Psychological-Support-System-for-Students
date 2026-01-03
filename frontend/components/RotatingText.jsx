import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const messages = ["Take a deep breath", "Find your focus", "Relax and recharge"];

export default function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full flex justify-center bg-gradient-to-r from-orange-100 via-pink-100 to-pink-200 py-4 overflow-hidden">
      <div className="relative h-12 max-w-4xl w-full flex items-center justify-center">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute text-2xl md:text-3xl font-extrabold font-knewave text-gray-800 tracking-wide"
        >
          {messages[index]}
        </motion.div>
      </div>
    </div>
  );
}