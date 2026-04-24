import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Барлық өрістерді толтырыңыз' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await query(
      `SELECT id FROM users WHERE lower(email) = $1 AND deleted_at IS NULL`,
      [email.toLowerCase()]
    );
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ error: 'Бұл email тіркелген! Басқа email енгізіңіз.' }, { status: 409 });
    }

    // Map frontend role ('seeker' | 'employer') → DB enum ('SEEKER' | 'EMPLOYER')
    const dbRole = role === 'employer' ? 'EMPLOYER' : 'SEEKER';

    // Split name into first/last (simple split: first word = first, rest = last)
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '-';

    // Insert user. password is stored as-is for now (no bcrypt yet)
    const insertSql = `
      INSERT INTO users (
        email, password_hash, first_name, last_name, full_name, role, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 'ACTIVE'
      ) RETURNING id, email, first_name, last_name, role
    `;
    const { rows } = await query(insertSql, [
      email.toLowerCase(),
      password, // In production: use bcrypt.hash(password, 12)
      firstName,
      lastName,
      name,
      dbRole,
    ]);

    const saved = rows[0];

    // Map back to frontend User type
    const uiUser = {
      id: saved.id,
      email: saved.email,
      name: `${saved.first_name} ${saved.last_name}`,
      role: saved.role.toLowerCase(),
    };

    return NextResponse.json({ user: uiUser }, { status: 201 });
  } catch (error) {
    console.error('API /auth/register POST error:', error);
    return NextResponse.json({ error: 'Тіркелу кезінде қате шықты' }, { status: 500 });
  }
}
