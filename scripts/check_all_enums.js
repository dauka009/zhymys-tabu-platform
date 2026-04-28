const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const res = await client.query("SELECT t.typname, e.enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid");
  console.log(res.rows);
  await client.end();
}
check();
