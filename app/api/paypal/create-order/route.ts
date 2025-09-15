import { NextResponse } from "next/server";

export async function POST() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const secret = process.env.PAYPAL_SECRET!;

    // 1. Get access token
    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
    const tokenRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenRes.json();

    // 2. Create order
    const orderRes = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "2.99",
              },
            },
          ],
        }),
      }
    );

    const orderData = await orderRes.json();
    return NextResponse.json(orderData);
  } catch (err) {
    console.error("PayPal API error:", err);
    return NextResponse.json(
      { error: "PayPal order creation failed" },
      { status: 500 }
    );
  }
}