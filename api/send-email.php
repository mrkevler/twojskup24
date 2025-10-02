<?php
// JSON email endpoint for Apache/PHP hosting
// Path: /api/send-email.php

// Basic CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
  exit;
}

// Read raw JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
  error_log('Invalid JSON payload received: ' . $raw);
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
  exit;
}

// Extract and sanitize fields
$to = isset($data['to']) ? filter_var($data['to'], FILTER_SANITIZE_EMAIL) : '';
$subject = isset($data['subject']) ? trim($data['subject']) : '';
$html = isset($data['html']) ? (string)$data['html'] : '';
$text = isset($data['text']) ? (string)$data['text'] : strip_tags($html);

if (empty($to) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Invalid recipient']);
  exit;
}

if ($subject === '' || $html === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Missing subject or body']);
  exit;
}

// Compose headers
$fromEmail = 'postmaster@twojskup24.pl';
$fromName = 'TwojSkup24';

$headers = '';
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= 'From: ' . $fromName . ' <' . $fromEmail . ">\r\n";
$headers .= 'Reply-To: ' . $fromEmail . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

// Encode subject for UTF-8
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// Log the email attempt
error_log("Attempting to send email to: $to with subject: $subject");

// Try sending HTML first
$ok = @mail($to, $encodedSubject, $html, $headers);
error_log("HTML mail result: " . ($ok ? 'success' : 'failed'));

// Fallback to plain text if HTML fails
if (!$ok) {
  $plainHeaders = '';
  $plainHeaders .= "MIME-Version: 1.0\r\n";
  $plainHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
  $plainHeaders .= 'From: ' . $fromName . ' <' . $fromEmail . ">\r\n";
  $plainHeaders .= 'Reply-To: ' . $fromEmail . "\r\n";
  $plainHeaders .= 'X-Mailer: PHP/' . phpversion() . "\r\n";
  $ok = @mail($to, $encodedSubject, $text, $plainHeaders);
  error_log("Plain text mail result: " . ($ok ? 'success' : 'failed'));
}

if ($ok) {
  error_log("Email sent successfully to: $to");
  echo json_encode(['success' => true]);
  exit;
}

error_log("Failed to send email to: $to");
http_response_code(500);
echo json_encode(['success' => false, 'error' => 'Mail send failed']);
exit;


