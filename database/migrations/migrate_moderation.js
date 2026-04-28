const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/jumys_tab_db'
  });

  try {
    await client.connect();
    
    console.log("Migrating database...");

    // Add new enum values to vacancy_status_enum if they don't exist
    await client.query(`ALTER TYPE vacancy_status_enum ADD VALUE IF NOT EXISTS 'PENDING_REVIEW';`);
    await client.query(`ALTER TYPE vacancy_status_enum ADD VALUE IF NOT EXISTS 'NEEDS_FIX';`);
    await client.query(`ALTER TYPE vacancy_status_enum ADD VALUE IF NOT EXISTS 'REJECTED';`);

    // Add fields to companies
    await client.query(`
      ALTER TABLE companies
      ADD COLUMN IF NOT EXISTS review_status VARCHAR(50) DEFAULT 'PENDING_REVIEW',
      ADD COLUMN IF NOT EXISTS review_comment TEXT,
      ADD COLUMN IF NOT EXISTS review_fields JSONB,
      ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
    `);

    // Initially approve all existing companies so the site doesn't break
    await client.query(`UPDATE companies SET review_status = 'APPROVED';`);

    // Add fields to vacancies
    await client.query(`
      ALTER TABLE vacancies
      ADD COLUMN IF NOT EXISTS review_comment TEXT,
      ADD COLUMN IF NOT EXISTS review_fields JSONB,
      ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
    `);

    console.log("✅ БАРЛЫҒЫ СӘТТІ ОРЫНДАЛДЫ!");
    
  } catch (err) {
    console.error("❌ ҚАТЕ ШЫҚТЫ:", err);
  } finally {
    await client.end();
  }
}

migrate();
