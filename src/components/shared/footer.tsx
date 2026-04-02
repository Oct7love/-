import Link from "next/link";

const footerLinks = [
  { label: "隐私政策", href: "/privacy" },
  { label: "使用条款", href: "/terms" },
  { label: "联系我们", href: "mailto:support@resumeboost.com" },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="mx-auto max-w-[980px] px-4 lg:px-0 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            Copyright &copy; {new Date().getFullYear()} Oct7. 保留所有权利。
          </p>
          <div className="flex items-center gap-5">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-400 hover:text-emerald-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
