import { supabaseAdmin } from "@/lib/supabase";

async function getDashboardData() {
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: receipts } = await supabaseAdmin
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false });

  const totalOrders = orders?.length || 0;
  const paidOrders = orders?.filter((o) => o.status === "paid").length || 0;
  const totalRevenue =
    orders
      ?.filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + Number(o.amount || 0), 0) || 0;
  const totalRefunds = receipts?.filter((r) => !!r.refunded_at).length || 0;

  return {
    orders: orders || [],
    receipts: receipts || [],
    stats: {
      totalOrders,
      paidOrders,
      totalRevenue,
      totalRefunds,
    },
  };
}

export default async function DashboardPage() {
  const { orders, receipts, stats } = await getDashboardData();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Merchant Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track orders, receipts, revenue, and refunds.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
            <p className="mt-3 text-3xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">Paid Orders</p>
            <p className="mt-3 text-3xl font-bold">{stats.paidOrders}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="mt-3 text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">Refunds</p>
            <p className="mt-3 text-3xl font-bold">{stats.totalRefunds}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <div className="mt-6 space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No orders yet.</p>
              ) : (
                orders.slice(0, 8).map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{order.item_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {order.merchant_name}
                        </p>
                        <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">
                          {order.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {order.amount} {order.currency}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl font-bold">Recent Receipts</h2>
            <div className="mt-6 space-y-4">
              {receipts.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No receipts yet.</p>
              ) : (
                receipts.slice(0, 8).map((receipt) => (
                  <div
                    key={receipt.id}
                    className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold break-all">{receipt.id}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {receipt.refundable ? "Refundable" : "Not refundable"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {receipt.refunded_at ? "Refunded" : "Active"}
                        </p>
                        <a
                          href={`/receipt/${receipt.id}`}
                          className="mt-2 inline-block text-sm underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}