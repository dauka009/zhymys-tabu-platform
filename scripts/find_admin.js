const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const res = await client.query("SELECT id, first_name FROM users WHERE role = 'ADMIN' LIMIT 1");
  console.log('admin:', res.rows[0]);
  await client.end();
}
check();
