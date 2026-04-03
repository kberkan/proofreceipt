import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "ProofReceipt",
  description: "OpenPay QR with verifiable proof of purchase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-black/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="text-lg font-bold">
              ProofReceipt
            </a>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}