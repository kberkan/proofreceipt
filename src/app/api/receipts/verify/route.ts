import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { receiptId } = body;

  if (!receiptId) {
    return NextResponse.json({ error: "receiptId gerekli." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("receipts")
    .select("*")
    .eq("id", receiptId)
    .single();

  if (error || !data) {
    return NextResponse.json({
      valid: false,
      message: "Receipt bulunamadı.",
    });
  }

  return NextResponse.json({
    valid: true,
    refunded: !!data.refunded_at,
    refundable: data.refundable,
    receipt: data,
  });
}
