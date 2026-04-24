const { Client } = require('pg');

async function fixDb() {
  // .env файлындағы парольді пайдаланамыз (1234)
  const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db'
  });

  try {
    await client.connect();
    
    // 1. users кестесіндегі role бағанының типін уақытша VARCHAR-ға ауыстырамыз (ENUM мәселесін шешу үшін)
    console.log("role бағанының типін өзгертудеміз...");
    await client.query(`ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50);`);
    
    // 2. admin пайдаланушысының рөлін 'ADMIN' етіп жаңартамыз
    console.log("Admin рөлін орнатудамыз...");
    await client.query(`UPDATE users SET role = 'ADMIN' WHERE email = 'admin@jumystap.kz';`);
    
    // 3. audit_logs кестесін құру (егер жоқ болса)
    console.log("audit_logs кестесін тексерудеміз...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
        user_role   VARCHAR(50),
        action      VARCHAR(200) NOT NULL,
        resource    VARCHAR(100),
        resource_id VARCHAR(200),
        details     JSONB,
        ip          VARCHAR(50),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log("✅ БАРЛЫҒЫ СӘТТІ ОРЫНДАЛДЫ!");
    
  } catch (err) {
    console.error("❌ ҚАТЕ ШЫҚТЫ:", err.message);
  } finally {
    await client.end();
  }
}

fixDb();
