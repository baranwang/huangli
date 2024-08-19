import path from 'node:path';
import { createMobilePage } from './helper';

export async function queryEventTypes() {
  try {
    const { page, browser } = await createMobilePage();
    await page.goto('https://m.huangli.com/hdjr/yi/');

    await page.waitForSelector('.jiri1');

    const list = await page.evaluate(() => {
      const list = document.querySelectorAll('.jiri1 .jiri_box .ind_fk a');
      return Array.from(list).reduce(
        (acc, item) => {
          const text = item.textContent;
          const href = item.getAttribute('href');
          if (text && href) {
            acc[text] = href;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
    });

    const result = Object.fromEntries(
      Object.entries(list).map(([key, value]) => {
        const [id] = path.basename(value).split('_');
        return [key, id];
      }),
    );
    await browser.close();
    return result;
  } catch (error) {
    throw new Error(`获取类型失败：${(error as Error).message}`);
  }
}
