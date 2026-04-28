import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const { rows } = await query(`SELECT * FROM companies WHERE id = $1`, [id]);
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status, comment, fields } = body;

    await query(
      `UPDATE companies 
       SET review_status = $1, review_comment = $2, review_fields = $3, reviewed_at = NOW()
       WHERE id = $4`,
      [status, comment || null, fields ? JSON.stringify(fields) : null, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
