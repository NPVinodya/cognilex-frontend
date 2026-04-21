import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    const merchant_id = body.merchant_id as string;
    const order_id = body.order_id as string; // This will be our Slot ID
    const payhere_amount = body.payhere_amount as string;
    const payhere_currency = body.payhere_currency as string;
    const status_code = body.status_code as string;
    const md5sig = body.md5sig as string;

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchant_secret) {
      console.error("PAYHERE_MERCHANT_SECRET is not defined");
      return new Response("Configuration Error", { status: 500 });
    }

    // Verify Hash (V4)
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchant_secret)
      .digest("hex")
      .toUpperCase();

    const mainString =
      merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      hashedSecret;

    const expectedHash = crypto
      .createHash("md5")
      .update(mainString)
      .digest("hex")
      .toUpperCase();

    if (expectedHash !== md5sig) {
      console.warn("Invalid PayHere Signature", { expected: expectedHash, received: md5sig });
      return new Response("Invalid Signature", { status: 400 });
    }

    // If Status is 2 (Success), finalize the booking
    if (status_code === "2") {
      console.log(`[PayHere] Payment Success for Order: ${order_id}. Finalizing booking...`);
      
      const finalizeUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/lawyer-dashboard/appointment/finalize`;
      
      const response = await axios.post(finalizeUrl, {
        slot_id: order_id,
        payment_details: {
          payment_id: body.payment_id,
          amount: payhere_amount,
          currency: payhere_currency,
          client_name: `${body.customer_first_name} ${body.customer_last_name}`,
          client_email: body.customer_email
        }
      });

      if (response.status !== 200) {
        console.error("Failed to finalize booking in backend", response.data);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("PayHere Notify Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
