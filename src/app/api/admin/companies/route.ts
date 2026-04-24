import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT c.*, u.email as owner_email, u.full_name as owner_name,
      (SELECT COUNT(*) FROM vacancies WHERE company_id = c.id) as vacancies_count
      FROM companies c
      LEFT JOIN users u ON c.owner_user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (c.display_name ILIKE $1 OR c.legal_name ILIKE $1 OR u.email ILIKE $1)`;
    }

    sql += ` ORDER BY c.created_at DESC`;

    const { rows } = await query(sql, params);

    return NextResponse.json({
      companies: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('API /admin/companies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await query(`DELETE FROM companies WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /admin/companies DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
