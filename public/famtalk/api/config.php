<?php
declare(strict_types=1);

// FamTalk API config. Override secrets in config.local.php (gitignored)
// or via Hostinger environment / panel variables.

$FAMTALK_DB_HOST = getenv('FAMTALK_DB_HOST') ?: (getenv('DB_HOST') ?: 'localhost');
$FAMTALK_DB_PORT = getenv('FAMTALK_DB_PORT') ?: (getenv('DB_PORT') ?: '3306');
$FAMTALK_DB_NAME = getenv('FAMTALK_DB_NAME') ?: (getenv('DB_NAME') ?: '');
$FAMTALK_DB_USER = getenv('FAMTALK_DB_USER') ?: (getenv('DB_USER') ?: '');
$FAMTALK_DB_PASS = getenv('FAMTALK_DB_PASS') ?: (getenv('DB_PASS') ?: '');
$FAMTALK_DB_CHARSET = 'utf8mb4';

// Comma-separated origins allowed for browser / Expo web. Native Android
// often sends no Origin; empty Origin is always allowed.
// Example: https://codingwithtom.com,http://localhost:8081
$FAMTALK_CORS_ORIGINS = getenv('FAMTALK_CORS_ORIGINS')
    ?: 'https://codingwithtom.com,http://localhost:3000,http://localhost:8081';

// Bearer token lifetime (days)
$FAMTALK_TOKEN_TTL_DAYS = (int) (getenv('FAMTALK_TOKEN_TTL_DAYS') ?: 90);

// Limits
$FAMTALK_MAX_MESSAGE_LEN = 4000;
$FAMTALK_MAX_NOTE_BODY_LEN = 50000;
$FAMTALK_MAX_NOTE_TITLE_LEN = 200;
$FAMTALK_MAX_LIST_TITLE_LEN = 200;
$FAMTALK_MAX_LIST_ITEM_LEN = 500;
$FAMTALK_MAX_PUSH_OPS = 100;

// Optional Expo Push access token (https://expo.dev/accounts/[account]/settings/access-tokens)
$FAMTALK_EXPO_ACCESS_TOKEN = getenv('FAMTALK_EXPO_ACCESS_TOKEN') ?: '';

if (is_file(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
}
