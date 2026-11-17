import { Clock, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { SiteConfig } from "@/generated/prisma/client";
import { NAV_LINKS } from "@/lib/nav";
import {
  InstagramIcon,
  TelegramIcon,
  YoutubeIcon,
} from "./SocialIcons";

type FooterProps = {
  config: SiteConfig | null;
};

export default function Footer({ config }: FooterProps) {
  const name = config?.collegeName ?? "Texnikum";
  const phones = (config?.phones ?? "")
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);

  const socials = [
    { href: config?.telegramUrl ?? "", label: "Telegram", Icon: TelegramIcon },
    { href: config?.instagramUrl ?? "", label: "Instagram", Icon: InstagramIcon },
    { href: config?.youtubeUrl ?? "", label: "YouTube", Icon: YoutubeIcon },
  ].filter((social) => social.href);

  return (
    <footer className="relative bg-navy-950 text-slate-300">
      <div
        className="h-px w-full bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-400 opacity-60"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl overflow-hidden px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative grid gap-12 lg:grid-cols-[1.35fr_0.85fr_1.15fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
                <GraduationCap className="h-6 w-6 text-white" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                {name}
              </span>
            </Link>
            {config?.slogan && (
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
                {config.slogan}
              </p>
            )}
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Tez havolalar">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Tez havolalar
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-emerald-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition group-hover:bg-emerald-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Aloqa
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              {config?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="leading-relaxed text-slate-400">
                    {config.address}
                  </span>
                </li>
              )}
              {phones.length > 0 && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="flex flex-col gap-1">
                    {phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                        className="font-semibold text-slate-300 transition hover:text-emerald-300"
                      >
                        {phone}
                      </a>
                    ))}
                  </span>
                </li>
              )}
              {config?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <a
                    href={`mailto:${config.email}`}
                    className="font-semibold text-slate-300 transition hover:text-emerald-300"
                  >
                    {config.email}
                  </a>
                </li>
              )}
              {config?.workHours && (
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-slate-400">{config.workHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="relative mt-12 border-t border-white/10 pt-7">
          <p className="text-center text-xs leading-relaxed text-slate-500">
            {config?.footerText ||
              `${name} rasmiy veb-sayti. Barcha huquqlar himoyalangan.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
