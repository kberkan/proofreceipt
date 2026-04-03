import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateQrDataUrl } from "@/lib/qrcode";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { merchantName, itemName, amount, currency = "USD" } = body;

    if (!merchantName || !itemName || !amount) {
      return NextResponse.json(
        { error: "merchantName, itemName ve amount zorunlu." },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        merchant_name: merchantName,
        item_name: itemName,
        amount,
        currency,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${order.id}`;
    const qrDataUrl = await generateQrDataUrl(paymentUrl);

    return NextResponse.json({
      orderId: order.id,
      paymentUrl,
      qrDataUrl,
      status: order.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ödeme oluşturulamadı.", details: String(error) },
      { status: 500 }
    );
  }
}
