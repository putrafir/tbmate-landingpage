import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Cek apakah user sedang mencoba mengakses area dashboard
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // Cek apakah browser memiliki cookie sesi kita
  const hasSession = request.cookies.has("tb_care_session");

  // Jika mencoba masuk dashboard TAPI tidak punya sesi (belum login)
  if (isDashboardPage && !hasSession) {
    // Tendang kembali ke halaman login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika mencoba buka halaman login TAPI sudah punya sesi
  if (request.nextUrl.pathname === "/login" && hasSession) {
    // Arahkan langsung ke dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Tentukan rute mana saja yang mau diawasi oleh satpam middleware ini
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
