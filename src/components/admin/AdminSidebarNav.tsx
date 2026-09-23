"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminNavItem } from "@/lib/admin/navigation";
import { cn } from "@/lib/utils/cn";

type AdminSidebarNavProps = {
  items: AdminNavItem[];
  onNavigate?: () => void;
};

export function AdminSidebarNav({ items, onNavigate }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu administrativo">
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center rounded-sm px-3 text-body-sm font-semibold no-underline transition-colors",
                  isActive ? "bg-brand-primary text-text-inverse" : "text-text hover:bg-surface-secondary",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
