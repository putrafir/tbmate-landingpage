"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export default function Education() {
  // ================= KONFIGURASI ANIMASI =================

  // Animasi untuk header
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Animasi untuk setiap kartu dengan delay berurutan (custom index)
  const cardAnimation: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: index * 0.15,
      },
    }),
  };

  return (
    <section
      id="education"
      className="max-w-[1200px] mx-auto px-6 lg:px-8 mb-24 overflow-hidden"
    >
      {/* ================= HEADER SECTION ================= */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#0052CC] leading-tight">
          Edukasi & Panduan Pengobatan
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Memahami perjalanan pengobatan Anda adalah langkah pertama menuju
          kesembuhan. Pelajari tahapan, pentingnya kedisiplinan, dan cara
          menjaga kesehatan selama masa pengobatan.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* ================= CARD FASE INTENSIF ================= */}
        {/* 💡 Ditambahin motion.div dengan custom index 0 */}
        <motion.div
          custom={0}
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-[#2E7D32]">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Fase Intensif</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Berlangsung selama 2 bulan pertama. Obat diminum setiap hari untuk
              membunuh sebagian besar kuman TBC dan mencegah penularan.
            </p>
          </div>
          <div className="self-start text-[11px] font-bold text-[#2E7D32] bg-green-50 border border-green-100 px-4 py-2 rounded-full flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            Durasi: 2 Bulan
          </div>
        </motion.div>

        {/* ================= CARD FASE LANJUTAN ================= */}
        <motion.div
          custom={1}
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#E8F0FF] rounded-xl flex items-center justify-center text-[#0052CC]">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Fase Lanjutan</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Berlangsung 4-6 bulan setelah fase intensif. Obat diminum 3 kali
              seminggu untuk membersihkan sisa kuman dan mencegah kekambuhan di
              masa depan.
            </p>
          </div>
          <div className="self-start text-[11px] font-bold text-[#0052CC] bg-blue-50 border border-blue-100 px-4 py-2 rounded-full flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            Durasi: 4-6 Bulan
          </div>
        </motion.div>

        {/* ================= CARD KEPATUHAN & RESISTENSI ================= */}
        <motion.div
          custom={2}
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-900">
              Kepatuhan & Resistensi
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Berhenti minum obat sebelum waktunya atau tidak teratur dapat
            menyebabkan kuman menjadi kebal (MDR-TB). Pengobatan MDR-TB jauh
            lebih lama, sulit, dan efek sampingnya lebih berat.
          </p>
        </motion.div>
      </div>

      {/* ================= CARD TIPS HARIAN (LEBAR) ================= */}
      {/* 💡 Kartu terakhir muncul dengan delay paling lambat (index 3) */}
      <motion.div
        custom={3}
        variants={cardAnimation}
        initial="hidden"
        whileInView="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        viewport={{ once: true, amount: 0.2 }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center gap-6 mt-6"
      >
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-gray-600 shadow-inner">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-4v7h2.5v8H21V2c-2.76 0-5 2.24-5 5z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            Tips Kesehatan Harian
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Konsumsi makanan bergizi tinggi protein untuk memperbaiki jaringan
            paru yang rusak. Pastikan ventilasi rumah baik agar sinar matahari
            masuk, karena kuman TBC mati oleh sinar matahari. Gunakan masker
            saat berinteraksi dan terapkan etika batuk yang benar.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
