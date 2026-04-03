"use client";

import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [receiptId, setReceiptId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("receiptId");
    if (id) setReceiptId(id);
  }, []);

  const verify = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/receipts/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptId }),
      });

      const text = await res.text();
      const data = JSON.parse(text);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert(`Verify hatası: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h1 className="text-3xl font-bold">Verify Receipt</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Check receipt validity, refund status, and merchant-side proof.
          </p>

          <div className="mt-8 space-y-4">
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-black dark:border-gray-800 dark:bg-black dark:text-white"
              value={receiptId}
              onChange={(e) => setReceiptId(e.target.value)}
              placeholder="Receipt ID"
            />
            <button
              onClick={verify}
              className="rounded-2xl bg-black px-5 py-3 text-white dark:bg-white dark:text-black"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>

          {result && (
            <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-black">
              <div className="space-y-3">
                <p>
                  <strong>Valid:</strong> {result.valid ? "Yes" : "No"}
                </p>
                {result.valid ? (
                  <>
                    <p>
                      <strong>Refunded:</strong> {result.refunded ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Refundable:</strong> {result.refundable ? "Yes" : "No"}
                    </p>
                    <p className="break-all">
                      <strong>Receipt ID:</strong> {result.receipt.id}
                    </p>
                  </>
                ) : (
                  <p>{result.message}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}