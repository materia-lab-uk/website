import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });

const svgPath = join(__dirname, 'static', 'og-image.svg');
await page.goto(`file://${svgPath}`);
await page.screenshot({ path: join(__dirname, 'static', 'og-image.png'), type: 'png' });

await browser.close();
console.log('Generated static/og-image.png');
