"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Accediendo...");

  useEffect(() => {
    let mounted = true;

    async function resolveSession() {
      let supabase;
      try {
        supabase = createClient();
      } catch (error) {
        console.error("[auth-callback] createClient failed", error);
        router.replace("/acceso-paciente");
        return;
      }

      try {
        setStatus("Preparando tu sesión...");

        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "");

        const code = searchParams.get("code");
        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        const hashAccessToken = hashParams.get("access_token");
        const hashRefreshToken = hashParams.get("refresh_token");

        console.info("[auth-callback] url params", {
          pathname: window.location.pathname,
          hasCode: Boolean(code),
          hasTokenHash: Boolean(tokenHash),
          type,
          hasHashAccessToken: Boolean(hashAccessToken),
          hasHashRefreshToken: Boolean(hashRefreshToken),
        });

        const hasNewMagicLinkPayload =
          Boolean(code) ||
          (Boolean(tokenHash) && Boolean(type)) ||
          (Boolean(hashAccessToken) && Boolean(hashRefreshToken));

        if (hasNewMagicLinkPayload) {
          const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
          if (signOutError) {
            console.warn("[auth-callback] local signOut before processing link failed", signOutError.message);
          } else {
            console.info("[auth-callback] cleared previous local session");
          }
        }

        if (code) {
          console.info("[auth-callback] processing code with exchangeCodeForSession");
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("[auth-callback] exchangeCodeForSession failed", error.message);
          } else {
            console.info("[auth-callback] exchangeCodeForSession ok", {
              hasSession: Boolean(data.session),
              userId: data.user?.id ?? null,
            });
          }
        } else if (tokenHash && type) {
          console.info("[auth-callback] processing token_hash with verifyOtp", { type });
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as EmailOtpType,
          });
          if (error) {
            console.error("[auth-callback] verifyOtp failed", error.message);
          } else {
            console.info("[auth-callback] verifyOtp ok", {
              hasSession: Boolean(data.session),
              userId: data.user?.id ?? null,
            });
          }
        } else if (hashAccessToken && hashRefreshToken) {
          console.info("[auth-callback] processing hash tokens with setSession");
          const { data, error } = await supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          });
          if (error) {
            console.error("[auth-callback] setSession failed", error.message);
          } else {
            console.info("[auth-callback] setSession ok", {
              hasSession: Boolean(data.session),
              userId: data.user?.id ?? null,
            });
          }
        } else {
          console.info("[auth-callback] no explicit magic-link payload detected; using current session");
        }

        if (window.location.hash) {
          window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[auth-callback] getSession failed", sessionError.message);
        }

        console.info("[auth-callback] session check", {
          hasSession: Boolean(session),
          sessionUserId: session?.user?.id ?? null,
        });

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("[auth-callback] getUser failed", userError.message);
        }

        console.info("[auth-callback] final user", {
          userId: user?.id ?? null,
          email: user?.email ?? null,
        });

        if (!mounted || !user) {
          router.replace("/acceso-paciente");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("[auth-callback] profile lookup failed", profileError.message);
          router.replace("/acceso-paciente");
          return;
        }

        console.info("[auth-callback] final role", {
          userId: user.id,
          role: profile?.role ?? null,
        });

        if (!mounted) return;

        if (profile?.role === "paciente") {
          router.replace("/mi");
          return;
        }

        if (profile?.role === "psicologo") {
          router.replace("/panel");
          return;
        }

        router.replace("/acceso-paciente");
      } catch (error) {
        console.error("[auth-callback] unexpected error", error);
        if (mounted) {
          router.replace("/acceso-paciente");
        }
      }
    }

    resolveSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf1f7] px-6 py-10 text-[#0f172a]">
      <section className="w-full max-w-md rounded-[26px] border border-[#d7deea] bg-white p-8 text-center shadow-[0_6px_24px_rgba(15,23,42,0.05)] md:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a]">
          Pensar<span className="text-[#4f7fbf]">(SE)</span>
        </h1>
        <p className="mt-4 text-sm text-[#546a87]">{status}</p>
      </section>
    </main>
  );
}
