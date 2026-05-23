"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Import Firebase Auth
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName, setAdminName] = React.useState("Petugas Puskesmas");
  const [facilityName, setFacilityName] = React.useState("Admin TBMate");

  // 🔹 MENDENGARKAN PERUBAHAN DATA PROFIL SECARA REAL-TIME
  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Gunakan onSnapshot agar jika data diubah di halaman Profil, Sidebar otomatis ikut berubah
        const adminRef = doc(db, "admins", user.uid);
        const unsubscribeDoc = onSnapshot(adminRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAdminName(data.adminName || "Petugas Puskesmas");
            setFacilityName(data.facilityName || "Admin TBMate");
          }
        });

        return () => unsubscribeDoc(); // Cleanup listener saat komponen ditutup
      } else {
        // Reset jika logout
        setAdminName("Petugas Puskesmas");
        setFacilityName("Admin TBMate");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Fungsi untuk menangani proses logout
  const handleLogout = async () => {
    try {
      // 1. Logout dari sistem Firebase (Client-side)
      await signOut(auth);

      // 2. Hapus cookie sesi dari Next.js (Server-side)
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // 3. Arahkan kembali ke halaman login dan segarkan state
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
      alert("Gagal logout. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa]">
      {/* Sidebar (Kiri) */}
      {/* Sidebar (Kiri) */}
      <aside className="w-[260px] bg-[#eef7f2] border-r border-gray-200/50 flex flex-col py-8 relative">
        <div className="px-8 mb-10">
          <div className="flex items-center gap-2">
            <Image
              src="/tbmate logo.webp"
              alt="TBMate Logo"
              width={32}
              height={32}
              className="rounded shadow-sm"
            />
            <h1 className="text-[22px] font-extrabold text-[#2E7D32] tracking-tight">
              TB Care Portal
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Clinician Workspace</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${pathname === "/dashboard" ? "bg-white text-[#2E7D32] shadow-sm" : "text-gray-600 hover:bg-white/50"}`}
          >
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
            Dashboard
          </Link>
          <Link
            href="/dashboard/pasien"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${pathname.includes("/pasien") ? "bg-white text-[#2E7D32] shadow-sm" : "text-gray-600 hover:bg-white/50"}`}
          >
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            Data Pasien
          </Link>
        </nav>

        {/* 🔹 KARTU PROFIL & LOGOUT BAWAH (BARU) */}
        <div className="px-4 mt-auto">
          <div className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
            {/* 🔹 SEKARANG MENJADI LINK KE HALAMAN PROFIL */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 text-left w-full hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white bg-[#1A3636] font-bold shrink-0 group-hover:scale-105 transition-transform">
                {adminName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {facilityName}
                </p>
                <p className="text-[11px] font-medium text-[#2E7D32] truncate">
                  {adminName}
                </p>
              </div>
            </Link>

            <div className="h-px bg-gray-100 w-full"></div>

            {/* Tombol Logout (Tetap sama) */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Keluar Sistem
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Utama (Kanan) */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="px-10 py-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Selamat Datang, Petugas
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari data pasien..."
                value={currentSearch}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2.5 bg-white text-gray-500 border border-gray-300 rounded-full text-sm w-[280px] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-4 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </header>

        <div className="px-10 pb-10 flex-1">{children}</div>
      </main>
    </div>
  );
}
