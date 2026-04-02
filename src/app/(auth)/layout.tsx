import { SessionProvider } from "@/components/shared/session-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/60 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
        <header className="flex items-center justify-center py-8">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <span className="text-emerald-500">Oct</span>7
          </a>
        </header>

        <main className="flex-1 flex items-start justify-center px-5 pt-4 pb-16 sm:pt-8">
          <div className="w-full max-w-[400px] bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-emerald-500/5 border border-emerald-100/80 dark:border-gray-800 px-8 py-10 sm:px-10 sm:py-12">
            {children}
          </div>
        </main>

        <footer className="py-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Oct7. All rights reserved.
          </p>
        </footer>
      </div>
    </SessionProvider>
  );
}
