const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db' });
  await client.connect();
  await client.query("CREATE TABLE IF NOT EXISTS contact_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, email TEXT, message TEXT, user_id UUID REFERENCES users(id), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());");
  console.log('Table contact_requests created');
  await client.end();
}
run();
