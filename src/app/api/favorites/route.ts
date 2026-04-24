import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// UUID форматын тексеру
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(val: string | null | undefined): boolean {
  return !!val && UUID_REGEX.test(val);
}


/**
 * GET /api/favorites?userId=xxx
 * Returns all active favorites (not soft deleted) for a user
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Ескі mock ID болса ("", "user_xxx") — бос массив қайтарамыз, 500 емес
    if (!isValidUUID(userId)) {
      return NextResponse.json([]);
    }

    const sql = `
      SELECT f.id, f.target_type, f.vacancy_id, f.company_id, f.created_at,
             v.title as vacancy_title
      FROM favorites f
      LEFT JOIN vacancies v ON f.vacancy_id = v.id
      WHERE f.user_id = $1 AND f.deleted_at IS NULL
      ORDER BY f.created_at DESC
    `;
    const { rows } = await query(sql, [userId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('API /favorites GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

/**
 * POST /api/favorites
 * Toggle favorite: if exists → soft-delete, else insert
 */
export async function POST(request: Request) {
  try {
    const { userId, vacancyId } = await request.json();

    if (!userId || !vacancyId) {
      return NextResponse.json({ error: 'userId and vacancyId required' }, { status: 400 });
    }

    // UUID форматын тексеру — mock store ID болса нақты қате хабарлама қайтарамыз
    if (!isValidUUID(userId)) {
      return NextResponse.json(
        { error: 'Жүйеге кіріп, нақты аккаунтпен сақтаңыз.' },
        { status: 400 }
      );
    }
    if (!isValidUUID(vacancyId)) {
      return NextResponse.json(
        { error: 'Бұл вакансия мәліметтер базасында жоқ (mock). Алдымен нақты вакансия жасаңыз.' },
        { status: 400 }
      );
    }

    // Check if already favorited (not deleted)
    const check = await query(
      `SELECT id, deleted_at FROM favorites WHERE user_id = $1 AND vacancy_id = $2 LIMIT 1`,
      [userId, vacancyId]
    );

    if (check.rowCount && check.rowCount > 0) {
      const existing = check.rows[0];
      if (!existing.deleted_at) {
        // Soft delete (remove from favorites)
        await query(
          `UPDATE favorites SET deleted_at = now() WHERE id = $1`,
          [existing.id]
        );
        return NextResponse.json({ action: 'removed' });
      } else {
        // Restore: was deleted → restore
        await query(
          `UPDATE favorites SET deleted_at = NULL WHERE id = $1`,
          [existing.id]
        );
        return NextResponse.json({ action: 'added' });
      }
    }

    // Insert new favorite
    await query(
      `INSERT INTO favorites (user_id, target_type, vacancy_id) VALUES ($1, 'VACANCY', $2)`,
      [userId, vacancyId]
    );

    return NextResponse.json({ action: 'added' }, { status: 201 });
  } catch (error) {
    console.error('API /favorites POST error:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
