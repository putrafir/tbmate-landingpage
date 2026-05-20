"use client";

import React from "react";
// 💡 PERUBAHAN: Import Variants dari framer-motion
import { motion, Variants } from "framer-motion";

export default function HeroSection() {
  // ================= KONFIGURASI ANIMASI =================
  // 💡 PERUBAHAN: Tambahkan ': Variants' ke variabelnya
  const textContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // 💡 PERUBAHAN: Tambahkan ': Variants' ke variabelnya
  const textItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="home" className="relative w-full overflow-hidden bg-[#FBFDFB]">
      {/* ================= BACKGROUND GLOW EFFECTS ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-5%] left-[-15%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-[#2E7D32]/20 blur-[70px] md:blur-[100px] pointer-events-none z-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-[5%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] rounded-full bg-[#0052CC]/15 blur-[70px] md:blur-[100px] pointer-events-none z-0"
      />
      {/* ========================================================= */}

      <main className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 pt-32 pb-16 lg:pt-36 lg:pb-20 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {/* ================= BAGIAN TEKS ================= */}
        <motion.div
          variants={textContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex-1 max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.h1
            variants={textItem}
            className="text-4xl md:text-5xl lg:text-[2.8rem] font-bold leading-[1.2] text-[#1A3626] mb-4 lg:mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]"
          >
            Pantau Jadwal Minum Obat dengan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#0052CC] drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              Disiplin dan Mudah.
            </span>
          </motion.h1>

          <motion.p
            variants={textItem}
            className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base lg:text-lg max-w-md lg:max-w-none relative z-10"
          >
            TBMate membantu Anda mengelola kepatuhan pengobatan harian demi
            pemulihan yang lebih cepat dan hidup yang lebih sehat. Sistem
            terintegrasi kami dirancang untuk mendukung perjalanan penyembuhan
            Anda dengan antarmuka yang tenang dan profesional.
          </motion.p>

          {/* Tombol */}
          <motion.div
            variants={textItem}
            className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 w-full sm:w-auto"
          >
            <button className="flex justify-center items-center gap-2 bg-[#2E7D32] text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20 text-base md:text-lg w-full sm:w-auto">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download APK
            </button>

            <button className="flex justify-center items-center gap-2 bg-white border border-gray-200 text-[#0052CC] px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:border-[#0052CC] transition-colors text-base md:text-lg w-full sm:w-auto">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Lihat Demo
            </button>
          </motion.div>
        </motion.div>

        {/* ================= BAGIAN GAMBAR ================= */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex-1 w-full flex justify-center lg:justify-end mt-8 lg:mt-0 relative z-10"
        >
          <img
            src="/display phone tbmate.webp"
            alt="Mockup Aplikasi TBMate"
            className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[500px] h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      </main>
    </section>
  );
}
