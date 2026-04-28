const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const companies = await client.query("SELECT id, display_name FROM companies");
  console.log('companies:', companies.rows);
  await client.end();
}
check();
