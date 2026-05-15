"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  nome: string;
  email: string;
  picture: string | null;
  role: "admin" | "analista";
};

export function UsuarioMenu({ nome, email, picture, role }: Props) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div ref={ref} className="fixed top-4 right-6 z-50">
      <button
        onClick={() => setAberto((v) => !v)}
        className={cn(
          "flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow transition-all duration-150",
          aberto && "shadow",
        )}
      >
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={picture} alt={nome} className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center text-[11px] font-semibold">
            {iniciais || "?"}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 max-w-[140px] truncate">
          {nome.split(" ")[0]}
        </span>
      </button>

      {aberto && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{nome}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
            {role === "admin" && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-semibold">
                <Shield size={10} /> Admin
              </span>
            )}
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
            >
              <LogOut size={14} />
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
