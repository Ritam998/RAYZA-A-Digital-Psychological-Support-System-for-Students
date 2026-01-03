import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ContentCard from "../components/ContentCard";
import { libraryContent } from "../data/libraryContent";
import { libraryFilters } from "../data/libraryFilters";
import { Frown } from "lucide-react";

export default function LibraryContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({ type: "All", duration: "Any" });
  const [filteredContent, setFilteredContent] = useState(libraryContent);
  const [isFilterOpen, setIsFilterOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => setIsFilterOpen(window.innerWidth > 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let content = [...libraryContent];

    if (searchTerm) {
      content = content.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.type !== "All") {
      content = content.filter(item => item.type === activeFilters.type);
    }

    if (activeFilters.duration !== "Any") {
      switch (activeFilters.duration) {
        case "< 5 min":
          content = content.filter(item => item.duration < 5);
          break;
        case "5-10 min":
          content = content.filter(item => item.duration >= 5 && item.duration <= 10);
          break;
        case "10+ min":
          content = content.filter(item => item.duration > 10);
          break;
        default:
          break;
      }
    }

    setFilteredContent(content);
  }, [searchTerm, activeFilters]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <FilterSidebar
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
      />

      <main className="flex-1">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredContent.length > 0 ? (
              filteredContent.map(item => <ContentCard key={item.id} item={item} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16 bg-white/50 rounded-2xl">
                <Frown size={48} className="text-orange-400 mb-4" />
                <h3 className="font-bold text-xl text-gray-800">No activities found</h3>
                <p className="text-gray-600 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}