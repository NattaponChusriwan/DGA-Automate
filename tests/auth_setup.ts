import { chromium, expect } from '@playwright/test';
import fs from 'fs';
import variable from '../variable/data.json' assert { type: 'json' };

export default async () => {
  if (fs.existsSync('auth.json')) {
    console.log('🔐 auth.json exists — skip login');
    return;
  }
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

 await page.goto('https://uat-ucportal.oneemail.info/');
 await page.waitForTimeout(3000);
await page.getByRole('banner').getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

  await page.locator('input[placeholder="กรอกอีเมล"]')
    .fill(variable.GlobalAdmin.username);

  await page.locator('input[placeholder="รหัสผ่าน"]')
    .fill(variable.GlobalAdmin.password);

  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

  await expect(
    page.getByRole('heading', { name: 'Verify Two Factor Authentication' })
  ).toBeVisible();
  await page.pause();
  await context.storageState({ path: 'auth.json' });
  await browser.close();
};
