"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Import Firebase Auth
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Sesuaikan path jika letak file berbeda

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
      <aside className="w-[260px] bg-[#eef7f2] border-r border-gray-200/50 flex flex-col py-8">
        <div className="px-8 mb-10">
          <h1 className="text-[22px] font-extrabold text-[#2E7D32] tracking-tight">
            TB Care Portal
          </h1>
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

        {/* Tombol Logout */}
        <div className="p-4 border-t border-gray-200/50 mt-auto">
          {/* Tambahkan event onClick ke tombol ini */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 w-full transition-colors font-semibold text-sm"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Konten Utama (Kanan) */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="px-10 py-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Selamat Datang, Petugas
            </h2>
            <p className="text-gray-500 text-sm">Rabu, 20 Mei 2026</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari data pasien..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-full text-sm w-[280px] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
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
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white bg-[#1A3636] font-bold">
              P
            </div>
          </div>
        </header>

        <div className="px-10 pb-10 flex-1">{children}</div>
      </main>
    </div>
  );
}
