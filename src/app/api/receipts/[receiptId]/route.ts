import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: Request,
  context: { params: Promise<{ receiptId: string }> }
) {
  const { receiptId } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("receipts")
    .select("*")
    .eq("id", receiptId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
