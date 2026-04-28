
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listUsers() {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT id, first_name, last_name, email FROM users LIMIT 20;");
    console.table(res.rows);
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

listUsers();
