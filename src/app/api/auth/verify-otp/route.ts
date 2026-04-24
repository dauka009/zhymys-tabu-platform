import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-store';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email және код қажет' }, { status: 400 });
    }

    // deleteAfter=false: кодты сақтап қалу (reset-password кезінде қайта тексеру үшін)
    const isValid = verifyOTP(email, code, false);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Код дұрыс емес немесе мерзімі өтіп кеткен (5 мин)' },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Қате шықты' }, { status: 500 });
  }
}
