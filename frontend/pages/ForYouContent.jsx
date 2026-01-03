import React, { useState, useEffect } from "react";
import { Sun, Coffee, Moon, Wind, BookOpen, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ActionCard from "../components/ActionCard";
import BreathworkOverlay from "../components/BreathworkOverlay";
import { counselors } from "../data/counselors";
import Sparkle from "../components/Sparkle.jsx";

// Icon mapping for rebuild
const iconMap = { Wind, BookOpen, Smile, Coffee };

// Greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12)
    return { text: "Good Morning", planLabel: "Morning Plan", icon: <Sun size={32} /> };
  if (hour < 18)
    return { text: "Good Afternoon", planLabel: "Afternoon Plan", icon: <Coffee size={32} /> };
  return { text: "Good Evening", planLabel: "Evening Plan", icon: <Moon size={32} /> };
};

// Moods list
const moods = [
  { label: "Grateful", emoji: "😊" },
  { label: "Okay", emoji: "😐" },
  { label: "Struggling", emoji: "😔" },
  { label: "Stressed", emoji: "🧘" },
];

// Always-present breathing card (safe icon name)
const breathingCard = {
  icon: "Wind",
  title: "2-Min Wind Down",
  description: "A quick breathing exercise to release the day's tension.",
  buttonText: "Start Breathing",
  type: "breathing",
};

// Mood-specific plans (store `icon` as string)
const moodPlans = {
  Grateful: [
    { icon: "BookOpen", title: "Gratitude Journal", description: "Reflect on what you're thankful for today.", buttonText: "Start Writing" },
    { icon: "Smile", title: "Share Positivity", description: "Send a kind note or message to someone you care about.", buttonText: "Spread Joy" },
    { icon: "Coffee", title: "Celebrate Small Wins", description: "Write one small accomplishment you’re proud of.", buttonText: "Celebrate" },
  ],
  Okay: [
    { icon: "Smile", title: "Mood Booster", description: "Do one small fun activity to brighten your day.", buttonText: "Boost Mood" },
    { icon: "BookOpen", title: "Mindful Check-In", description: "Write three neutral things you noticed today.", buttonText: "Reflect" },
    { icon: "Coffee", title: "Playful Stretch", description: "2-min stretch to shake off the 'meh'.", buttonText: "Stretch" },
  ],
  Struggling: [
    { icon: "BookOpen", title: "Journal It Out", description: "Write freely to release emotions and stress.", buttonText: "Journal" },
    { icon: "Smile", title: "Encouraging Article", description: "Read uplifting content to remind yourself of hope.", buttonText: "Read" },
    { icon: "Coffee", title: "Gentle Walk", description: "Step outside for a 5-min walk to reset mentally.", buttonText: "Start Walk" },
  ],
  Stressed: [
    { icon: "Wind", title: "Box Breathing", description: "A 4-step breathing exercise to reduce stress.", buttonText: "Try It" },
    { icon: "BookOpen", title: "Declutter Your Mind", description: "Write down tasks to clear your head.", buttonText: "Unpack Stress" },
    { icon: "Smile", title: "Mini Restore", description: "2-min body scan to relax head-to-toe.", buttonText: "Restore Calm" },
  ],
};

// Shuffle helper
function getRandomActivities(pool, count = 2) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function ForYouContent({ setCurrentPage, user }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [planCards, setPlanCards] = useState([]);
  const [showBreathwork, setShowBreathwork] = useState(false);

  const greeting = getGreeting();
  const userName = user?.displayName || "User";

  // Sticky plan storage
  useEffect(() => {
    if (selectedMood) {
      const today = new Date().toDateString();
      const storageKey = `plan_${today}_${selectedMood}`;

      const storedPlan = localStorage.getItem(storageKey);
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan);
        const rebuilt = parsed.map(item => ({
          ...item,
          icon: iconMap[item.icon] ? iconMap[item.icon] : Wind,
        }));
        setPlanCards(rebuilt);
      } else {
        const randomPicks = getRandomActivities(moodPlans[selectedMood], 2);
        const newPlan = [breathingCard, ...randomPicks];
        setPlanCards(
          newPlan.map(item => ({
            ...item,
            icon: iconMap[item.icon] ? iconMap[item.icon] : Wind,
          }))
        );
        const safeToStore = newPlan.map(item => ({ ...item, icon: item.icon }));
        localStorage.setItem(storageKey, JSON.stringify(safeToStore));
      }
    }
  }, [selectedMood]);

  return (
    <div className="space-y-12">
      
      {/* Sparkly Hero with Greeting + Mood Buttons */}
      <div
        className="relative text-center mx-auto max-w-3xl rounded-3xl p-10 shadow-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)" }}
      >
        {/* Sparkles in background */}
        <AnimatePresence>
          {Array.from({ length: 10 }).map((_, i) => (
            <Sparkle
              key={i}
              x={Math.random() * 400}
              y={Math.random() * 180}
              size={Math.random() * 8 + 6}
              delay={Math.random() * 3}
            />
          ))}
        </AnimatePresence>

        {/* Greeting */}
        <div className="relative z-10 text-white drop-shadow-lg">
          <div className="flex justify-center items-center gap-3 mb-4 text-yellow-200">
            {greeting.icon}
            <h2 className="text-3xl font-bold">{greeting.text}, {userName}</h2>
          </div>
          <p className="opacity-90 mb-6">How are you feeling right now?</p>

          {/* Mood Buttons */}
          <div className="flex justify-center flex-wrap gap-3">
            {moods.map(mood => (
              <button
  key={mood.label}
  onClick={() => setSelectedMood(mood.label)}
  className={`px-6 py-3 rounded-full flex items-center gap-2 text-base font-semibold transition transform
    ${
      selectedMood === mood.label
        ? "bg-white text-orange-600 shadow-2xl scale-110 ring-4 ring-yellow-300"
        : "bg-white/90 text-gray-700 hover:bg-white hover:scale-105"
    }`}
>
  <span className="text-xl">{mood.emoji}</span>
  <span>{mood.label}</span>
</button>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Cards Section */}
      {selectedMood && (
        <motion.div
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {planCards.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
            >
              <ActionCard
                {...item}
                icon={item.icon}
                onClick={
                  item.type === "breathing"
                    ? () => setShowBreathwork(true)
                    : () => console.log(`${item.title} clicked`)
                }
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Discover Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white">
          <h3 className="text-2xl font-bold text-gray-800 text-center">Track Your Journey</h3>
          <p className="text-center text-gray-600 mt-2">Consistency is the key to well-being.</p>
          <div className="mt-6 bg-orange-50 p-4 rounded-xl text-center">
            <p className="font-semibold text-orange-600">You've completed an activity 4 days this week!</p>
            <div className="mt-2 flex justify-center gap-2">
              {["M","T","W","T","F","S","S"].map((d,i) => (
                <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${["M","W","T","S"].includes(d)? "bg-orange-400 text-white" : "bg-gray-200"}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white text-center">
          <h3 className="text-2xl font-bold text-gray-800">Counselor Spotlight</h3>
          <div className="mt-4 flex flex-col items-center">
            <img src={counselors[0].image} alt={counselors[0].name} className="w-20 h-20 rounded-full border-4 border-orange-300"/>
            <p className="font-bold mt-2 text-gray-800">{counselors[0].name}</p>
            <p className="text-sm text-orange-600">{counselors[0].specialty}</p>
            <button
              onClick={() => setCurrentPage("crew")}
              className="mt-4 px-5 py-2 rounded-full bg-orange-400 text-white text-sm font-medium hover:bg-orange-500 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showBreathwork && <BreathworkOverlay onClose={() => setShowBreathwork(false)} />}
    </div>
  );
}