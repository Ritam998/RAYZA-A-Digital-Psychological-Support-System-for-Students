import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- YOUR CORRECTED COMPONENT ---
const CYCLE_STEPS = [
  { label: "Inhale", duration: 4000 },
  { label: "Hold", duration: 4000 },
  { label: "Exhale", duration: 4000 },
];

export default function BreathworkOverlay({ onClose }) {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Stop at 0
  useEffect(() => {
    if (timeLeft <= 0) setRunning(false);
  }, [timeLeft]);

  // Cycle progression
  useEffect(() => {
    if (!running) return;
    const step = CYCLE_STEPS[stepIndex];
    timeoutRef.current = setTimeout(() => {
      setStepIndex((prev) => (prev + 1) % CYCLE_STEPS.length);
    }, step.duration);
    return () => clearTimeout(timeoutRef.current);
  }, [running, stepIndex]);

  // Countdown
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setStepIndex(0);
    setTimeLeft(120);
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  };

  const currentStep = CYCLE_STEPS[stepIndex];

  const getScale = () => {
    switch (currentStep.label) {
      case "Inhale":
      case "Hold":
        return 1.5;
      case "Exhale":
        return 1;
      default:
        return 1;
    }
  };

  const transitionSettings = {
    duration: currentStep.duration / 1000,
    ease: "easeInOut",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-white"
    >
      <div className="relative w-72 h-72 flex flex-col items-center justify-center mb-8">
        
        {/* FIX: Glow animation is now persistent, controlled by the animate prop */}
        <motion.div
          className="absolute w-full h-full rounded-full bg-orange-400 blur-3xl"
          animate={{
            scale: running ? getScale() : 1,
            opacity: running ? [0.3, 0.8, 0.3] : 0,
          }}
          transition={{
            ...transitionSettings,
            opacity: { ...transitionSettings, repeat: Infinity }, // Repeat only applies to opacity
          }}
        />

        {/* FIX: The changing 'key' prop has been removed for smooth animation */}
        <motion.div
          animate={{ scale: running ? getScale() : 1 }}
          transition={transitionSettings}
          className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 shadow-2xl flex items-center justify-center"
        >
          <h2 className="z-20 text-white text-3xl font-bold tracking-wider">
            {running ? currentStep.label : "Ready?"}
          </h2>
        </motion.div>
      </div>

      <p className="text-white/80 mb-6 text-lg">
        {running ? `Time Left: ${timeLeft}s` : "Press Start to begin"}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setRunning(!running)}
          className="px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-lg"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-8 py-3 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors shadow-lg"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="px-8 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}