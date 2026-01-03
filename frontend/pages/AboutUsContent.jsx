import React from "react";

export default function AboutUsContent() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white px-6 py-16">

      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Building space for mental clarity 🌿
        </h1>
        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
          At Rayza, we believe mental health support should be simple,
          accessible, and always there when you need it.
        </p>
      </section>

      {/* STORY */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 mb-24 items-center">
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Rayza Exists
          </h2>

          <p>
            Life can be overwhelming. Sometimes, just knowing that help is nearby
            can make all the difference.
          </p>

          <p>
            Rayza is designed to provide practical, compassionate mental health
            support through tools that meet you wherever you are — emotionally,
            physically, and digitally.
          </p>

          <p>
            We don’t aim to replace professional care. Instead, we focus on
            early support, daily reflection, and accessible guidance that helps
            people feel heard and supported without judgment.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            What Makes Rayza Different
          </h3>

          <ul className="space-y-4 text-gray-700 text-lg">
            <li className="flex gap-3"><span>🤍</span>Human-first design, not clinical interfaces</li>
            <li className="flex gap-3"><span>🧠</span>Emotion-aware technology, not judgment</li>
            <li className="flex gap-3"><span>📊</span>Insights that guide, not overwhelm</li>
            <li className="flex gap-3"><span>🔐</span>Privacy, anonymity, and trust by default</li>
          </ul>
        </div>
      </section>

      {/* UNIQUE FEATURES */}
      <section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Unique Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "💬 AI Wellness Chatbot",
              text: "Talk anytime for immediate guidance, comfort, and emotional check-ins."
            },
            {
              title: "📴 Offline-First Model",
              text: "Access calming exercises and wellness tools even without an internet connection."
            },
            {
              title: "🧑‍⚕️ Professional Counsellors",
              text: "Get personalized support from trained professionals when you need it most."
            },
            {
              title: "🧘 Calming Exercises",
              text: "Simple, practical techniques to manage stress and reduce anxiety."
            },
            {
              title: "👥 Anonymous Peer Forum",
              text: "Share experiences and connect safely with others — without revealing your identity."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg hover:scale-[1.02] transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VISION */}
      <section className="max-w-5xl mx-auto mb-20 px-6 py-14 rounded-3xl bg-orange-50 border border-orange-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Our Vision 🌍
        </h2>

        <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
          <p>
            Our vision is a world where mental health support is not a last resort,
            but a daily companion — something people can access easily, privately,
            and without fear of judgment.
          </p>

          <p>
            We imagine technology that doesn’t add pressure or noise,
            but instead helps people slow down, understand their emotions,
            and take small steps toward balance and clarity.
          </p>

          <p>
            Rayza exists to help people feel heard, supported, and empowered
            throughout their mental health journey — anytime, anywhere.
          </p>
        </div>
      </section>

      {/* FINAL LINE */}
<section className="max-w-4xl mx-auto mt-24">
  <div className="rounded-3xl p-12 text-center bg-orange-50 border border-orange-200 shadow-md">

    <p className="text-3xl font-semibold text-gray-800 leading-relaxed">
      Mental wellness isn’t a destination —  
      <span className="text-orange-500"> it’s a daily practice.</span>
    </p>

    <p className="mt-4 text-gray-600 text-lg">
      Progress happens gently, one mindful step at a time.
    </p>
  </div>
</section>


      {/* FOOTER */}
      <p className="text-center text-sm text-gray-400 mt-16">
        © {new Date().getFullYear()} Rayza • Built with care, compassion, and purpose
      </p>
    </div>
  );
}
