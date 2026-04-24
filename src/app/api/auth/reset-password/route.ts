import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-store';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'Барлық өрістерді толтырыңыз' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Құпиясөз кемінде 8 символ болуы керек' }, { status: 400 });
    }

    const isValid = verifyOTP(email, code);
    if (!isValid) {
      return NextResponse.json({ error: 'Код дұрыс емес немесе мерзімі өтіп кеткен' }, { status: 400 });
    }

    // Жаңа құпиясөзбен жаңарту
    await query(
      `UPDATE users SET password_hash = $1 WHERE lower(email) = $2`,
      [newPassword, email.toLowerCase()]
    );

    return NextResponse.json({ message: 'Құпиясөз сәтті жаңартылды!' });
  } catch (error) {
    console.error('API /auth/reset-password error:', error);
    return NextResponse.json({ error: 'Қате шықты' }, { status: 500 });
  }
}
