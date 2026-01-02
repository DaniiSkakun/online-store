import { chromium } from 'playwright';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  fs.mkdirSync('./artifacts', { recursive: true });
  await page.screenshot({ path: './artifacts/home.png', fullPage: true });
  await browser.close();
})();
