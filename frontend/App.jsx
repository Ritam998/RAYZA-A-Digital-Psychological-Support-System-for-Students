import React, { useState, useEffect } from "react";

// Pages
import HomeContent from "./pages/HomeContent";
import LibraryContent from "./pages/LibraryContent";
import ForYouContent from "./pages/ForYouContent";
import CrewContent from "./pages/CrewContent";
import TrendsContent from "./pages/TrendsContent";
import AboutUsContent from "./pages/AboutUsContent";

// Components
import PageContainer from "./components/PageContainer";

// Data
import { bgSlides } from "./data/bgSlides";

export default function App() {
  const [slide, setSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);

  // Slide show auto-rotation
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % bgSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case "library":
        return (
          <PageContainer title="Wellness Library 📚" onBack={() => setCurrentPage("home")}>
            <LibraryContent />
          </PageContainer>
        );

      case "for-you":
        return (
          <PageContainer title="Personalized For You ✨" onBack={() => setCurrentPage("home")}>
            <ForYouContent setCurrentPage={setCurrentPage} user={user} />
          </PageContainer>
        );

      case "crew":
        return (
          <PageContainer title="Meet Your Crew 🤝" onBack={() => setCurrentPage("home")}>
            <CrewContent />
          </PageContainer>
        );

      case "trends":
        return (
          <PageContainer title="Wellness Trends 📈" onBack={() => setCurrentPage("home")}>
            <TrendsContent />
          </PageContainer>
        );

      case "about-us":
        return (
          <PageContainer title="Our Mission & Vision 🧡" onBack={() => setCurrentPage("home")}>
            <AboutUsContent />
          </PageContainer>
        );

      case "home":
      default:
        return (
          <HomeContent
            user={user}
            setUser={setUser}
            setCurrentPage={setCurrentPage}
            slide={slide}
          />
        );
    }
  };

  return renderContent();
}