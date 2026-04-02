import { SessionProvider } from "@/components/shared/session-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          {children}
        </div>
        <footer className="py-6 text-center text-[12px] text-gray-300">
          &copy; {new Date().getFullYear()} Oct7
        </footer>
      </div>
    </SessionProvider>
  );
}
