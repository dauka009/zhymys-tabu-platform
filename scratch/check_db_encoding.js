
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkEncoding() {
  try {
    const client = await pool.connect();
    
    // 1. Check database encoding
    const dbEnc = await client.query("SELECT pg_encoding_to_char(encoding) FROM pg_database WHERE datname = current_database();");
    console.log('Database Encoding:', dbEnc.rows[0].pg_encoding_to_char);
    
    // 2. Check table collation
    const colInfo = await client.query(`
      SELECT column_name, data_type, collation_name 
      FROM information_schema.columns 
      WHERE table_name = 'messages' AND column_name = 'content';
    `);
    console.log('Column Info:', colInfo.rows[0]);
    
    // 3. Try to fetch one message and see its raw bytes (hex)
    const msg = await client.query("SELECT id, content, encode(content::bytea, 'hex') as hex FROM messages WHERE content LIKE '%?%' LIMIT 1;");
    if (msg.rows.length > 0) {
      console.log('Sample Message ID:', msg.rows[0].id);
      console.log('Sample Content:', msg.rows[0].content);
      console.log('Sample Hex:', msg.rows[0].hex);
    }
    
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkEncoding();
