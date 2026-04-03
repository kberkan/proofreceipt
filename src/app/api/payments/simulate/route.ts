import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateReceiptHash } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId gerekli." }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    }

    const paymentReference = `PAY-${Date.now()}`;

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        payment_reference: paymentReference,
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const existingReceipt = await supabaseAdmin
      .from("receipts")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();

    if (existingReceipt.data?.id) {
      return NextResponse.json({
        success: true,
        receiptId: existingReceipt.data.id,
        paymentReference,
      });
    }

    const credential = {
      merchantName: order.merchant_name,
      itemName: order.item_name,
      amount: Number(order.amount),
      currency: order.currency,
      orderId: order.id,
      issuedAt: new Date().toISOString(),
      paymentReference,
      refundable: true,
      warrantyUntil: null,
    };

    const receiptHash = generateReceiptHash(credential);

    const { data: receipt, error: receiptError } = await supabaseAdmin
      .from("receipts")
      .insert({
        order_id: order.id,
        receipt_hash: receiptHash,
        credential_json: credential,
        refundable: true,
      })
      .select()
      .single();

    if (receiptError) {
      return NextResponse.json({ error: receiptError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      receiptId: receipt.id,
      paymentReference,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Simülasyon başarısız.", details: String(error) },
      { status: 500 }
    );
  }
}
