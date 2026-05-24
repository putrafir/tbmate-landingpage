"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { db, app } from "../../../lib/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";

// ============================================================================
// TYPE DEFINITION
// ============================================================================
interface Patient {
  id: string;
  uid: string;
  name: string;
  phase: string;
  adherence: number;
  status: string;
  alasanNonaktif?: string;
  catatanNonaktif?: string;
}

// ============================================================================
// 1. KOMPONEN ANAK (Memuat logika useSearchParams)
// Komponen ini HARUS berada di dalam <Suspense> dari parent-nya
// ============================================================================
function PatientListContent() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [selectedPhaseFilter, setSelectedPhaseFilter] =
    useState<string>("Semua");
  const [isStatusActiveFilter, setIsStatusActiveFilter] =
    useState<boolean>(true);

  const [deactivateData, setDeactivateData] = useState({
    isOpen: false,
    patientId: "",
    patientName: "",
    reason: "Sembuh",
    notes: "",
  });
  const [isDeactivating, setIsDeactivating] = useState(false);

  // 💡 MENGGUNAKAN useSearchParams()
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

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
            alasanNonaktif: userData.alasanNonaktif || "",
            catatanNonaktif: userData.catatanNonaktif || "",
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

  const submitDeactivation = async () => {
    setIsDeactivating(true);
    try {
      const userRef = doc(db, "users", deactivateData.patientId);

      await setDoc(
        userRef,
        {
          status: "Nonaktif",
          alasanNonaktif: deactivateData.reason,
          catatanNonaktif: deactivateData.notes,
          tanggalNonaktif: new Date(),
        },
        { merge: true },
      );

      setPatients((prev) =>
        prev.map((p) =>
          p.id === deactivateData.patientId ? { ...p, status: "Nonaktif" } : p,
        ),
      );

      setDeactivateData({
        isOpen: false,
        patientId: "",
        patientName: "",
        reason: "Sembuh",
        notes: "",
      });
    } catch (error) {
      console.error("Gagal menonaktifkan pasien:", error);
      alert("Terjadi kesalahan sistem. Gagal mengubah status.");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden relative mt-8">
      {/* Filter Area */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={() => setSelectedPhaseFilter("Semua")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
            selectedPhaseFilter === "Semua"
              ? "border border-[#2E7D32] text-[#2E7D32] bg-green-50/50"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Semua Fase
        </button>
        <button
          onClick={() => setSelectedPhaseFilter("Intensif")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
            selectedPhaseFilter === "Intensif"
              ? "border border-[#2E7D32] text-[#2E7D32] bg-green-50/50"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Fase Intensif
        </button>
        <button
          onClick={() => setSelectedPhaseFilter("Lanjutan")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
            selectedPhaseFilter === "Lanjutan"
              ? "border border-[#2E7D32] text-[#2E7D32] bg-green-50/50"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Fase Lanjutan
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        <button
          onClick={() => setIsStatusActiveFilter(!isStatusActiveFilter)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
            isStatusActiveFilter
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isStatusActiveFilter ? "Status: Aktif Only" : "Semua Status"}
        </button>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
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
                            className={`h-1.5 rounded-full ${
                              patient.adherence < 50
                                ? "bg-red-500"
                                : patient.adherence < 80
                                  ? "bg-yellow-500"
                                  : "bg-[#2E7D32]"
                            }`}
                            style={{ width: `${patient.adherence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-900 w-8">
                          {patient.adherence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {patient.status === "Aktif" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#2E7D32] shadow-[0_0_8px_rgba(46,125,50,0.4)]"></div>
                          <span className="font-medium text-sm text-gray-900">
                            Aktif
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="font-medium text-sm text-gray-500 max-w-[150px] truncate">
                            {patient.alasanNonaktif || "Nonaktif"}
                          </span>
                          {patient.catatanNonaktif && (
                            <div
                              className="text-gray-400 hover:text-gray-700 cursor-help transition-colors"
                              title={`Catatan: ${patient.catatanNonaktif}`}
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
                                  strokeWidth="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
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

                      {openDropdownId === patient.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdownId(null)}
                          ></div>
                          <div
                            className={`absolute right-10 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 ${
                              isNearBottom
                                ? "bottom-full mb-2 origin-bottom-right"
                                : "top-full mt-2 origin-top-right"
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
                                setDeactivateData({
                                  ...deactivateData,
                                  isOpen: true,
                                  patientId: patient.id,
                                  patientName: patient.name,
                                });
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

      {/* 💥 MODAL CUSTOM: NONAKTIFKAN PASIEN */}
      {deactivateData.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() =>
              !isDeactivating &&
              setDeactivateData({ ...deactivateData, isOpen: false })
            }
          ></div>
          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-red-50/50 border-b border-red-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-red-800">
                  Nonaktifkan Pasien
                </h3>
                <p className="text-sm text-red-600/80 mt-0.5">
                  Ubah status operasional pasien.
                </p>
              </div>
              <button
                onClick={() =>
                  setDeactivateData({ ...deactivateData, isOpen: false })
                }
                disabled={isDeactivating}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-600">
                  Anda akan menonaktifkan akun pemantauan untuk:
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {deactivateData.patientName}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Alasan Penonaktifan *
                </label>
                <select
                  value={deactivateData.reason}
                  onChange={(e) =>
                    setDeactivateData({
                      ...deactivateData,
                      reason: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block px-4 py-3 outline-none cursor-pointer transition-all"
                >
                  <option value="Sembuh (Pengobatan Selesai)">
                    Sembuh (Pengobatan Selesai)
                  </option>
                  <option value="Pindah Faskes">Pindah Faskes</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                  <option value="Drop Out / Mangkir Total">
                    Drop Out / Mangkir Total
                  </option>
                  <option value="Gagal Pengobatan">Gagal Pengobatan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={deactivateData.notes}
                  onChange={(e) =>
                    setDeactivateData({
                      ...deactivateData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Tambahkan keterangan spesifik jika diperlukan..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block px-4 py-3 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button
                onClick={() =>
                  setDeactivateData({ ...deactivateData, isOpen: false })
                }
                disabled={isDeactivating}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={submitDeactivation}
                disabled={isDeactivating}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeactivating ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                ) : (
                  "Nonaktifkan Pasien"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. HALAMAN UTAMA (Membungkus fungsi anak dengan Suspense)
// ============================================================================
export default function DataPasienPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    nickName: "",
    email: "",
    password: "",
    ageGroup: "Dewasa",
    kategoriObat: "Kategori 1",
    weight: "",
    reminderTime: "08:00",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDaftarPasien = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.weight
    ) {
      alert("Nama, Email, Password, dan Berat Badan wajib diisi!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password minimal harus 6 karakter sesuai standar Firebase!");
      return;
    }

    setIsSubmitting(true);
    try {
      const secondaryApp =
        getApps().find((a) => a.name === "SecondaryApp") ||
        initializeApp(app.options, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        formData.password,
      );
      const authUID = userCredential.user.uid;

      await secondaryAuth.signOut();

      const timestampNow = Date.now();
      const displayUID = `USR-${timestampNow}`;
      const today = new Date();

      const [hourStr, minuteStr] = formData.reminderTime.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      const formattedReminderTime = `${hour.toString().padStart(2, "0")}:${minuteStr} ${ampm}`;

      let tahapIntensif = "";
      let tahapLanjutan = "";
      let namaObat = "";
      let jumlahTablet = 0;
      const bb = Number(formData.weight);

      if (bb >= 5 && bb <= 9) {
        tahapIntensif = "1 tablet RHZ (75/50/150)";
        tahapLanjutan = "1 tablet RH (75/50)";
        namaObat = "RHZ / RH";
        jumlahTablet = 1;
      } else if (bb >= 10 && bb <= 14) {
        tahapIntensif = "2 tablet RHZ (75/50/150)";
        tahapLanjutan = "2 tablet RH (75/50)";
        namaObat = "RHZ / RH";
        jumlahTablet = 2;
      } else if (bb >= 15 && bb <= 19) {
        tahapIntensif = "3 tablet RHZ (75/50/150)";
        tahapLanjutan = "3 tablet RH (75/50)";
        namaObat = "RHZ / RH";
        jumlahTablet = 3;
      } else if (bb >= 20 && bb <= 30) {
        tahapIntensif = "4 tablet RHZ (75/50/150)";
        tahapLanjutan = "4 tablet RH (75/50)";
        namaObat = "RHZ / RH";
        jumlahTablet = 4;
      } else if (bb >= 31 && bb <= 37) {
        tahapIntensif = "2 tablet RHZE (150/75/400/275)";
        tahapLanjutan = "2 tablet RH (150/150)";
        namaObat = "4 KDT RHZE";
        jumlahTablet = 2;
      } else if (bb >= 38 && bb <= 54) {
        tahapIntensif = "3 tablet RHZE (150/75/400/275)";
        tahapLanjutan = "3 tablet RH (150/150)";
        namaObat = "4 KDT RHZE";
        jumlahTablet = 3;
      } else if (bb >= 55 && bb <= 70) {
        tahapIntensif = "4 tablet RHZE (150/75/400/275)";
        tahapLanjutan = "4 tablet RH (150/150)";
        namaObat = "4 KDT RHZE";
        jumlahTablet = 4;
      } else if (bb >= 71) {
        tahapIntensif = "5 tablet RHZE (150/75/400/275)";
        tahapLanjutan = "5 tablet RH (150/150)";
        namaObat = "4 KDT RHZE";
        jumlahTablet = 5;
      }

      const batch = writeBatch(db);

      const pasienBaruRef = doc(db, "users", authUID);
      batch.set(pasienBaruRef, {
        uniqueId: displayUID,
        email: formData.email,
        role: "Pasien",
        fullName: formData.fullName,
        nickName: formData.nickName || formData.fullName.split(" ")[0],
        ageGroup: formData.ageGroup,
        weight: bb,
        reminderTime: formattedReminderTime,
        createdAt: today,
        currentPhase: "Intensif",
        totalIntensif: 56,
        diminumIntensif: 0,
        totalLanjutan: 48,
        diminumLanjutan: 0,
        status: "Aktif",
      });

      for (let i = 0; i < 56; i++) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + i);
        const formattedDate = scheduleDate.toLocaleDateString("en-CA");

        const jadwalRef = doc(collection(db, `users/${authUID}/jadwal_obat`));
        batch.set(jadwalRef, {
          userId: authUID,
          nama_obat: namaObat,
          fase: "Intensif",
          dosis: tahapIntensif,
          jumlah_tablet: jumlahTablet,
          waktu_minum: formattedReminderTime,
          status: "Belum diminum",
          tanggal: formattedDate,
          berat_badan: bb,
          createdAt: today,
          verifikasi_ai: "Belum",
          skor_ai: 0,
        });
      }

      for (let week = 0; week < 16; week++) {
        for (let day = 0; day < 7; day++) {
          if (day === 1 || day === 3 || day === 5) {
            const scheduleDate = new Date(today);
            scheduleDate.setDate(today.getDate() + 56 + week * 7 + day);
            const formattedDate = scheduleDate.toLocaleDateString("en-CA");

            const jadwalRef = doc(
              collection(db, `users/${authUID}/jadwal_obat`),
            );
            batch.set(jadwalRef, {
              userId: authUID,
              nama_obat: namaObat,
              fase: "Lanjutan",
              dosis: tahapLanjutan,
              jumlah_tablet: jumlahTablet,
              waktu_minum: formattedReminderTime,
              status: "Belum diminum",
              tanggal: formattedDate,
              berat_badan: bb,
              createdAt: today,
              verifikasi_ai: "Belum",
              skor_ai: 0,
            });
          }
        }
      }

      await batch.commit();

      setIsModalOpen(false);
      setFormData({
        fullName: "",
        nickName: "",
        email: "",
        password: "",
        ageGroup: "Dewasa",
        kategoriObat: "Kategori 1",
        weight: "",
        reminderTime: "08:00",
      });

      setSuccessModal({
        isOpen: true,
        title: "Pendaftaran Berhasil!",
        message: `Pasien ${formData.fullName} berhasil didaftarkan. Akun login telah dibuat dan 104 jadwal obat telah disusun.`,
      });

      setTimeout(() => {
        setSuccessModal({ isOpen: false, title: "", message: "" });
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Gagal mendaftar pasien:", error);
      alert(
        "Terjadi kesalahan! Pastikan email belum pernah terdaftar sebelumnya.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
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
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2E7D32] hover:bg-green-800 text-white font-medium py-2.5 px-5 rounded-xl shadow-[0_4px_14px_0_rgba(46,125,50,0.39)] transition-all text-sm flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Daftarkan Pasien Baru
        </button>
      </div>

      {/* 💡 INI BAGIAN PENTING: Suspense Membungkus Komponen yang menggunakan useSearchParams */}
      <Suspense
        fallback={
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Memuat daftar pasien...
          </div>
        }
      >
        <PatientListContent />
      </Suspense>

      {/* MODAL PENDAFTARAN PASIEN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-green-50/50 border-b border-green-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Pendaftaran Pasien TBMate
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Isi data dasar pasien untuk memulai pemantauan.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDaftarPasien} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Nama Panggilan *
                  </label>
                  <input
                    type="text"
                    name="nickName"
                    value={formData.nickName}
                    onChange={handleInputChange}
                    required
                    placeholder="Contoh: Budi"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="budi@example.com"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Password Login *
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Kelompok Usia
                  </label>
                  <select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none cursor-pointer"
                  >
                    <option value="Dewasa">Dewasa</option>
                    <option value="Anak">Anak-anak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Kategori Obat
                  </label>
                  <select
                    name="kategoriObat"
                    value={formData.kategoriObat}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none cursor-pointer"
                  >
                    <option value="Kategori 1">Kategori 1 (Baru)</option>
                    <option value="Kategori 2">Kategori 2 (Kambuh)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Berat Badan (KG) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Misal: 55"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Jam Pengingat vDOT
                  </label>
                  <input
                    type="time"
                    name="reminderTime"
                    value={formData.reminderTime}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] block px-4 py-3 outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-2">
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  <span className="font-bold">Catatan Sistem:</span> Akun login
                  Firebase Auth otomatis dibuat untuk pasien ini menggunakan
                  email & password di atas.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-5 mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#2E7D32] hover:bg-green-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Memproses..." : "Simpan Data Pasien"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 💥 MODAL SUKSES (AUTO-CLOSE) */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"></div>

          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg
                className="w-8 h-8 text-[#2E7D32]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {successModal.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {successModal.message}
            </p>

            <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#2E7D32] animate-pulse">
              <svg
                className="animate-spin h-5 w-5"
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
              Menyiapkan data pasien...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
