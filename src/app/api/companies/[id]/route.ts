import { NextResponse } from 'next/server';
import { getCompanyByIdFromDb } from '@/lib/services/vacancies.service';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await getCompanyByIdFromDb(id);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Also fetch vacancies for this company
    const vacRes = await query(`
      SELECT id, title, salary_min, salary_max, currency, work_mode, employment_type, created_at
      FROM vacancies 
      WHERE company_id = $1 AND deleted_at IS NULL AND status = 'PUBLISHED'
    `, [id]);

    company.vacancies = vacRes.rows.map(row => ({
      id: row.id,
      title: row.title,
      salary: { min: row.salary_min, max: row.salary_max, currency: row.currency },
      location: row.work_mode === 'REMOTE' ? 'Қашықтан' : 'Алматы',
      type: row.work_mode === 'REMOTE' ? 'remote' : row.work_mode === 'HYBRID' ? 'hybrid' : 'full',
      createdAt: row.created_at,
    }));

    return NextResponse.json(company);
  } catch (error) {
    console.error('API /companies/[id] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}
