import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { order_id, amount, currency } = await request.json();

    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1211149'; // Default sandbox ID
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'NDAxODExMTU3MjMwMzM2NTE2NzYyMjE1NzQwNTg2Nzk5NzQ1MjE='; // Default sandbox secret

    // Formatting amount to exactly 2 decimal places string
    const formattedAmount = (parseFloat(amount.toString())).toFixed(2);

    // Hash algorithm: strtoupper(md5(merchant_id + order_id + formatted_amount + currency + strtoupper(md5(merchant_secret))))
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const mainString = merchantId + order_id + formattedAmount + currency + hashedSecret;
    
    const finalHash = crypto
      .createHash('md5')
      .update(mainString)
      .digest('hex')
      .toUpperCase();

    return NextResponse.json({ hash: finalHash });
  } catch (error) {
    console.error('Hash Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate hash' }, { status: 500 });
  }
}
