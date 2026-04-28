
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkBeksultanMessages() {
  try {
    const client = await pool.connect();
    const res = await client.query(`
      SELECT content, created_at 
      FROM messages 
      WHERE sender_id = 'c9d7ae6c-0015-4d29-bcaa-53e5f0a1cbed' 
      ORDER BY created_at DESC 
      LIMIT 10;
    `);
    
    console.log('Beksultan Messages (Raw):');
    res.rows.forEach((r, i) => {
      console.log(`${i+1}. [${r.created_at}] ${r.content}`);
    });
    
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkBeksultanMessages();
