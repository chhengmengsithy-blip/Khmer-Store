import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col">
      {/* Minimal header with logo */}
      <header className="w-full px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-[#F5F5F2] font-[family-name:var(--font-playfair)] hover:text-[#C6A769] transition-colors"
        >
          Khmer<span className="text-[#C6A769]">Store</span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
