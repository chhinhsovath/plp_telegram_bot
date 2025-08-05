import { NextResponse } from "next/server";

// Completely disable authentication - allow all access
export function middleware(req: any) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};