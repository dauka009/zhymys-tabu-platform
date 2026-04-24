import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { rows } = await query(`SELECT * FROM companies WHERE owner_user_id = $1 LIMIT 1`, [userId]);
    
    if (rows.length === 0) {
      return NextResponse.json({ company: null });
    }

    return NextResponse.json({ company: rows[0] });
  } catch (error) {
    console.error('API /employer/company GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, displayName, legalName, logoUrl, description, websiteUrl } = body;

    if (!userId || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if company already exists
    const checkRes = await query(`SELECT id FROM companies WHERE owner_user_id = $1`, [userId]);

    const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    if (checkRes.rows.length > 0) {
      // Update existing
      const updateRes = await query(`
        UPDATE companies 
        SET display_name = $1, legal_name = $2, logo_url = $3, description = $4, website_url = $5
        WHERE owner_user_id = $6
        RETURNING *
      `, [displayName, legalName || displayName, logoUrl, description, websiteUrl, userId]);
      
      return NextResponse.json({ company: updateRes.rows[0] });
    } else {
      // Create new
      const insertRes = await query(`
        INSERT INTO companies (owner_user_id, slug, display_name, legal_name, logo_url, description, website_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [userId, slug, displayName, legalName || displayName, logoUrl, description, websiteUrl]);
      
      return NextResponse.json({ company: insertRes.rows[0] });
    }

  } catch (error) {
    console.error('API /employer/company POST error:', error);
    return NextResponse.json({ error: 'Failed to save company', details: (error as Error).message }, { status: 500 });
  }
}
