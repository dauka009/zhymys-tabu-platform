import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId) {
      // Пайдаланушының осы бөлмедегі соңғы оқыған уақытын жаңарту
      await query(`
        UPDATE message_participants 
        SET last_read_at = NOW() 
        WHERE room_id = $1 AND user_id = $2
      `, [roomId, userId]);
    }

    // Бөлмедегі хабарламаларды ескісінен жаңасына қарай (уақыт бойынша) алу
    const res = await query(`
      SELECT m.id, m.sender_id, m.content, m.created_at, m.reply_to_id, m.attachments, m.is_deleted,
             reply_m.content as reply_content,
             EXISTS(SELECT 1 FROM message_participants mp WHERE mp.room_id = m.room_id AND mp.user_id != m.sender_id AND mp.last_read_at >= m.created_at) as is_read
      FROM messages m
      LEFT JOIN messages reply_m ON m.reply_to_id = reply_m.id
      WHERE m.room_id = $1
      ORDER BY m.created_at ASC
      LIMIT 100
    `, [roomId]);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('API /messages/[roomId] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch room messages' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (messageId) {
      // Бір хабарламаны өшіру (soft delete)
      await query(`UPDATE messages SET is_deleted = true WHERE id = $1`, [messageId]);
    } else {
      // Бүкіл чатты тазалау
      await query(`DELETE FROM messages WHERE room_id = $1`, [roomId]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /messages/[roomId] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete messages' }, { status: 500 });
  }
}
