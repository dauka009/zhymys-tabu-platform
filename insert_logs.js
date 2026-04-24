const { Client } = require('pg');

async function insertLogs() {
  const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db'
  });

  try {
    await client.connect();
    await client.query("INSERT INTO audit_logs (action, table_name, metadata) VALUES ('LOGIN', 'users', '{\"email\": \"admin@jumystap.kz\", \"status\": \"success\"}'::jsonb);");
    await client.query("INSERT INTO audit_logs (action, table_name, metadata) VALUES ('UPDATE', 'vacancies', '{\"status_changed_to\": \"published\"}'::jsonb);");
    await client.query("INSERT INTO audit_logs (action, table_name, metadata) VALUES ('DELETE', 'users', '{\"deleted_user_email\": \"test@example.com\"}'::jsonb);");
    console.log('✅ Логтар сәтті қосылды!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

insertLogs();
