"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ProfileAvatar from "../components/ProfileAvatar";

const navItems = [
  { href: "/mi", label: "Inicio", icon: "IN" },
  { href: "/mi/evolucion", label: "Evolucion", icon: "EV" },
  { href: "/mi/tareas", label: "Tareas", icon: "TA" },
];

export default function MiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-[var(--border)] bg-white/95 p-5 shadow-[0_14px_38px_rgba(37,99,235,0.12)] lg:sticky lg:top-6">
            <div>
              <p className="text-lg font-semibold tracking-tight">
                Pensar<span className="text-[var(--primary)]">(SE)</span>
              </p>
              <p className="text-xs text-slate-500">Espacio del paciente</p>
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  src="/profiles/paciente-1.jpg"
                  fallbackSrc="/paciente-maria.svg"
                  alt="Perfil paciente"
                  className="h-10 w-10 rounded-full border border-blue-100 object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Maria Lopez</p>
                  <p className="text-[11px] text-slate-500">Paciente</p>
                </div>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => {
                const active =
                  item.href === "/mi"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                      active
                        ? "border border-blue-200 bg-[var(--primary-soft)] text-blue-700"
                        : "border border-transparent text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-500">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-[var(--border)] pt-4">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                <span>Volver a login</span>
              </Link>
            </div>
          </aside>

          <main className="rounded-3xl border border-[var(--border)] bg-white/95 shadow-[0_14px_38px_rgba(37,99,235,0.12)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-slate-900">Pensar(SE)</p>
                <p className="text-xs text-slate-500">Paciente - Seguimiento entre sesiones</p>
              </div>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
                Demo
              </span>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
