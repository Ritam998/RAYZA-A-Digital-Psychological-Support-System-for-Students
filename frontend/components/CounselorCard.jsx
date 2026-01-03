import React from "react";
import { ArrowRight } from "lucide-react";

export default function CounselorCard({ name, specialty, bio, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center space-y-4 border border-gray-200">
      <img
        src={image}
        alt={`Profile of ${name}`}
        className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
      />
      <h3 className="font-bold text-xl text-gray-900">{name}</h3>
      <p className="text-orange-500 font-medium text-sm">{specialty}</p>
      <p className="text-gray-600 text-sm italic">{bio}</p>
      <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition">
        Book Session <ArrowRight size={16} />
      </button>
    </div>
  );
}