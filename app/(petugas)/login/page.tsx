"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// 1. Import layanan Firebase Auth
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../../lib/firebase"; // Sesuaikan path ini jika perlu

export default function LoginPetugas() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 2. Minta Firebase memvalidasi Email & Password
      await signInWithEmailAndPassword(auth, email, password);

      // 3. Jika Firebase sukses (tidak masuk ke block catch), kita minta API membuat Cookie Sesi
      const res = await fetch("/api/auth/login", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrorMsg("Gagal membuat sesi login. Silakan coba lagi.");
      }
    } catch (error: unknown) {
      console.error(error);

      // Mengecek apakah error ini benar-benar berasal dari Firebase
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential"
        ) {
          setErrorMsg("Email atau kata sandi tidak valid!");
        } else if (error.code === "auth/too-many-requests") {
          setErrorMsg("Terlalu banyak percobaan gagal. Coba lagi nanti.");
        } else {
          setErrorMsg("Terjadi kesalahan pada sistem autentikasi.");
        }
      } else {
        // Jika error bukan dari Firebase (misal masalah jaringan internet mati)
        setErrorMsg("Terjadi kesalahan jaringan atau server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] to-[#e6f4ea] flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#2E7D32]">
              TB Care Portal
            </h1>
          </div>
          <h2 className="text-[28px] font-bold text-gray-900 mb-2">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-500 text-sm px-4">
            Masuk untuk melanjutkan ke sistem manajemen perawatan.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username atau Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                placeholder="petugas@puskesmas.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
                placeholder="Masukkan kata sandi"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Lupa Kata Sandi?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-medium py-4 rounded-xl transition-colors duration-300 flex justify-center items-center gap-2 ${isLoading ? "bg-green-800 opacity-70 cursor-not-allowed" : "bg-[#2E7D32] hover:bg-green-800"}`}
          >
            {isLoading ? "Memvalidasi..." : "Masuk"}
            {!isLoading && (
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            )}
          </button>
        </form>
      </div>

      <div className="absolute bottom-8 text-center w-full">
        <p className="text-xs text-gray-600 font-medium">
          © 2026 TB Care Portal. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Clinical Reliability & Patient-Centric Care.
        </p>
      </div>
    </div>
  );
}
