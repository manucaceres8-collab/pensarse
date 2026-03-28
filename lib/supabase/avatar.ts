import type { SupabaseClient } from "@supabase/supabase-js";

export const AVATARS_BUCKET = "avatars";
export const AVATAR_URL_TTL = 60 * 60;

type AppRole = "psicologo" | "paciente";

export function buildAvatarPath(role: AppRole, userId: string) {
  return role === "psicologo" ? `psychologists/${userId}.jpg` : `patients/${userId}.jpg`;
}

export async function createAvatarSignedUrl(
  supabase: SupabaseClient,
  path?: string | null,
  expiresIn = AVATAR_URL_TTL
) {
  const normalizedPath = path?.trim() || "";

  if (!normalizedPath) return null;
  if (normalizedPath.startsWith("/")) return normalizedPath;

  const { data, error } = await supabase.storage.from(AVATARS_BUCKET).createSignedUrl(normalizedPath, expiresIn);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
