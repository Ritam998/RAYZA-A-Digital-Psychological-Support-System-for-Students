import React from "react";
import { ArrowRight } from "lucide-react";

export default function PageContainer({ title, children, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-pink-100 text-gray-900 antialiased font-sans py-10">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-orange-500 flex items-center justify-center text-orange-500 hover:bg-orange-600 hover:text-white transition"
        >
          <ArrowRight size={16} className="transform rotate-180" />
        </button>

        <div className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            {title}
          </h1>
          <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-orange-400 to-pink-400 rounded-full" />
        </div>

        {children}
      </div>
    </div>
  );
}