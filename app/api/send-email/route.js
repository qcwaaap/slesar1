import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Получаем данные из формы
    const body = await request.json();
    const { name, phone, carBrand, carYear, problem } = body;

    console.log('📨 Новая заявка:', { name, phone, carBrand, carYear, problem });

    // Валидация
    if (!name || !phone || !carBrand || !carYear) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Настройка транспорта (данные из .env.local)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true для 465, false для других портов
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Письмо
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // отправляем себе
      subject: '🚗 Новая заявка с сайта Common Rail СПБ',
      html: `
        <h2>Новая заявка на звонок</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Марка авто:</strong> ${carBrand}</p>
        <p><strong>Год выпуска:</strong> ${carYear}</p>
        ${problem ? `<p><strong>Проблема:</strong> ${problem}</p>` : ''}
        <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
      `,
    };

    // Отправка
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Письмо отправлено. ID:', info.messageId);

    return NextResponse.json(
      { success: true, message: 'Заявка отправлена' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке' },
      { status: 500 }
    );
  }
} 
