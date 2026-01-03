import React from "react";
import { motion } from "framer-motion";
import RotatingText from "../components/RotatingText";
import GoogleLogin from "../components/GoogleLogin";
import Chatbot from "../components/Chatbot";
import ActivityCard from "../components/ActivityCard";
import { bgSlides } from "../data/bgSlides";
import { Play, Dumbbell, Smile } from "lucide-react";

// Props: user, setUser, setCurrentPage, slide, currentSlideIndex
export default function HomeContent({ user, setUser, setCurrentPage, slide }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased font-sans">
      {/* Rotating text banner */}
      <RotatingText />

      {/* Header/navbar */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-lg shadow-md border-b border-white/30 transition-all duration-500">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className="rounded-full bg-orange-400 w-10 h-10 flex items-center justify-center shadow-md font-bold text-white text-lg cursor-pointer"
              onClick={() => setCurrentPage("home")}
            >
              R
            </div>
            <nav className="flex gap-4 text-sm font-medium">
  {[
    { label: "For You", page: "for-you" },
    { label: "Crew", page: "crew" },
    { label: "Trends", page: "trends" },
    { label: "About Us", page: "about-us" },
  ].map((item) => (
    <button
      key={item.page}
      onClick={() => setCurrentPage(item.page)}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-100 to-orange-200 shadow-md text-gray-800 font-semibold hover:from-orange-200 hover:to-orange-300 hover:text-orange-700 hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
    >
      {item.label}
    </button>
  ))}
</nav>
          </div>

          <GoogleLogin user={user} setUser={setUser} />
        </div>
      </header>

      {/* Hero slideshow */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        {bgSlides.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: i === 0 ? 1 : 0, scale: 1.1 }}
            animate={{ opacity: i === slide ? 1 : 0, scale: i === slide ? 1 : 1.1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="relative z-10 w-full flex items-center">
          <div className="space-y-6 text-white max-w-2xl px-6 md:px-12">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight space-y-1">
              {["Your daily", "pause for", "peace"].map((line, i) => (
                <motion.span
                  key={i}
                  className={`block ${
                    line === "peace"
                      ? "bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"
                      : ""
                  }`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.4 }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="text-lg max-w-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              From stress relief to better sleep, access tools that help you feel calm, focused, and refreshed.
            </motion.p>

            <motion.div
              className="flex gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              <motion.button
                onClick={() => setCurrentPage("library")}
                className="px-6 py-3 rounded-full bg-orange-500 text-white text-sm font-semibold shadow-md"
                whileHover={{ scale: 1.08 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Explore library
              </motion.button>

              <button
                onClick={() => setCurrentPage("about-us")}
                className="px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition"
              >
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              Activities to Lift Your Mood 🌱
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore guided videos, mindful exercises, and lighthearted activities to reduce stress, ease anxiety, and bring a little joy into your day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ActivityCard
              icon={Play}
              title="Guided Videos"
              desc="Short clips to calm your mind and reset your day."
              action="Watch Now"
            />
            <ActivityCard
              icon={Dumbbell}
              title="Quick Exercises"
              desc="Simple stretches & breathwork to ease stress instantly."
              action="Try Exercise"
            />
            <ActivityCard
              icon={Smile}
              title="Fun Activities"
              desc="Engaging tasks to distract negative thoughts & uplift mood."
              action="Start Now"
            />
          </div>
        </div>
      </section>

      {/* Floating Chatbot Button */}
      <Chatbot />
    </div>
  );
}