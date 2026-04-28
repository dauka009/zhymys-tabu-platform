const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const users = await client.query("SELECT id, first_name, role FROM users WHERE id IN ('c9d7ae6c-0015-4d29-bcaa-53e5f0a1cbed', 'f0bdc5ad-e264-420d-b9fa-9f4f1504ee55')");
  console.log('users:', users.rows);
  await client.end();
}
check();
