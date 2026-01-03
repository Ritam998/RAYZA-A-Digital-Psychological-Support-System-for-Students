import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { libraryFilters } from "../data/libraryFilters";

export default function FilterSidebar({ activeFilters, setActiveFilters, isOpen, setIsOpen }) {
  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => ({ ...prev, [category]: value }));
  };

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow border text-gray-700"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-72 h-full bg-white p-6 z-50 
                       lg:static lg:w-64 lg:h-auto lg:bg-transparent lg:p-0 lg:z-auto"
          >
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Type</h3>
                <select
                  value={activeFilters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                >
                  {libraryFilters.type.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Duration</h3>
                <select
                  value={activeFilters.duration}
                  onChange={(e) => handleFilterChange("duration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                >
                  {libraryFilters.duration.map(duration => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}