const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'jumys_tab_db',
});

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // 1. Create company_follows table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_follows (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, company_id)
      )
    `);
    console.log('✅ Created company_follows table');

    // 2. Add unique constraints to slugs
    try {
      await pool.query(`ALTER TABLE companies ADD CONSTRAINT companies_slug_unique UNIQUE (slug)`);
      console.log('✅ Added unique constraint to companies.slug');
    } catch (e) {
      console.log('ℹ️ companies.slug unique constraint already exists');
    }

    try {
      await pool.query(`ALTER TABLE vacancies ADD CONSTRAINT vacancies_slug_unique UNIQUE (slug)`);
      console.log('✅ Added unique constraint to vacancies.slug');
    } catch (e) {
      console.log('ℹ️ vacancies.slug unique constraint already exists');
    }

    console.log('🚀 Migration completed successfully!');
  } catch (e) {
    console.error('❌ Migration failed:', e);
  } finally {
    await pool.end();
  }
}

migrate();
