import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email және пароль қажет' }, { status: 400 });
    }

    const sql = `
      SELECT id, email, first_name, last_name, role 
      FROM users 
      WHERE email = $1 AND password_hash = $2 AND deleted_at IS NULL
    `;
    const { rows } = await query(sql, [email.toLowerCase(), password]);
    
    const user = rows[0];

    if (!user) {
      await logger.warn('LOGIN_FAILED', { details: { email: email.toLowerCase() } });
      return NextResponse.json({ error: 'Қате: Email немесе пароль дұрыс емес' }, { status: 401 });
    }

    // Map DB User to Frontend UI User
    const uiUser = {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role.toLowerCase(),
    };

    await logger.audit('LOGIN_SUCCESS', { userId: user.id, userRole: user.role });

    return NextResponse.json({ user: uiUser });
  } catch (error) {
    await logger.error('LOGIN_ERROR', { details: { error: String(error) } });
    return NextResponse.json({ error: 'Қате шықты' }, { status: 500 });
  }
}
