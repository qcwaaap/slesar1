<?php
header('Content-Type: application/json; charset=utf-8');

// In this project PHPMailer lives under: php/PHPMailer/PHPMailer-master/...
require_once __DIR__ . '/PHPMailer/PHPMailer-master/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/PHPMailer-master/src/SMTP.php';
require_once __DIR__ . '/PHPMailer/PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);

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

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.yandex.ru';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'cr.spb4@yandex.ru';
    $mail->Password   = 'upxa hlfx wzcc hvxt';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    
    $mail->setFrom('cr.spb4@yandex.ru', 'Common Rail СПБ');
    $mail->addAddress('cr.spb4@yandex.ru');
    
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = '🚗 Новая заявка с сайта Common Rail СПБ';
    
    $body = "
    <h2>Новая заявка на звонок</h2>
    <p><strong>Имя:</strong> {$name}</p>
    <p><strong>Телефон:</strong> {$phone}</p>
    <p><strong>Марка авто:</strong> {$carBrand}</p>
    <p><strong>Год выпуска:</strong> {$carYear}</p>
    " . ($problem ? "<p><strong>Проблема:</strong> {$problem}</p>" : '') . "
    <p><strong>Время:</strong> " . date('d.m.Y H:i:s') . "</p>
    ";
    
    $mail->Body = $body;
    
    $mail->send();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Заявка отправлена'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Ошибка при отправке',
        'details' => $mail->ErrorInfo
    ]);
}
?>