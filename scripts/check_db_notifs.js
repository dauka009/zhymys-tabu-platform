const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const res = await client.query("SELECT id, title, is_read, user_id FROM notifications ORDER BY created_at DESC LIMIT 5");
  console.log('notifications:', res.rows);
  await client.end();
}
check();
