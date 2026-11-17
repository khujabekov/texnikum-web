import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getPublicSiteConfig } from "@/lib/public-data";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicSiteConfig();
  const name = config?.collegeName ?? "Texnikum";
  const description =
    config?.slogan ?? "Zamonaviy kasb ta'limi maskani rasmiy veb-sayti";

  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      title: name,
      description,
      type: "website",
      locale: "uz_UZ",
    },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans">
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
