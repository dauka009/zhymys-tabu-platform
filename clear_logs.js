const { Client } = require('pg');

async function deleteDummy() {
  const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db'
  });

  try {
    await client.connect();
    await client.query("DELETE FROM audit_logs;");
    console.log("Жаңағы жалған логтар өшірілді.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

deleteDummy();
