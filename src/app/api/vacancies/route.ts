import { NextResponse } from 'next/server';
import { getAllVacanciesFromDb } from '@/lib/services/vacancies.service';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employerId = searchParams.get('employerId');

    if (employerId) {
       // Fetch vacancies for specific employer (via company)
       const sql = `
         SELECT v.*, (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id) as applications_count
         FROM vacancies v
         JOIN companies c ON v.company_id = c.id
         WHERE c.owner_user_id = $1 AND v.deleted_at IS NULL
         ORDER BY v.created_at DESC
       `;
       const { rows } = await query(sql, [employerId]);
       return NextResponse.json(rows.map(r => ({
         id: r.id,
         title: r.title,
         status: r.status,
         emoji: r.emoji || '💼',
         applicationsCount: Number(r.applications_count),
         createdAt: r.created_at
       })));
    }

    const vacancies = await getAllVacanciesFromDb();
    return NextResponse.json(vacancies);
  } catch (error) {
    console.error('API /vacancies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch vacancies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const title = body.title;
    const description = body.description;
    const salaryMin = body.salary?.min || null;
    const salaryMax = body.salary?.max || null;
    const category = body.category || 'other';
    const employmentType = body.employment_type || 'FULL_TIME';
    const workMode = body.work_mode || 'REMOTE';
    const emoji = body.emoji || '💼';
    
    const employerId = body.employerId;
    
    // Find the company owned by this user
    let companyId;
    if (employerId) {
      const compRes = await query(`SELECT id FROM companies WHERE owner_user_id = $1 LIMIT 1`, [employerId]);
      companyId = compRes.rows[0]?.id;
    }

    if (!companyId) {
       return NextResponse.json({ error: 'Алдымен компания құруыңыз керек (Баптаулар -> Менің компаниям)' }, { status: 400 });
    }

    const insertSql = `
      INSERT INTO vacancies (
        company_id, slug, title, description, salary_min, salary_max, 
        employment_type, work_mode, emoji, category, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PUBLISHED'
      ) RETURNING id, created_at
    `;
    const slug = (title.toLowerCase().replace(/ /g, '-') + '-' + Date.now()).substring(0, 50);
    
    const insertRes = await query(insertSql, [
      companyId, slug, title, description, salaryMin, salaryMax, 
      employmentType, workMode, emoji, category
    ]);
    const saved = insertRes.rows[0];

    // --- TRIGGER NOTIFICATION FOR ALL SEEKERS ---
    try {
      // 1. Find all seekers
      const seekersRes = await query(`SELECT id FROM users WHERE role = 'SEEKER'`);
      
      if (seekersRes.rows.length > 0) {
        for (const seeker of seekersRes.rows) {
          await query(`
            INSERT INTO notifications (user_id, title, body, type, link)
            VALUES ($1, $2, $3, 'vacancy', $4)
          `, [
            seeker.id, 
            'Жаңа вакансия', 
            `"${title}" жаңа вакансиясы жарияланды.`, 
            `/vacancies/${saved.id}`
          ]);
        }
      }
    } catch (notifErr) {
      console.error('Failed to notify seekers:', notifErr);
    }

    return NextResponse.json({ ...body, id: saved.id, createdAt: saved.created_at }, { status: 201 });
  } catch (error) {
    console.error('API /vacancies POST error:', error);
    return NextResponse.json({ error: 'Failed to create vacancy', details: (error as Error).message }, { status: 500 });
  }
}
