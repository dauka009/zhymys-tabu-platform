import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, userId } = body;

    // 1. Save to DB
    const res = await query(`
      INSERT INTO contact_requests (name, email, message, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, email, message, userId || null]);

    // 2. Notify Admin
    const adminRes = await query("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
    const adminId = adminRes.rows[0]?.id;

    if (adminId) {
      await query(`
        INSERT INTO notifications (user_id, type, title, body, link)
        VALUES ($1, 'SYSTEM_ALERT', $2, $3, $4)
      `, [adminId, 'Жаңа кері байланыс', `${name} хабарлама қалдырды: ${message.substring(0, 50)}...`, '/admin']);
    }

    return NextResponse.json({ success: true, data: res.rows[0] });
  } catch (error) {
    console.error('API /contact POST error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
