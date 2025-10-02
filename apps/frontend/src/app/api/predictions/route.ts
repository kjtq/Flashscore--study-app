//app/api/predictions/route.ts
import { NextResponse } from "next/server";
import { generatePredictions } from "@/app/actions/predictions";

export async function POST(req: Request) {
  try {
    const { mode } = await req.json();
    
    if (!["scraping", "ml", "hybrid"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Use 'scraping', 'ml', or 'hybrid'" },
        { status: 400 }
      );
    }

    const result = await generatePredictions(mode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate predictions" },
      { status: 500 }
    );
  }
}