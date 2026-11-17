"use client";

import {
  Compass,
  GraduationCap,
  Image as ImageIcon,
  Newspaper,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type FallbackIconName =
  | "newspaper"
  | "compass"
  | "graduation"
  | "image"
  | "user";

const FALLBACK_ICONS: Record<FallbackIconName, LucideIcon> = {
  newspaper: Newspaper,
  compass: Compass,
  graduation: GraduationCap,
  image: ImageIcon,
  user: UserRound,
};

type SafeImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallback?: "icon" | "initials";
  fallbackIcon?: FallbackIconName;
  fallbackText?: string;
};

export default function SafeImage({
  src,
  alt,
  className = "",
  sizes,
  priority,
  fallback = "icon",
  fallbackIcon,
  fallbackText,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;
  const Icon = fallbackIcon ? FALLBACK_ICONS[fallbackIcon] : null;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950"
      >
        <div className="bg-grid-white absolute inset-0 opacity-40" aria-hidden />
        {fallback === "initials" && fallbackText ? (
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-2xl font-extrabold text-white shadow-lg shadow-navy-950/50">
            {fallbackText}
          </span>
        ) : Icon ? (
          <Icon className="relative h-12 w-12 text-emerald-300/70" />
        ) : null}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes ?? "100vw"}
      onError={() => setFailed(true)}
      unoptimized={/^https?:\/\//i.test(src)}
      className={`object-cover ${className}`}
    />
  );
}
