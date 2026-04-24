const { Client } = require('pg');

async function checkEnum() {
  const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db'
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT unnest(enum_range(NULL::application_status_enum)) AS status;
    `);
    console.log(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

checkEnum();
