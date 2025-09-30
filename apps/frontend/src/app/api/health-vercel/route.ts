import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check backend connection
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    let backendStatus = "disconnected";

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/api/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        backendStatus = response.ok ? "connected" : "error";
      } catch {
        backendStatus = "error";
      }
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      platform: "vercel",
      backend: {
        url: backendUrl,
        status: backendStatus,
      },
      services: {
        nextAuth: !!process.env.NEXTAUTH_SECRET,
        database: !!(process.env.MONGODB_URI || process.env.DATABASE_URL),
        googleAuth: !!(
          process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
