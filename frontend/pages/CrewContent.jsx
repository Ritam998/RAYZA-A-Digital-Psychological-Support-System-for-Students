import React from "react";
import { counselors } from "../data/counselors";
import CounselorCard from "../components/CounselorCard";

export default function CrewContent() {
  return (
    <div className="text-center">
      <p className="mt-4 text-lg text-gray-600 mb-10">
        Find and connect with certified counselors who can help you on your path to wellness.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {counselors.map((counselor, index) => (
          <CounselorCard key={index} {...counselor} />
        ))}
      </div>
    </div>
  );
}