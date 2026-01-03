import React, { useState } from "react";

export default function TrendsContent() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full min-h-screen px-6 py-10 bg-gradient-to-br from-orange-50 to-pink-50">

      {/* Action Bar */}
      <div className="flex justify-end mb-4">
        <a
          href="https://mental-health-dashboard-8sgtdxbendawfelopzprnq.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
        >
          Open Full Dashboard ↗
        </a>
      </div>

      {/* Dashboard Card */}
      <div className="relative w-full h-[85vh] rounded-2xl overflow-hidden shadow-xl border bg-white">

        {/* Loading Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="animate-pulse text-center">
              <div className="w-16 h-16 rounded-full bg-orange-200 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                Loading mental health insights…
              </p>
            </div>
          </div>
        )}

        {/* Embedded Streamlit Dashboard */}
        <iframe
          src="https://mental-health-dashboard-8sgtdxbendawfelopzprnq.streamlit.app/?embed=true"
          title="Mental Health Dashboard"
          className="w-full h-full border-0"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Data shown is for educational and analytical purposes only.
      </p>
    </div>
  );
}
