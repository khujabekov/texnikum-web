import { Suspense } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublicSiteConfig } from "@/lib/public-data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getPublicSiteConfig();

  return (
    <>
      <Suspense
        fallback={
          <div
            className="h-16 border-b border-transparent bg-navy-950/45 backdrop-blur-md md:h-[4.75rem]"
            aria-hidden
          />
        }
      >
        <Navbar
          siteName={config?.collegeName ?? "Texnikum"}
          logoUrl={config?.logoUrl ?? ""}
          socials={{
            telegram: config?.telegramUrl || undefined,
            instagram: config?.instagramUrl || undefined,
            youtube: config?.youtubeUrl || undefined,
          }}
        />
      </Suspense>
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer config={config} />
    </>
  );
}
