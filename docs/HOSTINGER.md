# Hostinger deployment

## Repository status

The math quiz plan is implemented on master: presets, custom quizzes, all three attempt modes, results, persistence, and Learning Hub links. FamTalk adds grocery categories and corrects native PDO delete parameters. Its database migration and real Android/Expo delivery still need verification on the hosting/mobile environment.

## React build settings

- Repository: thomasstarks4/coding-with-tom
- Source branch: master
- Root: repository root
- Node: 22
- Install: npm ci
- Build: npm run build
- Output: dist

The build excludes private config.local.php files and store runtime data. Keep credentials on the server. The Progress Tracker backend is server-managed and not in this repository; preserve /progress-tracker/api during deployment. The store is disabled and excluded from releases.

GitHub Actions runs tests, PHP syntax checks, a production build, and output safety checks on master and pull requests. Its hostinger-site artifact contains the contents to deploy, including .htaccess.

## PHP/shared hosting: Advanced > Git

This mode copies repository files; it does not turn the React source into a production site. Do not point public_html at the source master branch. Deploy the contents of the hostinger-site artifact (or local dist) to public_html, preserving existing server configuration and APIs. For automated Git deployment, publish those built contents to a dedicated deployment branch and select that branch in hPanel. The configured hosting mode/branch must be confirmed before enabling this automation.

## Node.js / React integration

Use the React build settings above. PHP endpoints need a PHP-capable hosting environment; do not assume a Node runtime will execute them. Verify /famtalk/api/auth.php?action=me and the Progress Tracker API before switching an existing PHP-backed site to this hosting mode.

## FamTalk release prerequisite

On an existing database, run public/famtalk/api/migrations/2026-07-18_ft_list_items_category.sql once BEFORE deploying the new API. Confirm category does not already exist before running it. Fresh installs use schema.sql. Do not reimport the full schema over an existing database.

Keep famtalk/api/config.local.php on the server (or configure the supported environment variables). For Expo push tokens and Android setup see public/famtalk/api/DEPLOY.md. No production database migration is run by CI.

## Verify after deployment

- Homepage, /projects, /math/quiz and a refreshed deep link render.
- Math quiz preset and custom quizzes work in each attempt mode; improved scores persist.
- /famtalk/api/auth.php?action=me returns JSON 401 without a token.
- Existing Progress Tracker login and project requests still work.
- Test FamTalk category create/update/pull/delete with an authorized test account, then phone notification delivery.

References: https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/ and https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
