"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase"; // Sesuaikan letak path firebase-mu

export default function ProfilePage() {
  const [adminName, setAdminName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // 🔹 TARIK DATA DARI FIRESTORE SAAT HALAMAN DIBUKA
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        setEmail(user.email || "");

        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const data = adminSnap.data();
          setAdminName(data.adminName || "");
          setFacilityName(data.facilityName || "");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 FUNGSI SIMPAN PROFIL
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    setIsSaving(true);
    try {
      const adminRef = doc(db, "admins", uid);
      await setDoc(
        adminRef,
        {
          adminName,
          facilityName,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal simpan:", error);
      alert("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔹 FUNGSI GANTI PASSWORD (VIA EMAIL RESET)
  // Ini best practice dari sisi keamanan agar user harus verifikasi email mereka.
  const handlePasswordReset = async () => {
    if (!email) return;

    const confirmReset = confirm(
      `Kirim tautan penggantian kata sandi ke ${email}?`,
    );
    if (!confirmReset) return;

    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert(
        "Tautan untuk membuat kata sandi baru telah dikirim ke email Anda. Silakan cek kotak masuk atau folder spam.",
      );
    } catch (error) {
      console.error("Gagal kirim reset:", error);
      alert("Gagal mengirim email reset password. Pastikan email valid.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pengaturan Akun
        </h1>
        <p className="text-gray-500 text-sm">
          Kelola informasi profil dan keamanan akun Anda di sini.
        </p>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
        {/* Header Kartu */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-[#f8faf9]">
          <div className="w-16 h-16 rounded-full bg-[#1A3636] border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold">
            {adminName ? adminName.charAt(0).toUpperCase() : "P"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {adminName || "Petugas Puskesmas"}
            </h2>
            <p className="text-sm text-[#2E7D32] font-medium">
              {facilityName || "Admin Faskes"}
            </p>
          </div>
        </div>

        {/* Form Data Diri */}
        <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Nama Lengkap Petugas
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Misal: dr. Ahmad"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Instansi / Puskesmas
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="Misal: Puskesmas Banyuwangi"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Akun (Tidak dapat diubah)
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl block px-4 py-3 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || !uid}
              className="px-6 py-2.5 bg-[#2E7D32] hover:bg-green-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        </form>
      </div>

      {/* 🔹 AREA KEAMANAN & PASSWORD */}
      <div className="bg-white rounded-[20px] shadow-sm border border-red-50 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-red-50/30">
          <h3 className="text-lg font-bold text-gray-900">Keamanan Akun</h3>
        </div>
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Ubah Kata Sandi</h4>
            <p className="text-sm text-gray-500 max-w-md">
              Demi keamanan sistem rekam medis, Anda tidak dapat melihat kata
              sandi saat ini. Sistem akan mengirimkan tautan aman ke email Anda
              untuk membuat kata sandi baru.
            </p>
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={isResetting || !email}
            className="shrink-0 px-6 py-2.5 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 text-sm font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {isResetting ? "Mengirim Email..." : "Kirim Link Reset Sandi"}
          </button>
        </div>
      </div>
    </div>
  );
}
