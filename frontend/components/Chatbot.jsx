import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

// ---------------- Intents & Strategies ----------------
const intentKeywords = {
  greeting: ["hi", "hello", "hey"],
  stress: ["stress", "stressed", "anxious", "anxiety", "overwhelmed"],
  sad: ["sad", "low", "depressed", "down"],
  motivation: ["motivate", "motivation", "tired", "inspire"],
  thanks: ["thanks", "thank you"],
  book: ["book", "session", "appointment", "meet", "schedule"],
};

const intentResponses = {
  greeting: [
    "👋 Hi friend! How’s your day going?",
    "🌸 Hello! I’m here for you — how are you feeling right now?",
  ],
  stress: [
    "😌 Try this: inhale for 4s, hold 4s, exhale 6s. Repeat 5 times to calm your body.",
    "🌱 Stress tip: List the 3 biggest things stressing you out, then cross off what you *can’t* control.",
    "💆 A grounding trick: Look around and name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
  ],
  sad: [
    "💛 Journaling emotions can help release them safely.",
    "🌱 Reach out! Even a quick chat with someone close can lighten your mood.",
    "🎶 Put on calming music or go for a 10-minute mindful walk.",
  ],
  motivation: [
    "💪 The 2-minute rule: start a task for just 2 minutes — momentum comes naturally.",
    "✨ Visualize how future-you will feel thankful for this effort.",
    "🌞 Write 1 small, achievable goal today. Finishing it will boost your energy.",
  ],
  thanks: [
    "💛 You’re welcome! I’m glad I can be here 🤝.",
    "😊 Anytime 💚. Remember — you matter.",
  ],
  book: ["📅 Let’s book a wellbeing session. Select a date below 👇"],
  default: [
    "💡 I may not fully understand, but I’m here, listening.",
    "🤝 Thanks for sharing. Would you like to book a session for deeper support?",
  ],
};

// ---------------- Reply Logic ----------------
const getReply = (text, triggerBookSession) => {
  const message = text.toLowerCase();

  // Book session trigger
  if (intentKeywords.book.some((kw) => message.includes(kw))) {
    triggerBookSession();
    return intentResponses.book[0];
  }

  // Intent detection
  for (const intent in intentKeywords) {
    if (intentKeywords[intent].some((word) => message.includes(word))) {
      const res = intentResponses[intent];
      return res[Math.floor(Math.random() * res.length)];
    }
  }

  // Sentiment fallback
  const score = sentiment.analyze(message).score;
  if (score < -2)
    return "💛 It sounds heavy. Try this self-soothing: hold something soft, sip warm tea, and remind yourself this feeling will pass.";
  if (score > 2)
    return "🌸 Love your positivity! How about noting 3 things you’re grateful for today?";

  // Default
  const fallback = intentResponses.default;
  return fallback[Math.floor(Math.random() * fallback.length)];
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([
        {
          from: "bot",
          text: "👋 Hi! I’m your wellness assistant. Tell me how you feel, or ask to book a session 🌿",
          id: Date.now(),
        },
      ]);
    }
  }, [isOpen, history.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSend = () => {
    if (!userInput.trim()) return;

    const newMsg = { from: "user", text: userInput, id: Date.now() };
    setHistory((prev) => [...prev, newMsg]);
    setUserInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getReply(newMsg.text, () => setShowCalendar(true));
      setHistory((prev) => [
        ...prev,
        { from: "bot", text: reply, id: Date.now() },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setHistory((prev) => [
      ...prev,
      {
        from: "bot",
        text: `📅 Great! Your wellness session is booked for ${date}. I’ll remind you 🌱.`,
        id: Date.now(),
      },
    ]);
    setShowCalendar(false);
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const typingDots = (
    <motion.div className="flex gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-orange-400 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
        />
      ))}
    </motion.div>
  );

  return (
    <>
      {/* Floating Button */}
      <motion.div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full shadow-lg"
          >
            Need support? 🌿
          </motion.div>
        )}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.9 }}
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        >
          {isOpen ? (
            <X size={28} className="text-white" />
          ) : (
            <MessageCircle size={28} className="text-white" />
          )}
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-80 max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-orange-500 text-white px-4 py-3 font-semibold flex justify-between">
              Wellness Chatbot
              <button onClick={() => setIsOpen(false)} aria-label="Close">
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {history.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial="hidden"
                  animate="visible"
                  variants={messageVariants}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-2 ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                      B
                    </span>
                  )}

                  <div
                    className={`px-3 py-2 rounded-lg max-w-[75%] ${
                      msg.from === "user"
                        ? "bg-orange-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.from === "user" && (
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                      U
                    </span>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                    B
                  </span>
                  {typingDots}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 flex flex-col gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your feelings..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-orange-500 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold"
              >
                Send
              </button>
              <button
                onClick={() => setShowCalendar((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-orange-500 text-orange-500 text-sm font-semibold hover:bg-orange-50"
              >
                Book a Session
              </button>
              {showCalendar && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border rounded-md px-2 py-2 text-sm w-full mt-1"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}