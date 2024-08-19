import dayjs from 'dayjs';
import { queryEventTypes } from './event-types';
import { createMobilePage } from './helper';

import type { LuckType } from './types';

interface QueryMonthlyLuckyDaysParams {
  /**
   * 吉日类型，如 '开市'、'嫁娶' 等
   */
  eventType: string;
  /**
   * 宜或忌
   */
  luckType?: LuckType;
  /**
   * 月份，格式为 'YYYY-MM'
   */
  month?: string;
}

interface DailyLuck {
  /**
   * 宜
   */
  favorable: string[];
  /**
   * 忌
   */
  unfavorable: string[];
}

interface LuckyDay {
  /**
   * 日期，格式为 'YYYY-MM-DD'
   */
  day: string;
  /**
   * 宜忌
   */
  luck: DailyLuck;
}

export async function queryMonthlyLuckyDays(params: QueryMonthlyLuckyDaysParams) {
  if (params.month && !dayjs(params.month).isValid()) {
    throw new Error('月份格式有误，应为 YYYY-MM');
  }
  const date = dayjs(params.month);
  params.luckType ??= 'favorable';
  const eventTypes = await queryEventTypes();
  const eventTypeId = eventTypes[params.eventType];
  if (!eventTypeId) {
    throw new Error(`类型 ${params.eventType} 不存在，请检查输入，应在 ${Object.keys(eventTypes).join('、')} 中选择`);
  }
  const { page, browser } = await createMobilePage();
  await page.goto(
    `https://m.huangli.com/hdjr/${params.luckType === 'favorable' ? 'yi' : 'ji'}/${eventTypeId}_${date.format('YYYY_M')}.html`,
  );

  await page.waitForSelector('.luckyday');

  const days = await page.evaluate(() => {
    const result: {
      dayNumber: number;
      luck: DailyLuck;
    }[] = [];
    document.querySelectorAll('.luckyday .sy').forEach((item) => {
      const dayNumber = parseInt(item.querySelector('.sy_rq em')?.textContent ?? '', 10);
      const luck: DailyLuck = {
        favorable: [],
        unfavorable: [],
      };
      item.querySelectorAll('.sy_sy dl').forEach((dl) => {
        const goodOrBadTitle = dl.querySelector('dt')?.textContent;
        const goodOrBadContent = Array.from(dl.querySelectorAll('dd a')).map((item) => item.textContent ?? '');
        if (goodOrBadTitle === '宜') {
          luck.favorable = goodOrBadContent;
        } else if (goodOrBadTitle === '忌') {
          luck.unfavorable = goodOrBadContent;
        }
      });
      result.push({ dayNumber, luck });
    });
    return result;
  });

  await browser.close();

  return days.map<LuckyDay>(({ dayNumber, luck }) => ({
    day: date.set('date', dayNumber).format('YYYY-MM-DD'),
    luck,
  }));
}
