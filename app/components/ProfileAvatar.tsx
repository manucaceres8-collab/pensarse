"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ProfileAvatarProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
};

export default function ProfileAvatar({
  src,
  fallbackSrc,
  alt,
  className = "",
}: ProfileAvatarProps) {
  const candidates = useMemo(() => {
    const png = src.endsWith(".jpg") ? src.replace(/\.jpg$/i, ".png") : src;
    return [src, png, fallbackSrc];
  }, [fallbackSrc, src]);

  const [index, setIndex] = useState(0);
  const finalSrc = candidates[Math.min(index, candidates.length - 1)];

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={160}
      height={160}
      className={className}
      onError={() => setIndex((prev) => Math.min(prev + 1, candidates.length - 1))}
      unoptimized
    />
  );
}
