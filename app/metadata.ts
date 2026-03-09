import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Коммон Рейл СПБ Сервис | Ремонт форсунок и ТНВД',
    template: '%s | Коммон Рейл СПБ'
  },
  description: 'Слесарно-диагностический участок в Санкт-Петербурге. Ремонт форсунок Common Rail, ТНВД, диагностика дизельных автомобилей. Гарантия до 1 года.',
  keywords: ['ремонт форсунок', 'common rail', 'тнвд', 'дизель', 'санкт-петербург', 'диагностика'],
  authors: [{ name: 'Коммон Рейл СПБ' }],
  openGraph: {
    title: 'Коммон Рейл СПБ Сервис',
    description: 'Профессиональный ремонт топливной аппаратуры дизельных двигателей',
    url: 'https://brilliant-biscochitos-426747.netlify.app',
    siteName: 'Коммон Рейл СПБ',
    images: [
      {
        url: '/images/og-image.jpg', // Создайте такую картинку 1200x630
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    yandex: 'ваш_код_верификации', // Получите в Яндекс.Вебмастере
  },
}