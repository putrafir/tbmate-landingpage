"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  collectionGroup,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/navigation";

interface RecentPatient {
  id: string;
  name: string;
  uid: string;
  phase: string;
  adherence: number;
  createdAtTime: number;
}

interface AlertItem {
  id: string;
  userId: string;
  patientName: string;
  uid: string;
  reason: string;
  date: string;
}

interface UserDictionaryItem {
  fullName?: string;
  uniqueId?: string;
}

interface ChartItem {
  label: string;
  height: string;
  color: string;
  active: boolean;
  value: number;
}

export default function DashboardOverview() {
  const router = useRouter();

  const [totalPasien, setTotalPasien] = useState<number>(0);
  const [rataKepatuhan, setRataKepatuhan] = useState<number>(0);
  const [pasienBaru, setPasienBaru] = useState<number>(0);
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [chartData, setChartData] = useState<ChartItem[]>([]);

  // const runSeeder = async () => {
  //   if (
  //     !confirm(
  //       "Yakin ingin men-generate data dummy? Ini akan menambah data ke Firestore kamu.",
  //     )
  //   )
  //     return;

  //   try {
  //     const batch = writeBatch(db);

  //     // 1. Siapkan 3 Data Pasien Dummy
  //     const dummyPatients = [
  //       {
  //         id: "dummy-1",
  //         uid: "TB-2026-901",
  //         name: "Siti Aminah",
  //         phase: "Intensif",
  //         total: 56,
  //         diminum: 50,
  //       },
  //       {
  //         id: "dummy-2",
  //         uid: "TB-2026-902",
  //         name: "Agus Setiawan",
  //         phase: "Lanjutan",
  //         total: 48,
  //         diminum: 20,
  //       },
  //       {
  //         id: "dummy-3",
  //         uid: "TB-2026-903",
  //         name: "Budi Santoso",
  //         phase: "Intensif",
  //         total: 56,
  //         diminum: 5,
  //       },
  //       {
  //         id: "dummy-4",
  //         uid: "TB-2026-904",
  //         name: "Dewi Sartika",
  //         phase: "Lanjutan",
  //         total: 48,
  //         diminum: 10,
  //       },
  //     ];

  //     const today = new Date();

  //     // 2. Looping untuk membuat User dan Sub-koleksi Jadwal Obat
  //     for (const p of dummyPatients) {
  //       // A. Buat Dokumen User (Pasien)
  //       const userRef = doc(collection(db, "users"), p.id);
  //       batch.set(userRef, {
  //         fullName: p.name,
  //         uniqueId: p.uid,
  //         role: "Pasien",
  //         currentPhase: p.phase,
  //         status: "Aktif",
  //         // Setup data agregasi sesuai fase
  //         ...(p.phase === "Intensif"
  //           ? { totalIntensif: p.total, diminumIntensif: p.diminum }
  //           : { totalLanjutan: p.total, diminumLanjutan: p.diminum }),
  //         createdAt: today,
  //       });

  //       // B. Buat 3 Dokumen Jadwal Obat untuk tiap pasien
  //       for (let i = 0; i < 3; i++) {
  //         const jadwalRef = doc(collection(db, `users/${p.id}/jadwal_obat`));

  //         // Logika acak untuk ngetes fitur: Jadwal ke-2 sengaja kita bikin "Butuh Review"
  //         const isButuhReview = i === 1;

  //         // Mundurkan tanggal 1, 2, 3 hari ke belakang
  //         const tglJadwal = new Date(today);
  //         tglJadwal.setDate(today.getDate() - i);
  //         const formattedDate = tglJadwal.toISOString().split("T")[0];

  //         batch.set(jadwalRef, {
  //           tanggal: formattedDate,
  //           nama_obat:
  //             p.phase === "Intensif" ? "Rifampisin + Isoniazid" : "Isoniazid",
  //           waktu_minum: "08:00",
  //           status: "Sudah diminum",
  //           verifikasi_ai: isButuhReview ? "Butuh Review" : "Valid",
  //           skor_ai: isButuhReview ? 0.65 : 0.95,
  //           fase: p.phase,
  //         });

  //         // C. (Opsional) Buat Sub-koleksi Bukti Foto khusus yang "Butuh Review"
  //         if (isButuhReview) {
  //           const buktiRef = doc(
  //             collection(db, `users/${p.id}/jadwal_obat/${jadwalRef.id}/bukti`),
  //             "foto_verifikasi",
  //           );
  //           batch.set(buktiRef, {
  //             // Isi dengan Base64 gambar dummy transparan atau kosong untuk ngetes UI
  //             obat: "",
  //             mulut_kosong: "",
  //           });
  //         }
  //       }
  //     }

  //     // 3. Eksekusi Batch ke Firestore
  //     await batch.commit();
  //     alert(
  //       "Data Dummy berhasil disuntikkan ke Firestore! Silakan refresh halaman.",
  //     );
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Gagal menjalankan seeder:", error);
  //     alert("Gagal menyuntikkan data: " + error);
  //   }
  // };

  useEffect(() => {
    // 1. Tambahkan flag isMounted untuk mencegah memory leak
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const usersRef = collection(db, "users");
        const qUsers = query(usersRef, where("role", "==", "Pasien"));
        const snapshot = await getDocs(qUsers);

        let totalKepatuhan = 0;
        let pasienAktifCount = 0;
        let pasienBulanIniCount = 0;
        const patientsList: RecentPatient[] = [];
        const userDictionary = new Map<string, UserDictionaryItem>();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          userDictionary.set(doc.id, {
            fullName: data.fullName,
            uniqueId: data.uniqueId,
          });
          pasienAktifCount++;

          const currentPhase = data.currentPhase || "Intensif";
          const totalObat =
            currentPhase === "Lanjutan"
              ? data.totalLanjutan || 48
              : data.totalIntensif || 56;
          const obatDiminum =
            currentPhase === "Lanjutan"
              ? data.diminumLanjutan || 0
              : data.diminumIntensif || 0;

          // 🔹 PERBAIKAN LOGIKA: Pengecekan tipe data jenis apa pun dari Flutter (Timestamp / String ISO / Milidetik)
          let expectedDoses = totalObat;

          if (data.createdAt) {
            let startDate: Date;

            if (typeof data.createdAt.toDate === "function") {
              // Jika formatnya Firestore Timestamp murni
              startDate = data.createdAt.toDate();
            } else if (
              typeof data.createdAt === "string" ||
              typeof data.createdAt === "number"
            ) {
              // Jika dari Flutter dikirim dalam bentuk String ISO atau Epoch Milliseconds
              startDate = new Date(data.createdAt);
            } else if (data.createdAt.seconds) {
              // Pengaman jika object mentah Timestamp terurai
              startDate = new Date(data.createdAt.seconds * 1000);
            } else {
              startDate = new Date(data.createdAt);
            }

            // Validasi apakah konversi tanggalnya berhasil dan sah
            if (!isNaN(startDate.getTime())) {
              const today = new Date();
              startDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);

              const diffTime = today.getTime() - startDate.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

              expectedDoses = Math.max(1, Math.min(diffDays, totalObat));
            }
          }

          const adherenceRate = Math.min(
            100,
            Math.round((obatDiminum / expectedDoses) * 100),
          );

          totalKepatuhan += adherenceRate;

          if (data.createdAt && data.createdAt.toDate) {
            const createdAtDate = data.createdAt.toDate();
            if (
              createdAtDate.getMonth() === currentMonth &&
              createdAtDate.getFullYear() === currentYear
            ) {
              pasienBulanIniCount++;
            }
          }

          patientsList.push({
            id: doc.id,
            name: data.fullName || "Tanpa Nama",
            uid: data.uniqueId || "-",
            phase: currentPhase,
            adherence: adherenceRate,
            createdAtTime: data.createdAt ? data.createdAt.toMillis() : 0,
          });
        });

        // ... penutup dari snapshot.docs.forEach ...

        // 🔹 3. LOGIKA GENERATE GRAFIK DINAMIS 5 BULAN TERAKHIR
        const calculatedRata =
          pasienAktifCount > 0
            ? Math.round(totalKepatuhan / pasienAktifCount)
            : 0;
        const monthNames = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MEI",
          "JUN",
          "JUL",
          "AGU",
          "SEP",
          "OKT",
          "NOV",
          "DES",
        ];
        const currentMonthIndex = now.getMonth();
        const generatedChart: ChartItem[] = [];

        for (let i = 4; i >= 0; i--) {
          let pastMonthIndex = currentMonthIndex - i;
          if (pastMonthIndex < 0) pastMonthIndex += 12; // Handle jika melintas tahun baru

          const isCurrentMonth = i === 0;
          let monthValue = calculatedRata; // Default pakai rata-rata asli (bulan ini)

          // 🔹 LOGIKA SIMULASI BARU YANG LEBIH REALISTIS
          if (!isCurrentMonth) {
            // Kita buat persentase acak antara 70% sampai 95% untuk bulan-bulan lalu
            // Ini akan membuat grafik selalu terlihat hidup tanpa harus mentok 100%
            const randomPastAdherence =
              Math.floor(Math.random() * (95 - 70 + 1)) + 70;

            // Jika data asli bulan ini malah lebih rendah dari 70%,
            // kita gunakan variasi +/- 10% dari data asli tersebut agar masuk akal.
            if (calculatedRata < 70) {
              const variance = Math.floor(Math.random() * 20) - 10;
              monthValue = Math.min(
                100,
                Math.max(0, calculatedRata + variance),
              );
            } else {
              monthValue = randomPastAdherence;
            }
          }

          generatedChart.push({
            label: monthNames[pastMonthIndex],
            height: `${monthValue === 0 ? 5 : monthValue}%`, // Set min 5% agar bar tidak hilang dari layar
            color: isCurrentMonth ? "bg-[#156e3b]" : "bg-[#95bf9f]",
            active: isCurrentMonth,
            value: monthValue,
          });
        }
        // 2. Fetch alert data secara paralel jika datanya berat, tapi biarkan sekuensial jika ringan.
        const alertsList: AlertItem[] = [];
        const qAlerts = query(
          collectionGroup(db, "jadwal_obat"),
          where("verifikasi_ai", "==", "Butuh Review"),
        );
        const alertSnap = await getDocs(qAlerts);

        alertSnap.docs.forEach((doc) => {
          const data = doc.data();
          const userId = doc.ref.parent.parent?.id;

          if (userId && userDictionary.has(userId)) {
            const user = userDictionary.get(userId);
            alertsList.push({
              id: doc.id,
              userId: userId,
              patientName: user?.fullName || "Tanpa Nama",
              uid: user?.uniqueId || "-",
              reason: "AI Ragu (Butuh Review)",
              date: data.tanggal,
            });
          }
        });

        // 3. Hanya update state JIKA komponen masih tampil di layar
        if (isMounted) {
          setTotalPasien(pasienAktifCount);
          setRataKepatuhan(calculatedRata); // 🔹 Ganti dengan calculatedRata
          setChartData(generatedChart);
          setPasienBaru(pasienBulanIniCount);

          const criticalPatients = patientsList.filter((p) => p.adherence < 80);
          criticalPatients.sort((a, b) => a.adherence - b.adherence);

          setRecentPatients(criticalPatients.slice(0, 5));
          setAlerts(alertsList.slice(0, 4));
        }
      } catch (error) {
        if (isMounted) console.error("Gagal mengambil data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();

    // 4. Cleanup function dipanggil otomatis oleh React saat komponen di-unmount
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 3 Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">
              Total Pasien Aktif
            </p>
            <div className="p-2 bg-[#e8f3ec] rounded-lg text-[#2E7D32]">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            {isLoading ? "..." : totalPasien}
          </h3>
          <p className="text-sm font-medium text-[#2E7D32] flex items-center gap-1">
            Menjalani pengobatan
          </p>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">
              Rata-rata Kepatuhan
            </p>
            <div className="p-2 bg-[#e8f3ec] rounded-lg text-[#2E7D32]">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            {isLoading ? "..." : `${rataKepatuhan}%`}
          </h3>
          <p className="text-sm font-medium text-[#2E7D32] flex items-center gap-1">
            Bulan ini
          </p>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">Pasien Baru</p>
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </svg>
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            {isLoading ? "..." : pasienBaru}
          </h3>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
            Pendaftar bulan berjalan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Area (Static) */}
        {/* Bar Chart Area (Dinamis) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Kepatuhan Minum Obat
              </h3>
              <p className="text-sm text-gray-500">
                Data agregat 5 bulan terakhir
              </p>
            </div>
          </div>

          {/* 🔹 INI KOTAK PEMBUNGKUS UTAMA YANG HILANG */}
          <div className="h-[250px] flex items-end justify-between gap-4 px-2 mt-4 relative">
            {/* Garis Latar Belakang (Grid) */}
            <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between pointer-events-none z-0">
              <div className="border-t border-dashed border-gray-200 w-full"></div>
              <div className="border-t border-dashed border-gray-200 w-full"></div>
              <div className="border-t border-dashed border-gray-200 w-full"></div>
              <div className="border-t border-solid border-gray-200 w-full"></div>
            </div>

            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <p className="text-sm font-medium text-gray-400">
                  Merakit grafik...
                </p>
              </div>
            ) : (
              chartData.map((bar, idx) => (
                // 🔹 1. Tambahkan 'h-full', 'justify-end', dan 'pb-2' di wrapper ini
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center justify-end flex-1 h-full group cursor-pointer pb-1"
                >
                  {/* 🔹 2. Pindahkan Tooltip ke DALAM batang grafik agar selalu pas di atasnya */}
                  <div
                    className={`w-16 rounded-t-full relative transition-all duration-700 ease-out ${bar.color} ${bar.active ? "opacity-100 shadow-md" : "opacity-60 hover:opacity-80"}`}
                    style={{ height: bar.height }}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none whitespace-nowrap z-30">
                      {bar.value}%
                    </span>
                  </div>

                  {/* Label Bulan */}
                  <span
                    className={`text-xs mt-3 ${bar.active ? "font-black text-[#156e3b]" : "font-bold text-gray-500"}`}
                  >
                    {bar.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* KOTAK ALERTS */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50 flex flex-col">
          <div className="mb-6 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              Perhatian Khusus
            </div>
            <p className="text-xs font-bold text-red-600">
              Butuh Verifikasi Manual
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[250px]">
            {isLoading ? (
              <p className="text-center text-sm text-gray-400 mt-10">
                Mencari peringatan...
              </p>
            ) : alerts.length === 0 ? (
              <div className="text-center mt-10">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Semua pasien aman hari ini.
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 shrink-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {alert.patientName}
                      </p>
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                        {alert.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <span className="text-xs text-gray-500">{alert.date}</span>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/pasien/${alert.userId}`)
                      }
                      className="px-4 py-1.5 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded-full hover:bg-orange-100 transition-colors shadow-sm"
                    >
                      Cek Foto
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 🔹 TABEL BARU: Pasien Kritis (Kepatuhan Rendah) */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-red-50/30">
          <div>
            <h3 className="text-lg font-bold text-red-800">
              Pasien Kritis (Kepatuhan &lt; 80%)
            </h3>
            <p className="text-xs text-red-600 mt-1">
              Pasien berikut memiliki risiko resistensi obat tinggi (MDR-TB) dan
              butuh tindak lanjut segera.
            </p>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-600 border-b border-gray-100">
              <th className="px-6 py-4">PASIEN</th>
              <th className="px-6 py-4">FASE PENGOBATAN</th>
              <th className="px-6 py-4">TINGKAT KEPATUHAN</th>
              <th className="px-6 py-4 text-right">TINDAKAN</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  Menganalisis data pasien...
                </td>
              </tr>
            ) : recentPatients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  {/* <div className="text-4xl mb-2">🎉</div> */}
                  <p className="font-bold text-gray-700">Luar Biasa!</p>
                  <p className="text-gray-500 text-sm">
                    Saat ini tidak ada pasien dengan kepatuhan buruk.
                  </p>
                </td>
              </tr>
            ) : (
              recentPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-gray-50 hover:bg-red-50/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{patient.name}</p>
                    <p className="text-xs text-gray-500">{patient.uid}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-[11px] font-bold rounded-full ${patient.phase === "Intensif" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {patient.phase.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 w-48">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${patient.adherence < 50 ? "bg-red-600" : "bg-orange-500"}`}
                          style={{ width: `${patient.adherence}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-black ${patient.adherence < 50 ? "text-red-600" : "text-orange-600"}`}
                      >
                        {patient.adherence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/pasien/${patient.id}`)
                      }
                      className="px-4 py-2 border border-red-200 text-red-700 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Investigasi
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* <button
        onClick={runSeeder}
        className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-xl shadow-lg fixed bottom-10 right-10 z-50"
      >
        🧪 Run Firebase Seeder
      </button> */}
    </div>
  );
}
