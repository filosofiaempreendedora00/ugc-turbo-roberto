"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Wand2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Clientes",
    href: "/dashboard",
    icon: Users,
  },
  {
    label: "Gerar Roteiro",
    href: "/gerar",
    icon: Wand2,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Wand2 size={14} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            UGC Studio
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-9">Gerador de Roteiros</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname.startsWith("/dashboard") || pathname.startsWith("/cliente")
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700 font-medium"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400">
          <Settings size={16} />
          <span>Configurações</span>
        </div>
        <p className="text-xs text-gray-300 px-3 mt-2">v1.0.0 · UGC Studio</p>
      </div>
    </aside>
  );
}
