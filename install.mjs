import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);

try {
  const puppeteerInstall = require.resolve('puppeteer/install.mjs');
  if (puppeteerInstall) {
    execSync(`node ${puppeteerInstall}`, {
      env: {
        ...process.env,
        PUPPETEER_CHROME_DOWNLOAD_BASE_URL: 'https://cdn.npmmirror.com/binaries/chrome-for-testing',
      },
      stdio: 'inherit',
    });
  }
} catch (error) {}
