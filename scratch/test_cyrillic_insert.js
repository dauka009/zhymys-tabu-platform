
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testWithRealUser() {
  try {
    const client = await pool.connect();
    
    // Find a real user and a room
    const user = await client.query("SELECT id FROM users LIMIT 1;");
    const room = await client.query("SELECT id FROM message_rooms LIMIT 1;");
    
    if (user.rows.length === 0 || room.rows.length === 0) {
      console.log('No users or rooms found');
      return;
    }
    
    const userId = user.rows[0].id;
    const roomId = room.rows[0].id;
    const testContent = "Сәлем! Бұл тест. Әіңғүұқөһ.";
    
    const res = await client.query(
      "INSERT INTO messages (room_id, sender_id, type, content) VALUES ($1, $2, 'TEXT', $3) RETURNING *;",
      [roomId, userId, testContent]
    );
    
    console.log('Success! Inserted Content:', res.rows[0].content);
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

testWithRealUser();
