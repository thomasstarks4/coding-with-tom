<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function ft_now(): string
{
    $dt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    return $dt->format('Y-m-d H:i:s.v');
}

function ft_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    global $FAMTALK_DB_HOST, $FAMTALK_DB_PORT, $FAMTALK_DB_NAME, $FAMTALK_DB_USER, $FAMTALK_DB_PASS, $FAMTALK_DB_CHARSET;

    if ($FAMTALK_DB_NAME === '' || $FAMTALK_DB_USER === '') {
        ft_json_error('Database not configured', 500);
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        $FAMTALK_DB_HOST,
        $FAMTALK_DB_PORT,
        $FAMTALK_DB_NAME,
        $FAMTALK_DB_CHARSET
    );

    try {
        $pdo = new PDO($dsn, $FAMTALK_DB_USER, $FAMTALK_DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec("SET time_zone = '+00:00'");
        $pdo->exec("SET NAMES utf8mb4");
        ft_ensure_push_tokens_table($pdo);
    } catch (Throwable $e) {
        ft_json_error('Database connection failed', 500);
    }

    return $pdo;
}

/** Idempotent — creates ft_push_tokens if an older deploy is missing it. */
function ft_ensure_push_tokens_table(PDO $pdo): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;
    try {
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS ft_push_tokens (
              id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
              user_id BIGINT UNSIGNED NOT NULL,
              expo_push_token VARCHAR(255) NOT NULL,
              platform VARCHAR(16) NOT NULL DEFAULT \'android\',
              updated_at DATETIME(3) NOT NULL,
              created_at DATETIME(3) NOT NULL,
              PRIMARY KEY (id),
              UNIQUE KEY uq_ft_push_tokens_token (expo_push_token),
              KEY idx_ft_push_tokens_user (user_id),
              CONSTRAINT fk_ft_push_tokens_user
                FOREIGN KEY (user_id) REFERENCES ft_users (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    } catch (Throwable $e) {
        // Older MySQL without IF NOT EXISTS constraint quirks — non-fatal.
        error_log('FamTalk ensure ft_push_tokens: ' . $e->getMessage());
    }
}

function ft_apply_cors(): void
{
    global $FAMTALK_CORS_ORIGINS;

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = array_values(array_filter(array_map('trim', explode(',', (string) $FAMTALK_CORS_ORIGINS))));

    if ($origin === '') {
        // Native clients often omit Origin
        header('Access-Control-Allow-Origin: *');
    } elseif (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    } else {
        // Still answer preflight clearly
        header('Access-Control-Allow-Origin: ' . ($allowed[0] ?? 'null'));
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    header('Access-Control-Max-Age: 86400');
}

function ft_bootstrap_request(): void
{
    ft_apply_cors();
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function ft_json_ok(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function ft_json_error(string $message, int $status = 400, array $extra = []): void
{
    http_response_code($status);
    echo json_encode(array_merge(['error' => $message], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function ft_read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        ft_json_error('Invalid JSON body', 400);
    }
    return $data;
}

function ft_bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
        return $m[1];
    }
    return null;
}

function ft_hash_token(string $token): string
{
    return hash('sha256', $token);
}

function ft_issue_token(int $userId): string
{
    global $FAMTALK_TOKEN_TTL_DAYS;

    $token = bin2hex(random_bytes(32));
    $hash = ft_hash_token($token);
    $now = ft_now();
    $expires = (new DateTimeImmutable($now, new DateTimeZone('UTC')))
        ->modify('+' . max(1, $FAMTALK_TOKEN_TTL_DAYS) . ' days')
        ->format('Y-m-d H:i:s.v');

    $stmt = ft_db()->prepare(
        'INSERT INTO ft_auth_tokens (user_id, token_hash, expires_at, created_at)
         VALUES (:user_id, :token_hash, :expires_at, :created_at)'
    );
    $stmt->execute([
        ':user_id' => $userId,
        ':token_hash' => $hash,
        ':expires_at' => $expires,
        ':created_at' => $now,
    ]);

    return $token;
}

/**
 * @return array{id:int,email:string,username:string}
 */
function ft_require_user(): array
{
    $token = ft_bearer_token();
    if ($token === null || $token === '') {
        ft_json_error('Missing Authorization Bearer token', 401);
    }

    $stmt = ft_db()->prepare(
        'SELECT u.id, u.email, u.username, t.expires_at
         FROM ft_auth_tokens t
         INNER JOIN ft_users u ON u.id = t.user_id
         WHERE t.token_hash = :hash
         LIMIT 1'
    );
    $stmt->execute([':hash' => ft_hash_token($token)]);
    $row = $stmt->fetch();
    if (!$row) {
        ft_json_error('Invalid token', 401);
    }
    if ($row['expires_at'] < ft_now()) {
        ft_json_error('Token expired', 401);
    }

    return [
        'id' => (int) $row['id'],
        'email' => (string) $row['email'],
        'username' => (string) $row['username'],
    ];
}

function ft_require_family_member(int $userId, int $familyId): array
{
    $stmt = ft_db()->prepare(
        'SELECT fm.role, f.id AS family_id, f.name, f.invite_code
         FROM ft_family_members fm
         INNER JOIN ft_families f ON f.id = fm.family_id
         WHERE fm.user_id = :user_id AND fm.family_id = :family_id
         LIMIT 1'
    );
    $stmt->execute([':user_id' => $userId, ':family_id' => $familyId]);
    $row = $stmt->fetch();
    if (!$row) {
        ft_json_error('Not a member of this family', 403);
    }
    return $row;
}

function ft_generate_invite_code(): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $code = '';
    for ($i = 0; $i < 8; $i++) {
        $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return $code;
}

function ft_public_user(array $user): array
{
    return [
        'id' => (int) $user['id'],
        'email' => (string) $user['email'],
        'username' => (string) $user['username'],
    ];
}

function ft_user_families(int $userId): array
{
    $stmt = ft_db()->prepare(
        'SELECT f.id, f.name, f.invite_code, fm.role, fm.joined_at
         FROM ft_family_members fm
         INNER JOIN ft_families f ON f.id = fm.family_id
         WHERE fm.user_id = :user_id
         ORDER BY fm.joined_at ASC'
    );
    $stmt->execute([':user_id' => $userId]);
    $rows = $stmt->fetchAll();
    return array_map(static function (array $r): array {
        return [
            'id' => (int) $r['id'],
            'name' => (string) $r['name'],
            'inviteCode' => (string) $r['invite_code'],
            'role' => (string) $r['role'],
            'joinedAt' => ft_iso($r['joined_at']),
        ];
    }, $rows);
}

function ft_iso(?string $dbDatetime): ?string
{
    if ($dbDatetime === null || $dbDatetime === '') {
        return null;
    }
    // MySQL DATETIME(3) → ISO8601 UTC
    $normalized = str_replace(' ', 'T', $dbDatetime);
    if (!str_ends_with($normalized, 'Z') && !preg_match('/[+-]\d{2}:\d{2}$/', $normalized)) {
        $normalized .= 'Z';
    }
    return $normalized;
}

function ft_parse_since(?string $since): ?string
{
    if ($since === null || trim($since) === '') {
        return null;
    }
    try {
        $dt = new DateTimeImmutable($since);
        $dt = $dt->setTimezone(new DateTimeZone('UTC'));
        return $dt->format('Y-m-d H:i:s.v');
    } catch (Throwable $e) {
        ft_json_error('Invalid since timestamp; use ISO8601 UTC', 400);
    }
}

function ft_row_message(array $r): array
{
    return [
        'id' => (int) $r['id'],
        'familyId' => (int) $r['family_id'],
        'userId' => (int) $r['user_id'],
        'body' => (string) $r['body'],
        'clientId' => $r['client_id'],
        'createdAt' => ft_iso($r['created_at']),
        'updatedAt' => ft_iso($r['updated_at']),
        'deletedAt' => ft_iso($r['deleted_at'] ?? null),
    ];
}

function ft_row_note(array $r): array
{
    return [
        'id' => (int) $r['id'],
        'familyId' => (int) $r['family_id'],
        'userId' => (int) $r['user_id'],
        'title' => (string) $r['title'],
        'body' => (string) $r['body'],
        'clientId' => $r['client_id'],
        'createdAt' => ft_iso($r['created_at']),
        'updatedAt' => ft_iso($r['updated_at']),
        'deletedAt' => ft_iso($r['deleted_at'] ?? null),
    ];
}

function ft_row_list(array $r): array
{
    return [
        'id' => (int) $r['id'],
        'familyId' => (int) $r['family_id'],
        'title' => (string) $r['title'],
        'clientId' => $r['client_id'],
        'createdAt' => ft_iso($r['created_at']),
        'updatedAt' => ft_iso($r['updated_at']),
        'deletedAt' => ft_iso($r['deleted_at'] ?? null),
    ];
}

function ft_row_list_item(array $r): array
{
    $category = $r['category'] ?? null;
    if ($category !== null) {
        $category = trim((string) $category);
        if ($category === '') {
            $category = null;
        }
    }

    return [
        'id' => (int) $r['id'],
        'listId' => (int) $r['list_id'],
        'familyId' => (int) $r['family_id'],
        'text' => (string) $r['text'],
        'checked' => (bool) $r['checked'],
        'qty' => $r['qty'],
        'category' => $category,
        'assigneeUserId' => $r['assignee_user_id'] !== null ? (int) $r['assignee_user_id'] : null,
        'clientId' => $r['client_id'],
        'createdAt' => ft_iso($r['created_at']),
        'updatedAt' => ft_iso($r['updated_at']),
        'deletedAt' => ft_iso($r['deleted_at'] ?? null),
    ];
}

function ft_normalize_list_item_category(mixed $raw): ?string
{
    if ($raw === null) {
        return null;
    }
    $category = trim((string) $raw);
    if ($category === '' || mb_strlen($category) > 32) {
        return null;
    }
    return $category;
}

function ft_find_by_client_id(string $table, int $familyId, ?string $clientId): ?array
{
    if ($clientId === null || $clientId === '') {
        return null;
    }
    $allowed = [
        'ft_messages' => true,
        'ft_notes' => true,
        'ft_lists' => true,
        'ft_list_items' => true,
    ];
    if (!isset($allowed[$table])) {
        return null;
    }
    $stmt = ft_db()->prepare(
        "SELECT * FROM {$table} WHERE family_id = :family_id AND client_id = :client_id LIMIT 1"
    );
    $stmt->execute([':family_id' => $familyId, ':client_id' => $clientId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function ft_is_valid_expo_push_token(string $token): bool
{
    return (bool) preg_match('/^ExponentPushToken\[.+\]$/', $token);
}

function ft_is_grocery_list_title(string $title): bool
{
    return (bool) preg_match('/grocery|shopping/i', $title);
}

function ft_list_title_by_id(int $familyId, int $listId): ?string
{
    if ($listId <= 0) {
        return null;
    }
    $stmt = ft_db()->prepare(
        'SELECT title FROM ft_lists WHERE id = :id AND family_id = :family_id LIMIT 1'
    );
    $stmt->execute([':id' => $listId, ':family_id' => $familyId]);
    $title = $stmt->fetchColumn();
    return $title === false ? null : (string) $title;
}

/**
 * Notify all other family members via Expo Push. Never throws to the caller —
 * persistence already succeeded; Expo failures are logged and swallowed.
 *
 * @param array<string, mixed> $data
 */
function ft_notify_family(int $familyId, int $actorUserId, string $title, string $body, array $data = []): void
{
    global $FAMTALK_EXPO_ACCESS_TOKEN;

    try {
        $stmt = ft_db()->prepare(
            'SELECT DISTINCT pt.expo_push_token
             FROM ft_push_tokens pt
             INNER JOIN ft_family_members fm ON fm.user_id = pt.user_id
             WHERE fm.family_id = :family_id AND pt.user_id <> :actor_id'
        );
        $stmt->execute([
            ':family_id' => $familyId,
            ':actor_id' => $actorUserId,
        ]);
        $tokens = [];
        foreach ($stmt->fetchAll() as $row) {
            $tok = (string) ($row['expo_push_token'] ?? '');
            if (ft_is_valid_expo_push_token($tok)) {
                $tokens[$tok] = true;
            }
        }
        $tokenList = array_keys($tokens);
        if ($tokenList === []) {
            return;
        }

        $messages = [];
        foreach ($tokenList as $to) {
            $messages[] = [
                'to' => $to,
                'title' => $title,
                'body' => $body,
                'sound' => 'default',
                'data' => $data,
                'channelId' => 'famtalk',
            ];
        }

        foreach (array_chunk($messages, 100) as $chunk) {
            ft_expo_push_send($chunk, (string) ($FAMTALK_EXPO_ACCESS_TOKEN ?? ''));
        }
    } catch (Throwable $e) {
        error_log('FamTalk ft_notify_family: ' . $e->getMessage());
    }
}

/**
 * @param list<array<string, mixed>> $messages
 */
function ft_expo_push_send(array $messages, string $accessToken = ''): void
{
    $payload = json_encode($messages, JSON_UNESCAPED_UNICODE);
    if ($payload === false) {
        return;
    }

    $headers = [
        'Accept: application/json',
        'Accept-Encoding: gzip, deflate',
        'Content-Type: application/json',
    ];
    if ($accessToken !== '') {
        $headers[] = 'Authorization: Bearer ' . $accessToken;
    }

    $ch = curl_init('https://exp.host/--/api/v2/push/send');
    if ($ch === false) {
        return;
    }
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
    ]);
    $raw = curl_exec($ch);
    $errno = curl_errno($ch);
    curl_close($ch);

    if ($errno !== 0 || !is_string($raw) || $raw === '') {
        error_log('FamTalk Expo push HTTP failed errno=' . $errno);
        return;
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return;
    }

    $data = $decoded['data'] ?? null;
    if (!is_array($data)) {
        return;
    }

    $badTokens = [];
    foreach ($data as $ticket) {
        if (!is_array($ticket)) {
            continue;
        }
        $status = (string) ($ticket['status'] ?? '');
        $details = $ticket['details'] ?? null;
        $error = is_array($details) ? (string) ($details['error'] ?? '') : '';
        if ($status === 'error' && $error === 'DeviceNotRegistered') {
            // Expo may echo the token in details.expoPushToken
            $tok = is_array($details) ? (string) ($details['expoPushToken'] ?? '') : '';
            if ($tok === '' && isset($ticket['message']) && is_string($ticket['message'])) {
                if (preg_match('/ExponentPushToken\[[^\]]+\]/', $ticket['message'], $m)) {
                    $tok = $m[0];
                }
            }
            if (ft_is_valid_expo_push_token($tok)) {
                $badTokens[$tok] = true;
            }
        }
    }

    // Match tickets to request order when expoPushToken not present
    if ($badTokens === [] && count($data) === count($messages)) {
        foreach ($data as $i => $ticket) {
            if (!is_array($ticket)) {
                continue;
            }
            $status = (string) ($ticket['status'] ?? '');
            $details = $ticket['details'] ?? null;
            $error = is_array($details) ? (string) ($details['error'] ?? '') : '';
            if ($status === 'error' && $error === 'DeviceNotRegistered') {
                $to = (string) ($messages[$i]['to'] ?? '');
                if (ft_is_valid_expo_push_token($to)) {
                    $badTokens[$to] = true;
                }
            }
        }
    }

    foreach (array_keys($badTokens) as $tok) {
        try {
            $del = ft_db()->prepare('DELETE FROM ft_push_tokens WHERE expo_push_token = :tok');
            $del->execute([':tok' => $tok]);
        } catch (Throwable $e) {
            error_log('FamTalk prune push token: ' . $e->getMessage());
        }
    }
}

/**
 * After a successful push.php commit, coalesce family notifications by category.
 *
 * @param list<array<string, mixed>> $results
 * @param list<array<string, mixed>> $ops Original ops (for list titles / listIds when needed)
 */
function ft_notify_after_push(int $familyId, array $actor, array $results, array $ops = []): void
{
    $username = trim((string) ($actor['username'] ?? 'Someone'));
    if ($username === '') {
        $username = 'Someone';
    }
    $actorId = (int) $actor['id'];

    $notifyMessage = false;
    $notifyNote = false;
    $notifyGrocery = false;

    foreach ($results as $result) {
        if (!is_array($result) || empty($result['ok'])) {
            continue;
        }
        if (!empty($result['idempotent'])) {
            continue;
        }

        $type = strtolower((string) ($result['type'] ?? ''));
        $index = isset($result['index']) ? (int) $result['index'] : -1;
        $op = ($index >= 0 && isset($ops[$index]) && is_array($ops[$index])) ? $ops[$index] : [];
        $action = strtolower(trim((string) ($op['op'] ?? $op['action'] ?? '')));
        $record = is_array($result['record'] ?? null) ? $result['record'] : [];
        $opData = is_array($op['data'] ?? null) ? $op['data'] : $op;

        if ($type === 'message' && $action === 'create') {
            $notifyMessage = true;
            continue;
        }
        if ($type === 'note' && $action === 'create') {
            $notifyNote = true;
            continue;
        }

        if ($type === 'list' && in_array($action, ['create', 'update', 'delete'], true)) {
            $title = (string) ($record['title'] ?? $opData['title'] ?? '');
            if (ft_is_grocery_list_title($title)) {
                $notifyGrocery = true;
            }
            continue;
        }

        if ($type === 'list_item' && in_array($action, ['create', 'update', 'delete'], true)) {
            $listId = (int) ($record['listId'] ?? $opData['listId'] ?? $opData['list_id'] ?? 0);
            $title = ft_list_title_by_id($familyId, $listId) ?? '';
            if (ft_is_grocery_list_title($title)) {
                $notifyGrocery = true;
            }
        }
    }

    if ($notifyMessage) {
        ft_notify_family($familyId, $actorId, 'FamTalk', "{$username} sent a message", [
            'familyId' => $familyId,
            'kind' => 'message',
        ]);
    }
    if ($notifyNote) {
        ft_notify_family($familyId, $actorId, 'FamTalk', "{$username} added a note", [
            'familyId' => $familyId,
            'kind' => 'note',
        ]);
    }
    if ($notifyGrocery) {
        ft_notify_family($familyId, $actorId, 'FamTalk', "{$username} updated the grocery list", [
            'familyId' => $familyId,
            'kind' => 'grocery',
        ]);
    }
}
