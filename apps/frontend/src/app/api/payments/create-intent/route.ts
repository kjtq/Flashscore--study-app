
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, description } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0 || amount > 100000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Create payment intent with Stripe
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: currency.toLowerCase(),
        description: description || 'MagajiCo Payment',
        'metadata[source]': 'magajico-app'
      })
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: paymentIntent.error?.message || 'Payment intent creation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
