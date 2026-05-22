"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";

interface PatientProfile {
  fullName?: string;
  uniqueId?: string;
  currentPhase?: string;
  totalIntensif?: number;
  diminumIntensif?: number;
  totalLanjutan?: number;
  diminumLanjutan?: number;
  createdAt?: string | number | Date | Timestamp;
}

interface BuktiFoto {
  obat?: string;
  mulut_kosong?: string;
  proses_minum?: string[];
}

interface IngestionLog {
  id: string;
  tanggal: string;
  nama_obat: string;
  waktu_minum: string;
  status: string;
  verifikasi_ai: string;
  skor_ai: number;
  fase?: string;
}

// 🔹 FUNGSI AJAIB BARU UNTUK MEMBERSIHKAN BASE64
const sanitizeBase64 = (base64String?: string) => {
  if (!base64String)
    return "https://placehold.co/300x400/eeeeee/999999?text=Tidak+Ada+Foto";

  // Jika string sudah memiliki awalan "data:image...", biarkan saja.
  if (base64String.startsWith("data:image")) {
    return base64String;
  }

  // Jika ini base64 murni, tambahkan prefix-nya.
  return `data:image/jpeg;base64,${base64String}`;
};

export default function DetailPasienPage() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [logs, setLogs] = useState<IngestionLog[]>([]);

  const [filterWaktu, setFilterWaktu] = useState<string>("Riwayat");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const [selectedLog, setSelectedLog] = useState<IngestionLog | null>(null);
  const [buktiFoto, setBuktiFoto] = useState<BuktiFoto | null>(null);
  const [isLoadingFoto, setIsLoadingFoto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 KALKULATOR BARU: Menghitung Kepatuhan (Running) & Total Progres Sembuh
  const progressStats = React.useMemo(() => {
    if (!patient)
      return { kepatuhan: 0, progres: 0, diminumTotal: 0, targetTotal: 0 };

    const isLanjutan = patient.currentPhase === "Lanjutan";
    const diminumFase = isLanjutan
      ? patient.diminumLanjutan || 0
      : patient.diminumIntensif || 0;
    const totalFase = isLanjutan
      ? patient.totalLanjutan || 48
      : patient.totalIntensif || 56;

    // 1. Kepatuhan Kedisiplinan (Berdasarkan Umur Akun / Hari Berjalan)
    let expectedDoses = totalFase;

    if (patient.createdAt) {
      let startDate: Date;
      const created = patient.createdAt;

      // 🔹 PENGECEKAN TYPE-SAFE (TypeScript sangat suka gaya ini)
      if (created instanceof Timestamp) {
        startDate = created.toDate();
      } else if (typeof created === "string" || typeof created === "number") {
        startDate = new Date(created);
      } else if (created instanceof Date) {
        startDate = created;
      } else if (
        typeof created === "object" &&
        created !== null &&
        "seconds" in created
      ) {
        // Fallback jika object kehilangan prototype Firestore-nya
        startDate = new Date((created as { seconds: number }).seconds * 1000);
      } else {
        startDate = new Date(String(created));
      }

      if (!isNaN(startDate.getTime())) {
        const today = new Date();
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        expectedDoses = Math.max(1, Math.min(diffDays, totalFase));
      }
    }

    const kepatuhan = Math.min(
      100,
      Math.round((diminumFase / expectedDoses) * 100),
    );

    // 2. Progres Kesembuhan Total (Intensif + Lanjutan)
    const targetIntensif = patient.totalIntensif || 56;
    const targetLanjutan = patient.totalLanjutan || 48;
    const targetTotal = targetIntensif + targetLanjutan; // Normalnya 104 dosis

    const diminumIntensif = patient.diminumIntensif || 0;
    const diminumLanjutan = patient.diminumLanjutan || 0;
    const diminumTotal = diminumIntensif + diminumLanjutan;

    const progres =
      targetTotal > 0 ? Math.round((diminumTotal / targetTotal) * 100) : 0;

    return { kepatuhan, progres, diminumTotal, targetTotal };
  }, [patient]);

  // 🔹 Mencegah background body di-scroll saat modal terbuka
  useEffect(() => {
    if (selectedLog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedLog]);

  useEffect(() => {
    let isMounted = true;

    const fetchFullData = async () => {
      try {
        const pRef = doc(db, "users", id as string);
        const jRef = collection(db, `users/${id}/jadwal_obat`);

        const [pDoc, jSnap] = await Promise.all([getDoc(pRef), getDocs(jRef)]);

        if (isMounted) {
          if (pDoc.exists()) setPatient(pDoc.data() as PatientProfile);

          const jData = jSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              // Ambil ai_confidence_score dari Flutter, kalau tidak ada pakai skor_ai dari Seeder kita
              skor_ai: data.ai_confidence_score ?? data.skor_ai ?? 0,
            } as IngestionLog;
          });
          setLogs(jData.sort((a, b) => b.tanggal.localeCompare(a.tanggal)));
        }
      } catch (e) {
        if (isMounted) console.error(e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFullData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const filteredLogs = React.useMemo(() => {
    const todayStr = new Date().toLocaleDateString("en-CA");

    return logs.filter((log) => {
      const isPastOrToday = log.tanggal <= todayStr;
      if (filterWaktu === "Riwayat" && !isPastOrToday) return false;
      if (filterWaktu === "Mendatang" && isPastOrToday) return false;
      if (filterStatus !== "Semua" && log.status !== filterStatus) return false;
      return true;
    });
  }, [logs, filterWaktu, filterStatus]);

  const handleReviewBukti = async (log: IngestionLog) => {
    setSelectedLog(log);
    setIsLoadingFoto(true);
    setBuktiFoto(null);
    try {
      const bDoc = await getDoc(
        doc(db, `users/${id}/jadwal_obat/${log.id}/bukti`, "foto_verifikasi"),
      );
      if (bDoc.exists()) setBuktiFoto(bDoc.data() as BuktiFoto);
    } catch (e) {
      console.error("Gagal ambil foto:", e);
    } finally {
      setIsLoadingFoto(false);
    }
  };

  const handleAction = async (isApproved: boolean) => {
    if (!selectedLog || !patient) return;
    try {
      const logRef = doc(db, `users/${id}/jadwal_obat`, selectedLog.id);
      const userRef = doc(db, "users", id as string);

      if (isApproved) {
        // 1. Update ke Database Firebase (Jadwal)
        await updateDoc(logRef, {
          status: "Sudah diminum",
          verifikasi_ai: "Valid (Manual)",
        });

        // 2. 🔹 PERBAIKAN: Ikut naikkan hitungan obat diminum di dokumen users utama!
        const fieldToIncrement =
          patient.currentPhase === "Lanjutan"
            ? "diminumLanjutan"
            : "diminumIntensif";
        await updateDoc(userRef, { [fieldToIncrement]: increment(1) });

        // 3. Update State UI lokal secara instan (Untuk Tabel Riwayat)
        setLogs((prev) =>
          prev.map((l) =>
            l.id === selectedLog.id
              ? {
                  ...l,
                  status: "Sudah diminum",
                  verifikasi_ai: "Valid (Manual)",
                }
              : l,
          ),
        );

        // 4. 🔹 PERBAIKAN: Update State UI lokal (Untuk Persentase Kepatuhan Pasien)
        setPatient((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [fieldToIncrement]:
              ((prev[fieldToIncrement as keyof PatientProfile] as number) ||
                0) + 1,
          };
        });
      } else {
        // Jika Ditolak (sudah benar kodenya)
        await updateDoc(logRef, {
          status: "Terlewati",
          verifikasi_ai: "Ditolak (Manual)",
        });

        const fieldToDecrement =
          patient.currentPhase === "Lanjutan"
            ? "diminumLanjutan"
            : "diminumIntensif";
        await updateDoc(userRef, { [fieldToDecrement]: increment(-1) });

        setLogs((prev) =>
          prev.map((l) =>
            l.id === selectedLog.id
              ? { ...l, status: "Terlewati", verifikasi_ai: "Ditolak (Manual)" }
              : l,
          ),
        );

        setPatient((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [fieldToDecrement]: Math.max(
              0,
              ((prev[fieldToDecrement as keyof PatientProfile] as number) ||
                0) - 1,
            ),
          };
        });
      }

      // Tutup modal popup
      setSelectedLog(null);
      alert("Verifikasi berhasil diperbarui!");
    } catch (e) {
      alert("Error: " + e);
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-gray-500 font-medium">
        Memuat Rekam Medis...
      </div>
    );

  return (
    <div className="flex flex-col gap-6 relative">
      <button
        onClick={() => router.back()}
        className="text-gray-500 hover:text-[#2E7D32] flex items-center gap-2 text-sm font-medium w-fit transition-colors"
      >
        ← Kembali ke Data Pasien
      </button>

      <div className="space-y-6">
        {/* Patient Card */}
        {/* Patient Card */}
        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {patient?.fullName || "Tanpa Nama"}
            </h1>
            <p className="text-gray-500 font-medium">
              UID: {patient?.uniqueId || "-"}
            </p>
            <div className="pt-2">
              <span className="bg-green-100 text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Fase {patient?.currentPhase || "Intensif"}
              </span>
            </div>
          </div>

          {/* 🔹 STATISTIK GANDA: Progres Sembuh & Kepatuhan */}
          <div className="flex gap-6 sm:gap-12 border-t md:border-t-0 md:border-l border-gray-100 pt-5 md:pt-0 md:pl-10 w-full md:w-auto">
            {/* Progres Kesembuhan (Total Perjalanan) */}
            <div className="space-y-1.5 flex-1 md:flex-none">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Progres Sembuh
              </p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-black text-blue-600">
                  {progressStats.progres}%
                </p>
              </div>
              {/* Progress Bar Kecil */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${progressStats.progres}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium mt-1">
                {progressStats.diminumTotal} dari {progressStats.targetTotal}{" "}
                dosis selesai
              </p>
            </div>

            {/* Kepatuhan (Kedisiplinan) */}
            <div className="space-y-1.5 flex-1 md:flex-none text-right md:text-left">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Kepatuhan (Fase Ini)
              </p>
              <div className="flex items-end justify-end md:justify-start gap-2">
                <p className="text-4xl font-black text-[#2E7D32]">
                  {progressStats.kepatuhan}%
                </p>
              </div>
              {/* Progress Bar Kecil */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 flex justify-end md:justify-start">
                <div
                  className="bg-[#2E7D32] h-1.5 rounded-full"
                  style={{ width: `${progressStats.kepatuhan}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium mt-1">
                Kedisiplinan pasien
              </p>
            </div>
          </div>
        </div>
        {/* Table Riwayat */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-gray-800">
              Riwayat Pengobatan Harian
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={filterWaktu}
                onChange={(e) => setFilterWaktu(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 block px-3 py-2 cursor-pointer shadow-sm"
              >
                <option value="Riwayat">Hingga Hari Ini</option>
                <option value="Mendatang">Jadwal Mendatang</option>
                <option value="Semua">Semua Waktu</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 block px-3 py-2 cursor-pointer shadow-sm"
              >
                <option value="Semua">Semua Status</option>
                <option value="Sudah diminum">Sudah Diminum</option>
                <option value="Terlewati">Terlewati / Mangkir</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Fase</th>
                  <th className="px-6 py-4">Obat</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">AI Scan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      <p className="font-medium text-gray-500">
                        Data tidak ditemukan
                      </p>
                      <p className="text-xs mt-1">
                        Coba sesuaikan filter waktu atau status di atas.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5 font-bold text-gray-900">
                        {log.tanggal}
                      </td>
                      <td className="px-6 py-5 text-gray-500">
                        {log.waktu_minum || "-"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${log.fase?.includes("Intensif") ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}
                        >
                          {log.fase || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-700 text-xs font-medium">
                        {log.nama_obat}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            log.status === "Sudah diminum"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${
                            log.verifikasi_ai === "Valid" ||
                            log.verifikasi_ai === "Valid (Manual)"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-orange-50 text-orange-700 border border-orange-100"
                          }`}
                        >
                          {log.verifikasi_ai === "Butuh Review" && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                          )}
                          {log.verifikasi_ai || "Butuh Review"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleReviewBukti(log)}
                          className="px-4 py-2 bg-white border border-gray-200 text-[#2E7D32] font-bold text-xs rounded-xl hover:bg-green-50 hover:border-green-200 transition-all shadow-sm"
                        >
                          Review Bukti
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 💥 MODAL POP-UP (Hanya muncul jika ada selectedLog) */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* 🔹 PERBAIKAN: Hilangkan backdrop-blur untuk mengatasi lag */}
          <div
            className="absolute inset-0 bg-gray-900/80 transition-opacity"
            onClick={() => setSelectedLog(null)}
          ></div>

          <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-green-50/50 border-b border-green-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Review Bukti vDOT
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedLog.tanggal} • Pukul {selectedLog.waktu_minum}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                  Detail Laporan Konsumsi
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Resep Obat
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {selectedLog.nama_obat}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Status Validasi
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {selectedLog.status}
                    </p>
                  </div>
                  <div className="col-span-2 bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Catatan Pasien / PMO
                    </p>
                    <p className="text-sm text-gray-600 mt-1 italic">
                      {selectedLog.status === "Terlewati"
                        ? '"Lupa bawa obat saat sedang dinas ke luar kota."'
                        : "Tidak ada catatan."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 items-start">
                <span className="text-2xl mt-0.5">🤖</span>
                <div>
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">
                    Analisis Kecerdasan Buatan
                  </p>
                  <p className="text-sm text-orange-700 font-medium leading-relaxed">
                    Confidence Score:{" "}
                    <span className="font-bold">
                      {Math.round((selectedLog.skor_ai || 0) * 100)}%
                    </span>
                    . Sistem mendeteksi kemungkinan anomali (
                    {selectedLog.verifikasi_ai || "Butuh Review"}). Mohon
                    lakukan pengecekan visual manual.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Bukti Visual Pasien
                </p>

                {isLoadingFoto ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-8 w-8 text-[#2E7D32]"
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
                    <p className="text-sm text-gray-500 font-medium">
                      Menjemput dokumen foto dari server...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 relative group shadow-sm">
                        {/* 🔹 IMPLEMENTASI FUNGSI PEMBERSIH GAMBAR */}
                        <img
                          src={sanitizeBase64(buktiFoto?.obat)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          alt="Obat"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                          <p className="text-white text-sm font-bold">
                            Foto Obat di Tangan
                          </p>
                        </div>
                      </div>
                      <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 relative group shadow-sm">
                        {/* 🔹 IMPLEMENTASI FUNGSI PEMBERSIH GAMBAR */}
                        <img
                          src={sanitizeBase64(buktiFoto?.mulut_kosong)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          alt="Mulut"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                          <p className="text-white text-sm font-bold">
                            Mulut Terbuka (Pasca Minum)
                          </p>
                        </div>
                      </div>
                    </div>

                    {buktiFoto?.proses_minum &&
                      buktiFoto.proses_minum.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Rekaman Proses Menelan (Burst)
                          </p>
                          <div className="flex overflow-x-auto gap-3 pb-3 snap-x cursor-grab active:cursor-grabbing">
                            {buktiFoto.proses_minum.map((b64, index) => (
                              <div
                                key={index}
                                className="aspect-[3/4] w-28 shrink-0 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 relative group shadow-sm snap-start"
                              >
                                {/* 🔹 IMPLEMENTASI FUNGSI PEMBERSIH GAMBAR */}
                                <img
                                  src={sanitizeBase64(b64)}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  alt={`Frame ${index + 1}`}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5">
                                  <p className="text-white text-[9px] font-bold text-center">
                                    Frame {index + 1}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
              <button
                onClick={() => handleAction(false)}
                className="py-3.5 px-4 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 hover:border-red-300 transition-colors flex justify-center items-center gap-2"
              >
                <span>✕</span> Tolak (Indikasi Mangkir)
              </button>
              <button
                onClick={() => handleAction(true)}
                className="py-3.5 px-4 rounded-xl bg-[#2E7D32] text-white font-bold hover:bg-green-800 shadow-[0_4px_14px_0_rgba(46,125,50,0.39)] hover:shadow-[0_6px_20px_rgba(46,125,50,0.23)] transition-all flex justify-center items-center gap-2"
              >
                <span>✓</span> Konfirmasi Sesuai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
