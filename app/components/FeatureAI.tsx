"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export default function FeatureAI() {
  const features = [
    {
      title: "Verifikasi Pil Akurat",
      desc: "AI menganalisis gambar statis dengan tingkat kepercayaan tinggi (confidence score) untuk memastikan jenis dan dosis obat benar sebelum diminum.",
    },
    {
      title: "Sequential Capture Ringan",
      desc: "Tanpa streaming video yang berat. AI memproses urutan foto secara efisien untuk mengonfirmasi konsumsi tanpa membuat HP panas (overheating).",
    },
    {
      title: "Ramah Kuota & Sinyal Minim",
      desc: "Berkat pemrosesan Edge AI bawaan, proses verifikasi tetap berjalan lancar dan aman meskipun pasien berada di area pedesaan dengan internet terbatas.",
    },
  ];

  // ================= KONFIGURASI ANIMASI =================
  // Animasi muncul dari bawah untuk bagian header
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  // Animasi masuk dari kiri untuk gambar
  const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.2 },
    },
  };

  // Animasi kontainer untuk efek stagger (muncul berurutan) di bagian teks kanan
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  // Animasi item untuk efek stagger (muncul dari kanan ke kiri)
  const staggerItem: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="features"
      className="max-w-[1100px] mx-auto px-6 lg:px-8 mt-16 lg:mt-24 mb-24 flex flex-col items-center overflow-hidden"
    >
      {/* ================= BAGIAN HEADER ================= */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center max-w-3xl mb-12 lg:mb-16 flex flex-col items-center"
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#0052CC]">
          Jadwal Pintar & Verifikasi AI
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
          Memastikan setiap dosis diminum tepat waktu. Sistem verifikasi visual
          kami dirancang khusus agar sangat ringan dan optimal digunakan pada
          perangkat apa pun, memberikan ketenangan pikiran bagi pasien dan
          tenaga medis.
        </p>
      </motion.div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* ================= BAGIAN GAMBAR ================= */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex justify-center"
        >
          <img
            src="/jadwal display fitur.webp"
            alt="Fitur Jadwal Pintar TBMate"
            className="w-full max-w-[400px] lg:max-w-[460px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] rounded-2xl"
          />
        </motion.div>

        {/* ================= BAGIAN TEKS & LIST FITUR ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-5 lg:gap-6"
        >
          {/* Judul & Ikon */}
          <motion.div
            variants={staggerItem}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#E8F0FF] text-[#0052CC] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <svg
                className="w-6 h-6 lg:w-7 lg:h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl md:text-2xl text-gray-900 leading-tight">
              Verifikasi Aman & Inklusif
            </h3>
          </motion.div>

          {/* Deskripsi */}
          <motion.p
            variants={staggerItem}
            className="text-gray-600 text-sm md:text-base leading-relaxed"
          >
            Kecanggihan AI tidak ada artinya jika pasien di desa tidak bisa
            menjalankannya. TBMate menggunakan teknologi pemrosesan gambar yang
            ramah infrastruktur untuk mendeteksi obat dengan akurat, memastikan
            keselamatan pasien tanpa hambatan teknis.
          </motion.p>

          {/* List Poin-poin */}
          <div className="space-y-5 mt-2 lg:mt-4">
            {features.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex gap-4 items-start"
              >
                <div className="mt-1 bg-[#2E7D32] rounded-full p-1.5 shrink-0 shadow-md">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm md:text-base text-gray-900">
                    {item.title}
                  </h5>
                  <p className="text-[13px] md:text-sm text-gray-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
