import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(
  _req: Request,
  context: { params: Promise<{ receiptId: string }> }
) {
  const { receiptId } = await context.params;

  const { data: receipt, error: receiptError } = await supabaseAdmin
    .from("receipts")
    .select("*")
    .eq("id", receiptId)
    .single();

  if (receiptError || !receipt) {
    return NextResponse.json({ error: "Receipt bulunamadı." }, { status: 404 });
  }

  if (receipt.refunded_at) {
    return NextResponse.json({ error: "Bu receipt zaten refund edilmiş." }, { status: 400 });
  }

  const refundReference = `REF-${Date.now()}`;

  const { error: insertError } = await supabaseAdmin.from("refunds").insert({
    receipt_id: receiptId,
    status: "completed",
    refund_reference: refundReference,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("receipts")
    .update({
      refunded_at: new Date().toISOString(),
      refundable: false,
    })
    .eq("id", receiptId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    refundReference,
  });
}
