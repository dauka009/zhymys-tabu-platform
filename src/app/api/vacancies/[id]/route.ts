import { NextResponse } from 'next/server';
import { getVacancyByIdFromDb } from '@/lib/services/vacancies.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vacancy = await getVacancyByIdFromDb(id);
    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 });
    }
    return NextResponse.json(vacancy);
  } catch (error) {
    console.error('API /vacancies/[id] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch vacancy' }, { status: 500 });
  }
}
