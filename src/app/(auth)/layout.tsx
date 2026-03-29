import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="absolute top-0 left-0 right-0">
        <div className="mx-auto flex h-12 max-w-[980px] items-center px-4">
          <Link href="/" className="text-[21px] font-semibold text-gray-900/90">
            ResumeBoost
          </Link>
        </div>
        <div className="h-px bg-gray-900/10" />
      </div>
      <div className="w-full max-w-[400px] px-4 py-20">
        {children}
      </div>
    </div>
  );
}
