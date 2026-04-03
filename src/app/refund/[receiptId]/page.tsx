"use client";

import { useEffect, useState } from "react";

export default function RefundPage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const [receiptId, setReceiptId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then((p) => setReceiptId(p.receiptId));
  }, [params]);

  const issueRefund = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/receipts/${receiptId}/refund`, {
        method: "POST",
      });

      const text = await res.text();
      const data = JSON.parse(text);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert(`Refund hatası: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h1 className="text-3xl font-bold">Refund Receipt</h1>
          <p className="mt-3 break-all text-gray-600 dark:text-gray-300">
            Receipt ID: {receiptId}
          </p>

          <div className="mt-8">
            <button
              onClick={issueRefund}
              className="rounded-2xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              {loading ? "Processing..." : "Issue Refund"}
            </button>
          </div>

          {result && (
            <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-black">
              {result.success ? (
                <div className="space-y-2">
                  <p className="font-semibold text-green-600">Refund completed</p>
                  <p className="break-all text-gray-600 dark:text-gray-300">
                    Reference: {result.refundReference}
                  </p>
                </div>
              ) : (
                <p className="text-red-600">{result.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}