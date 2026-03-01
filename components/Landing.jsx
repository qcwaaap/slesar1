"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/Landing.module.css";

const Landing = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Данные для карточек услуг
  const servicesData = [
    {
      title: "Компьютерная диагностика",
      description:
        "Чтение ошибок, анализ параметров работы, проверка датчиков и электроцепей",
    },
    {
      title: "Ремонт форсунок Common Rail",
      description:
        "Профессиональный ремонт форсунок Denso, Bosch, Delphi, Siemens",
    },
    {
      title: "Ремонт ТНВД",
      description:
        "Диагностика и ремонт топливных насосов высокого давления любой сложности",
    },
    {
      title: "Замена свечей накала",
      description:
        "Аккуратное извлечение и замена свечей накала без повреждения ГБЦ",
    },
    {
      title: "Чистка впускных каналов",
      description: "Удаление отложений скорлупой грецкого ореха",
    },
    {
      title: "Замена топливного фильтра",
      description: "Замена фильтров тонкой и грубой очистки топлива",
    },
  ];

  return (
    <div className={styles.container}>
      {/* БЛОК ШАПКИ */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.logo}>КОММОН РЕЙЛ СПБ СЕРВИС</div>
          <div className={styles.phone}>8 (800) 302-53-72</div>
        </div>
        <button
          className={styles.callbackButton}
          onClick={() => setIsFormOpen(true)}
        >
          Заказать звонок
        </button>
      </header>

      {/* БЛОК С НАЗВАНИЕМ И ФОТО */}
      <section className={styles.heroSection}>
        {/* Фоновое изображение (полупрозрачное) */}
        <div className={styles.heroBackground}>
          <Image
            src="/images/hero-bg.png" // ⬅️ ЗАМЕНИТЕ НА СВОЕ ФОТО
            alt="фон"
            fill
            style={{ objectFit: "cover", opacity: 0.15 }}
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              СЛЕСАРНО - ДИАГНОСТИЧЕСКИЙ
              <br />
              УЧАСТОК
            </h1>
            <div className={styles.heroSubtitle}>в Санкт-Петербурге</div>
            <ul className={styles.benefitsList}>
              <li>Быстрое и качественное обслуживание.</li>
              <li>Профессиональная диагностика.</li>
              <li>Специалисты премиум класса.</li>
              <li>Работа любой сложности.</li>
              <li>Гарантия до одного года</li>
            </ul>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.photoFrame}>
              <Image
                src="/images/master-photo.jpg" // ⬅️ ЗАМЕНИТЕ НА ФОТО МАСТЕРА
                alt="Мастер за работой"
                width={520}
                height={315}
                className={styles.masterPhoto}
              />
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК АКЦИЙ */}
      <section className={styles.discountSection}>
        {/* Фоновое изображение для блока акций */}
        <div className={styles.discountBackground}>
          <Image
            src="/images/discount-bg.png" // ⬅️ ЗАМЕНИТЕ НА ФОТО ДЛЯ БЛОКА АКЦИЙ
            alt="фон акций"
            fill
            style={{ objectFit: "cover", opacity: 100 }}
          />
        </div>

        <div className={styles.discountContent}>
          <h2 className={styles.discountTitle}>СКИДКА НА РЕМОНТ ФОРСУНОК</h2>

          <div className={styles.servicesList}>
            <div className={styles.serviceItem}>
              <span>Denso Ford транзит - 11000</span>
            </div>
            <div className={styles.serviceItem}>
              <span>Форсунки газель - 11000</span>
            </div>
            <div className={styles.serviceItem}>
              <span>Ремонт форсунки 0445110369 - 15500</span>
            </div>
            <div className={styles.serviceItem}>
              <span>Ремонт форсунки 0445120153 0445120123 - 11000</span>
            </div>
            <div className={styles.serviceItem}>
              <span>Ремонт форсунки 0445110430 - 15500</span>
            </div>
          </div>

          <button
            className={styles.getDiscountButton}
            onClick={() => setIsFormOpen(true)}
          >
            Получить скидку
          </button>
        </div>
      </section>

      {/* БЛОК НАШИ УСЛУГИ (КАРТОЧКИ) */}
      <section className={styles.servicesFullSection}>
        <h2 className={styles.servicesFullTitle}>НАШИ УСЛУГИ</h2>

        <div className={styles.cardsGrid}>
          {servicesData.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* МОДАЛЬНОЕ ОКНО С ФОРМОЙ ЗВОНКА */}
      {isFormOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsFormOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsFormOpen(false)}>
              ✕
            </button>
            <h3 className={styles.modalTitle}>Заказать звонок</h3>
            <form className={styles.callbackForm}>
              <input
                type="text"
                placeholder="Ваше имя"
                className={styles.formInput}
                required
              />
              <input
                type="tel"
                placeholder="Ваш телефон"
                className={styles.formInput}
                required
              />
              <button type="submit" className={styles.formSubmitButton}>
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;