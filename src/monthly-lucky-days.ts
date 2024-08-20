import dayjs from 'dayjs';
import { queryEventTypes } from './event-types';
import { getUrlDocument } from './helper';

import type { LuckType } from './types';

export interface QueryMonthlyLuckyDaysParams {
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

export interface DailyLuck {
  /**
   * 宜
   */
  favorable: string[];
  /**
   * 忌
   */
  unfavorable: string[];
}

export interface LuckyDay {
  /**
   * 日期，格式为 'YYYY-MM-DD'
   */
  day: string;
  /**
   * 宜忌
   */
  luck: DailyLuck;
}

export async function queryMonthlyLuckyDays({
  eventType,
  luckType = 'favorable',
  month = dayjs().format('YYYY-MM'),
}: QueryMonthlyLuckyDaysParams) {
  const date = dayjs(month);
  if (!dayjs().isValid()) {
    throw new Error('月份格式有误，应为 YYYY-MM');
  }

  const eventTypes = await queryEventTypes();
  const eventTypeId = eventTypes[eventType];
  if (!eventTypeId) {
    throw new Error(`类型 ${eventType} 不存在，请检查输入，应在 ${Object.keys(eventTypes).join('、')} 中选择`);
  }

  const document = await getUrlDocument(
    `/hdjr/${luckType === 'favorable' ? 'yi' : 'ji'}/${eventTypeId}_${date.format('YYYY_M')}.html`,
  );

  return Array.from(document.querySelectorAll('.luckyday .sy')).map((item): LuckyDay => {
    const dayNumber = parseInt(item.querySelector('.sy_rq em')?.textContent || '', 10);
    if (isNaN(dayNumber)) {
      throw new Error('无法解析日期');
    }

    const luck: DailyLuck = { favorable: [], unfavorable: [] };
    item.querySelectorAll('.sy_sy dl').forEach((dl) => {
      const title = dl.querySelector('dt')?.textContent;
      const content = Array.from(dl.querySelectorAll('dd a')).map((a) => a.textContent || '');
      if (title === '宜') luck.favorable = content;
      else if (title === '忌') luck.unfavorable = content;
    });

    return {
      day: date.date(dayNumber).format('YYYY-MM-DD'),
      luck,
    };
  });
}
