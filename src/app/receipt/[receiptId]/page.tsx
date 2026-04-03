import { supabaseAdmin } from "@/lib/supabase";
import { generateQrDataUrl } from "@/lib/qrcode";

async function getReceipt(receiptId: string) {
  const { data, error } = await supabaseAdmin
    .from("receipts")
    .select("*")
    .eq("id", receiptId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return data;
}

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const { receiptId } = await params;
  const receipt = await getReceipt(receiptId);

  if (!receipt || "error" in receipt) {
    return <main className="p-8">Receipt bulunamadı.</main>;
  }

  const c = receipt.credential_json;
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?receiptId=${receipt.id}`;
  const qrDataUrl = await generateQrDataUrl(verifyUrl);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600">
                PAYMENT CONFIRMED
              </p>
              <h1 className="mt-2 text-3xl font-bold">ProofReceipt</h1>
            </div>
            <div className="rounded-full border border-gray-300 px-4 py-2 text-sm dark:border-gray-700">
              {receipt.refunded_at ? "Refunded" : "Active"}
            </div>
          </div>

          <div className="mt-8 space-y-4 text-[15px]">
            <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Merchant</span>
              <span className="text-right font-medium">{c.merchantName}</span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Item</span>
              <span className="text-right font-medium">{c.itemName}</span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Amount</span>
              <span className="text-right font-medium">
                {c.amount} {c.currency}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Order ID</span>
              <span className="break-all text-right font-medium">{c.orderId}</span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Payment Ref</span>
              <span className="text-right font-medium">{c.paymentReference}</span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Issued At</span>
              <span className="text-right font-medium">
                {new Date(c.issuedAt).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Refundable</span>
              <span className="text-right font-medium">
                {receipt.refundable ? "Yes" : "No"}
              </span>
            </div>

            {c.paidByAgent && (
              <>
                <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Paid by Agent</span>
                  <span className="text-right font-medium">Yes</span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Agent Name</span>
                  <span className="text-right font-medium">{c.agentName}</span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">Agent Address</span>
                  <span className="break-all text-right font-medium">
                    {c.agentAddress}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">Receipt Hash</span>
              <span className="break-all text-right font-medium">
                {receipt.receipt_hash}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`/verify?receiptId=${receipt.id}`}
              className="rounded-2xl bg-black px-5 py-3 text-white dark:bg-white dark:text-black"
            >
              Verify Receipt
            </a>
            <a
              href={`/refund/${receipt.id}`}
              className="rounded-2xl border border-gray-300 px-5 py-3 dark:border-gray-700"
            >
              Refund
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-2xl font-bold">Verification QR</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Merchants can scan this QR to verify receipt validity before refund,
            warranty, or proof-of-purchase actions.
          </p>

          <div className="mt-8 flex justify-center rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-black">
            <img
              src={qrDataUrl}
              alt="Verification QR"
              className="h-72 w-72 rounded-xl bg-white p-2"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm break-all text-gray-600 dark:border-gray-800 dark:bg-black dark:text-gray-300">
            {verifyUrl}
          </div>
        </div>
      </div>
    </main>
  );
}