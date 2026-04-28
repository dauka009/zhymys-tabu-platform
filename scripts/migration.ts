import { query } from './src/lib/db';

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // 1. Create company_follows table
    await query(`
      CREATE TABLE IF NOT EXISTS company_follows (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, company_id)
      )
    `);
    console.log('Created company_follows table');

    // 2. Add unique constraints to slugs if they don't exist
    // Check for uniqueness first to avoid errors if already present
    try {
      await query(`ALTER TABLE companies ADD CONSTRAINT companies_slug_unique UNIQUE (slug)`);
      console.log('Added unique constraint to companies.slug');
    } catch (e) {
      console.log('Constraint on companies.slug might already exist');
    }

    try {
      await query(`ALTER TABLE vacancies ADD CONSTRAINT vacancies_slug_unique UNIQUE (slug)`);
      console.log('Added unique constraint to vacancies.slug');
    } catch (e) {
      console.log('Constraint on vacancies.slug might already exist');
    }

    console.log('Migration completed successfully!');
  } catch (e) {
    console.error('Migration failed:', e);
  }
}

migrate();
