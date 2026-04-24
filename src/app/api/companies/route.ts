import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        c.id, c.slug, c.display_name, c.legal_name, c.description, 
        c.short_description, c.logo_url, c.website_url, c.verified,
        c.industry, c.employee_count,
        COUNT(v.id) FILTER (WHERE v.status = 'PUBLISHED' AND v.deleted_at IS NULL) as open_vacancies_count
      FROM companies c
      LEFT JOIN vacancies v ON v.company_id = c.id
      WHERE c.deleted_at IS NULL
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    const companies = result.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      name: row.display_name,
      logo: row.logo_url || '🏢',
      description: row.description || row.short_description || '',
      industry: Array.isArray(row.industry) ? row.industry[0] || 'IT' : (row.industry || 'IT'),
      location: 'Қазақстан',
      size: formatSize(row.employee_count),
      openVacancies: parseInt(row.open_vacancies_count) || 0,
      verified: row.verified || false,
      website: row.website_url || '',
      contacts: {},
    }));

    return NextResponse.json(companies);
  } catch (error) {
    console.error('API /companies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

function formatSize(count: number | null): string {
  if (!count) return 'Белгісіз';
  if (count < 50) return '1-50';
  if (count < 200) return '50-200';
  if (count < 500) return '200-500';
  if (count < 1000) return '500-1000';
  return '1000+';
}
