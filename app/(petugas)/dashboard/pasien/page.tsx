"use client";

import React, { useState, useEffect, Suspense } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";

interface Patient {
  id: string;
  uid: string;
  name: string;
  phase: string;
  adherence: number;
  status: string;
}

function PatientListContent() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [selectedPhaseFilter, setSelectedPhaseFilter] =
    useState<string>("Semua");
  const [isStatusActiveFilter, setIsStatusActiveFilter] =
    useState<boolean>(true);

  const searchParams = useSearchParams(); // SEKARANG AMAN KARENA ADA DI BAWAH SUSPENSE
  const searchQuery = searchParams.get("search") || "";
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Flag cleanup

    const fetchPatients = async () => {
      try {
        const usersRef = collection(db, "users");
        const qUsers = query(usersRef, where("role", "==", "Pasien"));
        const usersSnapshot = await getDocs(qUsers);

        const patientsData: Patient[] = usersSnapshot.docs.map((userDoc) => {
          const userData = userDoc.data();
          const currentPhase = userData.currentPhase || "Intensif";

          const totalObatFaseAktif =
            currentPhase === "Lanjutan"
              ? userData.totalLanjutan || 48
              : userData.totalIntensif || 56;

          const obatDiminumFaseAktif =
            currentPhase === "Lanjutan"
              ? userData.diminumLanjutan || 0
              : userData.diminumIntensif || 0;

          // 🔹 PERBAIKAN LOGIKA: Samakan dengan Running Adherence di Dashboard
          let expectedDoses = totalObatFaseAktif;

          if (userData.createdAt) {
            let startDate: Date;

            if (typeof userData.createdAt.toDate === "function") {
              startDate = userData.createdAt.toDate();
            } else if (
              typeof userData.createdAt === "string" ||
              typeof userData.createdAt === "number"
            ) {
              startDate = new Date(userData.createdAt);
            } else if (userData.createdAt.seconds) {
              startDate = new Date(userData.createdAt.seconds * 1000);
            } else {
              startDate = new Date(userData.createdAt);
            }

            if (!isNaN(startDate.getTime())) {
              const today = new Date();
              startDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);

              const diffTime = today.getTime() - startDate.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

              expectedDoses = Math.max(
                1,
                Math.min(diffDays, totalObatFaseAktif),
              );
            }
          }

          const adherenceRate = Math.min(
            100,
            Math.round((obatDiminumFaseAktif / expectedDoses) * 100),
          );

          return {
            id: userDoc.id,
            uid: userData.uniqueId || "-",
            name: userData.fullName || "Tanpa Nama",
            phase: currentPhase,
            adherence: adherenceRate,
            status: userData.status || "Aktif",
          };
        });

        if (isMounted) setPatients(patientsData);
      } catch (error) {
        if (isMounted) console.error("Gagal ambil data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPatients();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.uid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase =
      selectedPhaseFilter === "Semua" ||
      patient.phase.toLowerCase() === selectedPhaseFilter.toLowerCase();
    const matchesStatus = !isStatusActiveFilter || patient.status === "Aktif";

    return matchesSearch && matchesPhase && matchesStatus;
  });

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
      {/* Filter Area */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={() => setSelectedPhaseFilter("Semua")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${selectedPhaseFilter === "Semua" ? "border border-[#2E7D32] text-[#2E7D32] bg-green-50/50" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Semua Fase
        </button>
        <button
          onClick={() => setSelectedPhaseFilter("Intensif")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${selectedPhaseFilter === "Intensif" ? "border border-[#2E7D32] text-[#2E7D32] bg-green-50/50" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Fase Intensif
        </button>
        <button
          onClick={() => setSelectedPhaseFilter("Lanjutan")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${selectedPhaseFilter === "Lanjutan" ? "border border-[#2E7D32] text-[#2E7D32] bg-green-50/50" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Fase Lanjutan
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        <button
          onClick={() => setIsStatusActiveFilter(!isStatusActiveFilter)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${isStatusActiveFilter ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {isStatusActiveFilter ? "Status: Aktif Only" : "Semua Status"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8faf9] text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">PASIEN</th>
              <th className="px-6 py-4">FASE PENGOBATAN</th>
              <th className="px-6 py-4">KEPATUHAN (%)</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right pr-8">AKSI</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  <div className="flex justify-center items-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-[#2E7D32]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memuat data pasien...
                  </div>
                </td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  Tidak ditemukan data pasien yang cocok.
                </td>
              </tr>
            ) : (
              // 🔹 RENDERING MENGGUNAKAN DATA YANG SUDAH DI-FILTER
              filteredPatients.map((patient, index) => {
                let badgeClass = "bg-gray-200 text-gray-600";

                const isNearBottom =
                  index >= filteredPatients.length - 2 &&
                  filteredPatients.length > 2;

                if (patient.phase.includes("Intensif"))
                  badgeClass = "bg-red-100 text-red-600";
                if (patient.phase.includes("Lanjutan"))
                  badgeClass = "bg-green-200 text-green-800";

                return (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-900">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.uid}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1.5 text-xs font-bold rounded-full ${badgeClass}`}
                      >
                        {patient.phase}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 w-40">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${patient.adherence < 50 ? "bg-red-500" : patient.adherence < 80 ? "bg-yellow-500" : "bg-[#2E7D32]"}`}
                            style={{ width: `${patient.adherence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-900 w-8">
                          {patient.adherence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${patient.status === "Aktif" ? "bg-[#2E7D32]" : "bg-gray-400"}`}
                        ></div>
                        <span
                          className={`font-medium text-sm ${patient.status === "Aktif" ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {patient.status}
                        </span>
                      </div>
                    </td>
                    {/* 🔹 Kolom Aksi dengan Dropdown */}
                    {/* 🔹 Kolom Aksi dengan Dropdown (SUDAH DIBERSIHKAN) */}
                    <td className="px-6 py-5 text-right relative">
                      <button
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === patient.id ? null : patient.id,
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-700 bg-transparent hover:bg-gray-100 rounded-full transition-colors"
                        title="Opsi Pasien"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>

                      {/* 🔹 Kotak Dropdown Menu */}
                      {openDropdownId === patient.id && (
                        <>
                          {/* Lapisan transparan untuk menutup dropdown jika klik di luar */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdownId(null)}
                          ></div>

                          {/* 🔹 Dropdown melayang ke atas (bottom-full mb-2) */}
                          <div
                            className={`absolute right-10 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 ${
                              isNearBottom
                                ? "bottom-full mb-2 origin-bottom-right" // Buka ke atas (untuk baris bawah)
                                : "top-full mt-2 origin-top-right" // Buka ke bawah (untuk baris atas)
                            }`}
                          >
                            <button
                              onClick={() =>
                                router.push(`/dashboard/pasien/${patient.id}`)
                              }
                              className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#2E7D32] flex items-center gap-3 transition-colors"
                            >
                              Rekam Medis
                            </button>
                            <button
                              onClick={() => {
                                alert(
                                  `Membuka form edit profil untuk: ${patient.name}`,
                                );
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              Edit Profil
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => {
                                const confirmStatus = confirm(
                                  `Apakah Anda yakin ingin menonaktifkan pasien ${patient.name} (Misal: Sembuh/Pindah)?`,
                                );
                                if (confirmStatus)
                                  alert(
                                    "Status pasien diubah menjadi Nonaktif.",
                                  );
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                            >
                              Nonaktifkan
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// 2. EXPORT DEFAULT HALAMAN YANG SUDAH DIBUNGKUS SUSPENSE
export default function DataPasienPage() {
  return (
    <div className="space-y-8">
      {/* Header Halaman (Dirender instan tanpa menunggu client-side data) */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manajemen Data Pasien
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola dan pantau perkembangan pasien TB Anda secara komprehensif.
          </p>
        </div>
        <button
          onClick={() => alert("Membuka form pendaftaran...")}
          className="bg-[#2E7D32] hover:bg-green-800 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm text-sm flex items-center gap-2"
        >
          <span>+</span> Daftarkan Pasien Baru
        </button>
      </div>

      {/* 3. Komponen yang butuh `useSearchParams` dibungkus Suspense */}
      <Suspense
        fallback={
          <div className="text-center py-10 text-gray-500">
            Memuat antarmuka data...
          </div>
        }
      >
        <PatientListContent />
      </Suspense>
    </div>
  );
}
