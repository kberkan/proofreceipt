"use client";

import { useState } from "react";

export default function MerchantPage() {
  const [merchantName, setMerchantName] = useState("OpenWallet Demo Store");
  const [itemName, setItemName] = useState("Conference Ticket");
  const [amount, setAmount] = useState("25");
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState<null | {
    orderId: string;
    paymentUrl: string;
    qrDataUrl: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  const createPayment = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantName,
          itemName,
          amount: Number(amount),
          currency,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) {
        throw new Error(data.error || "Payment creation failed");
      }

      setResult(data);
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
          <h1 className="text-3xl font-bold">Merchant Panel</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Create an OpenPay QR payment and issue a verifiable digital receipt after payment.
          </p>

          <div className="mt-8 space-y-4">
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-black dark:border-gray-800 dark:bg-black dark:text-white"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="Merchant Name"
            />
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-black dark:border-gray-800 dark:bg-black dark:text-white"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Item Name"
            />
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-black dark:border-gray-800 dark:bg-black dark:text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-black dark:border-gray-800 dark:bg-black dark:text-white"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="Currency"
            />

            <button
              onClick={createPayment}
              className="rounded-2xl bg-black px-6 py-3 text-white dark:bg-white dark:text-black"
            >
              {loading ? "Creating..." : "Create Payment QR"}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
            <p className="mt-1 break-all font-medium">{result.orderId}</p>

            <a
              className="mt-6 inline-block rounded-2xl border border-gray-300 px-5 py-3 dark:border-gray-700"
              href={result.paymentUrl}
            >
              Open payment page
            </a>

            <div className="mt-8 flex justify-center rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-black">
              <img src={result.qrDataUrl} alt="Payment QR" className="h-72 w-72 rounded-xl bg-white p-2" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}