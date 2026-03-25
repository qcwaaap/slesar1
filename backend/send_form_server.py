#!/usr/bin/env python3
"""
Локальный или продакшен-обработчик формы: POST JSON → письмо по SMTP.
Запуск: python send_form_server.py
Переменные окружения: SMTP_HOST, SMTP_PORT (465), SMTP_USER, SMTP_PASSWORD, SMTP_TO (необязательно).

В .env.local для фронта задайте:
  NEXT_PUBLIC_FORM_SUBMIT_URL=http://127.0.0.1:8787/send-email
"""
from __future__ import annotations

import json
import os
import smtplib
import ssl
from email.mime.text import MIMEText
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse


def send_mail_html(
    *,
    name: str,
    phone: str,
    car_brand: str,
    car_year: str,
    problem: str,
) -> None:
    host = os.environ.get("SMTP_HOST", "smtp.yandex.ru")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER", "").strip()
    password = os.environ.get("SMTP_PASSWORD", "").strip()
    to_addr = os.environ.get("SMTP_TO", user).strip()

    if not user or not password or not to_addr:
        raise RuntimeError("Задайте SMTP_USER и SMTP_PASSWORD (и при необходимости SMTP_TO)")

    body = f"""\
<h2>Новая заявка на звонок</h2>
<p><strong>Имя:</strong> {html_esc(name)}</p>
<p><strong>Телефон:</strong> {html_esc(phone)}</p>
<p><strong>Марка авто:</strong> {html_esc(car_brand)}</p>
<p><strong>Год выпуска:</strong> {html_esc(car_year)}</p>
"""
    if problem:
        body += f"<p><strong>Проблема:</strong> {html_esc(problem)}</p>\n"
    body += f"<p><strong>Время:</strong> {html_esc(_now_ru())}</p>\n"

    msg = MIMEText(body, "html", "utf-8")
    msg["Subject"] = "🚗 Новая заявка с сайта Common Rail СПБ"
    msg["From"] = user
    msg["To"] = to_addr

    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL(host, port, context=ctx, timeout=30) as server:
        server.login(user, password)
        server.sendmail(user, [to_addr], msg.as_string())


def html_esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _now_ru() -> str:
    from datetime import datetime

    return datetime.now().strftime("%d.%m.%Y %H:%M:%S")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args: object) -> None:
        print(f"{self.client_address[0]} - {fmt % args}")

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path.rstrip("/") or "/"
        if path != "/send-email":
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self._cors()
            self.end_headers()
            self.wfile.write(b'{"error":"not found"}')
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"

        try:
            data = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self._json_response(400, {"error": "Ожидается JSON"})
            return

        name = str(data.get("name", "")).strip()
        phone = str(data.get("phone", "")).strip()
        car_brand = str(data.get("carBrand", "")).strip()
        car_year = str(data.get("carYear", "")).strip()
        problem = str(data.get("problem", "")).strip()

        if not name or not phone or not car_brand or not car_year:
            self._json_response(400, {"error": "Заполните все обязательные поля"})
            return

        try:
            send_mail_html(
                name=name,
                phone=phone,
                car_brand=car_brand,
                car_year=car_year,
                problem=problem,
            )
        except Exception as e:  # noqa: BLE001
            self._json_response(500, {"error": "Ошибка при отправке", "details": str(e)})
            return

        self._json_response(200, {"success": True, "message": "Заявка отправлена"})

    def _json_response(self, code: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._cors()
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    host = os.environ.get("FORM_SERVER_HOST", "127.0.0.1")
    port = int(os.environ.get("FORM_SERVER_PORT", "8787"))
    httpd = HTTPServer((host, port), Handler)
    print(f"Форма (Python): http://{host}:{port}/send-email")
    print("Укажите во фронте NEXT_PUBLIC_FORM_SUBMIT_URL на этот URL.")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
