# FamTalk API — Hostinger setup

## 1. Database

1. In Hostinger hPanel → MySQL, create/use a database (can share the site’s existing DB).
2. phpMyAdmin → Import `schema.sql` from this folder (fresh install), **or** if tables already exist run:
   - `migrations/2026-07-16_ft_push_tokens.sql` for Expo push tokens
   - `migrations/2026-07-18_ft_list_items_category.sql` for grocery aisle/category
3. Tables are prefixed `ft_` so they won’t collide with other apps.

## 2. Config

```bash
cp config.local.php.example config.local.php
```

Fill `$FAMTALK_DB_*` (Hostinger usually uses `localhost` as host).

## 3. Deploy files

After `npm run build` from repo root, `dist/famtalk/` is included.
Upload site build to `public_html/`, **or** upload this `famtalk/` directory to `public_html/famtalk/`.

Ensure root `.htaccess` contains:

```apache
RewriteCond %{REQUEST_URI} ^/famtalk/api/ [NC]
RewriteRule ^ - [L]
```

## 4. Verify

`https://codingwithtom.com/famtalk/api/auth.php?action=me` without a token should return JSON `401` / missing token — not the React SPA HTML.

## 5. Push notifications (Expo) — required for real phone alerts

Phone permission alone is **not** enough. All of these must be true:

1. **Upload API** to `public_html/famtalk/api/` (at least `auth.php`, `helpers.php`, `push.php`, `config.php`).  
   `ft_push_tokens` is auto-created on first DB connect after deploy.
2. **EAS projectId** in the app (`npx eas login` then `npx eas init`).
3. **Firebase** `google-services.json` for `com.famtalk.app` + FCM V1 key uploaded via `eas credentials`.
4. **Rebuild/reinstall** the Android APK after steps 2–3 (native).

Until then, the app only polls for messages; Android will not show a system banner when the app is killed.

## 6. Mobile client

Give the RN project `docs/FAMTALK_RN_HANDOFF.md`.
