"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "首页", icon: "home" },
  { href: "/shop", label: "商城", icon: "storefront" },
  { href: "/scan", label: "", icon: "add", isCenter: true },
  { href: "/messages", label: "消息", icon: "notifications" },
  { href: "/profile", label: "我的", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm border-t border-surface-light dark:border-surface-dark z-50">
      <nav className="flex justify-around items-center px-2 py-2 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-primary/30 border-4 border-background-light dark:border-background-dark">
                  <span className="material-symbols-outlined text-white text-3xl">
                    {item.icon}
                  </span>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-subtle-light dark:text-subtle-dark hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
