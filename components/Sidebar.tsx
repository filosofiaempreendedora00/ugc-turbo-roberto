"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Wand2, Settings, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Central de Referências",
    href: "/referencias",
    icon: BookMarked,
  },
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
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-100 flex flex-col z-40 shadow-[1px_0_0_0_#f1f1f1]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Wand2 size={15} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm tracking-tight leading-none">
              UGC Studio
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none">Gerador de Roteiros</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-150">
          <Settings size={16} className="flex-shrink-0" />
          <span>Configurações</span>
        </button>
        <p className="text-[10px] text-gray-300 px-3 mt-2">v1.0.0 · UGC Studio</p>
      </div>
    </aside>
  );
}
