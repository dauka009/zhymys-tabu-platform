const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages'");
  console.log('columns:', res.rows);
  await client.end();
}
check();
