// apps/frontend/src/app/api/predictions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { fetchPredictions } from "@services/predictionsService";
import PredictionController from "@bcontrollers/predictionController";

const predictionController = new PredictionController();

// Placeholder for the actual visitor tracking logic
// In a real application, this would interact with a database or cache
// to store and retrieve visitor visit counts.
async function checkVisitorAccess(visitorId: string, resource: string): Promise<{ allowed: boolean; message: string; upgradeRequired?: boolean; visitsRemaining?: number }> {
  // Mock visitor data for demonstration
  const visitorData: { [key: string]: { visits: number } } = {
    'visitor123': { visits: 3 },
    'visitor456': { visits: 5 },
    'anonymous': { visits: 0 }
  };

  const MAX_GUEST_VISITS = 4;
  const MAX_USER_VISITS = 10; // Example for regular users

  const currentVisitor = visitorData[visitorId] || { visits: 0 };
  currentVisitor.visits++; // Increment visit count

  // Simulate updating visitor data (e.g., in a database)
  visitorData[visitorId] = currentVisitor;

  if (resource === 'predictions') {
    if (visitorId === 'anonymous') {
      if (currentVisitor.visits <= MAX_GUEST_VISITS) {
        return {
          allowed: true,
          message: `Welcome! You have ${MAX_GUEST_VISITS - currentVisitor.visits} visits remaining.`,
          visitsRemaining: MAX_GUEST_VISITS - currentVisitor.visits
        };
      } else {
        return {
          allowed: false,
          message: 'Guest access limit reached. Please upgrade or log in for full access.',
          upgradeRequired: true,
          visitsRemaining: 0
        };
      }
    } else { // Assume logged-in users or identified visitors
      if (currentVisitor.visits <= MAX_USER_VISITS) {
        return {
          allowed: true,
          message: `Welcome back! You have ${MAX_USER_VISITS - currentVisitor.visits} visits remaining.`,
          visitsRemaining: MAX_USER_VISITS - currentVisitor.visits
        };
      } else {
        return {
          allowed: false,
          message: 'You have reached your visit limit. Consider upgrading your plan.',
          upgradeRequired: true,
          visitsRemaining: 0
        };
      }
    }
  }

  // Default access if resource is not specified or handled
  return { allowed: true, message: 'Access granted.' };
}


export async function GET(request: NextRequest) {
  try {
    // Enhanced bot detection and rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const visitorId = request.headers.get('x-visitor-id') || 'anonymous';

    // Import security utilities
    const SecurityUtils = (await import('@/../../packages/shared/src/libs/utils/securityUtils')).default;
    const EthicalSecurityManager = (await import('@/../../packages/shared/src/libs/utils/ethicalSecurityManager')).default;

    // Advanced rate limiting for this endpoint
    const rateCheck = EthicalSecurityManager.checkAdvancedRateLimit(
      clientIP,
      'predictions_access'
    );

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests - please slow down' },
        { status: 429 }
      );
    }

    // Bot pattern detection
    if (userAgent.includes('bot') || userAgent.includes('spider') || userAgent.includes('crawler')) {
      SecurityUtils.logSecurityEvent('bot_access_attempt', {
        ip: clientIP,
        userAgent,
        endpoint: '/api/predictions'
      });

      // Return limited data for bots
      return NextResponse.json({
        message: 'For full access, please use our official app',
        preview: ['Limited preview data available']
      }, { status: 200 });
    }

    // Check visitor access level (server-side visitor tracking)
    const visitorData = await checkVisitorAccess(visitorId, 'predictions');

    if (!visitorData.allowed) {
      return NextResponse.json({
        error: 'Access limit reached',
        message: visitorData.message,
        upgradeRequired: visitorData.upgradeRequired,
        visitsRemaining: visitorData.visitsRemaining
      }, { status: 403 });
    }

    // Get external predictions (scraped)
    const externalPredictions = await fetchPredictions();

    // Get internal predictions (MongoDB)
    const internalPredictions = await predictionController.getAllPredictions();

    // Merge both
    const allPredictions = [
      ...internalPredictions.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        content: p.content,
        source: "internal",
        sport: p.sport,
        confidence: `${p.confidence}%`,
        status: p.status,
        match: p.matchDetails ? `${p.matchDetails.home} vs ${p.matchDetails.away}` : "TBD",
      })),
      ...externalPredictions.map((p: any, index: number) => ({
        id: `ext_${index}`,
        title: p.title,
        content: p.content || "External prediction analysis",
        source: "external",
        sport: p.sport || "Football",
        confidence: p.confidence || "70%",
        status: "active",
        match: "External Match",
      })),
    ];

    return NextResponse.json(allPredictions, { status: 200 });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPrediction = await predictionController.createPrediction(body);
    return NextResponse.json(newPrediction, { status: 201 });
  } catch (error: any) {
    console.error("Error creating prediction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create prediction" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }

    const updatedPrediction = await predictionController.updatePrediction(id, data);
    return NextResponse.json(updatedPrediction, { status: 200 });
  } catch (error: any) {
    console.error("Error updating prediction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update prediction" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for deletion" },
        { status: 400 }
      );
    }

    await predictionController.deletePrediction(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting prediction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete prediction" },
      { status: 400 }
    );
  }
}