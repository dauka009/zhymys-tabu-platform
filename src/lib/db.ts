import { Pool } from 'pg';

// Global айнымалыны қолдану (Next.js development режимінде Hot Reload көп рет шақырылғанда
// мәліметтер қорына қосылу саны асып кетпеуі үшін (Connection leak))
const globalForPg = global as unknown as { pgPool: Pool };

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Егер .env файлында көрсетілмесе, төмендегі әдепкі localhost мәндері қолданылады
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'jumys_tab_db',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

/**
 * SQL сұранысын орындауға арналған ыңғайлы функция
 * Мысалы: query('SELECT * FROM users WHERE email = $1', ['test@test.kz'])
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  // Консольде сұраныстың қанша уақыт алғанын көріп отыру үшін (Debugging)
  console.log('Жасалынған SQL сұраныс:', { text, уақыты: `${duration}ms`, табылған_жолдар: res.rowCount });
  return res;
}
