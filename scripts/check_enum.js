const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const res = await client.query("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'notification_type_enum'");
  console.log('enum values:', res.rows.map(r => r.enumlabel));
  await client.end();
}
check();
