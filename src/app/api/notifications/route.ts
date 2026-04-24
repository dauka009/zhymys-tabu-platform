import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const res = await query(`
      SELECT id, title, body as content, type, is_read, created_at, link
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `, [userId]);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('API /notifications GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, userId, all } = body;

    if (all && userId) {
      await query(`UPDATE notifications SET is_read = TRUE WHERE user_id = $1`, [userId]);
      return NextResponse.json({ success: true });
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await query(`UPDATE notifications SET is_read = TRUE WHERE id = $1`, [notificationId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /notifications PUT error:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
