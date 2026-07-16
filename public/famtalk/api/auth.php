<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

ft_bootstrap_request();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = trim((string) ($_GET['action'] ?? ''));

try {
    if ($method === 'POST' && $action === 'register') {
        $body = ft_read_json_body();
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $username = trim((string) ($body['username'] ?? ''));
        $password = (string) ($body['password'] ?? '');

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            ft_json_error('Valid email required');
        }
        if ($username === '' || strlen($username) < 2 || strlen($username) > 64) {
            ft_json_error('Username must be 2–64 characters');
        }
        if (!preg_match('/^[a-zA-Z0-9_.-]+$/', $username)) {
            ft_json_error('Username may only contain letters, numbers, . _ -');
        }
        if (strlen($password) < 8) {
            ft_json_error('Password must be at least 8 characters');
        }

        $now = ft_now();
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $pdo = ft_db();

        try {
            $stmt = $pdo->prepare(
                'INSERT INTO ft_users (email, username, password_hash, created_at, updated_at)
                 VALUES (:email, :username, :password_hash, :created_at, :updated_at)'
            );
            $stmt->execute([
                ':email' => $email,
                ':username' => $username,
                ':password_hash' => $hash,
                ':created_at' => $now,
                ':updated_at' => $now,
            ]);
        } catch (PDOException $e) {
            if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
                ft_json_error('Email or username already taken', 409);
            }
            throw $e;
        }

        $userId = (int) $pdo->lastInsertId();
        $user = ['id' => $userId, 'email' => $email, 'username' => $username];
        $token = ft_issue_token($userId);

        ft_json_ok([
            'token' => $token,
            'user' => ft_public_user($user),
            'families' => [],
        ], 201);
    }

    if ($method === 'POST' && $action === 'login') {
        $body = ft_read_json_body();
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $password = (string) ($body['password'] ?? '');

        if ($email === '' || $password === '') {
            ft_json_error('Email and password required');
        }

        $stmt = ft_db()->prepare('SELECT id, email, username, password_hash FROM ft_users WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();
        if (!$row || !password_verify($password, $row['password_hash'])) {
            ft_json_error('Invalid email or password', 401);
        }

        $user = [
            'id' => (int) $row['id'],
            'email' => (string) $row['email'],
            'username' => (string) $row['username'],
        ];
        $token = ft_issue_token($user['id']);

        ft_json_ok([
            'token' => $token,
            'user' => ft_public_user($user),
            'families' => ft_user_families($user['id']),
        ]);
    }

    if ($method === 'GET' && $action === 'me') {
        $user = ft_require_user();
        ft_json_ok([
            'user' => ft_public_user($user),
            'families' => ft_user_families($user['id']),
        ]);
    }

    if ($method === 'POST' && $action === 'create_family') {
        $user = ft_require_user();
        $body = ft_read_json_body();
        $name = trim((string) ($body['name'] ?? ''));
        if ($name === '' || strlen($name) > 120) {
            ft_json_error('Family name required (max 120 chars)');
        }

        $pdo = ft_db();
        $now = ft_now();
        $invite = null;

        for ($attempt = 0; $attempt < 8; $attempt++) {
            $candidate = ft_generate_invite_code();
            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare(
                    'INSERT INTO ft_families (name, invite_code, created_by, created_at, updated_at)
                     VALUES (:name, :invite_code, :created_by, :created_at, :updated_at)'
                );
                $stmt->execute([
                    ':name' => $name,
                    ':invite_code' => $candidate,
                    ':created_by' => $user['id'],
                    ':created_at' => $now,
                    ':updated_at' => $now,
                ]);
                $familyId = (int) $pdo->lastInsertId();
                $member = $pdo->prepare(
                    'INSERT INTO ft_family_members (family_id, user_id, role, joined_at)
                     VALUES (:family_id, :user_id, :role, :joined_at)'
                );
                $member->execute([
                    ':family_id' => $familyId,
                    ':user_id' => $user['id'],
                    ':role' => 'admin',
                    ':joined_at' => $now,
                ]);
                $pdo->commit();
                $invite = $candidate;

                ft_json_ok([
                    'family' => [
                        'id' => $familyId,
                        'name' => $name,
                        'inviteCode' => $invite,
                        'role' => 'admin',
                    ],
                    'families' => ft_user_families($user['id']),
                ], 201);
            } catch (PDOException $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
                    continue; // invite collision
                }
                throw $e;
            }
        }

        ft_json_error('Could not allocate invite code', 500);
    }

    if ($method === 'POST' && $action === 'join_family') {
        $user = ft_require_user();
        $body = ft_read_json_body();
        $code = strtoupper(trim((string) ($body['inviteCode'] ?? $body['invite_code'] ?? '')));
        $code = preg_replace('/[^A-Z0-9]/', '', $code) ?? '';

        if ($code === '') {
            ft_json_error('inviteCode required');
        }

        $stmt = ft_db()->prepare('SELECT id, name, invite_code FROM ft_families WHERE invite_code = :code LIMIT 1');
        $stmt->execute([':code' => $code]);
        $family = $stmt->fetch();
        if (!$family) {
            ft_json_error('Invalid invite code', 404);
        }

        $familyId = (int) $family['id'];
        $now = ft_now();

        try {
            $ins = ft_db()->prepare(
                'INSERT INTO ft_family_members (family_id, user_id, role, joined_at)
                 VALUES (:family_id, :user_id, :role, :joined_at)'
            );
            $ins->execute([
                ':family_id' => $familyId,
                ':user_id' => $user['id'],
                ':role' => 'member',
                ':joined_at' => $now,
            ]);
        } catch (PDOException $e) {
            if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
                // already a member — idempotent success
            } else {
                throw $e;
            }
        }

        $roleStmt = ft_db()->prepare(
            'SELECT role FROM ft_family_members WHERE family_id = :family_id AND user_id = :user_id LIMIT 1'
        );
        $roleStmt->execute([':family_id' => $familyId, ':user_id' => $user['id']]);
        $role = (string) ($roleStmt->fetchColumn() ?: 'member');

        ft_json_ok([
            'family' => [
                'id' => $familyId,
                'name' => (string) $family['name'],
                'inviteCode' => (string) $family['invite_code'],
                'role' => $role,
            ],
            'families' => ft_user_families($user['id']),
        ]);
    }

    if ($method === 'POST' && $action === 'register_push_token') {
        $user = ft_require_user();
        $body = ft_read_json_body();
        $expoPushToken = trim((string) ($body['expoPushToken'] ?? $body['expo_push_token'] ?? ''));
        $platform = strtolower(trim((string) ($body['platform'] ?? 'android')));
        if ($platform === '' || strlen($platform) > 16) {
            $platform = 'android';
        }
        if (!ft_is_valid_expo_push_token($expoPushToken)) {
            ft_json_error('Valid Expo push token required (ExponentPushToken[...])');
        }

        $now = ft_now();
        $pdo = ft_db();
        // Bind token to this user (moves if previously registered to another account).
        $stmt = $pdo->prepare(
            'INSERT INTO ft_push_tokens (user_id, expo_push_token, platform, updated_at, created_at)
             VALUES (:user_id, :token, :platform, :updated_at, :created_at)
             ON DUPLICATE KEY UPDATE
               user_id = VALUES(user_id),
               platform = VALUES(platform),
               updated_at = VALUES(updated_at)'
        );
        $stmt->execute([
            ':user_id' => $user['id'],
            ':token' => $expoPushToken,
            ':platform' => $platform,
            ':updated_at' => $now,
            ':created_at' => $now,
        ]);

        ft_json_ok(['registered' => true]);
    }

    if ($method === 'POST' && $action === 'unregister_push_token') {
        $user = ft_require_user();
        $body = ft_read_json_body();
        $expoPushToken = trim((string) ($body['expoPushToken'] ?? $body['expo_push_token'] ?? ''));
        if (!ft_is_valid_expo_push_token($expoPushToken)) {
            ft_json_error('Valid Expo push token required');
        }

        $stmt = ft_db()->prepare(
            'DELETE FROM ft_push_tokens WHERE expo_push_token = :token AND user_id = :user_id'
        );
        $stmt->execute([
            ':token' => $expoPushToken,
            ':user_id' => $user['id'],
        ]);

        ft_json_ok(['unregistered' => true]);
    }

    ft_json_error('Not found', 404);
} catch (Throwable $e) {
    ft_json_error('Server error', 500, [
        'detail' => $e->getMessage(),
    ]);
}
