import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Panggil cookies secara asynchronous (aturan Next.js 15+)
    const cookieStore = await cookies();

    // Hapus cookie sesi kita
    cookieStore.delete("tb_care_session");

    return NextResponse.json({ success: true, message: "Berhasil logout" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memproses logout" },
      { status: 500 },
    );
  }
}
