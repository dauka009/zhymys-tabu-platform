import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    const companyId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO company_follows (user_id, company_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, companyId]
    );

    return NextResponse.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json({ error: 'Failed to follow company' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await query(
      `DELETE FROM company_follows WHERE user_id = $1 AND company_id = $2`,
      [userId, companyId]
    );

    return NextResponse.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ error: 'Failed to unfollow company' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = params.id;

    if (!userId) {
      return NextResponse.json({ isFollowing: false });
    }

    const result = await query(
      `SELECT 1 FROM company_follows WHERE user_id = $1 AND company_id = $2`,
      [userId, companyId]
    );

    return NextResponse.json({ isFollowing: result.rowCount > 0 });
  } catch (error) {
    console.error('Check follow error:', error);
    return NextResponse.json({ isFollowing: false });
  }
}
