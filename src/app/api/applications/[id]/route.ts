import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validStatuses = ['pending', 'interview', 'rejected'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateSql = `
      UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await query(updateSql, [status.toUpperCase(), id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Optional: send notification to user about status change
    try {
      const appRes = await query(`
        SELECT a.user_id, v.title 
        FROM applications a
        JOIN vacancies v ON a.vacancy_id = v.id
        WHERE a.id = $1
      `, [id]);
      
      if (appRes.rowCount && appRes.rowCount > 0) {
         const { user_id, title } = appRes.rows[0];
         let content = '';
         if (status.toLowerCase() === 'interview') {
           content = `Құттықтаймыз! Сіздің "${title}" вакансиясына өтініміңіз қабылданды (Шақырылды).`;
         } else {
           content = `Өкінішке орай, сіздің "${title}" вакансиясына өтініміңіз қабылданбады.`;
         }
         
         await query(`
           INSERT INTO notifications (user_id, title, content, type, link)
           VALUES ($1, $2, $3, 'application_status', $4)
         `, [user_id, 'Өтінім мәртебесі өзгерді', content, '/cabinet/applications']);
      }
    } catch (e) {
      console.error('Notification error:', e);
    }

    return NextResponse.json({ application: rows[0] });
  } catch (error) {
    console.error('API /applications/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
