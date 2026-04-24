import { NextResponse } from 'next/server';
import { generateOTP, saveOTP } from '@/lib/otp-store';
import { sendOTPEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email енгізіңіз' }, { status: 400 });
    }

    const code = generateOTP();
    saveOTP(email, code);

    const { previewUrl } = await sendOTPEmail(email, code);

    return NextResponse.json({
      message: 'Растау коды жіберілді!',
      ...(previewUrl ? { previewUrl } : {}),
    });
  } catch (error) {
    console.error('API /auth/forgot-password error:', error);
    return NextResponse.json({ error: 'Email жіберу кезінде қате шықты. Қайталап көріңіз.' }, { status: 500 });
  }
}
