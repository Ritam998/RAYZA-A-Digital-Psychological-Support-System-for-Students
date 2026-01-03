import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full mb-8">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for activities..."
        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
      />
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  );
}