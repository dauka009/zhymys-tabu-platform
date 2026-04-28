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
        SELECT a.user_id as candidate_id, v.title, v.company_id, c.owner_user_id as employer_id
        FROM applications a
        JOIN vacancies v ON a.vacancy_id = v.id
        JOIN companies c ON v.company_id = c.id
        WHERE a.id = $1
      `, [id]);
      
      if (appRes.rowCount && appRes.rowCount > 0) {
         const { candidate_id, title, company_id, employer_id } = appRes.rows[0];
         let content = '';
         if (status.toLowerCase() === 'interview') {
           content = `Құттықтаймыз! Сіздің "${title}" вакансиясына өтініміңіз қабылданды (Шақырылды).`;
         } else {
           content = `Өкінішке орай, сіздің "${title}" вакансиясына өтініміңіз қабылданбады.`;
         }
         
         
         await query(`
           INSERT INTO notifications (user_id, title, body, type, link)
           VALUES ($1, $2, $3, 'APPLICATION_STATUS_CHANGED', $4)
         `, [candidate_id, 'Өтінім мәртебесі өзгерді', content, '/cabinet']);

         // Егер шақырылса, бірден чат бөлмесін ашып, автоматты хат жібереміз
         if (status.toLowerCase() === 'interview') {
           // Тексереміз, мүмкін бөлме бар шығар?
           let roomRes = await query(`
             SELECT r.id
             FROM message_rooms r
             JOIN message_participants p1 ON r.id = p1.room_id AND p1.user_id = $1
             JOIN message_participants p2 ON r.id = p2.room_id AND p2.user_id = $2
             WHERE r.type = 'DIRECT'
             LIMIT 1
           `, [employer_id, candidate_id]);

           let roomId = roomRes.rows[0]?.id;

           if (!roomId) {
             const newRoom = await query(`
               INSERT INTO message_rooms (type, company_id)
               VALUES ('DIRECT', $1)
               RETURNING id
             `, [company_id]);
             roomId = newRoom.rows[0].id;

             await query(`
               INSERT INTO message_participants (room_id, user_id)
               VALUES ($1, $2), ($1, $3)
             `, [roomId, employer_id, candidate_id]);
           }

           // Жұмыс берушінің атынан хат жіберу
           const msgContent = `Сәлеметсіз бе! Сізді "${title}" вакансиясы бойынша сұхбатқа шақырамыз.`;
           await query(`
             INSERT INTO messages (room_id, sender_id, type, content)
             VALUES ($1, $2, 'TEXT', $3)
           `, [roomId, employer_id, msgContent]);

           // Бөлменің соңғы хат уақытын жаңарту
           await query(`UPDATE message_rooms SET last_message_at = NOW() WHERE id = $1`, [roomId]);
         }
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
