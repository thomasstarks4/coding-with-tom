import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build } from 'vite';

// Never copy machine-local credentials or mutable store data into a release.
const source = path.resolve('public');
const staging = await mkdtemp(path.join(tmpdir(), 'coding-with-tom-public-'));
try {
  await cp(source, staging, {
    recursive: true,
    filter: (file) => {
      const relative = path.relative(source, file).split(path.sep);
      const name = path.basename(file);
      return relative[0] !== 'store'
        && !/^config\.local\.php(?:$|\.)/i.test(name)
        && !/^\.env(?:$|\.)/i.test(name);
    },
  });
  await build({ publicDir: staging });
} finally {
  await rm(staging, { recursive: true, force: true });
}
