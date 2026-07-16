<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

ft_bootstrap_request();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    ft_json_error('Method not allowed', 405);
}

/**
 * Resolve list_id from payload: numeric id, or clientId of an existing list.
 */
function ft_resolve_list_id(int $familyId, array $data): int
{
    if (isset($data['listId']) && (int) $data['listId'] > 0) {
        return (int) $data['listId'];
    }
    if (isset($data['list_id']) && (int) $data['list_id'] > 0) {
        return (int) $data['list_id'];
    }
    $listClientId = isset($data['listClientId']) ? (string) $data['listClientId'] : '';
    if ($listClientId !== '') {
        $list = ft_find_by_client_id('ft_lists', $familyId, $listClientId);
        if ($list) {
            return (int) $list['id'];
        }
    }
    throw new InvalidArgumentException('listId (or listClientId) required for list_item ops');
}

try {
    global $FAMTALK_MAX_PUSH_OPS, $FAMTALK_MAX_MESSAGE_LEN, $FAMTALK_MAX_NOTE_BODY_LEN,
        $FAMTALK_MAX_NOTE_TITLE_LEN, $FAMTALK_MAX_LIST_TITLE_LEN, $FAMTALK_MAX_LIST_ITEM_LEN;

    $user = ft_require_user();
    $body = ft_read_json_body();
    $familyId = (int) ($body['familyId'] ?? $body['family_id'] ?? 0);
    if ($familyId <= 0) {
        ft_json_error('familyId required');
    }
    ft_require_family_member($user['id'], $familyId);

    $ops = $body['ops'] ?? null;
    if (!is_array($ops)) {
        ft_json_error('ops array required');
    }
    if (count($ops) === 0) {
        ft_json_ok(['results' => [], 'serverTime' => ft_iso(ft_now())]);
    }
    if (count($ops) > $FAMTALK_MAX_PUSH_OPS) {
        ft_json_error('Too many ops (max ' . $FAMTALK_MAX_PUSH_OPS . ')');
    }

    $pdo = ft_db();
    $results = [];

    $pdo->beginTransaction();

    foreach ($ops as $index => $op) {
        if (!is_array($op)) {
            $pdo->rollBack();
            ft_json_error("ops[{$index}] must be an object");
        }

        $action = strtolower(trim((string) ($op['op'] ?? $op['action'] ?? '')));
        $type = strtolower(trim((string) ($op['type'] ?? '')));
        $clientId = isset($op['clientId']) ? trim((string) $op['clientId']) : null;
        if ($clientId === '') {
            $clientId = null;
        }
        $data = is_array($op['data'] ?? null) ? $op['data'] : $op;
        $now = ft_now();

        try {
            if ($type === 'message') {
                if ($action === 'create') {
                    $existing = ft_find_by_client_id('ft_messages', $familyId, $clientId);
                    if ($existing) {
                        $results[] = ['index' => $index, 'ok' => true, 'idempotent' => true, 'type' => 'message', 'record' => ft_row_message($existing)];
                        continue;
                    }
                    $msgBody = trim((string) ($data['body'] ?? ''));
                    if ($msgBody === '' || mb_strlen($msgBody) > $FAMTALK_MAX_MESSAGE_LEN) {
                        throw new InvalidArgumentException('message body required (max ' . $FAMTALK_MAX_MESSAGE_LEN . ')');
                    }
                    $stmt = $pdo->prepare(
                        'INSERT INTO ft_messages (family_id, user_id, body, client_id, created_at, updated_at, deleted_at)
                         VALUES (:family_id, :user_id, :body, :client_id, :created_at, :updated_at, NULL)'
                    );
                    $stmt->execute([
                        ':family_id' => $familyId,
                        ':user_id' => $user['id'],
                        ':body' => $msgBody,
                        ':client_id' => $clientId,
                        ':created_at' => $now,
                        ':updated_at' => $now,
                    ]);
                    $id = (int) $pdo->lastInsertId();
                    $sel = $pdo->prepare('SELECT * FROM ft_messages WHERE id = :id');
                    $sel->execute([':id' => $id]);
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'message', 'record' => ft_row_message($sel->fetch())];
                    continue;
                }
                if ($action === 'delete') {
                    $id = (int) ($data['id'] ?? 0);
                    $stmt = $pdo->prepare(
                        'UPDATE ft_messages SET deleted_at = :now, updated_at = :now
                         WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL'
                    );
                    $stmt->execute([':now' => $now, ':id' => $id, ':family_id' => $familyId]);
                    $sel = $pdo->prepare('SELECT * FROM ft_messages WHERE id = :id AND family_id = :family_id');
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $row = $sel->fetch();
                    if (!$row) {
                        throw new InvalidArgumentException('message not found');
                    }
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'message', 'record' => ft_row_message($row)];
                    continue;
                }
                throw new InvalidArgumentException('unsupported message op');
            }

            if ($type === 'note') {
                if ($action === 'create') {
                    $existing = ft_find_by_client_id('ft_notes', $familyId, $clientId);
                    if ($existing) {
                        $results[] = ['index' => $index, 'ok' => true, 'idempotent' => true, 'type' => 'note', 'record' => ft_row_note($existing)];
                        continue;
                    }
                    $title = trim((string) ($data['title'] ?? ''));
                    $noteBody = (string) ($data['body'] ?? '');
                    if (mb_strlen($title) > $FAMTALK_MAX_NOTE_TITLE_LEN) {
                        throw new InvalidArgumentException('note title too long');
                    }
                    if (mb_strlen($noteBody) > $FAMTALK_MAX_NOTE_BODY_LEN) {
                        throw new InvalidArgumentException('note body too long');
                    }
                    $stmt = $pdo->prepare(
                        'INSERT INTO ft_notes (family_id, user_id, title, body, client_id, created_at, updated_at, deleted_at)
                         VALUES (:family_id, :user_id, :title, :body, :client_id, :created_at, :updated_at, NULL)'
                    );
                    $stmt->execute([
                        ':family_id' => $familyId,
                        ':user_id' => $user['id'],
                        ':title' => $title,
                        ':body' => $noteBody,
                        ':client_id' => $clientId,
                        ':created_at' => $now,
                        ':updated_at' => $now,
                    ]);
                    $id = (int) $pdo->lastInsertId();
                    $sel = $pdo->prepare('SELECT * FROM ft_notes WHERE id = :id');
                    $sel->execute([':id' => $id]);
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'note', 'record' => ft_row_note($sel->fetch())];
                    continue;
                }
                if ($action === 'update') {
                    $id = (int) ($data['id'] ?? 0);
                    $sel = $pdo->prepare('SELECT * FROM ft_notes WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL');
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $existing = $sel->fetch();
                    if (!$existing) {
                        throw new InvalidArgumentException('note not found');
                    }
                    $title = array_key_exists('title', $data) ? trim((string) $data['title']) : (string) $existing['title'];
                    $noteBody = array_key_exists('body', $data) ? (string) $data['body'] : (string) $existing['body'];
                    if (mb_strlen($title) > $FAMTALK_MAX_NOTE_TITLE_LEN || mb_strlen($noteBody) > $FAMTALK_MAX_NOTE_BODY_LEN) {
                        throw new InvalidArgumentException('note title/body too long');
                    }
                    // Last-write-wins; optional client updatedAt for future conflict detection
                    $upd = $pdo->prepare(
                        'UPDATE ft_notes SET title = :title, body = :body, updated_at = :now
                         WHERE id = :id AND family_id = :family_id'
                    );
                    $upd->execute([
                        ':title' => $title,
                        ':body' => $noteBody,
                        ':now' => $now,
                        ':id' => $id,
                        ':family_id' => $familyId,
                    ]);
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'note', 'record' => ft_row_note($sel->fetch())];
                    continue;
                }
                if ($action === 'delete') {
                    $id = (int) ($data['id'] ?? 0);
                    $stmt = $pdo->prepare(
                        'UPDATE ft_notes SET deleted_at = :now, updated_at = :now
                         WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL'
                    );
                    $stmt->execute([':now' => $now, ':id' => $id, ':family_id' => $familyId]);
                    $sel = $pdo->prepare('SELECT * FROM ft_notes WHERE id = :id AND family_id = :family_id');
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $row = $sel->fetch();
                    if (!$row) {
                        throw new InvalidArgumentException('note not found');
                    }
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'note', 'record' => ft_row_note($row)];
                    continue;
                }
                throw new InvalidArgumentException('unsupported note op');
            }

            if ($type === 'list') {
                if ($action === 'create') {
                    $existing = ft_find_by_client_id('ft_lists', $familyId, $clientId);
                    if ($existing) {
                        $results[] = ['index' => $index, 'ok' => true, 'idempotent' => true, 'type' => 'list', 'record' => ft_row_list($existing)];
                        continue;
                    }
                    $title = trim((string) ($data['title'] ?? 'Grocery'));
                    if ($title === '' || mb_strlen($title) > $FAMTALK_MAX_LIST_TITLE_LEN) {
                        throw new InvalidArgumentException('list title required');
                    }
                    $stmt = $pdo->prepare(
                        'INSERT INTO ft_lists (family_id, title, client_id, created_at, updated_at, deleted_at)
                         VALUES (:family_id, :title, :client_id, :created_at, :updated_at, NULL)'
                    );
                    $stmt->execute([
                        ':family_id' => $familyId,
                        ':title' => $title,
                        ':client_id' => $clientId,
                        ':created_at' => $now,
                        ':updated_at' => $now,
                    ]);
                    $id = (int) $pdo->lastInsertId();
                    $sel = $pdo->prepare('SELECT * FROM ft_lists WHERE id = :id');
                    $sel->execute([':id' => $id]);
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'list', 'record' => ft_row_list($sel->fetch())];
                    continue;
                }
                if ($action === 'update') {
                    $id = (int) ($data['id'] ?? 0);
                    $title = trim((string) ($data['title'] ?? ''));
                    if ($title === '' || mb_strlen($title) > $FAMTALK_MAX_LIST_TITLE_LEN) {
                        throw new InvalidArgumentException('list title required');
                    }
                    $stmt = $pdo->prepare(
                        'UPDATE ft_lists SET title = :title, updated_at = :now
                         WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL'
                    );
                    $stmt->execute([':title' => $title, ':now' => $now, ':id' => $id, ':family_id' => $familyId]);
                    if ($stmt->rowCount() === 0) {
                        throw new InvalidArgumentException('list not found');
                    }
                    $sel = $pdo->prepare('SELECT * FROM ft_lists WHERE id = :id');
                    $sel->execute([':id' => $id]);
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'list', 'record' => ft_row_list($sel->fetch())];
                    continue;
                }
                if ($action === 'delete') {
                    $id = (int) ($data['id'] ?? 0);
                    $stmt = $pdo->prepare(
                        'UPDATE ft_lists SET deleted_at = :now, updated_at = :now
                         WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL'
                    );
                    $stmt->execute([':now' => $now, ':id' => $id, ':family_id' => $familyId]);
                    $sel = $pdo->prepare('SELECT * FROM ft_lists WHERE id = :id AND family_id = :family_id');
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $row = $sel->fetch();
                    if (!$row) {
                        throw new InvalidArgumentException('list not found');
                    }
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'list', 'record' => ft_row_list($row)];
                    continue;
                }
                throw new InvalidArgumentException('unsupported list op');
            }

            if ($type === 'list_item' || $type === 'listitem') {
                if ($action === 'create') {
                    $existing = ft_find_by_client_id('ft_list_items', $familyId, $clientId);
                    if ($existing) {
                        $results[] = ['index' => $index, 'ok' => true, 'idempotent' => true, 'type' => 'list_item', 'record' => ft_row_list_item($existing)];
                        continue;
                    }
                    $listId = ft_resolve_list_id($familyId, $data);
                    $listCheck = $pdo->prepare(
                        'SELECT id FROM ft_lists WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL'
                    );
                    $listCheck->execute([':id' => $listId, ':family_id' => $familyId]);
                    if (!$listCheck->fetch()) {
                        throw new InvalidArgumentException('list not found');
                    }
                    $text = trim((string) ($data['text'] ?? ''));
                    if ($text === '' || mb_strlen($text) > $FAMTALK_MAX_LIST_ITEM_LEN) {
                        throw new InvalidArgumentException('list item text required');
                    }
                    $checked = !empty($data['checked']) ? 1 : 0;
                    $qty = isset($data['qty']) ? trim((string) $data['qty']) : null;
                    if ($qty === '') {
                        $qty = null;
                    }
                    $assignee = isset($data['assigneeUserId']) ? (int) $data['assigneeUserId'] : null;
                    if ($assignee !== null && $assignee <= 0) {
                        $assignee = null;
                    }
                    $stmt = $pdo->prepare(
                        'INSERT INTO ft_list_items
                         (list_id, family_id, text, checked, qty, assignee_user_id, client_id, created_at, updated_at, deleted_at)
                         VALUES
                         (:list_id, :family_id, :text, :checked, :qty, :assignee_user_id, :client_id, :created_at, :updated_at, NULL)'
                    );
                    $stmt->execute([
                        ':list_id' => $listId,
                        ':family_id' => $familyId,
                        ':text' => $text,
                        ':checked' => $checked,
                        ':qty' => $qty,
                        ':assignee_user_id' => $assignee,
                        ':client_id' => $clientId,
                        ':created_at' => $now,
                        ':updated_at' => $now,
                    ]);
                    $id = (int) $pdo->lastInsertId();
                    $sel = $pdo->prepare('SELECT * FROM ft_list_items WHERE id = :id');
                    $sel->execute([':id' => $id]);
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'list_item', 'record' => ft_row_list_item($sel->fetch())];
                    continue;
                }
                if ($action === 'update') {
                    $id = (int) ($data['id'] ?? 0);
                    $sel = $pdo->prepare(
                        'SELECT * FROM ft_list_items WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL'
                    );
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $existing = $sel->fetch();
                    if (!$existing) {
                        throw new InvalidArgumentException('list item not found');
                    }
                    $text = array_key_exists('text', $data) ? trim((string) $data['text']) : (string) $existing['text'];
                    if ($text === '' || mb_strlen($text) > $FAMTALK_MAX_LIST_ITEM_LEN) {
                        throw new InvalidArgumentException('list item text invalid');
                    }
                    $checked = array_key_exists('checked', $data)
                        ? (!empty($data['checked']) ? 1 : 0)
                        : (int) $existing['checked'];
                    $qty = array_key_exists('qty', $data)
                        ? (trim((string) $data['qty']) ?: null)
                        : $existing['qty'];
                    $assignee = array_key_exists('assigneeUserId', $data)
                        ? (((int) $data['assigneeUserId']) > 0 ? (int) $data['assigneeUserId'] : null)
                        : ($existing['assignee_user_id'] !== null ? (int) $existing['assignee_user_id'] : null);

                    $upd = $pdo->prepare(
                        'UPDATE ft_list_items
                         SET text = :text, checked = :checked, qty = :qty, assignee_user_id = :assignee, updated_at = :now
                         WHERE id = :id AND family_id = :family_id'
                    );
                    $upd->execute([
                        ':text' => $text,
                        ':checked' => $checked,
                        ':qty' => $qty,
                        ':assignee' => $assignee,
                        ':now' => $now,
                        ':id' => $id,
                        ':family_id' => $familyId,
                    ]);
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'list_item', 'record' => ft_row_list_item($sel->fetch())];
                    continue;
                }
                if ($action === 'delete') {
                    $id = (int) ($data['id'] ?? 0);
                    $stmt = $pdo->prepare(
                        'UPDATE ft_list_items SET deleted_at = :now, updated_at = :now
                         WHERE id = :id AND family_id = :family_id AND deleted_at IS NULL'
                    );
                    $stmt->execute([':now' => $now, ':id' => $id, ':family_id' => $familyId]);
                    $sel = $pdo->prepare('SELECT * FROM ft_list_items WHERE id = :id AND family_id = :family_id');
                    $sel->execute([':id' => $id, ':family_id' => $familyId]);
                    $row = $sel->fetch();
                    if (!$row) {
                        throw new InvalidArgumentException('list item not found');
                    }
                    $results[] = ['index' => $index, 'ok' => true, 'type' => 'list_item', 'record' => ft_row_list_item($row)];
                    continue;
                }
                throw new InvalidArgumentException('unsupported list_item op');
            }

            throw new InvalidArgumentException('unknown type/op');
        } catch (InvalidArgumentException $e) {
            $pdo->rollBack();
            ft_json_error($e->getMessage(), 400, ['opIndex' => $index]);
        }
    }

    $pdo->commit();

    // Notify peers after persistence succeeds; never fail the client push.
    try {
        ft_notify_after_push($familyId, $user, $results, $ops);
    } catch (Throwable $notifyError) {
        error_log('FamTalk notify after push: ' . $notifyError->getMessage());
    }

    ft_json_ok([
        'results' => $results,
        'serverTime' => ft_iso(ft_now()),
        'familyId' => $familyId,
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    ft_json_error('Server error', 500, ['detail' => $e->getMessage()]);
}
