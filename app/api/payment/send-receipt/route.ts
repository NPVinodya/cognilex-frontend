import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, lawyerName, consultationFee, serviceFee, totalAmount, date, time, clientName } = data;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    const isSmtpConfigured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d97706; text-align: center;">CogniLex</h2>
        <p style="text-align: center; font-size: 18px; font-weight: bold;">Payment Receipt</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p>Hi ${clientName || 'User'},</p>
        <p>Thank you for booking a consultation via CogniLex. Your payment was successful.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Lawyer:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${lawyerName}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${new Date(date).toLocaleDateString()}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${time}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Consultation Fee:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">LKR ${consultationFee?.toLocaleString()}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service Fee:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">LKR ${serviceFee?.toLocaleString()}</td></tr>
          <tr><td style="padding: 12px 0; font-size: 16px; font-weight: bold; border-top: 2px solid #333;">Total Paid:</td><td style="padding: 12px 0; font-size: 16px; font-weight: bold; text-align: right; border-top: 2px solid #333;">LKR ${totalAmount?.toLocaleString()}</td></tr>
        </table>
        
        <p style="margin-top: 30px; font-size: 14px; text-align: center; color: #888;">If you have any questions, please contact info@cognilex.com.</p>
      </div>
    `;

    if (!isSmtpConfigured) {
      console.log('--- MOCK EMAIL SENDING ---');
      console.log(`To: ${email}`);
      console.log(`Subject: Your CogniLex Payment Receipt`);
      console.log(`Body:\n`, htmlContent);
      console.log('--------------------------');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return NextResponse.json({ success: true, message: 'Mock email sent successfully (check console)' });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CogniLex" <${SMTP_USER}>`,
      to: email,
      subject: 'Your CogniLex Payment Receipt',
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
