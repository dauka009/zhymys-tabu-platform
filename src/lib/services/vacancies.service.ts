import { query } from '@/lib/db';
import { Vacancy, JobType } from '@/types';

export async function getAllVacanciesFromDb(): Promise<Vacancy[]> {
  try {
    const sql = `
      SELECT 
        v.id, v.title, v.description, v.salary_min, v.salary_max, v.currency,
        v.employment_type, v.work_mode, v.created_at,
        c.id as company_id, c.display_name as company_name, c.logo_url
      FROM vacancies v
      LEFT JOIN companies c ON v.company_id = c.id
      WHERE v.deleted_at IS NULL AND v.status = 'PUBLISHED'
      ORDER BY v.created_at DESC
    `;
    
    const res = await query(sql);
    
    return res.rows.map(row => ({
      id: row.id,
      title: row.title,
      companyId: row.company_id,
      salary: {
        min: row.salary_min || 0,
        max: row.salary_max || undefined,
        currency: row.currency || 'KZT',
      },
      location: row.work_mode === 'REMOTE' ? 'Қашықтан' : 'Алматы',
      type: mapType(row.employment_type, row.work_mode),
      category: mapCategory(row.title, row.description),
      description: row.description || '',
      requirements: [],
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
      company: {
        id: row.company_id,
        name: row.company_name || 'Белгісіз компания',
        description: '',
        industry: '',
        location: '',
        contacts: {},
        logo: row.logo_url || '',
      }
    }));
  } catch (error) {
    console.error('Вакансияларды DB-дан алу кезінде қате:', error);
    return [];
  }
}

export async function getVacancyByIdFromDb(id: string): Promise<Vacancy | null> {
  try {
    const sql = `
      SELECT 
        v.id, v.title, v.description, v.salary_min, v.salary_max, v.currency,
        v.employment_type, v.work_mode, v.created_at,
        c.id as company_id, c.display_name as company_name, c.logo_url, c.description as company_description
      FROM vacancies v
      LEFT JOIN companies c ON v.company_id = c.id
      WHERE v.id = $1 AND v.deleted_at IS NULL
    `;
    
    const res = await query(sql, [id]);
    if (res.rowCount === 0) return null;

    const row = res.rows[0];
    return {
      id: row.id,
      title: row.title,
      companyId: row.company_id,
      salary: {
        min: row.salary_min || 0,
        max: row.salary_max || undefined,
        currency: row.currency || 'KZT',
      },
      location: row.work_mode === 'REMOTE' ? 'Қашықтан' : 'Алматы',
      type: mapType(row.employment_type, row.work_mode),
      category: mapCategory(row.title, row.description),
      description: row.description || '',
      requirements: [], // requirements can be added to DB later
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
      company: {
        id: row.company_id,
        name: row.company_name || 'Белгісіз компания',
        description: row.company_description || '',
        industry: '',
        location: '',
        contacts: {},
        logo: row.logo_url || '',
      }
    };
  } catch (error) {
    console.error('Vacancy fetch error:', error);
    return null;
  }
}

export async function getCompanyByIdFromDb(id: string): Promise<any | null> {
  try {
    const sql = `
      SELECT 
        c.id, c.slug, c.display_name, c.legal_name, c.description, 
        c.logo_url, c.website_url, c.verified, c.industry, c.employee_count
      FROM companies c
      WHERE c.id = $1 AND c.deleted_at IS NULL
    `;
    
    const res = await query(sql, [id]);
    if (res.rowCount === 0) return null;

    const row = res.rows[0];
    return {
      id: row.id,
      slug: row.slug,
      name: row.display_name,
      logo: row.logo_url || '🏢',
      description: row.description || '',
      industry: Array.isArray(row.industry) ? row.industry[0] || 'IT' : (row.industry || 'IT'),
      location: 'Қазақстан',
      size: row.employee_count ? `${row.employee_count}+` : '100+',
      contacts: {
        website: row.website_url,
      }
    };
  } catch (error) {
    console.error('Company fetch error:', error);
    return null;
  }
}

/** work_mode + employment_type → frontend type */
function mapType(employment: string, workMode: string): JobType {
  if (workMode === 'REMOTE') return 'remote';
  if (workMode === 'HYBRID') return 'hybrid';
  if (employment === 'PART_TIME') return 'part';
  if (employment === 'INTERNSHIP') return 'internship';
  return 'full';
}

/** Title/description-тан санат болжайды */
function mapCategory(title: string = '', description: string = ''): string {
  const text = (title + ' ' + description).toLowerCase();
  let category = 'other';
  
  if (/react|next|typescript|javascript|python|go|golang|devops|backend|frontend|developer|data|analyst|software|laravel|node|java|kubernetes|docker|маман|әзірлеуші/.test(text)) {
    category = 'it';
  } else if (/smm|маркетинг|marketing|менеджер|manager|product|таргет|реклама|digital|бренд|сату/.test(text)) {
    category = 'marketing';
  } else if (/бухгалтер|finance|қаржы|accounting|банк|bank|audit|аудит|excel|1с|есепші/.test(text)) {
    category = 'finance';
  } else if (/дизайн|design|figma|ui|ux|фотограф|видео|creative|график|суретші/.test(text)) {
    category = 'design';
  }
  
  return category;
}
