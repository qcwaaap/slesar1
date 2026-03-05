import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Получаем данные
    const body = await request.json();
    const { name, phone, carBrand, carYear, problem } = body;

    console.log('📨 API получил данные:', { name, phone, carBrand, carYear, problem });

    // Валидация
    if (!name || !phone || !carBrand || !carYear) {
      console.log('❌ Ошибка валидации: не все поля заполнены');
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Проверяем наличие переменных окружения
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('❌ Отсутствуют переменные окружения SMTP');
      return NextResponse.json(
        { error: 'Ошибка конфигурации сервера' },
        { status: 500 }
      );
    }

    // Настройка транспорта
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Проверяем соединение
    await transporter.verify();
    console.log('✅ Соединение с SMTP установлено');

    // Письмо
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Отправляем себе
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
    console.error('❌ Ошибка в API:', error);
    
    // Определяем тип ошибки
    let errorMessage = 'Ошибка при отправке';
    if (error.code === 'EAUTH') {
      errorMessage = 'Ошибка авторизации на почтовом сервере';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Не удалось подключиться к почтовому серверу';
    }

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}