"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    params.then((p) => setOrderId(p.orderId));
  }, [params]);

  const simulatePayment = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) {
        throw new Error(data.error || "Payment simulation failed");
      }

      if (data.receiptId) {
        router.push(`/receipt/${data.receiptId}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Hata: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h1 className="text-3xl font-bold">Complete Payment</h1>
          <p className="mt-3 break-all text-gray-600 dark:text-gray-300">
            Order ID: {orderId}
          </p>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-black">
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              This demo uses a simulated OpenPay payment flow for hackathon presentation purposes.
            </p>

            <button
              onClick={simulatePayment}
              className="rounded-2xl bg-black px-6 py-3 text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              {loading ? "Processing..." : "Simulate Payment"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}