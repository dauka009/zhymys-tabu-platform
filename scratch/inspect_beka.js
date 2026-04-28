
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function inspectBekaMessages() {
  try {
    const client = await pool.connect();
    
    const res = await client.query(`
      SELECT m.content, m.created_at, u.first_name 
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE u.first_name ILIKE '%Beka%' OR u.last_name ILIKE '%Beka%'
      ORDER BY m.created_at DESC
      LIMIT 5;
    `);
    
    console.log('Last 5 messages from Beka:');
    res.rows.forEach((r, i) => {
      console.log(`${i+1}. [${r.created_at}] ${r.first_name}: ${r.content}`);
    });
    
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

inspectBekaMessages();
