import { query } from './src/lib/db';

async function checkTables() {
  try {
    const res = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', res.rows.map(r => r.table_name));
  } catch (e) {
    console.error(e);
  }
}

checkTables();
