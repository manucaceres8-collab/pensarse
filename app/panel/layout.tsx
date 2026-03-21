"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import { createClient } from "@/lib/supabase/client";

type MeUser = {
  id: string;
  name: string;
  email: string;
  role: "psicologo" | "paciente";
  clinicName: string | null;
};

const navItems = [
  { href: "/panel", label: "Dashboard", icon: "DB" },
  { href: "/panel/pacientes", label: "Pacientes", icon: "PA" },
  { href: "/panel/informes", label: "Informes", icon: "IN" },
  { href: "/panel/tareas", label: "Tareas", icon: "TA" },
  { href: "/panel/pacientes/nuevo", label: "Añadir paciente", icon: "+" },
];

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<MeUser | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { user: MeUser };
      if (mounted) {
        setMe(data.user);
      }
    }

    loadMe();

    return () => {
      mounted = false;
    };
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#edf1f7] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
          <aside className="h-fit rounded-[28px] border border-[#d7deea] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] lg:sticky lg:top-6">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-[#0f172a]">
                Pensar<span className="text-[#62789b]">(SE)</span>
              </p>
              <p className="text-xs text-[#6a7f9a]">Panel del psicólogo</p>
            </div>

            <div className="mt-4 rounded-2xl border border-[#d6deea] bg-[#f7f9fd] p-3">
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  src="/avatars/placeholder.svg"
                  fallbackSrc="/avatars/placeholder.svg"
                  alt="Perfil psicólogo"
                  size={64}
                  className="h-16 w-16 rounded-full border border-[#cfd9e8] object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-[#1f2d45]">{me?.name ?? "Psicólogo"}</p>
                  <p className="text-[11px] text-[#7086a2]">{me?.clinicName ?? "Piloto real"}</p>
                </div>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => {
                const active =
                  item.href === "/panel"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                      active
                        ? "border border-[#c8d4e6] bg-[#eef4ff] text-[#1f304b]"
                        : "border border-transparent text-[#334a67] hover:bg-[#f7f9fd]",
                    ].join(" ")}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-[#d5dcea] bg-white text-[10px] font-semibold text-[#1f304b]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-[#d8e0ec] pt-4">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#334a67] transition hover:bg-[#f7f9fd]"
              >
                <span>Cerrar sesión</span>
              </button>
            </div>
          </aside>

          <main className="rounded-[30px] border border-[#d7deea] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-[#dbe2ed] px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">Pensar(SE)</p>
                <p className="text-xs text-[#617896]">Psicólogo - Pilot real</p>
              </div>
              <span className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#1f304b]">
                Real
              </span>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
