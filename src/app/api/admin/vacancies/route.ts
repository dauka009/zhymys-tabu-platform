import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logger } from '@/lib/logger';

// GET /api/admin/vacancies — барлық вакансияларды алу (модерация үшін)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let whereClauses = ['v.deleted_at IS NULL'];
    const params: (string | number)[] = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      whereClauses.push(`lower(v.title) LIKE $${params.length}`);
    }

    if (status) {
      params.push(status.toUpperCase());
      whereClauses.push(`v.status = $${params.length}`);
    }

    const whereSQL = `WHERE ${whereClauses.join(' AND ')}`;

    const countRes = await query(
      `SELECT COUNT(*) as total FROM vacancies v ${whereSQL}`,
      params
    );
    const total = parseInt(countRes.rows[0].total);

    params.push(limit);
    params.push(offset);

    const sql = `
      SELECT v.id, v.title, v.status, v.employment_type, v.work_mode,
             v.salary_min, v.salary_max, v.currency, v.created_at,
             c.display_name as company_name
      FROM vacancies v
      LEFT JOIN companies c ON v.company_id = c.id
      ${whereSQL}
      ORDER BY v.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    const { rows } = await query(sql, params);

    await logger.audit('ADMIN_LIST_VACANCIES', { resource: 'vacancies', details: { search, status, page } });

    return NextResponse.json({ vacancies: rows, total, page, limit });
  } catch (error) {
    await logger.error('ADMIN_LIST_VACANCIES_ERROR', { details: { error: String(error) } });
    return NextResponse.json({ error: 'Вакансияларды жүктеу кезінде қате шықты' }, { status: 500 });
  }
}

// PATCH /api/admin/vacancies — вакансия статусын өзгерту (модерация)
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID және статус міндетті' }, { status: 400 });
    }

    const validStatuses = ['PUBLISHED', 'DRAFT', 'ARCHIVED', 'CLOSED', 'PAUSED', 'EXPIRED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json({ error: 'Жарамсыз статус' }, { status: 400 });
    }

    const { rows } = await query(
      `UPDATE vacancies SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, title, status`,
      [status.toUpperCase(), id]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: 'Вакансия табылмады' }, { status: 404 });
    }

    await logger.audit('ADMIN_UPDATE_VACANCY', { resource: 'vacancies', resourceId: id, details: { status } });

    return NextResponse.json({ vacancy: rows[0] });
  } catch (error) {
    await logger.error('ADMIN_UPDATE_VACANCY_ERROR', { details: { error: String(error) } });
    return NextResponse.json({ error: 'Вакансия статусын өзгерту кезінде қате шықты' }, { status: 500 });
  }
}

// DELETE /api/admin/vacancies?id=xxx — вакансияны жою
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID міндетті' }, { status: 400 });
    }

    const { rows } = await query(
      `UPDATE vacancies SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id, title`,
      [id]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: 'Вакансия табылмады' }, { status: 404 });
    }

    await logger.audit('ADMIN_DELETE_VACANCY', { resource: 'vacancies', resourceId: id });

    return NextResponse.json({ message: 'Вакансия жойылды', vacancy: rows[0] });
  } catch (error) {
    await logger.error('ADMIN_DELETE_VACANCY_ERROR', { details: { error: String(error) } });
    return NextResponse.json({ error: 'Вакансияны жою кезінде қате шықты' }, { status: 500 });
  }
}
