const { Client } = require('pg');
async function getSchema() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  const res = await client.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;");
  const schema = {};
  res.rows.forEach(r => {
    if (!schema[r.table_name]) schema[r.table_name] = [];
    schema[r.table_name].push(r.column_name);
  });
  console.log(JSON.stringify(schema, null, 2));
  await client.end();
}
getSchema();
