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
  const groups: Array<{ key: AdminNavItem["group"]; title: string }> = [
    { key: "core", title: "Editorial" },
    { key: "taxonomy", title: "Organização" },
    { key: "system", title: "Sistema" },
  ];

  return (
    <nav aria-label="Menu administrativo">
      <div className="space-y-4">
        {groups.map((group) => {
          const groupItems = items.filter((item) => item.group === group.key);
          if (groupItems.length === 0) {
            return null;
          }

          return (
            <section key={group.key} className="space-y-1.5" aria-label={group.title}>
              <p className="px-1 text-caption font-semibold uppercase tracking-[0.08em] text-text-muted">{group.title}</p>
              <ul className="space-y-1">
                {groupItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex min-h-11 items-center rounded-sm px-3 text-body-sm font-semibold no-underline transition-colors",
                          isActive && item.featured ? "bg-brand-secondary text-text-inverse" : undefined,
                          isActive && !item.featured ? "bg-brand-primary text-text-inverse" : undefined,
                          !isActive && item.featured ? "bg-brand-accentLight text-text hover:bg-brand-accent" : undefined,
                          !isActive && !item.featured ? "text-text hover:bg-surface-secondary" : undefined,
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.featured ? "+ " : ""}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </nav>
  );
}
