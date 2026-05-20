"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek untuk mengubah gaya navbar saat halaman di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleSmoothScroll = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.hash) {
        event.preventDefault();
        const id = target.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const offset = 80; // Adjust this value to match the navbar height
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleSmoothScroll);
    return () => document.removeEventListener("click", handleSmoothScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="w-full px-6 md:px-8 flex justify-between items-center max-w-[1200px] mx-auto relative">
        {/* ================= LOGO ================= */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <Image
              src="/tbmate logo.webp"
              alt="TBMate Logo"
              width={32}
              height={32}
              className="rounded shadow-sm"
            />
          </div>
          <span className="text-xl font-extrabold text-primary-green tracking-tight">
            TBMate
          </span>
        </div>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a
            href="#home"
            className="hover:text-primary-green transition-colors scroll-smooth"
          >
            Home
          </a>
          <a
            href="#features"
            className="hover:text-primary-green transition-colors scroll-smooth"
          >
            Features
          </a>
          <a
            href="#education"
            className="hover:text-primary-green transition-colors scroll-smooth"
          >
            Education
          </a>
          <a
            href="#support"
            className="hover:text-primary-green transition-colors scroll-smooth"
          >
            Support
          </a>
        </div>

        <div className="hidden md:block">
          <a
            href="#download"
            className="bg-primary-green text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
          >
            Download APK
          </a>
        </div>

        {/* ================= HAMBURGER BUTTON (MOBILE) ================= */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#2E7D32] hover:bg-green-50 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            // Icon X (Close)
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Icon Hamburger
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* ================= MOBILE DROPDOWN MENU ================= */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 gap-4 text-sm font-semibold text-gray-600">
          <a
            href="#home"
            className="hover:text-[#2E7D32] p-2 rounded-lg hover:bg-green-50 transition-colors scroll-smooth"
          >
            Home
          </a>
          <a
            href="#features"
            className="hover:text-[#2E7D32] p-2 rounded-lg hover:bg-green-50 transition-colors scroll-smooth"
          >
            Features
          </a>
          <a
            href="#education"
            className="hover:text-[#2E7D32] p-2 rounded-lg hover:bg-green-50 transition-colors scroll-smooth"
          >
            Education
          </a>
          <a
            href="#support"
            className="hover:text-[#2E7D32] p-2 rounded-lg hover:bg-green-50 transition-colors scroll-smooth"
          >
            Support
          </a>
          <div className="pt-2 border-t border-gray-100 mt-2">
            <a
              href="#download"
              className="block w-full text-center bg-[#2E7D32] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-800 transition-all shadow-md"
            >
              Download APK
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
