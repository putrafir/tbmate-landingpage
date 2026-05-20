"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export default function Ecosystem() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardAnimation: Variants = {
    hidden: { opacity: 0, y: 50 },
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
    <section className="max-w-[1200px] mx-auto px-6 lg:px-8 mb-24 bg-[#F2F8F2] py-16 lg:py-20 rounded-[3rem] overflow-hidden">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center"
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#1A3626] leading-tight">
          Ekosistem Terintegrasi TBMate
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Platform komprehensif yang menghubungkan pasien, keluarga (PMO), dan
          fasilitas kesehatan puskesmas secara real-time untuk mendukung
          kepatuhan pengobatan Tuberkulosis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* 1. BOX PMO (Besar) */}
        {/* 💡 PERBAIKAN: Hapus transition-all dan hover:-translate-y-1, ganti jadi transition-shadow */}
        {/* Tambahkan whileHover={{ y: -5 }} agar Framer Motion yang atur efek melayangnya */}
        <motion.div
          custom={0}
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          viewport={{ once: true, amount: 0.1 }}
          className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row overflow-hidden relative"
        >
          <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[#E8F0FF] text-[#0052CC] rounded-full flex items-center justify-center mb-6 shadow-sm shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">
                Notifikasi Real-time PMO
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Keluarga bertindak sebagai Pengawas Menelan Obat (PMO) dengan
                sistem peringatan dini. Jika pasien melewatkan dosis, notifikasi
                instan akan dikirim ke aplikasi PMO.
              </p>
              <ul className="text-xs text-gray-900 font-medium space-y-3">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-[#2E7D32] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Peringatan jadwal minum obat
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-[#2E7D32] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Konfirmasi kepatuhan harian
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-[380px] relative min-h-[260px] md:min-h-full shrink-0 flex items-end">
            <img
              src="/pharmacist.webp"
              alt="Ilustrasi PMO"
              className="absolute inset-0 w-full h-full object-contain object-bottom mix-blend-multiply"
            />
          </div>
        </motion.div>

        {/* 2. BOX KEAMANAN DATA */}
        <motion.div
          custom={1}
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900">
              Keamanan Data
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Catatan kesehatan dienkripsi secara end-to-end. Privasi pasien
              dijaga dengan standar medis yang ketat.
            </p>
          </div>
          <div className="flex gap-2 mt-auto">
            <span className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 font-semibold">
              Enkripsi
            </span>
            <span className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 font-semibold">
              Privasi
            </span>
          </div>
        </motion.div>

        {/* 3. BOX INTEGRASI PUSKESMAS */}
        <motion.div
          custom={2}
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div className="w-12 h-12 bg-green-50 text-[#2E7D32] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-3 text-gray-900">
            Integrasi Puskesmas
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sistem berbagi UID aman memungkinkan tenaga medis memantau
            perkembangan secara langsung.
          </p>
        </motion.div>

        {/* 4. BOX KEPATUHAN (Besar) */}
        <motion.div
          custom={3}
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          viewport={{ once: true, amount: 0.1 }}
          className="md:col-span-2 bg-[#2E7D32] rounded-3xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center justify-between relative overflow-hidden"
        >
          <div className="relative z-10 max-w-sm">
            <h3 className="text-xl font-bold text-white mb-3">
              Meningkatkan Kepatuhan
            </h3>
            <p className="text-xs text-green-100 leading-relaxed">
              Pemantauan kolektif mengurangi risiko putus obat secara signifikan
              hingga pemulihan total.
            </p>
          </div>
          <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <span className="text-2xl font-extrabold text-[#2E7D32]">98%</span>
          </div>
          <div className="absolute right-[-5%] bottom-[-20%] opacity-10">
            <svg
              width="250"
              height="250"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <path d="M23 6l-9.5 9.5-5-5L1 18" />
              <path d="M17 6h6v6" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
