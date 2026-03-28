"use client";

import { useMemo, useState } from "react";

type ProfileAvatarProps = {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  size?: 64 | 80 | 160;
  className?: string;
};

export default function ProfileAvatar({
  src,
  fallbackSrc = "/avatars/placeholder.svg",
  alt,
  size = 80,
  className = "",
}: ProfileAvatarProps) {
  const candidates = useMemo(() => {
    const normalized = src?.trim() || "";
    const png = normalized.endsWith(".jpg") ? normalized.replace(/\.jpg$/i, ".png") : normalized;
    return [normalized, png, fallbackSrc].filter((item): item is string => Boolean(item));
  }, [fallbackSrc, src]);

  const [index, setIndex] = useState(0);
  const finalSrc = candidates[Math.min(index, candidates.length - 1)];

  return (
    <img
      src={finalSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => setIndex((prev) => Math.min(prev + 1, candidates.length - 1))}
    />
  );
}
