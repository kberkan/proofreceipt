export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-block rounded-full border border-gray-300 px-4 py-1 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
            OWS Hackathon • ProofReceipt
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Agent Payments + Verifiable Receipts
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            ProofReceipt turns OpenPay and Open Wallet Stack agent payments into
            verifiable digital receipts that can be used for refunds, warranty,
            expense reports, and proof-of-purchase verification.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/merchant"
              className="rounded-2xl bg-black px-6 py-3 text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              Create Payment QR
            </a>

            <a
              href="/verify"
              className="rounded-2xl border border-gray-300 px-6 py-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Verify Receipt
            </a>

            <a
              href="/agent"
              className="rounded-2xl border border-gray-300 px-6 py-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Agent Payment
            </a>

            <a
              href="/dashboard"
              className="rounded-2xl border border-gray-300 px-6 py-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Dashboard
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-xl font-semibold">Agent Payments</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Autonomous agents can make payments using Open Wallet Stack
              without accessing private keys.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-xl font-semibold">Verifiable Receipts</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Every payment generates a verifiable digital receipt that can be
              validated by merchants.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-xl font-semibold">Refund & Verification</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Merchants can verify receipts and issue refunds securely.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-2xl font-semibold">Why this matters</h3>
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
            QR payments and agent payments solve checkout, but they do not solve
            what happens after checkout. ProofReceipt adds a post-payment trust
            layer with verifiable receipts, refund validation, and merchant
            dashboards.
          </p>
        </div>
      </section>
    </main>
  );
}