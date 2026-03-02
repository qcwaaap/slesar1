"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/Landing.module.css";

const Landing = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Состояние для формы
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carBrand: '',
    carYear: '',
    problem: ''
  });
  
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error
  const [formError, setFormError] = useState('');

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

  // Валидация формы
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Введите имя');
      return false;
    }
    if (!formData.phone.trim()) {
      setFormError('Введите телефон');
      return false;
    }
    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setFormError('Введите корректный телефон (минимум 10 цифр)');
      return false;
    }
    if (!formData.carBrand.trim()) {
      setFormError('Введите марку автомобиля');
      return false;
    }
    if (!formData.carYear.trim()) {
      setFormError('Введите год выпуска');
      return false;
    }
    const year = parseInt(formData.carYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      setFormError('Введите корректный год выпуска');
      return false;
    }
    return true;
  };

  // Отправка формы
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormStatus('loading');
    setFormError('');

    try {
      console.log('📤 Отправка данных:', formData);

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке');
      }

      console.log('✅ Успешно отправлено:', data);
      
      // Очищаем форму
      setFormData({
        name: '',
        phone: '',
        carBrand: '',
        carYear: '',
        problem: ''
      });
      setFormStatus('success');

      // Через 3 секунды закрываем модалку
      setTimeout(() => {
        setFormStatus('idle');
        setIsFormOpen(false);
      }, 3000);

    } catch (error) {
      console.error('❌ Ошибка:', error);
      setFormStatus('error');
      setFormError(error.message || 'Не удалось отправить заявку');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError('');
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormStatus('idle');
    setFormError('');
    setFormData({
      name: '',
      phone: '',
      carBrand: '',
      carYear: '',
      problem: ''
    });
  };

  return (
    <div className={styles.container}>
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

      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <Image
            src="/images/hero-bg.png" 
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
                src="/images/master-photo.jpg"
                alt="Мастер за работой"
                width={520}
                height={315}
                className={styles.masterPhoto}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.discountSection}>
        <div className={styles.discountBackground}>
          <Image
            src="/images/discount-bg.png" 
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

      {/* МОДАЛЬНОЕ ОКНО С РАСШИРЕННОЙ ФОРМОЙ */}
      {isFormOpen && (
        <div className={styles.modalOverlay} onClick={closeForm}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeForm}>✕</button>
            
            {formStatus === 'success' ? (
              // Состояние успеха
              <div className={styles.successState}>
                <h3 className={styles.modalTitle}>✓ Спасибо за обращение!</h3>
                <p className={styles.successMessage}>
                  Мы получили вашу заявку и свяжемся с вами в ближайшее время
                </p>
              </div>
            ) : (
              // Форма
              <>
                <h3 className={styles.modalTitle}>Заказать звонок</h3>
                <p className={styles.modalSubtitle}>
                  Опишите проблему, и мы поможем её решить
                </p>
                
                {formError && (
                  <div className={styles.errorMessage}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmitForm} className={styles.callbackForm}>
                  {/* Имя */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Ваше имя <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Например: Иван Петров"
                      className={styles.formInput}
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={formStatus === 'loading'}
                      required
                    />
                  </div>

                  {/* Телефон */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Телефон <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+7 (999) 123-45-67"
                      className={styles.formInput}
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={formStatus === 'loading'}
                      required
                    />
                  </div>

                  {/* Марка авто */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Марка автомобиля <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="carBrand"
                      placeholder="Например: Ford Transit"
                      className={styles.formInput}
                      value={formData.carBrand}
                      onChange={handleInputChange}
                      disabled={formStatus === 'loading'}
                      required
                    />
                  </div>

                  {/* Год выпуска */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Год выпуска <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      name="carYear"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className={styles.formInput}
                      value={formData.carYear}
                      onChange={handleInputChange}
                      disabled={formStatus === 'loading'}
                      required
                    />
                  </div>

                  {/* Суть проблемы */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Опишите проблему
                    </label>
                    <textarea
                      name="problem"
                      placeholder="Что случилось? Какие признаки? Когда началось?"
                      className={styles.formTextarea}
                      value={formData.problem}
                      onChange={handleInputChange}
                      disabled={formStatus === 'loading'}
                      rows="4"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={styles.formSubmitButton}
                    disabled={formStatus === 'loading'}
                  >
                    {formStatus === 'loading' ? 'Отправка...' : 'Отправить заявку'}
                  </button>

                  {formStatus === 'loading' && (
                    <div className={styles.loadingIndicator}>
                      ⏳ Отправка данных...
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;