"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/Landing.module.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Landing = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carBrand: '',
    carYear: '',
    problem: ''
  });
  
  const [formStatus, setFormStatus] = useState('idle'); 
  const [formError, setFormError] = useState('');

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

  /** PHP на том же домене: /php/send-email.php. Python локально: NEXT_PUBLIC_FORM_SUBMIT_URL=http://127.0.0.1:8787/send-email */
  const formSubmitUrl =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORM_SUBMIT_URL) ||
    '/php/send-email.php';

  const parseJsonResponse = async (response) => {
    const raw = await response.text();
    try {
      return JSON.parse(raw);
    } catch {
      const looksLikeHtml =
        /^\s*</.test(raw) || raw.includes('<!DOCTYPE') || raw.includes('<html');
      if (looksLikeHtml || !raw) {
        throw new Error(
          'Скрипт формы недоступен. Локально: npm run form-server и NEXT_PUBLIC_FORM_SUBMIT_URL в .env.local. На сервере: выложите php из сборки (out/php) на хостинг с PHP и переменными SMTP (см. form-backend.env.sample).'
        );
      }
      throw new Error('Сервер вернул ответ в неожиданном формате. Попробуйте позже.');
    }
  };

  // Отправка формы
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormStatus('loading');
    setFormError('');

    try {
      const response = await fetch(formSubmitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || `Ошибка ${response.status}: ${response.statusText}`);
      }

      setFormData({
        name: '',
        phone: '',
        carBrand: '',
        carYear: '',
        problem: '',
      });
      setFormStatus('success');

      setTimeout(() => {
        setFormStatus('idle');
        setIsFormOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setFormStatus('idle');
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
  const scrollToFooter = () => {
    const footer = document.getElementById('site-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openCallbackForm = () => {
    setIsFormOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.logo}>КОММОН РЕЙЛ СПБ СЕРВИС</div>
          <div className={styles.headerContactLine}>
            <a href="tel:+79119136214" className={styles.phone}>
              +7 911 913 62 14
            </a>
            <a href="mailto:cr.spb4@yandex.ru" className={styles.headerEmail}>
              cr.spb4@yandex.ru
            </a>
          </div>
        </div>
        <button
          type="button"
          className={styles.callbackButton}
          onClick={openCallbackForm}
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
              <li>Быстрое и качественное обслуживание</li>
              <li>Профессиональная диагностика</li>
              <li>Специалисты премиум класса</li>
              <li>Работа любой сложности</li>
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
            src="/images/discount-bg1.png" 
            alt="фон акций"
            fill
            style={{ objectFit: "cover", opacity: 100 }}
          />
        </div>

        <div className={styles.discountContent}>
          <h2 className={styles.discountTitle}>СКИДКА НА РЕМОНТ ФОРСУНОК</h2>

          <div className={styles.servicesList}>
            <div className={styles.serviceItem}>
              <span>Denso Ford Transit - 11000</span>
            </div>
            <div className={styles.serviceItem}>
              <span>Форсунки Газель - 11000</span>
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
            type="button"
            className={styles.getDiscountButton}
            onClick={scrollToFooter}
          >
            Куда обратиться
          </button>
        </div>
      </section>

<section className={styles.servicesFullSection}>
  <h2 className={styles.servicesFullTitle}>НАШИ УСЛУГИ</h2>
  
   {/* категория 1: диагностика */}
   <div className={styles.serviceCategory}>
          <h3 className={styles.categoryTitle}>
            <i className="fas fa-chart-line"></i>
            Диагностические работы
          </h3>
          <div className={styles.cardsWrapper}>
            <div className={styles.compactCard}>
              <i className="fas fa-laptop-code"></i>
              <h4 className={styles.compactCardTitle}>Компьютерная диагностика</h4>
              <p className={styles.compactCardDescription}>Чтение ошибок, анализ фактических параметров работы (скважности управляющего сигнала регуляторов, дозировочных клапанов, поцилиндровой коррекции, показателей датчиков коленчатого и распределительного валов, датчиков детонации, ДМРВ, датчиков давления и т.д.)</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-flask"></i>
              <h4 className={styles.compactCardTitle}>Экспресс-анализ гидроплотности форсунок</h4> 
              <p className={styles.compactCardDescription}>Проверка герметичности форсунок</p> 
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-oil-can"></i>
              <h4 className={styles.compactCardTitle}>Диагностика системы низкого давления</h4>
              <p className={styles.compactCardDescription}>Проверка герметичности контура, забор топлива с анализом содержимого топливного фильтра, проверка давления и производительности подающего насоса, замер величины разряжения в питающем контуре (для модификаций автомобилей без электрического насоса в баке)</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-bolt"></i>
              <h4 className={styles.compactCardTitle}>Диагностика электропроводки</h4>
              <p className={styles.compactCardDescription}>Проверка электроцепей форсунок, клапанов, датчиков и иных узлов топливной системы</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-sliders-h"></i>
              <h4 className={styles.compactCardTitle}>Работа с калибровочными данными</h4>
              <p className={styles.compactCardDescription}>Внесение коррекционных кодов форсунок в блок управления двигателем, сброс топливных адаптаций, обучение малому впрыску (адаптация микровпрыска), обучение ТНВД</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-wind"></i>
              <h4 className={styles.compactCardTitle}>Проверка герметичности системы подачи воздуха</h4>
              <p className={styles.compactCardDescription}>Опрессовка системы впуска</p>
            </div>
          </div>
        </div>

        {/* категория 2: слесарные работы */}
        <div className={styles.serviceCategory}>
          <h3 className={styles.categoryTitle}>
            <i className="fas fa-tools"></i>
            Слесарно-механические работы
          </h3>
          <div className={styles.cardsWrapper}>
            <div className={styles.compactCard}>
              <i className="fas fa-wrench"></i>
              <h4 className={styles.compactCardTitle}>Снятие и установка форсунок</h4>
              <p className={styles.compactCardDescription}>Демонтаж/монтаж, чистка и фрезеровка посадочных колодцев топливных форсунок</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-cogs"></i>
              <h4 className={styles.compactCardTitle}>Снятие и установка ТНВД</h4>
              <p className={styles.compactCardDescription}>Демонтаж насосов CR любой сложности</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-filter"></i>
              <h4 className={styles.compactCardTitle}>Замена топливного фильтра</h4>
              <p className={styles.compactCardDescription}>Тонкой и грубой очистки. Установка систем дополнительной фильтрации и сепарации</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-fire"></i>
              <h4 className={styles.compactCardTitle}>Замена свечей накала</h4>
              <p className={styles.compactCardDescription}>С последующей проверкой работы системы предпускового подогрева</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-broom"></i>
              <h4 className={styles.compactCardTitle}>Чистка впускных каналов ГБЦ</h4>
              <p className={styles.compactCardDescription}>Мягкоабразивная очистка скорлупой грецкого ореха</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-gas-pump"></i>
              <h4 className={styles.compactCardTitle}>Работы с топливным баком</h4>
              <p className={styles.compactCardDescription}>Замена, снятие и установка, механическая чистка и мойка</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-fan"></i>
              <h4 className={styles.compactCardTitle}>Турбины</h4>
              <p className={styles.compactCardDescription}>Замена, снятие и установка</p>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-clipboard-list"></i>
              <h4 className={styles.compactCardTitle}>Работы по регламентному ТО</h4>
              <p className={styles.compactCardDescription}>Замена воздушного фильтра, замена фильтра системы вентиляции и отопления салона и прочее</p>
            </div>
          </div>
        </div>

        {/* категория 3: специализированный ремонт */}
        <div className={styles.serviceCategory}>
          <h3 className={styles.categoryTitle}>
            <i className="fas fa-microchip"></i>
            Специализированный ремонт
          </h3>
          <div className={styles.cardsWrapper}>
            <div className={styles.compactCard}>
              <i className="fas fa-oil-can"></i>
              <h4 className={styles.compactCardTitle}>
                <a href="https://crdizel.com" target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                  РЕМОНТ ТОПЛИВНЫХ ФОРСУНОК И ТНВД СИСТЕМ COMMON RAIL
                </a>
              </h4>
            </div>
            <div className={styles.compactCard}>
              <i className="fas fa-fan"></i>
              <h4 className={styles.compactCardTitle}>
                <a href="https://crdizel.com" target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                  РЕМОНТ ТУРБИН
                </a>
              </h4>
            </div>
          </div>
        </div>
      </section>
      {/* футер с контактами */}
      <footer id="site-footer" className={styles.footer}>
        <div className={styles.footerContent}>
          <h3 className={`${styles.categoryTitle} ${styles.footerContactsTitle}`}>
            <i className="fas fa-address-book" aria-hidden="true" />
            Контакты
          </h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <i className="fas fa-map-marker-alt"></i>
              <span>г. Санкт-Петербург, пер. Уманский д.88Б</span>
            </div>
            <div className={styles.contactItem}>
              <i className="fas fa-phone-alt"></i>
              <a href="tel:+79119136214" className={styles.contactLink}>+7 911 913 62 14</a>
            </div>
            <div className={styles.contactItem}>
              <i className="fas fa-envelope"></i>
              <a href="mailto:cr.spb4@yandex.ru" className={styles.contactLink}>cr.spb4@yandex.ru</a>
            </div>
          </div>
        </div>
      </footer>
      {isFormOpen && (
        <div className={styles.modalOverlay} onClick={closeForm}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeForm}>✕</button>
            
            {formStatus === 'success' ? (
              <div className={styles.successState}>
                <h3 className={styles.modalTitle}>✓ Спасибо за обращение!</h3>
                <p className={styles.successMessage}>
                  Мы получили вашу заявку и свяжемся с вами в ближайшее время
                </p>
              </div>
            ) : (
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