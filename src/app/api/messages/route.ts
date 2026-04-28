import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Пайдаланушының барлық чаттарын (бөлмелерін) алу
    // Соңғы хабарлама уақыты бойынша сұрыпталған
    const res = await query(`
      SELECT 
        mr.id as room_id,
        mr.type,
        mr.title,
        mr.last_message_at,
        mp.user_id as participant_id,
        u.first_name,
        u.last_name,
        u.avatar_url,
        c.display_name as company_name,
        c.logo_url as company_logo,
        mr.vacancy_id,
        mr.company_id,
        (SELECT COUNT(*) FROM messages m WHERE m.room_id = mr.id AND m.created_at > COALESCE(mp_me.last_read_at, '1970-01-01') AND m.sender_id != $1) as unread_count
      FROM message_participants mp_me
      JOIN message_rooms mr ON mr.id = mp_me.room_id
      JOIN message_participants mp ON mp.room_id = mr.id AND mp.user_id != mp_me.user_id
      JOIN users u ON u.id = mp.user_id
      LEFT JOIN companies c ON mr.company_id = c.id
      WHERE mp_me.user_id = $1
      ORDER BY mr.last_message_at DESC NULLS LAST
    `, [userId]);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('API /messages GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderId, receiverId, content, vacancyId, companyId, replyToId, attachments } = body;

    if (!senderId || !receiverId || (!content && !attachments)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Бұл екі адамның арасында бөлме бар ма екенін тексеру
    let roomRes = await query(`
      SELECT r.id
      FROM message_rooms r
      JOIN message_participants p1 ON r.id = p1.room_id AND p1.user_id = $1
      JOIN message_participants p2 ON r.id = p2.room_id AND p2.user_id = $2
      WHERE r.type = 'DIRECT'
      LIMIT 1
    `, [senderId, receiverId]);

    let roomId = roomRes.rows[0]?.id;

    // 2. Егер жоқ болса, жаңа бөлме құру
    if (!roomId) {
      const newRoom = await query(`
        INSERT INTO message_rooms (type, vacancy_id, company_id)
        VALUES ('DIRECT', $1, $2)
        RETURNING id
      `, [vacancyId || null, companyId || null]);
      roomId = newRoom.rows[0].id;

      // Қатысушыларды қосу
      await query(`
        INSERT INTO message_participants (room_id, user_id)
        VALUES ($1, $2), ($1, $3)
      `, [roomId, senderId, receiverId]);
    }

    // 3. Хабарламаны сақтау
    const newMsg = await query(`
      INSERT INTO messages (room_id, sender_id, type, content, reply_to_id, attachments)
      VALUES ($1, $2, 'TEXT', $3, $4, $5)
      RETURNING *
    `, [roomId, senderId, content || '', replyToId || null, attachments ? JSON.stringify(attachments) : '[]']);

    // 4. Бөлменің соңғы хабарлама уақытын жаңарту
    await query(`
      UPDATE message_rooms 
      SET last_message_at = NOW() 
      WHERE id = $1
    `, [roomId]);

    return NextResponse.json({ success: true, message: newMsg.rows[0] });
  } catch (error) {
    console.error('API /messages POST error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
