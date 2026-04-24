import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logger } from '@/lib/logger';

// GET /api/admin/users — барлық пайдаланушыларды алу
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let whereClauses = ['deleted_at IS NULL'];
    const params: (string | number)[] = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      whereClauses.push(`(lower(full_name) LIKE $${params.length} OR lower(email) LIKE $${params.length})`);
    }

    if (role) {
      params.push(role.toUpperCase());
      whereClauses.push(`role = $${params.length}`);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Жалпы саны
    const countRes = await query(`SELECT COUNT(*) as total FROM users ${whereSQL}`, params);
    const total = parseInt(countRes.rows[0].total);

    // Деректер
    params.push(limit);
    params.push(offset);
    const sql = `
      SELECT id, email, first_name, last_name, full_name, role, status, created_at
      FROM users
      ${whereSQL}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    const { rows } = await query(sql, params);

    await logger.audit('ADMIN_LIST_USERS', { resource: 'users', details: { search, role, page } });

    return NextResponse.json({ users: rows, total, page, limit });
  } catch (error) {
    await logger.error('ADMIN_LIST_USERS_ERROR', { details: { error: String(error) } });
    return NextResponse.json({ error: 'Пайдаланушыларды жүктеу кезінде қате шықты' }, { status: 500 });
  }
}

// PATCH /api/admin/users — пайдаланушы рөлін/статусын өзгерту
export async function PATCH(request: Request) {
  try {
    const { id, role, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID міндетті' }, { status: 400 });
    }

    const validRoles = ['ADMIN', 'EMPLOYER', 'SEEKER'];
    const validStatuses = ['ACTIVE', 'SUSPENDED', 'BANNED'];

    const setClauses: string[] = [];
    const params: (string | number)[] = [];

    if (role) {
      if (!validRoles.includes(role.toUpperCase())) {
        return NextResponse.json({ error: 'Жарамсыз рөл' }, { status: 400 });
      }
      params.push(role.toUpperCase());
      setClauses.push(`role = $${params.length}`);
    }

    if (status) {
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json({ error: 'Жарамсыз статус' }, { status: 400 });
      }
      params.push(status.toUpperCase());
      setClauses.push(`status = $${params.length}`);
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'Өзгерту үшін деректер жоқ' }, { status: 400 });
    }

    params.push(id);
    const sql = `UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING id, email, role, status`;
    const { rows } = await query(sql, params);

    if (!rows[0]) {
      return NextResponse.json({ error: 'Пайдаланушы табылмады' }, { status: 404 });
    }

    await logger.audit('ADMIN_UPDATE_USER', { resource: 'users', resourceId: id, details: { role, status } });

    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    await logger.error('ADMIN_UPDATE_USER_ERROR', { details: { error: String(error) } });
    return NextResponse.json({ error: 'Пайдаланушыны өзгерту кезінде қате шықты' }, { status: 500 });
  }
}

// DELETE /api/admin/users?id=xxx — пайдаланушыны жою (soft delete)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID міндетті' }, { status: 400 });
    }

    const { rows } = await query(
      `UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id, email`,
      [id]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: 'Пайдаланушы табылмады немесе жоюлып қойған' }, { status: 404 });
    }

    await logger.audit('ADMIN_DELETE_USER', { resource: 'users', resourceId: id });

    return NextResponse.json({ message: 'Пайдаланушы жойылды', user: rows[0] });
  } catch (error) {
    await logger.error('ADMIN_DELETE_USER_ERROR', { details: { error: String(error) } });
    return NextResponse.json({ error: 'Пайдаланушыны жою кезінде қате шықты' }, { status: 500 });
  }
}
