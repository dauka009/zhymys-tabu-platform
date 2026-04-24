import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// UUID форматын тексеру (PostgreSQL uuid типіне сай)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(val: string | null | undefined): boolean {
  return !!val && UUID_REGEX.test(val);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vacancyId = searchParams.get('vacancyId');
    const employerId = searchParams.get('employerId');

    let sql = `
      SELECT a.id, a.vacancy_id, a.user_id, a.status, a.created_at,
             v.title as vacancy_title, v.company_id,
             u.first_name, u.last_name, u.email as user_email
      FROM applications a
      LEFT JOIN vacancies v ON a.vacancy_id = v.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.deleted_at IS NULL
    `;
    const params: any[] = [];
    
    if (userId) {
      if (!isValidUUID(userId)) return NextResponse.json([]);
      params.push(userId);
      sql += ` AND a.user_id = $${params.length}`;
    }
    if (vacancyId) {
      if (!isValidUUID(vacancyId)) return NextResponse.json([]);
      params.push(vacancyId);
      sql += ` AND a.vacancy_id = $${params.length}`;
    }
    if (employerId) {
       if (!isValidUUID(employerId)) return NextResponse.json([]);
       // Find apps for vacancies owned by this employer's company
       sql += ` AND v.company_id IN (SELECT id FROM companies WHERE owner_user_id = $${params.length + 1})`;
       params.push(employerId);
    }

    const { rows } = await query(sql, params);

    const applications = rows.map((row) => ({
      id: row.id,
      vacancyId: row.vacancy_id,
      userId: row.user_id,
      status: row.status.toLowerCase(),
      date: row.created_at,
      vacancyTitle: row.vacancy_title,
      user: {
        name: `${row.first_name} ${row.last_name}`,
        email: row.user_email
      }
    }));

    return NextResponse.json(applications);
  } catch (error) {
    console.error('API /applications GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vacancyId = body.vacancyId;
    let userId = body.userId;

    if (!vacancyId) {
      return NextResponse.json({ error: 'vacancyId is required' }, { status: 400 });
    }

    // UUID форматын тексеру — mock ID болса қабылдамаймыз
    if (!isValidUUID(vacancyId)) {
      return NextResponse.json(
        { error: 'Бұл вакансия мәліметтер базасында жоқ (mock деректер). Алдымен нақты вакансия жасаңыз.' },
        { status: 400 }
      );
    }
    if (userId && !isValidUUID(userId)) {
      return NextResponse.json(
        { error: 'Жүйеге кіріп, нақты аккаунтпен өтінім беріңіз.' },
        { status: 400 }
      );
    }

    // Default to a known seeker user if none provided by front-end
    if (!userId) {
       const userRes = await query(`SELECT id FROM users WHERE role = 'SEEKER' LIMIT 1`);
       userId = userRes.rows[0]?.id;
       if (!userId) {
         // Create a dummy seeker
         const newUsr = await query(`
           INSERT INTO users (email, password_hash, first_name, last_name, role) 
           VALUES ('seeker@test.kz', 'hash', 'Test', 'Seeker', 'SEEKER') RETURNING id
         `);
         userId = newUsr.rows[0].id;
       }
    }

    // Determine if user has already applied
    const checkSql = `SELECT id FROM applications WHERE vacancy_id = $1 AND user_id = $2`;
    const checkRes = await query(checkSql, [vacancyId, userId]);
    if (checkRes.rowCount && checkRes.rowCount > 0) {
      return NextResponse.json({ error: 'Сіз бұл вакансияға өтінім жіберіп қойдыңыз!' }, { status: 400 });
    }

    const insertSql = `
      INSERT INTO applications (vacancy_id, user_id, status)
      VALUES ($1, $2, 'PENDING')
      RETURNING id, created_at, status
    `;
    const { rows } = await query(insertSql, [vacancyId, userId]);
    const saved = rows[0];

    const application = {
      id: saved.id,
      vacancyId: vacancyId,
      userId: userId,
      status: saved.status.toLowerCase(),
      date: saved.created_at
    };

    // --- TRIGGER NOTIFICATION FOR EMPLOYER ---
    try {
      // 1. Find the vacancy title and employer's user_id
      const vacancyRes = await query(`
        SELECT v.title, c.owner_user_id 
        FROM vacancies v
        JOIN companies c ON v.company_id = c.id
        WHERE v.id = $1
      `, [vacancyId]);
      
      if (vacancyRes.rowCount && vacancyRes.rowCount > 0) {
        const { title, owner_user_id } = vacancyRes.rows[0];
        
        // 2. Create notification
        await query(`
          INSERT INTO notifications (user_id, title, content, type, link)
          VALUES ($1, $2, $3, 'application', $4)
        `, [
          owner_user_id, 
          'Жаңа өтініш', 
          `"${title}" вакансиясына жаңа өтінім түсті.`, 
          '/cabinet/candidates'
        ]);
      }
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
      // Don't fail the whole request if notification fails
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('API /applications POST error:', error);
    return NextResponse.json({ error: 'Failed to submit application', details: (error as Error).message }, { status: 500 });
  }
}
