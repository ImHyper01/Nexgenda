// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { identifier, password } = await request.json();

  // 1) Stuur credentials door naar Strapi
  const strapiRes = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    }
  );

  if (!strapiRes.ok) {
    const err = await strapiRes.json();
    return NextResponse.json(
      { message: "Login mislukt", details: err },
      { status: strapiRes.status }
    );
  }

  const { jwt, user } = await strapiRes.json();

  // 2) Zet de JWT in een httpOnly-cookie
  const response = NextResponse.json({ user });
  response.cookies.set("jwt", jwt, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return response;
}
