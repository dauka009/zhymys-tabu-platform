import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(to: string, code: string): Promise<{ previewUrl?: string }> {
  const { error } = await resend.emails.send({
    from: 'ЖұмысТап <onboarding@resend.dev>',
    to,
    subject: '🔐 Құпиясөзді қалпына келтіру коды — ЖұмысТап',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0F172A; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6C63FF, #4F46E5); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">ЖұмысТап</h1>
          <p style="margin: 8px 0 0; opacity: 0.85;">Құпиясөзді қалпына келтіру</p>
        </div>
        <div style="padding: 32px 24px;">
          <p style="color: #94A3B8; margin: 0 0 24px;">Сіздің растау кодыңыз:</p>
          <div style="background: #1E293B; border: 2px solid #6C63FF; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
            <span style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #6C63FF;">${code}</span>
          </div>
          <p style="color: #94A3B8; font-size: 14px; margin: 0;">⏰ Бұл код <strong style="color: #fff;">5 минут</strong> ішінде жарамды.</p>
          <p style="color: #94A3B8; font-size: 14px; margin: 12px 0 0;">Егер сіз бұл сұранысты жібермесеңіз — хабарламаны елемей кете беріңіз.</p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  return {};
}
