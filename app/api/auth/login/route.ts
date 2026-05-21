import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Memanggil API ini berarti Firebase Auth di client-side sudah berhasil.
    // Kita buatkan tiket masuknya (cookie) untuk Next.js Middleware.
    const cookieStore = await cookies();

    cookieStore.set({
      name: "tb_care_session",
      value: "authenticated_via_firebase", // Penanda sukses
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // Sesi berlaku 24 jam
    });

    return NextResponse.json({
      success: true,
      message: "Sesi berhasil dibuat",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal membuat sesi" },
      { status: 500 },
    );
  }
}
