"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/mi", label: "Inicio", icon: "IN" },
  { href: "/mi/evolucion", label: "Evolución", icon: "EV" },
  { href: "/mi/tareas", label: "Tareas", icon: "TA" },
];

export default function MiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profileName, setProfileName] = useState("Paciente");
  const [profileRole, setProfileRole] = useState("Paciente");
  const [avatarSrc, setAvatarSrc] = useState("/avatars/placeholder.svg");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      let supabase;
      try {
        supabase = createClient();
      } catch {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted || !user) return;

      const [{ data: profile }, { data: patient }] = await Promise.all([
        supabase.from("profiles").select("name, role").eq("id", user.id).maybeSingle(),
        user.email
          ? supabase.from("patients").select("avatar_url").eq("email", user.email).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      if (!mounted) return;

      setProfileName(profile?.name?.trim() || user.email || "Paciente");
      setProfileRole(profile?.role === "paciente" ? "Paciente" : "Usuario");
      setAvatarSrc(patient?.avatar_url || "/avatars/placeholder.svg");
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_42%,#ffffff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div className="absolute left-[6%] top-[-52px] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(103,197,236,0.32)_0%,rgba(103,197,236,0)_72%)] blur-[78px]" />
        <div className="absolute right-[4%] top-[22px] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(18,114,183,0.15)_0%,rgba(18,114,183,0)_75%)] blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
          <aside className="h-fit rounded-[30px] border border-[#d8e4ef] bg-white/92 p-5 shadow-[0_22px_40px_rgba(15,23,42,0.07)] backdrop-blur lg:sticky lg:top-6">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-[#0f172a]">
                Pensar<span className="text-[#1272b7]">(SE)</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#6a7f9a]">Espacio del paciente</p>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f9fd_100%)] p-3.5">
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  src={avatarSrc}
                  fallbackSrc="/avatars/placeholder.svg"
                  alt="Perfil paciente"
                  size={64}
                  className="h-16 w-16 rounded-full border border-[#cfd9e8] bg-white object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1f2d45]">{profileName}</p>
                  <p className="mt-0.5 text-[11px] text-[#7086a2]">{profileRole}</p>
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
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition duration-200",
                      active
                        ? "border border-[#c8d9ea] bg-[linear-gradient(180deg,#f5fbff_0%,#edf5ff_100%)] text-[#163150] shadow-[0_10px_20px_rgba(18,114,183,0.10)]"
                        : "border border-transparent text-[#4e6582] hover:-translate-y-0.5 hover:bg-[#f8fbff]",
                    ].join(" ")}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-[#d5dcea] bg-white text-[10px] font-semibold text-[#5d7595]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-[#d8e0ec] pt-4">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-2xl border border-transparent px-3 py-2.5 text-sm font-medium text-[#4e6582] transition duration-200 hover:bg-[#f8fbff]"
              >
                <span>Volver a login</span>
              </Link>
            </div>
          </aside>

          <main className="overflow-hidden rounded-[32px] border border-[#d8e4ef] bg-white/92 shadow-[0_24px_48px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-[#e5edf5] bg-white/70 px-5 py-4 backdrop-blur sm:px-6">
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">Pensar(SE)</p>
                <p className="mt-0.5 text-xs text-[#617896]">Paciente · seguimiento entre sesiones</p>
              </div>
              <span className="rounded-full border border-[#d8e4ef] bg-[#f5fbff] px-3 py-1 text-xs font-medium text-[#1272b7]">
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
