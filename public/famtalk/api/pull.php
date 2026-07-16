<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

ft_bootstrap_request();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    ft_json_error('Method not allowed', 405);
}

try {
    $user = ft_require_user();
    $familyId = (int) ($_GET['familyId'] ?? $_GET['family_id'] ?? 0);
    if ($familyId <= 0) {
        ft_json_error('familyId query param required');
    }
    ft_require_family_member($user['id'], $familyId);

    $sinceRaw = isset($_GET['since']) ? (string) $_GET['since'] : null;
    $since = ft_parse_since($sinceRaw);

    $pdo = ft_db();

    $syncWhere = $since === null
        ? 'family_id = :family_id'
        : 'family_id = :family_id AND updated_at > :since';
    $params = [':family_id' => $familyId];
    if ($since !== null) {
        $params[':since'] = $since;
    }

    // Active (non-deleted) rows changed since T
    $messages = [];
    $notes = [];
    $lists = [];
    $listItems = [];
    $deleted = [
        'messages' => [],
        'notes' => [],
        'lists' => [],
        'listItems' => [],
    ];

    $msgStmt = $pdo->prepare("SELECT * FROM ft_messages WHERE {$syncWhere} ORDER BY updated_at ASC, id ASC");
    $msgStmt->execute($params);
    foreach ($msgStmt->fetchAll() as $r) {
        if ($r['deleted_at'] !== null) {
            $deleted['messages'][] = [
                'id' => (int) $r['id'],
                'clientId' => $r['client_id'],
                'deletedAt' => ft_iso($r['deleted_at']),
                'updatedAt' => ft_iso($r['updated_at']),
            ];
        } else {
            $messages[] = ft_row_message($r);
        }
    }

    $noteStmt = $pdo->prepare("SELECT * FROM ft_notes WHERE {$syncWhere} ORDER BY updated_at ASC, id ASC");
    $noteStmt->execute($params);
    foreach ($noteStmt->fetchAll() as $r) {
        if ($r['deleted_at'] !== null) {
            $deleted['notes'][] = [
                'id' => (int) $r['id'],
                'clientId' => $r['client_id'],
                'deletedAt' => ft_iso($r['deleted_at']),
                'updatedAt' => ft_iso($r['updated_at']),
            ];
        } else {
            $notes[] = ft_row_note($r);
        }
    }

    $listStmt = $pdo->prepare("SELECT * FROM ft_lists WHERE {$syncWhere} ORDER BY updated_at ASC, id ASC");
    $listStmt->execute($params);
    foreach ($listStmt->fetchAll() as $r) {
        if ($r['deleted_at'] !== null) {
            $deleted['lists'][] = [
                'id' => (int) $r['id'],
                'clientId' => $r['client_id'],
                'deletedAt' => ft_iso($r['deleted_at']),
                'updatedAt' => ft_iso($r['updated_at']),
            ];
        } else {
            $lists[] = ft_row_list($r);
        }
    }

    $itemStmt = $pdo->prepare("SELECT * FROM ft_list_items WHERE {$syncWhere} ORDER BY updated_at ASC, id ASC");
    $itemStmt->execute($params);
    foreach ($itemStmt->fetchAll() as $r) {
        if ($r['deleted_at'] !== null) {
            $deleted['listItems'][] = [
                'id' => (int) $r['id'],
                'clientId' => $r['client_id'],
                'deletedAt' => ft_iso($r['deleted_at']),
                'updatedAt' => ft_iso($r['updated_at']),
            ];
        } else {
            $listItems[] = ft_row_list_item($r);
        }
    }

    // Memberships (full snapshot when no since; otherwise only useful as current roster)
    $memStmt = $pdo->prepare(
        'SELECT fm.user_id, fm.role, fm.joined_at, u.username, u.email
         FROM ft_family_members fm
         INNER JOIN ft_users u ON u.id = fm.user_id
         WHERE fm.family_id = :family_id
         ORDER BY fm.joined_at ASC'
    );
    $memStmt->execute([':family_id' => $familyId]);
    $memberships = array_map(static function (array $r): array {
        return [
            'userId' => (int) $r['user_id'],
            'username' => (string) $r['username'],
            'email' => (string) $r['email'],
            'role' => (string) $r['role'],
            'joinedAt' => ft_iso($r['joined_at']),
        ];
    }, $memStmt->fetchAll());

    ft_json_ok([
        'serverTime' => ft_iso(ft_now()),
        'familyId' => $familyId,
        'since' => $sinceRaw,
        'messages' => $messages,
        'notes' => $notes,
        'lists' => $lists,
        'listItems' => $listItems,
        'memberships' => $memberships,
        'deleted' => $deleted,
    ]);
} catch (Throwable $e) {
    if ($e instanceof RuntimeException) {
        throw $e;
    }
    ft_json_error('Server error', 500, ['detail' => $e->getMessage()]);
}
