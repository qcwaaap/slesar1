import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Коммон Рейл СПБ Сервис | Ремонт форсунок и ТНВД",
    template: "%s | Коммон Рейл СПБ",
  },
  description:
    "Слесарно-диагностический участок в Санкт-Петербурге. Ремонт форсунок Common Rail, ТНВД и диагностика дизельных автомобилей с гарантией до 1 года.",
  keywords: [
    "ремонт форсунок спб",
    "ремонт тнвд спб",
    "диагностика дизельных авто",
    "common rail сервис",
    "слесарно-диагностический участок",
    "коммон рейл санкт-петербург",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Коммон Рейл СПБ Сервис",
    description:
      "Профессиональный ремонт топливной аппаратуры дизельных двигателей в Санкт-Петербурге.",
    url: "/",
    siteName: "Коммон Рейл СПБ",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Коммон Рейл СПБ Сервис",
    description:
      "Ремонт форсунок, ТНВД и диагностика дизельных автомобилей в Санкт-Петербурге.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    yandex: process.env.YANDEX_VERIFICATION,
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};