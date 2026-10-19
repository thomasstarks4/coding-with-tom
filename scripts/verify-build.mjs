import { readdir, access, readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
for (const name of ['index.html', '.htaccess', 'robots.txt', 'sitemap.xml', 'famtalk/api/auth.php', 'famtalk/api/push.php', 'famtalk/api/.htaccess']) {
  await access(path.join('dist', name));
}
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    assert(!/^config\.local\.php(?:$|\.)|^\.env(?:$|\.)/i.test(entry.name), 'Private config in build: ' + entry.name);
    assert(!(dir === 'dist' && entry.name === 'store'), 'Store runtime data in build');
    if (entry.isDirectory()) await walk(path.join(dir, entry.name));
    if (entry.isFile() && entry.name.endsWith('.css')) {
      const cssPath = path.join(dir, entry.name);
      const css = await readFile(cssPath, 'utf8');
      for (const [, raw] of css.matchAll(/url\(([^)]+)\)/g)) {
        const url = raw.trim().replace(/^['"]|['"]$/g, '');
        if (/^(data:|https?:|#|\/\/)/.test(url)) continue;
        const file = decodeURIComponent(url.split(/[?#]/)[0]);
        await access(file.startsWith('/') ? path.join('dist', file) : path.resolve(dir, file));
      }
    }
  }
}
await walk('dist');
const html = await readFile('dist/index.html', 'utf8');
assert(!html.includes('/src/'), 'Unbuilt source entrypoint');
for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) await access(path.join('dist', asset));
console.log('Release verified: compiled assets, Apache routes, API files, and no local credentials/store data.');
