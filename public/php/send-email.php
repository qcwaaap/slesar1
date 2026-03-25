<?php
/**
 * Приём JSON с формы и отправка письма через PHPMailer.
 * Переменные окружения (или в php.ini / виртуальном хосте): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_TO (кому — по умолчанию SMTP_USER).
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

$base = __DIR__ . '/PHPMailer/PHPMailer-master/src/';
require_once $base . 'PHPMailer.php';
require_once $base . 'SMTP.php';
require_once $base . 'Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function smtp_env(string $key, ?string $default = null): ?string {
    $v = getenv($key);
    if ($v !== false && $v !== '') {
        return $v;
    }
    return $default;
}

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ожидается JSON']);
    exit;
}

$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$carBrand = trim($data['carBrand'] ?? '');
$carYear = trim($data['carYear'] ?? '');
$problem = trim($data['problem'] ?? '');

if (!$name || !$phone || !$carBrand || !$carYear) {
    http_response_code(400);
    echo json_encode(['error' => 'Заполните все обязательные поля']);
    exit;
}

$host = smtp_env('SMTP_HOST', 'smtp.yandex.ru');
$port = (int) (smtp_env('SMTP_PORT', '465'));
$user = smtp_env('SMTP_USER');
$pass = smtp_env('SMTP_PASSWORD');
$to = smtp_env('SMTP_TO', $user);

if (!$user || !$pass || !$to) {
    http_response_code(500);
    echo json_encode(['error' => 'На сервере не заданы SMTP_USER / SMTP_PASSWORD (и при необходимости SMTP_TO)']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $user;
    $mail->Password = $pass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $port;

    $mail->setFrom($user, 'Common Rail СПБ');
    $mail->addAddress($to);

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = '🚗 Новая заявка с сайта Common Rail СПБ';

    $body = '
    <h2>Новая заявка на звонок</h2>
    <p><strong>Имя:</strong> ' . h($name) . '</p>
    <p><strong>Телефон:</strong> ' . h($phone) . '</p>
    <p><strong>Марка авто:</strong> ' . h($carBrand) . '</p>
    <p><strong>Год выпуска:</strong> ' . h($carYear) . '</p>'
    . ($problem !== '' ? '<p><strong>Проблема:</strong> ' . h($problem) . '</p>' : '')
    . '<p><strong>Время:</strong> ' . h(date('d.m.Y H:i:s')) . '</p>';

    $mail->Body = $body;

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Заявка отправлена',
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Ошибка при отправке',
        'details' => $mail->ErrorInfo,
    ]);
}
