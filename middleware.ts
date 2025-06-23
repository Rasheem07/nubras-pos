import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const accesToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");
  
  if (!refreshToken) {
    return NextResponse.redirect(
      `http://localhost:3001/auth/signin?redirectURL=${encodeURIComponent(req.url)}`
    );
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };