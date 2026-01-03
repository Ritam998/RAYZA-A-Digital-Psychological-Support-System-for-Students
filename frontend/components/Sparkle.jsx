// src/components/Sparkle.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Sparkle({ x, y, size, delay }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white opacity-70"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 0],
        y: y - 40,
        scale: [0.5, 1, 0.8],
      }}
      exit={{
        opacity: 0,
        scale: 2,
        x: Math.random() > 0.5 ? 200 : -200,
        y: -200,
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}