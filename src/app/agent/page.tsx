"use client";

import { useEffect, useState } from "react";

export default function AgentPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAgentInfo = async () => {
      try {
        const res = await fetch("/api/agent/info");
        const data = await res.json();
        setAgentInfo(data);
      } catch (error) {
        console.error("Failed to load agent info", error);
      }
    };

    loadAgentInfo();
  }, []);

  const agentPay = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/agent/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Agent payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h1 className="text-3xl font-bold">OWS Agent Payment</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Execute a payment with an autonomous agent powered by Open Wallet Stack.
          </p>
        </div>

        {agentInfo && (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Agent Wallet
                </p>
                <h2 className="mt-2 text-2xl font-bold">{agentInfo.agentName}</h2>
              </div>

              <div className="rounded-full border border-gray-300 px-4 py-2 text-sm dark:border-gray-700">
                {agentInfo.walletProvider}
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black">
                <p className="mb-2 font-medium text-gray-500 dark:text-gray-400">
                  Agent Address
                </p>
                <p className="break-all font-mono text-sm">{agentInfo.agentAddress}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black">
                <p className="mb-2 font-medium text-gray-500 dark:text-gray-400">
                  Signing Mode
                </p>
                <p>{agentInfo.signingMode}</p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-2xl font-bold">Pay Existing Order</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Paste an existing order ID from the merchant flow, then let the OWS agent pay it.
          </p>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-2xl border border-gray-300 p-4 dark:border-gray-700 dark:bg-black"
              placeholder="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />

            <button
              onClick={agentPay}
              className="rounded-2xl bg-black px-6 py-3 text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              {loading ? "Processing..." : "Agent Pay Order"}
            </button>
          </div>

          {result && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>

              {result.receiptUrl && (
                <a
                  href={result.receiptUrl}
                  className="mt-4 inline-block rounded-2xl border border-gray-300 px-5 py-3 dark:border-gray-700"
                >
                  View Receipt
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}