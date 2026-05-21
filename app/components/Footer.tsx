"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link"; // 1. Import Link biasa dari Next.js

// 2. Buat komponen MotionLink dengan membungkus Link menggunakan motion
const MotionLink = motion(Link);

export default function Footer() {
  // ================= KONFIGURASI ANIMASI =================

  // Kontainer utama untuk mengatur jeda antar elemen (Stagger)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Elemen muncul bergantian tiap 0.2 detik
        delayChildren: 0.1,
      },
    },
  };

  // Animasi seragam untuk teks, tombol, dan footer bottom (meluncur dari bawah)
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <footer
      id="support"
      className="w-full bg-[#2E7D32] relative overflow-hidden pt-20 pb-8 lg:pt-24 lg:pb-10"
    >
      {/* ================= EFEK CAHAYA (GLOW) ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-400/20 rounded-full blur-[60px] md:blur-[80px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[300px] h-[300px] bg-green-900/40 rounded-full blur-[80px] pointer-events-none"
      />

      {/* ================= KONTEN FOOTER ================= */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16 lg:mb-20">
          {/* Bagian Teks Kiri */}
          <motion.div
            variants={itemVariants}
            className="max-w-xl text-white text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold mb-4 lg:mb-6 leading-tight">
              Mulai Kedisiplinan Pengobatan Anda Hari Ini
            </h2>
            <p className="text-green-50 text-sm md:text-base leading-relaxed mb-6 md:mb-0">
              Bergabunglah dengan fasilitas kesehatan dan pasien lainnya yang
              telah berhasil mengelola perawatan mereka dengan panduan klinis
              dan pengingat yang andal.
            </p>
          </motion.div>

          {/* Bagian Tombol Kanan */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0"
          >
            <motion.button
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white text-[#2E7D32] font-bold px-6 py-3.5 md:px-8 md:py-4 rounded-xl flex items-center justify-center gap-2 text-sm md:text-base shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-gray-50 hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
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
              Unduh TBMate
            </motion.button>

            {/* 3. Gunakan MotionLink, tanpa passHref & legacyBehavior */}
            <MotionLink
              href="/login"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-transparent border-2 border-green-400 text-white font-bold px-6 py-3.5 md:px-8 md:py-4 rounded-xl flex items-center justify-center gap-2 text-sm md:text-base hover:bg-green-800 transition-colors duration-300 w-full sm:w-auto"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Portal Petugas
            </MotionLink>
          </motion.div>
        </div>

        {/* Bagian Alamat & Copyright */}
        <motion.div
          variants={itemVariants}
          className="border-t border-green-600/60 pt-8 flex flex-col lg:flex-row items-center justify-between text-xs md:text-sm text-green-100/80 gap-6 lg:gap-0"
        >
          <p className="text-center lg:text-left leading-relaxed">
            Dikembangkan oleh Tim Pengabdian Masyarakat Politeknik Negeri
            Banyuwangi
            <br />
            Jl. Raya Jember KM 13, Labanasem, Kec. Kabat, Kabupaten Banyuwangi,
            Jawa Timur 68461
          </p>
          <p className="font-medium tracking-wide text-center">
            © 2026 TBMate. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
