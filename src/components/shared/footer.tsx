import Link from "next/link";

const footerLinks = [
  { label: "隐私政策", href: "/privacy" },
  { label: "使用条款", href: "/terms" },
  { label: "联系我们", href: "mailto:support@resumeboost.com" },
];

export function Footer() {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#1d1d1f]">
      <div className="mx-auto max-w-[980px] px-4 lg:px-0">
        <div className="border-t border-[#d2d2d7]/60 dark:border-[#424245]/60 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[12px] text-[#86868b]">
              Copyright &copy; {new Date().getFullYear()} Oct7. 保留所有权利。
            </p>
            <div className="flex items-center gap-5">
              {footerLinks.map((link, i) => (
                <span key={link.href} className="flex items-center gap-5">
                  <Link
                    href={link.href}
                    className="text-[12px] text-[#424245] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                  {i < footerLinks.length - 1 && (
                    <span className="text-[#d2d2d7] dark:text-[#424245]">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
