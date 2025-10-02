// apps/frontend/src/app/api/predictions/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://flashstudy-ri0g.onrender.com";

// Visitor tracking in-memory (consider Redis/Database for production)
const visitorData: Map<string, { visits: number; lastVisit: number }> = new Map();

const MAX_GUEST_VISITS = 4;
const MAX_USER_VISITS = 10;
const VISIT_RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours

async function checkVisitorAccess(
  visitorId: string, 
  resource: string
): Promise<{ 
  allowed: boolean; 
  message: string; 
  upgradeRequired?: boolean; 
  visitsRemaining?: number 
}> {
  const now = Date.now();
  const visitor = visitorData.get(visitorId);

  // Reset visits if 24 hours have passed
  if (visitor && now - visitor.lastVisit > VISIT_RESET_TIME) {
    visitorData.delete(visitorId);
  }

  const currentVisitor = visitorData.get(visitorId) || { visits: 0, lastVisit: now };
  currentVisitor.visits++;
  currentVisitor.lastVisit = now;
  visitorData.set(visitorId, currentVisitor);

  if (resource === 'predictions') {
    const maxVisits = visitorId === 'anonymous' ? MAX_GUEST_VISITS : MAX_USER_VISITS;
    
    if (currentVisitor.visits <= maxVisits) {
      return {
        allowed: true,
        message: `Welcome! You have ${maxVisits - currentVisitor.visits} visits remaining.`,
        visitsRemaining: maxVisits - currentVisitor.visits
      };
    } else {
      return {
        allowed: false,
        message: visitorId === 'anonymous' 
          ? 'Guest access limit reached. Please upgrade or log in for full access.'
          : 'You have reached your visit limit. Consider upgrading your plan.',
        upgradeRequired: true,
        visitsRemaining: 0
      };
    }
  }

  return { allowed: true, message: 'Access granted.' };
}

// Simple bot detection
function detectBot(userAgent: string): boolean {
  const botPatterns = ['bot', 'spider', 'crawler', 'scraper'];
  return botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern));
}

// Simple rate limiting (consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true };
  }

  if (limit.count >= RATE_LIMIT) {
    return { 
      allowed: false, 
      message: 'Too many requests - please slow down' 
    };
  }

  limit.count++;
  return { allowed: true };
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const visitorId = request.headers.get('x-visitor-id') || 'anonymous';

    // Rate limiting
    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.message },
        { status: 429 }
      );
    }

    // Bot detection
    if (detectBot(userAgent)) {
      console.log('Bot detected:', { ip: clientIP, userAgent });
      return NextResponse.json({
        message: 'For full access, please use our official app',
        preview: ['Limited preview data available']
      }, { status: 200 });
    }

    // Check visitor access
    const visitorAccess = await checkVisitorAccess(visitorId, 'predictions');
    if (!visitorAccess.allowed) {
      return NextResponse.json({
        error: 'Access limit reached',
        message: visitorAccess.message,
        upgradeRequired: visitorAccess.upgradeRequired,
        visitsRemaining: visitorAccess.visitsRemaining
      }, { status: 403 });
    }

    // Fetch predictions from backend
    const response = await fetch(`${BACKEND_URL}/api/predictions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const predictions = await response.json();

    return NextResponse.json(predictions, { 
      status: 200,
      headers: {
        'X-Visits-Remaining': visitorAccess.visitsRemaining?.toString() || '0'
      }
    });

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
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const newPrediction = await response.json();
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

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/predictions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const updatedPrediction = await response.json();
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

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/predictions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error("Error deleting prediction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete prediction" },
      { status: 400 }
    );
  }
}