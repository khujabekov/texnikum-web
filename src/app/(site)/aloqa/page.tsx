import {
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import {
  InstagramIcon,
  TelegramIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";
import { getPublicSiteConfig } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Aloqa",
  description:
    "Texnikum manzili, telefon raqamlari, elektron pochta, ish vaqti va joylashuv xaritasi.",
};

type ContactCardProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
};

function ContactCard({ icon: Icon, label, children }: ContactCardProps) {
  return (
    <li className="flex items-start gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/10">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-lg shadow-emerald-500/25">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div className="mt-1.5 text-sm font-semibold leading-relaxed text-navy-900">
          {children}
        </div>
      </div>
    </li>
  );
}

export default async function AloqaPage() {
  const config = await getPublicSiteConfig();

  const phones = (config?.phones ?? "")
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);

  const socials = [
    { href: config?.telegramUrl ?? "", label: "Telegram", Icon: TelegramIcon },
    { href: config?.instagramUrl ?? "", label: "Instagram", Icon: InstagramIcon },
    { href: config?.youtubeUrl ?? "", label: "YouTube", Icon: YoutubeIcon },
  ].filter((social) => social.href);

  const hasContact =
    Boolean(config?.address) ||
    phones.length > 0 ||
    Boolean(config?.email) ||
    Boolean(config?.workHours);

  return (
    <>
      <PageHeader
        kicker="Aloqa"
        title="Biz bilan bog'laning"
        description="Qabul, hamkorlik va boshqa savollaringiz bo'yicha biz bilan bog'laning — biz doim aloqadamiz."
        breadcrumb="Aloqa"
      />

      <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                Manzil va aloqa ma&rsquo;lumotlari
              </h2>

              {hasContact ? (
                <ul className="mt-8 space-y-4">
                  {config?.address && (
                    <ContactCard icon={MapPin} label="Manzil">
                      {config.address}
                    </ContactCard>
                  )}
                  {phones.length > 0 && (
                    <ContactCard icon={Phone} label="Telefon">
                      <span className="flex flex-col gap-1.5">
                        {phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                            className="transition hover:text-emerald-600"
                          >
                            {phone}
                          </a>
                        ))}
                      </span>
                    </ContactCard>
                  )}
                  {config?.email && (
                    <ContactCard icon={Mail} label="Elektron pochta">
                      <a
                        href={`mailto:${config.email}`}
                        className="transition hover:text-emerald-600"
                      >
                        {config.email}
                      </a>
                    </ContactCard>
                  )}
                  {config?.workHours && (
                    <ContactCard icon={Clock} label="Ish vaqti">
                      {config.workHours}
                    </ContactCard>
                  )}
                </ul>
              ) : (
                <p className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm font-semibold text-slate-500">
                  Aloqa ma&rsquo;lumotlari tez orada qo&rsquo;shiladi
                </p>
              )}

              {socials.length > 0 && (
                <div className="mt-8">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Ijtimoiy tarmoqlar
                  </p>
                  <div className="mt-3 flex gap-3">
                    {socials.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-navy-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-xl shadow-navy-900/10">
              {config?.mapEmbedUrl ? (
                <iframe
                  src={config.mapEmbedUrl}
                  title="Texnikum joylashuv xaritasi"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[420px] w-full border-0 sm:h-[480px] lg:h-full lg:min-h-[560px]"
                />
              ) : (
                <div className="flex h-[420px] w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-100 to-slate-200 text-center sm:h-[480px] lg:h-full lg:min-h-[560px]">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-500 shadow-lg">
                    <MapPin className="h-8 w-8" />
                  </span>
                  <p className="text-sm font-semibold text-slate-500">
                    Xarita tez orada qo&rsquo;shiladi
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-10 text-white sm:px-10 lg:px-12">
            <div className="bg-grid-white absolute inset-0 opacity-40" aria-hidden />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/25 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  Qabul jarayoni haqida savollaringiz bormi?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                  Qabul komissiyasi ish kunlarida sizning savollaringizga
                  batafsil javob beradi.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {phones[0] && (
                  <a
                    href={`tel:${phones[0].replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110"
                  >
                    <Phone className="h-4 w-4" />
                    Qo&rsquo;ng&rsquo;iroq qilish
                  </a>
                )}
                <Link
                  href="/yangiliklar"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/10"
                >
                  <Send className="h-4 w-4 text-emerald-300" />
                  Yangiliklarni ko&rsquo;rish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
