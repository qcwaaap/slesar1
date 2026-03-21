import Landing from '@/components/Landing';
import Script from "next/script";

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Коммон Рейл СПБ Сервис",
    description:
      "Слесарно-диагностический участок в Санкт-Петербурге. Ремонт форсунок, ТНВД и диагностика дизельных автомобилей.",
    areaServed: "Санкт-Петербург",
    telephone: "+7-800-302-53-72",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  };

  return (
    <>
      <Landing />
      <Script
        id="local-business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}