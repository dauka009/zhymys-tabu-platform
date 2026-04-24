import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employerId = searchParams.get('employerId');

    if (!employerId) {
      return NextResponse.json({ error: 'Employer ID is required' }, { status: 400 });
    }

    // 1. Count active vacancies
    const vacanciesRes = await query(`
      SELECT COUNT(*) as count, SUM(views) as total_views
      FROM vacancies v
      JOIN companies c ON v.company_id = c.id
      WHERE c.owner_user_id = $1 AND v.deleted_at IS NULL AND v.status = 'PUBLISHED'
    `, [employerId]);

    // 2. Count applications
    const appsRes = await query(`
      SELECT COUNT(*) as count
      FROM applications a
      JOIN vacancies v ON a.vacancy_id = v.id
      JOIN companies c ON v.company_id = c.id
      WHERE c.owner_user_id = $1 AND a.deleted_at IS NULL
    `, [employerId]);

    const stats = {
      activeVacancies: parseInt(vacanciesRes.rows[0].count),
      newApplications: parseInt(appsRes.rows[0].count),
      totalViews: parseInt(vacanciesRes.rows[0].total_views || 0),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('API /employer/stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
