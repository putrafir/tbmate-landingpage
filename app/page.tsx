import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureAI from "./components/FeatureAI";
import Ecosystem from "./components/Ecosystem";
import Education from "./components/Education";
import Footer from "./components/Footer";

export default function TBMateLandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FCF9] font-sans text-gray-800 selection:bg-[#2E7D32] selection:text-white">
      <Navbar />
      <HeroSection />
      <FeatureAI />
      <Ecosystem />
      <Education />
      <Footer />
    </div>
  );
}
