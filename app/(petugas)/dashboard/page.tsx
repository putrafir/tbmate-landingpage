import React from "react";

export default function DashboardOverview() {
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
          <h3 className="text-4xl font-bold text-gray-900 mb-2">45</h3>
          <p className="text-sm font-medium text-[#2E7D32] flex items-center gap-1">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
            +4 Pasien hari ini
          </p>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">
              Tingkat Kesembuhan
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
          <h3 className="text-4xl font-bold text-gray-900 mb-2">85%</h3>
          <p className="text-sm font-medium text-[#2E7D32] flex items-center gap-1">
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
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Diatas target
          </p>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-gray-500">
              Pasien Baru Bulan Ini
            </p>
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
          <h3 className="text-4xl font-bold text-gray-900 mb-2">12</h3>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Mei 2026
          </p>
        </div>
      </div>

      {/* Middle Section: Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[20px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Kepatuhan Minum Obat
              </h3>
              <p className="text-sm text-gray-500">
                Rata-rata kepatuhan 30 hari terakhir
              </p>
            </div>
            <div className="flex bg-gray-100/80 p-1 rounded-full text-sm font-medium">
              <button className="px-4 py-1.5 bg-white text-gray-900 rounded-full shadow-sm">
                Monthly
              </button>
              <button className="px-4 py-1.5 text-gray-500">Annually</button>
              <button className="px-4 py-1.5 text-gray-500 border-l border-gray-200 ml-2 pl-4">
                Unduh Laporan
              </button>
            </div>
          </div>

          {/* Simulated Chart */}
          <div className="h-[250px] flex items-end justify-between gap-4 px-2 mt-4 relative">
            <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between pointer-events-none z-0">
              <div className="border-t border-dashed border-gray-200 w-full"></div>
              <div className="border-t border-dashed border-gray-200 w-full"></div>
              <div className="border-t border-dashed border-gray-200 w-full"></div>
              <div className="border-t border-dashed border-gray-200 w-full"></div>
              <div className="border-t border-solid border-gray-200 w-full"></div>
            </div>

            {/* Bars */}
            {[
              { label: "JAN", height: "30%", color: "bg-[#95bf9f]" },
              { label: "FEB", height: "60%", color: "bg-[#95bf9f]" },
              { label: "MAR", height: "45%", color: "bg-[#95bf9f]" },
              {
                label: "APR",
                height: "85%",
                color: "bg-[#156e3b]",
                active: true,
              },
              { label: "MAY", height: "55%", color: "bg-[#95bf9f]" },
              { label: "JUN", height: "65%", color: "bg-[#95bf9f]" },
            ].map((bar, idx) => (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center flex-1 group"
              >
                {bar.active && (
                  <div className="absolute -top-8 bg-[#156e3b] text-white text-xs font-bold px-2 py-1 rounded-full">
                    +17.8%
                  </div>
                )}
                <div
                  className={`w-16 rounded-t-full ${bar.color} ${bar.active ? "opacity-100" : "opacity-80"}`}
                  style={{ height: bar.height }}
                >
                  {bar.active && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-3"></div>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-500 mt-4">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50 flex flex-col">
          <div className="mb-6 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Perhatian Khusus
            </div>
            <p className="text-xs font-bold text-red-600 pl-7">
              Mangkir &gt; 2 Hari
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Budi Pratama
                  </p>
                  <p className="text-xs text-gray-500">UID: TB-2024-001</p>
                </div>
                <button className="px-4 py-2 bg-[#156e3b] text-white text-xs font-medium rounded-full flex items-center gap-1.5 hover:bg-green-800 transition-colors">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  Hubungi PMO
                </button>
              </div>
            ))}
          </div>

          <button className="w-full text-sm font-bold text-[#2E7D32] mt-6 pt-4 border-t border-gray-100">
            Lihat Semua Laporan Mangkir
          </button>
        </div>
      </div>

      {/* Data Terbaru Table */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Data Terbaru</h3>
          <button className="text-sm font-medium text-gray-600 flex items-center gap-2 hover:text-gray-900">
            Export XLSX
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-600 border-b border-gray-100">
              <th className="px-6 py-4">PASIEN</th>
              <th className="px-6 py-4">TIPE TB</th>
              <th className="px-6 py-4">KEPATUHAN</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-gray-50">
              <td className="px-6 py-4">
                <p className="font-bold text-gray-900">Ani Widjaya</p>
                <p className="text-xs text-gray-500">TB-2024-089</p>
              </td>
              <td className="px-6 py-4 font-medium text-gray-800">
                TB Paru BTA (+)
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#156e3b] h-1.5 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold">95%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-[#e8f3ec] text-[#2E7D32] text-[11px] font-bold rounded-full">
                  FASE INTENSIF
                </span>
              </td>
              <td className="px-6 py-4 text-center text-gray-400">⋮</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="px-6 py-4">
                <p className="font-bold text-gray-900">Rahmat Hidayat</p>
                <p className="text-xs text-gray-500">TB-2024-092</p>
              </td>
              <td className="px-6 py-4 font-medium text-gray-800">
                TB Extraparu
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#156e3b] h-1.5 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold">80%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">
                  FASE LANJUTAN
                </span>
              </td>
              <td className="px-6 py-4 text-center text-gray-400">⋮</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
