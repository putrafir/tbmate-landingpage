import React from "react";

export default function DataPasienPage() {
  return (
    <div className="space-y-8">
      {/* Page Title & Add Button */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manajemen Data Pasien
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola dan pantau perkembangan pasien TB Anda secara komprehensif.
          </p>
        </div>
        <button className="bg-[#2E7D32] hover:bg-green-800 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm text-sm flex items-center gap-2">
          <span>+</span> Daftarkan Pasien Baru
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
        {/* Filters Area */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <button className="px-4 py-1.5 border border-[#2E7D32] text-[#2E7D32] text-sm font-medium rounded-full bg-white">
            Semua Fase
          </button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
            Fase Intensif
          </button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
            Fase Lanjutan
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <button className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-full">
            Status Aktif
          </button>
        </div>

        {/* Table Area */}
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
            {/* Row 1 */}
            <tr className="border-b border-gray-50">
              <td className="px-6 py-5">
                <p className="font-bold text-gray-900">Ani Widjaya</p>
                <p className="text-xs text-gray-500">TB-2024-089</p>
              </td>
              <td className="px-6 py-5">
                <span className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                  Fase Intensif
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3 w-40">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#2E7D32] h-1.5 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 w-8">
                    95%
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
                  <span className="text-gray-900 font-medium text-sm">
                    Aktif
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-right text-gray-400 pr-8 font-bold text-lg cursor-pointer">
                ⋮
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="border-b border-gray-50">
              <td className="px-6 py-5">
                <p className="font-bold text-gray-900">Rahmat Hidayat</p>
                <p className="text-xs text-gray-500">TB-2024-092</p>
              </td>
              <td className="px-6 py-5">
                <span className="px-3 py-1.5 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                  Fase Lanjutan
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3 w-40">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[#2E7D32] h-1.5 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 w-8">
                    80%
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
                  <span className="text-gray-900 font-medium text-sm">
                    Aktif
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-right text-gray-400 pr-8 font-bold text-lg cursor-pointer">
                ⋮
              </td>
            </tr>

            {/* Row 3 */}
            <tr className="border-b border-gray-50">
              <td className="px-6 py-5">
                <p className="font-bold text-gray-900">Siti Lestari</p>
                <p className="text-xs text-gray-500">TB-2024-045</p>
              </td>
              <td className="px-6 py-5">
                <span className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                  Selesai
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3 w-40">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 w-8">
                    100%
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600 font-medium text-sm">
                    Non-aktif
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-right text-gray-400 pr-8 font-bold text-lg cursor-pointer">
                ⋮
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
