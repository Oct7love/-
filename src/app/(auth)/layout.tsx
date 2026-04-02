import { SessionProvider } from "@/components/shared/session-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-[#f5f5f7] dark:bg-[#111111]">
        <header className="flex items-center justify-center py-6">
          <a href="/" className="text-[21px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            Oct7
          </a>
        </header>

        <main className="flex-1 flex items-start justify-center px-6 pt-6 pb-16 sm:pt-12">
          <div className="w-full max-w-[400px] bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-[#d2d2d7]/60 dark:border-[#38383a] px-8 py-10 sm:px-10 sm:py-12">
            {children}
          </div>
        </main>

        <footer className="py-6 text-center">
          <p className="text-[12px] text-[#86868b]">
            &copy; {new Date().getFullYear()} Oct7. All rights reserved.
          </p>
        </footer>
      </div>
    </SessionProvider>
  );
}
